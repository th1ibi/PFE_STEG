import React, { useState, useEffect } from "react";

function Disjoncteurs() {
  const [disjoncteurs, setDisjoncteurs] = useState([]);
  const [socket, setSocket] = useState(null); // Stocker la connexion WebSocket

  // Fonction pour récupérer les disjoncteurs depuis FastAPI
  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:8000/disjoncteurs");
      const data = await response.json();
      
      // Trier les disjoncteurs par ordre croissant de l'ID
      data.sort((a, b) => a.id - b.id);

      setDisjoncteurs(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des disjoncteurs :", error);
    }
  };

  useEffect(() => {
    fetchData(); // Récupérer les données initiales

    // Créer la connexion WebSocket seulement si elle n'existe pas déjà
    const socket = new WebSocket("ws://localhost:8000/ws/disjoncteurs");

    socket.onopen = () => {
      console.log("WebSocket connecté !");
    };

    socket.onmessage = (event) => {
      const newData = JSON.parse(event.data);
      
      // Trier les nouvelles données par ordre croissant de l'ID
      newData.sort((a, b) => a.id - b.id);

      // Éviter les mises à jour inutiles si les données sont identiques
      if (JSON.stringify(newData) !== JSON.stringify(disjoncteurs)) {
        setDisjoncteurs(newData);
      }
    };

    socket.onerror = (error) => {
      console.error("WebSocket erreur :", error);
    };

    socket.onclose = () => {
      console.log("WebSocket déconnecté.");
    };

    setSocket(socket); // Stocker la connexion WebSocket

    // Nettoyage : fermer WebSocket à la destruction du composant
    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, []); // Ne dépendre de rien dans les dépendances pour éviter la boucle infinie

  // Fonction pour basculer l'état d'un disjoncteur
  const toggleDisjoncteur = async (id, etatActuel) => {
    const newEtat = etatActuel ? false : true; // Basculer entre 0 (fermé) et 1 (ouvert)

    try {
      const response = await fetch(`http://localhost:8000/disjoncteurs/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ etat: newEtat }),
      });

      if (response.ok) {
        fetchData(); // Rafraîchir les données après modification
      } else {
        console.error("Erreur lors de la mise à jour du disjoncteur");
      }
    } catch (error) {
      console.error("Erreur lors de la requête :", error);
    }
  };

  return (
    <div className="Disjoncteurs" style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <h1 style={{ textAlign: "center", fontSize: "2.8rem" }}>Disjoncteurs</h1>
      <div style={{ flex: 1, overflowY: "auto", padding: "20px" }}>
        <table border="1" style={{ width: "100%", borderCollapse: "collapse", fontSize: "1.7rem" }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nom</th>
              <th>État</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {disjoncteurs.length > 0 ? (
              disjoncteurs.map((disjoncteur) => (
                <tr key={disjoncteur.id}>
                  <td>{disjoncteur.id}</td>
                  <td>{disjoncteur.nom}</td>
                  <td
                    style={{
                      backgroundColor: disjoncteur.etat ? "green" : "red",
                      color: "white",
                      textAlign: "center",
                    }}
                  >
                    {disjoncteur.etat ? "Fermé" : "Ouvert"}
                  </td>
                  <td style={{ textAlign: "center" }}>
                    <button
                      onClick={() => toggleDisjoncteur(disjoncteur.id, disjoncteur.etat)}
                      style={{
                        padding: "8px 12px",
                        fontSize: "1.2rem",
                        cursor: "pointer",
                        backgroundColor: "blue",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                      }}
                    >
                      Modifier
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{ textAlign: "center" }}>Aucun disjoncteur trouvé.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Disjoncteurs;
