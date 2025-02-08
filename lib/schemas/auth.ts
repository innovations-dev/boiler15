import type { UserWithRole } from "better-auth/plugins";
import { z } from "zod";

/**
 * Schema for validating magic link authentication email input
 * @description Validates email addresses for magic link authentication requests
 *
 * @example
 * // Validate an email input
 * const result = magicLinkSchema.safeParse({ email: "user@example.com" });
 * if (result.success) {
 *   // Email is valid
 *   const { email } = result.data;
 * }
 *
 * @example
 * // Usage with React Hook Form
 * import { useForm } from 'react-hook-form';
 * import { zodResolver } from '@hookform/resolvers/zod';
 *
 * const form = useForm({
 *   resolver: zodResolver(magicLinkSchema)
 * });
 */
export const magicLinkSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

/**
 * TypeScript type for magic link input data
 * @description Type definition inferred from the magicLinkSchema
 * Useful for typing form data and API request bodies
 *
 * @example
 * // Type an API request handler
 * async function handleMagicLink(data: MagicLinkInput) {
 *   // Process magic link request
 * }
 */
export type MagicLinkInput = z.infer<typeof magicLinkSchema>;

/**
 * Schema for validating register input
 * @description Validates name, email, and password for registration requests
 *
 * @example
 * // Validate register input
 * const result = registerSchema.safeParse({ name: "John Doe", email: "john@example.com", password: "password123" });
 * if (result.success) {
 *   // Input is valid
 *   const { name, email, password } = result.data;
 * }
 */
export const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

/**
 * TypeScript type for register input data
 * @description Type definition inferred from the registerSchema
 * Useful for typing form data and API request bodies
 *
 * @example
 * // Type an API request handler
 * async function handleRegister(data: RegisterInput) {
 *   // Process registration request
 * }
 */
export type RegisterInput = z.infer<typeof registerSchema>;

/**
 * Schema for validating user with role from Better Auth
 * @description Validates user objects that include role information from Better Auth
 *
 * @example
 * // Validate a user with role
 * const result = userWithRoleSchema.safeParse({
 *   id: "123",
 *   email: "user@example.com",
 *   role: "admin"
 * });
 */
export const userWithRoleSchema = z.custom<UserWithRole>();

/**
 * Schema for validating authentication session data
 * @description Validates the session structure returned by Better Auth,
 * including the user object with role information
 *
 * @example
 * // Validate session data
 * const result = authSessionSchema.safeParse({
 *   session: {
 *     user: {
 *       id: "123",
 *       email: "user@example.com",
 *       role: "admin"
 *     }
 *   }
 * });
 *
 * @example
 * // Type an API response handler
 * async function handleSession(data: AuthSession) {
 *   const { session: { user } } = data;
 *   // Process session data
 * }
 */
export const authSessionSchema = z.object({
  session: z.object({
    user: userWithRoleSchema,
  }),
});

/**
 * TypeScript type for authentication session data
 * @description Type definition inferred from the authSessionSchema
 * Useful for typing API responses and session management
 */
export type AuthSession = z.infer<typeof authSessionSchema>;
