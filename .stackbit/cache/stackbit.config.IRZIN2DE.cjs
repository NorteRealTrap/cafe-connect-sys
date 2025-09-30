var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// stackbit.config.ts
var stackbit_config_exports = {};
__export(stackbit_config_exports, {
  default: () => stackbit_config_default
});
module.exports = __toCommonJS(stackbit_config_exports);
var import_types = require("@stackbit/types");
var import_cms_git = require("@stackbit/cms-git");
var stackbit_config_default = (0, import_types.defineStackbitConfig)({
  stackbitVersion: "~0.6.0",
  // Adicionando a versão obrigatória do Stackbit
  contentSources: [
    new import_cms_git.GitContentSource({
      localDevSync: {
        repoUrl: "git@github.com:NorteRealTrap/cafe-connect-sys.git",
        repoWorkingBranch: "main",
        repoPublishBranch: "main"
      },
      rootPath: "C:\\Users\\Windows\\Documents\\cafe-connect-sys-main",
      contentDirs: ["conte\xFAdo"],
      // Diretório de conteúdo
      models: [
        {
          name: "Pagina",
          // Nome do modelo corrigido
          type: "page",
          urlPath: "/{slug}",
          // URL derivada do arquivo JSON
          filePath: "conte\xFAdo/p\xE1ginas/{slug}.json",
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
  siteMap: ({ documents, models }) => {
    const pageModels = models.filter((m) => m.type === "page");
    return documents.filter((d) => pageModels.some((m) => m.name === d.modelName)).map((document) => {
      const slugField = document.fields["slug"];
      const slug = slugField && typeof slugField === "string" ? slugField : document.id;
      return {
        stableId: document.id,
        urlPath: `/${slug}`,
        // Usando o campo slug para URLs personalizadas
        document,
        isHomePage: slug === "pagina-inicial"
        // Define a página inicial
      };
    }).filter(Boolean);
  }
});
//# sourceMappingURL=stackbit.config.IRZIN2DE.cjs.map
