// #region [Libraries]
import { createBrowserRouter } from "react-router"
import { RouterProvider } from "react-router/dom"
import { Toaster } from "@/components/ui/toaster";
// #endregion

// #region [Styles]
import "./App.css"
// #endregion

// #region [Pages]
import { Login } from "@/features/login/Login";
import { Dashboard } from "@/features/dashboard/Dashboard";
// #endregion
// #region [Utils]
import { ProtectedRoute } from "@/utils/utils";
// #endregion

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />
  },{
    path: "/dashboard",
    element: <ProtectedRoute><Dashboard /></ProtectedRoute>,
  }
]);

export const App = () => {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster />
    </>
  )
}