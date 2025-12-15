import React, { useRef, useEffect } from 'react';

const DotGridBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    
    const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };
    resizeCanvas();

    const handleMouseMove = (event: MouseEvent) => {
        mouse.current = { x: event.clientX, y: event.clientY };
    };

    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', handleMouseMove);

    const dotSpacing = 30;
    const dotRadius = 1;
    const interactionRadius = 150;
    const baseColor = 'rgba(100, 180, 255, 0.2)';

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < canvas.width + dotSpacing; i += dotSpacing) {
        for (let j = 0; j < canvas.height + dotSpacing; j += dotSpacing) {
          const dx = i - mouse.current.x;
          const dy = j - mouse.current.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          const opacityFactor = Math.max(0, 1 - distance / interactionRadius);
          const sizeFactor = 1 + 2 * opacityFactor;

          ctx.beginPath();
          ctx.arc(i, j, dotRadius * sizeFactor, 0, Math.PI * 2);

          if (distance < interactionRadius) {
            const gradient = ctx.createRadialGradient(i, j, 0, i, j, dotRadius * sizeFactor * 5);
            gradient.addColorStop(0, `rgba(139, 159, 255, ${opacityFactor * 0.8})`);
            gradient.addColorStop(1, 'transparent');
            ctx.fillStyle = gradient;
          } else {
             ctx.fillStyle = baseColor;
          }

          ctx.fill();

          // Connect lines to cursor
          if (distance < interactionRadius * 0.8) {
              ctx.beginPath();
              ctx.moveTo(i, j);
              ctx.lineTo(mouse.current.x, mouse.current.y);
              ctx.strokeStyle = `rgba(139, 159, 255, ${opacityFactor * 0.3})`;
              ctx.lineWidth = 0.5;
              ctx.stroke();
          }
        }
      }
      
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  
  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0, backgroundColor: '#000000' }}
    />
  );
};

export default DotGridBackground;