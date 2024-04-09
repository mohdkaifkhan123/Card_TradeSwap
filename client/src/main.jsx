import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import App from "./App.jsx";
import Home from "./pages/Home.jsx";
import TradePage from "./pages/trade.jsx";
import ProfilePage from "./pages/profile.jsx";
import SignupPage from "./pages/Signup.jsx";
import LoginPage from "./pages/Login.jsx";
import UserSearchPage from "./pages/UserSearchPage.jsx";
import ErrorPage from "./pages/ErrorPage.jsx";
// import "./index.css";

// Fonts

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "/me",
        element: <ProfilePage></ProfilePage>,
      },
      {
        path: "/signup",
        element: <SignupPage></SignupPage>,
      },
      {
        path: "/login",
        element: <LoginPage></LoginPage>,
      },
      {
        path: "/trade",
        element: <TradePage></TradePage>,
      },
      {
        path: "/:username",
        element: <ProfilePage></ProfilePage>,
      },
      {
        path: "/userSearch",
        element: <UserSearchPage></UserSearchPage>,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
