export const lightColors = {
  background: '#F7F3EC',
  surface: '#FFFFFF',
  surfaceMuted: '#EFE7DA',
  surfaceElevated: '#FFFFFF',
  text: '#171412',
  textMuted: '#6F665C',
  textSubtle: '#9B8E81',
  border: '#DED2C2',
  primary: '#5A2D3F',
  primaryHover: '#472233',
  primaryText: '#FFFFFF',
  accent: '#0F766E',
  accentSoft: '#D7F0EC',
  danger: '#B42318',
  dangerSoft: '#FDE8E4',
  success: '#287D3C',
  successSoft: '#E5F4E8',
  warning: '#B54708',
  warningSoft: '#FFF1D6'
} as const;

export const darkColors = {
  background: '#0E0D0B',
  surface: '#171512',
  surfaceMuted: '#211E1A',
  surfaceElevated: '#201D19',
  text: '#F4EFE7',
  textMuted: '#B8ADA0',
  textSubtle: '#80756B',
  border: '#342E27',
  primary: '#D7A1B7',
  primaryHover: '#E6B7CA',
  primaryText: '#1B1015',
  accent: '#7DD3C7',
  accentSoft: '#123A36',
  danger: '#FFB4AB',
  dangerSoft: '#3D1714',
  success: '#95D5A6',
  successSoft: '#17351F',
  warning: '#F4BF75',
  warningSoft: '#3C2710'
} as const;

export type AppColors = Record<keyof typeof lightColors, string>;
