import { File } from 'expo-file-system';

export const appendImage = (formData: FormData, field: string, uri: string) => {
  formData.append(field, new File(uri));
};
