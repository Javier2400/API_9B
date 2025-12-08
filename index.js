import express from "express";
import cors from "cors";
import { connectDB } from "./db.js";
import { Card } from "./models/cards.js";

const app = express();
connectDB();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://exone.onrender.com"
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
  })
);

app.use(express.json());

const endpoints = [
  { method: "GET", path: "/", description: "Página con lista de endpoints" },
  { method: "POST", path: "/createCard", description: "Crear una nueva tarjeta" },
  { method: "GET", path: "/GetAllCards", description: "Obtener todas las tarjetas" },
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

    const newCard = new Card({ name, link, description });
    await newCard.save();

    res.status(201).json({ message: "Card creada correctamente", newCard });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/GetAllCards", async (req, res) => {
  try {
    const cards = await Card.find();
    res.status(200).json(cards);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get("/getCard/:id", async (req, res) => {
  try {
    const card = await Card.findById(req.params.id);
    if (!card) return res.status(404).json({ message: "Card no encontrada" });

    res.status(200).json(card);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.delete("/deleteCard/:id", async (req, res) => {
  try {
    const deleted = await Card.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Card no encontrada" });
    }

    res.status(200).json({ message: "Card eliminada", deleted });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/likeCard/:id", async (req, res) => {
  try {
    const { liked } = req.body; 

    const card = await Card.findByIdAndUpdate(
      req.params.id,
      { liked },
      { new: true }
    );

    if (!card) return res.status(404).json({ message: "Card no encontrada" });

    res.json(card);
  } catch (error) {
    res.status(500).json({ error: "Error updating like" });
  }
});

app.get("/hola", (req, res) => res.send("hallo"));
app.get("/hello", (req, res) => res.send("adabada"));


let datos = [];
let nextId = 1;

app.get("/api/datos", (req, res) => {
  res.json(datos);
});

app.post("/api/datos", (req, res) => {
  const { Nombre, Apellido, Grupo, PuntosExtra } = req.body;

  if (!Nombre || !Apellido || !Grupo || PuntosExtra === undefined) {
    return res.status(400).json({ error: "Faltan campos requeridos" });
  }

  const nuevo = { id: nextId++, Nombre, Apellido, Grupo, PuntosExtra };
  datos.push(nuevo);

  res.status(201).json({ mensaje: "Dato agregado correctamente", data: nuevo });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto http://localhost:${PORT}`);
});
