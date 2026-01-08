import type { AddUserDialogType } from "@/pages/teams/components/AddUserDialog";
import { httpWrapper } from "@/shared/utils/utils";
import type {
  CreateTeamRequest,
  CreateTeamResponse,
  GetTeamsResponse,
} from "./types";

const API_URL = `${import.meta.env.VITE_TEAM_SERVICE_API_URL}/teams`;

async function getTeams(): Promise<GetTeamsResponse> {
  const response = await httpWrapper({
    url: `${API_URL}`,
    toast: {
      showToast: true,
      successMessage: "Fetch Teams successfully",
      errorMessage: "Error fetching teams:",
    },
    options: {
      method: "GET",
    },
  });
  return response as GetTeamsResponse;
}

async function createTeam(
  formData: CreateTeamRequest
): Promise<CreateTeamResponse> {
  const response = await httpWrapper({
    url: `${API_URL}`,
    toast: {
      showToast: true,
      successMessage: "Create Team successfully",
      errorMessage: "Error creating team:",
    },
    options: {
      method: "POST",
      body: JSON.stringify(formData),
    },
  });
  return response as CreateTeamResponse;
}

async function getTeam(teamId: string): Promise<GetTeamsResponse> {
  const response = await httpWrapper({
    url: `${API_URL}/${teamId}`,
    toast: {
      showToast: false,
    },
    options: {
      method: "GET",
    },
  });
  return response as GetTeamsResponse;
}

async function addToTeam(
  teamId: string,
  userId: string,
  userName: string,
  role: AddUserDialogType
): Promise<void> {
  let resp;
  if (role == "member") {
    resp = await httpWrapper({
      url: `${API_URL}/${teamId}/members`,
      toast: {
        showToast: true,
        successMessage: "Add member to Team successfully",
        errorMessage: `Error adding member to team: #${teamId}`,
      },
      options: {
        method: "POST",
        body: JSON.stringify({ memberId: userId, memberName: userName }),
      },
    });
  } else if (role == "manager") {
    resp = await httpWrapper({
      url: `${API_URL}/${teamId}/managers`,
      toast: {
        showToast: true,
        successMessage: "Add Manager to Team successfully",
        errorMessage: `Error adding manager to team: #${teamId}`,
      },
      options: {
        method: "POST",
        body: JSON.stringify({ managerId: userId, managerName: userName }),
      },
    });
  }
  return resp as void;
}

async function removeFromTeam(
  teamId: string,
  userId: string,
  role: AddUserDialogType
): Promise<void> {
  let resp;
  if (role == "member") {
    resp = await httpWrapper({
      url: `${API_URL}/${teamId}/members/${userId}`,
      toast: {
        showToast: true,
        successMessage: "Remove member from Team successfully",
        errorMessage: `Error removing member from team: #${teamId}`,
      },
      options: {
        method: "DELETE",
        body: JSON.stringify({ userId }),
      },
    });
  } else if (role == "manager") {
    resp = await httpWrapper({
      url: `${API_URL}/${teamId}/managers/${userId}`,
      toast: {
        showToast: true,
        successMessage: "Remove Manager from Team successfully",
        errorMessage: `Error removing manager from team: #${teamId}`,
      },
      options: {
        method: "DELETE",
        body: JSON.stringify({ userId }),
      },
    });
  }

  return resp as void;
}
export { addToTeam, createTeam, getTeam, getTeams, removeFromTeam };
