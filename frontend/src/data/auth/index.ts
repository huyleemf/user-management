import { apolloClient } from "@/apollo-client";
import { LOGIN } from "./queries";
import type { LoginRequest, LoginResponse } from "./types";

async function login({
  email,
  password,
}: LoginRequest): Promise<LoginResponse> {
  try {
    const { data } = await apolloClient.mutate<{
      login: LoginResponse;
    }>({
      mutation: LOGIN,
      variables: { email, password },
    });

    if (!data?.login) {
      throw new Error("No response from server");
    }

    return data.login;
  } catch (error: any) {
    console.error("Login API error:", error);
    throw new Error(
      error.message || "Failed to connect to authentication service"
    );
  }
}

export { login };
