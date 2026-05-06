import { api } from './axios';
import type { Statement, UploadResult } from '@/types/api.types';

export const statementsApi = {
  getAll: () => api.get<Statement[]>('/statements').then((r) => r.data),

  getById: (id: string) => api.get<Statement>(`/statements/${id}`).then((r) => r.data),

  upload: (file: File) => {
    const form = new FormData();
    form.append('file', file);
    return api
      .post<UploadResult>('/statements/upload', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((r) => r.data);
  },
};
