import { DashboardPage, LoginPage, RegisterPage, NotFoundPage } from "./pages";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { UserProvider } from "./hooks/UserContext";
import "./App.css";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <LoginPage />,
    },
    {
      path: "/register",
      element: <RegisterPage />,
    },
    {
      path: "/dashboard",
      element: <DashboardPage />,
    },
    {
      path: "*",
      element: <NotFoundPage />,
    },
  ]);

  return (
    <>
      <UserProvider>
        <RouterProvider router={router} />
      </UserProvider>
    </>
  );
}

export default App;
