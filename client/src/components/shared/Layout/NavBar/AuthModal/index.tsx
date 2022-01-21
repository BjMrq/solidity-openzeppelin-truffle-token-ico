import { navigate } from "@reach/router";
import PropTypes, { InferProps } from "prop-types";
import React, { ReactElement, useContext, useState } from "react";
import Modal from "react-modal";
import { useForm } from "react-hook-form";

import useHttp from "hooks/http";
import { AuthContext } from "contexts/auth";
import { AccessToken, emailRegEx, HttpStatus } from "config/constants";
import Loading from "components/shared/Loading";
import {
  ErrorFeedBack,
  Form,
  FormTitle,
  InputButton,
  Label,
  SuccessFeedBack,
} from "styles";
import { User } from "types";

import GoogleLoginButton from "./GoogleLoginButton";
import {
  customStyles,
  TitleDiv,
  TextSeparator,
  PasswordResetRequest,
} from "./style";

Modal.setAppElement("#___gatsby");

type FormData = {
  email: string;
  password?: string;
};

export default function AuthModal({
  setAuthAction,
  userAuthAction,
  actions,
}: InferProps<typeof AuthModal.propTypes>): ReactElement {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const { isLoading, httpError, sendRequest, clearHttpState } = useHttp();
  const [successFeedBack, setSuccessFeedBack] = useState("");
  const { logIn } = useContext(AuthContext);
  const { authModalOpen, authAction } = userAuthAction as UserAuthAction;
  const { SIGNUP, LOGIN, PASSWORD_RESET } = actions as AuthActions;

  const closeAuthModal = () => {
    setAuthAction({ authModalOpen: false });
    setSuccessFeedBack("");
    clearHttpState();
  };

  const loginUser = async (body: FormData): Promise<void> => {
    // Send logIn request
    const { status, data } = await sendRequest<{ user: User }>({
      url: "/login",
      method: "POST",
      body,
    });

    // If the request is successful set the the new token and user
    if (status === HttpStatus.ok) {
      logIn(data);
      await navigate("/app/profile");
    }
  };

  const registerNewUser = async ({ email }: FormData) => {
    // Send register request
    const { status } = await sendRequest({
      url: "/register",
      method: "POST",

      body: {
        email,
      },

      headers: {
        Authorization: `Bearer ${AccessToken}`,
      },
    });

    if (status === HttpStatus.created) {
      setSuccessFeedBack(
        "Almost done, please verify your email and you're all set!"
      );
    }
  };

  const passwordResetRequest = async (body: FormData) => {
    // Send reset password request
    const { status } = await sendRequest({
      url: "/request-password-reset",
      method: "POST",
      body,

      headers: {
        Authorization: `Bearer ${AccessToken}`,
      },
    });

    if (status === HttpStatus.ok) {
      setSuccessFeedBack(
        "A reset password link has been sent to the indicated email"
      );
    }
  };

  // Change auth action depending of click in form header
  const switchAuthAction = (newAction: PossibleAuthActions) => {
    setAuthAction({
      authModalOpen: true,
      authAction: newAction,
    });
    setSuccessFeedBack("");
    clearHttpState();
  };

  // Control auth action on the submit
  const submitAuthAction = (formData: FormData) => {
    switch (authAction) {
      case LOGIN:
        loginUser(formData);

        break;
      case SIGNUP:
        registerNewUser(formData);

        break;
      case PASSWORD_RESET:
        passwordResetRequest(formData);

        break;

      default:
        break;
    }
  };

  // Control the text in the submit button
  const getSubmitButtonText = () => {
    switch (authAction) {
      case LOGIN:
        return "Log In";
      case SIGNUP:
        return "Sig Up";
      case PASSWORD_RESET:
        return "Send reset link";

      default:
        return "Submit";
    }
  };

  return (
    <Modal
      isOpen={authModalOpen}
      onRequestClose={closeAuthModal}
      style={customStyles}
      contentLabel="SignUp Modal"
    >
      <TitleDiv>
        <FormTitle
          active={authAction === SIGNUP}
          onClick={() => switchAuthAction(SIGNUP)}
        >
          Register
        </FormTitle>
        <FormTitle
          active={authAction === LOGIN}
          onClick={() => switchAuthAction(LOGIN)}
        >
          Log In
        </FormTitle>
      </TitleDiv>
      <GoogleLoginButton />
      {authAction === SIGNUP && (
        <TextSeparator>Or get a magic link</TextSeparator>
      )}
      <Form onSubmit={handleSubmit(submitAuthAction)}>
        {!successFeedBack && (
          <>
            {/* email input */}
            <Label htmlFor="email">Email:</Label>
            <input
              placeholder="Email"
              {...register("email", {
                required: "An email is required",

                pattern: {
                  value: emailRegEx,
                  message: "Please register a valid email address",
                },
              })}
            />
            {/* Error feedback for email */}
            <ErrorFeedBack>{errors.email?.message}</ErrorFeedBack>

            {/* If the auth action is signup or login add a password input */}
            {authAction === LOGIN && (
              <>
                <Label htmlFor="password">Password:</Label>
                <input
                  placeholder="Password"
                  type="password"
                  {...register("password", {
                    required: "A password is required",

                    maxLength: {
                      value: 80,

                      message:
                        "A password should be no more than 80 character long",
                    },

                    minLength: {
                      value: 8,
                      message: "A password should be at least 8 character long",
                    },
                  })}
                />
                <ErrorFeedBack>{errors.password?.message}</ErrorFeedBack>
              </>
            )}

            {/* If the auth action is login ass a password reset option */}
            {authAction === LOGIN && (
              <>
                <PasswordResetRequest
                  onClick={() => switchAuthAction(PASSWORD_RESET)}
                >
                  Forgot your password ?{" "}
                </PasswordResetRequest>
              </>
            )}
          </>
        )}

        <ErrorFeedBack>{httpError}</ErrorFeedBack>
        <SuccessFeedBack>{successFeedBack}</SuccessFeedBack>

        {isLoading ? (
          <Loading />
        ) : (
          !successFeedBack && <InputButton value={getSubmitButtonText()} />
        )}
      </Form>
    </Modal>
  );
}

// Props validation
AuthModal.propTypes = {
  userAuthAction: PropTypes.shape({
    authModalOpen: PropTypes.bool.isRequired,

    authAction: PropTypes.oneOf(["login", "signup", "passwordReset"]),
  }).isRequired,

  setAuthAction: PropTypes.func.isRequired,

  actions: PropTypes.shape({
    LOGIN: PropTypes.oneOf(["login"]).isRequired,
    SIGNUP: PropTypes.oneOf(["signup"]).isRequired,
    PASSWORD_RESET: PropTypes.oneOf(["passwordReset"]).isRequired,
  }).isRequired,
};

// Types
type PossibleAuthActions = "login" | "signup" | "passwordReset";

type AuthActions = {
  LOGIN: "login";
  SIGNUP: "signup";
  PASSWORD_RESET: "passwordReset";
};

type UserAuthAction = {
  authModalOpen: boolean;
  authAction?: PossibleAuthActions;
};
