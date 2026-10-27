import { z } from "zod";

const species = z.enum(["Dog", "Cat", "Rabbit", "Other"]);
const size = z.enum(["Small", "Medium", "Large", "Extra Large"]);
const status = z.enum(["available", "pending", "fostered", "adopted", "hold"]);
const optionalText = (max) =>
  z.preprocess(
    (value) => (value === "" || value === undefined ? undefined : value),
    z.string().trim().max(max).optional(),
  );
const optionalAge = z.preprocess(
  (value) => (value === "" || value === undefined ? undefined : Number(value)),
  z.number().int().min(0).optional(),
);
const optionalQueryBoolean = z.preprocess(
  (value) => (value === "" || value === undefined ? undefined : value),
  z
    .enum(["true", "false"])
    .transform((value) => value === "true")
    .optional(),
);

export const PetSearchQuerySchema = z
  .object({
    species: z.preprocess(
      (value) => (value === "" ? undefined : value),
      species.optional(),
    ),
    breed: optionalText(100),
    min_age_months: optionalAge,
    max_age_months: optionalAge,
    size: z.preprocess(
      (value) => (value === "" ? undefined : value),
      size.optional(),
    ),
    good_with_kids: optionalQueryBoolean,
    good_with_pets: optionalQueryBoolean,
    shelter_id: z.preprocess(
      (value) => (value === "" || value === undefined ? undefined : value),
      z.string().uuid().optional(),
    ),
    status: z.preprocess(
      (value) => (value === "" || value === undefined ? "available" : value),
      status,
    ),
    page: z.preprocess(
      (value) => (value === "" || value === undefined ? 1 : Number(value)),
      z.number().int().min(1).default(1),
    ),
    limit: z.preprocess(
      (value) => (value === "" || value === undefined ? 20 : Number(value)),
      z.number().int().min(1).max(100).default(20),
    ),
  })
  .strict()
  .superRefine((query, context) => {
    if (
      query.min_age_months !== undefined &&
      query.max_age_months !== undefined &&
      query.min_age_months > query.max_age_months
    ) {
      context.addIssue({
        code: "custom",
        path: ["min_age_months"],
        message: "min_age_months cannot exceed max_age_months.",
      });
    }
  });

export const LifestyleMatchSchema = z
  .object({
    housing_type: z.enum(["House", "Apartment", "Condo"]),
    owns_or_rents: z.enum(["Own", "Rent"]),
    has_yard: z.boolean(),
    has_children: z.boolean(),
    has_other_pets: z.boolean(),
    activity_level: z.enum(["low", "moderate", "high"]),
    preferred_species: z.array(species).max(4),
    preferred_sizes: z.array(size).max(4).optional(),
    min_age_months: z.number().int().min(0).optional(),
    max_age_months: z.number().int().min(0).optional(),
    open_to_special_care: z.boolean().optional(),
    limit: z.number().int().min(1).max(50).default(10),
  })
  .strict()
  .superRefine((input, context) => {
    if (
      input.min_age_months !== undefined &&
      input.max_age_months !== undefined &&
      input.min_age_months > input.max_age_months
    ) {
      context.addIssue({
        code: "custom",
        path: ["min_age_months"],
        message: "min_age_months cannot exceed max_age_months.",
      });
    }
  });
