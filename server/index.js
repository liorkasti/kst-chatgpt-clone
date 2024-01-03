const PORT = 8000;
const API_KEY = process.env.API_KEY;

const cors = require("cors");
const express = require("express");

const app = express();

app.use(express.json());
app.use(cors());

app.post("/api/chat", async (req, res) => {
  console.log("req.body", req.body);
  try {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: req.body.message }],
        max_tokens: 100,
      }),
    };

    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      requestOptions
    );
    const data = await response.json();
    res.send(data);
  } catch (error) {
    console.log("Error on POST /api/chat", error);
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});
