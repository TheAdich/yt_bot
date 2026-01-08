'use client';
import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const [user_name, setUserName] = useState('');
  const [user_password, setUserPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleRegister() {
    try {
      setLoading(true);
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/register`,
        { user_name, user_password }
      );
      if(res.status===201){
        router.push('/login');
      }
    } catch (err) {
      alert('Registration failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9FAF4] text-[#4A6163]">
      <div className="w-full max-w-md p-10 border-4 border-[#4A6163] rounded-3xl bg-[#F9FAF4] shadow-[12px_12px_0px_0px_#4A6163]">
        <h1 className="text-4xl font-black uppercase text-center mb-8">
          Register
        </h1>

        <input
          type="text"
          placeholder="Username"
          value={user_name}
          onChange={(e) => setUserName(e.target.value)}
          className="w-full mb-4 px-4 py-3 border-4 border-[#4A6163] rounded-xl font-bold bg-transparent focus:outline-none"
        />

        <input
          type="password"
          placeholder="Password"
          value={user_password}
          onChange={(e) => setUserPassword(e.target.value)}
          className="w-full mb-6 px-4 py-3 border-4 border-[#4A6163] rounded-xl font-bold bg-transparent focus:outline-none"
        />

        <button
          onClick={handleRegister}
          disabled={loading}
          className="w-full py-4 bg-[#4A6163] text-[#F9FAF4] font-black uppercase tracking-widest rounded-xl
                     hover:bg-[#F17A7E] hover:text-[#4A6163] transition-all"
        >
          {loading ? 'Creating...' : 'Create Account'}
        </button>

        <p
          onClick={() => router.push('/login')}
          className="mt-6 text-center font-bold underline cursor-pointer"
        >
          Already have an account? Login
        </p>
      </div>
    </div>
  );
}
