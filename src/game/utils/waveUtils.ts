
import { WAVE_MESSAGES } from '../constants';

export const getWaveMessage = (waveNumber: number): string => {
  return WAVE_MESSAGES[waveNumber as keyof typeof WAVE_MESSAGES] || 
    `Wave ${waveNumber}: The zombies are coming!`;
};
