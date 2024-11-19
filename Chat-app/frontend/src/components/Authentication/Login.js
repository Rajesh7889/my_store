import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleClick = () => setShow(!show);
  const submitHandler = async () => {
    setLoading(true);
    if (!email || !password) {
      toast({
        title: "Please Fill all the Fields!",
        status: "warning",
        duriation: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: { "Content-type": "application/json" },
      };
      const { data } = await axios.post(
        "/api/user/login",
        { email, password },
        config
      );
      if (data) {
        toast({
          title: "Login Successful!",
          status: "success",
          duriation: 5000,
          isClosable: true,
          position: "bottom",
        });
      } else {
        toast({
          title: "Invalid user Info!",
          status: "error",
          duriation: 5000,
          isClosable: true,
          position: "bottom",
        });
        setLoading(false);
        setEmail("");
        setPassword("");
        return;
      }
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      navigate("/chatpage");
    } catch (err) {
      setLoading(false);
      toast({
        title: err.message,
        status: "error",
        duriation: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  return (
    <VStack spacing={"5px"}>
      <FormControl id="email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          value={email}
          autoFocus={true}
          placeholder="Enter Your email"
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            value={password}
            type={show ? "text" : "password"}
            placeholder="Enter password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputRightElement
            overflow={"hidden"}
            marginRight={1}
            onClick={handleClick}
          >
            <Button
              h={"1.75rem"}
              color={"grey"}
              _hover={{ color: "black" }}
              fontSize={13}
              size="lg"
            >
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <Button
        isLoading={loading}
        colorScheme="blue"
        width={"100%"}
        style={{ marginTop: 15 }}
        onClick={submitHandler}
      >
        Login
      </Button>
      <Button
        variant={"solid"}
        colorScheme="red"
        width={"100%"}
        onClick={() => {
          setEmail("guest@example.com");
          setPassword("123456");
        }}
      >
        Get Guest User Credentials
      </Button>
    </VStack>
  );
};

export default Login;
