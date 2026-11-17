import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { ErrorBoundary } from '@/shared/ui';
import { Footer } from '@/widgets/footer';
import { Header } from '@/widgets/header';
import { BottomNav } from '@/widgets/navbar';
import { AppRouter } from './router';

export function App() {
  return (
    <div className="app-layout">
      <Header />
      <main className="main-content">
        {/* Ошибка страницы не должна убивать шапку и навигацию */}
        <QueryErrorResetBoundary>
          {({ reset }) => (
            <ErrorBoundary onReset={reset}>
              <AppRouter />
            </ErrorBoundary>
          )}
        </QueryErrorResetBoundary>
      </main>
      <Footer />
      <BottomNav />
    </div>
  );
}

export default App;
