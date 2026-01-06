import { storage } from "@/shared/utils/storage";
import SignInForm from "../components/form/sign-in";
import type { User } from "@/features/users/api/types";
import { useNavigate } from "react-router";
import { useEffect } from "react";

const SignIn = () => {
  const navigate = useNavigate();
  const user: User | null = storage.get("user");
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);
  return (
    <div>
      <SignInForm />
    </div>
  );
};

export default SignIn;
