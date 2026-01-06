import { useAuthorization } from "@/shared/utils/roles";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import SignInForm from "./components/SignInForm";

const SignIn = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuthorization();
  useEffect(() => {
    if (currentUser) {
      navigate("/dashboard");
    }
  }, [currentUser, navigate]);
  return (
    <div>
      <SignInForm />
    </div>
  );
};

export default SignIn;
