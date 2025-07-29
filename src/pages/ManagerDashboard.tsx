
import { Box, Heading, Text, VStack } from "@chakra-ui/react";
import Navbar2 from "../components/Navbar2";

function ManagerDashboard() {
  return (
    <Box minH="100vh" bg="gray.50">
      <Navbar2 />

      <VStack spacing={4} p={8} align="center">
        <Heading size="lg" color="black">
          Manager Dashboard
        </Heading>
        <Text fontSize="md" color="gray.600">
          Welcome to the Manager Dashboard!
        </Text>
      </VStack>
    </Box>
  );
}

export default ManagerDashboard;
