// Sistema de realtime desabilitado temporariamente
export const initializeRealtime = () => {
  console.log('Realtime desabilitado');
};

export function useRealtime<T>(key: string, defaultValue: T) {
  return [defaultValue, () => {}] as const;
}

export function useRealtimeNotifications() {
  return {
    requestNotificationPermission: () => Promise.resolve()
  };
}
