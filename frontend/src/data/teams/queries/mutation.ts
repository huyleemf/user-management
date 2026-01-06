import { queryClient } from "@/query-client";
import { useMutation } from "@tanstack/react-query";
import { addToTeam, createTeam, removeFromTeam } from "../../teams";
import type { CreateTeamRequest } from "../../teams/types";
import { MUTATION, QUERY } from "./keys";

function useCreateTeamMutation() {
  return useMutation({
    mutationKey: [MUTATION.teams],
    mutationFn: (formData: CreateTeamRequest) => createTeam(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY.teams });
    },
  });
}

function useAddUserToTeamMutation() {
  return useMutation({
    mutationKey: [MUTATION.teams],
    mutationFn: ({
      teamId,
      userId,
      username,
      role,
    }: {
      teamId: string;
      userId: string;
      username: string;
      role: "member" | "manager";
    }) => addToTeam(teamId, userId, username, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY.teams });
    },
  });
}
function useRemoveUserFromTeamMutation() {
  return useMutation({
    mutationKey: [MUTATION.teams],
    mutationFn: ({
      teamId,
      userId,
      role,
    }: {
      teamId: string;
      userId: string;
      role: "member" | "manager";
    }) => removeFromTeam(teamId, userId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY.teams });
    },
  });
}

export {
  useCreateTeamMutation,
  useAddUserToTeamMutation,
  useRemoveUserFromTeamMutation,
};
