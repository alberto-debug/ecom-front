import {
  Button,
  FormControl,
  FormLabel,
  Input,
  ModalFooter,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import api from "../services/api";

type Props = {
  onClose: () => void;
  onCreate: () => void;
};

function CreateProductModal({ onClose, onCreate }: Props) {
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [category, setCategory] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const toast = useToast();

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");

      await api.post(
        "/product/create",
        {
          productName,
          price: parseFloat(price),
          quantity: parseInt(quantity),
          category,
          expiryDate,
          imageUrl,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      toast({
        title: "Product Created",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      onCreate();
      onClose();
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to create product",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <VStack gap={4} align="stretch">
      <FormControl>
        <FormLabel>Product Name</FormLabel>
        <Input
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          placeholder="e.g. Chocolate Cake"
        />
      </FormControl>

      <FormControl>
        <FormLabel>Price (MZN)</FormLabel>
        <Input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="e.g. 500"
        />
      </FormControl>

      <FormControl>
        <FormLabel>Quantity in Stock</FormLabel>
        <Input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          placeholder="e.g. 20"
        />
      </FormControl>

      <FormControl>
        <FormLabel>Category</FormLabel>
        <Input
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="e.g. Bakery"
        />
      </FormControl>

      <FormControl>
        <FormLabel>Expiry Date</FormLabel>
        <Input
          type="date"
          value={expiryDate}
          onChange={(e) => setExpiryDate(e.target.value)}
        />
      </FormControl>

      <FormControl>
        <FormLabel>Image URL</FormLabel>
        <Input
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="https://example.com/cake.jpg"
        />
      </FormControl>

      <ModalFooter gap={2} p={0} pt={4}>
        <Button onClick={handleSubmit} colorScheme="blue">
          Create
        </Button>
        <Button onClick={onClose} variant="ghost">
          Cancel
        </Button>
      </ModalFooter>
    </VStack>
  );
}

export default CreateProductModal;
