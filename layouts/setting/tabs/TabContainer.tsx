import type { ElementType, FC, ReactNode, ReactElement } from 'react';
import Link from 'next/link';
import classNames from 'classnames';
import { useMemo } from 'react';
import { useRouter } from 'next/router';
import { Affix } from 'components';
import styles from './style.module.css';

type TabProps = {
  id: string;
  label: ReactNode;
  children: ReactElement | null;
  defaultActive?: boolean;
};

type TabsProps = {
  affix?: Omit<Parameters<typeof Affix>[0], 'tag' | 'children'>;
  className?: string;
  tag?: ElementType;
  tabs: Array<TabProps>;
};

const TabContainer: FC<TabsProps> = ({ affix, className, tag: Tag = 'div', tabs }) => {
  const router = useRouter();
  const activeTab = useMemo(() => {
    const [, hash] = router.asPath.split('#');
    const result = tabs.find(ele => ele.id === hash);

    return result || tabs.find(ele => ele.defaultActive);
  }, [tabs, router.asPath]);

  return (
    <Tag className={className}>
      <Affix
        {...affix}
        className={classNames(styles.tabs, affix?.className, 'pull-left')}
        tag="ul"
        offsetTop={affix ? affix.offsetTop : -1}>
        {() =>
          tabs.map(ele => (
            <li
              key={ele.id}
              className={classNames(styles.tab, {
                [styles.active]: ele.id === activeTab?.id,
              })}>
              <Link href={`#${ele.id}`}>{ele.label}</Link>
            </li>
          ))
        }
      </Affix>
      <div className={styles.panel}>{activeTab?.children}</div>
    </Tag>
  );
};

export default TabContainer;
