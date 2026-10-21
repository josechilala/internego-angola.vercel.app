import { z } from "zod";

export const projectInputSchema = z.object({
  title: z.string().trim().min(2).max(100),
  slug: z.string().trim().toLowerCase().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).min(2).max(80),
  description: z.string().trim().min(20).max(1200),
  category: z.enum(["seguranca-privada", "gestao-residuos"]),
  location: z.string().trim().max(100).optional().or(z.literal("")),
  date: z.string().date().optional().or(z.literal("")),
});

export const projectStatusSchema = z.object({
  status: z.enum(["draft", "published"]),
});

export const projectPhotoInputSchema = z.object({
  alt: z.string().trim().min(3).max(160),
  caption: z.string().trim().max(160).optional().or(z.literal("")),
});