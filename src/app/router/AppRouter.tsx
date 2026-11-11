import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { HomePage } from '@/pages/home';
import { CatalogPage } from '@/pages/catalog';
import { LoginPage } from '@/pages/login';
import { RegisterPage } from '@/pages/register';
import { ProfilePage } from '@/pages/profile';
import { NotFoundPage } from '@/pages/not-found';
import { ProtectedRoute } from './ProtectedRoute';
import { GuestRoute } from './GuestRoute';

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/catalog" element={<CatalogPage />} />

      <Route element={<GuestRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route path="/profile" element={<ProfilePage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default AppRouter;
