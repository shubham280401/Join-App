import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUsers, searchUsers } from "../redux/userSlice";
import { Avatar } from "@mui/material";
import "./Search.css";

const Search = () => {
  const [searchUser, setSearchUser] = useState("");
  const dispatch = useDispatch();
  const {
    data: users,
    loading,
    error,
  } = useSelector((state) => state.user.users);

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  const handleSearch = (e) => {
    setSearchUser(e.target.value);
    dispatch(searchUsers(e.target.value));
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <div className="search-head">Search Users</div>
      <div className="search-field">
        <input
          type="text"
          placeholder="Search users..."
          value={searchUser}
          onChange={handleSearch}
        />
      </div>
      <div className="users-container">
        {users.map((user) => (
          <div key={user.id} className="user-card">
            <Avatar
              src={user.imageUrl}
              alt={user.name}
              className="user-avatar"
            />
            <span className="user-name">{user.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Search;
