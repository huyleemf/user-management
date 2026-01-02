import { storage } from "@/shared/utils/storage";
import type {
  CreateTeamRequest,
  CreateTeamResponse,
  GetTeamsResponse,
} from "./types";
import { enqueueSnackbar } from "notistack";

const API_URL = `${import.meta.env.VITE_TEAM_SERVICE_API_URL}/teams`;

async function getTeams(): Promise<GetTeamsResponse[]> {
  try {
    const response = await fetch(`${API_URL}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${storage.get("accessToken") || ""}`,
      },
    });
    if (!response.ok) {
      if (response.status === 401) {
        window.location.href = "/sign-in";
      }
      throw new Error(`Error fetching teams: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    enqueueSnackbar(error + "", { variant: "error" });
    return Promise.reject(error);
  }
}

async function createTeam(
  formData: CreateTeamRequest
): Promise<CreateTeamResponse> {
  try {
    const response = await fetch(`${API_URL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${storage.get("accessToken") || ""}`,
      },

      body: JSON.stringify(formData),
    });
    if (!response.ok) {
      if (response.status === 401) {
        window.location.href = "/sign-in";
      }
      throw new Error(`Error creating team: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    enqueueSnackbar(error + "", { variant: "error" });
    console.error(error);
    return Promise.reject(error);
  }
}

async function getTeam(teamId: string): Promise<GetTeamsResponse> {
  try {
    const response = await fetch(`${API_URL}/${teamId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${storage.get("accessToken") || ""}`,
      },
    });
    if (!response.ok) {
      if (response.status === 401) {
        window.location.href = "/sign-in";
      }
      throw new Error(`Error fetching team: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    enqueueSnackbar(error + "", { variant: "error" });
    return Promise.reject(error);
  }
}

export { createTeam, getTeams, getTeam };
