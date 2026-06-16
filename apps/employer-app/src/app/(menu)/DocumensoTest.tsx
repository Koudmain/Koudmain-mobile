import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';

const RAW_API_HOST = process.env.EXPO_PUBLIC_REACT_NATIVE_PACKAGER_HOSTNAME;

function transformIpBackendUrl(hostOrUrl?: string, port: number = 3000): string {
  if (!hostOrUrl) return `http://localhost:${port}`;

  const trimmed = hostOrUrl.trim().replace(/\/$/, '');
  if (!trimmed) return `http://localhost:${port}`;

  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }

  if (/:[0-9]+$/.test(trimmed)) {
    return `http://${trimmed}`;
  }

  return `http://${trimmed}:${port}`;
}

const DOCUMENSO_URL = transformIpBackendUrl(RAW_API_HOST, 3010);

export default function SignatureWebViewScreen() {
  // Remplace par ton IP et le token de signature généré par Documenso
  const documensoUrl = `${DOCUMENSO_URL}/sign/0jaZklJD2Zo_-xoJ8LDht`;
  console.log('Documenso URL:', documensoUrl);

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <View className="h-14 bg-black justify-center items-center shadow-md">
        <Text className="text-white font-bold text-base tracking-wide">Signature du document</Text>
      </View>

      <View className="flex-1 bg-white">
        <WebView
          source={{ uri: documensoUrl }}
          className="flex-1"
          domStorageEnabled={true}
          javaScriptEnabled={true}
          scalesPageToFit={true}
          onNavigationStateChange={(navState) => {
            if (navState.url.includes('/success')) {
              console.log('Signature validée ! Tu peux fermer la vue.');
            }
          }}
        />
      </View>
    </SafeAreaView>
  );
}
