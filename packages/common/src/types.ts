import z from "zod";

export const authSchema = z.object({
  username: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long." })
    .trim(),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long." })
    .regex(/[a-zA-Z]/, { message: "Must contain at least one letter." })
    .regex(/[0-9]/, { message: "Must contain at least one number." })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Must contain at least one special character.",
    })
    .trim(),
});

export const createWebsiteSchema = z.object({
  url: z
    .string({ message: "URL is required." })
    .url({ message: "Please provide a valid URL." })
    .trim(),
});

export const getWebsiteParamsSchema = z.object({
  websiteId: z
    .string({ message: "Website ID is required." })
    .uuid({ message: "Website ID must be a valid UUID." }),
});
