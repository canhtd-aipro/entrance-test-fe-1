import classNames from 'classnames';
import { HTMLAttributes } from 'react';

type AppFormTitleProps = HTMLAttributes<HTMLDivElement> & {
  title: string;
  subTitle?: string;
};

export const AppFormTitle = ({ title, subTitle, className, ...props }: AppFormTitleProps) => {
  return (
    <div className={classNames('col-span-full mt-12 text-16 font-[600]', className)} {...props}>
      {title}
      {subTitle && <div className="text-14 font-[600]">{subTitle}</div>}
    </div>
  );
};
