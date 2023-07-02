import axios from "axios";

const baseUrl = "/api";

type methods = "get" | "post" | "patch" | "put" | "delete";

const callAxios = async (method: methods, url: string, body?: any, config?: any) => {
  const userInfo = JSON.parse(localStorage.userInfo);
  if (method === "get" || method === "delete") {
    return axios[method](`${baseUrl}/${url}`, { headers: { Authorization: `Bearer ${userInfo.token}` } });
  } else {
    return axios[method](`${baseUrl}/${url}`, body, { headers: { Authorization: `Bearer ${userInfo.token}` } });
  }
};

export default callAxios;
