import { Tooltip } from 'antd';
import classNames from 'classnames';
import { FC, HTMLAttributes, useEffect, useRef, useState } from 'react';

export const TruncateTooltip: FC<HTMLAttributes<HTMLSpanElement>> = ({ className, children, ...props }) => {
  const [truncated, setTruncated] = useState(true);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const check = () => {
      const ellipsis = el.scrollWidth > el.clientWidth;
      setTruncated(ellipsis);
    };

    check();

    const ro = new ResizeObserver(check);
    ro.observe(el);

    return () => ro.disconnect();
  }, []);

  return (
    <Tooltip title={truncated ? children : undefined} placement="top" trigger="hover">
      <span ref={ref} className={classNames('truncate', className)} title="">
        {children}
      </span>
    </Tooltip>
  );
};
