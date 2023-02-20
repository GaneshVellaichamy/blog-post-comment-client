import { ChakraProvider } from '@chakra-ui/react';
import BlogPost from './Blog/BlogPost';
import { CommentsContextProvider } from './Providers/CommentsContext';

function App() {
  return (
    <ChakraProvider>
      <CommentsContextProvider>
      <BlogPost />
      </CommentsContextProvider>
  </ChakraProvider>
  );
}

export default App;
