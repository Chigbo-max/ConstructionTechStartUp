import { useDispatch } from 'react-redux';
import { showNotification } from '../features/ui/uiSlice';

export const useNotify = () => {
  const dispatch = useDispatch();
  return {
    success: (message) => dispatch(showNotification({ message, type: 'success' })),
    error: (message) => dispatch(showNotification({ message, type: 'error' })),
  };
};
