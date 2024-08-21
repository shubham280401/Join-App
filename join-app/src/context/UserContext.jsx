import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, db, doc, getDoc } from "../config/firebaseConfig";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setUserInfo({ uid: user.uid, ...docSnap.data() }); // Ensure uid is included
          } else {
            console.error("No such document!");
          }
        } catch (err) {
          console.error("Error fetching user data:", err);
        }
      }
      setLoading(false);
    };

    fetchUserInfo();
  }, []);

  return (
    <UserContext.Provider value={{ userInfo, loading, setUserInfo }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);

// // src/context/UserContext.js
// import { createContext, useContext, useState, useEffect } from "react";
// import { auth, db, doc, getDoc } from "../config/firebaseConfig";

// const UserContext = createContext();

// export const useUser = () => {
//   return useContext(UserContext);
// };

// export const UserProvider = ({ children }) => {
//   const [userInfo, setUserInfo] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null); // Add state for error handling

//   useEffect(() => {
//     const fetchUserInfo = async () => {
//       try {
//         const user = auth.currentUser;
//         if (user) {
//           const userDoc = await getDoc(doc(db, "users", user.uid));
//           if (userDoc.exists()) {
//             setUserInfo(userDoc.data());
//           } else {
//             setError("User document does not exist.");
//           }
//         } else {
//           setError("No user is currently logged in.");
//         }
//       } catch (error) {
//         console.error("Error fetching user data:", error);
//         setError("Error fetching user data.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUserInfo();
//   }, []); // Empty dependency array ensures this effect runs only once when component mounts

//   return (
//     <UserContext.Provider value={{ userInfo, setUserInfo, loading, error }}>
//       {children}
//     </UserContext.Provider>
//   );
// };
