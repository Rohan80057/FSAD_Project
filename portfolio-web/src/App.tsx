import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Holdings from './pages/Holdings';
import Activity from './pages/Activity';
import Accounts from './pages/Accounts';
import Settings from './pages/Settings';

function App() {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="holdings" element={<Holdings />} />
                <Route path="activity" element={<Activity />} />
                <Route path="accounts" element={<Accounts />} />
                <Route path="settings" element={<Settings />} />
            </Route>
        </Routes>
    );
}

export default App;
