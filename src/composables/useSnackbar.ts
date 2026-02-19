import { ref } from 'vue';

interface SnackbarState {
  show: boolean;
  message: string;
  color: string;
  timeout: number;
  location: 'top' | 'bottom' | 'top left' | 'top right' | 'bottom left' | 'bottom right';
}

const snackbarState = ref<SnackbarState>({
  show: false,
  message: '',
  color: 'info',
  timeout: 3000,
  location: 'top right'
});

export function useSnackbar() {
  function show(message: string, options?: Partial<Omit<SnackbarState, 'show' | 'message'>>) {
    snackbarState.value = {
      show: true,
      message,
      color: options?.color || 'info',
      timeout: options?.timeout || 3000,
      location: options?.location || 'top right'
    };
  }

  function success(message: string, timeout?: number) {
    show(message, { color: 'success', timeout });
  }

  function error(message: string, timeout?: number) {
    show(message, { color: 'error', timeout: timeout || 5000 });
  }

  function warning(message: string, timeout?: number) {
    show(message, { color: 'warning', timeout });
  }

  function info(message: string, timeout?: number) {
    show(message, { color: 'info', timeout });
  }

  function close() {
    snackbarState.value.show = false;
  }

  return {
    state: snackbarState,
    show,
    success,
    error,
    warning,
    info,
    close
  };
}
