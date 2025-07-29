import axios, { AxiosError } from "axios";
import type { ProductRequestDTO, ProductResponseDTO } from "../types";

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

interface CartItemDTO {
  productId: number;
  quantity: number;
}

interface CartResponseDTO {
  cartId: number;
  items: { productId: number; name: string; price: number; quantity: number }[];
  total: number;
  status: string;
  createdAt: string;
}

interface OrderResponseDTO {
  orderId: number;
  cartId: number;
  paymentStatus: "PENDING" | "SUCCESS" | "FAILED";
}

type ApiErrorResponse = ResponseDTO | { message?: string } | null | undefined;

const api = axios.create({
  baseURL: "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
});

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

export const createProduct = async (
  dto: ProductRequestDTO,
  token: string,
): Promise<ProductResponseDTO> => {
  try {
    const response = await api.post("/product/create", dto, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ApiErrorResponse>;
    throw new Error(
      axiosError.response?.data?.message || "Failed to create product",
    );
  }
};

export const listProducts = async (
  token: string,
): Promise<ProductResponseDTO[]> => {
  try {
    const response = await api.get("/product/getAll", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ApiErrorResponse>;
    throw new Error(
      axiosError.response?.data?.message || "Failed to fetch products",
    );
  }
};

export const updateProduct = async (
  id: number,
  dto: ProductRequestDTO,
  token: string,
): Promise<ProductResponseDTO> => {
  try {
    const response = await api.put(`/product/${id}`, dto, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ApiErrorResponse>;
    throw new Error(
      axiosError.response?.data?.message || "Failed to update product",
    );
  }
};

export const deleteProduct = async (
  id: number,
  token: string,
): Promise<void> => {
  try {
    await api.delete(`/product/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    const axiosError = error as AxiosError<ApiErrorResponse>;
    throw new Error(
      axiosError.response?.data?.message || "Failed to delete product",
    );
  }
};

export const getProducts = async (
  token: string,
): Promise<ProductResponseDTO[]> => {
  try {
    const response = await api.get("/api/products", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ApiErrorResponse>;
    throw new Error(
      axiosError.response?.data?.message || "Failed to fetch products",
    );
  }
};

export const addToCart = async (
  data: { items: CartItemDTO[]; cartId?: number },
  token: string,
): Promise<CartResponseDTO> => {
  try {
    const response = await api.post("/api/carts/add", data.items, {
      params: { cartId: data.cartId },
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ApiErrorResponse>;
    throw new Error(
      axiosError.response?.data?.message || "Failed to add to cart",
    );
  }
};

export const getCart = async (
  cartId: number,
  token: string,
): Promise<CartResponseDTO> => {
  try {
    const response = await api.get(`/api/carts/${cartId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ApiErrorResponse>;
    throw new Error(
      axiosError.response?.data?.message || "Failed to fetch cart",
    );
  }
};

export const updateQuantity = async (
  cartId: number,
  productId: number,
  quantity: number,
  token: string,
): Promise<CartResponseDTO> => {
  try {
    const response = await api.put(
      `/api/carts/${cartId}/items/${productId}/quantity`,
      { quantity },
      { headers: { Authorization: `Bearer ${token}` } },
    );
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ApiErrorResponse>;
    throw new Error(
      axiosError.response?.data?.message || "Failed to update quantity",
    );
  }
};

export const removeFromCart = async (
  cartId: number,
  productId: number,
  token: string,
): Promise<CartResponseDTO> => {
  try {
    const response = await api.delete(
      `/api/carts/${cartId}/items/${productId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ApiErrorResponse>;
    throw new Error(
      axiosError.response?.data?.message || "Failed to remove item",
    );
  }
};

export const clearCart = async (
  cartId: number,
  token: string,
): Promise<CartResponseDTO> => {
  try {
    const response = await api.delete(`/api/carts/${cartId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ApiErrorResponse>;
    throw new Error(
      axiosError.response?.data?.message || "Failed to clear cart",
    );
  }
};

export const checkout = async (
  cartId: number,
  phoneNumber: string,
  paymentMethod: string,
  amount: number,
  token: string,
): Promise<OrderResponseDTO> => {
  try {
    const response = await api.post(
      `/api/carts/${cartId}/checkout`,
      { phoneNumber, paymentMethod, amount },
      { headers: { Authorization: `Bearer ${token}` } },
    );
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ApiErrorResponse>;
    throw new Error(axiosError.response?.data?.message || "Checkout failed");
  }
};

export const pollOrderStatus = async (
  orderId: number,
  token: string,
): Promise<OrderResponseDTO> => {
  try {
    const response = await api.get(`/api/orders/${orderId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ApiErrorResponse>;
    throw new Error(
      axiosError.response?.data?.message || "Failed to fetch order status",
    );
  }
};

export default api;
