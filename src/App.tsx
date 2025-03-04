import { Suspense } from "react";
import { Routes, Route, useRoutes } from "react-router-dom";
import Home from "./components/home";
import CreateInvoicePage from "./components/dashboard/CreateInvoicePage";
import routes from "tempo-routes";

function App() {
  // Tempo routes should be used with useRoutes hook
  const tempoRoutes =
    import.meta.env.VITE_TEMPO === "true" ? useRoutes(routes) : null;

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <>
        {tempoRoutes}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create-invoice" element={<CreateInvoicePage />} />
        </Routes>
      </>
    </Suspense>
  );
}

export default App;
