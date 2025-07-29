import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Flex,
  Icon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { Plus, List, Trash2, Pencil, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CreateProductModal from "./CreateProductModal";
import DeleteProductModal from "./DeleteProductModal";
import UpdateProductModal from "./UpdateProductModal";
import api from "../services/api";

type Product = {
  id: number;
  productName: string;
  price: number;
};

const ProductsCards = () => {
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [refresh, setRefresh] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const navigate = useNavigate();

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
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [refresh]);

  const handleCardClick = (title: string) => {
    setSelectedCard(title);
    onOpen();
  };

  const handleRefresh = () => setRefresh((prev) => !prev);

  return (
    <>
      <Flex justifyContent="flex-start" mb={4} ml={"300px"}>
        <Button
          onClick={() => navigate("/admin/dashboard")}
          colorScheme="gray"
          leftIcon={<Icon as={ArrowLeft} />}
        >
          Return
        </Button>
      </Flex>

      <SimpleGrid
        columns={{ base: 1, md: 2, lg: 4 }}
        spacing={8}
        maxW="7xl"
        mx="auto"
        mb={8}
      >
        {[
          { title: "Create Product", icon: Plus },
          { title: "List Products", icon: List },
          { title: "Update Product", icon: Pencil },
          { title: "Delete Product", icon: Trash2 },
        ].map((card) => (
          <Box
            key={card.title}
            p={8}
            borderWidth={1}
            borderRadius="2xl"
            borderColor="gray.200"
            bg="white"
            boxShadow="xl"
            position="relative"
            _hover={{
              bg: "blue.50",
              cursor: "pointer",
              transform: "translateY(-4px)",
              boxShadow: "2xl",
              borderColor: "blue.300",
              transition: "all 0.3s ease",
            }}
            _before={{
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "4px",
              bg: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
            }}
            onClick={() => handleCardClick(card.title)}
          >
            <VStack spacing={4}>
              <Box p={3} borderRadius="full" bg="blue.100" color="blue.600">
                <Icon as={card.icon} boxSize={8} />
              </Box>
              <Text fontSize="xl" fontWeight="bold" color="gray.700">
                {card.title}
              </Text>
            </VStack>
          </Box>
        ))}
      </SimpleGrid>

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{selectedCard}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedCard === "Create Product" && (
              <CreateProductModal onClose={onClose} onCreate={handleRefresh} />
            )}
            {selectedCard === "Update Product" && (
              <UpdateProductModal onClose={onClose} onUpdate={handleRefresh} />
            )}
            {selectedCard === "Delete Product" && (
              <DeleteProductModal onClose={onClose} onDelete={handleRefresh} />
            )}
            {selectedCard === "List Products" && (
              <Text fontWeight="semibold" color="blue.500">
                Products are listed below.
              </Text>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Products Table */}
      <Box
        mt={6}
        p={6}
        borderWidth={1}
        borderRadius="md"
        bg="white"
        maxW="6xl"
        mx="auto"
        boxShadow="sm"
      >
        <Text fontWeight="bold" mb={4} fontSize="xl" color="gray.700">
          All Products:
        </Text>

        {products.length > 0 ? (
          <Table variant="simple" size="md">
            <Thead bg="gray.50">
              <Tr>
                <Th>ID</Th>
                <Th>Product Name</Th>
                <Th>Price</Th>
              </Tr>
            </Thead>
            <Tbody>
              {products.map((product, index) => (
                <Tr key={product.id} bg={index % 2 === 0 ? "white" : "gray.50"}>
                  <Td>{product.id}</Td>
                  <Td>{product.productName}</Td>
                  <Td>${product.price.toFixed(2)}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        ) : (
          <Text color="gray.500">No products found.</Text>
        )}
      </Box>
    </>
  );
};

export default ProductsCards;
