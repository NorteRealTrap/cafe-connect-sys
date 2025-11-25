export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 py-8">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-5xl font-bold text-amber-900 mb-6 mt-12">
          ☕ Café Connect
        </h1>
        <p className="text-xl text-amber-700 mb-12 max-w-2xl mx-auto">
          Sistema moderno de gerenciamento para sua cafeteria
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-amber-200">
            <div className="text-2xl mb-3">📦</div>
            <h3 className="text-lg font-semibold text-amber-800 mb-2">Gestão de Estoque</h3>
            <p className="text-amber-600 text-sm">Controle completo de produtos e ingredientes</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border border-amber-200">
            <div className="text-2xl mb-3">🛒</div>
            <h3 className="text-lg font-semibold text-amber-800 mb-2">Pedidos Online</h3>
            <p className="text-amber-600 text-sm">Sistema de pedidos em tempo real</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border border-amber-200">
            <div className="text-2xl mb-3">📊</div>
            <h3 className="text-lg font-semibold text-amber-800 mb-2">Relatórios</h3>
            <p className="text-amber-600 text-sm">Analytics e insights do negócio</p>
          </div>
        </div>

        <div className="space-x-4 mb-8">
          <a href="/dashboard" className="inline-block bg-amber-600 text-white px-8 py-3 rounded-lg hover:bg-amber-700 transition font-semibold">
            Acessar Dashboard
          </a>
          <a href="/admin/products" className="inline-block border border-amber-600 text-amber-700 px-8 py-3 rounded-lg hover:bg-amber-50 transition font-semibold">
            Gerenciar Produtos
          </a>
        </div>

        <div className="mt-8 p-4 bg-white/60 rounded-lg backdrop-blur-sm inline-block">
          <p className="text-sm text-gray-700">
            <strong>Credenciais de teste:</strong><br />
            Email: admin@cafeconnect.com | Senha: admin123
          </p>
        </div>
      </div>
    </main>
  )
}
