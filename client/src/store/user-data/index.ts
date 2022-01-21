import { atom } from "recoil";

import { UserData } from "types";

export const userDataState = atom<UserData>({
  key: "userDataState",

  default: {
    tokens: [],
    email: "",
  },
});
