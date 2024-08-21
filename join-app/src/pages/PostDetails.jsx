import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchCommentsForPost, addComment } from "../context/firebaseFunctions";
import { CircularProgress, Avatar } from "@mui/material";
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "../config/firebaseConfig"; // Import auth
import { AiOutlineLike, AiOutlineStar } from "react-icons/ai";
import "./PostDetails.css";

const PostDetail = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [loggedInUserId, setLoggedInUserId] = useState(null); // Add state for logged-in user ID

  useEffect(() => {
    const fetchPostAndComments = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          setLoggedInUserId(user.uid);

          const loggedInUserDoc = await getDoc(doc(db, "users", user.uid));
          if (loggedInUserDoc.exists()) {
            setLoggedInUser(loggedInUserDoc.data());
          }
        }

        const postDoc = await getDoc(doc(db, "cards", postId));
        if (postDoc.exists()) {
          setPost({ id: postDoc.id, ...postDoc.data() });
        } else {
          console.error("Post not found");
          setLoading(false);
          return;
        }

        const postComments = await fetchCommentsForPost(postId);

        const commentsWithImages = await Promise.all(
          postComments.map(async (comment) => {
            const userDoc = await getDoc(doc(db, "users", comment.userId));
            return {
              ...comment,
              imageUrl: userDoc.exists() ? userDoc.data().imageUrl : null,
            };
          })
        );

        setComments(commentsWithImages);

        setLoading(false);
      } catch (err) {
        console.error("Error fetching post and comments:", err);
        setLoading(false);
      }
    };

    fetchPostAndComments();
  }, [postId]);

  const handleAddComment = async () => {
    if (newComment.trim() && loggedInUserId) {
      await addComment(postId, loggedInUserId, newComment);
      setNewComment("");

      const postComments = await fetchCommentsForPost(postId);

      const commentsWithImages = await Promise.all(
        postComments.map(async (comment) => {
          const userDoc = await getDoc(doc(db, "users", comment.userId));
          return {
            ...comment,
            imageUrl: userDoc.exists() ? userDoc.data().imageUrl : null,
          };
        })
      );

      setComments(commentsWithImages);
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <div className="post-detail">
      <div className="post">
        <div className="post-header">
          <Avatar src={post.avatarUrl} alt={post.name} />
          <div className="post-name">{post.name}</div>
        </div>
        <div className="post-content">{post.content}</div>
        <div className="post-actions">
          <AiOutlineLike className="icon" />
          <AiOutlineStar className="icon" />
        </div>
      </div>
      <div className="comments-section">
        <div className="comment-input">
          <Avatar
            src={loggedInUser?.imageUrl}
            alt="User Avatar"
            className="comment-avatar"
          />
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment"
          />
          <button onClick={handleAddComment}>+</button>
        </div>
        {comments.map((comment) => (
          <div key={comment.id} className="comment">
            <Avatar
              src={comment.imageUrl}
              alt="User Avatar"
              className="comment-avatar"
            />
            <p>{comment.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostDetail;
