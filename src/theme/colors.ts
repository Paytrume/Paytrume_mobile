export const colors = {
  // Primary Colors
  primary: '#D4672B', // Orange/Brown primary color
  primaryLight: '#E38B5C', // Lighter shade for hover/states
  primaryDark: '#B34A1A', // Darker shade for active states

  // Primary with opacities
  primaryWithOpacity: {
    '10': 'rgba(212, 103, 43, 0.1)',
    '15': 'rgba(212, 103, 43, 0.15)', // 15% opacity for your button
    '20': 'rgba(212, 103, 43, 0.2)',
    '30': 'rgba(212, 103, 43, 0.3)',
    '40': 'rgba(212, 103, 43, 0.4)',
    '50': 'rgba(212, 103, 43, 0.5)',
    '60': 'rgba(212, 103, 43, 0.6)',
    '70': 'rgba(212, 103, 43, 0.7)',
    '80': 'rgba(212, 103, 43, 0.8)',
    '90': 'rgba(212, 103, 43, 0.9)',
  },

  // Grayscale - Light to Dark
  white: '#FFFFFF',
  offWhite: '#F2F2F2',
  lightGray100: '#F2F2F2',
  lightGray200: '#E6E6E6',
  lightGray300: '#D9D9D9',
  mediumGray: '#A6A6A6',
  darkGray: '#2A2A2A',
  gray900: '#090814',
  black: '#000000',

  // Semantic Colors
  background: {
    primary: '#FFFFFF',
    secondary: '#F2F2F2',
    tertiary: '#E6E6E6',
    card: '#FFFFFF',
    modal: '#FFFFFF',
    inverse: '#090814',
  },

  text: {
    primary: '#090814',
    secondary: '#2A2A2A',
    tertiary: '#6B6B6B',
    disabled: '#A6A6A6',
    inverse: '#FFFFFF',
    link: '#D4672B',
  },

  border: {
    light: '#E6E6E6',
    medium: '#D9D9D9',
    dark: '#A6A6A6',
    focus: '#D4672B',
  },

  // UI States
  state: {
    active: '#D4672B',
    inactive: '#E6E6E6',
    disabled: '#F2F2F2',
    error: '#DC2626',
    success: '#10B981',
    warning: '#F59E0B',
    info: '#3B82F6',

    activeWithOpacity: {
      '10': 'rgba(212, 103, 43, 0.1)',
      '15': 'rgba(212, 103, 43, 0.15)',
      '20': 'rgba(212, 103, 43, 0.2)',
      '30': 'rgba(212, 103, 43, 0.3)',
      '40': 'rgba(212, 103, 43, 0.4)',
      '50': 'rgba(212, 103, 43, 0.5)',
      '60': 'rgba(212, 103, 43, 0.6)',
      '70': 'rgba(212, 103, 43, 0.7)',
      '80': 'rgba(212, 103, 43, 0.8)',
      '90': 'rgba(212, 103, 43, 0.9)',
    },

    inactiveWithOpacity: {
      '10': 'rgba(230, 230, 230, 0.1)',
      '15': 'rgba(230, 230, 230, 0.15)',
      '20': 'rgba(230, 230, 230, 0.2)',
      '30': 'rgba(230, 230, 230, 0.3)',
      '40': 'rgba(230, 230, 230, 0.4)',
      '50': 'rgba(230, 230, 230, 0.5)',
      '60': 'rgba(230, 230, 230, 0.6)',
      '70': 'rgba(230, 230, 230, 0.7)',
      '80': 'rgba(230, 230, 230, 0.8)',
      '90': 'rgba(230, 230, 230, 0.9)',
    },

    disabledWithOpacity: {
      '10': 'rgba(242, 242, 242, 0.1)',
      '15': 'rgba(242, 242, 242, 0.15)',
      '20': 'rgba(242, 242, 242, 0.2)',
      '30': 'rgba(242, 242, 242, 0.3)',
      '40': 'rgba(242, 242, 242, 0.4)',
      '50': 'rgba(242, 242, 242, 0.5)',
      '60': 'rgba(242, 242, 242, 0.6)',
      '70': 'rgba(242, 242, 242, 0.7)',
      '80': 'rgba(242, 242, 242, 0.8)',
      '90': 'rgba(242, 242, 242, 0.9)',
    },

    errorWithOpacity: {
      '10': 'rgba(220, 38, 38, 0.1)',
      '15': 'rgba(220, 38, 38, 0.15)',
      '20': 'rgba(220, 38, 38, 0.2)',
      '30': 'rgba(220, 38, 38, 0.3)',
      '40': 'rgba(220, 38, 38, 0.4)',
      '50': 'rgba(220, 38, 38, 0.5)',
      '60': 'rgba(220, 38, 38, 0.6)',
      '70': 'rgba(220, 38, 38, 0.7)',
      '80': 'rgba(220, 38, 38, 0.8)',
      '90': 'rgba(220, 38, 38, 0.9)',
    },

    successWithOpacity: {
      '10': 'rgba(16, 185, 129, 0.1)',
      '15': 'rgba(16, 185, 129, 0.15)',
      '20': 'rgba(16, 185, 129, 0.2)',
      '30': 'rgba(16, 185, 129, 0.3)',
      '40': 'rgba(16, 185, 129, 0.4)',
      '50': 'rgba(16, 185, 129, 0.5)',
      '60': 'rgba(16, 185, 129, 0.6)',
      '70': 'rgba(16, 185, 129, 0.7)',
      '80': 'rgba(16, 185, 129, 0.8)',
      '90': 'rgba(16, 185, 129, 0.9)',
    },

    warningWithOpacity: {
      '10': 'rgba(245, 158, 11, 0.1)',
      '15': 'rgba(245, 158, 11, 0.15)',
      '20': 'rgba(245, 158, 11, 0.2)',
      '30': 'rgba(245, 158, 11, 0.3)',
      '40': 'rgba(245, 158, 11, 0.4)',
      '50': 'rgba(245, 158, 11, 0.5)',
      '60': 'rgba(245, 158, 11, 0.6)',
      '70': 'rgba(245, 158, 11, 0.7)',
      '80': 'rgba(245, 158, 11, 0.8)',
      '90': 'rgba(245, 158, 11, 0.9)',
    },

    infoWithOpacity: {
      '10': 'rgba(59, 130, 246, 0.1)',
      '15': 'rgba(59, 130, 246, 0.15)',
      '20': 'rgba(59, 130, 246, 0.2)',
      '30': 'rgba(59, 130, 246, 0.3)',
      '40': 'rgba(59, 130, 246, 0.4)',
      '50': 'rgba(59, 130, 246, 0.5)',
      '60': 'rgba(59, 130, 246, 0.6)',
      '70': 'rgba(59, 130, 246, 0.7)',
      '80': 'rgba(59, 130, 246, 0.8)',
      '90': 'rgba(59, 130, 246, 0.9)',
    },
  },

  // Button specific colors
  button: {
    primary: '#D4672B',
    primaryPressed: '#B34A1A',
    primaryDisabled: '#F2F2F2',
    secondary: 'transparent',
    secondaryBorder: '#D9D9D9',
    text: '#FFFFFF',
    textSecondary: '#090814',

    // Button with opacity
    primaryWithOpacity15: 'rgba(212, 103, 43, 0.5)',
  },

  // Specific mappings from your list
  raw: {
    white: '#FFFFFF',
    e6e6e6: '#E6E6E6',
    gray900: '#090814',
    d9d9d9: '#D9D9D9',
    dark: '#0A0A0A',
    f2f2f2: '#F2F2F2',
    black: '#000000',
    darkGray: '#2A2A2A',
    primary: '#D4672B',
    primary15: 'rgba(212, 103, 43, 0.15)', // Direct 15% opacity
  },
};

export type Colors = typeof colors;
