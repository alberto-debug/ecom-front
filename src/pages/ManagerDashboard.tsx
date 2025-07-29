import { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Text,
  VStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  useToast,
  Select,
} from "@chakra-ui/react";
import Navbar2 from "../components/Navbar2";
import api from "../services/api";

type Product = {
  id: number;
  productName: string;
  price: number;
};

type CartItem = {
  productId: number;
  productName: string;
  price: number;
};

function ManagerDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const toast = useToast();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await api.get("/product/getAll", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProducts(response.data);
      } catch (err) {
        toast({
          title: "Error",
          description: "Failed to fetch products",
          status: "error",
          duration: 3000,
        });
      }
    };

    fetchProducts();
  }, []);

  const addToCart = (product: Product) => {
    setCart((prev) => [
      ...prev,
      {
        productId: product.id,
        productName: product.productName,
        price: product.price,
      },
    ]);
    toast({
      title: "Added to Cart",
      description: `${product.productName} added successfully.`,
      status: "success",
      duration: 2000,
    });
  };

  const checkout = async () => {
    if (cart.length === 0) {
      toast({
        title: "Cart is empty",
        status: "warning",
        duration: 2000,
      });
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await api.post(
        "/api/carts/checkout",
        {
          items: cart.map((item) => ({
            productId: item.productId,
            quantity: 1, // default quantity
          })),
          paymentMethod,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      toast({
        title: "Checkout Successful",
        status: "success",
        duration: 3000,
      });
      setCart([]);
    } catch (err) {
      toast({
        title: "Checkout Failed",
        description: "Something went wrong",
        status: "error",
        duration: 3000,
      });
    }
  };

  return (
    <Box minH="100vh" bg="gray.50">
      <Navbar2 />

      <VStack spacing={4} p={8} align="center">
        <Heading size="lg" color="black">
          Manager Dashboard
        </Heading>
        <Text fontSize="md" color="gray.600">
          View products, add to cart, and checkout using M-Pesa or Cash.
        </Text>
      </VStack>

      <Box maxW="6xl" mx="auto" bg="white" p={6} borderRadius="md" shadow="md">
        <Heading size="md" mb={4}>
          Available Products
        </Heading>
        <Table variant="simple">
          <Thead bg="gray.100">
            <Tr>
              <Th>ID</Th>
              <Th>Name</Th>
              <Th>Price</Th>
              <Th>Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {products.map((product) => (
              <Tr key={product.id}>
                <Td>{product.id}</Td>
                <Td>{product.productName}</Td>
                <Td>${product.price.toFixed(2)}</Td>
                <Td>
                  <Button colorScheme="blue" onClick={() => addToCart(product)}>
                    Add to Cart
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      <Box
        maxW="4xl"
        mx="auto"
        mt={8}
        bg="white"
        p={6}
        borderRadius="md"
        shadow="md"
      >
        <Heading size="sm" mb={4}>
          Cart Summary
        </Heading>
        {cart.length === 0 ? (
          <Text color="gray.500">No items in cart.</Text>
        ) : (
          <Table size="sm" variant="simple">
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Price</Th>
              </Tr>
            </Thead>
            <Tbody>
              {cart.map((item, index) => (
                <Tr key={index}>
                  <Td>{item.productName}</Td>
                  <Td>${item.price.toFixed(2)}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}

        <Box mt={4}>
          <Select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <option value="cash">Cash</option>
            <option value="mpesa">M-Pesa</option>
          </Select>

          <Button
            mt={4}
            colorScheme="green"
            onClick={checkout}
            isDisabled={cart.length === 0}
          >
            Checkout
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default ManagerDashboard;
