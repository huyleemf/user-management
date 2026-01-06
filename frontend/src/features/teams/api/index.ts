import { storage } from "@/shared/utils/storage";
import type {
  CreateTeamRequest,
  CreateTeamResponse,
  GetTeamsResponse,
} from "./types";
import { enqueueSnackbar } from "notistack";
import type { AddUserDialogType } from "../components/dialog/add-user";

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
    const data = await response.json();

    enqueueSnackbar(data.message || "Fetch Teams successfully", {
      variant: !response.ok ? "error" : "success",
    });
    if (!response.ok) {
      if (response.status === 401) {
        window.location.href = "/sign-in";
      }
      throw new Error(`Error fetching teams: ${response.statusText}`);
    }
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
    const data = await response.json();

    enqueueSnackbar(data.message || "Create Team successfully", {
      variant: !response.ok ? "error" : "success",
    });
    if (!response.ok) {
      if (response.status === 401) {
        window.location.href = "/sign-in";
      }
      throw new Error(`Error creating team: ${response.statusText}`);
    }
    return data;
  } catch (error) {
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

    const data = await response.json();
    enqueueSnackbar(data.message || "Fetch Team successfully", {
      variant: !response.ok ? "error" : "success",
    });
    if (!response.ok) {
      if (response.status === 401) {
        window.location.href = "/sign-in";
      }
      throw new Error(`Error fetching team: ${response.statusText}`);
    }
    return data;
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
}

async function addToTeam(
  teamId: string,
  userId: string,
  userName: string,
  role: AddUserDialogType
): Promise<void> {
  try {
    let resp;
    if (role == "member") {
      resp = await fetch(`${API_URL}/${teamId}/members`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${storage.get("accessToken") || ""}`,
        },
        body: JSON.stringify({ memberId: userId, memberName: userName }),
      });
    } else if (role == "manager") {
      resp = await fetch(`${API_URL}/${teamId}/managers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${storage.get("accessToken") || ""}`,
        },
        body: JSON.stringify({ managerId: userId, managerName: userName }),
      });
    }
    const data = await resp!.json();

    enqueueSnackbar(data.message || "Add User to Team successfully", {
      variant: !resp!.ok ? "error" : "success",
    });
    if (!resp!.ok) {
      if (resp!.status === 401) {
        window.location.href = "/sign-in";
      }
      throw new Error(`Error adding user to team: ${resp!.statusText}`);
    }
    return data;
  } catch (error) {
    console.error(error);
  }
}

async function removeFromTeam(
  teamId: string,
  userId: string,
  role: AddUserDialogType
): Promise<void> {
  try {
    let resp;
    if (role == "member") {
      resp = await fetch(`${API_URL}/${teamId}/members/${userId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${storage.get("accessToken") || ""}`,
        },
        body: JSON.stringify({ userId }),
      });
    } else if (role == "manager") {
      resp = await fetch(`${API_URL}/${teamId}/managers/${userId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${storage.get("accessToken") || ""}`,
        },
        body: JSON.stringify({ userId }),
      });
    }
    const data = await resp!.json();
    enqueueSnackbar(data.message || "Remove User from Team successfully", {
      variant: !resp!.ok ? "error" : "success",
    });
    if (!resp!.ok) {
      if (resp!.status === 401) {
        window.location.href = "/sign-in";
      }
      throw new Error(`Error removing user from team: ${resp!.statusText}`);
    }
    return data;
  } catch (error) {
    console.error(error);
  }
}
export { createTeam, getTeams, getTeam, addToTeam, removeFromTeam };
