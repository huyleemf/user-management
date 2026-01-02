import { useQuery } from "@tanstack/react-query";
import { getTeam, getTeams } from "../api";
import { QUERY } from "./keys";

function useGetTeamsQuery() {
  return useQuery({
    queryKey: QUERY.teams,
    queryFn: () => getTeams(),
  });
}

function useGetTeamByIdQuery(teamId: string, options?: { enabled: boolean }) {
  return useQuery({
    queryKey: QUERY.team(teamId),
    queryFn: () => getTeam(teamId),
    enabled: options?.enabled && !!teamId,
  });
}

export { useGetTeamsQuery, useGetTeamByIdQuery };
