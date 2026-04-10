import { z } from "zod";
import { MovieSchema } from "@/modules/movies/types/movies.type";

export const FavoriteSchema = z.object({
  id: z.number(),
  movie_id: z.number(),
  movie: MovieSchema,
});

export type Favorite = z.infer<typeof FavoriteSchema>;
