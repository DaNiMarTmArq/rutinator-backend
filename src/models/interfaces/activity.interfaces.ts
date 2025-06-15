export interface Activity {
  id: number;
  routines_versions_id: number;
  title: string | null;
  description: string | null;
  activity_categories_id: number;
  day_of_week: "0" | "1" | "2" | "3" | "4" | "5" | "6";
  start_time: string | null; 
  end_time: string | null; 
}

export interface CreateActivityRequest extends Omit<Activity, "id"> {}

export interface UpdateActivityRequest extends Partial<Omit<Activity, "id">> {}
