import express from "express";
import { connectDB } from "./db.js";
import { Card } from "./models/cards.js";

const app = express();
connectDB();

app.use(express.json());

app.post("/createCard", async (req, res) => {
    try {
        const { name, link, description } = req.body;

        const newCard = new Card({
            name,
            link,
            description
        });

        await newCard.save();

        res.status(201).json({ message: "Card creada correctamente", newCard });
    } 
    catch (error) {
        console.error(error.message);
        return res.status(500).json({ error: error.message });
    }
});

app.get("/getAllCards", async (req, res) => {
    try {
        const cards = await Card.find();
        res.status(200).json(cards);
    } 
    catch (error) {
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
    } 
    catch (error) {
        console.error(error);
        res.status(400).send(error);
    }
});

app.get("/hola", (req, res) => {
    res.status(200).send("hallo");
});

app.post("/send", (req, res) => {
    const { user, email } = req.body;
    console.log("Datos recibidos:", user, email);
    res.status(200).send("Data received successfully");
});

app.get("/hello", (req, res) => {
    res.status(200).send("adabada");
});

app.listen(3000, () => {
    console.log("Servidor corriendo en http://localhost:3000");
});
