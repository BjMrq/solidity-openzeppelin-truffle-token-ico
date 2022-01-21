import { graphql, useStaticQuery } from "gatsby";
import PropTypes, { InferProps } from "prop-types";
import React, { ReactElement } from "react";

import { SiteData } from "types";

import NavBar from "./NavBar";
import PageHeader from "./PageHeader";
import { GlobalStyle, Container } from "./style";
import Toasts from "./Toasts";

export default function Layout({
  children,
  header,
}: InferProps<typeof Layout.propTypes>): ReactElement {
  const data = useStaticQuery<SiteData>(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `);

  return (
    <>
      <GlobalStyle />
      <NavBar siteTitle={data.site.siteMetadata.title} />
      <Container>
        <PageHeader text={header} />
        {children}
        <Toasts />
      </Container>
    </>
  );
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  header: PropTypes.string,
};

Layout.defaultProps = {
  header: "",
};
