import { motion, AnimatePresence } from 'framer-motion';
import useDescription from './useDescription';
import '../../App.css';

const DescriptionGenerator = () => {
  const {
    inputText,
    detailLevel,
    description,
    loading,
    error,
    OPENROUTER_KEY,
    setInputText,
    setDetailLevel,
    generateDescription
  } = useDescription();

  return (
    <>
      
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="card"
      >
        <div className="title-container">
          <motion.h1
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            Metapic.so
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            transition={{ delay: 0.3 }}
            style={{color: 'white'}}
          >
            Transforma conceptos en descripciones visuales
          </motion.p>
        </div>

        <motion.input
          type="text"
          value={inputText}
          onChange={(e) => {
            setInputText(e.target.value);
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
              <p>Se necesita configurar tu API key de OpenRouter:</p>
              <ol>
                <li>
                  Regístrate en{' '}
                  <a href="https://openrouter.ai/" target="_blank" rel="noopener noreferrer">
                    OpenRouter.ai
                  </a>
                </li>
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
              Error: {error}
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

    </>
  );
};

export default DescriptionGenerator;