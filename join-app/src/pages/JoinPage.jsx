import { useForm } from "react-hook-form";
import { useState } from "react";
import { DevTool } from "@hookform/devtools";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import { Avatar } from "@mui/material";
import { FaArrowRight } from "react-icons/fa";
import {
  auth,
  provider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  db,
  doc,
  getDoc,
  setDoc,
} from "../config/firebaseConfig";
import "./LoginPage.css";
import { FcFilmReel } from "react-icons/fc";
import PasswordInput from "../components/PasswordInput";
import { Link } from "react-router-dom";

const JoinPage = () => {
  const navigate = useNavigate();
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { register, control, handleSubmit, formState } = form;
  const { errors } = formState;
  const [signUpError, setSignUpError] = useState("");

  const onSubmit = async (data) => {
    try {
      const userDoc = await getDoc(doc(db, "users", data.email));
      if (userDoc.exists()) {
        setSignUpError("User already exists. Please log in.");
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      console.log("Email/Password Sign-Up successful:", userCredential);

      await setDoc(doc(db, "users", userCredential.user.uid), {
        email: data.email,
      });

      navigate("/welcome", { state: { userId: userCredential.user.uid } });
    } catch (error) {
      console.error("Email/Password Sign-Up error:", error);
      setSignUpError("Sign-Up failed. Please try again.");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      console.log("Google Sign-In successful:", result);

      const userDoc = await getDoc(doc(db, "users", result.user.uid));
      if (userDoc.exists()) {
        setSignUpError("User already exists. Please log in.");
        return;
      }

      await setDoc(doc(db, "users", result.user.uid), {
        email: result.user.email,
      });

      navigate("/welcome", { state: { userId: result.user.uid } });
    } catch (error) {
      console.error("Google Sign-In error:", error);
      setSignUpError("Google Sign-In failed. Please try again.");
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
        <h2>Sign Up</h2>
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
              placeholder="you@youremail.com"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Please enter a valid email address",
                },
                validate: {
                  notAdmin: (fieldValue) => {
                    return (
                      fieldValue !== "admin@example.com" ||
                      "Enter different email"
                    );
                  },
                },
              })}
            />
            <p className="error">{errors.email?.message}</p>
          </div>
          <PasswordInput
            register={register}
            name="password"
            errors={errors}
            placeholder="At least 8 characters"
          />
          <Button className="login-btn">
            Join Peerlist
            <span className="icon">
              <FaArrowRight />
            </span>
          </Button>
          {signUpError && <p className="error">{signUpError}</p>}
        </form>
        <p className="no-profile">
          By clicking "Join Peerlist" you agree to our{" "}
          <a href="#">Code of Conduct</a>, <a href="#">Terms of Service</a> and{" "}
          <a href="#">Privacy Policy</a>.
        </p>
        <p className="no-profile">
          Already have a profile? <Link to="/login">Log in</Link>{" "}
        </p>
        <DevTool control={control} />
      </div>
    </div>
  );
};

export default JoinPage;
