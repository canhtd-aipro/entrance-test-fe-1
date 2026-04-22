import { forwardRef, useImperativeHandle } from 'react';

export type MultiFormItemInputRef = {
  onChange?: (value: any) => void;
};

type MultiFormItemInputProps = {
  onChange?: (value: any) => void;
};

export const MultiFormItemInput = forwardRef<MultiFormItemInputProps, MultiFormItemInputRef>(({ onChange }, ref) => {
  useImperativeHandle(ref, () => ({ onChange }), [onChange]);
  return <span />;
});
