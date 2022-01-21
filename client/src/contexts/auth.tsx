import Cookie from "js-cookie";
import PropTypes, { InferProps } from "prop-types";
import React, {
  createContext,
  ReactElement,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useRecoilState } from "recoil";

import axiosInstance from "config/axios-instance";
import getCSRF from "config/config-csrf";
import {
  AuthContextState,
  AuthContextType,
  Login,
  LogOut,
  RemoveUserCookie,
  User,
} from "types";
import { isBrowser } from "utils";
import { userState } from "store";
import { HttpStatus } from "config/constants";

// Initial auth context
const initialState = {
  user: {
    uuid: "",
    email: "",
    profilePicture: "",
  },

  isAuthenticated: false,
};

// Launching the app we get eventual tokens stored
// in local storage to load in the auth context
const stateFromCookie = (): AuthContextState => {
  let storedState = {};

  // Get the auth storage
  const storedUser =
    isBrowser() && (JSON.parse(Cookie.get("app.user") || '""') as User | "");

  // If there is a token in the auth load it in the state with the user
  if (storedUser) {
    storedState = {
      user: storedUser,
      isAuthenticated: true,
    };
  }

  return {
    ...initialState,
    ...storedState,
  };
};

// The context is loaded from state found in local storage
export const AuthContext = createContext<AuthContextType>(
  stateFromCookie() as AuthContextType
);

export default function AuthContextTypeProvider({
  children,
}: InferProps<typeof AuthContextTypeProvider.propTypes>): ReactElement {
  const [authState, setAuthState] = useState(stateFromCookie());
  const setUser = useRecoilState(userState)[1];

  const updateStateAndStore = useCallback(
    (user, newAuthState = false) => {
      if (newAuthState) {
        // Set the auth state
        setAuthState(newAuthState);
      }

      if (user) {
        // Set the user in the app store
        setUser(user);
      }
    },
    [setUser]
  );

  // eslint-disable-next-line unicorn/consistent-function-scoping
  const removeUserCookie: RemoveUserCookie = () => {
    Cookie.remove("app.user");
    Cookie.remove("app.user.sig");
  };

  // Set token will store the token and user
  // in local storage and set the state and app store
  const logIn: Login = ({ user }) => {
    // Update state of the app
    updateStateAndStore(user, {
      user,
      isAuthenticated: true,
    });
  };

  // Log out will can logout user from the app and revoke a token in the backend
  const logOut: LogOut = useCallback(
    async ({ tokenToRevoke, logOutUser }) => {
      // If a token to revoke is pass to the function
      // it will be send to the backend
      await (tokenToRevoke
        ? axiosInstance.internalInstance({
            url: "/logout",
            method: "POST",

            headers: {
              "csrf-token": await getCSRF(),
            },

            // The token to be revoked is sent
            data: { token: tokenToRevoke },
          })
        : axiosInstance.internalInstance({
            url: "/logout",
            method: "POST",

            headers: {
              "csrf-token": await getCSRF(),
            },
          }));

      // If logOutUser is set to tru we log the user out of the app
      if (logOutUser) {
        // Remove token from local storage
        removeUserCookie();

        // Update state of the app
        updateStateAndStore({}, initialState);
      }
    },
    [updateStateAndStore]
  );

  // At the beginning og the app we revalidate the token,
  // in case it may have had expired
  useEffect(() => {
    (async () => {
      try {
        const { user, isAuthenticated } = authState;

        // If there is a token and it is not expired
        if (isAuthenticated) {
          // Check the token in the backend
          const check = await axiosInstance.internalInstance({
            url: "/check-token",
            method: "GET",

            headers: {
              "csrf-token": await getCSRF(),
            },
          });

          if (check.status === HttpStatus.ok) {
            // If it is okay we can load the user to the store
            updateStateAndStore(user);
          } else {
            // Else the token was not valid so we log the user out
            await logOut({ logOutUser: true });
          }
        }
      } catch {
        await logOut({ logOutUser: true });
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        logIn,
        logOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

AuthContextTypeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
