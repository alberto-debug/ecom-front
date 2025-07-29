import { Routes, Route } from "react-router-dom";
import { Box } from "@chakra-ui/react";
import LoginPage from "./pages/LoginPage.tsx";
import AdminDashboard from "./pages/AdminDashboard.tsx";
import ManagerDashboard from "./pages/ManagerDashboard.tsx";
import ManagersPage from "./pages/ManagersPage.tsx";
import AuthGuard from "./guards/AuthGuard.tsx";
import ProductsCards from "./components/ProductsCards.tsx";

// Placeholder component for staff management
const StaffPage = () => <Box>Staff Management Page</Box>;

function App() {
  return (
    <Box minH="100vh" display="flex" flexDir="column">
      <Box flex="1">
        <Routes>
          <Route path="/" element={<LoginPage />} />

          <Route
            path="/admin/dashboard"
            element={
              <AuthGuard requiredRole="ROLE_ADMIN">
                <AdminDashboard />
              </AuthGuard>
            }
          />

          <Route
            path="/manager/dashboard"
            element={
              <AuthGuard requiredRole="ROLE_STAFF">
                <ManagerDashboard />
              </AuthGuard>
            }
          />

          <Route
            path="/admin/managers"
            element={
              <AuthGuard requiredRole="ROLE_ADMIN">
                <ManagersPage />
              </AuthGuard>
            }
          />

          <Route
            path="/admin/products"
            element={
              <AuthGuard requiredRole="ROLE_ADMIN">
                <ProductsCards
                  onCreate={() => {
                    console.log("Create Product");
                    // Add logic to open create modal or call API
                  }}
                  onList={() => {
                    console.log("List Products");
                    // Add logic to list products
                  }}
                  onUpdate={() => {
                    console.log("Update Product");
                    // Add logic to open update modal or API call
                  }}
                  onDelete={() => {
                    console.log("Delete Product");
                    // Add logic to open delete modal or API call
                  }}
                />
              </AuthGuard>
            }
          />

          <Route
            path="/admin/staff"
            element={
              <AuthGuard requiredRole="ROLE_ADMIN">
                <StaffPage />
              </AuthGuard>
            }
          />
        </Routes>
      </Box>
    </Box>
  );
}

export default App;
