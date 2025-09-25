import React from "react";
import LoginForm from "../components/LoginForm";

const LoginPage = ({ onLogin }) => {
  return (
    <div className="flex items-center justify-center min-h-[70vh]">
        <LoginForm onLogin={onLogin} />
    </div>
  );
};

export default LoginPage;
