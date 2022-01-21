import PropTypes, { InferProps } from "prop-types";
import React, { CSSProperties, ReactElement, Requireable } from "react";
import styled, { CSSObject } from "styled-components";

import { card } from "styles";

const CardDiv = styled.div<{ readonly style: CSSObject }>`
  ${card}
  ${({ style }) => style}
`;

const CardTitle = styled.p`
  font-size: 2em;
  text-align: center;
  font-weight: bold;
`;

export default function Card({
  children,
  title,
  style,
  onClick,
}: InferProps<typeof Card.propTypes>): ReactElement {
  return (
    // @ts-expect-error
    <CardDiv style={style} onClick={onClick}>
      <CardTitle>{title}</CardTitle>
      {children}
    </CardDiv>
  );
}

Card.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  // eslint-disable-next-line react/require-default-props
  onClick: PropTypes.func,
  style: PropTypes.object as Requireable<CSSProperties>,
};

Card.defaultProps = {
  title: "",
  style: {},
};
