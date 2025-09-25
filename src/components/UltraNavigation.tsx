import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  ShoppingCart, 
  Menu, 
  X, 
  Home, 
  Flower2, 
  Sparkles,
  Crown,
  Heart,
  Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import logoImage from '@/assets/bexy-flowers-logo.png';
import AnimatedFlowerLogoCanvas from './3D/AnimatedFlowerLogo';
import NavigationParticles from './3D/NavigationParticles';
import ThreeJSErrorBoundary from './3D/ThreeJSErrorBoundary';
import { useWebGL } from '../hooks/useWebGL';

gsap.registerPlugin(ScrollTrigger);

interface NavigationItem {
  name: string;
  path: string;
  icon: React.ReactNode;
  description: string;
}

const navigationItems: NavigationItem[] = [
  {
    name: "Home",
    path: "/",
    icon: <Home className="w-5 h-5" />,
    description: "Luxury Floral Experience"
  },
  {
    name: "Collection",
    path: "/collection",
    icon: <Flower2 className="w-5 h-5" />,
    description: "Premium Arrangements"
  },
  {
    name: "Custom",
    path: "/custom",
    icon: <Sparkles className="w-5 h-5" />,
    description: "Bespoke Creations"
  },
  {
    name: "About",
    path: "/about",
    icon: <Crown className="w-5 h-5" />,
    description: "Our Story"
  }
];

const UltraNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const navRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [cartItems, setCartItems] = useState(3); // Mock cart count
  const [threeJSError, setThreeJSError] = useState<Error | null>(null);
  
  // WebGL status
  const webgl = useWebGL();

  useEffect(() => {
    const nav = navRef.current;
    const logo = logoRef.current;

    if (nav && logo) {
      // Initial logo animation
      gsap.set(logo, { scale: 0, rotation: -180 });
      gsap.to(logo, {
        duration: 2,
        scale: 1,
        rotation: 0,
        ease: "elastic.out(1, 0.3)"
      });

       // Set initial platinum background immediately - no transitions
       gsap.set(nav, {
         backgroundColor: "rgba(229, 228, 226, 0.95)", // Always start with platinum
         backdropFilter: "blur(20px)",
         boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
         immediateRender: true // Force immediate render
       });

       // Scroll effect - maintain platinum background throughout
       ScrollTrigger.create({
         trigger: document.body,
         start: "top top",
         end: "bottom top",
         onUpdate: (self) => {
           setIsScrolled(self.progress > 0.1);
           
           // Always maintain platinum background with slight opacity adjustment
           gsap.to(nav, {
             duration: 0.3,
             backgroundColor: self.progress > 0.1 
               ? "rgba(229, 228, 226, 0.98)" // Slightly more opaque when scrolled
               : "rgba(229, 228, 226, 0.95)", // Slightly less opaque at top
             backdropFilter: "blur(20px)",
             boxShadow: self.progress > 0.1 
               ? "0 8px 32px rgba(0,0,0,0.15)"
               : "0 8px 32px rgba(0,0,0,0.1)",
             ease: "power2.out"
           });
         }
       });

      // Logo hover effect
      const logoButton = logo.querySelector('button');
      if (logoButton) {
        logoButton.addEventListener('mouseenter', () => {
          gsap.to(logo, {
            duration: 0.6,
            scale: 1.1,
            rotation: 5,
            ease: "power2.out"
          });
        });

        logoButton.addEventListener('mouseleave', () => {
          gsap.to(logo, {
            duration: 0.6,
            scale: 1,
            rotation: 0,
            ease: "power2.out"
          });
        });
      }
    }

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
    
    if (menuRef.current) {
      if (!isMenuOpen) {
        gsap.fromTo(menuRef.current, 
          { opacity: 0, y: -50, scale: 0.9 },
          { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "power2.out" }
        );
      }
    }
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  const handleThreeJSError = (error: Error) => {
    console.warn('3D Navigation Error:', error);
    setThreeJSError(error);
  };

  return (
    <>
      {/* 3D Background Particles */}
      {webgl.isReady && !threeJSError && (
        <NavigationParticles onError={handleThreeJSError} />
      )}

       <nav
         ref={navRef}
         className="ultra-navigation fixed top-0 left-0 right-0 z-50 backdrop-blur-xl shadow-luxury"
         style={{
           backgroundColor: 'rgba(229, 228, 226, 0.95)', // Always start with platinum background
           transition: 'none' // Remove transition to prevent black flash
         }}
       >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            
            {/* Animated Logo */}
            <motion.div
              ref={logoRef}
              className="flex items-center space-x-4"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="ghost"
                className="relative p-2 hover:bg-transparent group"
                onClick={() => navigate('/')}
              >
                {/* Logo Container with 3D Integration */}
                <div className="w-20 h-20 relative logo-container">
                  {/* Actual Logo Image */}
                  <motion.div
                    className="absolute inset-0 z-10"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                  >
                    <img
                      src={logoImage}
                      alt="BexyFlowers Logo"
                      className="w-full h-full object-contain"
                    />
                  </motion.div>
                  
                  {/* 3D Animated Flower Behind Logo */}
                  {webgl.isReady && !threeJSError && (
                    <ThreeJSErrorBoundary onError={handleThreeJSError}>
                      <div className="absolute inset-0 z-0">
                        <AnimatedFlowerLogoCanvas 
                          onError={handleThreeJSError}
                          className="opacity-30"
                        />
                      </div>
                    </ThreeJSErrorBoundary>
                  )}
                  
                  {/* Enhanced Glow Effect */}
                  <motion.div
                    className="absolute inset-0 bg-primary/20 rounded-full blur-md z-5"
                    animate={{
                      scale: [1, 1.4, 1],
                      opacity: [0.3, 0.6, 0.3]
                    }}
                    transition={{
                      duration: 5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                  
                  {/* Floating Particles Around Logo */}
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1 h-1 bg-primary/70 rounded-full"
                      style={{
                        left: `${15 + (i * 10)}%`,
                        top: `${25 + (i % 2) * 25}%`,
                      }}
                      animate={{
                        y: [0, -25, 0],
                        opacity: [0.5, 1, 0.5],
                        scale: [1, 1.8, 1]
                      }}
                      transition={{
                        duration: 4 + i * 0.3,
                        repeat: Infinity,
                        delay: i * 0.4,
                        ease: "easeInOut"
                      }}
                    />
                  ))}
                </div>
                
                {/* Brand Name */}
                <div className="ml-4">
                  <motion.h1
                    className="font-luxury text-2xl font-bold text-foreground"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                  >
                    BEXYFLOWERS
                  </motion.h1>
                  <motion.p
                    className="font-body text-xs text-muted-foreground tracking-widest"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7, duration: 0.8 }}
                  >
                    LUXURY FLORISTRY
                  </motion.p>
                </div>

                {/* Logo Decorative Elements */}
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-primary/30 rounded-full animate-pulse-gold" />
                <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-primary/40 rounded-full animate-pulse-gold" style={{ animationDelay: '1s' }} />
              </Button>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              {navigationItems.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.1, duration: 0.6 }}
                >
                  <Button
                    variant="ghost"
                    className={`relative group font-body font-medium px-6 py-3 transition-all duration-300 ${
                      location.pathname === item.path
                        ? 'text-primary'
                        : 'text-foreground hover:text-primary'
                    }`}
                    onClick={() => handleNavigation(item.path)}
                  >
                    <span className="flex items-center space-x-2">
                      <span className="group-hover:scale-110 transition-transform duration-300">
                        {item.icon}
                      </span>
                      <span>{item.name}</span>
                    </span>
                    
                    {/* Hover Effect */}
                    <motion.div
                      className="absolute inset-0 bg-primary/10 rounded-lg"
                      initial={{ scale: 0, opacity: 0 }}
                      whileHover={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                    />
                    
                    {/* Active Indicator */}
                    {location.pathname === item.path && (
                      <motion.div
                        className="absolute bottom-0 left-1/2 w-1 h-1 bg-primary rounded-full"
                        layoutId="activeIndicator"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1, x: '-50%' }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </Button>
                </motion.div>
              ))}
            </div>

            {/* Cart & Menu */}
            <div className="flex items-center space-x-4">
              {/* Cart */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2, duration: 0.6 }}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative group hover:bg-primary/10 transition-all duration-300"
                >
                  <ShoppingCart className="w-6 h-6 text-foreground group-hover:text-primary group-hover:scale-110 transition-all duration-300" />
                  
                  {/* Cart Badge */}
                  {cartItems > 0 && (
                    <motion.div
                      className="absolute -top-2 -right-2 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-luxury font-bold text-xs shadow-gold cart-pulse"
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 1.5, type: "spring", stiffness: 500 }}
                      whileHover={{ scale: 1.2, rotate: 360 }}
                    >
                      <motion.span
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        {cartItems}
                      </motion.span>
                    </motion.div>
                  )}
                  
                  {/* Cart Glow */}
                  <motion.div
                    className="absolute inset-0 bg-primary/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    animate={{
                      scale: [1, 1.2, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                </Button>
              </motion.div>

              {/* Mobile Menu Button */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.4, duration: 0.6 }}
                className="lg:hidden"
              >
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleMenuToggle}
                  className="relative group hover:bg-primary/10 transition-all duration-300"
                >
                  <AnimatePresence mode="wait">
                    {isMenuOpen ? (
                      <motion.div
                        key="close"
                        initial={{ rotate: -90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: 90, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <X className="w-6 h-6 text-foreground group-hover:text-primary transition-colors duration-300" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="menu"
                        initial={{ rotate: 90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: -90, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Menu className="w-6 h-6 text-foreground group-hover:text-primary transition-colors duration-300" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Button>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              ref={menuRef}
              className="lg:hidden absolute top-full left-0 right-0 bg-background/98 backdrop-blur-xl border-t border-primary/20 shadow-luxury"
              style={{ backgroundColor: 'rgba(229, 228, 226, 0.98)' }}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
            >
              <div className="px-6 py-8 space-y-4">
                {navigationItems.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                  >
                    <Button
                      variant="ghost"
                      className={`w-full justify-start p-4 text-left group ${
                        location.pathname === item.path
                          ? 'text-primary bg-primary/10'
                          : 'text-foreground hover:text-primary hover:bg-primary/5'
                      }`}
                      onClick={() => handleNavigation(item.path)}
                    >
                      <div className="flex items-center space-x-4">
                        <span className="group-hover:scale-110 transition-transform duration-300">
                          {item.icon}
                        </span>
                        <div>
                          <div className="font-luxury font-semibold">{item.name}</div>
                          <div className="font-body text-sm text-muted-foreground">
                            {item.description}
                          </div>
                        </div>
                      </div>
                    </Button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
         </AnimatePresence>
       </nav>

      {/* Spacer for fixed navigation */}
      <div className="h-20" />
    </>
  );
};

export default UltraNavigation;