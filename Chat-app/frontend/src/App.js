import { createBrowserRouter } from "react-router-dom";
import Home from "./components/Home";
import ChatPage from "./components/ChatPage/ChatPage";
import Layout from "./components/Layout";
import ErrorPage from "./components/ErrorPage";
import Login from "./components/Authentication/Login";
import Signup from "./components/Authentication/Signup";
import ProfileModel from "./components/modals/ProfileModal";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Home />,
        errorElement: <ErrorPage />,
        children: [
          {
            path: "login",
            element: <Login />,
          },
          {
            path: "signup",
            element: <Signup />,
          },
        ],
      },
      {
        path: "chatpage",
        element: <ChatPage />,
        errorElement: <ErrorPage />,
      },
    ],
  },
]);
