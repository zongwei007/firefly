import ReactTable from 'rc-table';
import {
  useCallback,
  useMemo,
  useState,
  type FC,
  type FocusEventHandler,
  type MouseEventHandler,
  type ReactElement,
  type ReactNode,
} from 'react';
import type { TableProps as ReactTableProps } from 'rc-table/lib/Table';
import type { ColumnType, DefaultRecordType } from 'rc-table/lib/interface';
import { Button, Checkbox } from 'components';
import { mdiFolderPlus, mdiArrowUpThick, mdiArrowDownThick, mdiDelete } from '@mdi/js';

import styles from './style.module.css';
import classNames from 'classnames';

export type EditableColumnType<T> = ColumnType<T> & {
  component?: FC<{ className?: string; defaultValue?: string; onBlur: FocusEventHandler<HTMLElement> }>;
};

export type OperationRender<T> = (
  value: any,
  record: T,
  index: number,
  updater: (index: number, row?: T, originalRow?: T) => void
) => ReactNode;

type TableProps<T> = Omit<ReactTableProps<T>, 'columns'> & {
  columns: EditableColumnType<T>[];
  onCreate: () => T;
  onChange: (data: T[]) => void;
  operation?: {
    width?: string;
    render?: OperationRender<T>;
  };
  toolbar?: ReactElement;
  filter?: (input: string, data: T) => boolean;
};

type useTableParam<T> = Pick<TableProps<T>, 'data' | 'filter' | 'onChange' | 'columns' | 'operation'>;
type TableRows<T> = {
  positions: number[];
  items: T[];
};
type TableEditing<T> = [number?, ColumnType<T>['dataIndex']?];
type useTableResult<T> = [
  {
    filterValue: string;
    rows: TableRows<T>;
    selected: Set<T>;
    tableColumn: TableProps<T>['columns'];
  },
  {
    handleRowMove: (offset: number) => void;
    setEditing: (v: TableEditing<T>) => void;
    setFilterValue: (v: string) => void;
  }
];

function useTable<T>({ data, filter, onChange, columns, operation }: useTableParam<T>): useTableResult<T> {
  const [editing, setEditing] = useState<TableEditing<T>>([]);
  const [filterValue, setFilterValue] = useState('');
  const [selected, setSelected] = useState(new Set<T>());
  const rows = useMemo(() => extractRows(data, filterValue, filter), [data, filter, filterValue]);

  const handleRowChange = useCallback(
    (index: number, row?: T, originalRow?: T) => {
      const result = (data || []).concat([]);
      const pos = originalRow ? rows.positions[rows.items.indexOf(originalRow)] : 0;
      result.splice(pos, 1, ...(row ? [row] : []));
      onChange(result);
      setEditing([]);
    },
    [data, onChange, rows]
  );

  const handleRowMove = (offset: number) => {
    const result = (data || []).concat([]);

    selected.forEach(row => {
      const pos = rows.positions[rows.items.indexOf(row)];

      if (pos == null) {
        return;
      }

      const len = result.length;
      const idx = (len + pos + offset) % len;

      result.splice(pos, 1);
      result.splice(idx, 0, row);
    });

    onChange(result);
    setEditing([]);
  };

  const tableColumn: TableProps<T>['columns'] = useMemo(
    () => [
      {
        title: '',
        width: '2rem',
        className: styles.rowSelector,
        align: 'center',
        render(_value: unknown, row: T) {
          return (
            <Checkbox
              className={styles.checkbox}
              checked={selected.has(row)}
              onChange={event => {
                if (event.target.checked) {
                  selected.add(row);
                } else {
                  selected.delete(row);
                }

                setSelected(new Set(selected));
              }}
              size="sm"
            />
          );
        },
      },
      {
        title: '#',
        width: `${Math.max(2, String(data?.length || 0).length)}rem`,
        align: 'right',
        className: styles.rowNumber,
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
                onBlur={event => {
                  const { value } = event.target as any;

                  if (value !== undefined) {
                    handleRowChange(index, { ...row, [String(col.dataIndex)]: value }, row);
                    return;
                  }

                  setEditing([]);
                }}
              />
            );
          }

          return (
            <input
              className="sm"
              defaultValue={value}
              onBlur={event => handleRowChange(index, { ...row, [String(col.dataIndex)]: event.target.value }, row)}
              autoFocus
            />
          );
        },
      })),
      {
        title: '操作',
        width: operation?.width || '4rem',
        align: 'center',
        render(value, row, index) {
          return (
            <>
              <Button
                icon={mdiDelete}
                title="删除"
                mode="circle-link"
                size="sm"
                onClick={() => handleRowChange(index)}
              />
              {operation?.render?.(value, row, index, handleRowChange)}
            </>
          );
        },
      },
    ],
    [columns, data, editing, operation, selected, handleRowChange]
  );

  return [
    { filterValue, rows, selected, tableColumn },
    { setEditing, setFilterValue, handleRowMove },
  ];
}

const Table = <T extends DefaultRecordType>({
  className,
  columns,
  data,
  filter,
  onCreate,
  onChange,
  operation,
  toolbar,
  ...rest
}: TableProps<T>) => {
  const [{ filterValue, rows, selected, tableColumn }, { handleRowMove, setEditing, setFilterValue }] = useTable<T>({
    data,
    filter,
    onChange,
    columns,
    operation,
  });

  const handleCreate: MouseEventHandler<HTMLButtonElement> = event => {
    event.preventDefault();
    const row = onCreate();

    onChange([...(data || []), row]);
    setEditing([data?.length || 0, (columns || [])[0]?.dataIndex]);
  };

  return (
    <div className={classNames(styles.table, className)}>
      <div className={classNames(styles.toolbar, 'btn-group')}>
        <Button icon={mdiFolderPlus} onClick={handleCreate}>
          新增
        </Button>
        <Button icon={mdiArrowUpThick} onClick={() => handleRowMove(-1)} disabled={selected.size === 0}>
          上移
        </Button>
        <Button icon={mdiArrowDownThick} onClick={() => handleRowMove(1)} disabled={selected.size === 0}>
          下移
        </Button>
        {toolbar}
        {filter && (
          <div className={classNames('form-group', styles.filter)}>
            <input
              className="sm"
              placeholder="查询"
              onChange={event => setFilterValue(event.target.value.trim())}
              value={filterValue}
            />
          </div>
        )}
      </div>
      <ReactTable<T> {...rest} className="form-group" columns={tableColumn} data={rows.items} emptyText="无数据" />
    </div>
  );
};

function extractRows<T>(
  data: readonly T[] | undefined,
  filterValue: string,
  filter: TableProps<T>['filter']
): TableRows<T> {
  const result: { positions: Array<number>; items: Array<T> } = {
    positions: [],
    items: [],
  };

  if (!data) {
    return result;
  }

  for (let i = 0; i < data.length; i++) {
    const ele = data[i];

    if (!filterValue || !filter || filter(filterValue, ele)) {
      result.positions.push(i);
      result.items.push(ele);
    }
  }

  return result;
}

export default Table;
