import { useState, useEffect } from "react";
import {
  db,
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
} from "../config/firebaseConfig";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import "./Profile.css";
import { useParams } from "react-router-dom";

const UserProfile = () => {
  const { userId } = useParams();
  const [userInfo, setUserInfo] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (userId) {
        try {
          const docRef = doc(db, "users", userId);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setUserInfo(data);
            setImageUrl(data.imageUrl || "");
          } else {
            console.error("No such document!");
          }
        } catch (err) {
          console.error(err);
        }
      }
      setLoading(false);
    };

    fetchUserInfo();
  }, [userId]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const updateCardsImage = async (newImageUrl) => {
    if (userId) {
      const q = query(collection(db, "cards"), where("userID", "==", userId));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(async (cardDoc) => {
        await updateDoc(doc(db, "cards", cardDoc.id), {
          avatarUrl: newImageUrl,
        });
      });
    }
  };

  const handleSave = async () => {
    if (userId && file) {
      try {
        const storage = getStorage();
        const storageRef = ref(storage, `profileImages/${userId}`);
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);

        await setDoc(
          doc(db, "users", userId),
          { ...userInfo, imageUrl: downloadURL },
          { merge: true }
        );

        await updateCardsImage(downloadURL);

        setUserInfo((prev) => ({ ...prev, imageUrl: downloadURL }));
        setImageUrl(downloadURL);
        setIsEditing(false);
      } catch (err) {
        console.error(err);
      }
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="profile-page">
      {userInfo ? (
        <div className="user-info">
          <h2>User Info</h2>
          <p>
            <strong>Name:</strong> {userInfo.name}
          </p>
          <p>
            <strong>College:</strong> {userInfo.college}
          </p>
          <p>
            <strong>Interests:</strong> {userInfo.interests}
          </p>
          <div className="profile-image">
            <strong>Profile Image:</strong>
            {isEditing ? (
              <>
                <input type="file" onChange={handleFileChange} />
                <button onClick={handleSave}>Save</button>
              </>
            ) : (
              <>
                <img src={imageUrl} alt="Profile" className="profile-img" />
              </>
            )}
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default UserProfile;
