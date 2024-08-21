import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { db, doc, setDoc } from "../config/firebaseConfig";
import Button from "../components/Button";
import "./WelcomePage.css";

const WelcomePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userId } = location.state || {};

  const form = useForm({
    defaultValues: {
      name: "",
      college: "",
      interests: "",
      imageUrl: "", // Add imageUrl to defaultValues
    },
  });

  const { register, handleSubmit, formState } = form;
  const { errors } = formState;

  const onSubmit = async (data) => {
    try {
      await setDoc(doc(db, "users", userId), {
        name: data.name,
        college: data.college,
        interests: data.interests,
        imageUrl: data.imageUrl, // Include imageUrl in the document
      });
      navigate("/feed");
    } catch (error) {
      console.error("Error saving user info:", error);
    }
  };

  return (
    <div className="welcome-page">
      <h2>Welcome! Let's get to know you better</h2>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            {...register("name", { required: "Name is required" })}
          />
          <p className="error">{errors.name?.message}</p>
        </div>
        <div className="form-group">
          <label htmlFor="college">College</label>
          <input
            type="text"
            id="college"
            {...register("college", { required: "College is required" })}
          />
          <p className="error">{errors.college?.message}</p>
        </div>
        <div className="form-group">
          <label htmlFor="interests">Interests</label>
          <input
            type="text"
            id="interests"
            {...register("interests", { required: "Interests are required" })}
          />
          <p className="error">{errors.interests?.message}</p>
        </div>
        <div className="form-group">
          <label htmlFor="imageUrl">Profile Image URL</label>
          <input type="text" id="imageUrl" {...register("imageUrl")} />
          <p className="error">{errors.imageUrl?.message}</p>
        </div>
        <Button className="submit-btn">Submit</Button>
      </form>
    </div>
  );
};

export default WelcomePage;
