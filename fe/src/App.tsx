// #region [Types Imports]
// #endregion

// #region [Libraries Imports]
import { createBrowserRouter } from "react-router"
import { RouterProvider } from "react-router/dom"
import { Toaster } from "@/components/ui/toaster";
// #endregion

// #region [Styles Imports]
import "./App.css"
// #endregion

// #region [Pages Imports]
import { Login } from "@/features/login/Login";
import { Dashboard } from "@/features/dashboard/Dashboard";
// #endregion

// #region [Utils Imports]
import { ProtectedRoute } from "@/utils/utils";
// #endregion

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />
  },{
    path: "/dashboard",
    element: <ProtectedRoute requiredRole="basic"><Dashboard /></ProtectedRoute>,
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