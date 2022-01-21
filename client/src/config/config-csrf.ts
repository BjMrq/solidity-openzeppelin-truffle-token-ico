import axiosInstance from "./axios-instance";
import { AccessToken } from "./constants";

const getCSRF = async (): Promise<string> => {
  const {
    data: { csrf: newCsrf },
  } = (await axiosInstance.internalInstance({
    url: "/get-csrf",
    withCredentials: true,

    headers: {
      Authorization: `Bearer ${AccessToken}`,
    },
  })) as { data: { csrf: string } };

  return newCsrf;
};

export default getCSRF;
