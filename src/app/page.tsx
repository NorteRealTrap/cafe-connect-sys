import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-amber-50 to-orange-100">
      <div className="text-center space-y-6 p-8">
        <h1 className="text-6xl font-bold text-amber-900">
          ☕ Café Connect
        </h1>
        <p className="text-xl text-amber-700">
          Sistema de Gerenciamento de Cafeteria
        </p>
        
        <div className="flex gap-4 justify-center mt-8">
          <Link 
            href="/admin/products"
            className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-semibold"
          >
            Acessar Sistema
          </Link>
          <Link 
            href="/admin/orders"
            className="px-6 py-3 border border-amber-600 text-amber-600 hover:bg-amber-50 rounded-lg font-semibold"
          >
            Ver Pedidos
          </Link>
        </div>
      </div>
    </main>
  );
}
