import classNames from 'classnames';
import { FC, PropsWithChildren } from 'react';

type AppCardProps = PropsWithChildren & {
  className?: string;
  description?: string;
};

export const AppCard: FC<AppCardProps> = ({ children, description, className }) => {
  return (
    <div className={classNames('app-card rounded-8 bg-white px-8 py-6 sm:px-16 sm:py-12', className)}>
      {description && <div className="mb-16 text-13 font-[400] text-tertiary">{description}</div>} {children}
    </div>
  );
};
