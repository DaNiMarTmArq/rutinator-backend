import { PROMPT } from "./client.prompt";

interface RecommendedActivities {
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

  constructor() {
    const apiKey = process.env.OPENAIKEY;
    this.prompt = PROMPT;
    if (!apiKey) {
      throw new Error("Environment variable 'OPENAIKEY' is not set");
    }
    this.apiKey = apiKey;
  }

  generate(): Promise<RecommendedActivities> {
    throw new Error("Not implemented");
  }
}
