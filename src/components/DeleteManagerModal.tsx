import { useState } from "react";
import { VStack, Input, Button, Flex, useToast } from "@chakra-ui/react";
import { deleteManager } from "../services/api.ts";

const DeleteManagerModal = ({
  onClose,
  onDelete,
}: {
  onClose: () => void;
  onDelete: () => void;
}) => {
  const toast = useToast();
  const token = localStorage.getItem("token");
  const [deleteId, setDeleteId] = useState("");

  const handleDelete = async () => {
    // Fixed: Remove the Bearer check
    if (!token) {
      toast({
        title: "Error",
        description: "No authentication token found",
        status: "error",
        duration: 3000,
      });
      return;
    }

    if (!deleteId) {
      toast({
        title: "Error",
        description: "Please enter a manager ID",
        status: "error",
        duration: 3000,
      });
      return;
    }

    try {
      await deleteManager(deleteId, token);
      toast({
        title: "Success",
        description: "Manager deleted successfully",
        status: "success",
        duration: 3000,
      });
      setDeleteId("");
      onDelete();
      onClose();
    } catch (error) {
      console.error("Delete manager error:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to delete manager",
        status: "error",
        duration: 3000,
      });
    }
  };

  return (
    <VStack spacing={4}>
      <Flex gap={4}>
        <Input
          placeholder="Manager ID"
          value={deleteId}
          onChange={(e) => setDeleteId(e.target.value)}
        />
        <Button colorScheme="red" onClick={handleDelete}>
          Delete
        </Button>
      </Flex>
    </VStack>
  );
};

export default DeleteManagerModal;
