import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import AppLayout from './components/layout/AppLayout'
import ErrorBoundary from './components/ui/ErrorBoundary'
import { ToastProvider } from './context/ToastContext'
import Dashboard from './pages/Dashboard'
import ExpenseDetail from './pages/ExpenseDetail'
import ExpenseList from './pages/ExpenseList'
import Stats from './pages/Stats'
import Upload from './pages/Upload'

export default function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<AppLayout />}>
              <Route path="/" element={
                <ErrorBoundary>
                  <Dashboard />
                </ErrorBoundary>
              } />
              <Route path="/upload" element={
                <ErrorBoundary>
                  <Upload />
                </ErrorBoundary>
              } />
              <Route path="/expenses" element={
                <ErrorBoundary>
                  <ExpenseList />
                </ErrorBoundary>
              } />
              <Route path="/expenses/:id" element={
                <ErrorBoundary>
                  <ExpenseDetail />
                </ErrorBoundary>
              } />
              <Route path="/stats" element={
                <ErrorBoundary>
                  <Stats />
                </ErrorBoundary>
              } />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </ErrorBoundary>
  )
}
