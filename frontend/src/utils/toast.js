import toast from 'react-hot-toast';

export const showSuccess = (message) => {
  toast.success(message, {
    icon: '✅',
    style: {
      background: '#10B981',
      color: '#fff',
      fontWeight: '500',
    },
  });
};

export const showError = (message) => {
  toast.error(message, {
    icon: '❌',
    style: {
      background: '#EF4444',
      color: '#fff',
      fontWeight: '500',
    },
  });
};

export const showLoading = (message = 'Loading...') => {
  return toast.loading(message, {
    style: {
      background: '#3B82F6',
      color: '#fff',
      fontWeight: '500',
    },
  });
};

export const showInfo = (message) => {
  toast(message, {
    icon: 'ℹ️',
    style: {
      background: '#3B82F6',
      color: '#fff',
      fontWeight: '500',
    },
  });
};

export const dismissToast = (toastId) => {
  toast.dismiss(toastId);
};
