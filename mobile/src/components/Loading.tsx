import { Center, Spinner } from 'native-base';

export const Loading: React.FC = () => {
  return (
    <Center flex={1} bgColor='gray.900'>
      <Spinner color='yellow.500' />
    </Center>
  );
};
