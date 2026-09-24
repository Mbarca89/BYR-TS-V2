import { notifyError } from '../components/Toaster/Toaster';

export const errorMessage = (error: any): string => {
    const data = error?.response?.data;
    if (typeof data === 'string' && data && !data.trim().startsWith('<')) return data;
    if (data && typeof data.message === 'string') return data.message;
    if (error?.response?.status === 401) return 'La sesión venció. Iniciá sesión nuevamente.';
    if (error?.code === 'ECONNABORTED') return 'El servidor tardó demasiado en responder. Revisá el resultado antes de reintentar.';
    return 'No se pudo completar la solicitud. Revisá la conexión e intentá nuevamente.';
};
const handleError = (error: any): void => {
    if (error?.code !== 'ERR_CANCELED') notifyError(errorMessage(error));
};
export default handleError;
