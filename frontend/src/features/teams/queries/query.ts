import { useQuery } from "@tanstack/react-query";
import { getTeams } from "../api";
import { QUERY } from "./keys";

function useGetTeamsQuery() {
  return useQuery({
    queryKey: QUERY.teams,
    queryFn: () => getTeams(),
  });
}

export { useGetTeamsQuery };
