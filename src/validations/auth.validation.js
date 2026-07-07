import { z } from 'zod';

export const signupschema = z.object({
    name: z.string().trim().min(2, { message: "Name is required" }),
    email: z.string().email({ message: "Invalid email address" }).lowercase().trim(),
    password: z.string().min(6, { message: "Password must be at least 6 characters long" }).max(20, { message: "Password must be at most 20 characters long" }),
    role:z.enum(["user", "admin"], { message: "Role must be either 'admin' or 'user'" }).default("user")


 
})

export const signinschema = z.object({
    email: z.string().email({ message: "Invalid email address" }).lowercase().trim(),
    password: z.string().min(6, { message: "Password must be at least 6 characters long" }).max(20, { message: "Password must be at most 20 characters long" }),
})