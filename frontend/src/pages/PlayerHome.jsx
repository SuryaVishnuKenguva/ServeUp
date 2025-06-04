import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';

function PlayerHome() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if not a player
    if (user && user.role !== 'player') {
      navigate('/');
    }
  }, [user, navigate]);

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-20">
        <h1 className="text-3xl font-bold mb-6">Welcome, {user.name}!</h1>
        <p className="text-gray-300 mb-8">Your player dashboard is coming soon. Stay tuned for exciting features!</p>
        
        <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Your Profile</h2>
          <div className="space-y-3">
            <div>
              <span className="text-gray-400">Name:</span> {user.name}
            </div>
            <div>
              <span className="text-gray-400">Email:</span> {user.email}
            </div>
            <div>
              <span className="text-gray-400">WhatsApp:</span> {user.phone}
            </div>
            {user.academy && (
              <div>
                <span className="text-gray-400">Academy:</span> {user.academy}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlayerHome;