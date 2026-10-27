import type { z } from 'zod';
import type { LifestyleMatchParams, PetSearchParams } from '../src/types/pet';

export const PetSearchQuerySchema: z.ZodType<PetSearchParams & { status?: string }>;
export const LifestyleMatchSchema: z.ZodType<LifestyleMatchParams & { limit: number }>;
