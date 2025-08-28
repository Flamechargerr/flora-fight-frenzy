import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
// Import debug styling for enhanced grid visibility
import './debug.css'

createRoot(document.getElementById("root")!).render(<App />);