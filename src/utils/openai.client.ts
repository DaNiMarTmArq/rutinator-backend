import OpenAI from "openai";
import { PROMPT } from "./client.prompt";

interface Interes {
  id: number;
  name: string;
}

interface Objetivo {
  id: number;
  title: string;
  description: string;
  hours_per_week: number;
}

interface Disponibilidad {
  id: number;
  day_of_week: string;
  start_time: string;
  end_time: string;
}

export interface ModelInput {
  intereses: Interes[];
  objetivos: Objetivo[];
  disponibilidad: Disponibilidad[];
}

export interface RecommendedActivities {
  title: string;
  description: string;
  day_of_week: string;
  day: number;
  start_time: string;
  end_time: string;
}

export class OpenAIClient {
  private apiKey: string;
  private prompt: string;
  private client: OpenAI;

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      throw new Error("Environment variable 'OPENAI_API_KEY' is not set");
    }
    this.apiKey = apiKey;
    this.prompt = PROMPT;
    this.client = new OpenAI({
      apiKey: this.apiKey,
    });
  }

  async generate(input: ModelInput): Promise<RecommendedActivities[]> {
    const modelResponse = await this.client.responses.create({
      prompt: {
        id: "pmpt_6856e0b1d4dc8190bc101fce47d12f1b016c9c1bc969338b",
        version: "5",
      },
      input: [
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: JSON.stringify(input),
            },
          ],
        },
      ],
    });

    const outputText = modelResponse.output_text;

    const match = outputText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (!match) {
      console.log(outputText);
      return [];
    }

    try {
      const activities: RecommendedActivities[] = JSON.parse(match[1]);
      return activities;
    } catch (err) {
      throw new Error("Failed to parse JSON from model output: " + err);
    }
  }
}
