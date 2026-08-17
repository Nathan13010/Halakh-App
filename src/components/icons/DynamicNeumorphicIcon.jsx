import React, { useEffect, useState, useRef } from 'react';

const DynamicNeumorphicIcon = ({ iconName, className = "w-24 h-24 shrink-0" }) => {
  const [svgContent, setSvgContent] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    // Determine the icon path, assuming they are in /icons/
    const url = `/icons/${iconName}.svg`;

    fetch(url)
      .then(res => res.text())
      .then(text => {
        // Only process if it's actually an SVG
        if (!text.includes('<svg')) return;

        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'image/svg+xml');
        const svg = doc.querySelector('svg');
        
        if (!svg) return;

        // Force full width/height for CSS scaling
        svg.setAttribute('width', '100%');
        svg.setAttribute('height', '100%');

        // 1. Inject Neumorphic Gradients & Filters
        const defs = doc.createElementNS('http://www.w3.org/2000/svg', 'defs');
        defs.innerHTML = `
          <!-- Glow Gradient (Orange/Yellow) -->
          <radialGradient id="glowGradient" cx="30%" cy="30%" r="70%">
            <stop stop-color="#FFF7B0"/>
            <stop offset="1" stop-color="#C05300"/>
          </radialGradient>
          
          <!-- Dark Gradient (White/Grey to Dark) -->
          <radialGradient id="darkGradient_light" cx="30%" cy="30%" r="70%">
            <stop stop-color="#5D6167"/>
            <stop offset="1" stop-color="#13151A"/>
          </radialGradient>
          
          <radialGradient id="darkGradient_dark" cx="30%" cy="30%" r="70%">
            <stop stop-color="white"/>
            <stop offset="1" stop-color="#5D6167"/>
          </radialGradient>

          <!-- Neumorphic Drop Shadows -->
          <filter id="neumorphicShadow_light" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="9" dy="9" stdDeviation="8" flood-color="#a3b1c6" flood-opacity="1" result="shadow1"/>
            <feDropShadow dx="0" dy="0" stdDeviation="24" flood-color="#ffffff" flood-opacity="0.85" result="shadow2"/>
          </filter>

          <filter id="neumorphicShadow_dark" x="-50%" y="-50%" width="200%" height="200%">
            <!-- Create the solid background for proper overlay blending in the browser -->
            <feFlood flood-color="#25282D" flood-opacity="1" result="bg"/>
            
            <!-- 1. White shadow (-12, -12, blur 20, white 0.4) -->
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
            <feOffset dx="-12" dy="-12"/>
            <feGaussianBlur stdDeviation="20"/>
            <feComposite in2="hardAlpha" operator="out"/>
            <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.4 0" result="whiteShadow"/>
            <feBlend mode="overlay" in="whiteShadow" in2="bg" result="effect1_dropShadow_dark"/>
            
            <!-- 2. Black shadow (12, 12, blur 20, black 0.44) -->
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
            <feOffset dx="12" dy="12"/>
            <feGaussianBlur stdDeviation="20"/>
            <feComposite in2="hardAlpha" operator="out"/>
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.44 0" result="blackShadow"/>
            <feBlend mode="overlay" in="blackShadow" in2="effect1_dropShadow_dark" result="effect2_dropShadow_dark"/>
            
            <feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_dark" result="shape"/>
          </filter>
        `;
        svg.prepend(defs);

        // 2. Wrap all original content in groups with the shadow filters
        // We need to create two versions (light and dark) and toggle them via CSS
        const originalContent = Array.from(svg.childNodes).filter(node => node !== defs);
        
        // Process fills before cloning
        const processFills = (root, isDark) => {
          const paths = root.querySelectorAll('path, rect, circle, polygon, ellipse');
          paths.forEach(p => {
            const style = p.getAttribute('style') || '';
            const fill = p.getAttribute('fill');
            // If the original fill was white, make it glow
            if (style.includes('fill:white') || style.includes('fill: white') || fill === 'white' || fill === '#FFFFFF' || fill === '#ffffff') {
              p.setAttribute('fill', 'url(#glowGradient)');
              p.removeAttribute('style'); // remove inline styles to prioritize attribute
            } else if (fill !== 'none') {
              p.setAttribute('fill', isDark ? 'url(#darkGradient_dark)' : 'url(#darkGradient_light)');
            }
          });
        };

        const lightGroup = doc.createElementNS('http://www.w3.org/2000/svg', 'g');
        lightGroup.setAttribute('class', 'block dark:hidden');
        lightGroup.setAttribute('filter', 'url(#neumorphicShadow_light)');
        
        const darkGroup = doc.createElementNS('http://www.w3.org/2000/svg', 'g');
        darkGroup.setAttribute('class', 'hidden dark:block');
        darkGroup.setAttribute('filter', 'url(#neumorphicShadow_dark)');

        // Move original nodes into lightGroup and clone to darkGroup
        originalContent.forEach(node => {
          const clone = node.cloneNode(true);
          lightGroup.appendChild(node);
          darkGroup.appendChild(clone);
        });

        // Apply colors
        processFills(lightGroup, false);
        processFills(darkGroup, true);

        svg.appendChild(lightGroup);
        svg.appendChild(darkGroup);

        setSvgContent(svg.outerHTML);
      })
      .catch(err => console.error("Error loading SVG:", err));
  }, [iconName]);

  // Auto-crop ViewBox to standardize icon sizes
  useEffect(() => {
    if (containerRef.current && svgContent) {
      const svgEl = containerRef.current.querySelector('svg');
      if (svgEl) {
        try {
          // Find the bounding box of the visible paths
          // We can use the lightGroup for calculation
          const group = svgEl.querySelector('g.block');
          if (group) {
            // Need a slight delay to ensure DOM is rendered before calculating BBox
            setTimeout(() => {
              const bbox = group.getBBox();
              if (bbox && bbox.width > 0) {
                // Add a uniform 25% padding around the tight bounding box
                const padRatio = 0.25;
                const paddingX = bbox.width * padRatio;
                const paddingY = bbox.height * padRatio;
                const newViewBox = `${bbox.x - paddingX} ${bbox.y - paddingY} ${bbox.width + paddingX * 2} ${bbox.height + paddingY * 2}`;
                svgEl.setAttribute('viewBox', newViewBox);
              }
            }, 50);
          }
        } catch (e) {
          console.error("Auto-crop failed:", e);
        }
      }
    }
  }, [svgContent]);

  if (!svgContent) {
    return <div className={`animate-pulse bg-zinc-200 dark:bg-zinc-800 rounded-2xl ${className}`} />;
  }

  return (
    <div 
      ref={containerRef}
      className={className}
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  );
};

export default DynamicNeumorphicIcon;
