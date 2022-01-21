import styled from "styled-components";

import { button, successColor } from "styles";

export const RevokeButton = styled.button`
  ${button}
`;

export const RevokeAllButton = styled.div`
  ${button}
  margin: 20px auto 15px auto
`;

export const TokenTitle = styled.p<{ readonly active?: boolean }>`
  font-size: 1.4em;
  text-align: center;
  ${({ active }) =>
    active &&
    `
    color: ${successColor};
  `}
`;

export const TokenDiv = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
`;
