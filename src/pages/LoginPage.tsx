import { Box, Flex } from "@chakra-ui/react";
import LoginForm from "../components/LoginForm.tsx";
import Navbar from "../components/Navbar.tsx";
import Footer from "../components/Footer.tsx";

function LoginPage() {
  return (
    <Box minH="100vh" display="flex" flexDirection="column">
      <Navbar />

      {/* Main content with padding to avoid footer overlap */}
      <Flex
        flex="1"
        justifyContent="center"
        alignItems="center"
        px={6}
        py={10}
        pb={{ base: "160px", md: "100px" }} // enough space for footer
      >
        <LoginForm />
      </Flex>

      <Footer />
    </Box>
  );
}

export default LoginPage;
