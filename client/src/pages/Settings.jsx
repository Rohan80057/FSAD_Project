import React from 'react';
import { useAuth } from '../context/AuthContext';
import { User, LogOut, Shield, Moon, Bell, ChevronRight, Monitor } from 'lucide-react';
import { motion } from 'framer-motion';

const Settings = () => {
    const { user, logout } = useAuth();

    if (!user) return null;

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h2 className="text-4xl font-bold text-white tracking-tighter">Settings</h2>
                <p className="text-white/40 mt-2 font-light tracking-wide">Manage your preferences</p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="relative overflow-hidden rounded-3xl border border-white/5 bg-white/[0.02] backdrop-blur-md"
            >
                {/* Profile Header */}
                <div className="p-8 border-b border-white/5 flex items-center gap-6">
                    <div className="h-20 w-20 rounded-full bg-white/10 flex items-center justify-center text-3xl font-bold text-white">
                        {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-white tracking-tight">{user.name || 'User'}</h3>
                        <p className="text-white/40 font-light">{user.email || 'user@example.com'}</p>
                    </div>
                </div>

                {/* Settings Actions */}
                <div className="p-6 space-y-2">
                    <div className="group flex items-center justify-between p-4 rounded-xl hover:bg-white/[0.04] transition-all cursor-default">
                        <div className="flex items-center gap-4">
                            <div className="p-2 rounded-lg bg-white/5 text-white/70">
                                <Moon size={20} />
                            </div>
                            <div>
                                <div className="text-white font-medium">Appearance</div>
                                <div className="text-white/30 text-xs">Customize your interface theme</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-xs uppercase tracking-wider font-medium text-white/40 bg-white/5 px-2 py-1 rounded">Dark Mode</span>
                        </div>
                    </div>

                    <div className="group flex items-center justify-between p-4 rounded-xl hover:bg-white/[0.04] transition-all cursor-pointer">
                        <div className="flex items-center gap-4">
                            <div className="p-2 rounded-lg bg-white/5 text-white/70">
                                <Shield size={20} />
                            </div>
                            <div>
                                <div className="text-white font-medium">Security</div>
                                <div className="text-white/30 text-xs">Password and authentication</div>
                            </div>
                        </div>
                        <ChevronRight size={18} className="text-white/20 group-hover:text-white/60 transition-colors" />
                    </div>

                    <div className="group flex items-center justify-between p-4 rounded-xl hover:bg-white/[0.04] transition-all cursor-pointer">
                        <div className="flex items-center gap-4">
                            <div className="p-2 rounded-lg bg-white/5 text-white/70">
                                <Bell size={20} />
                            </div>
                            <div>
                                <div className="text-white font-medium">Notifications</div>
                                <div className="text-white/30 text-xs">Manage your alerts</div>
                            </div>
                        </div>
                        <ChevronRight size={18} className="text-white/20 group-hover:text-white/60 transition-colors" />
                    </div>

                    <div className="h-px bg-white/5 my-2" />

                    <button
                        onClick={logout}
                        className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-red-500/10 text-white/60 hover:text-red-400 transition-all text-left group"
                    >
                        <div className="p-2 rounded-lg bg-white/5 group-hover:bg-red-500/20 text-inherit transition-colors">
                            <LogOut size={20} />
                        </div>
                        <span className="font-medium">Sign Out</span>
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default Settings;
