export interface UserAvailability {
  id: number;
  weekday: number;
  start_time: string; // format: 'HH:MM:SS'
  end_time: string; // format: 'HH:MM:SS'
}

export interface CreateAvailabilityRequest {
  user_id: number;
  weekday: number;
  start_time: string; // format: 'HH:MM:SS'
  end_time: string; // format: 'HH:MM:SS'
}
