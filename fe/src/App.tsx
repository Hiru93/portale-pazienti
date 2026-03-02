// #region [Types Imports]
// #endregion

// #region [Libraries Imports]
import { useEffect } from "react";
import { createBrowserRouter } from "react-router"
import { RouterProvider } from "react-router/dom"
import { Toaster } from "@/components/ui/toaster";
// #endregion

// #region [Styles Imports]
import styles from "./App.module.css"
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
  }, {
    path: "/dashboard",
    element: <ProtectedRoute requiredRole="basic"><Dashboard /></ProtectedRoute>,
  }
]);

export const App = () => {
  // Add gradient background class to body on mount and remove it on unmount
  useEffect(() => {
    document.body.classList.add(styles['gradient-background'])
    return () => { document.body.classList.remove(styles['gradient-background']) }
  }, [])
  
  return (
    <>
      <RouterProvider router={router} />
      <Toaster />
    </>
  )
}