import React, { useState } from 'react';
import { Code, CheckCircle, AlertCircle, Lightbulb, TrendingUp } from 'lucide-react';

export default function CodeAnalysis() {
  const [selectedTab, setSelectedTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Visão Geral', icon: Code },
    { id: 'strengths', label: 'Pontos Fortes', icon: CheckCircle },
    { id: 'improvements', label: 'Melhorias', icon: AlertCircle },
    { id: 'tips', label: 'Dicas', icon: Lightbulb }
  ];

  const overview = {
    stack: ['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'shadcn-ui'],
    architecture: 'Serverless (Vercel)',
    integrations: ['WhatsApp API', 'Instagram API', 'Database'],
    score: 8.2
  };

  const strengths = [
    {
      title: 'Stack Moderno e Profissional',
      description: 'Uso de TypeScript com React demonstra preocupação com type safety e manutenibilidade. Vite oferece build rápido e excelente DX.',
      impact: 'Alto'
    },
    {
      title: 'Arquitetura Serverless',
      description: 'APIs organizadas em /api com endpoints específicos (orders, status, auth, webhook) mostra separação clara de responsabilidades.',
      impact: 'Alto'
    },
    {
      title: 'UI Component Library',
      description: 'Integração com shadcn-ui e Tailwind indica atenção à qualidade da interface e produtividade no desenvolvimento.',
      impact: 'Médio'
    },
    {
      title: 'Integração Omnichannel',
      description: 'Suporte para WhatsApp e Instagram mostra visão moderna de atendimento ao cliente através de múltiplos canais.',
      impact: 'Alto'
    }
  ];

  const improvements = [
    {
      title: 'Gerenciamento de Variáveis de Ambiente',
      description: 'As variáveis estão documentadas no README, mas considere usar um arquivo .env.example para facilitar setup inicial.',
      priority: 'Média',
      suggestion: 'Criar .env.example e documentar cada variável'
    },
    {
      title: 'Documentação de Código',
      description: 'README explica setup, mas falta documentação sobre a arquitetura, fluxo de dados e decisões técnicas.',
      priority: 'Alta',
      suggestion: 'Adicionar diagrama de arquitetura e docs/README.md'
    },
    {
      title: 'Testes',
      description: 'Não há menção a testes no repositório. Para um sistema com webhooks e APIs críticas, testes são essenciais.',
      priority: 'Alta',
      suggestion: 'Implementar testes unitários (Vitest) e E2E (Playwright)'
    },
    {
      title: 'Tratamento de Erros',
      description: 'Com múltiplas integrações externas, é crucial ter estratégia robusta de error handling e retry logic.',
      priority: 'Alta',
      suggestion: 'Implementar error boundaries e logging estruturado'
    }
  ];

  const tips = [
    {
      category: 'TypeScript',
      tip: 'Use tipos estritos para as respostas das APIs do WhatsApp/Instagram. Considere Zod para validação em runtime.',
      example: 'type WhatsAppMessage = z.object({ ... })'
    },
    {
      category: 'Performance',
      tip: 'Para pedidos em tempo real, considere usar React Query ou SWR para cache e sincronização automática.',
      example: 'const { data } = useQuery("orders", fetchOrders)'
    },
    {
      category: 'Segurança',
      tip: 'Implemente rate limiting nos webhooks e valide sempre o WEBHOOK_VERIFY_TOKEN para prevenir abusos.',
      example: 'Adicionar middleware de autenticação nas funções serverless'
    },
    {
      category: 'CI/CD',
      tip: 'Configure GitHub Actions para rodar testes, linting e type checking antes do deploy.',
      example: 'Adicionar .github/workflows/ci.yml'
    },
    {
      category: 'Monitoramento',
      tip: 'Integre Sentry ou similar para tracking de erros em produção, especialmente nos webhooks.',
      example: 'Configurar Sentry no Vercel'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-3 rounded-xl">
              <Code className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Café Connect System</h1>
              <p className="text-gray-600">Análise de Código e Arquitetura</p>
            </div>
          </div>
          
          <div className="flex items-center gap-8 mt-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-amber-600">{overview.score}</div>
              <div className="text-sm text-gray-600">Score Geral</div>
            </div>
            <div className="flex-1 grid grid-cols-2 gap-4">
              <div className="bg-amber-50 p-3 rounded-lg">
                <div className="text-sm text-gray-600">Stack</div>
                <div className="font-semibold text-gray-800">{overview.stack.length} tecnologias</div>
              </div>
              <div className="bg-orange-50 p-3 rounded-lg">
                <div className="text-sm text-gray-600">Integrações</div>
                <div className="font-semibold text-gray-800">{overview.integrations.length} serviços</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg mb-6 p-2">
          <div className="flex gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg transition-all ${
                    selectedTab === tab.id
                      ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          {selectedTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Stack Tecnológica</h2>
                <div className="flex flex-wrap gap-2">
                  {overview.stack.map((tech) => (
                    <span
                      key={tech}
                      className="px-4 py-2 bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 rounded-full font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">Arquitetura</h3>
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg">
                  <p className="text-gray-700">
                    <strong>Serverless Functions</strong> hospedadas no Vercel com endpoints organizados:
                  </p>
                  <ul className="mt-2 space-y-1 text-gray-600">
                    <li>• <code className="bg-white px-2 py-1 rounded text-sm">/api/orders</code> - Gerenciamento de pedidos</li>
                    <li>• <code className="bg-white px-2 py-1 rounded text-sm">/api/status</code> - Sincronização de status</li>
                    <li>• <code className="bg-white px-2 py-1 rounded text-sm">/api/auth</code> - Autenticação</li>
                    <li>• <code className="bg-white px-2 py-1 rounded text-sm">/api/webhook</code> - Webhooks WhatsApp/Instagram</li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">Integrações</h3>
                <div className="grid grid-cols-3 gap-4">
                  {overview.integrations.map((integration) => (
                    <div
                      key={integration}
                      className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-lg text-center"
                    >
                      <div className="font-semibold text-gray-800">{integration}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {selectedTab === 'strengths' && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Pontos Fortes do Código</h2>
              {strengths.map((strength, idx) => (
                <div
                  key={idx}
                  className="border-l-4 border-green-500 bg-green-50 p-5 rounded-r-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-bold text-gray-800">{strength.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      strength.impact === 'Alto' ? 'bg-green-200 text-green-800' : 'bg-blue-200 text-blue-800'
                    }`}>
                      Impacto {strength.impact}
                    </span>
                  </div>
                  <p className="text-gray-700">{strength.description}</p>
                </div>
              ))}
            </div>
          )}

          {selectedTab === 'improvements' && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Áreas para Melhorar</h2>
              {improvements.map((improvement, idx) => (
                <div
                  key={idx}
                  className="border-l-4 border-orange-500 bg-orange-50 p-5 rounded-r-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-bold text-gray-800">{improvement.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      improvement.priority === 'Alta' ? 'bg-red-200 text-red-800' : 'bg-yellow-200 text-yellow-800'
                    }`}>
                      {improvement.priority}
                    </span>
                  </div>
                  <p className="text-gray-700 mb-3">{improvement.description}</p>
                  <div className="bg-white p-3 rounded-lg">
                    <div className="text-sm font-semibold text-gray-600 mb-1">💡 Sugestão:</div>
                    <div className="text-sm text-gray-700">{improvement.suggestion}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {selectedTab === 'tips' && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Dicas Práticas</h2>
              {tips.map((tip, idx) => (
                <div
                  key={idx}
                  className="bg-gradient-to-r from-purple-50 to-pink-50 p-5 rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="w-5 h-5 text-purple-600" />
                    <h3 className="text-lg font-bold text-gray-800">{tip.category}</h3>
                  </div>
                  <p className="text-gray-700 mb-3">{tip.tip}</p>
                  <div className="bg-gray-900 text-gray-100 p-3 rounded-lg font-mono text-sm">
                    {tip.example}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-6 text-center text-gray-600 text-sm">
          <p>💡 Quer explorar algum ponto específico? É só me avisar!</p>
        </div>
      </div>
    </div>
  );
}
