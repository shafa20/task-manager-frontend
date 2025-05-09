import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider, Frame, Spinner } from '@shopify/polaris';
import enTranslations from '@shopify/polaris/locales/en.json';
import '@shopify/polaris/build/esm/styles.css';

const Home = lazy(() => import('./pages/Home'));
const CreateTask = lazy(() => import('./pages/CreateTask'));
const EditTask = lazy(() => import('./pages/EditTask'));

function App() {
  return (
    <AppProvider i18n={enTranslations}>
      <Router>
        <Frame>
          <Suspense fallback={<Spinner size="large" />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/create" element={<CreateTask />} />
              <Route path="/edit/:id" element={<EditTask />} />
            </Routes>
          </Suspense>
        </Frame>
      </Router>
    </AppProvider>
  );
}

export default App;
