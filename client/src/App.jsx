import React from 'react';
import Sidebar from './components/Sidebar';
import { Routes, Route, useLocation } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Login from './pages/Login';
import Settings from './pages/Settings';
import { AuthProvider } from './context/AuthContext';

import { CanvasRevealEffect } from './components/ui/sign-in-flow-1';
import { cn } from "@/lib/utils";

const Layout = ({ children }) => {
  return (
    <div className="flex min-h-screen w-full bg-black relative overflow-hidden">
      {/* Background Animation Layer */}
      {/* Background Animation Layer */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 opacity-100">
          <CanvasRevealEffect
            animationSpeed={5}
            containerClassName="bg-black"
            colors={[[255, 255, 255], [255, 255, 255]]}
            dotSize={3}
          />
        </div>
        {/* Lighter overlay for visibility but maintaining contrast */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(0,0,0,0.3)_0%,_#000000_100%)]" />
      </div>

      {/* Content Layer */}
      <div className="relative z-10 flex w-full h-full">
        <Sidebar />
        <main className="flex-1 p-8 ml-[250px] overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Redirect root to Dashboard */}


        <Route path="/*" element={
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/analytics" element={<div className="p-4"><h2 className="text-2xl">Analytics Coming Soon</h2></div>} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </Layout>
        } />
      </Routes>
    </AuthProvider>
  );
};

export default App;
