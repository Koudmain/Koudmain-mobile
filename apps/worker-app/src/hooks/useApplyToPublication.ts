import { useCallback, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { profileService } from '@koudmain/ui/api/profile.api';
import { applyToPublicationAsync } from '@/api/application.api';
import { chatService } from '@/api/chat.api';
import { IApplication } from '@/types/application';

interface ApplyToPublicationParams {
  publicationId: number;
  companyId?: number;
  message: string;
}

export interface ApplyToPublicationResult {
  application: IApplication;
  conversationId: number | null;
}

interface UseApplyToPublicationReturn {
  applyToPublication: (
    params: ApplyToPublicationParams,
  ) => Promise<ApplyToPublicationResult | null>;
  isApplying: boolean;
  errorApply: string | null;
}

export const useApplyToPublication = (): UseApplyToPublicationReturn => {
  const [isApplying, setIsApplying] = useState(false);
  const [errorApply, setErrorApply] = useState<string | null>(null);

  const applyToPublication = useCallback(
    async ({
      publicationId,
      companyId,
      message,
    }: ApplyToPublicationParams): Promise<ApplyToPublicationResult | null> => {
      if (!Number.isFinite(publicationId)) return null;

      setIsApplying(true);
      setErrorApply(null);

      try {
        const application = await applyToPublicationAsync({
          publicationId,
          message,
        });

        let conversationId: number | null = null;
        const token = await SecureStore.getItemAsync('session');

        if (token) {
          try {
            const conversations = await chatService.getWorkerConversations(token);
            let targetConv =
              conversations.find((c) => Number(c.publicationId) === Number(publicationId)) ?? null;

            if (!targetConv && companyId) {
              let workerId = application?.workerId;
              if (!workerId) {
                const profile = await profileService.getWorkerProfile(token, 'me');
                workerId = profile.id;
              }

              if (workerId) {
                targetConv = await chatService.createConversation(token, {
                  publicationId,
                  workerId,
                  companyId,
                });
              }
            }

            if (targetConv) {
              conversationId = targetConv.id;
              const hasExistingMessage =
                Array.isArray(targetConv.last_message) && targetConv.last_message.length > 0;

              if (!hasExistingMessage && message.trim().length > 0) {
                await chatService.sendMessage(token, targetConv.id, message.trim());
              }
            }
          } catch (chatErr) {
            console.warn('Could not synchronize application conversation:', chatErr);
          }
        }

        return {
          application,
          conversationId,
        };
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Une erreur est survenue lors de l'envoi de votre candidature.";
        setErrorApply(errorMessage);
        return null;
      } finally {
        setIsApplying(false);
      }
    },
    [],
  );

  return {
    applyToPublication,
    isApplying,
    errorApply,
  };
};
