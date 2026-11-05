import React from 'react';
import { Header } from '@/widgets/header';
import { Footer } from '@/widgets/footer';
import { BottomNav } from '@/widgets/navbar';
import { AppRouter } from './router';

export function App() {
  return (
    <div className="app-layout">
      <Header />
      <main className="main-content">
        <AppRouter />
      </main>
      <Footer />
      <BottomNav />
    </div>
  );
}

export default App;
