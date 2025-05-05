import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';
import AnimatedBackground from './components/AnimatedBackground.tsx';
import prompt from './prompt.ts';

const App = () => {
  const [inputText, setInputText] = useState('');
  const [detailLevel, setDetailLevel] = useState<'bajo' | 'medio' | 'alto'>('medio');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const OPENROUTER_KEY = import.meta.env.VITE_OPENROUTER_KEY;

  const generateDescription = async () => {
    if (!inputText.trim()) {
      setError('Por favor ingresa un concepto');
      return;
    }

    setLoading(true);
    setDescription('');
    setError('');

    try {
      if (!OPENROUTER_KEY) {
        throw new Error('API key no configurada. Agrega VITE_OPENROUTER_KEY en tu .env');
      }

      const prompt1: string = prompt(detailLevel, inputText);

      const response = await fetch(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${OPENROUTER_KEY}`,
            'Content-Type': 'application/json',
            Referer: window.location.origin,
            'X-Title': 'Concept Synthesizer',
          },
          body: JSON.stringify({
            model: 'openai/gpt-3.5-turbo',
            messages: [
              {
                role: 'system',
                content:
                  'Eres un profesor de diseño grafico y experto en sintetizar visualmente. Proporciona solo la descripción solicitada, sin introducciones ni conclusiones.'
              },
              { role: 'user', content: prompt1 }
            ],
            temperature: 0.7,
            max_tokens: 400,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Error en la API');
      }

      const data = await response.json();
      console.log('OpenRouter response:', data);

      const choice = data.choices?.[0];
      const result =
        choice?.message?.content?.trim() ||
        (typeof choice?.text === 'string' ? choice.text.trim() : '');

      if (!result) {
        setError('No se recibió una descripción válida. Revisa la consola para más detalles.');
        return;
      }

      setDescription(result);
    } catch (err) {
      console.error('Error:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <AnimatedBackground />
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="card"
      >
        <motion.h1
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          Síntesis
        </motion.h1>

        <motion.input
          type="text"
          value={inputText}
          onChange={(e) => {
            setInputText(e.target.value);
            setError('');
          }}
          placeholder="Ej: casa, perro, sombrero"
          maxLength={50}
          whileFocus={{ scale: 1.02 }}
          className={`input-field ${error ? 'error' : ''}`}
        />

        <motion.select
          value={detailLevel}
          onChange={(e) => setDetailLevel(e.target.value as 'bajo' | 'medio' | 'alto')}
          whileFocus={{ scale: 1.02 }}
          className="select-field"
        >
          <option value="bajo">Nivel Bajo (formas básicas)</option>
          <option value="medio">Nivel Medio (detalles simples)</option>
          <option value="alto">Nivel Alto (descripción completa)</option>
        </motion.select>

        <motion.button
          onClick={generateDescription}
          disabled={loading || !OPENROUTER_KEY}
          whileHover={{ scale: !loading && OPENROUTER_KEY ? 1.02 : 1 }}
          whileTap={{ scale: !loading && OPENROUTER_KEY ? 0.98 : 1 }}
          className="generate-button"
        >
          {!OPENROUTER_KEY
            ? 'Configura tu API key'
            : loading
            ? 'Generando...'
            : 'Generar Descripción'}
        </motion.button>

        <AnimatePresence>
          {!OPENROUTER_KEY && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="api-warning"
            >
              <p>⚠️ Necesitas configurar tu API key de OpenRouter:</p>
              <ol>
                <li>
                  Regístrate en{' '}
                  <a href="https://openrouter.ai/" target="_blank" rel="noopener noreferrer">
                    OpenRouter.ai
                  </a>
                </li>
                <li>Crea un archivo <code>.env</code> en la raíz de tu proyecto</li>
                <li>Agrega: <code>VITE_OPENROUTER_KEY=tu_api_key_aquí</code></li>
              </ol>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="error-message"
            >
              ⚠️ {error}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="description-container"
        >
          <h3>Descripción Visual:</h3>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="description-content"
          >
            {description || (loading ? (
              <motion.div
                initial={{ opacity: 0.5 }}
                animate={{ opacity: 1 }}
                transition={{ repeat: Infinity, repeatType: "reverse", duration: 1 }}
                className="loading-text"
              >
                Generando descripción...
              </motion.div>
            ) : 'La descripción aparecerá aquí')}
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default App;