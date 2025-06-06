/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
/* tslint:disable */
// Copyright 2024 Google LLC

// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at

//     https://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import c from 'classnames';
import {useState, useCallback, useEffect, useRef} from 'react';
import {generateContentWithFunctionCall, generateTextOnly, uploadFile} from './api';
import getFunctionDeclarations from './functions';
import VideoPlayer from './VideoPlayer.tsx';
import type {File as GenAIFile} from '@google/genai';

interface FighterAttributes {
  name: string;
  power: string;
  powerRating: number;
  defense: string;
  defenseRating: number;
  accuracy: string;
  accuracyRating: number;
  ringGeneralship: string;
  ringGeneralshipRating: number;
  fightIQ: string;
  fightIQRating: number;
  footwork: string;
  footworkRating: number;
  overallRating: number;
  punchesThrown: number;
  punchesLanded: number;
  accuracyPercentage: number;
  attacksFaced: number;
  attacksDefended: number;
  defenseEffectivenessPercentage: number;
}

interface IdentifiedFighter {
  name: string;
  description1: string;
  description2: string;
}

interface FighterGear {
  headGear: boolean;
  groinGuard: boolean;
}

type AnalysisStage =
  | 'idle'
  | 'identifyingFighters'
  | 'awaitingGearInput'
  | 'analyzingAttributes'
  | 'determiningWinner'
  | 'analysisComplete';

// Argument types for AI function calls
interface SetIdentifiedFightersFunctionArgs {
  fighter1_name: string;
  fighter1_description1: string;
  fighter1_description2: string;
  fighter2_name: string;
  fighter2_description1: string;
  fighter2_description2: string;
}

interface SetFighterAttributesFunctionArgs {
  fighter_id: string;
  fighter_name: string;
  punches_thrown: number;
  punches_landed: number;
  accuracy_percentage: number;
  attacks_faced: number;
  attacks_defended: number;
  defense_effectiveness_percentage: number;
  power: string;
  power_rating: number;
  defense: string;
  defense_rating: number;
  accuracy: string;
  accuracy_rating: number;
  ring_generalship: string;
  ring_generalship_rating: number;
  fight_iq: string;
  fight_iq_rating: number;
  footwork: string;
  footwork_rating: number;
  overall_rating: number;
}

