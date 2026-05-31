import { createRoot } from 'react-dom/client'
import './i18n'
import './index.css'
import App from './App'

// Clear CopilotKit inspector cache on startup — thread state is server-side
// and App.tsx already creates a fresh threadId on every mount.
for (const key of Object.keys(localStorage)) {
  if (key.startsWith('cpk:')) localStorage.removeItem(key);
}

createRoot(document.getElementById('root')!).render(
  <App />
)
