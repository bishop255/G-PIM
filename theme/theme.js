export const getTheme = (settings = {}) => {
  const isDark = settings?.darkMode;
  const isLarge = settings?.largeText;

  return {
    isDark,
    isLarge,

    colors: {
      background: isDark ? '#121212' : '#F7F7F7',
      card: isDark ? '#1E1E1E' : '#FFFFFF',
      text: isDark ? '#FFFFFF' : '#2D3436',
      secondaryText: isDark ? '#B2BEC3' : '#636E72',
      border: isDark ? '#333333' : '#DFE6E9',

      primary: '#42B65A',
      danger: '#E74C3C',
      warning: '#D68910',
      info: '#2D9CDB',
    },

    fontSizes: {
      title: isLarge ? 32 : 28,
      subtitle: isLarge ? 18 : 15,
      normal: isLarge ? 17 : 14,
      small: isLarge ? 14 : 11,
      button: isLarge ? 18 : 16,
    },
  };
};