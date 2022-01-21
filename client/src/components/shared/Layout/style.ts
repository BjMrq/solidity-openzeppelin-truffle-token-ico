import styled, { createGlobalStyle } from "styled-components";

import { scrollbar, mainColor, bodyFont } from "styles";

export const GlobalStyle = createGlobalStyle`
  html {
    width: 100%;
    height: 100%;
  }

  body {
    ${scrollbar}
    margin:0;
    padding:0;
    width: 100%;
    padding-bottom: 20px;
    overflow-x: hidden;
    background-color: white;
  }

  a {
    text-decoration: none !important;
    display: inherit !important;
    color:  inherit !important;
  }

  input {
    padding: 10px 10px;
    border-radius: 5px;
    border: 1px solid ${mainColor};
    outline: none
  }
`;

export const Container = styled.div`
  margin: 0 8vw;
  font-family: ${bodyFont};
`;
