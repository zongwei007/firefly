import type { DetailedHTMLProps, SelectHTMLAttributes } from 'react';

function CategorySelect({
  data: categories = [],
  ...props
}: DetailedHTMLProps<SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement> & {
  data?: IBookmarkConfiguration['categories'];
}) {
  return (
    <select {...props}>
      <option value="">{categories.length ? '未选择' : '加载中'}</option>
      {categories.map(ele => (
        <option key={ele.id} value={ele.id}>
          {ele.name}
        </option>
      ))}
    </select>
  );
}

export default CategorySelect;
