"use client";

import { useEffect, useRef } from 'react';

/**
 * 粒子背景 - 震撼的視覺效果
 * 數千個發光粒子，鼠標互動
 */
export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 設置 canvas 大小
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // 粒子類
    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;
      alpha: number;
      
      constructor() {
        this.x = Math.random() * canvas!.width;
        this.y = Math.random() * canvas!.height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.radius = Math.random() * 2 + 1;
        
        // 隨機顏色（電藍、紫紅、金色）
        const colors = [
          'rgba(0, 217, 255,',    // 電藍
          'rgba(192, 38, 211,',   // 紫紅
          'rgba(255, 193, 7,'     // 金色
        ];
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.alpha = Math.random() * 0.5 + 0.3;
      }

      update(mouse: { x: number; y: number }) {
        // 基礎移動
        this.x += this.vx;
        this.y += this.vy;

        // 邊界反彈
        if (this.x < 0 || this.x > canvas!.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas!.height) this.vy *= -1;

        // 鼠標互動 - 吸引/排斥
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 150) {
          const force = (150 - distance) / 150;
          this.vx += (dx / distance) * force * 0.1;
          this.vy += (dy / distance) * force * 0.1;
        }

        // 速度限制
        const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        if (speed > 2) {
          this.vx = (this.vx / speed) * 2;
          this.vy = (this.vy / speed) * 2;
        }

        // 摩擦力
        this.vx *= 0.99;
        this.vy *= 0.99;
      }

      draw() {
        if (!ctx) return;

        // 發光效果
        const gradient = ctx.createRadialGradient(
          this.x, this.y, 0,
          this.x, this.y, this.radius * 3
        );
        gradient.addColorStop(0, `${this.color} ${this.alpha})`);
        gradient.addColorStop(1, `${this.color} 0)`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * 3, 0, Math.PI * 2);
        ctx.fill();

        // 核心點
        ctx.fillStyle = `${this.color} ${this.alpha * 1.5})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // 創建粒子
    const particleCount = Math.min(150, Math.floor((canvas.width * canvas.height) / 10000));
    const particles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    // 鼠標位置
    const mouse = { x: canvas.width / 2, y: canvas.height / 2 };
    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // 連線函數
    const drawConnections = () => {
      particles.forEach((p1, i) => {
        particles.slice(i + 1).forEach(p2 => {
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 120) {
            const opacity = (1 - distance / 120) * 0.2;
            ctx!.strokeStyle = `rgba(0, 217, 255, ${opacity})`;
            ctx!.lineWidth = 0.5;
            ctx!.beginPath();
            ctx!.moveTo(p1.x, p1.y);
            ctx!.lineTo(p2.x, p2.y);
            ctx!.stroke();
          }
        });
      });
    };

    // 動畫循環
    let animationId: number;
    const animate = () => {
      ctx!.fillStyle = 'rgba(10, 25, 41, 0.1)';
      ctx!.fillRect(0, 0, canvas!.width, canvas!.height);

      // 繪製連線
      drawConnections();

      // 更新和繪製粒子
      particles.forEach(particle => {
        particle.update(mouse);
        particle.draw();
      });

      animationId = requestAnimationFrame(animate);
    };
    animate();

    // 清理
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}
