import React, { useState, useEffect } from 'react';

const GradientCover = ({ userName, customColors }) => {
  const [gradientColors, setGradientColors] = useState(null);
  
  // Generate a deterministic color palette based on username
  useEffect(() => {
    if (customColors) {
      setGradientColors(customColors);
      return;
    }
    
    // Generate colors based on username hash
    const generateColorFromName = (name) => {
      const hash = name.split('').reduce((acc, char) => {
        return char.charCodeAt(0) + ((acc << 5) - acc);
      }, 0);
      
      // Generate base hue from hash
      const hue = Math.abs(hash % 360);
      
      // Create a palette with complementary colors
      return [
        `hsla(${hue}, 80%, 60%, 0.9)`,
        `hsla(${(hue + 40) % 360}, 90%, 50%, 0.85)`,
        `hsla(${(hue + 180) % 360}, 70%, 65%, 0.8)`,
        `hsla(${(hue + 220) % 360}, 90%, 45%, 0.75)`
      ];
    };
    
    setGradientColors(generateColorFromName(userName || 'user'));
  }, [userName, customColors]);

  if (!gradientColors) {
    return <div className="h-80 bg-gradient-to-r from-DarkColor/60 to-accent-1/60"></div>;
  }

  return (
    <div className="h-80 relative overflow-hidden">
      {/* Main gradient background */}
      <div 
        className="absolute inset-0 animate-gradient-slow"
        style={{
          background: "#808080"
        }}
      ></div>
      
      {/* Decorative elements */}
      <div className="absolute inset-0">
        {/* Geometric shapes */}
        <div className="absolute h-40 w-40 rounded-full bg-white/10 top-20 left-10 blur-sm"></div>
        <div className="absolute h-64 w-64 rounded-full bg-white/5 -top-20 right-20 blur-lg"></div>
        <div className="absolute h-20 w-20 rounded-md rotate-45 bg-white/10 bottom-10 left-1/3 blur-sm"></div>
        
        {/* SVG wave pattern */}
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="absolute bottom-0 left-0 w-full h-24 opacity-20">
          <path fill="#ffffff" fillOpacity="1" d="M0,224L48,224C96,224,192,224,288,202.7C384,181,480,139,576,144C672,149,768,203,864,208C960,213,1056,171,1152,149.3C1248,128,1344,128,1392,128L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
        
        {/* Light dots pattern */}
        <div className="absolute inset-0">
          {Array.from({ length: 20 }).map((_, i) => (
            <div 
              key={i}
              className="absolute h-1 w-1 rounded-full bg-white/30"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animation: `pulse 3s infinite ${Math.random() * 2}s`
              }}
            ></div>
          ))}
        </div>
      </div>
      
      {/* Overlay gradient for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
    </div>
  );
};

export default GradientCover;
