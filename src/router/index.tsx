import { Route, Routes, Navigate } from 'react-router-dom';

import LoginPage from '../pages/login';
import NotFoundPage from '../pages/not_found';
import AdminPage from '../user/delivery/pages/admin';

const RouterComponent = () => {
    return (
        <Routes>
            <Route path='/' element={<LoginPage />} />
            <Route path='/login' element={<LoginPage />} />

            <Route path='/admin' element={<AdminPage />} />
            <Route path='/employee' element={<LoginPage />} />

            <Route path="/404_not_found" element={<NotFoundPage />} />
            <Route path="*" element={<Navigate to={"/404_not_found"} />} />
        </Routes>
    )
}
export default RouterComponent