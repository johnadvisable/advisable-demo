// @ts-nocheck
/// <reference path="./final-complete-ts-disable.d.ts" />
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './i18n'

// Path of the very first (hard) page load. Used to avoid double-counting the
// Meta pixel PageView that index.html already fires on load.
(window as any).__advInitialPath = window.location.pathname;

console.log('🚀 Starting React application...');

// Add global error handler to catch script errors
window.addEventListener('error', (event) => {
  console.error('🚨 Global Error Handler:', {
    message: event.message,
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
    error: event.error,
    stack: event.error?.stack
  });
});

// Add unhandled promise rejection handler
window.addEventListener('unhandledrejection', (event) => {
  console.error('🚨 Unhandled Promise Rejection:', event.reason);
});

try {
  const rootElement = document.getElementById('root');
  
  if (!rootElement) {
    throw new Error('Root element not found');
  }
  
  console.log('📦 Creating React root...');
  const root = ReactDOM.createRoot(rootElement);
  
  console.log('🎯 Rendering App component...');
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
  
  console.log('✅ React application started successfully');
} catch (error) {
  console.error('❌ Failed to start React application:', error);
  
  // Fallback: show basic error message
  const rootElement = document.getElementById('root');
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="padding: 20px; background: #fee; border: 1px solid #fcc; color: #c33; font-family: Arial, sans-serif;">
        <h2>Application Error</h2>
        <p>Failed to load the application. Please check the console for more details.</p>
        <p>Error: ${error.message}</p>
      </div>
    `;
  }
}