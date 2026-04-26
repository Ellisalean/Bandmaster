/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Calendar, Users, Music, LayoutDashboard, Home, LogIn, LogOut } from 'lucide-react';
import Repertoire from './components/Repertoire';
import Events from './components/Events';
import { useAuth } from './context/AuthContext';

const Sidebar = () => {
  const { logOut } = useAuth();
  return (
    <nav className="w-64 glass rounded-3xl p-6 flex flex-col gap-8 h-full">
      <h1 className="text-xl font-bold tracking-tight italic px-2">BandMaster</h1>
      <ul className="flex flex-col gap-2">
        {[
          { name: 'Dashboard', path: '/', icon: LayoutDashboard },
          { name: 'Repertorio', path: '/repertorio', icon: Music },
          { name: 'Ensayos', path: '/ensayos', icon: Calendar },
          { name: 'Músicos', path: '/personas', icon: Users },
        ].map((item) => (
          <li key={item.name}>
            <Link to={item.path} className="px-4 py-3 hover:bg-white/5 text-zinc-400 rounded-xl flex items-center gap-3 transition-colors">
              <item.icon size={20} />
              <span>{item.name}</span>
            </Link>
          </li>
        ))}
      </ul>
      <button onClick={logOut} className="mt-auto px-4 py-3 hover:bg-white/5 text-zinc-400 rounded-xl flex items-center gap-3 transition-colors">
        <LogOut size={20} />
        <span>Cerrar Sesión</span>
      </button>
    </nav>
  );
};

const Dashboard = () => (
  <div className="glass rounded-3xl p-8 h-full">
    <h2 className="text-3xl font-bold tracking-tight mb-4">Bienvenido, Band Leader 👋</h2>
    <p className="text-zinc-400">Tu resumen de actividades aparecerá aquí.</p>
  </div>
);

export default function App() {
  const { user, signIn } = useAuth();

  if (!user) {
    return (
      <div className="flex h-screen w-full items-center justify-center p-4">
        <button onClick={signIn} className="px-6 py-3 bg-violet-600 rounded-xl font-bold flex items-center gap-2">
          <LogIn />
          Inicia sesión con Google
        </button>
      </div>
    );
  }

  return (
    <Router>
      <div className="flex p-4 gap-4 h-screen w-full">
        <Sidebar />
        <main className="flex-1 flex flex-col gap-4">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/repertorio" element={<Repertoire />} />
            <Route path="/ensayos" element={<Events />} />
            <Route path="/personas" element={<div className="glass rounded-3xl p-8 h-full">Personas</div>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

