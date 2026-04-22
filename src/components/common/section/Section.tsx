import classNames from 'classnames';
import React, { FC, PropsWithChildren, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IoArrowUpCircleOutline } from 'react-icons/io5';

type SectionProps = PropsWithChildren & {
  className?: string;
  icon?: React.ReactNode;
  title: React.ReactNode;
  defaultOpen?: boolean;
  renderRightIcon?: (open: boolean) => React.ReactNode;
  variant?: 'default' | 'no-border';
  collapsible?: boolean;
};

export const Section: FC<SectionProps> = ({
  className,
  children,
  title,
  icon,
  defaultOpen = true,
  collapsible = true,
  renderRightIcon,
  variant = 'default',
}) => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(defaultOpen);
  const [contentHeight, setContentHeight] = useState<number>();

  const containerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<ResizeObserver>();

  useEffect(() => {
    if (open) {
      setContentHeight(containerRef.current?.offsetHeight);
      observerRef.current?.disconnect();
      observerRef.current = new ResizeObserver(() => {
        setContentHeight(containerRef.current?.offsetHeight);
      });
      if (containerRef.current) {
        observerRef.current.observe(containerRef.current);
      }
    } else {
      setContentHeight(0);
      observerRef.current?.disconnect();
    }
  }, [open]);

  return (
    <div className={classNames('section', className)}>
      <div
        className={classNames('section-title flex cursor-pointer items-center justify-between py-8', {
          'border-0 border-b-1 border-solid border-border': variant === 'default',
          'border-0': variant === 'no-border',
        })}
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center space-x-8">
          {icon}
          <span className="text-16 font-[500]">{title}</span>
        </div>
        {collapsible && (
          <div className="flex items-center space-x-4 text-14 font-[400]">
            {renderRightIcon ? (
              renderRightIcon(open)
            ) : (
              <>
                <IoArrowUpCircleOutline
                  className={classNames('text-17 transition-all duration-[400ms]', { '-rotate-180': !open })}
                />
                {open ? t('common.hidden') : t('common.display')}
              </>
            )}
          </div>
        )}
      </div>

      <div
        className={classNames('overflow-hidden transition-all duration-[400ms]', { 'mt-16': open })}
        style={{ height: open ? contentHeight : 0 }}
      >
        <div ref={containerRef}>{children}</div>
      </div>
    </div>
  );
};
