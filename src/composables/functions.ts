export const isDev = () => window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

export const getFormData = <T>(event: Event): T => {
    const formData = new FormData(event.target as HTMLFormElement);
    const object: {[key: string]: unknown} = {};

    formData.forEach((value: unknown, key: string) => (object[key] = value));

    return object as T;
};

export const arrayChunk = <T>(array: unknown[], chunkSize: number): T => {
    const ret = [];

    for (let i = 0; i < array.length; i += chunkSize) {
        const chunk = array.slice(i, i + chunkSize);
        ret.push(chunk);
    }

    return ret as T;
};

export const rgbToGrayscale = (red: number, green: number, blue: number) => (red + green + blue) / 3;

export const hexToDecimal = (hex: string) => parseInt(hex, 16);