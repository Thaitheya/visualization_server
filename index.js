const express = require("express");
const multer = require("multer");
const csv = require("csv-parser");
const fs = require("fs");
const cors = require("cors");
const { OpenAI } = require("openai");

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ dest: "uploads/" });
console.log("Started");
const openai = new OpenAI({
  apiKey:
    "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",
});
console.log(openai);
app.post("/upload", upload.single("file"), (req, res) => {
  const results = [];
  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on("data", (data) => results.push(data))
    .on("end", () => {
      res.json(results);
      fs.unlinkSync(req.file.path);
    });
});

app.post("/analyze", async (req, res) => {
  const data = req.body.data;
  const prompt = `
You are a data visualization assistant. Based on the following JSON data (first 20 rows),
suggest 2 to 4 charts and respond **only** with a valid JSON array using this format:

[
  {
    "type": "bar",
    "title": "Profit Distribution by Instrument",
    "labels": ["Instrument A", "Instrument B"],
    "data": [1200, 1500],
    "label": "Profit"
  }
]

Important:
- Respond with no explanation or extra text
- Only valid JSON array is expected

Data sample:
${JSON.stringify(data.slice(0, 20), null, 2)}
`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
    });

    res.json({ insights: response.choices[0].message.content });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));
