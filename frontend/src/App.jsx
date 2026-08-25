// frontend/src/App.jsx
import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext.jsx';
import { ExpenseProvider } from './context/ExpenseContext.jsx';
import { CategoryProvider } from './context/CategoryContext.jsx';
import MainLayout from './layouts/MainLayout.jsx';
import Loader from './components/common/Loader.jsx';

// Lazy-load all pages for better initial bundle size
const Dashboard = lazy(() => import('./pages/Dashboard.jsx'));
const Expenses  = lazy(() => import('./pages/Expenses.jsx'));
const Categories = lazy(() => import('./pages/Categories.jsx'));
const NotFound  = lazy(() => import('./pages/NotFound.jsx'));

import './styles/index.css';
import './styles/components.css';

function PageLoader() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '40vh' }}>
      <Loader rows={4} />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <CategoryProvider>
        <ExpenseProvider>
          <BrowserRouter>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route element={<MainLayout />}>
                  <Route index element={<Dashboard />} />
                  <Route path="expenses" element={<Expenses />} />
                  <Route path="categories" element={<Categories />} />
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </ExpenseProvider>
      </CategoryProvider>
    </AppProvider>
  );
}
