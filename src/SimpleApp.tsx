import { useState } from 'react';

type UserRole = 'admin' | 'caixa' | 'atendente';

const SimpleApp = () => {
  const [user, setUser] = useState<{ role: UserRole } | null>(null);
  const [activeModule, setActiveModule] = useState('dashboard');

  if (!user) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #059669, #3b82f6)',
        fontFamily: 'system-ui'
      }}>
        <div style={{
          background: 'white',
          padding: '2rem',
          borderRadius: '1rem',
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
          width: '100%',
          maxWidth: '400px'
        }}>
          <h1 style={{ textAlign: 'center', marginBottom: '2rem', color: '#1f2937' }}>
            CCPServices
          </h1>
          <form onSubmit={(e) => {
            e.preventDefault();
            setUser({ role: 'admin' });
          }}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                Tipo de Usuário
              </label>
              <select style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                fontSize: '1rem'
              }}>
                <option value="admin">Administrador</option>
                <option value="caixa">Caixa</option>
                <option value="atendente">Atendente</option>
              </select>
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                Email
              </label>
              <input 
                type="email" 
                placeholder="seu@email.com"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  fontSize: '1rem'
                }}
                required
              />
            </div>
            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                Senha
              </label>
              <input 
                type="password" 
                placeholder="••••••••"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  fontSize: '1rem'
                }}
                required
              />
            </div>
            <button 
              type="submit"
              style={{
                width: '100%',
                padding: '0.75rem',
                background: 'linear-gradient(135deg, #059669, #047857)',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Entrar no Sistema
            </button>
          </form>
        </div>
      </div>
    );
  }

  const modules = [
    { id: 'pedidos', title: 'Pedidos', desc: 'Gerenciar pedidos' },
    { id: 'cardapio', title: 'Cardápio', desc: 'Produtos e menu' },
    { id: 'mesas', title: 'Mesas', desc: 'Controle de mesas' },
    { id: 'pagamentos', title: 'Pagamentos', desc: 'Processar vendas' }
  ];

  if (activeModule === 'pedidos') {
    return (
      <div style={{ padding: '2rem', fontFamily: 'system-ui' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1>Gerenciamento de Pedidos</h1>
          <div>
            <button 
              onClick={() => setActiveModule('dashboard')}
              style={{
                padding: '0.5rem 1rem',
                marginRight: '1rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                background: 'white',
                cursor: 'pointer'
              }}
            >
              Voltar
            </button>
            <button 
              onClick={() => setUser(null)}
              style={{
                padding: '0.5rem 1rem',
                border: 'none',
                borderRadius: '0.5rem',
                background: '#dc2626',
                color: 'white',
                cursor: 'pointer'
              }}
            >
              Sair
            </button>
          </div>
        </div>
        
        <div style={{ display: 'grid', gap: '1rem' }}>
          {[1, 2, 3].map(i => (
            <div key={i} style={{
              border: '1px solid #e5e7eb',
              borderRadius: '0.5rem',
              padding: '1rem',
              background: 'white'
            }}>
              <h3>Pedido #{i.toString().padStart(3, '0')}</h3>
              <p>Cliente: João Silva</p>
              <p>Status: Preparando</p>
              <p>Total: R$ 45,90</p>
              <button style={{
                padding: '0.5rem 1rem',
                background: '#059669',
                color: 'white',
                border: 'none',
                borderRadius: '0.25rem',
                cursor: 'pointer'
              }}>
                Atualizar Status
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Dashboard - CCPServices</h1>
        <button 
          onClick={() => setUser(null)}
          style={{
            padding: '0.5rem 1rem',
            border: 'none',
            borderRadius: '0.5rem',
            background: '#dc2626',
            color: 'white',
            cursor: 'pointer'
          }}
        >
          Sair
        </button>
      </div>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '1.5rem' 
      }}>
        {modules.map(module => (
          <div 
            key={module.id}
            onClick={() => setActiveModule(module.id)}
            style={{
              border: '1px solid #e5e7eb',
              borderRadius: '0.75rem',
              padding: '1.5rem',
              background: 'white',
              cursor: 'pointer',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <h3 style={{ marginBottom: '0.5rem', color: '#1f2937' }}>{module.title}</h3>
            <p style={{ color: '#6b7280', marginBottom: '1rem' }}>{module.desc}</p>
            <button style={{
              padding: '0.5rem 1rem',
              background: '#059669',
              color: 'white',
              border: 'none',
              borderRadius: '0.25rem',
              cursor: 'pointer'
            }}>
              Acessar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SimpleApp;