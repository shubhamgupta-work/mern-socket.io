import axios from "axios";

const baseUrl = "/api";

type methods = "get" | "post" | "patch" | "put" | "delete";

const callAxios = async (
  method: methods,
  url: string,
  body?: any,
  config?: any
) => {
  if (method === "get" || method === "delete") {
    return axios[method](`${baseUrl}/${url}`, config);
  } else {
    return axios[method](`${baseUrl}/${url}`, body, config);
  }
};

export default callAxios;
