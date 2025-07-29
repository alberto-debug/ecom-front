import { useState } from "react";
import {
  VStack,
  Input,
  Button,
  Flex,
  FormControl,
  FormLabel,
  FormErrorMessage,
  useToast,
  IconButton,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { createManager } from "../services/api.ts";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";

type FormState = { name: string; email: string; password: string };
type Errors = { name: string; email: string; password: string };

const CreateManagerModal = ({
  onClose,
  onCreate,
}: {
  onClose: () => void;
  onCreate: () => void;
}) => {
  const toast = useToast();
  const token = localStorage.getItem("token");

  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Errors>({
    name: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[A-Za-z0-9+_.-]+@(.+)$/;
    return email && !emailRegex.test(email) ? "Invalid email format" : "";
  };

  const handleCreate = async () => {
    const newErrors = {
      name: !form.name ? "Name is required" : "",
      email:
        validateEmail(form.email) || (!form.email ? "Email is required" : ""),
      password: !form.password ? "Password is required" : "",
    };
    setErrors(newErrors);

    if (Object.values(newErrors).some((error) => error)) return;

    // Fixed: Remove the Bearer check since we're adding it in the API call
    if (!token) {
      toast({
        title: "Error",
        description: "No authentication token found",
        status: "error",
        duration: 3000,
      });
      return;
    }

    try {
      await createManager(form.name, form.email, form.password, token);
      toast({
        title: "Success",
        description: "Manager created successfully",
        status: "success",
        duration: 3000,
      });
      setForm({ name: "", email: "", password: "" });
      setErrors({ name: "", email: "", password: "" });
      onCreate();
      onClose();
    } catch (error) {
      console.error("Create manager error:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to create manager",
        status: "error",
        duration: 3000,
      });
    }
  };

  return (
    <VStack spacing={4} align="start">
      <FormControl isInvalid={!!errors.name}>
        <FormLabel>Name</FormLabel>
        <Input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <FormErrorMessage>{errors.name}</FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={!!errors.email}>
        <FormLabel>Email</FormLabel>
        <Input
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <FormErrorMessage>{errors.email}</FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={!!errors.password}>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <InputRightElement width="4.5rem">
            <IconButton
              h="1.75rem"
              size="sm"
              onClick={() => setShowPassword(!showPassword)}
              icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
              aria-label={showPassword ? "Hide password" : "Show password"}
            />
          </InputRightElement>
        </InputGroup>
        <FormErrorMessage>{errors.password}</FormErrorMessage>
      </FormControl>

      <Flex gap={4}>
        <Button colorScheme="blue" onClick={handleCreate}>
          Create
        </Button>
        <Button onClick={onClose}>Cancel</Button>
      </Flex>
    </VStack>
  );
};

export default CreateManagerModal;
