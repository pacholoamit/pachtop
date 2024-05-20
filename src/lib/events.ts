import { emit } from '@tauri-apps/api/event';

import { ServerEvent } from './types';

export const setWindowColor = (color: string) => emit(ServerEvent.ThemeChanged, color);
