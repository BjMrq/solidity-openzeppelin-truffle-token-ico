import AuthContextProvider from "contexts/auth";
import PropTypes from "prop-types";
import React from "react";
import { RecoilRoot } from "recoil";


// Wrap the app in the AuthContext
export const wrapRootElement = ({ element }) => (
  <RecoilRoot>
    <AuthContextProvider>{element}</AuthContextProvider>
  </RecoilRoot>
);

wrapRootElement.propTypes = {
  element: PropTypes.node.isRequired,
};
