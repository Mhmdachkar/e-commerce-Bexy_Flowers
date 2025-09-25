import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";

export const CollectionHero = () => {
  const heroRef = useRef<HTMLElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Hero title animation
    const tl = gsap.timeline({ delay: 2 });
    
    tl.from(".hero-title .char", {
      y: 100,
      opacity: 0,
      rotationX: -90,
      duration: 0.8,
      ease: "back.out(1.7)",
      stagger: 0.05
    })
    .from(".hero-subtitle", {
      opacity: 0,
      y: 30,
      duration: 1,
      ease: "power2.out"
    }, "-=0.3")
    .from(".hero-description", {
      opacity: 0,
      y: 20,
      duration: 0.8,
      ease: "power2.out"
    }, "-=0.5");

    // Floating particles animation
    if (particlesRef.current) {
      const particles = particlesRef.current.children;
      gsap.set(particles, {
        x: () => gsap.utils.random(-200, 200),
        y: () => gsap.utils.random(-200, 200),
        scale: () => gsap.utils.random(0.5, 1.5),
        opacity: () => gsap.utils.random(0.3, 0.8)
      });

      gsap.to(particles, {
        y: "-=100",
        rotation: 360,
        duration: () => gsap.utils.random(10, 20),
        ease: "none",
        repeat: -1,
        stagger: {
          each: 0.5,
          repeat: -1
        }
      });
    }
  }, []);

  const splitText = (text: string) => {
    return text.split("").map((char, i) => (
      <span key={i} className="char inline-block" style={{ transformOrigin: "50% 100%" }}>
        {char === " " ? "\u00A0" : char}
      </span>
    ));
  };

  return (
    <section 
      ref={heroRef}
      className="relative h-screen flex items-center justify-center overflow-hidden"
      style={{
        background: `
          radial-gradient(circle at 20% 80%, hsl(var(--primary) / 0.1) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, hsl(var(--primary) / 0.15) 0%, transparent 50%),
          radial-gradient(circle at 40% 40%, hsl(var(--primary) / 0.05) 0%, transparent 50%)
        `
      }}
    >
      {/* Floating Particles Background */}
      <div ref={particlesRef} className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 20 }, (_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary rounded-full"
            style={{
              filter: "blur(0.5px)",
              boxShadow: "0 0 10px hsl(var(--primary))"
            }}
          />
        ))}
      </div>

      {/* Gradient Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-gold"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary/15 rounded-full blur-3xl animate-float"></div>

      {/* Hero Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
        <motion.div
          className="hero-title mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          <h1 className="text-6xl lg:text-8xl font-luxury text-foreground leading-tight">
            {splitText("Our Complete")}
            <br />
            <span className="text-primary">
              {splitText("Collection")}
            </span>
          </h1>
        </motion.div>

        <motion.p 
          className="hero-subtitle text-xl lg:text-2xl text-muted-foreground mb-6 font-body"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3 }}
        >
          Handcrafted luxury bouquets for every precious moment
        </motion.p>

        <motion.div
          className="hero-description text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3.5 }}
        >
          <p>
            Discover our curated collection of artisanal bouquets, each carefully designed 
            to celebrate life's most beautiful moments with elegance and sophistication.
          </p>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 4, duration: 1 }}
        >
          <div className="flex flex-col items-center text-muted-foreground">
            <span className="text-sm mb-2 font-body">Scroll to explore</span>
            <motion.div
              className="w-px h-12 bg-gradient-to-b from-primary to-transparent"
              animate={{ height: [12, 24, 12] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};