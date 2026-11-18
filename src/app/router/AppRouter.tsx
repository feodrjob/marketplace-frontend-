import { Center, Loader } from '@mantine/core';
import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { GuestRoute } from './GuestRoute';
import { ProtectedRoute } from './ProtectedRoute';
import { SellerRoute } from './SellerRoute';

const HomePage = lazy(() => import('@/pages/home'));
const CatalogPage = lazy(() => import('@/pages/catalog'));
const ProductDetailPage = lazy(() => import('@/pages/product-detail'));
const LoginPage = lazy(() => import('@/pages/login'));
const RegisterPage = lazy(() => import('@/pages/register'));
const ProfilePage = lazy(() => import('@/pages/profile'));
const SellerProductCreatePage = lazy(() => import('@/pages/seller-product-create'));
const NotFoundPage = lazy(() => import('@/pages/not-found'));

function PageFallback() {
  return (
    <Center mih={240}>
      <Loader size="sm" color="brandBlue" />
    </Center>
  );
}

export function AppRouter() {
  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/catalog" element={<CatalogPage />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />

        <Route element={<GuestRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<ProfilePage />} />
        </Route>

        <Route element={<SellerRoute />}>
          <Route path="/seller/products/new" element={<SellerProductCreatePage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}

export default AppRouter;
