import { FC, HTMLAttributes, Suspense, useMemo } from 'react';
import { listIcons } from './list-icons.constant';

type IconName = keyof typeof listIcons;

type IconProps = HTMLAttributes<HTMLDivElement> & {
  name: IconName;
  className?: string;
};

export const Icon: FC<IconProps> = ({ name, className, ...others }) => {
  const SvgIcon = useMemo(() => listIcons[name], [name]);

  if (!SvgIcon) return null;

  return (
    <div
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      className={className}
      role="img"
      {...others}
    >
      <Suspense fallback={null}>
        <SvgIcon className="max-h-full max-w-full" />
      </Suspense>
    </div>
  );
};
