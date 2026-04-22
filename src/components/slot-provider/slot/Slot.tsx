import { FC, useEffect } from 'react';
import { PropsWithChildren } from 'react';
import { useSlotContext } from '../SlotProvider';

type SlotProps = PropsWithChildren & {
  name: string;
};

export const Slot: FC<SlotProps> = ({ name, children }) => {
  const { setSlotContents } = useSlotContext();

  useEffect(() => {
    setSlotContents((prev) => ({ ...prev, [name]: children }));
    return () => setSlotContents((prev) => ({ ...prev, [name]: null }));
  }, [children, name, setSlotContents]);

  return null;
};
