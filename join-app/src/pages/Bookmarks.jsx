import { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebaseConfig";
import { CircularProgress } from "@mui/material";
import Card from "../components/Card";
import "./Bookmarks.css";

const Bookmarks = () => {
  const { userInfo, loading } = useUser();
  const [bookmarkedCards, setBookmarkedCards] = useState([]);
  const [loadingBookmarks, setLoadingBookmarks] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookmarkedCards = async () => {
      if (userInfo && userInfo.uid) {
        try {
          const userDocRef = doc(db, "users", userInfo.uid);
          const docSnap = await getDoc(userDocRef);

          if (docSnap.exists()) {
            const userData = docSnap.data();
            const userBookmarks = userData.bookmarks || [];
            setBookmarkedCards(userBookmarks);
          } else {
            console.error("No such document!");
          }
        } catch (error) {
          console.error("Error fetching bookmarks: ", error);
        } finally {
          setLoadingBookmarks(false);
        }
      }
    };

    fetchBookmarkedCards();
  }, [userInfo]);

  const handleAvatarClick = (cardUserID) => {
    if (userInfo.uid === cardUserID) {
      navigate(`/profile`);
    } else {
      navigate(`/user/${cardUserID}`);
    }
  };

  if (loading || loadingBookmarks) {
    return <CircularProgress />;
  }

  return (
    <div className="bookmarks">
      <h1>Bookmarked Cards</h1>
      <div className="cards-container">
        {bookmarkedCards.map(
          (card, index) =>
            card.postId &&
            card.name &&
            card.avatarUrl &&
            card.content &&
            card.cardUserID && (
              <Card
                key={index}
                postId={card.postId}
                name={card.name}
                avatarUrl={card.avatarUrl}
                content={card.content}
                cardUserID={card.cardUserID}
                onAvatarClick={handleAvatarClick}
              />
            )
        )}
      </div>
    </div>
  );
};

export default Bookmarks;

// import { useState, useEffect } from "react";
// import { useUser } from "../context/UserContext";
// import { useNavigate } from "react-router-dom";
// import { collection, doc, getDoc } from "firebase/firestore";
// import { db } from "../config/firebaseConfig";
// import { CircularProgress } from "@mui/material";
// import Card from "../components/Card";
// import "./Bookmarks.css";

// const Bookmarks = () => {
//   const { userInfo, loading } = useUser();
//   const [bookmarkedCards, setBookmarkedCards] = useState([]);
//   const [loadingBookmarks, setLoadingBookmarks] = useState(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchBookmarkedCards = async () => {
//       if (userInfo && userInfo.uid) {
//         try {
//           const userDocRef = doc(db, "users", userInfo.uid);
//           const docSnap = await getDoc(userDocRef);

//           if (docSnap.exists()) {
//             const userData = docSnap.data();
//             const userBookmarks = userData.bookmarks || [];
//             setBookmarkedCards(userBookmarks);
//           } else {
//             console.error("No such document!");
//           }
//         } catch (error) {
//           console.error("Error fetching bookmarks: ", error);
//         } finally {
//           setLoadingBookmarks(false);
//         }
//       }
//     };

//     fetchBookmarkedCards();
//   }, [userInfo]);

//   const handleAvatarClick = (cardUserID) => {
//     if (userInfo.uid === cardUserID) {
//       navigate(`/profile`);
//     } else {
//       navigate(`/user/${cardUserID}`);
//     }
//   };

//   if (loading || loadingBookmarks) {
//     return <CircularProgress />;
//   }

//   return (
//     <div className="bookmarks">
//       <h1>Bookmarked Cards</h1>
//       <div className="cards-container">
//         {bookmarkedCards.map(
//           (card, index) =>
//             // Ensure all required fields are present before rendering
//             card.postId &&
//             card.name &&
//             card.avatarUrl &&
//             card.content &&
//             card.cardUserID && (
//               <Card
//                 key={index}
//                 postId={card.postId}
//                 name={card.name}
//                 avatarUrl={card.avatarUrl}
//                 content={card.content}
//                 cardUserID={card.cardUserID}
//                 onAvatarClick={handleAvatarClick}
//               />
//             )
//         )}
//       </div>
//     </div>
//   );
// };

// export default Bookmarks;
