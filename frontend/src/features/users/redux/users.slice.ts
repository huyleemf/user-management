export type Users = {
  userId: string;
  username: string;
  email: string;
  password: string;
  role: "MANAGER" | "MEMBER";
};

const initialState: Users[] = [];
