import type { ElementType, ReactNode, PropsWithChildren } from 'react';
import classNames from 'classnames';
import { Affix } from '@/components';
import styles from './style.module.css';
import Link from 'next/link';

type TabProps = {
  id: string;
  label: ReactNode;
  defaultActive?: boolean;
};

type TabsProps = PropsWithChildren<{
  affix?: Omit<Parameters<typeof Affix>[0], 'tag' | 'children'>;
  className?: string;
  tag?: ElementType;
  tabs: Array<TabProps>;
  activeKey?: string;
}>;

function TabContainer({ affix, className, tag: Tag = 'div', tabs, activeKey, children }: TabsProps) {
  const activeTab = tabs.find(ele => (activeKey ? ele.id === activeKey : ele.defaultActive));

  return (
    <Tag className={className}>
      <Affix
        {...affix}
        className={classNames(styles.tabs, affix?.className, 'pull-left')}
        tag="ul"
        paddingTop={affix ? affix.paddingTop : -1}>
        {() =>
          tabs.map(ele => (
            <li
              key={ele.id}
              className={classNames(styles.tab, {
                [styles.active]: ele.id === activeTab?.id,
              })}>
              <Link href={`/settings/${ele.id}`}>{ele.label}</Link>
            </li>
          ))
        }
      </Affix>
      <div className={styles.panel}>{children}</div>
    </Tag>
  );
}

export default TabContainer;
