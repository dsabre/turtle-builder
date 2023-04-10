export const isDev = () => window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

export const getFormData = <T>(event: Event): T => {
    const formData = new FormData(event.target as HTMLFormElement);
    const object: {[key: string]: unknown} = {};

    formData.forEach((value: unknown, key: string) => (object[key] = value));

    return object as T;
};
