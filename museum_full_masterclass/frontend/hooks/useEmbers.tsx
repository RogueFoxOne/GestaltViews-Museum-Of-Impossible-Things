// hooks/useEmbers.tsx
'use client';

import { useEffect, useCallback } from 'react';

/**
 * A custom React hook to generate a continuous "floating embers" animation within a specified container.
 * @param containerId The ID of the DOM element where the embers will be rendered.
 * @param isActive Toggles the ember effect on or off. Defaults to true.
 */
const useEmbers = (containerId: string, isActive: boolean = true): void => {

  const createEmber = useCallback(() => {
    // Find the container element in the DOM
    const container = document.getElementById(containerId);
    if (!container) {
      // If the container isn't rendered yet, do nothing.
      return;
    }

    const ember = document.createElement('div');
    
    // --- Ember Customization ---
    const size = Math.random() * 5 + 2; // Ember size: 2px to 7px
    const duration = Math.random() * 10 + 8; // Animation duration: 8s to 18s
    const delay = Math.random() * 5; // Animation delay
    const initialX = Math.random() * 100; // Starting horizontal position (%)
    const horizontalDrift = (Math.random() - 0.5) * 40; // Horizontal drift distance (%)

    // --- Dynamic Styling ---
    ember.style.position = 'absolute';
    ember.style.bottom = '-20px'; // Start below the viewport
    ember.style.left = `${initialX}vw`;
    ember.style.width = `${size}px`;
    ember.style.height = `${size}px`;
    ember.style.backgroundColor = `hsl(${180 + Math.random() * 80}, 80%, 70%)`; // Colors in the cyan/teal/green range
    ember.style.borderRadius = '50%';
    ember.style.opacity = `${Math.random() * 0.6 + 0.1}`; // Random opacity for depth
    ember.style.pointerEvents = 'none'; // Ensure embers are not interactive
    
    // --- Dynamic Animation ---
    // Using a unique animation name prevents conflicts if the hook is used multiple times
    const animationName = `float_up_${Math.random().toString(36).substring(7)}`;
    ember.style.animation = `${animationName} ${duration}s linear ${delay}s infinite`;
    
    const keyframes = `
      @keyframes ${animationName} {
        0% {
          transform: translate(0, 0) scale(1);
          opacity: ${ember.style.opacity};
        }
        100% {
          transform: translate(${horizontalDrift}vw, -110vh) scale(0.5);
          opacity: 0;
        }
      }
    `;

    // Inject the keyframes into a new style tag in the head
    const styleElement = document.createElement('style');
    styleElement.innerHTML = keyframes;
    document.head.appendChild(styleElement);
    
    container.appendChild(ember);

    // --- Cleanup ---
    // Remove the ember and its associated style tag after the animation completes
    setTimeout(() => {
      ember.remove();
      styleElement.remove();
    }, (duration + delay) * 1000);

  }, [containerId]);

  // The main useEffect hook that controls the ember creation loop.
  useEffect(() => {
    if (!isActive) return;

    // Set an interval to create new embers periodically.
    const interval = setInterval(createEmber, 300);

    // Create an initial burst of embers for immediate effect.
    for (let i = 0; i < 20; i++) {
        createEmber();
    }

    // This is the cleanup function. It runs when the component unmounts
    // or when the dependencies (isActive) change. It's crucial for performance.
    return () => clearInterval(interval);

  }, [createEmber, isActive, containerId]); // Dependencies array
};

export default useEmbers;
