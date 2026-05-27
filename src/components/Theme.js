/** Palette inspired by the German flag (Schwarz–Rot–Gold), dark UI */

export const COLORS = {
  // Deutschland
  germanyBlack: '#0A0A0C',
  germanyRed: '#DD0000',
  germanyGold: '#FFCC00',
  onPrimary: '#0A0A0C',

  // Surfaces & depth
  background: '#0A0A0C',
  backgroundDeep: '#050506',
  surface: '#16161A',
  surfaceLight: '#222228',
  surfaceRaised: '#2A2A32',
  glassBorder: 'rgba(255, 204, 0, 0.12)',
  glassBorderRed: 'rgba(221, 0, 0, 0.2)',
  glassBg: 'rgba(255, 255, 255, 0.04)',

  // Accents (gold primary, red secondary)
  primary: '#FFCC00',
  primaryLight: '#FFE066',
  primaryDark: '#C9A000',
  secondary: '#DD0000',
  secondaryLight: '#FF4D4D',
  accent: '#FFCC00',
  warning: '#FFCC00',
  error: '#DD0000',

  // Text
  text: '#F5F5F7',
  textMuted: '#A8A8B3',
  textDark: '#6B6B78',

  // Alpha helpers
  primaryAlpha10: 'rgba(255, 204, 0, 0.10)',
  primaryAlpha15: 'rgba(255, 204, 0, 0.15)',
  primaryAlpha20: 'rgba(255, 204, 0, 0.20)',
  primaryAlpha40: 'rgba(255, 204, 0, 0.40)',
  redAlpha12: 'rgba(221, 0, 0, 0.12)',
  redAlpha20: 'rgba(221, 0, 0, 0.20)',

  // Gradients (expo-linear-gradient)
  backgroundGradient: ['#050506', '#14080A', '#0A0A0C', '#0F0E08'],
  primaryGradient: ['#FFCC00', '#E6B800'],
  accentGradient: ['#DD0000', '#A80000'],
  goldGradient: ['#FFE066', '#FFCC00', '#C9A000'],
  glassGradient: ['rgba(255,255,255,0.08)', 'rgba(255,255,255,0.02)'],
  cardGradient: ['#2A2A32', '#1A1A1F', '#121218'],
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
};

export const TYPOGRAPHY = {
  h1: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.text,
    letterSpacing: 0.5,
  },
  h2: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.text,
    letterSpacing: 0.3,
  },
  h3: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
  },
  body: {
    fontSize: 15,
    fontWeight: '400',
    color: COLORS.text,
    lineHeight: 22,
  },
  bodyMuted: {
    fontSize: 14,
    fontWeight: '400',
    color: COLORS.textMuted,
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.textMuted,
    letterSpacing: 0.5,
  },
  score: {
    fontSize: 48,
    fontWeight: '900',
    color: COLORS.text,
  },
  button: {
    fontSize: 15,
    fontWeight: '700',
  },
};

export const SHADOWS = {
  glass: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 10,
  },
  /** Card nổi 3D nhẹ */
  depth: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 14,
  },
  depthGold: {
    shadowColor: COLORS.germanyGold,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 18,
    elevation: 12,
  },
  glow: (color = COLORS.primary) => ({
    shadowColor: color,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.45,
    shadowRadius: 16,
    elevation: 10,
  }),
};

/** Style viền sáng phía trên — hiệu ứng khối 3D */
export const SURFACE_3D = {
  borderWidth: 1,
  borderColor: COLORS.glassBorder,
  borderTopColor: 'rgba(255, 255, 255, 0.14)',
  backgroundColor: COLORS.surface,
};
