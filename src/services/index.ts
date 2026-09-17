import axios from "axios";
import { baseURL } from "./api";

export const loginService = async (email: string, password: string) =>
  await axios.post(baseURL + "auth/local", { identifier: email, password });

export const forgotPasswordService = async (email: string) =>
  await axios.post(baseURL + "auth/forgot-password", { email });

export const resetPasswordService = async (
  email: string,
  password: string,
  code: string,
) =>
  await axios.post(baseURL + "auth/reset-password", { email, password, code });

export const registerService = async (data: any) =>
  await axios.post(baseURL + "auth/local/register", data);
