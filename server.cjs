require('dotenv').config();
const express    = require('express');
const cors       = require('cors');
const axios      = require('axios');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/api/generate', async (req, res) => {
  const { prompt } = req.body;

  try {
    const hfResponse = await axios.post(
      'https://api-inference.huggingface.co/models/deepseek-ai/DeepSeek-Prover-V2-671B', // URL del modelo
      {
        inputs: prompt,
        parameters: { max_new_tokens: 100 }
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // HF devuelve un array de objetos { generated_text: "..." }
    const generated = hfResponse.data.generated_text || '';

    res.json({ result: generated.trim() });
  } catch (err) {
    console.error('Hugging Face error:', err.response?.data || err.message);
    res.status(500).json({ error: 'Error al generar descripción', details: err.response?.data || err.message });
  }
});

const PORT = 3001;
app.listen(PORT, () => console.log(`Servidor backend corriendo en http://localhost:${PORT}`));
