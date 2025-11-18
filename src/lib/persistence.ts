// Sistema de persistência simplificado
export const initializePersistence = () => {
  console.log('Persistência inicializada');
};

export function usePersistentState<T>(key: string, defaultValue: T) {
  return [defaultValue, () => {}] as const;
}

export function useAutoSave<T extends Record<string, any>>(
  key: string, 
  initialData: T
) {
  return {
    data: initialData,
    updateField: () => {},
    resetForm: () => {},
    lastSaved: new Date(),
    setData: () => {}
  };
}
