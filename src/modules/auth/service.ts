import bcrypt from "bcryptjs";
import { OAuth2Client } from "google-auth-library";
import env from "../../core/config/env";
import prisma from "../../core/database/prisma";
import ApiError from "../../core/errors/apiError";
import { GoogleLoginRequestBody } from "./models/requests/googleLogin.request";
import { LoginRequestBody } from "./models/requests/login.request";
import { RegisterRequestBody } from "./models/requests/register.request";
import { AuthResponse, toAuthResponse } from "./models/responses/auth.response";

const googleClient = new OAuth2Client();

function getGoogleAudiences(): string[] {
  const audiences = [
    env.GOOGLE_CLIENT_ID,
    ...(env.GOOGLE_CLIENT_IDS
      ? env.GOOGLE_CLIENT_IDS.split(",").map((value) => value.trim())
      : []),
  ].filter((value): value is string => Boolean(value));

  const uniqueAudiences = [...new Set(audiences)];

  if (uniqueAudiences.length === 0) {
    throw new ApiError(
      500,
      "GOOGLE_CLIENT_ID or GOOGLE_CLIENT_IDS must be configured",
    );
  }

  return uniqueAudiences;
}

export async function register(
  payload: RegisterRequestBody,
): Promise<AuthResponse> {
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

export async function login(payload: LoginRequestBody): Promise<AuthResponse> {
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
  payload: GoogleLoginRequestBody,
): Promise<AuthResponse> {
  const ticket = await googleClient.verifyIdToken({
    idToken: payload.idToken,
    audience: getGoogleAudiences(),
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
          name:
            existingUser.name ||
            googleProfile.name ||
            googleProfile.email.split("@")[0],
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
          password: null,
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
