import { Link, useLocation } from "react-router-dom";
import Button from "../components/Button";
import { FcFilmReel } from "react-icons/fc";
import "./MainPage.css";

const MainPage = () => {
  const location = useLocation();

  // Check if the current pathname is the main page ("/")
  const isMainPage = location.pathname === "/";

  // Check if the current pathname is the feed page
  const isFeedPage = location.pathname === "/feed";

  // Render the additional content only if it's the main page
  const additionalContent = isMainPage ? (
    <div className="main-content">
      <h1 className="headline">
        A space to <span className="highlight">explore</span> and{" "}
        <span className="highlight">share</span> your favorite movies, books,
        gadgets, and more.
      </h1>
      <h2 className="subheadline">
        Create your own account, add your interests, and let others discover and
        review your picks.
      </h2>
    </div>
  ) : null;

  return (
    <div>
      <nav className="header">
        <div className="logo">
          <FcFilmReel className="main-logo" />
          <span>Join</span>
        </div>
        <ul className="nav-links">
          {!isFeedPage && (
            <>
              <li>
                <Link to="/login">
                  <Button className="login">Log In</Button>
                </Link>
              </li>
              <li>
                <Link to="/signup">
                  <Button className="sign-up">Sign Up</Button>
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
      {additionalContent}
    </div>
  );
};

export default MainPage;

// import { Link, useLocation } from "react-router-dom";
// import Button from "../components/Button";
// import "./MainPage.css";
// import { FcFilmReel } from "react-icons/fc";

// const MainPage = () => {
//   const location = useLocation();

//   // Check if the current pathname is the main page ("/")
//   const isMainPage = location.pathname === "/";

//   // Render the additional content only if it's the main page
//   const additionalContent = isMainPage ? (
//     <div className="main-content">
//       <h1 className="headline">
//         A space to <span className="highlight">explore</span> and{" "}
//         <span className="highlight">share</span> your favorite movies, books,
//         gadgets, and more.
//       </h1>
//       <h2 className="subheadline">
//         Create your own account, add your interests, and let others discover and
//         review your picks.
//       </h2>
//     </div>
//   ) : null;

//   return (
//     <div>
//       <nav className="header">
//         <div className="logo">
//           <FcFilmReel className="main-logo" />
//           <span>Join</span>
//         </div>
//         <ul className="nav-links">
//           <li>
//             <Link to="/login">
//               <Button className="login">Log In</Button>
//             </Link>
//           </li>
//           <li>
//             <Link to="/signup">
//               <Button className="sign-up">Sign Up</Button>
//             </Link>
//           </li>
//         </ul>
//       </nav>
//       {additionalContent}
//     </div>
//   );
// };

// export default MainPage;
