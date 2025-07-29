import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  SimpleGrid,
  Box,
  VStack,
  Icon,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  Flex,
} from "@chakra-ui/react";
import { UserPlus, List, Trash2, Search, ArrowLeft } from "lucide-react";
import CreateManagerModal from "./CreateManagerModal";
import DeleteManagerModal from "./DeleteManagerModal";
import SearchManagerModal from "./SearchManagerModal";

type DashboardCard = {
  title: string;
  icon: React.ElementType;
  onClick?: () => void;
};

type ManagersCardsProps = {
  onCreate: () => void;
  onList: () => void;
  onDelete: () => void;
  onSearch: () => void;
};

const ManagersCards = ({
  onCreate,
  onList,
  onDelete,
  onSearch,
}: ManagersCardsProps) => {
  const navigate = useNavigate();
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const cards: DashboardCard[] = [
    { title: "Create Manager", icon: UserPlus },
    { title: "List Managers", icon: List },
    { title: "Delete Manager", icon: Trash2 },
    { title: "Search Manager", icon: Search },
  ];

  const handleCardClick = (title: string) => {
    setSelectedCard(title);
    onOpen();
  };

  const handleReturn = () => {
    navigate("/admin/dashboard");
  };

  return (
    <>
      <Flex justifyContent="flex-start" mb={4} ml={"300px"}>
        <Button
          onClick={handleReturn}
          colorScheme="gray"
          leftIcon={<Icon as={ArrowLeft} />}
        >
          Return
        </Button>
      </Flex>
      <SimpleGrid
        columns={{ base: 1, md: 2, lg: 4 }}
        spacing={8}
        maxW="7xl"
        mx="auto"
        mb={8}
      >
        {cards.map((card) => (
          <Box
            key={card.title}
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
            onClick={() => handleCardClick(card.title)}
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
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{selectedCard}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedCard === "Create Manager" && (
              <CreateManagerModal onClose={onClose} onCreate={onCreate} />
            )}
            {selectedCard === "Delete Manager" && (
              <DeleteManagerModal onClose={onClose} onDelete={onDelete} />
            )}
            {selectedCard === "Search Manager" && (
              <SearchManagerModal onClose={onClose} onSearch={onSearch} />
            )}
            {selectedCard === "List Managers" && (
              <Text onClick={onList} cursor="pointer" color="blue.600">
                Click to list managers
              </Text>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ManagersCards;
