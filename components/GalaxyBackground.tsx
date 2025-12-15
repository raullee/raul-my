
import React, { useRef, useEffect } from 'react';

const GalaxyBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let stars: { x: number; y: number; z: number; }[] = [];
    const starCount = 1500;
    let supernovaActive = false;
    let supernovaRadius = 0;
    let supernovaOpacity = 0;

    let mouse = {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
    };

    const setup = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        mouse = { x: canvas.width / 2, y: canvas.height / 2 };
        stars = [];
        for (let i = 0; i < starCount; i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                z: Math.random() * 2 + 0.5, // Depth factor
            });
        }
    };
    
    setup();

    const handleMouseMove = (event: MouseEvent) => {
        mouse.x = event.clientX;
        mouse.y = event.clientY;
    };
    
    const handleSupernova = () => {
        supernovaActive = true;
        supernovaRadius = 0;
        supernovaOpacity = 1;
        setTimeout(() => {
            supernovaActive = false;
        }, 3000);
    };

    window.addEventListener('resize', setup);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('supernova', handleSupernova);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      // Supernova Effect
      if (supernovaActive || supernovaOpacity > 0) {
          if (supernovaActive) supernovaRadius += 20;
          supernovaOpacity *= 0.96;
          
          const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, supernovaRadius);
          gradient.addColorStop(0, `rgba(255, 255, 255, ${supernovaOpacity})`);
          gradient.addColorStop(0.1, `rgba(100, 200, 255, ${supernovaOpacity * 0.8})`);
          gradient.addColorStop(0.4, `rgba(50, 100, 255, ${supernovaOpacity * 0.4})`);
          gradient.addColorStop(1, `rgba(0, 0, 0, 0)`);
          
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // The amount the mouse has moved from the center, used for parallax
      const mouseXFactor = (mouse.x - cx) * 0.00005;
      const mouseYFactor = (mouse.y - cy) * 0.00005;

      stars.forEach(star => {
        // Add a gentle drift
        star.x += 0.02 * star.z;
        if (star.x > canvas.width) {
            star.x = 0;
        }

        // Star position is offset by mouse movement and depth
        const x = star.x - mouseXFactor * star.z * 100;
        const y = star.y - mouseYFactor * star.z * 100;
        
        // Star size and opacity depend on depth
        const radius = 1.2 / star.z;
        const opacity = 1 / star.z * 0.8;

        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI);
        // Use a cooler, blueish-white for the stars
        ctx.fillStyle = `rgba(200, 220, 255, ${opacity})`;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(draw);
    };
    
    draw();
    
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', setup);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('supernova', handleSupernova);
    };
  }, []);
  
  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
};

export default GalaxyBackground;
