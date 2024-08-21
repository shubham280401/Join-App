import {
  addDoc,
  collection,
  query,
  where,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import { db } from "../config/firebaseConfig"; // adjust the path according to your project structure

// Function to add a comment to a specific post
export const addComment = async (postId, userId, content) => {
  try {
    await addDoc(collection(db, "comments"), {
      postId,
      userId,
      content,
      timestamp: Timestamp.now(),
    });
    console.log("Comment added successfully");
  } catch (error) {
    console.error("Error adding comment: ", error);
  }
};

// Function to fetch comments for a specific post
export const fetchCommentsForPost = async (postId) => {
  try {
    const q = query(collection(db, "comments"), where("postId", "==", postId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching comments: ", error);
    return [];
  }
};
