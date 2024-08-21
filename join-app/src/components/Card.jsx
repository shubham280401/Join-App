import { useState, useEffect } from "react";
import { Avatar } from "@mui/material";
import { AiOutlineLike, AiOutlineStar, AiFillStar } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import {
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  getDoc,
} from "firebase/firestore";
import { db } from "../config/firebaseConfig";
import { useUser } from "../context/UserContext";
import "./Card.css";

const Card = ({
  name,
  avatarUrl,
  content,
  cardUserID,
  postId,
  onAvatarClick,
}) => {
  const navigate = useNavigate();
  const { userInfo } = useUser();
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    const checkIfBookmarked = async () => {
      if (userInfo && userInfo.uid && postId) {
        try {
          const userDocRef = doc(db, "users", userInfo.uid);
          const docSnap = await getDoc(userDocRef);
          if (docSnap.exists()) {
            const userData = docSnap.data();
            const userBookmarks = userData.bookmarks || [];
            const isBookmarked = userBookmarks.some(
              (bookmark) => bookmark.postId === postId
            );
            setBookmarked(isBookmarked);
          }
        } catch (error) {
          console.error("Error checking bookmarks: ", error);
        }
      }
    };

    checkIfBookmarked();
  }, [postId, userInfo]);

  const handleContentClick = () => {
    navigate(`/post/${postId}`);
  };
  const handleBookmarkClick = async () => {
    if (!userInfo || !userInfo.uid || !postId) return;

    try {
      const userDocRef = doc(db, "users", userInfo.uid);

      if (bookmarked) {
        // Remove from bookmarks
        await updateDoc(userDocRef, {
          bookmarks: arrayRemove({
            postId,
            name,
            avatarUrl,
            content,
            cardUserID: cardUserID || "unknown",
          }),
        });
        setBookmarked(false);
      } else {
        // Add to bookmarks
        await updateDoc(userDocRef, {
          bookmarks: arrayUnion({
            postId,
            name,
            avatarUrl,
            content,
            cardUserID: cardUserID || "unknown",
          }),
        });
        setBookmarked(true);
      }
    } catch (error) {
      console.error("Error updating bookmarks: ", error);
    }
  };

  // const handleBookmarkClick = async () => {
  //   if (!userInfo || !userInfo.uid || !postId) return;

  //   try {
  //     const userDocRef = doc(db, "users", userInfo.uid);

  //     if (bookmarked) {
  //       // Remove from bookmarks
  //       await updateDoc(userDocRef, {
  //         bookmarks: arrayRemove(userDocRef, { postId }),
  //       });
  //       setBookmarked(false);
  //     } else {
  //       // Add to bookmarks
  //       await updateDoc(userDocRef, {
  //         bookmarks: arrayUnion({
  //           postId,
  //           name,
  //           avatarUrl,
  //           content,
  //           cardUserID: cardUserID || "unknown",
  //         }),
  //       });
  //       setBookmarked(true);
  //     }
  //   } catch (error) {
  //     console.error("Error updating bookmarks: ", error);
  //   }
  // };

  return (
    <div className="card">
      <div className="card-header" onClick={() => onAvatarClick(cardUserID)}>
        <Avatar src={avatarUrl} alt={name} />
        <div className="card-name">{name}</div>
      </div>
      <div className="card-content" onClick={handleContentClick}>
        {content}
      </div>
      <div className="card-actions">
        <AiOutlineLike className="icon" />
        {bookmarked ? (
          <AiFillStar className="icon" onClick={handleBookmarkClick} />
        ) : (
          <AiOutlineStar className="icon" onClick={handleBookmarkClick} />
        )}
      </div>
    </div>
  );
};

export default Card;

// import { useState, useEffect } from "react";
// import { Avatar } from "@mui/material";
// import { AiOutlineLike, AiOutlineStar, AiFillStar } from "react-icons/ai";
// import { useNavigate } from "react-router-dom";
// import {
//   collection,
//   doc,
//   addDoc,
//   deleteDoc,
//   getDoc,
//   updateDoc,
//   arrayUnion,
//   arrayRemove,
// } from "firebase/firestore"; // Ensure correct imports including arrayUnion and arrayRemove
// import { db } from "../config/firebaseConfig";
// import { useUser } from "../context/UserContext";
// import "./Card.css";

// const Card = ({
//   name,
//   avatarUrl,
//   content,
//   cardUserID,
//   postId,
//   onAvatarClick,
// }) => {
//   const navigate = useNavigate();
//   const { userInfo } = useUser();
//   const [bookmarked, setBookmarked] = useState(false);

//   useEffect(() => {
//     const checkIfBookmarked = async () => {
//       if (userInfo && userInfo.uid && postId) {
//         try {
//           const userDocRef = doc(db, "users", userInfo.uid);
//           const docSnap = await getDoc(userDocRef);
//           if (docSnap.exists()) {
//             const userData = docSnap.data();
//             const userBookmarks = userData.bookmarks || [];
//             const isBookmarked = userBookmarks.some(
//               (bookmark) => bookmark.postId === postId
//             );
//             setBookmarked(isBookmarked);
//           }
//         } catch (error) {
//           console.error("Error checking bookmarks: ", error);
//         }
//       }
//     };

//     checkIfBookmarked();
//   }, [postId, userInfo]);

//   const handleContentClick = () => {
//     navigate(`/post/${postId}`);
//   };

//   const handleBookmarkClick = async () => {
//     if (!userInfo || !userInfo.uid || !postId) return;

