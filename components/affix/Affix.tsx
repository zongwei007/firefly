'use client';

import {
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
} from 'react';
import { useIsomorphicLayoutEffect } from 'react-use';

type AffixProps = Omit<HTMLAttributes<HTMLOrSVGElement>, 'children'> & {
  children: (affix: boolean) => ReactNode;
  tag?: ElementType;
  paddingTop?: number;
  top?: number;
};

function Affix({ top = -1, paddingTop = 0, tag: Wrapper = 'div', children, style, ...rest }: AffixProps): ReactElement {
  const wrapperRef = useRef<HTMLElement>(null);
  const [affix, setAffix] = useState(false);

  useIsomorphicLayoutEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => {
        setAffix(e.intersectionRatio < 1);
      },
      { threshold: [1] }
    );

    observer.observe(wrapperRef.current!);

    return () => {
      observer.disconnect();
    };
  }, []);

  const affixStyle: CSSProperties = { ...style, position: 'sticky', top };

  if (affix) {
    affixStyle.paddingTop = paddingTop;
  }

  return (
    <Wrapper {...rest} ref={wrapperRef} style={affixStyle}>
      {children(affix)}
    </Wrapper>
  );
}

export default Affix;
