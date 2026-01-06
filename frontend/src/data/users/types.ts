export type User = {
  userId: string;
  username: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt: Date;
};

export type UserByRole = {
  userId: string;
  username: string;
  email: string;
};

export type UserRole = "MANAGER" | "MEMBER";
export const UserRoles = { MANAGER: "MANAGER", MEMBER: "MEMBER" };
