import { User } from "@prisma/client";
import { signToken } from "../../../../core/security/jwt";

export type AuthUser = Pick<
  User,
  "id" | "email" | "name" | "emailVerified" | "imageUrl"
>;

export type AuthResponse = {
  user: AuthUser;
  token: string;
  onboardingCompleted: boolean;
};

type AuthResponseInput = AuthUser & {
  profile?: {
    onboardingCompleted: boolean;
  } | null;
};

export function toAuthResponse(user: AuthResponseInput): AuthResponse {
  const token = signToken({ userId: user.id, email: user.email });

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      emailVerified: user.emailVerified,
      imageUrl: user.imageUrl,
    },
    token,
    onboardingCompleted: user.profile?.onboardingCompleted ?? false,
  };
}
