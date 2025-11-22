import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary";

// Adicionar tratamento de erros global
window.addEventListener('error', (event) => {
  console.error('Erro global capturado:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Promise rejeitada não tratada:', event.reason);
});

const rootElement = document.getElementById("root");

if (!rootElement) {
  console.error("Root element não encontrado!");
  document.body.innerHTML = '<div style="padding: 20px; text-align: center;"><h1>Erro: Elemento root não encontrado</h1><p>Verifique se o index.html contém um elemento com id="root"</p></div>';
} else {
  try {
    createRoot(rootElement).render(
      <ErrorBoundary>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ErrorBoundary>
    );
  } catch (error) {
    console.error('Erro ao renderizar aplicação:', error);
    rootElement.innerHTML = `
      <div style="padding: 20px; text-align: center; font-family: Arial, sans-serif;">
        <h1 style="color: #dc2626;">Erro ao carregar aplicação</h1>
        <p style="color: #666;">${error instanceof Error ? error.message : 'Erro desconhecido'}</p>
        <button onclick="window.location.reload()" style="margin-top: 20px; padding: 10px 20px; background: #3b82f6; color: white; border: none; border-radius: 4px; cursor: pointer;">
          Recarregar Página
        </button>
      </div>
    `;
  }
}
