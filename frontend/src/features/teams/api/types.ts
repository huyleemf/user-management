export interface CreateTeamRequest {
  teamName: string;
  managers: {
    managerId: string;
    managerName: string;
  }[];
  members: {
    memberId: string;
    memberName: string;
  }[];
}

export interface CreateTeamResponse {
  message: string;
  team: {
    teamId: string;
    teamName: string;
    teamLeader: { userId: string; username: string };
    managers: any[];
    members: any[];
    createdAt: Date;
  };
}

export interface GetTeamsResponse {
  teamId: string;
  teamName: string;
  teamLeader: {
    userId: string;
    username: string;
  };
  managers: {
    managerId: string;
    managerName: string;
  }[];

  members: {
    memberId: string;
    memberName: string;
  }[];
}
