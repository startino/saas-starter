import { z } from "zod"

export const otpCodeSchema = z.object({
  email: z.string().email(),
  code: z
    .string()
    .length(6, "Must be a 6-digit code")
    .regex(/^\d+$/, "Must be a 6-digit code"),
})

export const signUpSchema = z
  .object({
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .max(16, "Password must be at most 16 characters long")
      .regex(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,16}$/,
        "For security sake, please include lowercase, uppercase letters and digits.",
      ),
    confirmPassword: z.string(),
  })
  .refine(({ password, confirmPassword }) => password === confirmPassword, {
    message: "The passwords did not match",
  })

export const environmentSchema = z.object({
  name: z
    .string()
    .min(1, "The environment name is required")
    .max(30, "The environment name can be at most 72 charaters long")
    .regex(/^[a-z0-9+$]/i, "Environment name must be alphanumeric"),
})

export const emailSchema = z.object({
  email: z.string().email(),
})

export type EmailSchema = typeof emailSchema

export const passwordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(
        1,
        "You must include your current password. If you forgot it, sign out then use 'forgot password' on the sign in page.",
      ),
    newPassword1: z
      .string()
      .min(6, "The new password must be at least 6 charaters long")
      .max(72, "The new password can be at most 72 charaters long"),
    newPassword2: z
      .string()
      .min(6, "The new password must be at least 6 charaters long")
      .max(72, "The new password can be at most 72 charaters long"),
  })
  .refine(
    ({ newPassword1, newPassword2 }) => newPassword1 === newPassword2,
    "The passwords don't match",
  )

export type PasswordSchema = typeof passwordSchema

export const deleteAccountSchema = z.object({
  currentPassword: z
    .string()
    .min(
      1,
      "You must provide your current password to delete your account. If you forgot it, sign out then use 'forgot password' on the sign in page.",
    ),
})

export type DeleteAccountSchema = typeof deleteAccountSchema

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

export type ProfileSchema = typeof profileSchema
