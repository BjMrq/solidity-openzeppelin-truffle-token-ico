import styled from "styled-components";

import { secondColor } from "styles";

export const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    boxShadow: "0px 3px 6px #222",
    transform: "translate(-50%, -50%)",
    width: "30%",
    padding: "0",
  },
};

export const TitleDiv = styled.div`
  display: flex;
  justify-content: space-around;
`;

export const PasswordResetRequest = styled.p`
  color: ${secondColor};
  cursor: pointer;
`;

export const TextSeparator = styled.div`
  margin-top: 35px;
  display: flex;
  justify-content: space-around;
`;
