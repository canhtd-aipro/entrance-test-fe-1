import { Space } from 'antd';
import React, { ChangeEvent, cloneElement, FC } from 'react';
import { clone } from 'lodash';

type AppGroupInputPropsType = {
  items: {
    label: string;
    input: React.ReactElement;
  }[];
  value?: (string | number)[];
  onChange?: (value?: (string | number | null)[] | null) => void;
};

export const AppGroupInput: FC<AppGroupInputPropsType> = ({ items, value = [], onChange }) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement> | string | number, index: number) => {
    const newValue = clone(value);
    if (typeof e === 'object' && e !== null) {
      newValue[index] = e.target.value;
    } else {
      newValue[index] = e;
    }
    onChange?.(newValue);
  };

  return (
    <div className={'flex w-full rounded-md bg-disabled'}>
      {items.map((item, index) => (
        <Space.Compact className={'min-w-0'} key={index}>
          {cloneElement(item.input, {
            value: value[index],
            onChange: (e: ChangeEvent<HTMLInputElement>) => {
              handleChange(e, index);
            },
          })}
          <div className={'ml-6 mr-6 self-center whitespace-nowrap'}>{item.label}</div>
        </Space.Compact>
      ))}
    </div>
  );
};
