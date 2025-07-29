import { useState } from "react";
import {
  VStack,
  Input,
  Button,
  Flex,
  useToast,
  Box,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from "@chakra-ui/react";
import { searchManager } from "../services/api.ts";

type Manager = {
  id: number;
  name: string;
  email: string;
};

const SearchManagerModal = ({
  onClose,
  onSearch,
}: {
  onClose: () => void;
  onSearch: () => void;
}) => {
  const toast = useToast();
  const token = localStorage.getItem("token");
  const [searchEmail, setSearchEmail] = useState("");
  const [searchResult, setSearchResult] = useState<Manager | null>(null);
  const [loading, setLoading] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[A-Za-z0-9+_.-]+@(.+)$/;
    return email && !emailRegex.test(email) ? "Invalid email format" : "";
  };

  const parseManagerData = (data: string): Manager | null => {
    try {
      // Handle the same parsing logic as your ManagersList component
      const cleanData = data.replace(/^\[|\]$/g, "");
      if (!cleanData.trim()) {
        return null;
      }

      const parts = cleanData.split(":");
      if (parts.length >= 3) {
        return {
          id: Number(parts[0]),
          name: parts[1],
          email: parts[2],
        };
      }
      return null;
    } catch (error) {
      console.error("Parse error:", error);
      return null;
    }
  };

  const handleSearch = async () => {
    if (!token) {
      toast({
        title: "Error",
        description: "No authentication token found",
        status: "error",
        duration: 3000,
      });
      return;
    }

    if (!searchEmail) {
      toast({
        title: "Error",
        description: "Please enter an email",
        status: "error",
        duration: 3000,
      });
      return;
    }

    if (validateEmail(searchEmail)) {
      toast({
        title: "Error",
        description: "Invalid email format",
        status: "error",
        duration: 3000,
      });
      return;
    }

    setLoading(true);
    setSearchResult(null);

    try {
      const result = await searchManager(searchEmail, token);
      const managerData = result.data || result.token;

      if (managerData) {
        const parsedManager = parseManagerData(managerData);
        if (parsedManager) {
          setSearchResult(parsedManager);
          toast({
            title: "Success",
            description: "Manager found!",
            status: "success",
            duration: 3000,
          });
        } else {
          toast({
            title: "Error",
            description: "Manager not found or invalid data format",
            status: "error",
            duration: 3000,
          });
        }
      } else {
        toast({
          title: "Error",
          description: "Manager not found",
          status: "error",
          duration: 3000,
        });
      }

      onSearch();
    } catch (error) {
      console.error("Search manager error:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Manager not found",
        status: "error",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setSearchEmail("");
    setSearchResult(null);
  };

  return (
    <VStack spacing={4} align="stretch">
      <Flex gap={4}>
        <Input
          placeholder="Search by Email"
          value={searchEmail}
          onChange={(e) => setSearchEmail(e.target.value)}
        />
        <Button
          colorScheme="green"
          onClick={handleSearch}
          isLoading={loading}
          loadingText="Searching..."
        >
          Search
        </Button>
        <Button variant="outline" onClick={handleClear}>
          Clear
        </Button>
      </Flex>

      {/* Search Results Display */}
      {searchResult && (
        <Box mt={4} p={4} borderWidth={1} borderRadius="md" bg="gray.50">
          <Text fontWeight="bold" mb={3} fontSize="lg">
            Search Result:
          </Text>
          <Table variant="simple" size="sm">
            <Thead>
              <Tr>
                <Th>ID</Th>
                <Th>Name</Th>
                <Th>Email</Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Td>{searchResult.id}</Td>
                <Td>{searchResult.name}</Td>
                <Td>{searchResult.email}</Td>
              </Tr>
            </Tbody>
          </Table>
        </Box>
      )}

      {/* No results message */}
      {!loading && !searchResult && searchEmail && (
        <Box mt={4} p={4} borderWidth={1} borderRadius="md" bg="gray.50">
          <Text color="gray.500">No manager found for "{searchEmail}"</Text>
        </Box>
      )}
    </VStack>
  );
};

export default SearchManagerModal;
