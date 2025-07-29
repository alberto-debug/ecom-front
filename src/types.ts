export interface LoginResponse {
  name: string;
  token: string;
}

export interface User {
  email: string;
  roles: string[];
}

export interface ProductRequestDTO {
  productName: string;
  price: number;
  quantity: number;
  category: string;
  expiryDate: string;
  imageUrl: string;
}

export interface ProductResponseDTO {
  id: number;
  name: string;
  price: number;
}
