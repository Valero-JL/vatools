import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ThemeProvider } from './theme/ThemeProvider';
import { HomePage } from './routes/HomePage';
import { WindPage } from './routes/WindPage';
import { TocPage } from './routes/TocPage';
import { TodPage } from './routes/TodPage';
import { TimePage } from './routes/TimePage';
import { FuelPage } from './routes/FuelPage';
import { ChecklistsBriefingPage } from './routes/ChecklistsBriefingPage';
import { A320Page } from './routes/A320Page';
import { SourcesPage } from './routes/SourcesPage';
import { AboutPage } from './routes/AboutPage';

export default function App() {
  return (
    <ThemeProvider>
      <HashRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="wind" element={<WindPage />} />
            <Route path="toc" element={<TocPage />} />
            <Route path="tod" element={<TodPage />} />
            <Route path="time" element={<TimePage />} />
            <Route path="fuel" element={<FuelPage />} />
            <Route path="checklists" element={<ChecklistsBriefingPage />} />
            <Route path="a320" element={<A320Page />} />
            <Route path="sources" element={<SourcesPage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </HashRouter>
    </ThemeProvider>
  );
}
