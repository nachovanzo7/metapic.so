export const generateVisualPrompt = (detailLevel: 'bajo' | 'medio' | 'alto', inputText: string): string => {
  const levelInstructions = {
      bajo: `
  Eres un profesor de diseño gráfico. 
  Describe de forma ultracompacta la figura de "${inputText}" usando solo:
  - Formas geométricas básicas (círculos, triángulos, rectángulos).
  - Relaciones espaciales (encima, al costado, dentro).
  No agregues color salvo que sea imprescindible para identificarlo. 
  Devuelve únicamente la descripción; sin saludos ni conclusiones.
  `.trim(),
  
      medio: `
  Eres un profesor de diseño gráfico. 
  Describe la figura de "${inputText}" usando:
  - Combinación de varias formas geométricas.
  - Detalles estructurales (grupos, base, divisiones simples).
  - Referencias espaciales claras (superpuestos, alineados, unidos).
  Menciona color si aporta a la identificación. 
  Devuelve únicamente la descripción; sin saludos ni conclusiones.
  `.trim(),
  
      alto: `
  Eres un profesor de diseño gráfico. 
  Describe con alto nivel de detalle la figura de "${inputText}" usando:
  - Múltiples formas geométricas y proporciones relativas.
  - Estructuras internas y texturas (líneas, sombreados).
  - Elementos adicionales (sombra, fondo, relieves) para enriquecer.
  Indica colores y sus ubicaciones exactas. 
  Devuelve únicamente la descripción; sin saludos ni conclusiones.
  `.trim(),
    };
  
    return levelInstructions[detailLevel];
  };
