'use client';

import { signIn } from 'next-auth/react';

export default function Login() {
  const handleSignIn = () => {
    signIn('kakao');
  };

  return (
    <div>
      <h1>로그인</h1>
      <button onClick={handleSignIn}>카카오 로그인</button>
    </div>
  );
}
