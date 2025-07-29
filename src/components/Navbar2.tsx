import { Box, Flex, Text, Button, useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { getUserFromToken } from "../services/api.ts";
import { useState, useEffect } from "react";

const Navbar2 = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const token = localStorage.getItem("token");
  let userName = "Guest";
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // Update every second
    return () => clearInterval(timer); // Cleanup on unmount
  }, []);

  if (token) {
    try {
      const user = getUserFromToken(token);
      userName = user.name || "User"; // Fallback if name is undefined
    } catch (error) {
      console.error("Error parsing token:", error);
      userName = "User"; // Fallback on error
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    navigate("/"); // Redirect to root path "/"
  };

  const formattedDateTime = currentTime.toLocaleString("en-US", {
    timeZone: "Africa/Nairobi",
    hour12: true,
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <Box
      as="nav"
      bg="linear-gradient(135deg, #1a202c 0%, #2d3748 50%, #4a5568 100%)"
      color="white"
      py={4}
      px={6}
      boxShadow="0 4px 20px rgba(0,0,0,0.15)"
      borderBottom="1px solid"
      borderColor="gray.600"
      position="sticky"
      top={0}
      zIndex={1000}
    >
      <Flex justify="space-between" align="center" maxW="7xl" mx="auto">
        {/* Left Section - Brand & DateTime */}
        <Flex align="center" gap={6}>
          <Flex align="center" gap={3}>
            <Box
              bg="blue.500"
              p={2}
              borderRadius="lg"
              boxShadow="0 2px 8px rgba(66, 153, 225, 0.3)"
            >
              <Text fontSize="xl" role="img" aria-label="school">
                🏫
              </Text>
            </Box>
            <Box>
              <Text
                fontSize="xl"
                fontWeight="bold"
                bgGradient="linear(to-r, white, blue.200)"
                bgClip="text"
                letterSpacing="tight"
              >
                School Management System
              </Text>
              <Text fontSize="xs" color="gray.300" fontWeight="medium">
                Administrative Portal
              </Text>
            </Box>
          </Flex>

          {/* Divider */}
          <Box h="8" w="1px" bg="gray.500" />

          {/* DateTime */}
          <Flex align="center" gap={2}>
            <Box
              bg="gray.700"
              px={3}
              py={1}
              borderRadius="md"
              border="1px solid"
              borderColor="gray.600"
            >
              <Text fontSize="sm" fontWeight="medium" color="blue.200">
                {formattedDateTime}
              </Text>
              <Text fontSize="xs" color="gray.400">
                EAT
              </Text>
            </Box>
          </Flex>
        </Flex>

        {/* Right Section - User Info & Actions */}
        {token ? (
          <Flex align="center" gap={4}>
            <Flex align="center" gap={3}>
              <Box
                bg="green.500"
                w={3}
                h={3}
                borderRadius="full"
                boxShadow="0 0 8px rgba(72, 187, 120, 0.6)"
              />
              <Box textAlign="right">
                <Text fontSize="sm" fontWeight="semibold" color="green.200">
                  Welcome back,
                </Text>
                <Text fontSize="md" fontWeight="bold" color="white">
                  {userName}
                </Text>
              </Box>
            </Flex>

            {/* Divider */}
            <Box h="8" w="1px" bg="gray.500" />

            <Button
              size="md"
              bg="red.500"
              color="white"
              borderRadius="lg"
              fontWeight="bold"
              _hover={{
                bg: "red.600",
                transform: "translateY(-1px)",
                boxShadow: "0 6px 16px rgba(245, 101, 101, 0.4)",
              }}
              _active={{
                transform: "translateY(0px)",
                bg: "red.700",
              }}
              onClick={handleLogout}
              boxShadow="0 4px 12px rgba(245, 101, 101, 0.3)"
              transition="all 0.2s ease"
              px={6}
            >
              Logout
            </Button>
          </Flex>
        ) : (
          <Flex align="center" gap={2}>
            <Box
              bg="orange.500"
              w={3}
              h={3}
              borderRadius="full"
              boxShadow="0 0 8px rgba(251, 211, 141, 0.6)"
            />
            <Text fontSize="md" fontWeight="semibold" color="orange.200">
              Guest Session
            </Text>
          </Flex>
        )}
      </Flex>
    </Box>
  );
};

export default Navbar2;
