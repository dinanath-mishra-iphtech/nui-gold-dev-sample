import { z } from 'zod';

import { createUserSchema, createBusinessSchema, registerInputSchema, setPasswordSchema } from './user.validation';

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type CreateBusinessInput = z.infer<typeof createBusinessSchema>;
export type RegisterInput = z.infer<typeof registerInputSchema>;
export type SetPasswordInput = z.infer<typeof setPasswordSchema>;