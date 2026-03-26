require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

console.log("Starting server...");

// ================= DATABASE =================

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected ✅"))
    .catch((err) => console.log(err));

// ================= SCHEMA =================

const contactSchema = new mongoose.Schema({
    name: String,
    email: String,
    message: String
});

const Contact = mongoose.model("Contact", contactSchema);

// ================= ROUTES =================

// Test route
app.get("/", (req, res) => {
    res.send("Backend Running 🚀");
});

// Save contact message
app.post("/contact", async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const newContact = new Contact({ name, email, message });
        await newContact.save();

        res.json({ message: "Message Saved Successfully ✅" });

    } catch (error) {
        res.status(500).json({ message: "Database error" });
    }
});

// View all messages
app.get("/messages", async (req, res) => {
    try {
        const messages = await Contact.find();
        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: "Error fetching messages" });
    }
});

// ================= SERVER =================

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});