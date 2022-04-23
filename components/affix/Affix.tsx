import type { CSSProperties, ElementType, HTMLAttributes, ReactElement, ReactNode } from 'react';
import { useState, useEffect } from 'react';
import { useWindowScroll } from 'react-use';

type AffixProps = Omit<HTMLAttributes<HTMLOrSVGElement>, 'children'> & {
  children: (affix: boolean) => ReactNode;
  tag?: ElementType;
  offsetTop?: number;
};

const Affix = ({ offsetTop = 0, tag: Wrapper = 'div', children, style, ...rest }: AffixProps): ReactElement => {
  const { y: scrollTop } = useWindowScroll();
  const [affix, setAffix] = useState(false);

  useEffect(() => {
    if (offsetTop >= 0 && scrollTop > 0) {
      setAffix(true);

      return;
    }

    setAffix(false);
  }, [scrollTop, offsetTop]);

  const affixStyle: CSSProperties = { ...style };

  if (affix) {
    affixStyle.position = 'fixed';
    affixStyle.top = offsetTop;
  }

  return (
    <Wrapper {...rest} style={affixStyle}>
      {children(affix)}
    </Wrapper>
  );
};

export default Affix;
