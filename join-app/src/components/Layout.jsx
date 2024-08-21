// src/components/Layout.jsx
import { Outlet, useNavigate } from "react-router-dom";
import { Avatar } from "@mui/material";
import { FcFilmReel } from "react-icons/fc";
import { GoHomeFill } from "react-icons/go";
import { FaSearch, FaRegBookmark } from "react-icons/fa";
import { useUser } from "../context/UserContext";
import "./Layout.css";

const Layout = () => {
  const navigate = useNavigate();
  const { userInfo, loading } = useUser();

  const handleAvatarClick = () => {
    navigate("/profile");
  };

  const handleHomeClick = () => {
    navigate("/home");
  };

  const handleSearchClick = () => {
    navigate("/search");
  };

  const handleBookmarkClick = () => {
    navigate("/bookmarks");
  };

  return (
    <div className="layout">
      <div className="sidebar left">
        <ul className="left-list">
          <div className="logo">
            <FcFilmReel className="main-logo" />
            <span>Join</span>
          </div>
          <button className="btn-left" onClick={handleHomeClick}>
            <GoHomeFill className="icon-gap" />
            Home
          </button>
          <button className="btn-left" onClick={handleSearchClick}>
            <FaSearch className="icon-gap" />
            Search
          </button>
          <button className="btn-left" onClick={handleBookmarkClick}>
            <FaRegBookmark className="icon-gap" /> Bookmarks
          </button>
        </ul>
      </div>
      <div className="main-content">
        <Outlet />
      </div>
      <div className="sidebar right">
        <Avatar
          alt="User Avatar"
          src={
            !loading
              ? userInfo?.imageUrl
              : "loading..." || "/path/to/default/avatar.png"
          }
          onClick={handleAvatarClick}
          style={{ cursor: "pointer" }}
        />
      </div>
    </div>
  );
};

export default Layout;
