import { User } from "@prisma/client";

export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
  language?: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type GoogleLoginPayload = {
  idToken: string;
};

export type AuthUser = Pick<User, "id" | "email" | "name" | "emailVerified" | "imageUrl">;

export type AuthResponse = {
  user: AuthUser;
  token: string;
};
