
import { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';
import { useLocation } from 'react-router-dom';

export const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { pathname, hash } = useLocation();

  // Show button when page is scrolled down
  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Scroll to top function - ensure it works with click events
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  // Listen to scroll events
  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  // Reset scroll position when route changes
  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
    } else {
      const id = hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => element.scrollIntoView({ behavior: "smooth" }), 100);
      }
    }
  }, [pathname, hash]);

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 p-3 bg-brand-gold rounded-full shadow-lg hover:bg-amber-500 transition-all duration-300 z-50 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-amber-400"
          aria-label="Scroll to top"
        >
          <ChevronUp className="h-6 w-6 text-brand-navy" />
        </button>
      )}
    </>
  );
};

export default ScrollToTop;
