export const useToast = () => {
  const visible = useState('toast-visible', () => false);
  const message = useState('toast-message', () => '');
  const type = useState<'success' | 'error'>('toast-type', () => 'success');

  const show = (msg: string, msgType: 'success' | 'error' = 'success') => {
    message.value = msg;
    type.value = msgType;
    visible.value = true;
    setTimeout(() => {
      visible.value = false;
    }, 3000);
  };

  return {
    visible,
    message,
    type,
    success: (msg: string) => show(msg, 'success'),
    error: (msg: string) => show(msg, 'error'),
  };
};
