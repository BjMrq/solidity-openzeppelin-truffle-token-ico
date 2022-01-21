import { Link } from "gatsby";
import { StaticImage } from "gatsby-plugin-image";
import PropTypes, { InferProps } from "prop-types";
import React, { ReactElement, useContext } from "react";

import { AuthContext } from "contexts/auth";

import LoggedIn from "./NavLoggedIn";
import LoggedOut from "./NavLoggedOut";
import { Header, Div, Icon, Title } from "./style";

export default function NavBar({
  siteTitle = "",
}: InferProps<typeof NavBar.propTypes>): ReactElement {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <Header>
      <Div>
        <Link to="/">
          <Div>
            <Icon>
              <StaticImage
                src="../../../../images/gatsby-icon.png"
                alt="Icon image"
              />
            </Icon>
            <Title>{siteTitle}</Title>
          </Div>
        </Link>
        {isAuthenticated ? <LoggedIn /> : <LoggedOut />}
      </Div>
    </Header>
  );
}

NavBar.propTypes = {
  siteTitle: PropTypes.string,
};

NavBar.defaultProps = {
  siteTitle: "",
};
