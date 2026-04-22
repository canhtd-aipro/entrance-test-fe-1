import { useEffect } from 'react';
import { KeyCallback } from '../types/utils/use-ctrl.type';

export const useKeydown = (keyCallback: KeyCallback, dependencies: any[] = []) => {
  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      for (const k in keyCallback) {
        if (e.key === k) {
          e.preventDefault();
          keyCallback[k]();
        }
      }
    };

    document.addEventListener('keydown', handleKeydown);

    return () => {
      document.removeEventListener('keydown', handleKeydown);
    };
    // eslint-disable-next-line
  }, dependencies);
};
