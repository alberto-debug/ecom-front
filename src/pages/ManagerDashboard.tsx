import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  Input,
  Radio,
  RadioGroup,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar2 from "../components/Navbar2";

type Product = {
  id: number;
  productName: string;
  price: number;
  stockQuantity: number;
  category: string;
  expiryDate: string;
  imageUrl: string;
};

type CartItem = {
  productId: number;
  name: string;
  price: number;
  quantity: number;
};

type CartResponse = {
  id: number;
  items: CartItem[];
  total: number;
};

type OrderResponse = {
  orderId: number;
  cartId: number;
  paymentStatus: "PENDING" | "SUCCESS" | "FAILED";
};

export default function ManagerDashboard() {
  const toast = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartResponse | null>(null);
  const [paymentMethod, setPaymentMethod] = useState("mpesa");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [quantityInputs, setQuantityInputs] = useState<{ [key: number]: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  // Fetch products
  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }
      const response = await api.get("/product/getAll", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(response.data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch products",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Create new cart
  const createNewCart = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }
      const response = await api.post(
        "/api/carts/add",
        { items: [] },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCart(response.data);
      toast({
        title: "Success",
        description: "New cart created",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create cart",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch cart by ID
  const fetchCart = async (cartId: number) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }
      const response = await api.get(`/api/carts/${cartId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart(response.data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch cart",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Add to cart
  const addToCart = async (productId: number) => {
    if (!cart) {
      toast({
        title: "Error",
        description: "Please create a cart first",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    const quantity = parseInt(quantityInputs[productId]) || 1;
    const product = products.find(p => p.id === productId);
    if (product && quantity > product.stockQuantity) {
      toast({
        title: "Error",
        description: `Only ${product.stockQuantity} ${product.productName}(s) in stock`,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }
      await api.post(
        `/api/carts/add?cartId=${cart.id}`,
        { items: [{ productId, quantity }] },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchCart(cart.id);
      toast({
        title: "Success",
        description: "Item added to cart",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add to cart",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Update quantity
  const updateQuantity = async (productId: number, quantity: number) => {
    if (!cart) return;
    const product = products.find(p => p.id === productId);
    if (product && quantity > product.stockQuantity) {
      toast({
        title: "Error",
        description: `Only ${product.stockQuantity} ${product.productName}(s) in stock`,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }
      await api.put(
        `/api/carts/${cart.id}/items/${productId}/quantity`,
        { quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchCart(cart.id);
      toast({
        title: "Success",
        description: "Quantity updated",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update quantity",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Remove from cart
  const removeFromCart = async (productId: numbeCartItemr) => {
    if (!cart) return;
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }
      await api.delete(`/api/carts/${cart.id}/items/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchCart(cart.id);
      toast({
        title: "Success",
        description: "Item removed from cart",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to remove item",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Clear cart
  const clearCart = async () => {
    if (!cart) return;
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }
      await api.delete(`/api/carts/${cart.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart(null);
      toast({
        title: "Success",
        description: "Cart cleared",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to clear cart",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Poll order status
  const pollOrderStatus = async (orderId: number, token: string) => {
    try {
      const response = await api.get(`/api/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data as OrderResponse;
    } catch (error: any) {
      throw new Error(error.message || "Failed to fetch order status");
    }
  };

  // Handle checkout
  const handleCheckout = async () => {
    if (!cart || cart.items.length === 0) {
      toast({
        title: "Error",
        description: "Cart is empty",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    if (paymentMethod === "mpesa" && !phoneNumber.match(/^258\d{9}$/)) {
      toast({
        title: "Error",
        description: "Invalid phone number. Use format 258xxxxxxxxx",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }
      const response = await api.post(
        `/api/carts/${cart.id}/checkout`,
        { phoneNumber, paymentMethod, amount: cart.total },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const order = response.data as OrderResponse;
      toast({
        title: "Success",
        description: `Payment initiated via ${paymentMethod} to ${phoneNumber}. Please complete on your phone.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      // Poll for payment status
      const interval = setInterval(async () => {
        try {
          const status = await pollOrderStatus(order.orderId, token);
          if (status.paymentStatus === "SUCCESS") {
            toast({
              title: "Success",
              description: "Payment completed successfully",
              status: "success",
              duration: 5000,
              isClosable: true,
            });
            clearInterval(interval);
            await clearCart();
            setPhoneNumber("");
            await fetchProducts();
          } else if (status.paymentStatus === "FAILED") {
            toast({
              title: "Error",
              description: "Payment failed",
              status: "error",
              duration: 5000,
              isClosable: true,
            });
            clearInterval(interval);
          }
        } catch (error: any) {
          toast({
            title: "Error",
            description: error.message || "Failed to check payment status",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
          clearInterval(interval);
        }
      }, 5000);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Checkout failed",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle quantity input change
  const handleQuantityChange = (productId: number, value: string) => {
    setQuantityInputs({
      ...quantityInputs,
      [productId]: value,
    });
  };

  // Handle quantity input blur
  const handleQuantityBlur = (productId: number) => {
    const value = quantityInputs[productId];
    const parsedValue = parseInt(value);
    const product = products.find(p => p.id === productId);
    if (!value || isNaN(parsedValue) || parsedValue < 1) {
      setQuantityInputs({
        ...quantityInputs,
        [productId]: "1",
      });
    } else if (product && parsedValue > product.stockQuantity) {
      setQuantityInputs({
        ...quantityInputs,
        [productId]: product.stockQuantity.toString(),
      });
      toast({
        title: "Error",
        description: `Only ${product.stockQuantity} ${product.productName}(s) in stock`,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <Box minH="100vh" bg="gray.50">
      <Navbar2 />
      <Flex p={6} gap={10} justify="center" align="start" wrap="wrap">
        {/* Left: Products */}
        <Box
          flex="1"
          minW="300px"
          maxW="500px"
          bg="white"
          p={5}
          borderRadius="md"
          boxShadow="sm"
        >
          <Flex justify="space-between" align="center" mb={4}>
            <Heading size="md">Products</Heading>
            <Button
              colorScheme="teal"
              onClick={createNewCart}
              isLoading={isLoading}
            >
              Create New Cart
            </Button>
          </Flex>
          {isLoading ? (
            <Text>Loading products...</Text>
          ) : products.length === 0 ? (
            <Text>No products available.</Text>
          ) : (
            products.map((product) => (
              <Flex
                key={product.id}
                justify="space-between"
                mb={3}
                align="center"
              >
                <Box>
                  <Text fontWeight="bold">{product.productName}</Text>
                  <Text color="gray.600">MZN {product.price.toFixed(2)}</Text>
                  <Text color="gray.500">Stock: {product.stockQuantity}</Text>
                </Box>
                <Flex gap={2}>
                  <Input
                    type="number"
                    min={1}
                    max={product.stockQuantity}
                    width="60px"
                    value={quantityInputs[product.id] ?? ""}
                    onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                    onBlur={() => handleQuantityBlur(product.id)}
                    placeholder="1"
                  />
                  <Button
                    colorScheme="blue"
                    onClick={() => addToCart(product.id)}
                    isDisabled={!cart || isLoading || product.stockQuantity === 0}
                  >
                    Add to Cart
                  </Button>
                </Flex>
              </Flex>
            ))
          )}
        </Box>

        {/* Right: Cart */}
        <Box
          flex="1"
          minW="300px"
          maxW="500px"
          bg="white"
          p={5}
          borderRadius="md"
          boxShadow="sm"
        >
          <Heading size="md" mb={4}>
            Cart {cart ? `(ID: ${cart.id})` : ""}
          </Heading>
          {isLoading ? (
            <Text>Loading cart...</Text>
          ) : cart && cart.items.length > 0 ? (
            <>
              <Table size="sm" variant="simple" mb={3}>
                <Thead>
                  <Tr>
                    <Th>Product</Th>
                    <Th isNumeric>Qty</Th>
                    <Th isNumeric>Price</Th>
                    <Th>Action</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {cart.items.map((item) => (
                    <Tr key={item.productId}>
                      <Td>{item.name}</Td>
                      <Td isNumeric>
                        <Input
                          type="number"
                          min={1}
                          max={products.find(p => p.id === item.productId)?.stockQuantity || 1}
                          width="60px"
                          value={quantityInputs[item.productId] ?? item.quantity}
                          onChange={(e) => handleQuantityChange(item.productId, e.target.value)}
                          onBlur={() => {
                            const value = parseInt(quantityInputs[item.productId]) || item.quantity;
                            updateQuantity(item.productId, value);
                            handleQuantityBlur(item.productId);
                          }}
                          isDisabled={isLoading}
                        />
                      </Td>
                      <Td isNumeric>MZN {item.price.toFixed(2)}</Td>
                      <Td>
                        <Button
                          size="sm"
                          colorScheme="red"
                          onClick={() => removeFromCart(item.productId)}
                          isDisabled={isLoading}
                        >
                          Remove
                        </Button>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>

              <Divider my={2} />

              <Text fontWeight="bold" mb={2}>
                Total: MZN {cart.total.toFixed(2)}
              </Text>

              <RadioGroup
                onChange={setPaymentMethod}
                value={paymentMethod}
                mb={2}
              >
                <VStack align="start">
                  <Radio value="mpesa">M-Pesa</Radio>
                  <Radio value="cash">Cash</Radio>
                </VStack>
              </RadioGroup>

              {paymentMethod === "mpesa" && (
                <Input
                  placeholder="Phone Number (258xxxxxxxxx)"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  mb={2}
                />
              )}

              <Flex mt={4} gap={2}>
                <Button
                  colorScheme="green"
                  onClick={handleCheckout}
                  isLoading={isLoading}
                >
                  Initiate Payment
                </Button>
                <Button
                  onClick={clearCart}
                  isDisabled={isLoading}
                >
                  Clear Cart
                </Button>
              </Flex>
            </>
          ) : (
            <Text color="gray.500">
              Cart is empty. Create a new cart to start.
            </Text>
          )}
        </Box>
      </Flex>
    </Box>
  );
}
