// Sistema de Upload e Gerenciamento de Imagens

export interface ImageUploadResult {
  success: boolean;
  dataUrl?: string;
  error?: string;
}

export const imageUpload = {
  // Converte arquivo para base64
  fileToBase64: (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  },

  // Valida e processa upload de imagem
  uploadImage: async (file: File): Promise<ImageUploadResult> => {
    // Validar tipo
    if (!file.type.startsWith('image/')) {
      return { success: false, error: 'Arquivo deve ser uma imagem' };
    }

    // Validar tamanho (máx 2MB)
    if (file.size > 2 * 1024 * 1024) {
      return { success: false, error: 'Imagem deve ter no máximo 2MB' };
    }

    try {
      const dataUrl = await imageUpload.fileToBase64(file);
      return { success: true, dataUrl };
    } catch (error) {
      return { success: false, error: 'Erro ao processar imagem' };
    }
  },

  // Redimensiona imagem mantendo proporção
  resizeImage: (dataUrl: string, maxWidth: number, maxHeight: number): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      };
      img.src = dataUrl;
    });
  }
};
