from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import psycopg2
from psycopg2.extras import RealDictCursor
import asyncio
import json
from starlette.websockets import WebSocket

app = FastAPI()

# Configuration CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Connexion à PostgreSQL
DB_CONFIG = {
    "dbname": "reseau_electrique",
    "user": "postgres",
    "password": "12345678",
    "host": "localhost",
    "port": "5432",
}


def get_db_connection():
    return psycopg2.connect(**DB_CONFIG, cursor_factory=RealDictCursor)


@app.get("/alertes")
def get_alertes():
    """Récupérer la liste des alertes triées par ID"""
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute(
        """
        SELECT id, type_alerte, message, date, entity_id AS id_depart
        FROM alertes
        ORDER BY id DESC;
        """
    )
    alertes = cur.fetchall()
    conn.close()
    return alertes


@app.websocket("/ws/alertes")
async def websocket_alertes(websocket: WebSocket):
    """WebSocket pour les mises à jour des alertes"""
    await websocket.accept()
    while True:
        await asyncio.sleep(5)  # Rafraîchir toutes les 5s
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute(
            """
            SELECT id, type_alerte, message, date, entity_id AS id_depart
            FROM alertes
            ORDER BY id DESC;
            """
        )
        alertes = cur.fetchall()
        conn.close()
        await websocket.send_text(json.dumps(alertes))


@app.get("/statistiques")
def get_statistiques():
    """Récupérer les statistiques des départs."""
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute(
        """
        SELECT id, nom, energie_consomme_mva
        FROM departs
        ORDER BY id ASC;
        """
    )
    statistiques = cur.fetchall()
    conn.close()
    return statistiques


@app.websocket("/ws/statistiques")
async def websocket_statistiques(websocket: WebSocket):
    """WebSocket pour mises à jour en temps réel des statistiques."""
    await websocket.accept()
    while True:
        await asyncio.sleep(5)  # Rafraîchir toutes les 5s
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute(
            """
            SELECT id, nom, energie_consomme_mva
            FROM departs
            ORDER BY id ASC;
            """
        )
        statistiques = cur.fetchall()
        conn.close()
        await websocket.send_text(json.dumps(statistiques))


@app.get("/disjoncteurs")
def get_disjoncteurs():
    """Récupérer la liste des disjoncteurs"""
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute(
        """
        SELECT id, nom, etat
        FROM disjoncteurs
        ORDER BY id ASC;
        """
    )
    disjoncteurs = cur.fetchall()
    conn.close()
    return disjoncteurs


@app.put("/disjoncteurs/{id}")
def update_disjoncteur(id: int, data: dict):
    """Mettre à jour l'état d'un disjoncteur"""
    new_etat = data.get("etat")
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute(
        """
        UPDATE disjoncteurs
        SET etat = %s
        WHERE id = %s
        RETURNING id, nom, etat;
        """,
        (new_etat, id),
    )
    updated_disjoncteur = cur.fetchone()
    conn.commit()
    conn.close()
    return updated_disjoncteur


@app.websocket("/ws/disjoncteurs")
async def websocket_disjoncteurs(websocket: WebSocket):
    """WebSocket pour mises à jour en temps réel"""
    await websocket.accept()
    while True:
        await asyncio.sleep(5)  # Rafraîchir toutes les 5s
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute(
            """
            SELECT id, nom, etat
            FROM disjoncteurs
            ORDER BY id ASC;
            """
        )
        disjoncteurs = cur.fetchall()
        conn.close()
        await websocket.send_text(json.dumps(disjoncteurs))


@app.get("/Départs")
def get_Départs():
    """Récupérer la liste des départs avec état des disjoncteurs"""
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute(
        """
        SELECT d.id, d.nom, d.energie_consomme_mva, d.etat,
               d.id_disjoncteur_prioritaire,
               dp.etat AS etat_disjoncteur_prioritaire,
               d.id_disjoncteur_secours, ds.etat AS etat_disjoncteur_secours
        FROM departs d
        LEFT JOIN disjoncteurs dp
            ON d.id_disjoncteur_prioritaire = dp.id
        LEFT JOIN disjoncteurs ds
            ON d.id_disjoncteur_secours = ds.id
        ORDER BY d.id ASC;
        """
    )
    Départs = cur.fetchall()
    conn.close()
    return Départs


@app.websocket("/ws/Départs")
async def websocket_Départs(websocket: WebSocket):
    """WebSocket pour les mises à jour des départs"""
    await websocket.accept()
    while True:
        await asyncio.sleep(5)
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute(
            """
            SELECT d.id, d.nom, d.energie_consomme_mva, d.etat,
                   d.id_disjoncteur_prioritaire,
                   dp.etat AS etat_disjoncteur_prioritaire,
                   d.id_disjoncteur_secours,
                   ds.etat AS etat_disjoncteur_secours
            FROM departs d
            LEFT JOIN disjoncteurs dp
                ON d.id_disjoncteur_prioritaire = dp.id
            LEFT JOIN disjoncteurs ds
                ON d.id_disjoncteur_secours = ds.id
            ORDER BY d.id ASC;
            """
        )
        Départs = cur.fetchall()
        conn.close()
        await websocket.send_text(json.dumps(Départs))


@app.get("/postes_sources")
def get_postes_sources():
    """Récupérer la liste des postes sources"""
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute(
        """
        SELECT id, nom, energie_consomme_mva, etat
        FROM postes_sources;
        """
    )
    postes = cur.fetchall()
    conn.close()
    return postes


@app.websocket("/ws/postes_sources")
async def websocket_postes_sources(websocket: WebSocket):
    """WebSocket pour les mises à jour des postes sources"""
    await websocket.accept()
    while True:
        await asyncio.sleep(5)  # Rafraîchir toutes les 5s
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute(
            """
            SELECT id, nom, energie_consomme_mva, etat
            FROM postes_sources;
            """
        )
        postes = cur.fetchall()
        conn.close()
        await websocket.send_text(json.dumps(postes))
