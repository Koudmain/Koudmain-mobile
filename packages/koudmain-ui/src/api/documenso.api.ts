import { apiFetch } from '@koudmain/ui/utils/api';

interface SignatureResponse {
  url: string;
}

export const documensoService = {
  getSignatureUrl: async (token: string | null) => {
    return apiFetch<SignatureResponse>('/documenso/test-signature', {
      method: 'GET',
      token,
    });
  },
};
