import React, { useRef, useImperativeHandle, forwardRef, useEffect, useCallback } from 'react';
import { StyleSheet, View, ViewStyle, ActivityIndicator } from 'react-native';
import { WebView, WebViewMessageEvent } from 'react-native-webview';
import { PublicationMap } from '@/types/publication';
import { pinPrimaryBase64, pinSecondaryBase64, pinWhiteBase64 } from '@/constants/mapPinsBase64';

export interface LeafletMapViewRef {
  animateToRegion: (coords: { latitude: number; longitude: number }, duration?: number) => void;
  centerOnMarker: (lat: number, lng: number) => void;
}

interface LeafletMapViewProps {
  initialRegion: {
    latitude: number;
    longitude: number;
    latitudeDelta?: number;
    longitudeDelta?: number;
  };
  publications: PublicationMap[];
  selectedId: number | null;
  isDark: boolean;
  onRegionChangeComplete?: (bounds: {
    minLat: number;
    maxLat: number;
    minLng: number;
    maxLng: number;
  }) => void;
  onMarkerPress?: (pub: PublicationMap, index: number) => void;
  style?: ViewStyle;
}

export const LeafletMapView = forwardRef<LeafletMapViewRef, LeafletMapViewProps>(
  (
    {
      initialRegion,
      publications,
      selectedId,
      isDark,
      onRegionChangeComplete,
      onMarkerPress,
      style,
    },
    ref,
  ) => {
    const webViewRef = useRef<WebView>(null);
    const isMapLoadedRef = useRef(false);

    useImperativeHandle(ref, () => ({
      animateToRegion: (coords) => {
        if (webViewRef.current && isMapLoadedRef.current) {
          webViewRef.current.injectJavaScript(
            `if (window.centerOn) { window.centerOn(${coords.latitude}, ${coords.longitude}); } true;`,
          );
        }
      },
      centerOnMarker: (lat: number, lng: number) => {
        if (webViewRef.current && isMapLoadedRef.current) {
          webViewRef.current.injectJavaScript(
            `if (window.centerOn) { window.centerOn(${lat}, ${lng}); } true;`,
          );
        }
      },
    }));

    const updateMarkersInWebView = useCallback(() => {
      if (!webViewRef.current || !isMapLoadedRef.current) return;
      const pubsJson = JSON.stringify(publications);
      const selectedIdJson = JSON.stringify(selectedId);
      const script = `
        if (window.updatePublications) {
          window.updatePublications(${pubsJson}, ${selectedIdJson}, ${isDark});
        }
        true;
      `;
      webViewRef.current.injectJavaScript(script);
    }, [publications, selectedId, isDark]);

    useEffect(() => {
      updateMarkersInWebView();
    }, [updateMarkersInWebView]);

    const handleMessage = (event: WebViewMessageEvent) => {
      try {
        const data = JSON.parse(event.nativeEvent.data);
        if (data.type === 'mapReady') {
          isMapLoadedRef.current = true;
          updateMarkersInWebView();
        } else if (data.type === 'regionChange' && onRegionChangeComplete) {
          onRegionChangeComplete(data.boundaries);
        } else if (data.type === 'markerPress' && onMarkerPress) {
          const pub = publications.find((p) => p.id === data.id);
          if (pub) {
            onMarkerPress(pub, data.index);
          }
        } else if (data.type === 'error') {
          console.warn('[Leaflet WebView Error]', data.message);
        } else if (data.type === 'log') {
          console.log('[Leaflet WebView Log]', data.message);
        }
      } catch (e) {
        console.error('Erreur lecture message WebView Leaflet:', e);
      }
    };

    const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" crossorigin="" />
        <style>
          * {
            -webkit-tap-highlight-color: transparent;
            box-sizing: border-box;
          }
          html, body {
            height: 100%;
            width: 100%;
            margin: 0;
            padding: 0;
            overflow: hidden;
            background-color: ${isDark ? '#242f3e' : '#f5f5f5'};
          }
          #map {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            width: 100%;
            height: 100%;
            background-color: ${isDark ? '#242f3e' : '#f5f5f5'};
          }
          .leaflet-control-zoom {
            display: none !important;
          }
          .leaflet-control-attribution {
            display: none !important;
          }
          ${
            isDark
              ? `
          .leaflet-tile {
            filter: brightness(0.6) invert(1) contrast(3) hue-rotate(200deg) saturate(0.3) brightness(0.7);
          }
          `
              : ''
          }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" crossorigin=""></script>
        <script>
          function logToRN(msg) {
            if (window.ReactNativeWebView) {
              window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'log', message: msg }));
            }
          }

          window.onerror = function(msg, url, line) {
            if (window.ReactNativeWebView) {
              window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'error', message: msg + ' (' + line + ')' }));
            }
          };

          var map;
          var markersLayer;
          var isDark = ${isDark ? 'true' : 'false'};

          var pinPrimary = "${pinPrimaryBase64}";
          var pinSecondary = "${pinSecondaryBase64}";
          var pinWhite = "${pinWhiteBase64}";

          function getPinUrl(isSelected, dark) {
            if (isSelected) return pinSecondary;
            return dark ? pinWhite : pinPrimary;
          }

          function createIcon(isSelected, dark) {
            return L.icon({
              iconUrl: getPinUrl(isSelected, dark),
              iconSize: [38, 38],
              iconAnchor: [19, 38],
              popupAnchor: [0, -38]
            });
          }

          function initMap() {
            if (map) return;
            try {
              var initialLat = ${initialRegion.latitude};
              var initialLng = ${initialRegion.longitude};

              map = L.map('map', {
                center: [initialLat, initialLng],
                zoom: 14,
                zoomControl: false,
                attributionControl: false
              });

              L.tileLayer('${tileUrl}', {
                maxZoom: 19,
                subdomains: 'abc',
                attribution: '© OpenStreetMap contributors'
              }).addTo(map);

              markersLayer = L.layerGroup().addTo(map);

              function postBounds() {
                if (!map) return;
                var bounds = map.getBounds();
                if (window.ReactNativeWebView) {
                  window.ReactNativeWebView.postMessage(JSON.stringify({
                    type: 'regionChange',
                    boundaries: {
                      minLat: bounds.getSouth(),
                      maxLat: bounds.getNorth(),
                      minLng: bounds.getWest(),
                      maxLng: bounds.getEast()
                    }
                  }));
                }
              }

              map.on('moveend', postBounds);

              if (window.ReactNativeWebView) {
                window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'mapReady' }));
              }
              setTimeout(postBounds, 200);
            } catch (err) {
              logToRN('initMap error: ' + err.message);
            }
          }

          window.updatePublications = function(pubs, selectedId, dark) {
            if (!map || !markersLayer) return;
            isDark = dark;
            markersLayer.clearLayers();

            if (!Array.isArray(pubs)) return;

            pubs.forEach(function(pub, index) {
              if (typeof pub.latitude !== 'number' || typeof pub.longitude !== 'number') return;
              var isSelected = (selectedId === pub.id);
              var icon = createIcon(isSelected, isDark);
              var marker = L.marker([pub.latitude, pub.longitude], { icon: icon });

              marker.on('click', function() {
                if (window.ReactNativeWebView) {
                  window.ReactNativeWebView.postMessage(JSON.stringify({
                    type: 'markerPress',
                    id: pub.id,
                    index: index
                  }));
                }
              });

              markersLayer.addLayer(marker);
            });
          };

          window.centerOn = function(lat, lng) {
            if (map) {
              map.panTo([lat, lng], { animate: true, duration: 0.4 });
            }
          };

          // Poll for L to be loaded if script is still downloading
          function tryInit() {
            if (typeof L !== 'undefined') {
              initMap();
            } else {
              setTimeout(tryInit, 50);
            }
          }
          tryInit();
        </script>
      </body>
      </html>
    `;

    return (
      <View style={[styles.container, style]}>
        <WebView
          key={`leaflet-${isDark ? 'dark' : 'light'}`}
          ref={webViewRef}
          originWhitelist={['*']}
          source={{ html: htmlContent, baseUrl: 'https://unpkg.com' }}
          onMessage={handleMessage}
          style={styles.webView}
          containerStyle={styles.container}
          scrollEnabled={false}
          bounces={false}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          overScrollMode="never"
          startInLoadingState={true}
          renderLoading={() => (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={isDark ? '#FFFFFF' : '#313131'} />
            </View>
          )}
        />
      </View>
    );
  },
);

LeafletMapView.displayName = 'LeafletMapView';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  webView: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
});
