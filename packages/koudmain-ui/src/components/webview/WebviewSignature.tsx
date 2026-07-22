import WebView from 'react-native-webview';

interface WebviewSignatureProps {
  url: string;
}

export default function WebviewSignature({ url }: WebviewSignatureProps) {
  return (
    <WebView
      source={{ uri: url }}
      className="flex-1"
      domStorageEnabled={true}
      javaScriptEnabled={true}
      scalesPageToFit={true}
      onNavigationStateChange={(navState) => {
        if (navState.url.includes('/success') || navState.url.includes('/completed')) {
          console.log('Webview : L’utilisateur a signé !');
        }
      }}
    />
  );
}
