import { queryClient } from "@/query-client";
import { useMutation } from "@tanstack/react-query";
import { createTeam } from "../api";
import type { CreateTeamRequest } from "../api/types";
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

export { useCreateTeamMutation };
