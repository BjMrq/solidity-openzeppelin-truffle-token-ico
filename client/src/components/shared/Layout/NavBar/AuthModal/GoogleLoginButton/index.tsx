import { navigate } from "gatsby";
import PropTypes, { InferProps } from "prop-types";
import React, { ReactElement, useContext, useState } from "react";
import {
  GoogleLogin,
  GoogleLoginResponse,
  GoogleLoginResponseOffline,
} from "react-google-login";

import useHttp from "hooks/http";
import { AuthContext } from "contexts/auth";
import { GoogleClientId, HttpStatus } from "config/constants";
import { ErrorFeedBack } from "styles";
import { User } from "types";

import { ThirdPartyLogin } from "./style";

export default function GoogleLoginButton({
  redirect,
  redirectTo,
}: InferProps<typeof GoogleLoginButton.propTypes>): ReactElement {
  const { sendRequest } = useHttp();
  const { logIn } = useContext(AuthContext);
  const [loginError, setLoginError] = useState("");

  // Handle login through google
  const responseGoogle = async (response: GoogleLoginResponse) => {
    // Extract information from user object
    const { email, name, imageUrl, googleId } = response.profileObj;

    // Send register request
    const { status, data } = await sendRequest<{ user: User }>({
      url: "/register-third-party",
      method: "POST",

      body: {
        user: {
          email,
          name,
          profilePicture: imageUrl,
          googleId,
        },
      },
    });

    // If the request is successful set the the new token and user
    if (status === HttpStatus.ok) {
      logIn(data);
    }

    if (redirect) {
      await navigate(redirectTo as string);
    }
  };

  return (
    <>
      <ThirdPartyLogin>
        <GoogleLogin
          clientId={GoogleClientId}
          buttonText="Login with Google"
          onSuccess={
            responseGoogle as (
              response: GoogleLoginResponse | GoogleLoginResponseOffline
            ) => void
          }
          onFailure={() => setLoginError("Oups something went wrong")}
          cookiePolicy="single_host_origin"
        />
      </ThirdPartyLogin>

      <ErrorFeedBack>{loginError}</ErrorFeedBack>
    </>
  );
}

GoogleLoginButton.propTypes = {
  redirect: PropTypes.bool,
  redirectTo: PropTypes.string,
};

GoogleLoginButton.defaultProps = {
  redirect: false,
  redirectTo: "/app/profile",
};
