import "./App.css"
import { createBrowserRouter } from "react-router"
import { RouterProvider } from "react-router/dom"

// Pages
import { Login } from "./features/login/Login";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />
  }
]);

export const App = () => {
  return (
    <RouterProvider router={router} />
  )
}