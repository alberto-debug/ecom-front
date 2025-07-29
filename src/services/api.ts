import axios, { AxiosError } from "axios";
import type { ProductRequestDTO, ProductResponseDTO } from "../types";

// ================== Types ==================
interface LoginResponse {
  token: string;
  message?: string;
  status?: string;
}

export interface User {
  email: string;
  roles: string[];
  name?: string;
}

interface ResponseDTO {
  message: string;
  data?: string | null;
}

type ApiErrorResponse = ResponseDTO | { message?: string } | null | undefined;

// ================== Axios Instance ==================
const api = axios.create({
  baseURL: "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
});

// ================== Auth ==================

// Admin login → POST /admin/login
export const adminLogin = async (
  email: string,
  password: string,
): Promise<LoginResponse> => {
  try {
    const response = await api.post<LoginResponse>("/admin/login", {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ApiErrorResponse>;
    throw new Error(axiosError.response?.data?.message || "Admin login failed");
  }
};

// Manager login → POST /login/login
export const managerLogin = async (
  email: string,
  password: string,
): Promise<LoginResponse> => {
  try {
    const response = await api.post<LoginResponse>("/login/login", {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ApiErrorResponse>;
    throw new Error(
      axiosError.response?.data?.message || "Manager login failed",
    );
  }
};

// ================== Token Decoding ==================
export const getUserFromToken = (token: string): User => {
  try {
    if (!token) throw new Error("No token provided");

    const base64Payload = token.split(".")[1];
    if (!base64Payload) throw new Error("Invalid token format");

    const jsonPayload = atob(base64Payload);
    const payload = JSON.parse(jsonPayload) as {
      sub?: string;
      email?: string;
      roles?: string | string[];
      authorities?: string[];
      auth?: string[];
      role?: string;
      name?: string;
      [key: string]: any;
    };

    const email: string = payload.sub || payload.email || "";
    if (!email) throw new Error("Email not found in token");

    const roles: string[] = Array.isArray(payload.roles)
      ? payload.roles
      : Array.isArray(payload.authorities)
        ? payload.authorities
        : Array.isArray(payload.auth)
          ? payload.auth
          : payload.role
            ? [payload.role]
            : [];

    return {
      email,
      roles,
      name: payload.name,
    };
  } catch (err) {
    throw new Error("Invalid token");
  }
};

// ================== Manager Management ==================

// Create manager → POST /admin/managers/create
export const createManager = async (
  name: string,
  email: string,
  password: string,
  token: string,
): Promise<{ message: string }> => {
  try {
    const response = await api.post(
      "/admin/managers/create",
      { name, email, password },
      { headers: { Authorization: `Bearer ${token}` } },
    );
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ApiErrorResponse>;
    throw new Error(
      axiosError.response?.data?.message || "Failed to create manager",
    );
  }
};

// List managers → GET /admin/managers/list
export const listManagers = async (
  token: string,
): Promise<{ message: string; data: string }> => {
  try {
    const response = await api.get("/admin/managers/list", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ApiErrorResponse>;
    throw new Error(
      axiosError.response?.data?.message || "Failed to list managers",
    );
  }
};

// Delete manager → DELETE /admin/managers/delete/:id
export const deleteManager = async (
  id: string,
  token: string,
): Promise<{ message: string }> => {
  try {
    const response = await api.delete(`/admin/managers/delete/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ApiErrorResponse>;
    throw new Error(
      axiosError.response?.data?.message || "Failed to delete manager",
    );
  }
};

// Search manager → GET /admin/managers/search?email=...
export const searchManager = async (
  email: string,
  token: string,
): Promise<{ message: string; data: string }> => {
  try {
    const response = await api.get(`/admin/managers/search?email=${email}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ApiErrorResponse>;
    throw new Error(
      axiosError.response?.data?.message || "Failed to search manager",
    );
  }
};

// Create Product
export const createProduct = async (
  dto: ProductRequestDTO,
  token: string,
): Promise<ProductResponseDTO> => {
  const response = await api.post("/product/create", dto, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// List Products
export const listProducts = async (
  token: string,
): Promise<ProductResponseDTO[]> => {
  const response = await api.get("/product/getAll", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Update Product
export const updateProduct = async (
  id: number,
  dto: ProductRequestDTO,
  token: string,
): Promise<ProductResponseDTO> => {
  const response = await api.put(`/product/${id}`, dto, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Delete Product
export const deleteProduct = async (
  id: number,
  token: string,
): Promise<void> => {
  await api.delete(`/product/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export default api;
