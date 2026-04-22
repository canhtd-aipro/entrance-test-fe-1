import classNames from 'classnames';
import React, { FC, PropsWithChildren } from 'react';
import './styles.scss';

type BasePageProps = PropsWithChildren & {
  className?: string;
  contentClassName?: string;
  buttonsClassName?: string;
  buttons?: React.ReactNode;
};

export const BasePage: FC<BasePageProps> = ({ children, className, contentClassName, buttonsClassName, buttons }) => {
  return (
    <div className={classNames('base-page flex h-full flex-1 flex-col justify-between overflow-auto', className)}>
      <div className={classNames('px-12 pb-12 pt-6 sm:px-24 sm:pb-24 sm:pt-12', contentClassName)}>{children}</div>

      {buttons && (
        <div
          className={classNames(
            'base-page-footer sticky bottom-0 z-50 grid w-full grid-cols-[repeat(auto-fit,minmax(theme(spacing.100),1fr))] gap-4 bg-white px-12 py-6 sm:flex sm:justify-end sm:gap-0 sm:space-x-12 sm:px-24 sm:py-12',
            buttonsClassName,
          )}
        >
          {buttons}
        </div>
      )}
    </div>
  );
};
