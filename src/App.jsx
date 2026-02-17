import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import { TimerProvider } from './context/TimerContext';
import { ThemeProvider } from './contexts/ThemeContext';
import LoadingSpinner from './components/LoadingSpinner';

const Home = lazy(() => import('./components/Home'));
const PomodoroTimer = lazy(() => import('./components/PomodoroTimer'));
const Calendar = lazy(() => import('./components/Calendar'));
const TestArchive = lazy(() => import('./components/TestArchive'));
const Stats = lazy(() => import('./components/Stats'));

function App() {
  return (
    <ThemeProvider>
      <TimerProvider>
        <Router>
          <div className="pb-16 md:pb-0"> {/* Navigationバーの高さ分だけ下部に余白を追加 */}
            <Suspense fallback={<LoadingSpinner message="読み込み中..." />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/timer" element={<PomodoroTimer />} />
                <Route path="/calendar" element={<Calendar />} />
                <Route path="/archive" element={<TestArchive />} />
                <Route path="/stats" element={<Stats />} />
              </Routes>
            </Suspense>
          </div>
          <Navigation />
        </Router>
      </TimerProvider>
    </ThemeProvider>
  );
}

export default App;
