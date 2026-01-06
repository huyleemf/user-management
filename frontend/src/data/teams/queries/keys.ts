export const MUTATION = {
  teams: ["teams", "mutation"] as const,
};

export const QUERY = {
  teams: ["teams", "query"] as const,
  team: (teamId: string) => ["teams", "query", "team", teamId] as const,
};
