import React, { useState, useEffect } from "react";

function PostesSources() {
  const [postes, setPostes] = useState([]);

  // Fonction pour récupérer les postes sources depuis FastAPI
  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:8000/postes_sources");
      const data = await response.json();
      console.log("Données récupérées :", data); // Débogage

      // Trier les postes par ordre croissant de l'ID
      data.sort((a, b) => a.id - b.id);

      setPostes(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des postes sources :", error);
    }
  };

  useEffect(() => {
    fetchData(); // Récupérer les données initiales

    // Connexion au WebSocket pour mise à jour en temps réel
    const socket = new WebSocket("ws://localhost:8000/ws/postes_sources");

    socket.onmessage = (event) => {
      const newData = JSON.parse(event.data);
      
      // Trier les nouvelles données par ordre croissant de l'ID
      newData.sort((a, b) => a.id - b.id);

      // Éviter les mises à jour inutiles si les données sont identiques
      if (JSON.stringify(newData) !== JSON.stringify(postes)) {
        setPostes(newData);
      }
    };

    return () => socket.close(); // Fermer WebSocket à la destruction du composant
  }, [postes]); // Dépendance sur 'postes' pour gérer les mises à jour en temps réel

  return (
    <div className="PostesSources" style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <h1 style={{ textAlign: "center", fontSize: "2.8rem"  }}>Postes Sources</h1>
      <div style={{ flex: 1, overflowY: "auto", padding: "20px" }}>
        <table border="1" style={{ width: "100%", borderCollapse: "collapse", fontSize: "1.7rem"  }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nom</th>
              <th>Énergie consommée (MVA)</th>
              <th>État</th>
            </tr>
          </thead>
          <tbody>
            {postes.length > 0 ? (
              postes.map((poste) => (
                <tr key={poste.id}>
                  <td>{poste.id}</td>
                  <td>{poste.nom}</td>
                  <td>{poste.energie_consomme_mva}</td>
                  <td
                    style={{
                      backgroundColor: poste.etat ? "green" : "red",
                      color: "white",
                      textAlign: "center",
                    }}
                  >
                    {poste.etat ? "Actif" : "Inactif"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{ textAlign: "center" }}>
                  Aucun poste trouvé.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PostesSources;
