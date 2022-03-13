import type { FC } from 'react';
import styles from './style.module.css';
import { Icon } from 'components';

const Spinner: FC<{ loading?: boolean }> = props => {
  if (props.loading === false) {
    return null;
  }

  return (
    <div className={styles.container}>
      <Icon type="loading" className={styles.icon} width={64} height={64} />
    </div>
  );
};

export default Spinner;
