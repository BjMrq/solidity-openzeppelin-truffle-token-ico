import React, { ReactElement, useContext } from "react";
import { useRecoilState } from "recoil";

import Card from "components/shared/Card";
import { AuthContext } from "contexts/auth";
import useHttp from "hooks/http";
import { userDataState } from "store";

import { TokenDiv, TokenTitle, RevokeButton, RevokeAllButton } from "./style";

export default function TokenList(): ReactElement {
  const [userData, setUserData] = useRecoilState(userDataState);
  const { logOut } = useContext(AuthContext);
  const { sendRequest } = useHttp();

  const revokeToken = (tokenToRevoke: string) => {
    logOut({
      tokenToRevoke,
    });

    setUserData({
      ...userData,
      tokens: userData.tokens.filter((token) => token.token !== tokenToRevoke),
    });
  };

  return (
    <Card
      title="Where you are connected:"
      style={{
        width: "35%",
      }}
    >
      {userData.tokens.map((token) => (
        <TokenDiv key={token.token}>
          <TokenTitle>{token.device || "unknown"}</TokenTitle>
          <RevokeButton type="button" onClick={() => revokeToken(token.token)}>
            Logout
          </RevokeButton>
        </TokenDiv>
      ))}
      <RevokeAllButton
        onClick={async () =>
          await sendRequest({
            url: "/logout-all",
            method: "DELETE",
          })
        }
      >
        Logout All
      </RevokeAllButton>
    </Card>
  );
}
