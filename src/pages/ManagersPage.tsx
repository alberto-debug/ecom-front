import { useState } from "react";
import { Flex } from "@chakra-ui/react";
import Navbar2 from "../components/Navbar2";
import Footer from "../components/Footer";
import ManagersLayout from "../components/ManagersLayout";
import ManagersCards from "../components/ManagersCards";
import ManagersList from "../components/ManagersList";

const ManagersPage = () => {
  const [refresh, setRefresh] = useState(false);

  const fetchManagers = () => {
    setRefresh((prev) => !prev); // Toggle refresh to trigger ManagersList update
  };

  const handleCreate = () => fetchManagers();
  const handleDelete = () => fetchManagers();
  const handleSearch = () => fetchManagers(); // Trigger refresh after search

  return (
    <Flex direction="column" minH="100vh">
      <Navbar2 />
      <ManagersLayout>
        <ManagersCards
          onCreate={handleCreate}
          onList={fetchManagers}
          onDelete={handleDelete}
          onSearch={handleSearch}
        />
        <ManagersList refresh={refresh} />
      </ManagersLayout>
      <Footer />
    </Flex>
  );
};

export default ManagersPage;
