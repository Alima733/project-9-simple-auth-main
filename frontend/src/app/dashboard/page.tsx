'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const API_URL = 'http://localhost:8000/api';

export default function DashboardPage() {
  const [secretMessage, setSecretMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const role = localStorage.getItem('user_role');
    if (!token) {
      router.push('/login');
      return;
    }
    setIsAdmin(role === 'admin');

    const fetchSecretData = async () => {
      try {
        const response = await axios.get(`${API_URL}/secret-data`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSecretMessage(response.data.message);
      } catch (error) {
        // Если токен невалидный, разлогиниваем
        handleLogout();
      } finally {
        setLoading(false);
      }
    };

    fetchSecretData();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_role');
    router.push('/login');
  };

  if (loading) {
    return <p className="text-center mt-10">Загрузка...</p>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">Защищенная Панель</h1>
      <p className="mt-4 text-xl p-4 bg-green-100 border border-green-400 rounded-md">{secretMessage}</p>
      {isAdmin && (
        <Link href="/admin">
          <button className="mt-6 bg-purple-500 text-white p-2 rounded hover:bg-purple-600 mr-4">
            Админ-панель
          </button>
        </Link>
      )}
      <button onClick={handleLogout} className="mt-6 bg-red-500 text-white p-2 rounded hover:bg-red-600">
        Выйти
      </button>
    </div>
  );
}