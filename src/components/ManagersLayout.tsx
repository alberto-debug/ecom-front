import { Box } from "@chakra-ui/react";

const ManagersLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box flex="1" px={4} py={8} textAlign="center" w="full" bg="gray.50">
      {children}
    </Box>
  );
};

export default ManagersLayout;