export default function App() {
  const [sparringVidUrl, setSparringVidUrl] = useState<string | null>(null);
  const [sparringVideoFile, setSparringVideoFile] = useState<GenAIFile | null>(null);

  const [analysisStage, setAnalysisStage] = useState<AnalysisStage>('idle');

  const [identifiedFighter1, setIdentifiedFighter1] = useState<IdentifiedFighter | null>(null);
  const [identifiedFighter2, setIdentifiedFighter2] = useState<IdentifiedFighter | null>(null);

  const [fighter1Attributes, setFighter1Attributes] = useState<FighterAttributes | null>(null);
  const [fighter2Attributes, setFighter2Attributes] = useState<FighterAttributes | null>(null);

  const [fighter1Gear, setFighter1Gear] = useState<FighterGear>({ headGear: false, groinGuard: false });
  const [fighter2Gear, setFighter2Gear] = useState<FighterGear>({ headGear: false, groinGuard: false });

  const [winner, setWinner] = useState<string | null>(null);

  const [isLoadingVideo, setIsLoadingVideo] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [theme] = useState(
    window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
  );

  const resetAnalysisState = () => {
    setIdentifiedFighter1(null);
    setIdentifiedFighter2(null);
    setFighter1Attributes(null);
    setFighter2Attributes(null);
    setWinner(null);
    setError(null);
    setAnalysisStage(sparringVideoFile ? 'idle' : 'idle');
    setFighter1Gear({ headGear: false, groinGuard: false });
    setFighter2Gear({ headGear: false, groinGuard: false });
  };

  const resetFileUploadState = () => {
    setSparringVidUrl(null);
    setSparringVideoFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    resetAnalysisState();
    setAnalysisStage('idle');
  }

  const processFile = async (file: globalThis.File) => {
    if (!file) return;

    resetFileUploadState();

    setIsLoadingVideo(true);
    setSparringVidUrl(URL.createObjectURL(file));
    setError(null);

    try {
      const uploadedFile = await uploadFile(file);
      setSparringVideoFile(uploadedFile);
      setAnalysisStage('idle');
    } catch (e) {
      console.error('Error uploading file:', e);
      setError(`Error uploading video. Please try again.`);
      resetFileUploadState();
    } finally {
      setIsLoadingVideo(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const file = event.dataTransfer.files[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const functionCallbackMap = {
    set_identified_fighters: (args: SetIdentifiedFightersFunctionArgs) => {
      setIdentifiedFighter1({ name: args.fighter1_name, description1: args.fighter1_description1, description2: args.fighter1_description2 });
      setIdentifiedFighter2({ name: args.fighter2_name, description1: args.fighter2_description1, description2: args.fighter2_description2 });
      setAnalysisStage('awaitingGearInput');
      setIsLoading(false);
    },
    set_fighter_attributes: (args: SetFighterAttributesFunctionArgs) => {
      const {
        fighter_id,
        fighter_name,
        punches_thrown,
        punches_landed,
        accuracy_percentage,
        attacks_faced,
        attacks_defended,
        defense_effectiveness_percentage,
        power,
        power_rating,
        defense,
        defense_rating,
        accuracy,
        accuracy_rating,
        ring_generalship,
        ring_generalship_rating,
        fight_iq,
        fight_iq_rating,
        footwork,
        footwork_rating,
        overall_rating
      } = args;
      const attributes: FighterAttributes = {
        name: (fighter_id === 'fighter1' ? identifiedFighter1?.name : identifiedFighter2?.name) || fighter_name,
        punchesThrown: punches_thrown,
        punchesLanded: punches_landed,
        accuracyPercentage: accuracy_percentage,
        attacksFaced: attacks_faced,
        attacksDefended: attacks_defended,
        defenseEffectivenessPercentage: defense_effectiveness_percentage,
        power,
        powerRating: power_rating,
        defense,
        defenseRating: defense_rating,
        accuracy,
        accuracyRating: accuracy_rating,
        ringGeneralship: ring_generalship,
        ringGeneralshipRating: ring_generalship_rating,
        fightIQ: fight_iq,
        fightIQRating: fight_iq_rating,
        footwork,
        footworkRating: footwork_rating,
        overallRating: overall_rating
      };
      if (fighter_id === 'fighter1') {
        setFighter1Attributes(attributes);
      } else if (fighter_id === 'fighter2') {
        setFighter2Attributes(attributes);
      }
    },
  };

  const functionDeclarations = getFunctionDeclarations(); 

  const handleIdentifyFighters = async () => {
    if (!sparringVideoFile) {
      setError("Please upload a sparring video first.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setAnalysisStage('identifyingFighters');
    setFighter1Attributes(null);
    setFighter2Attributes(null);
    setWinner(null);

    const promptText = `Analyze the provided sparring video. Identify two distinct primary combatants.
For the first combatant:
1. Provide a short, descriptive name based on one clear visual feature (e.g., 'Fighter in Red Gloves', 'Taller Fighter with Blue Shorts').
2. Provide a first one-sentence visual description of a distinguishing feature (e.g., 'Wears red boxing gloves and black shorts.').
3. Provide a second, different one-sentence visual description of another distinguishing feature (e.g., 'Appears to have an orthodox stance.').

For the second combatant:
1. Provide a distinct short, descriptive name based on their visual features.
2. Provide their first one-sentence visual description.
3. Provide their second, different one-sentence visual description.

Ensure the names and descriptions clearly differentiate the two fighters.
Call the "set_identified_fighters" function with fighter1_name, fighter1_description1, fighter1_description2, fighter2_name, fighter2_description1, and fighter2_description2.`;

    try {
      const response = await generateContentWithFunctionCall(promptText, functionDeclarations, sparringVideoFile);
      const call = response.functionCalls?.[0];
      if (call && call.name === 'set_identified_fighters' && functionCallbackMap.set_identified_fighters) {
        functionCallbackMap.set_identified_fighters(call.args as unknown as SetIdentifiedFightersFunctionArgs);
      } else {
        const modelResponseText = response.text ? ` Model response: ${response.text}` : '';
        const calledFunctionName = call?.name ? ` Called function: ${call.name}.` : '';
        throw new Error(`AI did not call the 'set_identified_fighters' function as expected.${calledFunctionName}${modelResponseText}`);
      }
    } catch (e) {
      console.error('Error identifying fighters:', e);
      setError(`Error identifying fighters. ${(e as Error).message}`);
      setAnalysisStage('idle');
      setIsLoading(false);
    }
  };

  const analyzeSingleFighterAttributes = async (
    fighterId: 'fighter1' | 'fighter2',
    identifiedFighter: IdentifiedFighter,
    gear: FighterGear,
    videoFile: GenAIFile
  ) => {
    const gearInfo = `This fighter (${identifiedFighter.name}, described as: '${identifiedFighter.description1}' and '${identifiedFighter.description2}') is reported to be wearing head gear: ${gear.headGear ? 'Yes' : 'No'} and a groin guard: ${gear.groinGuard ? 'Yes' : 'No'}.`;

    const promptText = `You are analyzing ${identifiedFighter.name} (described as: "${identifiedFighter.description1}" AND "${identifiedFighter.description2}") in the provided sparring video.
${gearInfo}

Your analysis process for this fighter MUST be as follows:
1.  **Punch Estimation**: Based on observable glove movement and engagement, estimate the total number of punches thrown by this fighter.
2.  **Landed Punch Estimation**: Considering reported gear (especially head gear for head shots and effectiveness of strikes), estimate the number of punches that landed effectively.
3.  **Accuracy Calculation**: Calculate the accuracy percentage using the formula: (punches_landed / punches_thrown) * 100. If punches_thrown is 0, the accuracy_percentage is 0. Round the result to one decimal place.
4.  **Defensive Metrics Estimation**:
    *   Estimate the total number of significant offensive attacks directed at this fighter by their opponent (attacks_faced).
    *   From those attacks faced, estimate how many this fighter successfully defended through blocks, parries, evasions, or other defensive maneuvers (attacks_defended).
5.  **Defense Effectiveness Calculation**: Calculate the defense effectiveness percentage using the formula: (attacks_defended / attacks_faced) * 100. If attacks_faced is 0, the defense_effectiveness_percentage is 0. Round the result to one decimal place.

6.  **Attribute Ratings and Qualitative Judgments**: For each of the following attributes, provide BOTH a numerical rating on a scale of 1-100 (where 1 is poor and 100 is excellent) AND a concise, one-sentence qualitative judgment. The qualitative judgment should be consistently phrased and complement the numerical score. The numerical score should be based on your holistic observation and the data you've already processed.
    *   **Power**: (Numerical Rating 1-100) and (Qualitative: e.g., "Exhibited strong and impactful power.")
    *   **Defense**: (Numerical Rating 1-100, informed by but distinct from defense_effectiveness_percentage) and (Qualitative: e.g., "Showed effective defensive maneuvers and awareness.", informed by defense_effectiveness_percentage and overall observation of ability to mitigate damage, use defensive techniques, and maintain composure).
    *   **Accuracy**: (Numerical Rating 1-100, informed by but distinct from accuracy_percentage) and (Qualitative: e.g., "Demonstrated good precision in landing shots.", informed by accuracy_percentage and overall observation of precision, control, and effectiveness of landed shots).
    *   **Ring Generalship**: (Numerical Rating 1-100) and (Qualitative: e.g., "Effectively controlled the ring space and dictated the pace.")
    *   **Fight IQ**: (Numerical Rating 1-100) and (Qualitative: e.g., "Displayed strong strategic thinking and adapted well.")
    *   **Footwork**: (Numerical Rating 1-100) and (Qualitative: e.g., "Utilized agile and balanced footwork to create angles.")

7.  **Overall Rating Calculation**: Based on all the individual attribute ratings (Power, Defense, Accuracy, Ring Generalship, Fight IQ, Footwork), the calculated percentages (Accuracy Percentage, Defense Effectiveness Percentage), and your overall assessment of the fighter's performance, derive a single **overall_rating** for this fighter on a scale of 1-100.

Call the "set_fighter_attributes" function with ALL the following parameters:
- fighter_id: "${fighterId}"
- fighter_name: "${identifiedFighter.name}"
- punches_thrown: (Your estimated number)
- punches_landed: (Your estimated number)
- accuracy_percentage: (Your calculated percentage)
- attacks_faced: (Your estimated number)
- attacks_defended: (Your estimated number)
- defense_effectiveness_percentage: (Your calculated percentage)
- power: (Your qualitative assessment)
- power_rating: (Your numerical rating 1-100)
- defense: (Your qualitative assessment)
- defense_rating: (Your numerical rating 1-100)
- accuracy: (Your qualitative assessment)
- accuracy_rating: (Your numerical rating 1-100)
- ring_generalship: (Your qualitative assessment)
- ring_generalship_rating: (Your numerical rating 1-100)
- fight_iq: (Your qualitative assessment)
- fight_iq_rating: (Your numerical rating 1-100)
- footwork: (Your qualitative assessment)
- footwork_rating: (Your numerical rating 1-100)
- overall_rating: (Your derived overall rating 1-100)

Ensure all values are provided to the function call.`;

    try {
      const response = await generateContentWithFunctionCall(promptText, functionDeclarations, videoFile);
      const call = response.functionCalls?.[0];
      if (call && call.name === 'set_fighter_attributes' && functionCallbackMap.set_fighter_attributes) {
        functionCallbackMap.set_fighter_attributes(call.args as unknown as SetFighterAttributesFunctionArgs);
      } else {
        throw new Error(`AI did not call 'set_fighter_attributes' for ${identifiedFighter.name}. Model response: ${response.text}`);
      }
    } catch (e) {
      console.error(`Error analyzing attributes for ${identifiedFighter.name}:`, e);
      setError(`Error analyzing attributes for ${identifiedFighter.name}. ${(e as Error).message}`);
      throw e;
    }
  };

  const handleAnalyzeSparringWithGear = async () => {
    if (!sparringVideoFile || !identifiedFighter1 || !identifiedFighter2) {
      setError("Fighters not identified or video not available.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setAnalysisStage('analyzingAttributes');
    setFighter1Attributes(null);
    setFighter2Attributes(null);
    setWinner(null);

    try {
      await analyzeSingleFighterAttributes('fighter1', identifiedFighter1, fighter1Gear, sparringVideoFile);
      await analyzeSingleFighterAttributes('fighter2', identifiedFighter2, fighter2Gear, sparringVideoFile);
      // Winner determination will be triggered by useEffect
    } catch (e) {
      setAnalysisStage('awaitingGearInput');
    } finally {
      // setIsLoading handled by individual calls, or determineWinner
    }
  };

  useEffect(() => {
    if (analysisStage === 'analyzingAttributes' && fighter1Attributes && fighter2Attributes && !winner) {
      determineWinner();
    }
  }, [fighter1Attributes, fighter2Attributes, analysisStage, winner]);


  const determineWinner = async () => {
    if (!fighter1Attributes || !fighter2Attributes || !identifiedFighter1 || !identifiedFighter2) return;

    setAnalysisStage('determiningWinner');
    setIsLoading(true);
    setError(null);

    const prompt = `You are an objective AI fight commentator. Based on the following detailed analyses of two fighters from a sparring session:

Fighter 1 (AI-assigned name: ${identifiedFighter1.name}, Overall Rating: ${fighter1Attributes.overallRating}/100):
- Power: ${fighter1Attributes.power} (${fighter1Attributes.powerRating}/100)
- Defense: ${fighter1Attributes.defense} (${fighter1Attributes.defenseRating}/100) (Def. Eff: ${fighter1Attributes.defenseEffectivenessPercentage.toFixed(1)}%)
- Accuracy: ${fighter1Attributes.accuracy} (${fighter1Attributes.accuracyRating}/100) (Acc. Pct: ${fighter1Attributes.accuracyPercentage.toFixed(1)}%)
- Ring Generalship: ${fighter1Attributes.ringGeneralship} (${fighter1Attributes.ringGeneralshipRating}/100)
- Fight IQ: ${fighter1Attributes.fightIQ} (${fighter1Attributes.fightIQRating}/100)
- Footwork: ${fighter1Attributes.footwork} (${fighter1Attributes.footworkRating}/100)
(Reported gear: Head Gear ${fighter1Gear.headGear ? 'Yes' : 'No'}, Groin Guard ${fighter1Gear.groinGuard ? 'Yes' : 'No'})

Fighter 2 (AI-assigned name: ${identifiedFighter2.name}, Overall Rating: ${fighter2Attributes.overallRating}/100):
- Power: ${fighter2Attributes.power} (${fighter2Attributes.powerRating}/100)
- Defense: ${fighter2Attributes.defense} (${fighter2Attributes.defenseRating}/100) (Def. Eff: ${fighter2Attributes.defenseEffectivenessPercentage.toFixed(1)}%)
- Accuracy: ${fighter2Attributes.accuracy} (${fighter2Attributes.accuracyRating}/100) (Acc. Pct: ${fighter2Attributes.accuracyPercentage.toFixed(1)}%)
- Ring Generalship: ${fighter2Attributes.ringGeneralship} (${fighter2Attributes.ringGeneralshipRating}/100)
- Fight IQ: ${fighter2Attributes.fightIQ} (${fighter2Attributes.fightIQRating}/100)
- Footwork: ${fighter2Attributes.footwork} (${fighter2Attributes.footworkRating}/100)
(Reported gear: Head Gear ${fighter2Gear.headGear ? 'Yes' : 'No'}, Groin Guard ${fighter2Gear.groinGuard ? 'Yes' : 'No'})

Considering their overall ratings, individual attribute scores, calculated percentages, qualitative assessments, and reported gear, determine who likely won this sparring session.
The overall rating is a key summary.
Announce the winner strictly in the format 'Winner: Fighter 1', 'Winner: Fighter 2', or 'Result: Draw'.
Provide an extremely brief, one-sentence explanation for your decision, directly citing the 1-2 primary attribute(s) or the overall rating that led to the decision (e.g., 'due to a higher Overall Rating and superior Ring Generalship score', 'based on significantly better Accuracy Percentage and Fight IQ rating'). Be concise and objective.`;

    try {
      const responseText = await generateTextOnly(prompt);
      setWinner(responseText);
      setAnalysisStage('analysisComplete');
    } catch (e) {
      console.error('Error determining winner:', e);
      setError('Error determining winner.');
      setAnalysisStage('analyzingAttributes');
    } finally {
      setIsLoading(false);
    }
  };

  const renderFighterAnalysisDisplay = (
    fighterNum: 1 | 2,
    identifiedFighter: IdentifiedFighter | null,
    attributes: FighterAttributes | null
  ) => {
    const displayName = identifiedFighter?.name || `Fighter ${fighterNum}`;
    const isLoadingThisFighter = analysisStage === 'analyzingAttributes' &&
                                 ((fighterNum === 1 && !fighter1Attributes) || (fighterNum === 2 && !fighter2Attributes));

    return (
      <div
        className="fighter-analysis-section"
        role="region"
        aria-labelledby={`fighter-${fighterNum}-analysis-heading`}
      >
        <h3 id={`fighter-${fighterNum}-analysis-heading`}>{displayName} Performance Stats</h3>
        {isLoadingThisFighter && <div className="loading small-loading" role="status" aria-live="assertive">Analyzing {displayName}<span>...</span></div>}
        {attributes && !isLoadingThisFighter && (
          <div className="analysis-results">
            {identifiedFighter && (
              <div className="fighter-description-analysis">
                <p><em>Identified as: {identifiedFighter.description1}</em></p>
                <p><em>Also: {identifiedFighter.description2}</em></p>
              </div>
            )}
             <div className="attribute overall-score-container">
                <strong>Overall Rating:</strong>
                <span className="numeric overall-score">{attributes.overallRating}/100</span>
            </div>
            <div className="attribute">
                <strong>Power:</strong> {attributes.power}
                <span className="numeric">({attributes.powerRating}/100)</span>
            </div>
            <div className="attribute">
                <strong>Defense:</strong> {attributes.defense}
                <span className="numeric">({attributes.defenseRating}/100)</span>
            </div>
            <div className="attribute">
              <strong>Accuracy:</strong> {attributes.accuracy}
              <span className="numeric">({attributes.accuracyRating}/100)</span>
            </div>
            <div className="attribute">
                <strong>Ring Generalship:</strong> {attributes.ringGeneralship}
                <span className="numeric">({attributes.ringGeneralshipRating}/100)</span>
            </div>
            <div className="attribute">
                <strong>Fight IQ:</strong> {attributes.fightIQ}
                <span className="numeric">({attributes.fightIQRating}/100)</span>
            </div>
            <div className="attribute">
                <strong>Footwork:</strong> {attributes.footwork}
                <span className="numeric">({attributes.footworkRating}/100)</span>
            </div>
          </div>
        )}
        {!attributes && !isLoadingThisFighter && analysisStage !== 'identifyingFighters' && analysisStage !== 'idle' && (
             <p className="placeholder-text">Performance stats for {displayName} will appear here.</p>
        )}
      </div>
    );
  };

  const renderGearInput = (
    fighterNum: 1 | 2,
    identifiedFighter: IdentifiedFighter | null,
    gear: FighterGear,
    setGear: React.Dispatch<React.SetStateAction<FighterGear>>
  ) => {
    const fighterId = `fighter${fighterNum}`;
    const displayName = identifiedFighter?.name || `Fighter ${fighterNum}`;
    const isDisabled = analysisStage !== 'awaitingGearInput' && analysisStage !== 'idle';

    return (
      <div className="fighter-gear-input-section">
        <h4>{displayName} Gear</h4>
        {identifiedFighter && (
          <div className="fighter-description-gear-label">
            <p><em>({identifiedFighter.description1})</em></p>
            <p><em>({identifiedFighter.description2})</em></p>
          </div>
        )}
        <div className="gear-option">
          <label htmlFor={`${fighterId}-headgear`}>Wears Head Gear?</label>
          <div className="toggle-switch">
            <input
              type="checkbox"
              id={`${fighterId}-headgear`}
              checked={gear.headGear}
              onChange={(e) => setGear(prev => ({ ...prev, headGear: e.target.checked }))}
              disabled={isDisabled}
            />
            <label htmlFor={`${fighterId}-headgear`} className="slider"></label>
          </div>
        </div>
        <div className="gear-option">
          <label htmlFor={`${fighterId}-groinguard`}>Wears Groin Guard?</label>
           <div className="toggle-switch">
            <input
              type="checkbox"
              id={`${fighterId}-groinguard`}
              checked={gear.groinGuard}
              onChange={(e) => setGear(prev => ({ ...prev, groinGuard: e.target.checked }))}
              disabled={isDisabled}
            />
            <label htmlFor={`${fighterId}-groinguard`} className="slider"></label>
          </div>
        </div>
      </div>
    );
  };

  const getButtonText = () => {
    switch (analysisStage) {
      case 'idle':
        return sparringVideoFile ? 'Quick Analyze & Name Fighters' : 'Upload Video First';
      case 'identifyingFighters':
        return 'Identifying Fighters...';
      case 'awaitingGearInput':
        return 'Analyze Sparring with Gear & Stats';
      case 'analyzingAttributes':
        return 'Analyzing Performance Stats...';
      case 'determiningWinner':
        return 'Determining Winner...';
      case 'analysisComplete':
        return 'Start New Analysis';
      default:
        return 'Analyze';
    }
  };

  const handleMainButtonClick = () => {
    if (analysisStage === 'analysisComplete') {
      resetFileUploadState();
      return;
    }
    if (analysisStage === 'idle' && sparringVideoFile) {
      handleIdentifyFighters();
    } else if (analysisStage === 'awaitingGearInput') {
      handleAnalyzeSparringWithGear();
    }
  };

  const isButtonDisabled = () => {
    if (!sparringVideoFile && analysisStage === 'idle') return true;
    return analysisStage === 'identifyingFighters' ||
           analysisStage === 'analyzingAttributes' ||
           analysisStage === 'determiningWinner' ||
           isLoadingVideo;
  };

  return (
    <main className={c('fighter-analyzer-app', theme)}>
      <header>
        <h1>AI Fighter Analyzer</h1>
      </header>

      <section
        className="upload-section-container"
        aria-labelledby="upload-heading"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <h2 id="upload-heading" className="sr-only">Upload Sparring Video</h2>
        {!sparringVidUrl && !isLoadingVideo && (
          <div className="upload-area">
            <input
              type="file"
              id="videoUpload"
              accept="video/*"
              onChange={handleFileChange}
              style={{ display: 'none' }}
              ref={fileInputRef}
              aria-labelledby="upload-button-label"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="upload-button"
              id="upload-button-label"
              aria-controls="videoUpload"
            >
              <span className="icon">upload_file</span> Upload Sparring Video
            </button>
            <p>Or drag & drop video file here</p>
          </div>
        )}
        {isLoadingVideo && <div className="loading" role="status" aria-live="assertive">Processing video<span>...</span></div>}
      </section>

      {sparringVidUrl && (
        <section className="video-display-section" aria-label="Sparring Video Player">
          <VideoPlayer url={sparringVidUrl} />
        </section>
      )}

      {error && <div className="error-message" role="alert">{error}</div>}

      {analysisStage === 'identifyingFighters' && isLoading && (
        <div className="loading" role="status" aria-live="assertive">Identifying fighters<span>...</span></div>
      )}

      {(identifiedFighter1 && identifiedFighter2 && (analysisStage === 'awaitingGearInput' || analysisStage === 'analyzingAttributes' || analysisStage === 'determiningWinner' || analysisStage === 'analysisComplete')) && (
        <section className="identified-fighters-display" aria-labelledby="identified-fighters-heading">
          <h3 id="identified-fighters-heading">Identified Fighters</h3>
          <div className="fighter-id-card">
            <h4 className="fighter-id-card-name">Fighter 1: {identifiedFighter1.name}</h4>
            <p className="description-item"><em>Visual Cue 1: {identifiedFighter1.description1}</em></p>
            <p className="description-item"><em>Visual Cue 2: {identifiedFighter1.description2}</em></p>
          </div>
          <div className="fighter-id-card">
            <h4 className="fighter-id-card-name">Fighter 2: {identifiedFighter2.name}</h4>
            <p className="description-item"><em>Visual Cue 1: {identifiedFighter2.description1}</em></p>
            <p className="description-item"><em>Visual Cue 2: {identifiedFighter2.description2}</em></p>
          </div>
        </section>
      )}

      {sparringVideoFile && !isLoadingVideo && (analysisStage === 'awaitingGearInput' || analysisStage === 'idle') && (
        <>
          {(analysisStage === 'awaitingGearInput' || (analysisStage === 'idle' && identifiedFighter1)) && (
            <section className="fighter-details-input-container" aria-labelledby="fighter-details-heading">
              <h3 id="fighter-details-heading">Fighter Gear Details</h3>
              <div className="gear-inputs-flex-container">
                {renderGearInput(1, identifiedFighter1, fighter1Gear, setFighter1Gear)}
                {renderGearInput(2, identifiedFighter2, fighter2Gear, setFighter2Gear)}
              </div>
            </section>
          )}

          <div className="controls-section">
            <button
              onClick={handleMainButtonClick}
              disabled={isButtonDisabled()}
              className="analyze-button"
              aria-live="polite"
              aria-disabled={isButtonDisabled()}
            >
              {getButtonText()}
            </button>
          </div>
        </>
      )}

      {analysisStage === 'analyzingAttributes' && isLoading && !fighter1Attributes && !fighter2Attributes && (
        <div className="loading" role="status" aria-live="assertive">Analyzing performance stats<span>...</span></div>
      )}
      {analysisStage === 'determiningWinner' && isLoading && (
        <div className="loading" role="status" aria-live="assertive">Determining winner<span>...</span></div>
      )}


      {(fighter1Attributes || fighter2Attributes || (analysisStage === 'analyzingAttributes' && (fighter1Attributes || fighter2Attributes))) &&
        (analysisStage === 'analyzingAttributes' || analysisStage === 'determiningWinner' || analysisStage === 'analysisComplete') && (
        <div className="analysis-display-container">
          {renderFighterAnalysisDisplay(1, identifiedFighter1, fighter1Attributes)}
          {renderFighterAnalysisDisplay(2, identifiedFighter2, fighter2Attributes)}
        </div>
      )}

      {winner && analysisStage === 'analysisComplete' && (
        <section className="winner-section" aria-labelledby="session-result-heading">
          <h2 id="session-result-heading">Session Result</h2>
          <p>{winner}</p>
        </section>
      )}
    </main>
  );
}