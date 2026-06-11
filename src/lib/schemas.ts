import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(2, "Please enter your name."),
  email: z.email("Please enter a valid email address."),
  subject: z.string().min(3, "Please enter a subject."),
  message: z.string().min(20, "Please share a bit more detail."),
});

export type ContactFormValues = z.infer<typeof contactSchema>;
