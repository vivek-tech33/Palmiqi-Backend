import { FastifyReply, FastifyRequest } from "fastify";
import * as authService from "../services/auth.service";

type RegisterRequest = FastifyRequest<{
  Body: {
    name: string;
    email: string;
    password: string;
    language?: string;
  };
}>;

type LoginRequest = FastifyRequest<{
  Body: {
    email: string;
    password: string;
  };
}>;

type GoogleLoginRequest = FastifyRequest<{
  Body: {
    idToken: string;
  };
}>;

export async function register(request: RegisterRequest, reply: FastifyReply) {
  const data = await authService.register(request.body);

  return reply.status(201).send({
    success: true,
    message: "User registered successfully",
    data,
  });
}

export async function login(request: LoginRequest, reply: FastifyReply) {
  const data = await authService.login(request.body);

  return reply.status(200).send({
    success: true,
    message: "Login successful",
    data,
  });
}

export async function googleLogin(request: GoogleLoginRequest, reply: FastifyReply) {
  const data = await authService.loginWithGoogle(request.body);

  return reply.status(200).send({
    success: true,
    message: "Google login successful",
    data,
  });
}
