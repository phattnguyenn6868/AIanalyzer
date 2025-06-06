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
import {FunctionDeclaration, Type} from '@google/genai';

// This interface is not used by the default export but kept for potential future use if complex dispatching is needed.
// interface FunctionCallbackMap {
//   [key: string]: (args: any) => void;
// }

const functionDeclarations: FunctionDeclaration[] = [
  {
    name: 'set_identified_fighters',
    description: "Sets the AI-assigned descriptive names and two distinct visual descriptions for two fighters identified in the video.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        fighter1_name: {
          type: Type.STRING,
          description: "The descriptive name assigned by the AI to the first identified fighter based on a primary visual characteristic (e.g., 'Red Gloves', 'Fighter with Blue Headband')."
        },
        fighter1_description1: {
            type: Type.STRING,
            description: "The first brief (one-sentence) visual description of a distinguishing feature for fighter 1."
        },
        fighter1_description2: {
            type: Type.STRING,
            description: "The second brief (one-sentence) visual description of a different distinguishing feature for fighter 1."
        },
        fighter2_name: {
          type: Type.STRING,
          description: "The descriptive name assigned by the AI to the second identified fighter based on a primary visual characteristic."
        },
        fighter2_description1: {
            type: Type.STRING,
            description: "The first brief (one-sentence) visual description of a distinguishing feature for fighter 2."
        },
        fighter2_description2: {
            type: Type.STRING,
            description: "The second brief (one-sentence) visual description of a different distinguishing feature for fighter 2."
        },
      },
      required: ['fighter1_name', 'fighter1_description1', 'fighter1_description2', 'fighter2_name', 'fighter2_description1', 'fighter2_description2'],
    },
  },
  {
    name: 'set_fighter_attributes',
    description: "Sets the analyzed attributes for a specific fighter. This includes estimated punch counts, calculated accuracy percentage, estimated defensive metrics, calculated defense effectiveness percentage, qualitative assessments for core attributes, numerical ratings (1-100) for these core attributes, and an overall numerical rating (1-100).",
    parameters: {
      type: Type.OBJECT,
      properties: {
        fighter_id: {
          type: Type.STRING,
          description: "Internal identifier for mapping the fighter in the application (e.g., 'fighter1' or 'fighter2')."
        },
        fighter_name: {
          type: Type.STRING,
          description: "The descriptive name that was assigned by the AI to this fighter during the initial identification phase (e.g., 'Red Gloves'). This is used for confirmation."
        },
        punches_thrown: {
          type: Type.NUMBER,
          description: "Estimated total number of punches thrown by the fighter, based on glove movement."
        },
        punches_landed: {
          type: Type.NUMBER,
          description: "Estimated number of punches that landed, considering reported gear and effectiveness."
        },
        accuracy_percentage: {
          type: Type.NUMBER,
          description: "Calculated as (punches_landed / punches_thrown) * 100, rounded to one decimal place. If punches_thrown is 0, this should be 0."
        },
        attacks_faced: {
            type: Type.NUMBER,
            description: "Estimated total number of significant offensive attacks directed at this fighter by their opponent."
        },
        attacks_defended: {
            type: Type.NUMBER,
            description: "Estimated number of the 'attacks_faced' that this fighter successfully defended (e.g., via blocks, parries, evasions, good movement)."
        },
        defense_effectiveness_percentage: {
            type: Type.NUMBER,
            description: "Calculated as (attacks_defended / attacks_faced) * 100, rounded to one decimal place. If attacks_faced is 0, this should be 0."
        },
        power: {
          type: Type.STRING,
          description: "Concise, one-sentence qualitative assessment of the fighter's power, complementing the numerical power_rating."
        },
        power_rating: {
            type: Type.NUMBER,
            description: "Numerical rating (1-100) for the fighter's power, based on observed impact and effectiveness."
        },
        defense: {
          type: Type.STRING,
          description: "Concise, one-sentence qualitative assessment of the fighter's defense, complementing the numerical defense_rating and informed by defense_effectiveness_percentage."
        },
        defense_rating: {
            type: Type.NUMBER,
            description: "Numerical rating (1-100) for the fighter's defense, informed by defense_effectiveness_percentage and observed defensive skills."
        },
        accuracy: {
          type: Type.STRING,
          description: "Concise, one-sentence qualitative assessment of the fighter's accuracy, complementing the numerical accuracy_rating and informed by accuracy_percentage."
        },
        accuracy_rating: {
            type: Type.NUMBER,
            description: "Numerical rating (1-100) for the fighter's accuracy, informed by accuracy_percentage and observed precision."
        },
        ring_generalship: {
          type: Type.STRING,
          description: "Concise, one-sentence qualitative assessment of the fighter's ring generalship, complementing the numerical ring_generalship_rating."
        },
        ring_generalship_rating: {
            type: Type.NUMBER,
            description: "Numerical rating (1-100) for ring generalship (control of ring, pace, positioning)."
        },
        fight_iq: {
          type: Type.STRING,
          description: "Concise, one-sentence qualitative assessment of the fighter's fight IQ, complementing the numerical fight_iq_rating."
        },
        fight_iq_rating: {
            type: Type.NUMBER,
            description: "Numerical rating (1-100) for fight IQ (strategic thinking, adaptation, setups)."
        },
        footwork: {
          type: Type.STRING,
          description: "Concise, one-sentence qualitative assessment of the fighter's footwork, complementing the numerical footwork_rating."
        },
        footwork_rating: {
            type: Type.NUMBER,
            description: "Numerical rating (1-100) for footwork (agility, balance, movement, angles)."
        },
        overall_rating: {
            type: Type.NUMBER,
            description: "Overall numerical rating (1-100) for the fighter, derived by the AI from all other attribute scores, percentages, and observations."
        }
      },
      required: [
        'fighter_id',
        'fighter_name',
        'punches_thrown',
        'punches_landed',
        'accuracy_percentage',
        'attacks_faced',
        'attacks_defended',
        'defense_effectiveness_percentage',
        'power',
        'power_rating',
        'defense',
        'defense_rating',
        'accuracy',
        'accuracy_rating',
        'ring_generalship',
        'ring_generalship_rating',
        'fight_iq',
        'fight_iq_rating',
        'footwork',
        'footwork_rating',
        'overall_rating'
      ],
    },
  },
];

// This utility function returns the function declarations for direct use with `tools`.
export default (): FunctionDeclaration[] => {
  return functionDeclarations;
};
