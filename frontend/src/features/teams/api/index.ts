import type { CreateTeamRequest, CreateTeamResponse } from "./types";

const API_URL = `${import.meta.env.VITE_TEAM_SERVICE_API_URL}/teams`;

async function createTeam(
  formData: CreateTeamRequest
): Promise<CreateTeamResponse> {
  try {
    const response = await fetch(`${API_URL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
      },

      body: JSON.stringify(formData),
    });
    if (!response.ok) {
      throw new Error(`Error creating team: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
}

export { createTeam };
