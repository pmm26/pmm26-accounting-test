import { Suspense } from "react";
import { Routes, Route, useRoutes } from "react-router-dom";
import ListInvoices from "./pages/ListInvoices";
import routes from "tempo-routes";
import CreateInvoicePage from "./pages/CreateInvoicePage";
import DashboardLayout from "./components/layout/DashboardLayout";

function App() {
  // Tempo routes should be used with useRoutes hook
  const tempoRoutes =
    import.meta.env.VITE_TEMPO === "true" ? useRoutes(routes) : null;

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <>
        {tempoRoutes}
        <Routes>
          <Route path="/" element={<DashboardLayout activePath="/invoices" />}>
            <Route index element={<ListInvoices />} />
            <Route path="create-invoice" element={<CreateInvoicePage />} />
          </Route>
        </Routes>
      </>
    </Suspense>
  );
}

export default App;
