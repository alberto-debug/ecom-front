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
  onUpdate: () => void;
};

function UpdateProductModal({ onClose, onUpdate }: Props) {
  const [productId, setProductId] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const toast = useToast();

  const handleSubmit = async () => {
    try {
      await api.put(`/product/${productId}`, {
        name,
        price: parseFloat(price),
        imageUrl,
      });
      toast({
        title: "Product Updated",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onUpdate();
      onClose();
    } catch (err) {
      toast({
        title: "Update Failed",
        description: "Could not update product",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <VStack gap={4}>
      <FormControl>
        <FormLabel>Product ID</FormLabel>
        <Input
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
        />
      </FormControl>
      <FormControl>
        <FormLabel>Name</FormLabel>
        <Input value={name} onChange={(e) => setName(e.target.value)} />
      </FormControl>
      <FormControl>
        <FormLabel>Price</FormLabel>
        <Input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
      </FormControl>
      <FormControl>
        <FormLabel>Image URL</FormLabel>
        <Input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
      </FormControl>
      <ModalFooter gap={2}>
        <Button onClick={handleSubmit} colorScheme="blue">
          Update
        </Button>
        <Button onClick={onClose} variant="ghost">
          Cancel
        </Button>
      </ModalFooter>
    </VStack>
  );
}

export default UpdateProductModal;
