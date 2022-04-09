import type { FC } from 'react';
import styles from './style.module.css';
import { Icon } from 'components';
import { mdiLoading } from '@mdi/js';

const Spinner: FC<{ loading?: boolean }> = props => {
  if (props.loading === false) {
    return null;
  }

  return (
    <div className={styles.container}>
      <Icon path={mdiLoading} className={styles.icon} size="64px" spin />
    </div>
  );
};

export default Spinner;
