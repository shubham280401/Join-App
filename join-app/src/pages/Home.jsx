import { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";
import Card from "../components/Card";
import { AiOutlinePlus } from "react-icons/ai";
import { Avatar, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCards, addCard as addCardAction } from "../redux/cardsSlice";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../config/firebaseConfig";
import "./Home.css";

const Home = () => {
  const { userInfo, loading } = useUser();
  const [inputValue, setInputValue] = useState("");
  const dispatch = useDispatch();
  const { cards, loading: cardsLoading } = useSelector((state) => state.cards);
  const navigate = useNavigate();

  useEffect(() => {
    if (userInfo) {
      dispatch(fetchCards(userInfo.uid));
    }
  }, [userInfo, dispatch]);

  const handleAddCard = async () => {
    if (userInfo && inputValue.trim()) {
      console.log("userInfo:", userInfo); // Debugging line

      const newCard = {
        content: inputValue,
        name: userInfo.name,
        avatarUrl: userInfo.imageUrl,
        userID: userInfo.uid,
      };

      console.log("Adding new card with data:", newCard); // Debugging line

      try {
        const docRef = await addDoc(collection(db, "cards"), newCard);
        dispatch(addCardAction({ ...newCard, id: docRef.id }));
        setInputValue("");
      } catch (err) {
        console.error("Error adding card:", err);
      }
    } else {
      console.log("userInfo or inputValue is not available"); // Debugging line
    }
  };

  const handleAvatarClick = (cardUserID) => {
    if (userInfo.uid === cardUserID) {
      navigate(`/profile`);
    } else {
      navigate(`/user/${cardUserID}`);
    }
  };

  if (loading || cardsLoading) {
    return <CircularProgress />;
  }

  return (
    <div>
      <div className="home-head">Home</div>
      <div className="input-field">
        <Avatar
          src={userInfo?.imageUrl}
          alt={userInfo?.name}
          className="avatar"
        />
        <input
          type="text"
          placeholder="What are you working on?"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <AiOutlinePlus className="add-icon" onClick={handleAddCard} />
      </div>
      <div className="cards-container">
        {cards.map((card) => (
          <div key={card.id}>
            <Card
              postId={card.id}
              cardUserID={card.userID} // Corrected the prop name
              name={card.name}
              avatarUrl={card.avatarUrl}
              content={card.content}
              onAvatarClick={handleAvatarClick}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
