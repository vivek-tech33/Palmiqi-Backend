import { FastifyReply, FastifyRequest } from "fastify";
import * as authService from "./service";
import { GoogleLoginRequestBody } from "./models/requests/googleLogin.request";
import { LoginRequestBody } from "./models/requests/login.request";
import { RegisterRequestBody } from "./models/requests/register.request";

export async function register(
  request: FastifyRequest<{
    Body: RegisterRequestBody;
  }>,
  reply: FastifyReply,
) {
  const data = await authService.register(request.body);

  return reply.status(201).send({
    success: true,
    message: "User registered successfully",
    data,
  });
}

export async function login(
  request: FastifyRequest<{
    Body: LoginRequestBody;
  }>,
  reply: FastifyReply,
) {
  const data = await authService.login(request.body);

  return reply.status(200).send({
    success: true,
    message: "Login successful",
    data,
  });
}

export async function googleLogin(
  request: FastifyRequest<{
    Body: GoogleLoginRequestBody;
  }>,
  reply: FastifyReply,
) {
  const data = await authService.loginWithGoogle(request.body);

  return reply.status(200).send({
    success: true,
    message: "Google login successful",
    data,
  });
}
