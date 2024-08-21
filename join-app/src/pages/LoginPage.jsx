import React from "react";
import { useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import { Avatar } from "@mui/material";
import {
  auth,
  provider,
  signInWithPopup,
  signInWithEmailAndPassword,
} from "../config/firebaseConfig";
import "./LoginPage.css";
import { FcFilmReel } from "react-icons/fc";
import PasswordInput from "../components/PasswordInput";
import { Link } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { register, control, handleSubmit, formState } = form;
  const { errors } = formState;
  const [loginError, setLoginError] = React.useState("");

  const onSubmit = async (data) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      console.log("Email/Password Sign-In successful:", userCredential);
      navigate("/home");
    } catch (error) {
      console.error("Email/Password Sign-In error:", error);
      if (error.code === "auth/user-not-found") {
        setLoginError("No user found with this email.");
      } else if (error.code === "auth/wrong-password") {
        setLoginError("Incorrect password.");
      } else {
        setLoginError("Login failed. Please try again.");
      }
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      console.log("Google Sign-In successful:", result);
      navigate("/feed");
    } catch (error) {
      console.error("Google Sign-In error:", error);
      setLoginError("Google Sign-In failed. Please try again.");
    }
  };

  return (
    <div className="login-page">
      <div className="content">
        <div className="name-logo">
          <FcFilmReel className="app-logo" />
          <h1>Join</h1>
        </div>

        <p>Connect with the most credible professionals!</p>
        <div className="join-peers">
          <div className="peer-avatars">
            <Avatar alt="Peer Avatar 1" src="/path/to/avatar1.png" />
            <Avatar alt="Peer Avatar 2" src="/path/to/avatar2.png" />
            <Avatar alt="Peer Avatar 3" src="/path/to/avatar3.png" />
            <Avatar alt="Peer Avatar 4" src="/path/to/avatar4.png" />
          </div>
          <span>Join 53000+ peers.</span>
        </div>
      </div>
      <div className="login-form">
        <h2>Log in</h2>
        <div className="social-login">
          <button className="google-login" onClick={handleGoogleLogin}>
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google icon"
            />
            Continue with Google
          </button>
        </div>
        <div className="divider">or continue with email</div>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="email-container">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Please enter a valid email address",
                },
              })}
            />
            <p className="error">{errors.email?.message}</p>
          </div>
          <PasswordInput register={register} name="password" errors={errors} />
          <a href="#" className="forgot-password">
            Forgot Password?
          </a>
          <Button className="login-btn">Login</Button>
          {loginError && <p className="error">{loginError}</p>}
        </form>
        <p className="no-profile">
          Don’t have a profile?<Link to="/signup">Join Us</Link>
        </p>
        <DevTool control={control} />
      </div>
    </div>
  );
};

export default LoginPage;
