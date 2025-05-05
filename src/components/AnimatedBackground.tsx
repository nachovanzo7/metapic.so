import { useEffect, useRef } from 'react';

const AnimatedBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const shapes = useRef<Array<{
    x: number;
    y: number;
    size: number;
    speedX: number;
    speedY: number;
    rotation: number;
    rotationSpeed: number;
    type: 'circle' | 'square' | 'triangle';
  }>>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Ajustar canvas al tamaño de la pantalla
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Crear formas iniciales
    const createShapes = () => {
      const newShapes = [];
      const shapeCount = 20; // Aumenté el número de formas

      for (let i = 0; i < shapeCount; i++) {
        newShapes.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: 30 + Math.random() * 70, // Tamaño más grande
          speedX: -2 + Math.random() * 4, // Mayor velocidad
          speedY: -2 + Math.random() * 4,
          rotation: Math.random() * 360,
          rotationSpeed: -0.5 + Math.random() * 1,
          type: ['circle', 'square', 'triangle'][Math.floor(Math.random() * 3)] as 'circle' | 'square' | 'triangle'
        });
      }

      shapes.current = newShapes;
    };

    // Detectar colisiones entre formas
    // Detectar colisiones entre formas con rebote elástico
const checkCollisions = () => {
    const shapesArr = shapes.current;
  
    for (let i = 0; i < shapesArr.length; i++) {
      for (let j = i + 1; j < shapesArr.length; j++) {
        const A = shapesArr[i];
        const B = shapesArr[j];
  
        // Vector de separación y distancia actual
        const dx = B.x - A.x;
        const dy = B.y - A.y;
        const dist = Math.hypot(dx, dy);
        const minDist = (A.size + B.size) / 2;
  
        if (dist < minDist) {
          // --- 1. Separar las formas para que no queden superpuestas ---
          const overlap = minDist - dist;
          const ux = dx / dist;
          const uy = dy / dist;
          A.x -= ux * (overlap / 2);
          A.y -= uy * (overlap / 2);
          B.x += ux * (overlap / 2);
          B.y += uy * (overlap / 2);
  
          // --- 2. Cálculo de velocidades tras rebote elástico ---
          // Masa proporcional al área (opcional)
          const mA = (A.size ** 2);
          const mB = (B.size ** 2);
  
          // Proyección de velocidades sobre la línea de impacto
          const vA = A.speedX * ux + A.speedY * uy;
          const vB = B.speedX * ux + B.speedY * uy;
  
          // Velocidades resultantes en la dirección de la línea de impacto
          const vA_final = (vA * (mA - mB) + 2 * mB * vB) / (mA + mB);
          const vB_final = (vB * (mB - mA) + 2 * mA * vA) / (mA + mB);
  
          // Componentes perpendiculares (no cambian)
          const perpX = -uy;
          const perpY = ux;
          const vA_perp = A.speedX * perpX + A.speedY * perpY;
          const vB_perp = B.speedX * perpX + B.speedY * perpY;
  
          // Reconstruir velocidades vectoriales
          A.speedX = ux * vA_final + perpX * vA_perp;
          A.speedY = uy * vA_final + perpY * vA_perp;
          B.speedX = ux * vB_final + perpX * vB_perp;
          B.speedY = uy * vB_final + perpY * vB_perp;
        }
      }
    }
  };
  

    // Dibujar una forma específica
    const drawShape = (shape: typeof shapes.current[0]) => {
      ctx.save();
      ctx.translate(shape.x, shape.y);
      ctx.rotate((shape.rotation * Math.PI) / 180);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)'; // Figuras negras con opacidad
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)'; // Borde blanco tenue
      ctx.lineWidth = 1;

      switch (shape.type) {
        case 'circle':
          ctx.beginPath();
          ctx.arc(0, 0, shape.size / 2, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
          break;
          
        case 'square':
          ctx.fillRect(-shape.size / 2, -shape.size / 2, shape.size, shape.size);
          ctx.strokeRect(-shape.size / 2, -shape.size / 2, shape.size, shape.size);
          break;
          
        case 'triangle':
          ctx.beginPath();
          ctx.moveTo(0, -shape.size / 2);
          ctx.lineTo(shape.size / 2, shape.size / 2);
          ctx.lineTo(-shape.size / 2, shape.size / 2);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
          break;
      }

      ctx.restore();
    };

    // Animación de las formas
    const animate = () => {
      if (!canvas || !ctx) return;

      // Fondo con ligero efecto de rastro
      ctx.fillStyle = 'rgba(10, 10, 10, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Actualizar y dibujar formas
      shapes.current.forEach((shape) => {
        // Actualizar posición
        shape.x += shape.speedX;
        shape.y += shape.speedY;
        shape.rotation += shape.rotationSpeed;

        // Rebotar en los bordes
        if (shape.x < shape.size / 2 || shape.x > canvas.width - shape.size / 2) {
          shape.speedX *= -1;
          shape.x = shape.x < shape.size / 2 ? shape.size / 2 : canvas.width - shape.size / 2;
        }
        
        if (shape.y < shape.size / 2 || shape.y > canvas.height - shape.size / 2) {
          shape.speedY *= -1;
          shape.y = shape.y < shape.size / 2 ? shape.size / 2 : canvas.height - shape.size / 2;
        }

        drawShape(shape);
      });

      // Verificar colisiones
      checkCollisions();

      requestAnimationFrame(animate);
    };

    createShapes();
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        backgroundColor: '#000000', // Fondo negro sólido
      }}
    />
  );
};

export default AnimatedBackground;