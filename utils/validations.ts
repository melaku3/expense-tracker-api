import { z } from "zod";

export const createUserSchema = z.object({
    username: z.string().min(1, { message: 'Username cannot be empty' }).min(3, { message: 'Username must be at least 3 characters' }).max(20, { message: 'Username must be at most 20 characters' }).toLowerCase().trim(),
    email: z.string().email({ message: 'Invalid email address' }).trim().toLowerCase(),
    password: z.string().min(6, { message: 'Password must be at least 6 characters' }).max(20, { message: 'Password must be at most 20 characters' }),
    role: z.enum(['user', 'admin'], { message: 'Role must be either user or admin' })
});
