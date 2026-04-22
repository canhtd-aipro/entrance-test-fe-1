import { createContext, FC, PropsWithChildren, ReactNode, useContext, useState } from 'react';

export type SlotContextType = {
  slotContents: Record<string, ReactNode>;
  setSlotContents: React.Dispatch<React.SetStateAction<Record<string, ReactNode>>>;
};

export const SlotProviderContext = createContext<SlotContextType | undefined>(undefined);

export const useSlotContext = () => {
  const context = useContext(SlotProviderContext);
  if (!context) {
    throw new Error('useSlotContext must be used within a <SlotProvider>');
  }
  return context;
};

export const SlotProvider: FC<PropsWithChildren> = ({ children }) => {
  const [slotContents, setSlotContents] = useState<Record<string, ReactNode>>({});

  return (
    <SlotProviderContext.Provider value={{ slotContents, setSlotContents }}>{children}</SlotProviderContext.Provider>
  );
};
