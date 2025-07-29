import React from "react";
import {
  Box,
  Flex,
  Text,
  Icon,
  Link,
  HStack,
  VStack,
  Divider,
} from "@chakra-ui/react";
import {
  FacebookIcon,
  TwitterIcon,
  InstagramIcon,
  MailIcon,
} from "lucide-react";

const Footer: React.FC = () => {
  return (
    <Box
      as="footer"
      bg="blackAlpha.700"
      color="white"
      py={{ base: 2, md: 4 }} // Reduced vertical padding for mobile
      px={{ base: 4, md: 6 }} // Reduced horizontal padding for mobile
      boxShadow="0 -1px 3px rgba(0,0,0,0.2)"
    >
      <Flex
        direction={{ base: "column", md: "row" }}
        align={{ base: "flex-start", md: "center" }}
        justify="space-between"
        gap={{ base: 2, md: 4 }} // Reduced gap for mobile
        maxW="6xl"
        mx="auto"
        w="full"
      >
        <Text fontWeight="bold" fontSize={{ base: "md", md: "lg" }}>
          🏫 School Management System
        </Text>

        <HStack
          flexWrap="wrap"
          justify={{ base: "flex-start", md: "flex-end" }}
          gap={{ base: 2, md: 4 }} // Reduced gap for mobile
        >
          <Link href="#" aria-label="Facebook" _hover={{ color: "blue.300" }}>
            <Icon as={FacebookIcon} boxSize={{ base: 4, md: 5 }} />
          </Link>
          <Link href="#" aria-label="Twitter" _hover={{ color: "blue.400" }}>
            <Icon as={TwitterIcon} boxSize={{ base: 4, md: 5 }} />
          </Link>
          <Link href="#" aria-label="Instagram" _hover={{ color: "pink.400" }}>
            <Icon as={InstagramIcon} boxSize={{ base: 4, md: 5 }} />
          </Link>
          <Link
            href="mailto:admin@school.edu"
            aria-label="Email"
            _hover={{ color: "green.400" }}
          >
            <Icon as={MailIcon} boxSize={{ base: 4, md: 5 }} />
          </Link>
        </HStack>
      </Flex>

      <Divider my={{ base: 2, md: 4 }} borderColor="gray.600" />

      <VStack
        gap={{ base: 1, md: 2 }}
        textAlign="center"
        fontSize={{ base: "xs", md: "sm" }}
        color="gray.300"
      >
        <Text>
          © {new Date().getFullYear()} School Management System. All rights
          reserved.
        </Text>
        <HStack gap={{ base: 2, md: 4 }} wrap="wrap" justify="center">
          <Link href="#">Privacy Policy</Link>
          <Link href="#">Terms of Use</Link>
          <Link href="#">Support</Link>
        </HStack>
      </VStack>
    </Box>
  );
};

export default Footer;
