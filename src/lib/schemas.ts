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

export const profileSchema = z.object({
  full_name: z
    .string()
    .min(1, "Name is required")
    .max(50, "Name must be less than 50 characters"),
  company_name: z
    .string()
    .min(
      1,
      "Company name is required. If this is a hobby project or personal app, please put your name.",
    )
    .max(50, "Company name must be less than 50 characters"),
  website: z
    .string()
    .min(
      1,
      "Company website is required. An app store URL is a good alternative if you don't have a website.",
    )
    .max(50, "Name must be less than 50 characters"),
})
