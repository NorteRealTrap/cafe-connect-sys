// Sistema Multi-Tenant - Resolução de Domínios

export interface Tenant {
  id: string;
  name: string;
  subdomain: string;
  customDomains: string[];
  type: 'subdomain' | 'custom' | 'default';
}

export const getTenantFromDomain = (hostname: string): Tenant | null => {
  const domain = hostname.split(':')[0].toLowerCase();
  
  // Desenvolvimento local
  if (domain === 'localhost' || domain === '127.0.0.1') {
    const tenantId = localStorage.getItem('dev-tenant-id') || 'demo';
    return {
      id: tenantId,
      name: 'Demo',
      subdomain: 'demo',
      customDomains: [],
      type: 'default'
    };
  }
  
  // Subdomínio do sistema (empresa-a.cafeconnect.app)
  const systemDomain = 'cafeconnect.app'; // Alterar para seu domínio
  if (domain.endsWith(`.${systemDomain}`)) {
    const subdomain = domain.split('.')[0];
    return {
      id: subdomain,
      name: subdomain,
      subdomain,
      customDomains: [],
      type: 'subdomain'
    };
  }
  
  // Domínio customizado (restauranteabc.com.br)
  const customDomains = JSON.parse(localStorage.getItem('custom-domains-map') || '{}');
  const tenantId = customDomains[domain];
  
  if (tenantId) {
    return {
      id: tenantId,
      name: tenantId,
      subdomain: tenantId,
      customDomains: [domain],
      type: 'custom'
    };
  }
  
  // Domínio padrão
  return {
    id: 'demo',
    name: 'Demo',
    subdomain: 'demo',
    customDomains: [],
    type: 'default'
  };
};

export const getCurrentTenant = (): Tenant | null => {
  if (typeof window === 'undefined') return null;
  return getTenantFromDomain(window.location.hostname);
};

export const initializeTenant = () => {
  const tenant = getCurrentTenant();
  if (!tenant) return null;
  
  // Salvar tenant atual
  localStorage.setItem('current-tenant-id', tenant.id);
  
  // Carregar configurações do tenant
  const config = getTenantConfig(tenant.id);
  
  // Aplicar branding
  if (config.branding?.primaryColor) {
    document.documentElement.style.setProperty('--primary', config.branding.primaryColor);
  }
  
  return tenant;
};

export const getTenantConfig = (tenantId: string) => {
  const config = localStorage.getItem(`tenant-config-${tenantId}`);
  return config ? JSON.parse(config) : {
    branding: {
      logo: '',
      primaryColor: '',
      secondaryColor: '',
      favicon: ''
    },
    features: {
      webOrders: true,
      delivery: true,
      tables: true,
      inventory: true
    },
    plan: 'free'
  };
};

export const saveTenantConfig = (tenantId: string, config: any) => {
  localStorage.setItem(`tenant-config-${tenantId}`, JSON.stringify(config));
};

export const addCustomDomain = (domain: string, tenantId: string) => {
  const domains = JSON.parse(localStorage.getItem('custom-domains-map') || '{}');
  domains[domain] = tenantId;
  localStorage.setItem('custom-domains-map', JSON.stringify(domains));
};

export const removeCustomDomain = (domain: string) => {
  const domains = JSON.parse(localStorage.getItem('custom-domains-map') || '{}');
  delete domains[domain];
  localStorage.setItem('custom-domains-map', JSON.stringify(domains));
};

export const getTenantDomains = (tenantId: string): string[] => {
  const domains = JSON.parse(localStorage.getItem('custom-domains-map') || '{}');
  return Object.keys(domains).filter(domain => domains[domain] === tenantId);
};
