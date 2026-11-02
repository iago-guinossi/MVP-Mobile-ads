// Paleta verde e branca do Terê Verde (baseada no frontend web e nos protótipos)
export const colors = {
  primary: '#1F6B3A',
  primaryDark: '#0F4D2A',
  primaryLight: '#E8F3EA',
  accent: '#398D44',
  background: '#FFFFFF',
  surface: '#F5F9F6',
  border: '#DCE7DF',
  text: '#1C2B22',
  textMuted: '#5B6B61',
  white: '#FFFFFF',
  danger: '#B3261E',
  overlay: 'rgba(0,0,0,0.45)',
};

export const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 };

export const radius = { sm: 8, md: 14, lg: 20, pill: 999 };

export const font = {
  title: { fontSize: 24, fontWeight: '700', color: colors.text },
  subtitle: { fontSize: 18, fontWeight: '700', color: colors.text },
  body: { fontSize: 15, lineHeight: 22, color: colors.text },
  small: { fontSize: 13, color: colors.textMuted },
};

export const shadow = {
  shadowColor: '#000',
  shadowOpacity: 0.08,
  shadowRadius: 8,
  shadowOffset: { width: 0, height: 2 },
  elevation: 2,
};

// Respiro no fim das telas roláveis, para o conteúdo não encostar na borda/barra de abas
export const bottomSpace = { paddingBottom: 64 };
