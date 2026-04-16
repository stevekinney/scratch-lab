import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './application.css'
import { ErrorBoundary } from './components/error-boundary'
import Application from './application.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <Application />
    </ErrorBoundary>
  </StrictMode>,
)
