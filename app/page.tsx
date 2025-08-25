"use client"

import { useRouter } from 'next/navigation';
const generateRandomString = (length: number) => {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

export default function Home() {
  const router = useRouter();
  const handleClick = () => {
    const id = generateRandomString(5);
    router.push(`/room/${id}`);
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Создать: &nbsp;
          <a onClick={handleClick}>👉&nbsp;<code className="font-mono hover:underline font-bold animate-pulse cursor-pointer"> новую комнату</code>&nbsp;👈</a>&nbsp;🏠
        </p>
      </div>
    </main>
  );
}
