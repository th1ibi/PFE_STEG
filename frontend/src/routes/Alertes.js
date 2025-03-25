import React, { useState, useEffect } from "react";

function Alertes() {
  const [alertes, setAlertes] = useState([]);

  // Fonction pour récupérer les alertes depuis FastAPI
  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:8000/alertes");
      const data = await response.json();
      console.log("Alertes récupérées :", data); // Débogage

      // Trier les alertes par ordre croissant de l'ID
      data.sort((a, b) => b.id - a.id);

      setAlertes(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des alertes :", error);
    }
  };

  useEffect(() => {
    fetchData(); // Récupérer les alertes initiales

    // Connexion au WebSocket pour les mises à jour en temps réel des alertes
    const socket = new WebSocket("ws://localhost:8000/ws/alertes");

    socket.onmessage = (event) => {
      const newData = JSON.parse(event.data);
      
      // Trier les nouvelles alertes par ordre croissant de l'ID
      newData.sort((a, b) => b.id - a.id);

      // Éviter les mises à jour inutiles si les données sont identiques
      if (JSON.stringify(newData) !== JSON.stringify(alertes)) {
        setAlertes(newData);
        // Afficher une notification
        new Notification("Nouvelle alerte", {
          body: `${newData[newData.length - 1].type_alerte}: ${newData[newData.length - 1].message}`,
        });
      }
    };

    return () => socket.close(); // Fermer WebSocket à la destruction du composant
  }, [alertes]); // Dépendance sur 'alertes' pour gérer les mises à jour en temps réel

  // Fonction pour formater la date
  const formatDate = (dateString) => {
    const date = new Date(dateString); // Convertir la chaîne en objet Date
    return date.toLocaleString("fr-FR", { // Utiliser "fr-FR" pour le format DD/MM/YYYY
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false, // Format 24 heures
    });
  };

  return (
    <div className="Alertes" style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <h1 style={{ textAlign: "center", fontSize: "2.8rem" }}>Alertes</h1>
      <div style={{ flex: 1, overflowY: "auto", padding: "20px" }}>
        <table border="1" style={{ width: "100%", borderCollapse: "collapse", fontSize: "1.7rem" }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Type d'alerte</th>
              <th>Message</th>
              <th>Date</th>
              <th>ID Départ</th>
            </tr>
          </thead>
          <tbody>
            {alertes.length > 0 ? (
              alertes.map((alerte) => (
                <tr key={alerte.id}>
                  <td>{alerte.id}</td>
                  <td>{alerte.type_alerte}</td>
                  <td>{alerte.message}</td>
                  <td>{formatDate(alerte.date)}</td> {/* Formater la date ici */}
                  <td>{alerte.id_depart}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>
                  Aucune alerte trouvée.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Alertes;
