import { useEffect, useRef } from 'react';

export const useCtrlDown = () => {
  const ctrlDown = useRef(false);

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === 'Control') ctrlDown.current = true;
    };

    const handleKeyup = (e: KeyboardEvent) => {
      if (e.key === 'Control') ctrlDown.current = false;
    };

    const handleWindowBlur = () => {
      ctrlDown.current = false;
    };

    document.addEventListener('keydown', handleKeydown);
    document.addEventListener('keyup', handleKeyup);
    window.addEventListener('blur', handleWindowBlur);

    return () => {
      document.removeEventListener('keydown', handleKeydown);
      document.removeEventListener('keyup', handleKeyup);
      window.removeEventListener('blur', handleWindowBlur);
    };
  }, []);

  return ctrlDown;
};

export const useShiftDown = () => {
  const ctrlDown = useRef(false);

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === 'Shift') ctrlDown.current = true;
    };

    const handleKeyup = (e: KeyboardEvent) => {
      if (e.key === 'Shift') ctrlDown.current = false;
    };

    const handleWindowBlur = () => {
      ctrlDown.current = false;
    };

    document.addEventListener('keydown', handleKeydown);
    document.addEventListener('keyup', handleKeyup);
    window.addEventListener('blur', handleWindowBlur);

    return () => {
      document.removeEventListener('keydown', handleKeydown);
      document.removeEventListener('keyup', handleKeyup);
      window.removeEventListener('blur', handleWindowBlur);
    };
  }, []);

  return ctrlDown;
};
