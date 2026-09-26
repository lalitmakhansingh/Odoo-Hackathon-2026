import { useLocation } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import AppRoutes from "./routes/AppRoutes";

function App() {
  const location = useLocation();

  const authPaths = [
    "/login",
    "/signup",
    "/forgot-password",
    "/verify-otp",
    "/reset-password",
  ];

  const isAuthPage = authPaths.includes(location.pathname);

  if (isAuthPage) {
    return <AppRoutes />;
  }

  return (
    <MainLayout>
      <AppRoutes />
    </MainLayout>
  );
}

export default App;