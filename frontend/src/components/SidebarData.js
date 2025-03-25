import React from "react";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import * as IoIcons from "react-icons/io";
import * as MdIcons from "react-icons/md"; // Ajout d'icônes Material Design si nécessaire

export const SidebarData = [
  {
    title: "Accueil",
    path: "/",
    icon: <AiIcons.AiFillHome />,
    cName: "nav-text",
  },
  {
    title: "PostesSources",
    path: "/PostesSources",
    icon: <FaIcons.FaBuilding />, // Icône représentant un bâtiment (poste source)
    cName: "nav-text",
  },
  {
    title: "Départs",
    path: "/Départs",
    icon: <IoIcons.IoMdExit />, // Icône de sortie pour représenter les départs
    cName: "nav-text",
  },
  {
    title: "Disjoncteurs",
    path: "/Disjoncteurs",
    icon: <MdIcons.MdElectricalServices />, // Icône d'interrupteur pour représenter les disjoncteurs
    cName: "nav-text",
  },
  {
    title: "Alertes",
    path: "/Alertes",
    icon: <AiIcons.AiOutlineAlert />, // Icône d'alerte
    cName: "nav-text",
  },
  {
    title: "Statistiques",
    path: "/Statistiques",
    icon: <AiIcons.AiOutlineBarChart />, // Icône de graphique pour les statistiques
    cName: "nav-text",
  },
];
