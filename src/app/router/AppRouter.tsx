import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { HomePage } from '@/pages/home';
import { CatalogPage } from '@/pages/catalog';
import { LoginPage } from '@/pages/login';
import { NotFoundPage } from '@/pages/not-found';

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/catalog" element={<CatalogPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/profile" element={<LoginPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default AppRouter;
