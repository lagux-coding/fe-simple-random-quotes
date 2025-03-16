import { useEffect, useRef } from "react";

interface MeteorShowerProps {
  color?: string;
  count?: number;
  speed?: number;
  starCount?: number;
  className?: string;
}

export default function MeteorShowerBackground({
  color = "#ffffff",
  count = 20,
  speed = 0.5,
  starCount = 150,
  className = "",
}: MeteorShowerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas to full screen
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    // Initialize meteors and stars
    let meteors: Meteor[] = [];
    let stars: Star[] = [];

    // Star class
    class Star {
      x: number;
      y: number;
      size: number;
      brightness: number;
      twinkleSpeed: number;
      twinkleDirection: number;
      maxBrightness: number;
      minBrightness: number;

      constructor() {
        this.x = Math.random() * canvas!.width;
        this.y = Math.random() * canvas!.height;
        this.size = 0.2 + Math.random() * 1.8;
        this.maxBrightness = 0.2 + Math.random() * 0.8;
        this.minBrightness = this.maxBrightness * 0.3;
        this.brightness =
          this.minBrightness +
          Math.random() * (this.maxBrightness - this.minBrightness);
        this.twinkleSpeed = 0.001 + Math.random() * 0.005;
        this.twinkleDirection = Math.random() > 0.5 ? 1 : -1;
      }

      draw() {
        if (!ctx) return;

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${this.brightness})`;
        ctx.fill();
        ctx.closePath();
      }

      twinkle() {
        // Make stars twinkle by changing brightness
        this.brightness += this.twinkleSpeed * this.twinkleDirection;

        // Reverse direction when reaching min/max brightness
        if (
          this.brightness >= this.maxBrightness ||
          this.brightness <= this.minBrightness
        ) {
          this.twinkleDirection *= -1;
        }
      }
    }

    // Meteor class
    class Meteor {
      x!: number;
      y!: number;
      length!: number;
      speed!: number;
      size!: number;
      opacity!: number;
      brightSpotSize!: number;

      constructor() {
        this.reset();
      }

      reset() {
        // Start from a random position at the top
        this.x = Math.random() * canvas!.width;
        this.y = -20 - Math.random() * 100;
        // Random length of the meteor trail
        this.length = 50 + Math.random() * 80;
        // Random speed
        this.speed = 1 + Math.random() * speed * 2;
        // Random size
        this.size = 0.5 + Math.random() * 1.5;
        // Random opacity
        this.opacity = 0.2 + Math.random() * 0.8;
        // Bright spot size (slightly larger than the trail)
        this.brightSpotSize = this.size * 1.5;
      }

      draw() {
        if (!ctx) return;

        // Calculate the end point of the meteor
        const endX = this.x + this.length * 0.7;
        const endY = this.y + this.length;

        // Draw the meteor trail
        ctx.beginPath();
        const gradient = ctx.createLinearGradient(
          this.x, // Start X (leading edge)
          this.y, // Start Y (leading edge)
          endX, // End X (trailing edge)
          endY // End Y (trailing edge)
        );

        // The gradient now goes from dim at the leading edge to bright at the trailing edge
        gradient.addColorStop(0, "rgba(255, 255, 255, 0.1)"); // Leading edge (dim)
        gradient.addColorStop(0.6, `rgba(${hexToRgb(color)}, ${this.opacity})`); // Middle
        gradient.addColorStop(
          1,
          `rgba(255, 255, 255, ${Math.min(1, this.opacity * 1.8)})`
        ); // Trailing edge (bright)

        ctx.strokeStyle = gradient;
        ctx.lineWidth = this.size;
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(endX, endY);
        ctx.stroke();
        ctx.closePath();

        // Draw a brighter glow at the trailing edge (end of the meteor)
        ctx.beginPath();
        ctx.arc(endX, endY, this.brightSpotSize, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(
          1,
          this.opacity * 1.5
        )})`;
        ctx.fill();
        ctx.closePath();
      }

      update() {
        // Move meteor diagonally
        this.x += this.speed * 0.7;
        this.y += this.speed;

        // Reset when it goes off screen
        if (this.y > canvas!.height || this.x > canvas!.width) {
          this.reset();
        }
      }
    }

    // Helper function to convert hex to rgb
    function hexToRgb(hex: string): string {
      // Remove # if present
      hex = hex.replace(/^#/, "");

      // Parse hex values
      const bigint = Number.parseInt(hex, 16);
      const r = (bigint >> 16) & 255;
      const g = (bigint >> 8) & 255;
      const b = bigint & 255;

      return `${r}, ${g}, ${b}`;
    }

    // Initialize meteors
    const initMeteors = () => {
      meteors = [];
      for (let i = 0; i < count; i++) {
        meteors.push(new Meteor());
        // Stagger initial positions
        meteors[i].y = Math.random() * canvas.height;
        meteors[i].x = Math.random() * canvas.width;
      }
    };

    // Initialize stars
    const initStars = () => {
      stars = [];
      for (let i = 0; i < starCount; i++) {
        stars.push(new Star());
      }
    };

    // Animation loop
    let animationFrameId: number;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw and update each star
      stars.forEach((star) => {
        star.draw();
        star.twinkle();
      });

      // Draw and update each meteor
      meteors.forEach((meteor) => {
        meteor.draw();
        meteor.update();
      });

      animationFrameId = window.requestAnimationFrame(render);
    };

    // Set up canvas and start animation
    resizeCanvas();
    initStars();
    initMeteors();
    render();

    // Handle window resize
    window.addEventListener("resize", () => {
      resizeCanvas();
      initStars();
      initMeteors();
    });

    // Clean up
    return () => {
      window.cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [color, count, speed, starCount]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 -z-10 bg-black ${className}`}
    />
  );
}
