import { Box, Heading, Flex } from "@chakra-ui/react";

function Navbar() {
  return (
    <Box bg="black" p={4} color="white">
      <Flex justify="space-between" align="center">
        <Heading size="lg" color="white">
          School System
        </Heading>
      </Flex>
    </Box>
  );
}

export default Navbar;
