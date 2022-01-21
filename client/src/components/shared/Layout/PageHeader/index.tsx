import PropTypes, { InferProps } from "prop-types";
import React, { ReactElement } from "react";

import { Div, Header } from "./style";

export default function PageHeader({
  text = "",
}: InferProps<typeof PageHeader.propTypes>): ReactElement {
  return (
    <Div>
      <Header>{text}</Header>
    </Div>
  );
}

PageHeader.propTypes = {
  text: PropTypes.string,
};

PageHeader.defaultProps = {
  text: "",
};
