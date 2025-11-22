export const imageUpload = {
  uploadImage: async (file: File): Promise<{ success: boolean; dataUrl?: string; error?: string }> => {
    if (file.size > 2 * 1024 * 1024) {
      return { success: false, error: 'Arquivo muito grande (máx 2MB)' };
    }

    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve({ success: true, dataUrl: e.target?.result as string });
      };
      reader.onerror = () => {
        resolve({ success: false, error: 'Erro ao ler arquivo' });
      };
      reader.readAsDataURL(file);
    });
  },

  resizeImage: async (dataUrl: string, maxWidth: number, maxHeight: number): Promise<string> => {
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
