import type { ElementType, FC, ReactNode, ReactElement } from 'react';
import Link from 'next/link';
import styles from './style.module.css';
import classNames from 'classnames';
import { useMemo } from 'react';
import { useRouter } from 'next/router';

type TabProps = {
  id: string;
  label: ReactNode;
  children: ReactElement;
  defaultActive?: boolean;
};

type TabsProps = {
  className?: string;
  tag?: ElementType;
  tabs: Array<TabProps>;
};

const TabContainer: FC<TabsProps> = ({ className, tag: Tag = 'div', tabs }) => {
  const router = useRouter();
  const activeTab = useMemo(() => {
    const [, hash] = router.asPath.split('#');
    const result = tabs.find(ele => ele.id === hash);

    return result || tabs.find(ele => ele.defaultActive);
  }, [router.asPath]);

  return (
    <Tag className={className}>
      <ul className={classNames(styles.tabs, 'pull-left')}>
        {tabs.map(ele => (
          <li
            key={ele.id}
            className={classNames(styles.tab, {
              [styles.active]: ele.id === activeTab?.id,
            })}>
            <Link href={`#${ele.id}`}>{ele.label}</Link>
          </li>
        ))}
      </ul>
      <div className={styles.panel}>
        {activeTab?.children}
      </div>
    </Tag>
  );
};

export default TabContainer;
