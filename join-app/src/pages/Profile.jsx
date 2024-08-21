import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  auth,
  db,
  doc,
  getDoc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
} from "../config/firebaseConfig";
import { useUser } from "../context/UserContext";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Card from "../components/Card";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  CircularProgress,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { updateUserCards } from "../redux/cardsSlice";
import "./Profile.css";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth"; // Import signOut from firebase/auth

const Profile = () => {
  const { userInfo, setUserInfo } = useUser();
  const [imageUrl, setImageUrl] = useState(userInfo?.imageUrl || "");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState(null);
  const [userCards, setUserCards] = useState([]);
  const [bookmarkedCards, setBookmarkedCards] = useState([]);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserInfo = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setUserInfo(data);
            setImageUrl(data.imageUrl || "");
          } else {
            console.error("No such document!");
          }
        } catch (err) {
          console.error("Error fetching user info:", err);
        } finally {
          setLoading(false);
        }
      }
    };

    if (!userInfo) {
      fetchUserInfo();
    } else {
      setLoading(false);
    }
  }, [userInfo, setUserInfo]);

  useEffect(() => {
    const fetchUserCards = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const q = query(
            collection(db, "cards"),
            where("userID", "==", user.uid)
          );
          const querySnapshot = await getDocs(q);
          const cards = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setUserCards(cards);
        } catch (err) {
          console.error("Error fetching user cards:", err);
        }
      }
    };

    fetchUserCards();
  }, []);

  useEffect(() => {
    const fetchBookmarkedCards = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const bookmarksRef = collection(db, "bookmarks");
          const q = query(bookmarksRef, where("userID", "==", user.uid));
          const querySnapshot = await getDocs(q);

          const validBookmarkedCards = querySnapshot.docs
            .filter((doc) => doc.data().cardID) // Filter out documents without a cardID
            .map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));

          setBookmarkedCards(validBookmarkedCards);
        } catch (err) {
          console.error("Error fetching bookmarked cards:", err);
        }
      }
    };

    fetchBookmarkedCards();
  }, [userInfo]); // Include userInfo dependency to update when user logs in or changes

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const updateCardsInfo = async (newName, newImageUrl) => {
    const user = auth.currentUser;
    if (user) {
      try {
        const q = query(
          collection(db, "cards"),
          where("userID", "==", user.uid)
        );
        const querySnapshot = await getDocs(q);
        const batch = db.batch();
        querySnapshot.forEach((cardDoc) => {
          const cardRef = doc(db, "cards", cardDoc.id);
          batch.update(cardRef, { name: newName, avatarUrl: newImageUrl });
        });
        await batch.commit();
      } catch (err) {
        console.error("Error updating cards info:", err);
      }
    }
  };

  const handleSave = async (data) => {
    const user = auth.currentUser;
    if (!user) return;

    setLoading(true);

    try {
      if (file) {
        // Upload profile image if file is selected
        const storage = getStorage();
        const storageRef = ref(storage, `profileImages/${user.uid}`);
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);

        // Update Firestore document with new data including imageUrl
        await setDoc(
          doc(db, "users", user.uid),
          { ...userInfo, ...data, imageUrl: downloadURL },
          { merge: true }
        );

        // Update cards information if necessary
        await updateCardsInfo(data.name, downloadURL);
        dispatch(
          updateUserCards({
            uid: user.uid,
            name: data.name,
            avatarUrl: downloadURL,
          })
        );

        // Update local state and UI
        setUserInfo((prev) => ({ ...prev, ...data, imageUrl: downloadURL }));
        setImageUrl(downloadURL);
      } else {
        // Update Firestore document with new data (excluding imageUrl if not updated)
        await setDoc(
          doc(db, "users", user.uid),
          { ...userInfo, ...data },
          { merge: true }
        );

        // Update cards information if necessary
        await updateCardsInfo(data.name, userInfo.imageUrl);
        dispatch(
          updateUserCards({
            uid: user.uid,
            name: data.name,
            avatarUrl: userInfo.imageUrl,
          })
        );

        // Update local state and UI
        setUserInfo((prev) => ({ ...prev, ...data }));
      }
    } catch (err) {
      console.error("Error saving profile:", err);
    } finally {
      setLoading(false);
      setIsEditing(false);
      reset();
    }
  };

  const handleClose = () => {
    setIsEditing(false);
    reset();
  };

  const handleAvatarClick = (cardUserID) => {
    if (userInfo.uid === cardUserID) {
      navigate(`/profile`);
    } else {
      navigate(`/user/${cardUserID}`);
    }
  };

  const handleContentClick = (postId) => {
    navigate(`/post/${postId}`);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/"); // Redirect to the main page
    } catch (err) {
      console.error("Error signing out:", err);
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <div className="profile-page">
      {userInfo ? (
        <div className="user-info">
          <div className="profile-header">
            <div className="header-content">
              <img src={imageUrl} alt="Profile" className="profile-img" />
              <div className="profile-details">
                <h1>{userInfo.name}</h1>
                <p>{userInfo.college}</p>
                <p>{userInfo.interests}</p> {/* Display interests field */}
              </div>
            </div>
            <div className="btn-container">
              <button
                onClick={() => setIsEditing(true)}
                className="edit-button"
              >
                Edit Profile
              </button>
              <button onClick={handleLogout} className="logout-button">
                Logout
              </button>
            </div>
          </div>
          <hr className="divider" />
          <div className="profile-body">
            <h2>My Cards</h2>
            {userCards.map((card) => (
              <Card
                key={card.id}
                postId={card.id}
                userID={card.userID}
                name={card.name}
                avatarUrl={card.avatarUrl}
                content={card.content}
                cardUserID={card.userID}
                onAvatarClick={handleAvatarClick}
                onContentClick={handleContentClick}
              />
            ))}
            {/* <h2>Bookmarked Cards</h2>
            {bookmarkedCards.map((card) => (
              <Card
                key={card.id}
                postId={card.id}
                userID={card.userID}
                name={card.name}
                avatarUrl={card.avatarUrl}
                content={card.content}
                cardUserID={card.userID}
                onAvatarClick={handleAvatarClick}
                onContentClick={handleContentClick}
              />
            ))} */}
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
      <Dialog open={isEditing} onClose={handleClose}>
        <DialogTitle>
          Edit Profile
          <button
            onClick={handleClose}
            style={{
              position: "absolute",
              right: 8,
              top: 8,
              background: "none",
              border: "none",
              fontSize: "1.5rem",
              cursor: "pointer",
            }}
          >
            &times;
          </button>
        </DialogTitle>
        <DialogContent>
          <form
            onSubmit={handleSubmit(handleSave)}
            className="edit-profile-form"
          >
            <input type="file" onChange={handleFileChange} />
            <TextField
              label="Name"
              defaultValue={userInfo.name}
              {...register("name", { required: true })}
              fullWidth
              margin="normal"
            />
            {errors.name && <span>Name is required</span>}
            <TextField
              label="College"
              defaultValue={userInfo.college}
              {...register("college", { required: true })}
              fullWidth
              margin="normal"
            />
            {errors.college && <span>College is required</span>}
            <TextField
              label="Interests"
              defaultValue={userInfo.interests}
              {...register("interests")}
              fullWidth
              margin="normal"
            />
            <DialogActions>
              <Button onClick={handleClose} color="primary">
                Cancel
              </Button>
              <Button type="submit" color="primary">
                Save
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Profile;
