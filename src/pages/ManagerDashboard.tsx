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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  useDisclosure,
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
  paymentStatus: "PENDING" | "COMPLETED" | "FAILED";
  checkoutRequestId?: string;
  total: number;
  paymentMethod: string;
};

export default function ManagerDashboard() {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartResponse | null>(null);
  const [paymentMethod, setPaymentMethod] = useState("mpesa");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [quantityInputs, setQuantityInputs] = useState<{
    [key: number]: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);

  // Payment modal states
  const [paymentStatus, setPaymentStatus] = useState<
    "processing" | "success" | "failed" | null
  >(null);
  const [currentOrder, setCurrentOrder] = useState<OrderResponse | null>(null);
  const [paymentMessage, setPaymentMessage] = useState("");
  const [pollInterval, setPollInterval] = useState<NodeJS.Timeout | null>(null);

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
        { headers: { Authorization: `Bearer ${token}` } },
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
      // If cart not found, it might have been completed
      if (
        error.response?.status === 404 ||
        error.message.includes("not found")
      ) {
        setCart(null);
        toast({
          title: "Cart Completed",
          description: "Cart has been completed successfully",
          status: "info",
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Error",
          description: error.message || "Failed to fetch cart",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
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
    const product = products.find((p) => p.id === productId);
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
        { headers: { Authorization: `Bearer ${token}` } },
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
    const product = products.find((p) => p.id === productId);
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
        { headers: { Authorization: `Bearer ${token}` } },
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
  const removeFromCart = async (productId: number) => {
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

  // Poll order status with retry logic
  const pollOrderStatus = async (
    orderId: number,
    token: string,
    retries: number = 3,
  ): Promise<OrderResponse> => {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        console.log(
          `Polling order ${orderId} (Attempt ${attempt}/${retries})...`,
        );
        const response = await api.get(`/api/orders/${orderId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Poll response:", response.data);
        return response.data as OrderResponse;
      } catch (error: any) {
        console.error(
          `Error polling order status (Attempt ${attempt}/${retries}):`,
          error,
        );
        if (attempt === retries) {
          throw new Error(
            error.message || "Failed to fetch order status after retries",
          );
        }
        // Wait before retrying
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    }
    throw new Error("Failed to fetch order status after retries");
  };

  // Handle payment cancellation
  const handlePaymentCancel = async () => {
    if (pollInterval) {
      clearInterval(pollInterval);
      setPollInterval(null);
    }

    setPaymentStatus("failed");
    setPaymentMessage(`a= Payment cancelled by user`);

    // Auto-close modal after 2 seconds
    setTimeout(() => {
      onClose();
      resetPaymentModal();
    }, 2000);
  };

  // Handle successful payment completion
  const handlePaymentSuccess = async (paymentMethod: string) => {
    if (pollInterval) {
      clearInterval(pollInterval);
      setPollInterval(null);
    }

    setPaymentStatus("success");
    setPaymentMessage(
      paymentMethod === "mpesa"
        ? `a= Payment completed successfully!`
        : "Payment completed successfully!",
    );

    // Refresh products to show updated stock
    await fetchProducts();

    // Reset form
    setPhoneNumber("");

    // Auto-close modal after 3 seconds
    setTimeout(() => {
      onClose();
      resetPaymentModal();
    }, 3000);
  };

  // Handle payment failure
  const handlePaymentFailure = (message: string) => {
    if (pollInterval) {
      clearInterval(pollInterval);
      setPollInterval(null);
    }

    setPaymentStatus("failed");
    setPaymentMessage(`a= ${message}`);

    // Auto-close modal after 5 seconds
    setTimeout(() => {
      onClose();
      resetPaymentModal();
    }, 5000);
  };

  // Reset payment modal state
  const resetPaymentModal = () => {
    if (pollInterval) {
      clearInterval(pollInterval);
      setPollInterval(null);
    }
    setPaymentStatus(null);
    setCurrentOrder(null);
    setPaymentMessage("");
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
        { headers: { Authorization: `Bearer ${token}` } },
      );

      const order = response.data as OrderResponse;
      setCurrentOrder(order);
      console.log("Checkout response:", order);

      // Open modal for all payment methods
      onOpen();

      if (paymentMethod === "cash") {
        // Cash payments are completed immediately
        setPaymentStatus("success");
        setPaymentMessage("Payment completed successfully!");
        // Auto-close modal after 3 seconds
        setTimeout(() => {
          onClose();
          resetPaymentModal();
          fetchProducts(); // Refresh products to update stock
        }, 3000);
      } else if (paymentMethod === "mpesa") {
        setPaymentStatus("processing");
        setPaymentMessage(
          `a= Please complete the payment on your phone (${phoneNumber}).\nTransaction ID: ${order.checkoutRequestId || "Not provided"}`,
        );

        const interval = setInterval(async () => {
          try {
            console.log("Polling payment status for order:", order.orderId);
            const status = await pollOrderStatus(order.orderId, token);
            console.log("Payment status response:", status);

            if (status.paymentStatus === "COMPLETED") {
              clearInterval(interval);
              setPollInterval(null);
              handlePaymentSuccess("mpesa");
            } else if (status.paymentStatus === "FAILED") {
              clearInterval(interval);
              setPollInterval(null);
              handlePaymentFailure(
                "Payment was cancelled or failed. Please try again.",
              );
            }
          } catch (error: any) {
            console.error("Error polling payment status:", error);
            clearInterval(interval);
            setPollInterval(null);
            handlePaymentFailure(
              "Unable to verify payment status. Please check your M-Pesa messages and contact support if payment was deducted.",
            );
          }
        }, 10000); // Poll every 10 seconds

        setPollInterval(interval);

        // Set timeout for payment (5 minutes)
        setTimeout(() => {
          if (paymentStatus === "processing") {
            clearInterval(interval);
            setPollInterval(null);
            handlePaymentFailure(
              "Payment timeout. Please check your M-Pesa messages and contact support if payment was deducted.",
            );
          }
        }, 300000); // 5 minutes timeout
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error || error.message || "Checkout failed";

      setPaymentStatus("failed");
      setPaymentMessage(
        paymentMethod === "mpesa" ? `a= ${errorMessage}` : errorMessage,
      );
      onOpen();

      // Auto-close modal after 5 seconds
      setTimeout(() => {
        onClose();
        resetPaymentModal();
      }, 5000);

      toast({
        title: "Error",
        description: errorMessage,
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
    const product = products.find((p) => p.id === productId);
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

      {/* Payment Processing Modal */}
      <Modal
        isOpen={isOpen}
        onClose={paymentStatus === "processing" ? () => {} : onClose}
        closeOnOverlayClick={paymentStatus !== "processing"}
        size="md"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {paymentStatus === "processing" && "Processing Payment"}
            {paymentStatus === "success" && "Payment Successful"}
            {paymentStatus === "failed" && "Payment Failed"}
          </ModalHeader>
          {paymentStatus !== "processing" && <ModalCloseButton />}

          <ModalBody pb={6}>
            {paymentStatus === "processing" && (
              <VStack spacing={4}>
                <Spinner size="xl" color="blue.500" />
                <Alert status="info">
                  <AlertIcon />
                  <Box>
                    <AlertTitle>Payment in Progress</AlertTitle>
                    <AlertDescription whiteSpace="pre-wrap">
                      {paymentMessage}
                    </AlertDescription>
                  </Box>
                </Alert>
                <Text fontSize="sm" color="gray.600" textAlign="center">
                  Please complete the payment on your phone. This may take up to
                  5 minutes.
                  <br />
                  Verify the Transaction ID above matches the one on your phone.
                </Text>
                <Button
                  colorScheme="red"
                  variant="outline"
                  onClick={handlePaymentCancel}
                  size="sm"
                >
                  Cancel Payment
                </Button>
              </VStack>
            )}

            {paymentStatus === "success" && (
              <Alert status="success">
                <AlertIcon />
                <Box>
                  <AlertTitle>Success!</AlertTitle>
                  <AlertDescription>{paymentMessage}</AlertDescription>
                </Box>
              </Alert>
            )}

            {paymentStatus === "failed" && (
              <Alert status="error">
                <AlertIcon />
                <Box>
                  <AlertTitle>Payment Failed</AlertTitle>
                  <AlertDescription>{paymentMessage}</AlertDescription>
                </Box>
              </Alert>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>

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
                    onChange={(e) =>
                      handleQuantityChange(product.id, e.target.value)
                    }
                    onBlur={() => handleQuantityBlur(product.id)}
                    placeholder="1"
                  />
                  <Button
                    colorScheme="blue"
                    onClick={() => addToCart(product.id)}
                    isDisabled={
                      !cart || isLoading || product.stockQuantity === 0
                    }
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
                          max={
                            products.find((p) => p.id === item.productId)
                              ?.stockQuantity || 1
                          }
                          width="60px"
                          value={
                            quantityInputs[item.productId] ?? item.quantity
                          }
                          onChange={(e) =>
                            handleQuantityChange(item.productId, e.target.value)
                          }
                          onBlur={() => {
                            const value =
                              parseInt(quantityInputs[item.productId]) ||
                              item.quantity;
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
                  loadingText="Processing..."
                >
                  {paymentMethod === "mpesa"
                    ? "Pay with M-Pesa"
                    : "Complete Cash Sale"}
                </Button>
                <Button
                  onClick={clearCart}
                  isDisabled={isLoading}
                  variant="outline"
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
