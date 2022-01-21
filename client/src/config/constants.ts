/* eslint-disable @typescript-eslint/no-unsafe-member-access */
// eslint-disable-next-line max-len
export const emailRegEx = /^(([^\s"(),.:;<>@[\\\]]+(\.[^\s"(),.:;<>@[\\\]]+)*)|(".+"))@((\[(?:\d{1,3}\.){3}\d{1,3}])|(([\dA-Za-z\-]+\.)+[A-Za-z]{2,}))$/;

export const ApiEndpoint = process.env.GATSBY_API_ENDPOINT as string;

export const GoogleClientId = process.env
  .GATSBY_GOOGLE_LOGIN_CLIENT_ID as string;

export const AccessToken = process.env.GATSBY_ACCESS_TOKEN as string;

export const HttpStatus = {
  ok: 200,
  error: 500,
  created: 201,
  unauthorized: 400,
};
