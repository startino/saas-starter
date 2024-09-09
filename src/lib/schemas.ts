import { z } from "zod"

export const contactSchema = z.object({
  first_name: z
    .string()
    .min(2, "First name is required")
    .max(500, "First name too long"),
  last_name: z
    .string()
    .min(2, "Last name is required")
    .max(500, "Last name too long"),
  email: z.string().email("Email is required").max(500, "Email too long"),
  company_name: z.string().max(500, "Company too long"),
  phone: z.string().max(100, "Phone number").optional(),
  message_body: z
    .string()
    .max(2000, "Message too long. Must be no more than 2000 character")
    .default(""),
})
