import { useState } from "react";
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  VStack,
  Text,
  FormErrorMessage,
  useToast,
  Select,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { adminLogin, managerLogin, getUserFromToken } from "../services/api.ts";

function LoginForm() {
  const [userType, setUserType] = useState<"admin" | "manager">("manager");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const validateEmail = (value: string) => {
    const emailRegex = /^[A-Za-z0-9+_.-]+@(.+)$/;
    if (!value) return "Email is required";
    if (!emailRegex.test(value)) return "Invalid email format";
    return "";
  };

  const validatePassword = (value: string) => {
    if (!value) return "Password is required";
    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailErr = validateEmail(email);
    const passwordErr = validatePassword(password);

    setEmailError(emailErr);
    setPasswordError(passwordErr);

    if (emailErr || passwordErr) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);

    try {
      const loginFn = userType === "admin" ? adminLogin : managerLogin;
      const response = await loginFn(email, password);
      const { token } = response;

      localStorage.setItem("token", token);

      try {
        getUserFromToken(token);
      } catch {
        throw new Error("Invalid token received");
      }

      toast({
        title: "Login Successful",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      const redirectPath =
        userType === "admin" ? "/admin/dashboard" : "/manager/dashboard";

      setTimeout(() => {
        navigate(redirectPath, { replace: true });
      }, 100);
    } catch {
      localStorage.removeItem("token");
      toast({
        title: "Login Failed",
        description: "Invalid credentials or server error.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      as="form"
      onSubmit={handleSubmit}
      p={8}
      borderWidth={2}
      borderRadius="xl"
      borderColor="gray.200"
      bg="white"
      w={{ base: "90%", md: "400px" }}
      boxShadow="0 10px 30px rgba(0,0,0,0.1)"
      sx={{
        select: {
          appearance: "none",
          WebkitAppearance: "none",
          MozAppearance: "none",
        },
      }}
    >
      <VStack spacing={6}>
        <Text fontSize="2xl" fontWeight="bold" color="gray.800" mb={2}>
          {userType === "admin" ? "Admin Login" : "Manager Login"}
        </Text>

        <FormControl>
          <FormLabel fontSize="sm" color="black">
            Select Role
          </FormLabel>
          <Select
            value={userType}
            onChange={(e) => setUserType(e.target.value as "admin" | "manager")}
            bg="white"
            color="black"
          >
            <option value="manager">Manager</option>
            <option value="admin">Admin</option>
          </Select>
        </FormControl>

        <FormControl isInvalid={!!emailError} width="full">
          <FormLabel color="gray.700" fontSize="md" fontWeight="semibold">
            Email
          </FormLabel>
          <Input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailError(validateEmail(e.target.value));
            }}
            placeholder="Enter your email"
            borderWidth={2}
            borderColor="gray.200"
            borderRadius="xl"
            bg="gray.50"
            color="gray.800"
            width="full"
            size="lg"
            _placeholder={{ color: "gray.400" }}
            _hover={{
              borderColor: "blue.300",
              bg: "blue.50",
              transform: "translateY(-1px)",
              boxShadow: "0 4px 12px rgba(59, 130, 246, 0.15)",
            }}
            _focus={{
              borderColor: "blue.500",
              bg: "white",
              boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.1)",
              transform: "translateY(-1px)",
            }}
            px={4}
            fontSize="md"
            transition="all 0.2s ease"
          />
          <FormErrorMessage color="red.500" fontSize="sm" fontWeight="medium">
            {emailError}
          </FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!passwordError} width="full">
          <FormLabel color="gray.700" fontSize="md" fontWeight="semibold">
            Password
          </FormLabel>
          <Input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setPasswordError(validatePassword(e.target.value));
            }}
            placeholder="Enter your password"
            borderWidth={2}
            borderColor="gray.200"
            borderRadius="xl"
            bg="gray.50"
            color="gray.800"
            width="full"
            size="lg"
            _placeholder={{ color: "gray.400" }}
            _hover={{
              borderColor: "blue.300",
              bg: "blue.50",
              transform: "translateY(-1px)",
              boxShadow: "0 4px 12px rgba(59, 130, 246, 0.15)",
            }}
            _focus={{
              borderColor: "blue.500",
              bg: "white",
              boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.1)",
              transform: "translateY(-1px)",
            }}
            px={4}
            fontSize="md"
            transition="all 0.2s ease"
          />
          <FormErrorMessage color="red.500" fontSize="sm" fontWeight="medium">
            {passwordError}
          </FormErrorMessage>
        </FormControl>

        <Button
          type="submit"
          width="full"
          isLoading={isLoading}
          bg="black"
          color="white"
          borderWidth={2}
          borderColor="black"
          borderRadius="xl"
          size="lg"
          _hover={{
            bg: "white",
            color: "black",
            borderColor: "black",
            transform: "translateY(-2px)",
            boxShadow: "0 8px 20px rgba(0, 0, 0, 0.15)",
            transition: "all 0.2s ease",
          }}
          _active={{
            bg: "gray.100",
            transform: "translateY(0px)",
          }}
          fontSize="md"
          fontWeight="bold"
          transition="all 0.2s ease"
        >
          Login
        </Button>
      </VStack>
    </Box>
  );
}

export default LoginForm;
