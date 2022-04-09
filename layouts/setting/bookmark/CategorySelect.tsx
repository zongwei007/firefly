import type { DetailedHTMLProps, FC, SelectHTMLAttributes } from 'react';
import { useBookmarks } from 'hooks';

const CategorySelect: FC<DetailedHTMLProps<SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement>> = props => {
  const { data } = useBookmarks();
  const categories = data?.categories || [];

  return (
    <select {...props}>
      <option>{categories.length ? '未选择' : '加载中'}</option>
      {categories.map(ele => (
        <option key={ele.id} value={ele.id}>
          {ele.name}
        </option>
      ))}
    </select>
  );
};

export default CategorySelect;
