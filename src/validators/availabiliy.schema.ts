import { z } from "zod";

export const CreateAvailabilityRequestSchema = z.object({
  weekday: z
    .number()
    .int()
    .min(0, "Weekday must be between 0 (Sunday) and 6 (Saturday)")
    .max(6, "Weekday must be between 0 (Sunday) and 6 (Saturday)"),
  start_time: z
    .string()
    .regex(
      /^([01]\d|2[0-3]):[0-5]\d:[0-5]\d$/,
      "Start time must be in HH:MM:SS format"
    ),
  end_time: z
    .string()
    .regex(
      /^([01]\d|2[0-3]):[0-5]\d:[0-5]\d$/,
      "End time must be in HH:MM:SS format"
    ),
});

export const UpdateAvailabilityRequestSchema = z
  .object({
    weekday: z
      .number()
      .int()
      .min(0, "Weekday must be between 0 (Sunday) and 6 (Saturday)")
      .max(6, "Weekday must be between 0 (Sunday) and 6 (Saturday)")
      .optional(),
    start_time: z
      .string()
      .regex(
        /^([01]\d|2[0-3]):[0-5]\d:[0-5]\d$/,
        "Start time must be in HH:MM:SS format"
      )
      .optional(),
    end_time: z
      .string()
      .regex(
        /^([01]\d|2[0-3]):[0-5]\d:[0-5]\d$/,
        "End time must be in HH:MM:SS format"
      )
      .optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required",
  });
