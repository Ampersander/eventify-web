import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
} from "react-router-dom";
import Error from "../screens/Error";
import Home from "../screens/Home";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    // errorElement: <Error />,
  },
  // {
  //   path,
  // },
]);

export default router;
