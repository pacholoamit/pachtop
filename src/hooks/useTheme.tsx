import { useContext } from 'react';

import { ThemeContext } from '@/providers/theme.provider';

const useTheme = () => useContext(ThemeContext);

export default useTheme;
