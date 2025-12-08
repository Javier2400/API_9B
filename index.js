import express from "express";
import cors from "cors";
import { connectDB } from "./db.js";
import { Card } from "./models/cards.js";

const app = express();
connectDB();

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://exone.onrender.com",
    "https://cardsreact.onrender.com"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type"],
}));

app.use(express.json());

const endpoints = [
  { method: "GET", path: "/", description: "Página con lista de endpoints" },
  { method: "POST", path: "/createCard", description: "Crear una nueva tarjeta" },
  { method: "GET", path: "/getAllCards", description: "Obtener todas las tarjetas" },
  { method: "GET", path: "/getCard/:id", description: "Obtener una tarjeta por ID" },
  { method: "DELETE", path: "/deleteCard/:id", description: "Eliminar tarjeta" },
  { method: "PUT", path: "/likeCard/:id", description: "Actualizar like de tarjeta" },
  { method: "POST", path: "/send", description: "Enviar datos (user, email)" },
  { method: "GET", path: "/api/datos", description: "Obtener datos CSV" }
];

app.get("/", (req, res) => {
  res.status(200).send(`
    <html>
      <head><title>API Endpoints</title></head>
      <body>
        <h1>API Endpoints</h1>
        <pre>${JSON.stringify(endpoints, null, 2)}</pre>
      </body>
    </html>
  `);
});


app.post("/createCard", async (req, res) => {
  try {
    const { name, link, description } = req.body;

    const newCard = new Card({
      name,
      link,
      description,
      likes: 0,
    });

    await newCard.save();

    res.status(201).json(newCard);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/getAllCards", async (req, res) => {
  try {
    const cards = await Card.find();
    res.json(cards);
  } catch (err) {
    res.status(500).json({ error: "Error obteniendo cards" });
  }
});

app.delete("/deleteCard/:id", async (req, res) => {
  try {
    const deleted = await Card.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Card no encontrada" });

    res.json({ message: "Card eliminada", deleted });
  } catch (err) {
    res.status(500).json({ error: "Error eliminando card" });
  }
});

app.put("/likeCard/:id", async (req, res) => {
  try {
    const { action } = req.body;

    if (!["like", "unlike"].includes(action)) {
      return res.status(400).json({ error: "Acción inválida" });
    }

    const card = await Card.findById(req.params.id);
    if (!card) return res.status(404).json({ error: "Card no encontrada" });

    card.likes = card.likes || 0;

    if (action === "like") {
      card.likes += 1;
    } else {
      card.likes = Math.max(0, card.likes - 1);
    }

    await card.save();

    res.json(card);
  } catch (err) {
    res.status(500).json({ error: "Error actualizando like" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Servidor en puerto " + PORT));