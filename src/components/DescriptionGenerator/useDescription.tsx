import { useState } from 'react';
import { generateVisualPrompt } from '../../prompt.ts';

const useDescription = () => {
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

      const prompt1: string = generateVisualPrompt(detailLevel, inputText);

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
                  `Eres un profesor de diseño gráfico y experto en síntesis visual. 
                  Tu única tarea es generar la descripción gráfica solicitada, ni más ni menos.`
              },
              { role: 'user', content: prompt1 }
            ],
            temperature: 0.7,
            max_tokens: 500,
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

  return {
    inputText,
    detailLevel,
    description,
    loading,
    error,
    OPENROUTER_KEY,
    setInputText,
    setDetailLevel,
    generateDescription
  };
};

export default useDescription;