import { Spin } from 'antd';
import classNames from 'classnames';

type LoadingProps = {
  loading?: boolean;
  transparent?: boolean;
};

export const Loading: React.FC<LoadingProps> = ({ loading, transparent }) => {
  if (loading === false) return <></>;

  return (
    <div
      className={classNames('absolute inset-0 z-[1000] flex items-center justify-center bg-white', {
        'opacity-50': transparent !== false,
      })}
    >
      <Spin />
    </div>
  );
};
