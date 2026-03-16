import bcrypt from "bcryptjs";
import { OAuth2Client } from "google-auth-library";
import env from "../../core/config/env";
import prisma from "../../core/database/prisma";
import ApiError from "../../core/errors/apiError";
import { signToken } from "../../core/security/jwt";
import {
  AuthResponse,
  AuthUser,
  GoogleLoginPayload,
  LoginPayload,
  RegisterPayload,
} from "./types";

const googleClient = new OAuth2Client();

function toAuthResponse(user: AuthUser): AuthResponse {
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
  };
}

export async function register(payload: RegisterPayload): Promise<AuthResponse> {
  const existingUser = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (existingUser) {
    throw new ApiError(409, "Email is already registered");
  }

  const hashedPassword = await bcrypt.hash(payload.password, 10);

  const user = await prisma.user.create({
    data: {
      email: payload.email,
      name: payload.name,
      password: hashedPassword,
      profile: {
        create: {},
      },
      preference: {
        create: {
          language: payload.language || "en",
          pushEnabled: true,
        },
      },
    },
    select: {
      id: true,
      email: true,
      name: true,
      emailVerified: true,
      imageUrl: true,
    },
  });

  return toAuthResponse(user);
}

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  const user = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  if (!user.password) {
    throw new ApiError(400, "This account uses Google login");
  }

  const passwordMatches = await bcrypt.compare(payload.password, user.password);

  if (!passwordMatches) {
    throw new ApiError(401, "Invalid email or password");
  }

  return toAuthResponse(user);
}

export async function loginWithGoogle(
  payload: GoogleLoginPayload,
): Promise<AuthResponse> {
  if (!env.GOOGLE_CLIENT_ID) {
    throw new ApiError(500, "GOOGLE_CLIENT_ID is not configured");
  }

  const ticket = await googleClient.verifyIdToken({
    idToken: payload.idToken,
    audience: env.GOOGLE_CLIENT_ID,
  });

  const googleProfile = ticket.getPayload();

  if (!googleProfile?.email) {
    throw new ApiError(400, "Google account email is missing");
  }

  if (!googleProfile.email_verified) {
    throw new ApiError(400, "Google email must be verified");
  }

  const provider = "google";
  const providerAccountId = googleProfile.sub;

  const existingAccount = await prisma.account.findUnique({
    where: {
      provider_providerAccountId: {
        provider,
        providerAccountId,
      },
    },
    include: {
      user: true,
    },
  });

  if (existingAccount) {
    return toAuthResponse(existingAccount.user);
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: googleProfile.email },
  });

  const user = existingUser
    ? await prisma.user.update({
        where: { id: existingUser.id },
        data: {
          name: existingUser.name || googleProfile.name || googleProfile.email.split("@")[0],
          emailVerified: true,
          imageUrl: existingUser.imageUrl || googleProfile.picture,
          accounts: {
            create: {
              provider,
              providerAccountId,
            },
          },
        },
      })
    : await prisma.user.create({
        data: {
          email: googleProfile.email,
          name: googleProfile.name || googleProfile.email.split("@")[0],
          password: "",
          emailVerified: true,
          imageUrl: googleProfile.picture,
          accounts: {
            create: {
              provider,
              providerAccountId,
            },
          },
          profile: {
            create: {},
          },
          preference: {
            create: {
              language: "en",
              pushEnabled: true,
            },
          },
        },
      });

  return toAuthResponse(user);
}
