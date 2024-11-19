import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { router } from './App';
import reportWebVitals from './reportWebVitals';
import { ChakraProvider} from '@chakra-ui/react'
import { RouterProvider } from "react-router-dom"
import ChatContextProvider from './Context/ChatContextProvider';

const routerr=router

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ChatContextProvider>
    <ChakraProvider>
       <RouterProvider router={routerr} />
    </ChakraProvider>
  </ChatContextProvider>
);

reportWebVitals();
