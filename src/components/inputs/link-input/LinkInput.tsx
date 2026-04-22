import { Button, Input, InputProps, Tooltip } from 'antd';
import classNames from 'classnames';
import { FC, useMemo, useState } from 'react';
import { AiOutlineEdit } from 'react-icons/ai';
import { Link } from 'react-router-dom';

export type LinkInputProps = Omit<InputProps, 'disabled'> & {
  disabled?: boolean;
  label?: string;
  target?: '_blank' | '_self' | '_parent' | '_top';
};

export const LinkInput: FC<LinkInputProps> = ({ disabled = false, value = '', label, target = '_blank', ...props }) => {
  const [isEditing, setIsEditing] = useState(false);

  const url = useMemo(() => String(value), [value]);
  const _label = useMemo(() => label || String(value), [label, value]);

  if (!isEditing) {
    return (
      <Input
        value={undefined}
        className={classNames(
          '!text-link underline [&_.ant-input-prefix]:flex-1 [&_.ant-input-prefix]:overflow-hidden [&_input]:hidden',
          classNames,
        )}
        disabled={disabled}
        readOnly
        prefix={
          value ? (
            <Tooltip title={_label}>
              <span className="flex overflow-hidden whitespace-nowrap">
                <Link to={url} target={target} rel="noopener noreferrer">
                  {_label}
                </Link>
              </span>
            </Tooltip>
          ) : (
            <span />
          )
        }
        suffix={
          disabled ? (
            <span />
          ) : (
            <Button
              className="h-fit !w-fit p-0"
              type="text"
              onClick={(e) => {
                e.stopPropagation();
                setIsEditing(true);
              }}
              icon={<AiOutlineEdit className="text-16 !text-primary" />}
            />
          )
        }
        {...props}
      />
    );
  }

  return (
    <Input
      value={value}
      autoFocus
      disabled={disabled}
      {...props}
      onBlurCapture={(e) => {
        setIsEditing(false);
        props.onBlurCapture?.(e);
      }}
    />
  );
};
