import { useRef } from 'react';

const useDiffTime = () => {
  const startRef = useRef(0);
  const endRef = useRef(0);

  const setStart = () => (startRef.current = performance.now());

  const setEnd = () => (endRef.current = performance.now());

  const getDiffTime = () => endRef.current - startRef.current;

  return { getDiffTime, setStartTime: setStart, setEndTime: setEnd };
};

export default useDiffTime;
