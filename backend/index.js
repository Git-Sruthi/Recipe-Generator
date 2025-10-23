
// --- Imports & Setup ---
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const admin = require("firebase-admin");
const multer = require("multer");
require("dotenv").config();
const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));
const { GoogleAuth } = require("google-auth-library");
const Together = require("together-ai");

// --- Firebase Admin Setup ---
const serviceAccount = require("./serviceAccountKey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();

// --- Express Setup ---
const app = express();
app.use(cors());
app.use(bodyParser.json());

const client = new Together({
  apiKey: process.env.TOGETHER_API_KEY,
});

// --- Multer Setup for Image Upload ---
const upload = multer({ storage: multer.memoryStorage() });

// --- Google OAuth Token Function ---
async function getAccessToken() {
  try {
    const auth = new GoogleAuth({
      scopes: [
        "https://www.googleapis.com/auth/cloud-platform",
        "https://www.googleapis.com/auth/generative-language",
      ],
    });
    const client = await auth.getClient();
    const res = await client.getAccessToken();
    const token = res?.token || res;
    if (!token) throw new Error("No access token returned");
    return token;
  } catch (err) {
    console.error("Failed to obtain OAuth access token:", err.message || err);
    return null;
  }
}

// ----------------------------------------------------------------------
// AUTHENTICATION APIs
// ----------------------------------------------------------------------

// --- Signup API ---
app.post("/api/auth/signup", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ message: "All fields are required" });

  try {
    const userRecord = await admin.auth().createUser({ email, password, displayName: name });
    await db.collection("users").doc(userRecord.uid).set({
      name,
      email,
      createdAt: new Date(),
    });
    res.status(201).json({ message: "User created", user: userRecord });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(400).json({ message: err.message });
  }
});

// --- Login API ---
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "All fields are required" });

  try {
    const firebaseApiKey = process.env.FIREBASE_API_KEY;
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${firebaseApiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, returnSecureToken: true }),
      }
    );

    const data = await response.json();
    if (data.error) return res.status(400).json({ message: data.error.message });

    const userDoc = await db.collection("users").doc(data.localId).get();
    const user = userDoc.exists ? userDoc.data() : { email };
    res.status(200).json({ message: "Login successful", user });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ----------------------------------------------------------------------
// IMAGE DETECTION API (Gemini / Vision AI)
// ----------------------------------------------------------------------
app.post("/api/external/detect-object", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No image uploaded" });

    const imageBase64 = req.file.buffer.toString("base64");
    console.log("Received image (base64 length):", imageBase64.length);

    const payload = {
      contents: [
        {
          role: "user",
          parts: [
            {
              text: "Detect all food ingredients in this image and return ONLY their names as a comma-separated list, nothing else. Example: 'egg, tomato, carrot'.",
            },
            { inline_data: { mime_type: "image/jpeg", data: imageBase64 } },
          ],
        },
      ],
    };

    const oauthToken = await getAccessToken();
    if (!oauthToken) return res.status(500).json({ error: "Missing OAuth token" });

    const response = await fetch(process.env.AI_STUDIO_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${oauthToken}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    console.log("AI raw response:", JSON.stringify(data, null, 2));

    const detectedText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!detectedText) return res.status(500).json({ error: "No ingredients detected" });

    // Split into array of ingredients
    const ingredients = detectedText
      .split(",")
      .map(item => item.trim().toLowerCase())
      .filter(Boolean);

    console.log("Detected ingredients:", ingredients);

    // ✅ Send simple response expected by frontend
    res.json({ ingredients });
  } catch (err) {
    console.error("Detection error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ----------------------------------------------------------------------
// RECIPE FETCHING API (MealDB)
// ----------------------------------------------------------------------
app.get("/api/external/recipes", async (req, res) => {
  const { ingredient } = req.query;
  if (!ingredient) return res.status(400).json({ error: "Missing ingredient" });

  try {
    const response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`
    );
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("MealDB error:", err);
    res.status(500).json({ error: "Failed to fetch recipes" });
  }
});

// app.post("/api/chat", async (req, res) => {
//   try {
//     console.log("🧠 Chatbot request received:", req.body);

//     const TOGETHER_API_URL = "https://api.together.xyz/v1/chat/completions";
//     const TOGETHER_API_KEY = process.env.TOGETHER_API_KEY || "YOUR_TOGETHER_API_KEY";

//     const payload = {
//       model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
//       messages: [
//         { role: "system", content: "You are a helpful recipe chatbot." },
//         {
//           role: "user",
//           content: req.body?.message?.content || req.body?.message || "hi",
//         },
//       ],
//     };

//     console.log("📦 Sending to Together:", JSON.stringify(payload, null, 2));

//     const response = await fetch(TOGETHER_API_URL, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${TOGETHER_API_KEY}`,
//       },
//       body: JSON.stringify(payload),
//     });

//     const text = await response.text();
//     console.log("📩 Raw Together API Response (first 200 chars):", text.slice(0, 200));

//     if (!response.ok) {
//       return res.status(response.status).json({
//         error: `Together API Error: ${response.status}`,
//         body: text,
//       });
//     }

//     const data = JSON.parse(text);
//     const reply = data?.choices?.[0]?.message?.content || "Sorry, no reply from model.";
//     console.log("🤖 Chatbot Reply:", reply);

//     res.json({ reply });
//   } catch (error) {
//     console.error("💥 Chatbot Error:", error);
//     res.status(500).json({ error: "Chatbot request failed." });
//   }
// });


app.post("/api/chat", async (req, res) => {
  try {
    const { message, recipe } = req.body;

    console.log("🧠 Chatbot request received:", { message, recipeName: recipe?.name });

    const recipeContext = `
You are a helpful cooking assistant. The user is asking about a recipe called "${recipe?.name || "Unknown"}".

Here are the recipe details:
- Ingredients: ${Array.isArray(recipe?.ingredients) ? recipe.ingredients.join(", ") : recipe?.ingredients || "Not available"}
- Instructions: ${recipe?.instructions || "Not available"}

Avoid long explanations or unnecessary details.
Give short, clear, and useful answers (2–3 sentences max).
When answering, refer specifically to this recipe and give clear, easy to understand, practical cooking advice.
    `;

    const payload = {
      model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
      messages: [
        { role: "system", content: recipeContext },
        { role: "user", content: message },
      ],
    };

    const response = await fetch("https://api.together.xyz/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.TOGETHER_API_KEY}`,
      },
      body: JSON.stringify(payload),
    });

    const text = await response.text();
    const data = JSON.parse(text);

    const reply = data?.choices?.[0]?.message?.content || "I'm not sure how to answer that.";
    console.log("🤖 Together AI Reply:", reply);

    res.json({ reply });
  } catch (err) {
    console.error("💥 Chatbot Error:", err);
    res.status(500).json({ error: "Chatbot request failed." });
  }
});



// ----------------------------------------------------------------------
// TEST ROUTE (Optional)
// ----------------------------------------------------------------------
app.get("/", (req, res) => {
  res.send("✅ Recipe Finder Backend is running...");
});

// ----------------------------------------------------------------------
// START SERVER
// ----------------------------------------------------------------------
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`🚀 Backend running at http://localhost:${PORT}`));
