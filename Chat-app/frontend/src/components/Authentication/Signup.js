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
import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [confirmpassword, setConfirmpassword] = useState();
  const [pic, setPic] = useState();
  const [loading, setLoading] = useState();
  const toast = useToast();

  const handleClick = () => setShow(!show);

  const postDetails = (pics) => {
    setLoading(true);
    if (pics === undefined) {
      console.log(pics);
      toast({
        title: "Please Select an Image.",
        description: "We've created your account for you.",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "chat-app");
      data.append("cloud_name", "dhbxkplos");
      fetch("https://api.cloudinary.com/v1_1/dhbxkplos/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data.url.toString());
          setPic(data.url.toString());
          setLoading(false);
          return;
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    } else {
      setLoading(false);
      toast({
        title: "Please Select an Image.",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
  };

  const submitHandler = async () => {
    setLoading(true);
    if (!name || !email || !password || !confirmpassword) {
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
    if (password !== confirmpassword) {
      toast({
        title: "Passwords Do Not Match!",
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
        "/api/user/signup",
        { name, email, password, pic },
        config
      );
      if (data) {
        toast({
          title: "Registration Successful!",
          status: "success",
          duriation: 5000,
          isClosable: true,
          position: "bottom",
        });
        setLoading(false);
        navigate("/chatpage");
      } else {
        new Error("server is not working!!");
        toast({
          title: "Error Occured!",
          status: "error!",
          duriation: 5000,
          isClosable: true,
          position: "bottom",
        });
        setLoading(false);
      }
    } catch (err) {
      new Error("server is not working!!" + err.message);
      toast({
        title: "Error Occured!",
        description: err.response.data.message,
        status: "error!",
        duriation: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };

  return (
    <VStack spacing={"5px"}>
      <FormControl id="frist-name" isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          autoFocus={true}
          placeholder="Enter Your Name"
          onChange={(e) => setName(e.target.value)}
        />
      </FormControl>
      <FormControl id="emaill" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          placeholder="Enter Your email"
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>
      <FormControl id="passwordd" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
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
      <FormControl id="pswd-vrfy" isRequired>
        <FormLabel>Re-enter password</FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            placeholder="Re-enter password"
            onChange={(e) => setConfirmpassword(e.target.value)}
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
      <FormControl id="pic" isRequired>
        <FormLabel>Upload your Picture</FormLabel>
        <Input
          type="file"
          p={1.5}
          accept="image/*"
          onChange={(e) => postDetails(e.target.files[0])}
        />
      </FormControl>
      <Button
        colorScheme="blue"
        width={"100%"}
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={loading}
      >
        Sign Up
      </Button>
    </VStack>
  );
};

export default Signup;
