import React, { useState, useEffect } from "react";
import "../App.css";

function Départs() {
  const [Départs, setDéparts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/Départs")
      .then((response) => response.json())
      .then((data) => {
        data.sort((a, b) => a.id - b.id); // Trier par ordre croissant de l'ID
        setDéparts(data);
      })
      .catch((error) => console.error("Erreur lors de la récupération des départs:", error));

    const socket = new WebSocket("ws://localhost:8000/ws/Départs");
    socket.onmessage = (event) => {
      const newData = JSON.parse(event.data);
      newData.sort((a, b) => a.id - b.id);
      setDéparts(newData);
    };

    return () => socket.close();
  }, []);

  return (
    <div className="Départs" style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <h1 style={{ textAlign: "center", fontSize: "2.8rem" }}>Départs</h1>
      <div style={{ flex: 1, overflow: "hidden", padding: "20px", display: "flex", flexDirection: "column" }}>
        <div style={{ flex: 1, overflowY: "auto" }}>
          <table border="1" style={{ width: "100%", borderCollapse: "collapse", height: "100%", fontSize: "1.9rem"  }}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nom</th>
                <th>Consommation (MVA)</th>
                <th>État</th>
                <th>ID Disjoncteur Prioritaire</th>
                <th>État Disjoncteur Prioritaire</th>
                <th>ID Disjoncteur Secours</th>
                <th>État Disjoncteur Secours</th>
              </tr>
            </thead>
            <tbody>
              {Départs.length > 0 ? (
                Départs.map((depart) => (
                  <tr key={depart.id}>
                    <td>{depart.id}</td>
                    <td>{depart.nom}</td>
                    <td>{depart.energie_consomme_mva}</td>
                    <td
                      style={{
                        backgroundColor: depart.etat ? "green" : "red",
                        color: "white",
                        textAlign: "center",
                      }}
                    >
                      {depart.etat ? "Alimenté" : "Non Alimenté"}
                    </td>
                    <td>{depart.id_disjoncteur_prioritaire}</td>
                    <td style={{ backgroundColor: depart.etat_disjoncteur_prioritaire ? "green" : "red", color: "white", textAlign: "center" }}>
                      {depart.etat_disjoncteur_prioritaire ? "Fermé" : "Ouvert"}
                    </td>
                    <td>{depart.id_disjoncteur_secours}</td>
                    <td style={{ backgroundColor: depart.etat_disjoncteur_secours ? "green" : "red", color: "white", textAlign: "center" }}>
                      {depart.etat_disjoncteur_secours ? "Fermé" : "Ouvert"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" style={{ textAlign: "center" }}>
                    Aucun départ trouvé.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Départs;
