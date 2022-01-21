import styled, { keyframes } from "styled-components";

import { mainColor, bodyFont } from "styles";

export const Header = styled.header`
  height: 50px;
  padding: 15px 20px 15px 20px;
  background-color: ${mainColor};
  font-family: ${bodyFont};
`;

export const Div = styled.div`
  margin: 0 auto;
  max-width: 960;
  align-items: center;
  display: flex;
  justify-content: space-between;
`;

export const Title = styled.h1`
  color: white;
  font-size: 24px;
  font-weight: bold;
  margin: 0;
  padding: 0;
`;

export const spin = keyframes`
100% { transform: rotate(360deg);
}`;

export const Icon = styled.div`
  width: 26px;
  margin: 0 10px 5px 0;
  animation: ${spin} 26s linear infinite;
`;
