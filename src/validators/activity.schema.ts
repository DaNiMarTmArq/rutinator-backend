import { z } from "zod";

export const CreateActivityRequestSchema = z.object({
  routines_versions_id: z.number(),
  title: z.string().max(100).nullable(),
  description: z.string().max(300),
  activity_categories_id: z.number(),
  day_of_week: z.enum(["0", "1", "2", "3", "4", "5", "6"]),
  start_time: z.string().nullable(), // format: HH:mm:ss
  end_time: z.string().nullable(),
});

export const UpdateActivityRequestSchema =
  CreateActivityRequestSchema.partial();
