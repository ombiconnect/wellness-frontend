import Axios from "axios";
import { apiBaseUrl } from "../Constant";

export const getAxios = () => {
  return Axios.create({
    baseURL: apiBaseUrl,
  });
};
