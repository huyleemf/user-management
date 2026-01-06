import type { GetTeamsResponse } from "@/data/teams/types";
import type { User } from "@/data/users/types";
import { useCallback, useMemo } from "react";
import { storage } from "./storage";

export const ROLES = {
  MANAGER: "MANAGER",
  MEMBER: "MEMBER",
} as const;

export const useAuthorization = () => {
  const user: User | null = storage.get("user");

  const isManager = useMemo(() => user?.role === ROLES.MANAGER, [user?.role]);
  const isMember = useMemo(() => user?.role === ROLES.MEMBER, [user?.role]);

  const isTeamLeader = useCallback(
    (team: GetTeamsResponse): boolean => {
      return team.teamLeader?.userId === user?.userId;
    },
    [user?.userId]
  );

  const canAddMember = useCallback(
    (team: GetTeamsResponse): boolean => {
      return isManager || isTeamLeader(team);
    },
    [isManager, isTeamLeader]
  );

  const canRemoveMember = useCallback(
    (team: GetTeamsResponse): boolean => {
      return isManager || isTeamLeader(team);
    },
    [isManager, isTeamLeader]
  );
  const canAddManager = useCallback(
    (team: GetTeamsResponse): boolean => {
      return isTeamLeader(team);
    },
    [isTeamLeader]
  );

  const canRemoveManager = useCallback(
    (team: GetTeamsResponse, managerId: string): boolean => {
      if (!isManager) return false;
      if (!isTeamLeader(team)) return false;
      return managerId !== user?.userId;
    },
    [isManager, isTeamLeader, user?.userId]
  );

  return {
    isManager,
    isMember,

    isTeamLeader,

    canAddMember,
    canRemoveMember,

    canAddManager,
    canRemoveManager,

    currentUser: user,
  };
};
