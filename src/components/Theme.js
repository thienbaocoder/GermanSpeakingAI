export const COLORS = {
  // Premium Obsidian Dark Mode Palette
  background: '#09090E',
  surface: '#12121A',
  surfaceLight: '#1E1E2A',
  glassBorder: 'rgba(255, 255, 255, 0.08)',
  glassBg: 'rgba(255, 255, 255, 0.03)',
  
  // Vibrant Accent Colors
  primary: '#6366F1',       // Electric Indigo
  primaryLight: '#818CF8',  // Indigo Light
  secondary: '#EC4899',     // Pink Accent
  accent: '#10B981',        // Emerald Green (Success)
  warning: '#F59E0B',       // Amber (Careful)
  error: '#EF4444',         // Coral Red (Correction)
  
  // Neutral Text
  text: '#F3F4F6',          // Off-white
  textMuted: '#9CA3AF',     // Gray 400
  textDark: '#4B5563',      // Gray 600
  
  // Custom Gradients
  primaryGradient: ['#6366F1', '#4F46E5'],
  accentGradient: ['#10B981', '#059669'],
  pinkGradient: ['#EC4899', '#DB2777'],
  glassGradient: ['rgba(255,255,255,0.06)', 'rgba(255,255,255,0.02)'],
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
};

export const SHADOWS = {
  glass: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  glow: (color = COLORS.primary) => ({
    shadowColor: color,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 10,
  }),
};
