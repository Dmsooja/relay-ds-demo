// Red values are taken from the existing Figma library. Blue shades follow
// the same light, action, hover, and deep roles for use as extension aliases.
export const brands = {
  red: { tint: '#ffeae7', bright: '#fa2d0a', action: '#ec0900', hover: '#b90700', deep: '#8a1906', darkest: '#691304', secondary: '#ef7c00' },
  blue: { tint: '#eaf1ff', bright: '#3b73fa', action: '#2155d5', hover: '#1744b5', deep: '#183587', darkest: '#12285f', secondary: '#457ae7' },
}

export const foundations = {
  paper: '#ffffff',
  surface: '#f7f8fa',
  ink: '#171a24',
  muted: '#565d70',
  border: '#dce0e7',
  success: '#16684c',
  successTint: '#e6f5ef',
  warning: '#775306',
  warningTint: '#fff2d7',
  danger: '#a81d25',
  dangerTint: '#fff0f1',
  info: '#1744b5',
  infoTint: '#eaf1ff',
  radius: 16,
  spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 },
}

export const brandAliases = {
  'brand/primary': 'action',
  'brand/primary-hover': 'hover',
  'brand/primary-light': 'tint',
  'brand/secondary': 'secondary',
  'brand/deep': 'deep',
  'brand/darkest': 'darkest',
  'text/secondary': 'hover',
  'button/bg': 'action',
  'button/hover': 'hover',
  'button/secondary/text': 'action',
  'button/secondary/hover': 'tint',
}

export const newSemanticDefaults = {
  'brand/deep': 'color/brand/800',
  'brand/darkest': 'color/brand/900',
}

export const bluePrimitiveNames = {
  tint: 'color/brand/blue/50',
  bright: 'color/brand/blue/500',
  action: 'color/brand/blue/650',
  hover: 'color/brand/blue/700',
  deep: 'color/brand/blue/800',
  darkest: 'color/brand/blue/900',
  secondary: 'color/brand/blue/secondary',
}

export function themeTokens(theme) {
  return { ...foundations, ...brands[theme] }
}

// Default semantic tokens follow the Red theme; use themeTokens('blue') for Blue.
export const tokens = themeTokens('red')
export const theme = tokens
