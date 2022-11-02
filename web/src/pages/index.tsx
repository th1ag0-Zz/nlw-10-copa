interface HomeProps {
  count: number;
}

export default function Home(props: HomeProps) {
  return (
    <div>
      <p>Count: {props.count}</p>
    </div>
  );
}

export const getServerSideProps = async () => {
  return {
    props: {
      count: 0,
    },
  };
};
