import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { documensoService } from '@/api/documenso';
import { useSession } from '@koudmain/ui/context';

export default function SignatureWebViewScreen() {
  const [signatureUrl, setSignatureUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const { session } = useSession();

  useEffect(() => {
    const fetchSignatureUrl = async () => {
      try {
        const data = await documensoService.getSignatureUrl(session);

        console.log('URL dynamique reçue du Back:', data);
        setSignatureUrl(data.url);
      } catch (error) {
        console.error('Erreur lors de la récupération de l’URL:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSignatureUrl();
  }, [session]);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-slate-50 justify-center items-center">
        <ActivityIndicator size="large" color="#000000" />
        <Text className="mt-4 text-slate-500 font-medium">Préparation du contrat...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <View className="h-14 bg-black justify-center items-center shadow-md">
        <Text className="text-white font-bold text-base tracking-wide">Signature du document</Text>
      </View>

      <View className="flex-1 bg-white">
        {signatureUrl && (
          <WebView
            source={{ uri: signatureUrl }}
            className="flex-1"
            domStorageEnabled={true}
            javaScriptEnabled={true}
            scalesPageToFit={true}
            onNavigationStateChange={(navState) => {
              if (navState.url.includes('/success') || navState.url.includes('/completed')) {
                console.log(
                  '📱 Mobile : L’utilisateur a signé ! Tu peux fermer l’écran ou rediriger.',
                );
              }
            }}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
