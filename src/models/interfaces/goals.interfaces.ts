export interface Goals {
  id: number;
  users_id: number;
  interests_id: number;
  goals_name: string;
  hours_per_week: string;
}

export interface GoalsDetails {
  userId: string;
  goalsName: string;
}
