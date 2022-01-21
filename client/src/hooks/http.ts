import { AxiosResponse } from "axios";
import { Reducer, useCallback, useContext, useEffect, useReducer } from "react";

import axios from "config/axios-instance";
import getCSRF from "config/config-csrf";
import { AccessToken, HttpStatus } from "config/constants";
import { AuthContext } from "contexts/auth";
import {
  ExecuteRequest,
  HttpAction,
  HttpRequestParams,
  HttpState,
  UseHttp,
} from "types";

// Initial state for Component using the http hook
const initialState = {
  loading: false,
  error: "",
  data: {},
};

// Reducer defining actions
const httpReducer: Reducer<HttpState, HttpAction> = (
  currentHttpState,
  { type, errorMessage, responseData }
) => {
  switch (type) {
    // The request is starting
    case "SEND":
      return {
        ...currentHttpState,
        loading: true,
        error: "",
        data: {},
      };

    // The response came back
    case "RESPONSE":
      return {
        ...currentHttpState,
        loading: false,
        data: responseData,
      };

    // An error occurred
    case "ERROR":
      return {
        ...currentHttpState,
        loading: false,
        error: errorMessage,
      };

    // Clear the state
    case "CLEAR":
      return initialState;

    default:
      throw new Error("An error occurred fetching data");
  }
};

// If initialRequest is passed during initialization of the hook
// a request will be made at the render of it's component
const useHttp: UseHttp = (initialRequest) => {
  // Create a state with reducer
  const [httpState, dispatchHttp] = useReducer(httpReducer, initialState);

  // If the is logged in the cookie will identified him or her
  // else we identified the client app in the Authorization header
  const { isAuthenticated } = useContext(AuthContext);

  const authorizationHeader = isAuthenticated
    ? {}
    : { Authorization: `Bearer ${AccessToken}` };

  const clearHttpState = useCallback(() => dispatchHttp({ type: "CLEAR" }), []);

  const executeRequest: ExecuteRequest = async (
    {
      // The method accept an url, a method a body and headers
      // to make the request, and the axios instance type
      url,
      method,
      body,
      headers,
    },
    axiosInstance
  ) =>
    axios[axiosInstance]({
      method,
      url,
      data: body,

      headers: {
        ...headers,

        // Add csrf token to be validated in the backend
        "csrf-token": await getCSRF(),
        ...authorizationHeader,
      },
    });

  // Defined the fetch method
  const sendRequest = useCallback(
    // The method accept an url, a method a body and headers
    // to make the request, and if the request is external
    async <M>(
      requestParameters: HttpRequestParams,
      external = false
    ): Promise<AxiosResponse<M>> => {
      try {
        dispatchHttp({
          type: "SEND",
        });

        // If the request should be external the external axios instance with no baseurl will be use
        const response = await (external
          ? executeRequest<M>(requestParameters, "externalInstance")
          : executeRequest<M>(requestParameters, "internalInstance"));

        // We can set up custom logic for authentication errors from our api endpoints external api call will throw an error on a response code superior to 400
        if (response.status >= HttpStatus.unauthorized) {
          dispatchHttp({
            type: "ERROR",
            //@ts-expect-error
            errorMessage: response.data.message as string,
          });
        } else if (response.status < HttpStatus.unauthorized) {
          // The request was successful, the data is made available to the Component
          dispatchHttp({
            type: "RESPONSE",
            responseData: response.data,
          });
        }

        // Return the response
        return response;
      } catch (error) {
        // Make error available to Component
        dispatchHttp({
          type: "ERROR",
          errorMessage: "Oups, something went wrong",
        });

        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        //@ts-expect-error
        return error as Error;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    // If initialRequest is passed during initialisation of the hook a request will be made at the render of it's component
    if (initialRequest) {
      sendRequest(initialRequest);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    isLoading: httpState.loading,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    httpData: httpState.data,
    httpError: httpState.error,
    sendRequest,
    clearHttpState,
  };
};

export default useHttp;
