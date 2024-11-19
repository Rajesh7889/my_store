import React from 'react'
import { Outlet } from 'react-router-dom'
import { Box, Container } from '@chakra-ui/react'
import "../App.css"
const Layout = () => {
  return (
    <div className="App">
      <Box w="100%">
         <Outlet />
      </Box>
    </div>
  );
}

export default Layout