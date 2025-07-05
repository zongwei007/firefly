import { mdiLoading } from '@mdi/js';
import { Icon } from '@mdi/react';
import styles from './style.module.css';

function Spinner(props: { loading?: boolean }) {
  if (props.loading === false) {
    return null;
  }

  return (
    <div className={styles.container}>
      <Icon path={mdiLoading} className={styles.icon} size="64px" spin />
    </div>
  );
}

export default Spinner;
