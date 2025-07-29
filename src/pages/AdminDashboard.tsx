import { useNavigate } from "react-router-dom";
import {
  Box,
  Heading,
  Text,
  Flex,
  SimpleGrid,
  VStack,
  Icon,
} from "@chakra-ui/react";
import { UserCog, BookOpen, Users } from "lucide-react"; // Icons

import Navbar2 from "../components/Navbar2";
import Footer from "../components/Footer";

// Type for the cards
type DashboardCard = {
  title: string;
  path: string;
  icon: React.ElementType;
};

const AdminDashboard = () => {
  const navigate = useNavigate();

  const cards: DashboardCard[] = [
    { title: "Managers", path: "/admin/managers", icon: UserCog },
    { title: "Products", path: "/admin/products", icon: BookOpen },
    { title: "Staff", path: "/admin/staff", icon: Users },
  ];

  return (
    <Flex direction="column" minH="100vh">
      <Navbar2 />

      <Box flex="1" px={4} py={8} textAlign="center" w="full" bg="gray.50">
        <Heading mb={12} size="2xl" color="gray.800" fontWeight="bold">
          Admin Dashboard
        </Heading>

        <SimpleGrid
          columns={{ base: 1, md: 2, lg: 3 }}
          spacing={8}
          maxW="7xl"
          mx="auto"
        >
          {cards.map((card) => (
            <Box
              key={card.path}
              p={8}
              borderWidth={1}
              borderRadius="2xl"
              borderColor="gray.200"
              bg="white"
              boxShadow="xl"
              position="relative"
              overflow="hidden"
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
              onClick={() => navigate(card.path)}
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
      </Box>

      <Footer />
    </Flex>
  );
};

export default AdminDashboard;
