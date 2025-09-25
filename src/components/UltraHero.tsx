import { useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ParticleSystem from './ParticleSystem';
import heroBackground from '@/assets/hero-bg.jpg';

gsap.registerPlugin(ScrollTrigger);

const UltraHero = () => {
  const heroRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();

  useEffect(() => {
    const hero = heroRef.current;
    const title = titleRef.current;
    const subtitle = subtitleRef.current;
    const button = buttonRef.current;
    const particles = particlesRef.current;

    if (hero && title && subtitle && button && particles) {
      // Initial animation sequence
      const tl = gsap.timeline();
      
      // Set initial states
      gsap.set([title, subtitle, button], { y: 100, opacity: 0 });
      gsap.set(particles, { opacity: 0 });

      // Animate in sequence
      tl.to(particles, { duration: 2, opacity: 1, ease: "power2.out" })
        .to(title, { 
          duration: 1.5, 
          y: 0, 
          opacity: 1, 
          ease: "power3.out",
          onComplete: () => {
            // Add 3D text effect
            gsap.to(title, {
              duration: 0.8,
              textShadow: "0 1px 0 hsl(51 100% 40%), 0 2px 0 hsl(51 100% 35%), 0 3px 0 hsl(51 100% 30%), 0 4px 8px rgba(0,0,0,0.3)",
              ease: "power2.out"
            });
          }
        }, "-=0.8")
        .to(subtitle, { duration: 1, y: 0, opacity: 1, ease: "power2.out" }, "-=0.5")
        .to(button, { 
          duration: 1, 
          y: 0, 
          opacity: 1, 
          ease: "power2.out",
          onComplete: () => {
            // Add liquid morph animation to button
            gsap.to(button.querySelector('button'), {
              duration: 4,
              borderRadius: "60% 40% 30% 70%/60% 30% 70% 40%",
              repeat: -1,
              yoyo: true,
              ease: "power1.inOut"
            });
          }
        }, "-=0.3");

      // Parallax scroll effect
      ScrollTrigger.create({
        trigger: hero,
        start: "top top",
        end: "bottom top",
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;
          gsap.to(hero, {
            duration: 0.1,
            y: progress * -200,
            scale: 1 + progress * 0.1,
            ease: "none"
          });
        }
      });

      // Floating elements animation
      const floatingElements = hero.querySelectorAll('.floating-element');
      floatingElements.forEach((element, index) => {
        gsap.to(element, {
          duration: 6 + index * 2,
          y: "-=100",
          x: `+=${Math.random() * 100 - 50}`,
          rotation: 360,
          repeat: -1,
          ease: "none",
          delay: index * 0.5
        });
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <section 
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden perspective-1000"
    >
      {/* Background Image with 3D Parallax */}
      <div className="absolute inset-0 z-0">
        <motion.img
          src={heroBackground}
          alt="Luxury floral background"
          className="w-full h-full object-cover opacity-20 transform-3d"
          initial={{ scale: 1.2, rotateX: -5 }}
          animate={{ scale: 1, rotateX: 0 }}
          transition={{ duration: 20, ease: "linear", repeat: Infinity, repeatType: "reverse" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/70 to-background/90" />
      </div>

      {/* 3D Particles */}
      <div ref={particlesRef} className="absolute inset-0 z-10">
        <ParticleSystem />
      </div>

      {/* Floating Gold Elements */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="floating-element absolute w-4 h-4 bg-primary/30 opacity-40"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            clipPath: i % 2 === 0 
              ? "polygon(50% 0%, 0% 100%, 100% 100%)" 
              : "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)"
          }}
          animate={{
            y: [0, -50, 0],
            x: [0, Math.random() * 30 - 15, 0],
            opacity: [0.3, 0.7, 0.3],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: 8 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 4,
            ease: "easeInOut"
          }}
        />
      ))}

      {/* Content */}
      <div className="relative z-20 text-center px-4 max-w-5xl mx-auto">
        <motion.div className="overflow-hidden">
          <h1 
            ref={titleRef}
            className="font-luxury text-6xl md:text-8xl lg:text-9xl font-bold text-foreground mb-6 tracking-wider text-3d transform-3d"
          >
            {"BEXYFLOWERS".split("").map((letter, i) => (
              <motion.span
                key={i}
                className="inline-block"
                style={{ transformOrigin: "50% 100%" }}
                initial={{ y: 100, opacity: 0, rotateX: -90 }}
                animate={{ 
                  y: 0, 
                  opacity: 1, 
                  rotateX: 0 
                }}
                transition={{
                  delay: i * 0.1,
                  duration: 0.8,
                  type: "spring",
                  stiffness: 100,
                  damping: 10
                }}
              >
                {letter}
              </motion.span>
            ))}
          </h1>
        </motion.div>
        
        <motion.div className="overflow-hidden">
          <p
            ref={subtitleRef}
            className="font-body text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            Crafting ultra-premium floral experiences with architectural precision and artistic excellence
          </p>
        </motion.div>

        <motion.div 
          ref={buttonRef}
          className="perspective-1000"
          whileHover={{ scale: 1.05, rotateX: 5 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            size="lg"
            className="font-body text-lg px-16 py-8 bg-primary text-primary-foreground font-semibold shadow-3d hover:shadow-luxury hover:glow-intense transition-3d border-2 border-primary-dark transform-3d relative overflow-hidden group"
          >
            <span className="relative z-10">SHOP LUXURY COLLECTION</span>
            <div className="absolute inset-0 bg-gradient-royal opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Button>
        </motion.div>
      </div>

      {/* Advanced Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 2 }}
      >
        <motion.div
          animate={{ y: [0, 15, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center text-muted-foreground cursor-pointer group"
          onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
        >
          <span className="font-body text-sm mb-4 tracking-wide opacity-80 group-hover:opacity-100 transition-opacity">
            DISCOVER LUXURY
          </span>
          <div className="relative">
            <ChevronDown className="w-8 h-8 text-primary animate-pulse-gold" />
            <motion.div
              className="absolute inset-0 border-2 border-primary rounded-full"
              animate={{ scale: [1, 1.5], opacity: [1, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default UltraHero;