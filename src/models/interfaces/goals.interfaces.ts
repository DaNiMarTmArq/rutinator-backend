export interface Goals {
  id: number;
  users_id: number;
  interests_id: number;
  goals_name: string;
  goals_description: string;
  hours_per_week: number;
}

export interface GoalsDetails {
  userId: number;
  interestId: number;
  goalsName: string;
  goalsDescription: string;
  hoursPerWeek: number;
}
