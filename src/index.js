import express from "express";
import cors from "cors";
import axios from "axios";

// const express = require("express");
// const cors = require("cors");
// const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

// Replace below with your WhatsApp Cloud API info
const WHATSAPP_TOKEN = "752573994400673|ExJ1GPrR_XzOvO8BHs8FhkNOQk4";
const WHATSAPP_PHONE_NUMBER_ID = "752573994400673";
const OWNER_NUMBER = "917411624897"; // 91 for India

function buildWhatsAppMessage(form) {
  return `
*New Quote Request - Swagruha Interiors*
———————————
*Name:* ${form.name}
*Email:* ${form.email}
*Phone:* ${form.phone}
*Project Type:* ${form.projectType}
*Budget:* ${form.budget}
*Timeline:* ${form.timeline}
*Message:* ${form.message}
———————————
*Received on:* ${new Date().toLocaleString()}
  `.trim();
}

// POST endpoint called from frontend
app.post("/api/send-quote", async (req, res) => {
  const form = req.body;
  if (!form.name || !form.email || !form.phone) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const waMessage = buildWhatsAppMessage(form);

  try {
    // WhatsApp Cloud API send message
    await axios.post(
      `https://graph.facebook.com/v19.0/${WHATSAPP_PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: "whatsapp",
        to: OWNER_NUMBER,
        type: "text",
        text: { body: waMessage }
      },
      {
        headers: {
          Authorization: `Bearer ${WHATSAPP_TOKEN}`,
          "Content-Type": "application/json"
        }
      }
    );

    return res.status(200).json({ status: "Message sent" });

  } catch (err) {
    console.error(err.response?.data || err.message);
    return res.status(500).json({ error: "Failed to send WhatsApp message" });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log("Server running on", PORT));
