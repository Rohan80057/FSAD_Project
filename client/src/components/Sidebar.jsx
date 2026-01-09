import React from 'react';
import { LayoutDashboard, Receipt, PieChart, Wallet, Settings } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
    const location = useLocation();

    const links = [
        { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/' },
        { name: 'Transactions', icon: <Receipt size={20} />, path: '/transactions' },
        { name: 'Analytics', icon: <PieChart size={20} />, path: '/analytics' },
        { name: 'Investments', icon: <Wallet size={20} />, path: '/investments' },
        { name: 'Settings', icon: <Settings size={20} />, path: '/settings' },
    ];

    return (
        <div className="fixed left-0 top-0 h-full w-[250px] border-r border-white/10 bg-black/20 backdrop-blur-xl z-20 flex flex-col p-6">
            <div className="mb-8 flex items-center gap-3">
                <div className="w-8 h-8 bg-white rounded-lg opacity-80"></div>
                <h1 className="text-xl font-medium text-white tracking-tight">FinSight</h1>
            </div>

            <nav className="flex flex-col gap-2">
                {links.map((link) => {
                    const isActive = location.pathname === link.path;
                    return (
                        <Link
                            key={link.name}
                            to={link.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 group ${isActive
                                    ? 'bg-white/[0.08] text-white border-l-2 border-white'
                                    : 'text-white/40 hover:text-white hover:bg-white/[0.02]'
                                }`}
                        >
                            <span className={isActive ? "opacity-100" : "opacity-70 group-hover:opacity-100 transition-opacity"}>
                                {link.icon}
                            </span>
                            <span className="font-medium tracking-wide text-sm">{link.name}</span>
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
};

export default Sidebar;
