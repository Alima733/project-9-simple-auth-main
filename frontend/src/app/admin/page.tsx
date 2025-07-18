'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const API_URL = 'http://localhost:8000/api';

export default function AdminPage() {
  const [adminMessage, setAdminMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const role = localStorage.getItem('user_role');
    if (!token || role !== 'admin') {
      router.replace('/dashboard');
      return;
    }
    const fetchAdminData = async () => {
      try {
        const response = await axios.get(`${API_URL}/admin-data`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAdminMessage(response.data.message);
      } catch (err) {
        setError('Нет доступа или сессия истекла.');
        setTimeout(() => router.replace('/dashboard'), 2000);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_role');
    router.push('/login');
  };

  if (loading) return <p className="text-center mt-10">Загрузка...</p>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-purple-700">Админ-панель</h1>
      {error ? (
        <p className="mt-4 text-red-500">{error}</p>
      ) : (
        <p className="mt-4 text-xl p-4 bg-purple-100 border border-purple-400 rounded-md">{adminMessage}</p>
      )}
      <button onClick={handleLogout} className="mt-6 bg-red-500 text-white p-2 rounded hover:bg-red-600">
        Выйти
      </button>
    </div>
  );
} 