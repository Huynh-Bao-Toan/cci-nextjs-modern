import { z } from "zod";

export const productIdSchema = z.number().int().positive();
