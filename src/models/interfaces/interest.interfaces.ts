export interface Interest {
  id: number;
  users_id: number;
  interest_name: string;
  color?: string;
}

export interface InterestDetails {
  userId: string;
  interestName: string;
  color: string;
}
