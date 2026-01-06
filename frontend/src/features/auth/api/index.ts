import { apolloClient } from "@/apollo-client";
import { LOGIN } from "./queries";
import type { LoginRequest, LoginResponse } from "./types";

async function login({
  email,
  password,
}: LoginRequest): Promise<LoginResponse> {
  const { data } = await apolloClient.mutate<{
    login: LoginResponse;
  }>({
    mutation: LOGIN,
    variables: { email, password },
  });
  return data?.login as LoginResponse;
}

export { login };
