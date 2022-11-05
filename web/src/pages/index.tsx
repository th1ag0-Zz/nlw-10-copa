import { FormEvent, useState } from 'react';
import Image from 'next/image';

import { api } from '../services/api';

import logoImg from '../assets/logo.svg';
import phonesImg from '../assets/phones.png';
import avataresImg from '../assets/avatares.png';
import appBgImg from '../assets/app-bg.png';
import checkImg from '../assets/check.svg';

interface HomeProps {
  poolsCount: number;
  guessesCount: number;
  usersCount: number;
}

export default function Home(props: HomeProps) {
  const [poolTitle, setPoolTitle] = useState('');

  async function createPool(e: FormEvent) {
    e.preventDefault();

    try {
      const response = await api.post('pools', {
        title: poolTitle,
      });

      const { code } = response.data;

      await navigator.clipboard.writeText(code);

      alert('Bolão criado com sucesso, o código foi copiado!');

      setPoolTitle('');
    } catch (error) {
      alert('Falha ao criar o bolão');
    }
  }

  return (
    <div className='max-w-[1124px] h-screen mx-auto grid grid-cols-2 items-center gap-28'>
      <main>
        <Image src={logoImg} alt='logo' quality={100} />

        <h1 className='mt-14 text-5xl font-bold leading-tight'>
          Crie seu próprio bolão da copa e compartilhe entre amigos!
        </h1>

        <div className='mt-10 flex items-center gap-2'>
          <Image src={avataresImg} alt='users' quality={100} />

          <strong className='text-gray-100 text-xl'>
            <span className='text-ignite-500'>+{props.usersCount}</span> pessoas já
            estão usando
          </strong>
        </div>

        <form className='mt-10 flex gap-2' onSubmit={createPool}>
          <input
            className='flex-1 px-6 py-4 rounded bg-gray-800 border border-gray-600 text-sm'
            type='text'
            required
            placeholder='Qual nome do seu bolão?'
            value={poolTitle}
            onChange={(e) => setPoolTitle(e.target.value)}
          />
          <button
            className='bg-yellow-500 text-gray-900 px-6 py-4 rounded font-bold uppercase text-sm hover:bg-yellow-700'
            type='submit'
          >
            Criar meu bolão
          </button>
        </form>

        <p className='text-gray-300 mt-4 text-sm leading-relaxed'>
          Após criar seu bolão, você receberá um código único que poderá usar para
          convidar outras pessoas 🚀
        </p>

        <div className='mt-10 pt-10 border-t border-gray-600 flex items-center justify-between'>
          <div className='flex items-center gap-6'>
            <Image src={checkImg} alt='check' />
            <div className='flex flex-col'>
              <span className='font-bold text-2xl'>+{props.poolsCount}</span>
              <span>Bolões criados</span>
            </div>
          </div>

          <div className='h-14 w-px bg-gray-600' />

          <div className='flex items-center gap-6'>
            <Image src={checkImg} alt='check' />
            <div className='flex flex-col'>
              <span className='font-bold text-2xl'>+{props.guessesCount}</span>
              <span>Palpites enviados</span>
            </div>
          </div>
        </div>
      </main>

      <Image src={phonesImg} alt='capa' quality={100} />
    </div>
  );
}

export const getServerSideProps = async () => {
  const [poolsCountResponse, guessesCountResponse, usersCountResponse] =
    await Promise.all([
      api.get('pools/count'),
      api.get('guesses/count'),
      api.get('users/count'),
    ]);

  return {
    props: {
      poolsCount: poolsCountResponse.data.count,
      guessesCount: guessesCountResponse.data.count,
      usersCount: usersCountResponse.data.count,
    },
  };
};
