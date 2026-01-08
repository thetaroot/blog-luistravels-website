'use client';

import { useEffect } from 'react';

export default function ImageProtection() {
  useEffect(() => {
    // Disable right-click context menu
    const disableRightClick = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    // Disable drag and drop
    const disableDragDrop = (e: DragEvent) => {
      e.preventDefault();
      return false;
    };

    // Disable text selection
    const disableSelection = (e: Event) => {
      e.preventDefault();
      return false;
    };

    // Disable keyboard shortcuts (Ctrl+S, Ctrl+A, Ctrl+C, etc.)
    const disableKeyboardShortcuts = (e: KeyboardEvent) => {
      // Disable F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && e.key === 'I') ||
        (e.ctrlKey && e.shiftKey && e.key === 'J') ||
        (e.ctrlKey && e.key === 'u') ||
        (e.ctrlKey && e.key === 'U') ||
        (e.ctrlKey && e.key === 's') ||
        (e.ctrlKey && e.key === 'S') ||
        (e.ctrlKey && e.key === 'a') ||
        (e.ctrlKey && e.key === 'A') ||
        (e.ctrlKey && e.key === 'c') ||
        (e.ctrlKey && e.key === 'C') ||
        (e.ctrlKey && e.key === 'v') ||
        (e.ctrlKey && e.key === 'V') ||
        (e.ctrlKey && e.key === 'x') ||
        (e.ctrlKey && e.key === 'X') ||
        (e.metaKey && e.key === 's') ||
        (e.metaKey && e.key === 'S') ||
        (e.metaKey && e.key === 'a') ||
        (e.metaKey && e.key === 'A') ||
        (e.metaKey && e.key === 'c') ||
        (e.metaKey && e.key === 'C') ||
        (e.metaKey && e.key === 'v') ||
        (e.metaKey && e.key === 'V') ||
        (e.metaKey && e.key === 'x') ||
        (e.metaKey && e.key === 'X')
      ) {
        e.preventDefault();
        return false;
      }
    };

    // Disable print screen
    const disablePrintScreen = (e: KeyboardEvent) => {
      if (e.key === 'PrintScreen') {
        e.preventDefault();
        return false;
      }
    };

    // Add event listeners
    document.addEventListener('contextmenu', disableRightClick);
    document.addEventListener('dragstart', disableDragDrop);
    document.addEventListener('drop', disableDragDrop);
    document.addEventListener('selectstart', disableSelection);
    document.addEventListener('keydown', disableKeyboardShortcuts);
    document.addEventListener('keyup', disablePrintScreen);

    // Disable image dragging specifically
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      img.draggable = false;
      img.style.pointerEvents = 'none';
      img.style.userSelect = 'none';
      img.style.webkitUserSelect = 'none';
      (img.style as any).mozUserSelect = 'none';
      (img.style as any).msUserSelect = 'none';
    });

    // Enhanced developer tools detection
    let devtools = false;
    const detectDevTools = () => {
      // Multiple detection methods
      const threshold = 160;
      const widthThreshold = window.outerWidth - window.innerWidth > threshold;
      const heightThreshold = window.outerHeight - window.innerHeight > threshold;
      
      // Console size detection
      let devtoolsOpen = false;
      const el = new Image();
      el.onload = () => {
        devtoolsOpen = true;
      };
      el.onerror = () => {
        devtoolsOpen = true;
      };
      el.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
      
      if ((widthThreshold || heightThreshold || devtoolsOpen) && !devtools) {
        devtools = true;
        console.clear();
        console.log('%c🚫 Image Protection Active', 'color: #ff4444; font-size: 16px; font-weight: bold;');
        console.log('%c📸 These images are protected by copyright.', 'color: #666; font-size: 12px;');
        console.log('%c☕ Support the photographer: buymeacoffee.com/heretheregone', 'color: #ff8c00; font-size: 12px;');
        console.log('%c🎨 Want to download? Use the download button!', 'color: #0070f3; font-size: 12px;');
        
        // DevTools detected - just log messages, no blur on mobile
        // Blur disabled to prevent mobile gallery issues
      }
    };

    const interval = setInterval(detectDevTools, 500);
    
    // Monitor for console manipulation
    const consoleWarn = console.warn;
    const consoleError = console.error;
    console.warn = function(...args: any[]) {
      detectDevTools();
      return consoleWarn.apply(console, args);
    };
    console.error = function(...args: any[]) {
      detectDevTools();
      return consoleError.apply(console, args);
    };

    // Enhanced CSS injection with watermark and additional protection
    const style = document.createElement('style');
    style.textContent = `
      * {
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        -webkit-user-drag: none;
        -khtml-user-drag: none;
        -moz-user-drag: none;
        -o-user-drag: none;
        user-drag: none;
      }
      
      img {
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        -webkit-user-drag: none;
        -khtml-user-drag: none;
        -moz-user-drag: none;
        -o-user-drag: none;
        user-drag: none;
        pointer-events: none;
        -webkit-touch-callout: none;
        -webkit-tap-highlight-color: transparent;
      }
      
      /* Disable image context menu on mobile */
      img::-webkit-media-controls,
      img::-webkit-media-controls-start-playback-button {
        display: none !important;
        -webkit-appearance: none;
      }
      
      /* Re-enable pointer events for interactive elements */
      button, a, [role="button"], [class*="button"], [class*="btn"] {
        pointer-events: auto !important;
      }
      
      /* Disable screenshot on mobile devices */
      @media screen and (max-width: 768px) {
        * {
          -webkit-user-select: none;
          -webkit-touch-callout: none;
          -webkit-tap-highlight-color: transparent;
        }
      }
      
      /* Invisible watermark overlay */
      img::after {
        content: "© Luis Photography";
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) rotate(-45deg);
        font-size: 24px;
        color: rgba(255, 255, 255, 0.03);
        pointer-events: none;
        z-index: 1000;
        font-weight: bold;
        letter-spacing: 2px;
        mix-blend-mode: difference;
      }
    `;
    document.head.appendChild(style);

    // Cleanup function
    return () => {
      document.removeEventListener('contextmenu', disableRightClick);
      document.removeEventListener('dragstart', disableDragDrop);
      document.removeEventListener('drop', disableDragDrop);
      document.removeEventListener('selectstart', disableSelection);
      document.removeEventListener('keydown', disableKeyboardShortcuts);
      document.removeEventListener('keyup', disablePrintScreen);
      clearInterval(interval);
      if (style.parentNode) {
        style.parentNode.removeChild(style);
      }
    };
  }, []);

  return null; // This component doesn't render anything
}