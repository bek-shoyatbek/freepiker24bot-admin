import axios from "axios";
import { API_BASE_URL } from "../constants";

export const Axios = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10 * 1000,
});
