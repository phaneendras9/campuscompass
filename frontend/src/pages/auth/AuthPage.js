import React, { useState } from 'react';
import LoginForm from '../../components/auth/LoginForm';
import RegisterForm from '../../components/auth/RegisterForm';


const AuthPage = () => {
  const [showLogin, setShowLogin] = useState(true);
  const toggle = () => setShowLogin(!showLogin);

  const handleLogin = (token) => {
    alert("Login successful");
    // Navigation handled in LoginForm
  };

  return (
    <div>
      {showLogin ? <LoginForm onLogin={handleLogin} /> : <RegisterForm />}
      <br />
      <button onClick={toggle}>
        {showLogin ? "Need an account? Register" : "Already registered? Login"}
      </button>
    </div>
  );
};

export default AuthPage;
