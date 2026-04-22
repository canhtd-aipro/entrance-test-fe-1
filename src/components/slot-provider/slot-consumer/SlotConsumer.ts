import { FC } from 'react';
import { useSlotContext } from '../SlotProvider';

type SlotConsumerProps = {
  name: string;
};

export const SlotConsumer: FC<SlotConsumerProps> = ({ name }) => {
  const context = useSlotContext();

  return context.slotContents?.[name];
};
