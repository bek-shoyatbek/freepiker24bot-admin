import axios from "axios";
import { API_BASE_URL } from "../constants";

export const Axios = axios.create({
  // baseURL: API_BASE_URL,
  baseURL: "http://localhost:5500",
  timeout: 10 * 1000,
});
