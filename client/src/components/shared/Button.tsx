import PropTypes, { InferProps } from "prop-types";
import React, { ReactElement } from "react";
import styled from "styled-components";

import { button } from "styles";

const StyledButton = styled.div<{ readonly type?: string | null }>`
  ${button}
`;

export default function Button({
  text,
  type,
}: InferProps<typeof Button.propTypes>): ReactElement {
  return (
    <>
      <StyledButton type={type}>{text}</StyledButton>
    </>
  );
}

Button.propTypes = {
  text: PropTypes.string.isRequired,
  type: PropTypes.string,
};

Button.defaultProps = {
  type: "submit",
};
