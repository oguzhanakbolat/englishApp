import { useUserStore } from "@/stores/useUserStore";
import { err, log } from "@/utils/logger";
import axios, { AxiosError, AxiosResponse } from "axios";

export const cdnURL = "https://english.akbolat.net";
export const baseURL = "https://english.akbolat.net/api/";
export const api = axios.create({ baseURL });

export interface IApiError extends AxiosError {}
export interface IAxiosResponse extends AxiosResponse {}

export type IResponse = {
  data: any[] | any;
  status: boolean;
  message: string;
  error: string;
};

api.defaults.headers.common["Cache-Control"] = "no-cache";

api.interceptors.request.use(
  (request: any) => {
    return request;
  },
  (error) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  async (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export function setAuthorizationHeader(token: string) {
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

export function clearAuthorizationHeader() {
  delete api.defaults.headers.common["Authorization"];
}

export async function get(url = ""): Promise<{
  data: any;
  error: string | null;
  status: boolean;
}> {
  log("[GET]", url);

  try {
    const response = await api.get(url);
    return {
      data: response.data,
      error: null,
      status: response.status === 200,
    };
  } catch (error) {
    // burada iken 401 hatasına düşerse tokeni, kullanıcıyı logout et
    if ((error as IApiError)?.response?.status === 401) {
      useUserStore.getState().logout();
    }
    return {
      data: null,
      error: handleError(error as IApiError),
      status: false,
    };
  }
}

export async function post(url = "", data: any = null) {
  log("[POST]", url, data);
  try {
    const response = await api.post(url, data);

    return {
      data: response.data,
      error: null,
      status: response.status < 400,
    };
  } catch (error) {
    console.log({ error: error as IApiError });
    if ((error as IApiError)?.response?.status === 401) {
      useUserStore.getState().logout();
    }

    return {
      data: null,
      error: handleError(error as IApiError),
      status: false,
    };
  }
}

export async function put(url = "", data: any = null) {
  log("[PUT]", url);

  try {
    const response = await api.put(url, data);
    return {
      data: response.data,
      error: null,
      status: response.status === 200,
    };
  } catch (error) {
    if ((error as IApiError)?.response?.status === 401) {
      useUserStore.getState().logout();
    }

    return {
      data: null,
      error: handleError(error as IApiError),
      status: false,
    };
  }
}

export async function remove(url = "") {
  log("[DELETE]", url);
  try {
    const response = await api.delete(url);
    return {
      data: response.data,
      error: null,
      status: response.status === 200,
    };
  } catch (error) {
    if ((error as IApiError)?.response?.status === 401) {
      useUserStore.getState().logout();
    }

    return {
      data: null,
      error: handleError(error as IApiError),
      status: false,
    };
  }
}

export async function postData(imageUri: string, fileName?: string) {
  log("[POST DATA]", "upload", imageUri);

  try {
    const formData = new FormData();

    // React Native için dosya formatı
    const file = {
      uri: imageUri,
      type: "image/jpeg",
      name: fileName || `photo_${Date.now()}.jpg`,
    } as any;

    formData.append("files", file);

    const response = await api.post("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return { data: response.data, error: null, status: true };
  } catch (error) {
    if ((error as IApiError)?.response?.status === 401) {
      useUserStore.getState().logout();
    }

    return {
      data: null,
      error: handleError(error as IApiError),
      status: false,
    };
  }
}

export function handleError(error: IApiError): string {
  if (error?.status === 401) {
    err("401: Yetkisiz erişim", error);
  }

  const data: any = error?.response?.data;

  if (typeof data === "string" && data.trim().length > 0) {
    return data;
  }

  if (data?.error?.message && typeof data.error.message === "string") {
    return data.error.message;
  }

  if (data?.message && typeof data.message === "string") {
    return data.message;
  }

  if (error?.message && typeof error.message === "string") {
    return error.message;
  }

  return "Beklenmeyen bir hata oluştu";
}