//     try {
//       const userDocRef = doc(db, "users", userInfo.uid);

//       if (bookmarked) {
//         // Remove from bookmarks
//         await updateDoc(userDocRef, {
//           bookmarks: arrayRemove(userDocRef, { postId }),
//         });
//         setBookmarked(false);
//       } else {
//         // Add to bookmarks
//         await updateDoc(userDocRef, {
//           bookmarks: arrayUnion(userDocRef, {
//             postId,
//             name,
//             avatarUrl,
//             content,
//             cardUserID: cardUserID || "unknown",
//           }),
//         });
//         setBookmarked(true);
//       }
//     } catch (error) {
//       console.error("Error updating bookmarks: ", error);
//     }
//   };

//   return (
//     <div className="card">
//       <div className="card-header" onClick={() => onAvatarClick(cardUserID)}>
//         <Avatar src={avatarUrl} alt={name} />
//         <div className="card-name">{name}</div>
//       </div>
//       <div className="card-content" onClick={handleContentClick}>
//         {content}
//       </div>
//       <div className="card-actions">
//         <AiOutlineLike className="icon" />
//         {bookmarked ? (
//           <AiFillStar className="icon" onClick={handleBookmarkClick} />
//         ) : (
//           <AiOutlineStar className="icon" onClick={handleBookmarkClick} />
//         )}
//       </div>
//     </div>
//   );
// };

// export default Card;

// import { useState, useEffect } from "react";
// import { Avatar } from "@mui/material";
// import { AiOutlineLike, AiOutlineStar, AiFillStar } from "react-icons/ai";
// import { useNavigate } from "react-router-dom";
// import {
//   addDoc,
//   collection,
//   doc,
//   deleteDoc,
//   getDocs,
//   query,
//   where,
// } from "firebase/firestore";
// import { db } from "../config/firebaseConfig";
// import { useUser } from "../context/UserContext";
// import "./Card.css";

// const Card = ({
//   name,
//   avatarUrl,
//   content,
//   cardUserID,
//   postId,
//   onAvatarClick,
// }) => {
//   const navigate = useNavigate();
//   const { userInfo } = useUser();
//   const [bookmarked, setBookmarked] = useState(false);

//   useEffect(() => {
//     const checkIfBookmarked = async () => {
//       if (userInfo && userInfo.uid && postId) {
//         try {
//           const q = query(
//             collection(db, "bookmarks"),
//             where("postId", "==", postId),
//             where("userID", "==", userInfo.uid)
//           );
//           const querySnapshot = await getDocs(q);
//           if (!querySnapshot.empty) {
//             setBookmarked(true);
//           }
//         } catch (error) {
//           console.error("Error checking bookmarks: ", error);
//         }
//       }
//     };

//     checkIfBookmarked();
//   }, [postId, userInfo]);

//   const handleContentClick = () => {
//     navigate(`/post/${postId}`);
//   };

//   const handleBookmarkClick = async () => {
//     if (!userInfo || !userInfo.uid) return;
//     try {
//       const q = query(
//         collection(db, "bookmarks"),
//         where("postId", "==", postId),
//         where("userID", "==", userInfo.uid)
//       );
//       const querySnapshot = await getDocs(q);

//       if (!querySnapshot.empty) {
//         // Delete all matching documents
//         querySnapshot.forEach(async (docSnap) => {
//           await deleteDoc(doc(db, "bookmarks", docSnap.id));
//         });
//         setBookmarked(false);
//       } else {
//         await addDoc(collection(db, "bookmarks"), {
//           postId,
//           name,
//           avatarUrl,
//           content,
//           userID: userInfo.uid,
//           cardUserID: cardUserID ?? "unknown", // Default to "unknown" if cardUserID is undefined
//         });
//         setBookmarked(true);
//       }
//     } catch (error) {
//       console.error("Error updating bookmarks: ", error);
//     }
//   };

//   return (
//     <div className="card">
//       <div className="card-header" onClick={() => onAvatarClick(cardUserID)}>
//         <Avatar src={avatarUrl} alt={name} />
//         <div className="card-name">{name}</div>
//       </div>
//       <div className="card-content" onClick={handleContentClick}>
//         {content}
//       </div>
//       <div className="card-actions">
//         <AiOutlineLike className="icon" />
//         {bookmarked ? (
//           <AiFillStar className="icon" onClick={handleBookmarkClick} />
//         ) : (
//           <AiOutlineStar className="icon" onClick={handleBookmarkClick} />
//         )}
//       </div>
//     </div>
//   );
// };

// export default Card;

// import { Avatar } from "@mui/material";
// import { AiOutlineLike, AiOutlineStar } from "react-icons/ai";
// import { useNavigate } from "react-router-dom";
// import "./Card.css";

// const Card = ({ name, avatarUrl, content, userID, postId, onAvatarClick }) => {
//   const navigate = useNavigate();

//   const handleContentClick = () => {
//     navigate(`/post/${postId}`);
//   };

//   return (
//     <div className="card">
//       <div className="card-header" onClick={() => onAvatarClick(userID)}>
//         <Avatar src={avatarUrl} alt={name} />
//         <div className="card-name">{name}</div>
//       </div>
//       <div className="card-content" onClick={handleContentClick}>
//         {content}
//       </div>
//       <div className="card-actions">
//         <AiOutlineLike className="icon" />
//         <AiOutlineStar className="icon" />
//       </div>
//     </div>
//   );
// };

// export default Card;
