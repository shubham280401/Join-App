import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MainPage from "./pages/MainPage";
import LoginPage from "./pages/LoginPage";
import JoinPage from "./pages/JoinPage";

import WelcomePage from "./pages/WelcomePage";
import Profile from "./pages/Profile";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Search from "./pages/Search";
import { UserProvider } from "./context/UserContext";
import { Provider } from "react-redux";
import store from "./redux/store";
import UserProfile from "./pages/UserProfile";
import Bookmarks from "./pages/Bookmarks";
import PostDetails from "./pages/PostDetails";

const App = () => {
  return (
    <Provider store={store}>
      <UserProvider>
        <Router>
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<JoinPage />} />
            <Route path="/welcome" element={<WelcomePage />} />
            <Route path="/" element={<Layout />}>
              <Route path="/profile" element={<Profile />} />
              <Route path="/home" element={<Home />} />
              <Route path="/search" element={<Search />} />
              <Route path="/user/:userId" element={<UserProfile />} />
              <Route path="/post/:postId" element={<PostDetails />} />
              <Route path="/bookmarks" element={<Bookmarks />} />
            </Route>
          </Routes>
        </Router>
      </UserProvider>
    </Provider>
  );
};

export default App;
