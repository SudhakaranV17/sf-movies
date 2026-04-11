import axios, { type AxiosInstance } from "axios";
import { ZodType } from "zod";
import { useAuthStore } from "../store/useAuthStore";

class ApiClient {
  private static instance: ApiClient;
  private constructor(axiosInstance: AxiosInstance) {
    this.axiosInstance = axiosInstance;
    this.axiosInstance.interceptors.request.use(
      (config) => {
        const token = useAuthStore.getState().token;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error),
    );
  }
  private axiosInstance: AxiosInstance | undefined;
  public static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient(
        axios.create({
          baseURL: import.meta.env.DEV ? "/api" : import.meta.env.VITE_BASE_URL,
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }),
      );
    }
    return ApiClient.instance;
  }

  get axios() {
    return this.axiosInstance;
  }

  async get(endPoint: string, schema: ZodType, isArray: boolean = true) {
    const result = await this.axiosInstance?.get(endPoint);
    const parsedResult = isArray
      ? schema.array().safeParse(result?.data)
      : schema.safeParse(result?.data);

    if (result?.status === 200 || result?.status === 304) {
      if (parsedResult.success) {
        return parsedResult.data;
      } else {
        console.error("Zod Parse Error Details:", {
          endpoint: endPoint,
          errors: parsedResult.error.issues,
          rawData: result?.data,
          problemResource: isArray
            ? result?.data?.[parsedResult.error.issues[0]?.path?.[0]]
            : result?.data,
        });
        console.error("Full Zod Error:", parsedResult.error);
        throw new Error("Parse Error");
      }
    } else {
      return result;
    }
  }
  async post(
    endPoint: string,
    schema: ZodType,
    payload?: unknown,
    isArray: boolean = false,
  ) {
    const result = await this.axiosInstance?.post(endPoint, payload);
    const parsedResult = isArray
      ? schema.array().safeParse(result?.data)
      : schema.safeParse(result?.data);
    if (result?.status === 201 || result?.status === 200) {
      if (parsedResult.success) {
        return parsedResult.data;
      } else {
        throw new Error("Parse Error");
      }
    } else {
      return result;
    }
  }
  async patch(
    endPoint: string,
    schema: ZodType,
    payload?: unknown,
    isArray: boolean = false,
  ) {
    const result = await this.axiosInstance?.patch(endPoint, payload);
    const parsedResult = isArray
      ? schema.array().safeParse(result?.data)
      : schema.safeParse(result?.data);
    if (result?.status === 200) {
      if (parsedResult.success) {
        return parsedResult.data;
      } else {
        throw new Error("Parse Error");
      }
    } else {
      return result;
    }
  }

  async put(
    endPoint: string,
    schema: ZodType,
    payload?: unknown,
    isArray: boolean = false,
  ) {
    const result = await this.axiosInstance?.put(endPoint, payload);
    const parsedResult = isArray
      ? schema.array().safeParse(result?.data)
      : schema.safeParse(result?.data);
    if (result?.status === 200) {
      if (parsedResult.success) {
        return parsedResult.data;
      } else {
        throw new Error("Parse Error");
      }
    } else {
      return result;
    }
  }
  async delete(endPoint: string, schema: ZodType, payload?: any) {
    let result;
    if (payload) {
      result = await this.axiosInstance?.delete(endPoint, { data: payload });
    } else {
      result = await this.axiosInstance?.delete(endPoint);
    }
    const parsedResult = schema.safeParse(result?.data);
    if (result?.status === 200) {
      if (parsedResult.success) {
        return {
          status: result?.status,
          data: parsedResult.data,
        };
      } else {
        throw new Error("Parse Error");
      }
    } else {
      return result;
    }
  }
}
export default ApiClient.getInstance();
