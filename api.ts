/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
/* tslint:disable */

import {FunctionDeclaration, GoogleGenAI, File, GenerateContentResponse} from '@google/genai';

const MODEL_NAME = 'gemini-2.5-flash-preview-04-17';

// Check if API key is available
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
if (!apiKey) {
  throw new Error('VITE_GEMINI_API_KEY environment variable is not set. Please add it to your .env.local file.');
}

const client = new GoogleGenAI({apiKey});

async function generateContentWithFunctionCall(
  promptText: string,
  functionDeclarations: FunctionDeclaration[],
  videoFile: File,
): Promise<GenerateContentResponse> {
  const systemInstruction = `You are an expert AI fight analyst. 
Your task is to analyze fighters in the provided video based on the user's specific instructions in their prompt.
- If the user asks you to identify fighters, provide distinct names and visual descriptions for each, then call the 'set_identified_fighters' function.
- If the user asks you to analyze attributes for a specific, named fighter:
    - Consider all provided information (their name, description, and reported gear).
    - Your internal process MUST be sequential:
        1.  **Punch Estimation & Accuracy Calculation**:
            *   Estimate total punches thrown.
            *   Estimate punches landed effectively.
            *   Calculate accuracy percentage ((landed/thrown)*100, rounded to one decimal; 0 if thrown is 0).
        2.  **Defensive Metrics Estimation & Calculation**:
            *   Estimate total significant offensive attacks faced (attacks_faced).
            *   Estimate how many were successfully defended (attacks_defended).
            *   Calculate defense effectiveness percentage ((defended/faced)*100, rounded to one decimal; 0 if faced is 0).
        3.  **Attribute Ratings and Qualitative Judgments**:
            *   For each of the six core attributes (Power, Defense, Accuracy, Ring Generalship, Fight IQ, Footwork), provide BOTH a numerical rating on a scale of 1-100 (1=poor, 100=excellent) AND a concise, one-sentence qualitative judgment.
            *   The qualitative judgment MUST complement the numerical score and be consistently phrased.
            *   The numerical 'Accuracy Rating' MUST be informed by (but is distinct from) the 'accuracy_percentage'.
            *   The numerical 'Defense Rating' MUST be informed by (but is distinct from) the 'defense_effectiveness_percentage'.
            *   All other numerical ratings (Power, Ring Generalship, Fight IQ, Footwork) should be based on holistic observation.
        4.  **Overall Rating Calculation**:
            *   Based on all individual attribute ratings, calculated percentages, and your overall assessment, derive a single 'overall_rating' (1-100).
    - Call the 'set_fighter_attributes' function, providing all estimated numerical metrics (punches_thrown, punches_landed, accuracy_percentage, attacks_faced, attacks_defended, defense_effectiveness_percentage), all qualitative assessments, all numerical attribute ratings (1-100), and the 'overall_rating' (1-100).
Adhere to an objective and consistent phrasing style for all qualitative ratings. Avoid overly varied or subjective language. Follow the prompt's instructions carefully and call the function specified.`;
  
  const response = await client.models.generateContent({
    model: MODEL_NAME,
    contents: [
      {
        role: 'user',
        parts: [
          {text: promptText},
          {
            fileData: {
              mimeType: videoFile.mimeType,
              fileUri: videoFile.uri,
            },
          },
        ],
      },
    ],
    config: {
      systemInstruction,
      temperature: 0.3, 
      tools: [{functionDeclarations}],
    },
  });

  return response;
}

async function generateTextOnly(promptText: string): Promise<string> {
  const systemInstruction = `You are an objective AI fight commentator. Your goal is to provide a consistent and factual determination of the winner based *only* on the detailed analysis data provided in the prompt. 
Avoid speculative language. 
State the winner clearly and concisely in the specified format. 
Your explanation should be very brief, direct, and strictly based on the key differentiating factors from the data provided, such as overall ratings or significant differences in key attribute scores.`;

  const response = await client.models.generateContent({
    model: MODEL_NAME,
    contents: [{role: 'user', parts: [{text: promptText}]}],
    config: {
      systemInstruction,
      temperature: 0.1, // Lowered for more deterministic and consistent output
    },
  });
  
  return response.text;
}


async function uploadFile(inputFile: globalThis.File): Promise<File> {
  const blob = new Blob([inputFile], {type: inputFile.type});

  console.log('Uploading...');
  const uploadedFile = await client.files.upload({
    file: blob,
    config: {
      displayName: inputFile.name,
    },
  });
  console.log('Uploaded file:', uploadedFile.name);
  
  let getFile = await client.files.get({
    name: uploadedFile.name,
  });

  const MAX_RETRIES = 5;
  let retries = 0;
  // Adjusted to wait up to 1 minute for active state, with increasing delay
  const initialDelay = 5000; // 5 seconds
  const maxDelay = 20000; // 20 seconds
  let currentDelay = initialDelay;

  while (getFile.state === 'PROCESSING' && retries < MAX_RETRIES * (maxDelay/initialDelay) ) { // effectively more retries if delays are shorter
    console.log(`Current file status: ${getFile.state}. Retrying in ${currentDelay / 1000} seconds... (Attempt ${retries + 1})`);
    await new Promise((resolve) => {
      setTimeout(resolve, currentDelay);
    });
    getFile = await client.files.get({
      name: uploadedFile.name,
    });
    retries++;
    currentDelay = Math.min(maxDelay, currentDelay + initialDelay); // Increase delay, cap at maxDelay
  }
  
  console.log('Final file status:', getFile.state);
  if (getFile.state === 'FAILED') {
    console.error('File processing failed:', getFile);
    throw new Error(`File processing failed for ${inputFile.name}. State: ${getFile.state}. Error: ${getFile.error?.message}`);
  }
  if (getFile.state === 'PROCESSING') {
     console.warn(`File ${inputFile.name} is still processing after multiple retries. Proceeding, but analysis might fail or be delayed.`);
  }
  if (getFile.state !== 'ACTIVE' && getFile.state !== 'PROCESSING') { // PROCESSING is handled above
    console.warn(`File ${inputFile.name} is not in ACTIVE state (current: ${getFile.state}). Analysis might be impacted.`);
  }

  console.log('File ready for use:', getFile.name, 'State:', getFile.state);
  return getFile;
}

export {generateContentWithFunctionCall, generateTextOnly, uploadFile};