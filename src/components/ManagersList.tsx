import { useState, useEffect } from "react";
import {
  Box,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useToast,
} from "@chakra-ui/react";
import { listManagers } from "../services/api.ts";

type Manager = {
  id: number;
  name: string;
  email: string;
};

const ManagersList = ({ refresh }: { refresh: boolean }) => {
  const toast = useToast();
  const token = localStorage.getItem("token");
  const [managers, setManagers] = useState<Manager[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchManagers = async () => {
    if (!token) {
      toast({
        title: "Error",
        description: "No authentication token found",
        status: "error",
        duration: 3000,
      });
      return;
    }

    setLoading(true);
    try {
      const response = await listManagers(token);
      const managersData = (response as any).token || response.data;

      if (managersData) {
        if (managersData === "[]" || managersData === "") {
          setManagers([]);
          return;
        }

        try {
          const cleanData = managersData.replace(/^\[|\]$/g, "");

          if (!cleanData.trim()) {
            setManagers([]);
            return;
          }

          const managersArray = cleanData
            .split("|")
            .filter((m: string) => m.trim());

          const parsedManagers = managersArray
            .map((m: string) => {
              const parts = m.split(":");

              if (parts.length >= 3) {
                return {
                  id: Number(parts[0]),
                  name: parts[1],
                  email: parts[2],
                };
              } else {
                return null;
              }
            })
            .filter(Boolean) as Manager[];

          setManagers(parsedManagers);
        } catch (parseError) {
          setManagers([]);
        }
      } else {
        setManagers([]);
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to fetch managers",
        status: "error",
        duration: 3000,
      });
      setManagers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchManagers();
  }, [refresh]);

  return (
    <Box
      mt={4}
      p={6}
      borderWidth={1}
      borderRadius="md"
      bg="white"
      maxW="6xl"
      mx="auto"
      boxShadow="sm"
    >
      <Text fontWeight="bold" mb={4} fontSize="xl" color="gray.700">
        Managers:
      </Text>

      {loading ? (
        <Text>Loading...</Text>
      ) : managers.length > 0 ? (
        <Table variant="simple" size="md">
          <Thead bg="gray.50">
            <Tr>
              <Th
                borderBottom="2px"
                borderColor="gray.200"
                color="gray.600"
                fontWeight="semibold"
              >
                ID
              </Th>
              <Th
                borderBottom="2px"
                borderColor="gray.200"
                color="gray.600"
                fontWeight="semibold"
              >
                Name
              </Th>
              <Th
                borderBottom="2px"
                borderColor="gray.200"
                color="gray.600"
                fontWeight="semibold"
              >
                Email
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {managers.map((manager, index) => (
              <Tr
                key={manager.id}
                bg={index % 2 === 0 ? "white" : "gray.50"}
                _hover={{ bg: "blue.50" }}
              >
                <Td
                  borderBottom="1px"
                  borderColor="gray.200"
                  fontWeight="medium"
                >
                  {manager.id}
                </Td>
                <Td borderBottom="1px" borderColor="gray.200">
                  {manager.name}
                </Td>
                <Td borderBottom="1px" borderColor="gray.200" color="blue.600">
                  {manager.email}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      ) : (
        <Text color="gray.500">No managers found.</Text>
      )}
    </Box>
  );
};

export default ManagersList;
