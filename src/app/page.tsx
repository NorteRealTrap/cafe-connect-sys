import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-amber-50 to-orange-100">
      <div className="text-center space-y-6 p-8">
        <div className="mb-8">
          <div className="text-6xl mb-4">☕</div>
          <h1 className="text-6xl font-bold text-amber-900">
            Café Connect
          </h1>
        </div>
        
        <p className="text-xl text-amber-700 max-w-md">
          Sistema de Gerenciamento de Cafeteria
        </p>
        
        <div className="flex gap-4 justify-center mt-8">
          <Link 
            href="/dashboard"
            className="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium"
          >
            Acessar Dashboard
          </Link>
          <Link 
            href="/admin/products"
            className="px-6 py-3 bg-white text-amber-700 rounded-lg hover:bg-gray-50 transition-colors font-medium border-2 border-amber-600"
          >
            Gerenciar Produtos
          </Link>
        </div>

        <div className="mt-12 p-4 bg-white/50 rounded-lg backdrop-blur-sm">
          <p className="text-sm text-gray-600">
            <strong>Credenciais de teste:</strong><br />
            Email: admin@cafeconnect.com<br />
            Senha: admin123
          </p>
        </div>
      </div>
    </main>
  );
}
