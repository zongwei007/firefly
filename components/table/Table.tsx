import ReactTable from 'rc-table';
import type { FC, FocusEventHandler, MouseEventHandler } from 'react';
import { useCallback, useMemo, useState } from 'react';
import type { TableProps as ReactTableProps } from 'rc-table/lib/Table';
import type { ColumnType, DefaultRecordType } from 'rc-table/lib/interface';
import { Button } from 'components';

import styles from './style.module.css';
import classNames from 'classnames';

export type EditableColumnType<T> = ColumnType<T> & {
  component?: FC<{ className: string; defaultValue: string; onBlur: FocusEventHandler<HTMLFormElement> }>;
};

type TableProps<T> = Omit<ReactTableProps<T>, 'columns'> & {
  columns: EditableColumnType<T>[];
  onCreate: () => T;
  onChange: (data: T[]) => void;
};

const Table = <T extends DefaultRecordType>({
  className,
  columns,
  data,
  onCreate,
  onChange,
  ...rest
}: TableProps<T>) => {
  const [editing, setEditing] = useState<[number?, ColumnType<T>['dataIndex']?]>([]);

  const handleRowChange = (index: number, row?: T) => {
    const result = (data || []).concat([]);
    result.splice(index, 1, ...(row ? [row] : []));
    onChange(result);
    setEditing([]);
  };

  const handleRowMove = (row: T, index: number, offset: number) => {
    const len = data!.length;
    const idx = (len + index + offset) % len;

    const result = data!.concat([]);
    result.splice(index, 1);
    result.splice(idx, 0, row);

    onChange(result);
    setEditing([]);
  };

  const columnData: TableProps<T>['columns'] = useMemo(
    () => [
      {
        title: '#',
        width: '2.5rem',
        render(_value: unknown, _row: T, index: number) {
          return index + 1;
        },
      },
      ...(columns || []).map(col => ({
        ...col,
        onCell(row: T, index?: number) {
          if (editing && index !== undefined && index === editing[0] && col.dataIndex === editing[1]) {
            return {
              className: styles.editing,
            };
          }

          return {
            onClick() {
              setEditing([index, col.dataIndex]);
            },
          };
        },
        render(value: any, row: T, index: number) {
          if (!col.dataIndex || !editing.length || editing[0] !== index || editing[1] !== col.dataIndex) {
            return col.render ? col.render(value, row, index) : value;
          }

          if (col.component) {
            const FC = col.component;

            return (
              <FC
                className="sm"
                defaultValue={value}
                onBlur={event => handleRowChange(index, { ...row, [String(col.dataIndex)]: event.target.value })}
              />
            );
          }

          return (
            <input
              className="sm"
              defaultValue={value}
              onBlur={event => handleRowChange(index, { ...row, [String(col.dataIndex)]: event.target.value })}
              autoFocus
            />
          );
        },
      })),
      {
        title: '操作',
        width: '6.5rem',
        render(_value, row, index) {
          return (
            <div className={styles.opt}>
              <Button
                icon="arrow-up-thick"
                title="上移"
                mode="circle-link"
                size="sm"
                onClick={() => handleRowMove(row, index, -1)}
              />
              <Button
                icon="arrow-down-thick"
                title="下移"
                mode="circle-link"
                size="sm"
                onClick={() => handleRowMove(row, index, 1)}
              />
              <Button icon="delete" title="删除" mode="circle-link" size="sm" onClick={() => handleRowChange(index)} />
            </div>
          );
        },
      },
    ],
    [columns, editing]
  );

  const handleCreate: MouseEventHandler<HTMLButtonElement> = useCallback(
    event => {
      event.preventDefault();
      const row = onCreate();

      onChange([...(data || []), row]);
      setEditing([data?.length || 0, (columns || [])[0]?.dataIndex]);
    },
    [onChange, onCreate]
  );

  return (
    <div className={styles.table}>
      <div className="btn-group">
        <Button icon="folder-plus" onClick={handleCreate}>
          新增
        </Button>
      </div>
      <ReactTable<T>
        {...rest}
        className={classNames('form-group', className)}
        columns={columnData}
        data={data}
        emptyText="无数据"
      />
    </div>
  );
};

export default Table;
