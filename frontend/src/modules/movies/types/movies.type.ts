import { z } from "zod";

export type MovieSortOption =
  | "title_asc"
  | "title_desc"
  | "year_asc"
  | "year_desc";

export interface MovieSearchParams {
  q?: string;
  year?: string;
  sort?: string;
  movieId?: number;
}

export const MovieSearchSchema = z.object({
  q: z.string().optional(),
  year: z.string().optional(),
  sort: z.string().optional(),
  movieId: z.coerce.number().optional(), // convert to number if possible
});

/**
 * Standardized Zod schema for Movie response items.
 */
export const MovieSchema = z.object({
  id: z.number(),
  title: z.string(),
  release_year: z.number().optional().nullable(),
  locations: z.string().optional().nullable(),
  fun_facts: z.string().optional().nullable(),
  production_company: z.string().optional().nullable(),
  distributor: z.string().optional().nullable(),
  director: z.string().optional().nullable(),
  writer: z.string().optional().nullable(),
  actor_1: z.string().optional().nullable(),
  actor_2: z.string().optional().nullable(),
  actor_3: z.string().optional().nullable(),
  latitude: z.number().optional().nullable(),
  longitude: z.number().optional().nullable(),
  analysis_neighborhood: z.string().optional().nullable(),
  supervisor_district: z.string().optional().nullable(),
});

export type Movie = z.infer<typeof MovieSchema>;
