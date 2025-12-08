import express from "express";
import cors from "cors";
import { connectDB } from "./db.js";
import { Card } from "./models/cards.js";
import fs from "fs";
import csv from "csv-parser"; 

const app = express();
connectDB();

app.use((req, res, next) => {
  const allowedOrigins = [
    "http://localhost:5173",
    "https://exone.onrender.com"
  ];

  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});


app.use(express.json());
app.options("/*", cors());



const endpoints = [
  { method: "POST", path: "/createCard" },
  { method: "GET", path: "/GetAllCards" },
  { method: "GET", path: "/getCard/:id" },
  { method: "POST", path: "/send" },
  { method: "DELETE", path: "/deleteCard/:id" },
  { method: "PUT", path: "/likeCard/:id" },
  { method: "GET", path: "/api/datos" },
];


app.get("/", (req, res) => {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <title>API Endpoints</title>
</head>
<body>
  <h1>API Endpoints</h1>
  <pre>${JSON.stringify(endpoints, null, 2)}</pre>
</body>
</html>
  `;
  res.status(200).send(html);
});

app.post("/createCard", async (req, res) => {
  try {
    const { name, link, description } = req.body;
    const newCard = new Card({ name, link, description });
    await newCard.save();

    res.status(201).json({ message: "Card creada correctamente", newCard });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
});

app.get("/GetAllCards", async (req, res) => {
  try {
    const cards = await Card.find();
    res.status(200).json(cards);
  } catch (error) {
    console.error(error);
    res.status(400).send(error);
  }
});

app.get("/getCard/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const card = await Card.findById(id);
    if (!card) return res.status(404).json({ message: "Card no encontrada" });
    res.status(200).json(card);
  } catch (error) {
    console.error(error);
    res.status(400).send(error);
  }
});

app.get("/hola", (req, res) => res.status(200).send("hallo"));
app.get("/hello", (req, res) => res.status(200).send("adabada"));

app.post("/send", (req, res) => {
  const { user, email } = req.body;
  console.log("Datos recibidos:", user, email);
  res.status(200).send("Data received successfully");
});


let datos = [];
let nextId = 1;

app.get("/api/datos", (req, res) => {
  res.status(200).json(datos);
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

app.delete("/deleteCard/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const deleted = await Card.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Card no encontrada" });
    }

    res.status(200).json({ message: "Card eliminada", deleted });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

app.put('/likeCard/:id', async (req, res) => {
  try {
    const cardId = req.params.id;
    const { liked } = req.body;

    const card = await Card.findByIdAndUpdate(
      cardId,
      { liked: liked },
      { new: true }
    );

    res.json(card);
  } catch (error) {
    res.status(500).json({ error: 'Error updating like' });
  }
});



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto http://localhost:${PORT}`);
});
