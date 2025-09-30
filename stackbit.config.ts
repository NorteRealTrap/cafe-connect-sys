import { defineStackbitConfig, SiteMapEntry, StackbitConfig, DocumentWithSource, Model } from '@stackbit/types';
import { GitContentSource } from '@stackbit/cms-git';

export default defineStackbitConfig({
  stackbitVersion: '~0.6.0', // Adicionando a versão obrigatória do Stackbit
  contentSources: [
    new GitContentSource({
      localDevSync: {
        repoUrl: 'git@github.com:NorteRealTrap/cafe-connect-sys.git',
        repoWorkingBranch: 'main',
        repoPublishBranch: 'main',
      },
      rootPath: __dirname,
      contentDirs: ["conteúdo"], // Diretório de conteúdo
      models: [
        {
          name: "Pagina", // Nome do modelo corrigido
          type: "page",
          urlPath: "/{slug}",  // URL derivada do arquivo JSON
          filePath: "conteúdo/páginas/{slug}.json",
          fields: [
            { name: "titulo", type: "string", required: true },
            { name: "slug", type: "string", required: true },
            { name: "corpo", type: "markdown", required: true },
            { name: "imagem", type: "image", required: false }
          ]
        }
      ]
    })
  ],
  siteMap: ({ documents, models }: { documents: DocumentWithSource[]; models: Model[] }) => {
    const pageModels = models.filter((m) => m.type === "page");

    return documents
      .filter((d) => pageModels.some((m) => m.name === d.modelName))
      .map((document) => {
        const slugField = document.fields["slug"];
        const slug = slugField && typeof slugField === 'string' ? slugField : document.id; // Garantindo que slug exista
        return {
          stableId: document.id,
          urlPath: `/${slug}`, // Usando o campo slug para URLs personalizadas
          document,
          isHomePage: slug === "pagina-inicial" // Define a página inicial
        } as SiteMapEntry;
      })
      .filter(Boolean);
  }
} as StackbitConfig);
