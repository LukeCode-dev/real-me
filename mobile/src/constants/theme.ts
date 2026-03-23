/**
 * Real Me Scanner - Design System Theme
 * Cyberpunk neon aesthetic on dark backgrounds
 */

export const colors = {
  // Dark palette
  dark: {
    900: '#101113',
    800: '#141517',
    700: '#1a1b1e',
    600: '#25262b',
    500: '#2c2e33',
    400: '#373a40',
    300: '#5c5f66',
    200: '#909296',
    100: '#a6a7ab',
    50: '#c1c2c5',
  },

  // Neon accents
  neon: {
    blue: '#00d4ff',
    purple: '#b249f8',
    pink: '#ff6bcb',
    green: '#05ffa1',
  },

  // Primary brand
  primary: {
    600: '#4c6ef5',
    500: '#5c7cfa',
    400: '#748ffc',
    300: '#91a7ff',
  },

  // Semantic
  success: '#05ffa1',
  error: '#ff4444',
  warning: '#ffaa00',
  info: '#00d4ff',

  // Surface aliases
  background: '#101113',
  surface: '#1a1b1e',
  surfaceElevated: '#141517',
  border: '#25262b',
  borderMuted: '#373a40',

  // Text
  text: {
    primary: '#c1c2c5',
    secondary: '#909296',
    tertiary: '#5c5f66',
    inverse: '#101113',
  },

  // Common
  white: '#ffffff',
  black: '#000000',
  transparent: 'transparent',
} as const;

export const gradients = {
  primary: ['#4c6ef5', '#b249f8'] as const,
  neon: ['#00d4ff', '#b249f8', '#ff6bcb'] as const,
  neonHorizontal: ['#00d4ff', '#b249f8'] as const,
  sunset: ['#ff6bcb', '#b249f8'] as const,
  ocean: ['#00d4ff', '#05ffa1'] as const,
  fire: ['#ff4444', '#ffaa00'] as const,
  surface: ['rgba(26,27,30,0.9)', 'rgba(20,21,23,0.95)'] as const,
} as const;

export const typography = {
  fontFamily: {
    body: 'Inter',
    heading: 'SpaceGrotesk',
    mono: 'SpaceMono',
  },

  fontSize: {
    xs: 10,
    sm: 12,
    md: 14,
    lg: 16,
    xl: 18,
    '2xl': 22,
    '3xl': 28,
    '4xl': 36,
    '5xl': 48,
  },

  fontWeight: {
    light: '300' as const,
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },

  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
} as const;

export const spacing = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  9: 36,
  10: 40,
  12: 48,
  14: 56,
  16: 64,
} as const;

export const borderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 24,
  full: 9999,
} as const;

export const shadows = {
  sm: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  neonBlue: {
    shadowColor: '#00d4ff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 6,
  },
  neonPurple: {
    shadowColor: '#b249f8',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 6,
  },
  neonPink: {
    shadowColor: '#ff6bcb',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 5,
  },
  neonGreen: {
    shadowColor: '#05ffa1',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 5,
  },
  glass: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 24,
    elevation: 10,
  },
} as const;

export const animation = {
  duration: {
    instant: 100,
    fast: 200,
    normal: 300,
    slow: 500,
    slower: 800,
    pulse: 2000,
    float: 6000,
    scan: 2000,
  },
  easing: {
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
    spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  },
} as const;

export const glassMorphism = {
  background: 'rgba(26, 27, 30, 0.8)',
  backgroundLight: 'rgba(26, 27, 30, 0.6)',
  backdropBlur: 20,
  borderColor: 'rgba(37, 38, 43, 0.6)',
  borderWidth: 1,
} as const;

const theme = {
  colors,
  gradients,
  typography,
  spacing,
  borderRadius,
  shadows,
  animation,
  glassMorphism,
} as const;

export type Theme = typeof theme;
export default theme;
