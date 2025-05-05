export const prompt = (detailLevel: 'bajo' | 'medio' | 'alto', inputText: string): string => {
  const levelInstructions = {
    bajo: `Utiliza solo formas geométricas básicas (círculos, cuadrados, triángulos). Indica el tamaño relativo (grande, mediano, pequeño) y la posición de cada forma en la composición. Menciona colores solo si se trata de objetos específicos con un color característico (como “casa roja” o personajes reconocibles por color). No incluyas texturas ni detalles adicionales. Limita la respuesta a 2-3 frases claras.`,

    medio: `Combina formas básicas con ligeras variaciones (curvas, ángulos suaves, pequeñas irregularidades). Agrega 2 o 3 características visuales distintivas (como textura simple o distribución inusual). Especifica el tamaño relativo y posición de las formas. Sugiere colores cuando sean relevantes. Usa 3-4 frases descriptivas.`,

    alto: `Incluye todos los detalles visuales clave: dimensiones aproximadas, proporciones entre formas, sombras, textura visual, profundidad y relaciones espaciales. Indica colores concretos (nombre o valor HEX) para cada sección importante. Describe claramente el tamaño y ubicación precisa de cada elemento. Redáctalo en 4-5 frases detalladas sin mencionar el objeto original.`
  };

  return `Eres un sintetizador visual. Tu tarea es describir cómo representar visualmente el concepto: "${inputText}", según el nivel de detalle indicado.

**Pautas generales:**
1. Analiza las partes clave del concepto (por ejemplo, “toro” → cuernos) e inclúyelas sí o sí.
2. Comienza por la forma general y luego describe los elementos distintivos.
3. Usa lenguaje natural, sin estructuras rígidas ni comillas.
4. Nunca nombres directamente el objeto original ni menciones el nivel de detalle.

**Nivel actual: ${detailLevel.toUpperCase()}**
${levelInstructions[detailLevel]}

Ahora describe "${inputText}" siguiendo exactamente estas indicaciones:`;
};
