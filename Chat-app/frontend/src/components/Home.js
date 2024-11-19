import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  Text,
} from "@chakra-ui/react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

//Home component...
const Home = () => {
  const [active, setActive] = useState("/login");
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    setActive(location.pathname)
  }, [location])
  
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    if (user) {
      navigate("/chatpage");
    } else {
      navigate("login")
    }
  }, [navigate]);
  return (
    <Container maxW="xl" centerContent>
      <Box
        d="flex"
        justifyContent="center"
        p={3}
        bg={"white"}
        w={"100%"}
        m={"40px 0 15px 0"}
        borderRadius={"lg"}
        borderWidth={"1px"}
      >
        <Text
          textAlign={"center"}
          fontSize={"4xl"}
          fontFamily="Work sans"
          color="black"
        >
          Talk-A-Tive
        </Text>
      </Box>
      <Box
        bg={"white"}
        w={"100%"}
        p="4"
        borderRadius={"lg"}
        borderWidth={"1px"}
        color={"black"}
      >
        <Button
          size="md"
          height="40px"
          width="50%"
          border="2px"
          backgroundColor={active === "/login" ? "" : "blue.100"}
          borderColor={"blue.100"}
          borderRadius={25}
          color={"blue.700"}
          onClick={() => {
            navigate("/login");
          }}
        >
          Login
        </Button>
        <Button
          size="md"
          height="40px"
          width="50%"
          border="2px"
          backgroundColor={active === "/signup" ? "" : "blue.100"}
          borderColor={"blue.100"}
          borderRadius={25}
          color={"blue.700"}
          onClick={() => {
            navigate("/signup");
          }}
        >
          Sign Up
        </Button>

        <Outlet />
      </Box>
    </Container>
  );
};

export default Home;

