/**
 * Professional color extraction for adaptive backgrounds
 * Apple Photography standards - Senior Dev implementation
 */

export interface ExtractedColors {
  dominant: string;
  accent: string;
  background: string;
  isDark: boolean;
}

export async function extractImageColors(imageSrc: string): Promise<ExtractedColors> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        resolve(getDefaultColors());
        return;
      }
      
      // Optimize canvas size for color sampling
      const sampleSize = 50;
      canvas.width = sampleSize;
      canvas.height = sampleSize;
      
      ctx.drawImage(img, 0, 0, sampleSize, sampleSize);
      
      try {
        const imageData = ctx.getImageData(0, 0, sampleSize, sampleSize);
        const colors = analyzeImageData(imageData);
        resolve(colors);
      } catch (error) {
        console.warn('Color extraction failed:', error);
        resolve(getDefaultColors());
      }
    };
    
    img.onerror = () => {
      resolve(getDefaultColors());
    };
    
    img.src = imageSrc;
  });
}

function analyzeImageData(imageData: ImageData): ExtractedColors {
  const data = imageData.data;
  const colorCounts: { [key: string]: number } = {};
  let totalBrightness = 0;
  const sampleCount = data.length / 4;
  
  // Sample every 4th pixel for performance
  for (let i = 0; i < data.length; i += 16) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];
    
    if (a < 128) continue; // Skip transparent pixels
    
    // Calculate brightness
    const brightness = (r * 0.299 + g * 0.587 + b * 0.114);
    totalBrightness += brightness;
    
    // Quantize colors for dominant color detection
    const quantizedR = Math.round(r / 32) * 32;
    const quantizedG = Math.round(g / 32) * 32;
    const quantizedB = Math.round(b / 32) * 32;
    
    const colorKey = `${quantizedR},${quantizedG},${quantizedB}`;
    colorCounts[colorKey] = (colorCounts[colorKey] || 0) + 1;
  }
  
  const avgBrightness = totalBrightness / sampleCount;
  const isDark = avgBrightness < 128;
  
  // Find dominant color
  const dominantColorKey = Object.keys(colorCounts).reduce((a, b) => 
    colorCounts[a] > colorCounts[b] ? a : b
  );
  
  const [r, g, b] = dominantColorKey.split(',').map(Number);
  
  return {
    dominant: `rgb(${r}, ${g}, ${b})`,
    accent: generateAccentColor(r, g, b, isDark),
    background: generateBackgroundGradient(r, g, b, isDark),
    isDark
  };
}

function generateAccentColor(r: number, g: number, b: number, isDark: boolean): string {
  // Create complementary accent color
  const hsl = rgbToHsl(r, g, b);
  const accentHue = (hsl.h + 180) % 360;
  const accentSaturation = Math.min(hsl.s * 1.2, 1);
  const accentLightness = isDark ? Math.min(hsl.l * 1.5, 0.8) : Math.max(hsl.l * 0.7, 0.2);
  
  return hslToRgb(accentHue, accentSaturation, accentLightness);
}

function generateBackgroundGradient(r: number, g: number, b: number, isDark: boolean): string {
  // Create matte dark blurry background based on image colors
  // Dramatically darken and desaturate the colors
  const darkR = Math.max(Math.floor(r * 0.2), 12);
  const darkG = Math.max(Math.floor(g * 0.2), 12);
  const darkB = Math.max(Math.floor(b * 0.2), 12);
  
  // Even darker version for gradient depth
  const darkerR = Math.max(Math.floor(r * 0.1), 8);
  const darkerG = Math.max(Math.floor(g * 0.1), 8);
  const darkerB = Math.max(Math.floor(b * 0.1), 8);
  
  const baseColor = `rgba(${darkR}, ${darkG}, ${darkB}, 0.95)`;
  const accentColor = `rgba(${darkerR}, ${darkerG}, ${darkerB}, 0.98)`;
  
  return `
    radial-gradient(ellipse at center, ${baseColor} 0%, ${accentColor} 70%, rgba(8, 8, 8, 0.99) 100%),
    linear-gradient(135deg, rgba(${darkR}, ${darkG}, ${darkB}, 0.3) 0%, rgba(${darkerR}, ${darkerG}, ${darkerB}, 0.6) 100%)
  `;
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255;
  g /= 255;
  b /= 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h: number, s: number;
  const l = (max + min) / 2;
  
  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
      default: h = 0;
    }
    h /= 6;
  }
  
  return { h: h * 360, s, l };
}

function hslToRgb(h: number, s: number, l: number): string {
  h /= 360;
  
  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  };
  
  let r: number, g: number, b: number;
  
  if (s === 0) {
    r = g = b = l;
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }
  
  return `rgb(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)})`;
}

function getDefaultColors(): ExtractedColors {
  return {
    dominant: 'rgb(32, 32, 32)',
    accent: 'rgb(48, 48, 48)',
    background: `
      radial-gradient(ellipse at center, rgba(20, 20, 20, 0.95) 0%, rgba(16, 16, 16, 0.98) 70%, rgba(8, 8, 8, 0.99) 100%),
      linear-gradient(135deg, rgba(20, 20, 20, 0.3) 0%, rgba(12, 12, 12, 0.6) 100%)
    `,
    isDark: true
  };
}