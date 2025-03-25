import Navbar from "./components/Navbar";
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Accueil from "./routes/Accueil";
import PostesSources from "./routes/PostesSources";
import Départs from "./routes/Départs";
import Disjoncteurs from "./routes/Disjoncteurs";
import Alertes from "./routes/Alertes";
import Statistiques from "./routes/Statistiques";
import "./App.css";

const AppLayout = () => (
  <>
    <Navbar />
    <Routes>
      <Route path="/" element={<Accueil />} />
      <Route path="/PostesSources" element={<PostesSources />} />
      <Route path="/Départs" element={<Départs />} />
      <Route path="/disjoncteurs" element={<Disjoncteurs />} />
      <Route path="/alertes" element={<Alertes />} />
      <Route path="/statistiques" element={<Statistiques />} />
    </Routes>
  </>
);

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AppLayout />
  </BrowserRouter>
);

