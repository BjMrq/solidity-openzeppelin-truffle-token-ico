import styled from "styled-components";

import { mainColor, headerFont } from "styles";

export const Header = styled.p`
  margin-top: 15px;
  text-align: center;
  font-size: 26px;
  font-weight: bold;
  color: ${mainColor};
  font-family: ${headerFont};
`;

export const Div = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  margin: auto;
`;
