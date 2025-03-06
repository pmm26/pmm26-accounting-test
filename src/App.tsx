import { Suspense } from "react";
import { Routes, Route, useRoutes, Navigate } from "react-router-dom";
import ListInvoices from "./pages/ListInvoices";
import routes from "tempo-routes";
import CreateInvoicePage from "./pages/CreateInvoicePage";
import DashboardLayout from "./components/layout/DashboardLayout";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Logout from "./pages/Logout";
import AuthWrapper from "./components/auth/AuthWrapper";
import { useAuth } from "@clerk/clerk-react";
import AuthDiagnostics from "./pages/AuthDiagnostics";
import SupabaseDiagnostics from "./pages/SupabaseDiagnostics";
import ClerkJwtHelper from "./pages/ClerkJwtHelper";

function App() {
  // Tempo routes should be used with useRoutes hook
  const tempoRoutes =
    import.meta.env.VITE_TEMPO === "true" ? useRoutes(routes) : null;
  const { isSignedIn } = useAuth();

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <>
        {tempoRoutes}
        <Routes>
          {/* Public routes */}
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/auth-diagnostics" element={<AuthDiagnostics />} />
          <Route path="/supabase-diagnostics" element={<SupabaseDiagnostics />} />
          <Route path="/clerk-jwt-helper" element={<ClerkJwtHelper />} />

          {/* Add a catch-all for Tempo routes */}
          {import.meta.env.VITE_TEMPO === "true" && (
            <Route path="/tempobook/*" element={null} />
          )}

          {/* Protected routes */}
          <Route
            path="/"
            element={
              <AuthWrapper>
                <DashboardLayout activePath="/invoices" />
              </AuthWrapper>
            }
          >
            <Route index element={<ListInvoices />} />
            <Route path="create-invoice" element={<CreateInvoicePage />} />
          </Route>
        </Routes>
      </>
    </Suspense>
  );
}

export default App;
