import React, { ReactElement, useEffect } from "react";
import { useRecoilState } from "recoil";

import useHttp from "hooks/http";
import { userDataState, userState } from "store";
import { PageTitle } from "styles";
import { UserData } from "types";
import SEO from "components/shared/Layout/Seo";

import TokenList from "./TokensList";

export default function Profile(): ReactElement {
  const [userData, setUserData] = useRecoilState(userDataState);
  const [user] = useRecoilState(userState);
  const { sendRequest } = useHttp();

  useEffect(() => {
    (async () => {
      if (user?.uuid) {
        // Query the user
        const query = /* GraphQL */ `
        query {
          user(uuid: "${user.uuid}"){
            email
            tokens(orderBy: id) {
              device
              token
            }
          }
        }`;

        const {
          data: {
            data: {
              user: { tokens, email },
            },
          },
        } = await sendRequest<{ data: { user: UserData } }>({
          url: "/graphql",
          method: "POST",
          body: { query },
        });

        setUserData({
          tokens,
          email,
        });
      }
    })();
  }, [user, sendRequest, setUserData]);

  return (
    <>
      <SEO title="Profile" />
      <PageTitle>Welcome {userData?.email}</PageTitle>
      <TokenList />
    </>
  );
}
