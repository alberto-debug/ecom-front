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
  onDelete: () => void;
};

function DeleteProductModal({ onClose, onDelete }: Props) {
  const [productId, setProductId] = useState("");
  const toast = useToast();

  const handleDelete = async () => {
    try {
      await api.delete(`/product/${productId}`);
      toast({
        title: "Product Deleted",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onDelete();
      onClose();
    } catch (err) {
      toast({
        title: "Delete Failed",
        description: "Could not delete product",
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
      <ModalFooter gap={2}>
        <Button colorScheme="red" onClick={handleDelete}>
          Delete
        </Button>
        <Button onClick={onClose} variant="ghost">
          Cancel
        </Button>
      </ModalFooter>
    </VStack>
  );
}

export default DeleteProductModal;
