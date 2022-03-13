import type { FC } from 'react';
import Image from 'next/image';
import styles from './style.module.css';

const Spinner: FC<{ loading?: boolean }> = props => {
  if (!props.loading) {
    return null;
  }

  return (
    <div className={styles.container}>
      <Image className={styles.icon} src="/assets/mdi/loading.svg" alt="正在加载..." width={64} height={64} />
    </div>
  );
};

export default Spinner;
