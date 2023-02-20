import { Center, CircularProgress } from '@chakra-ui/react';

export function CustomSpinner() {
  return (
    <Center>
      <div
        style={{
          zIndex: '5000',
          position: 'fixed',
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'center',
          top: '50%',
          left: '50%',
        }}
      >
        <CircularProgress isIndeterminate color="blue.500" size="48px" />
      </div>
    </Center>
  );
}
