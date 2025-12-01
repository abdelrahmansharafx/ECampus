import React, { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { COLORS } from '../constants';
import { clampLocationToSheikhZayed } from '../utils/locationUtils';

interface Coordinate {
  latitude: number;
  longitude: number;
}

interface MapViewProps {
  driverLocation: Coordinate;
  pickupLocations: Coordinate[];
  dropoffLocation: Coordinate;
  onMapReady?: () => void;
}

const MapView: React.FC<MapViewProps> = ({
  driverLocation,
  pickupLocations,
  dropoffLocation,
  onMapReady,
}) => {
  const [isLoading, setIsLoading] = useState(true);

  // Don't clamp driver location - use actual GPS coordinates
  // Only validate pickup and dropoff locations to ensure they're in the city
  const validatedDriverLocation = useMemo(() => driverLocation, [driverLocation]);
  const validatedPickupLocations = useMemo(() => 
    pickupLocations.map(clampLocationToSheikhZayed), [pickupLocations]
  );
  const validatedDropoffLocation = useMemo(() => 
    clampLocationToSheikhZayed(dropoffLocation), [dropoffLocation]
  );

  const handleMapLoad = useCallback(() => {
    setIsLoading(false);
    onMapReady?.();
  }, [onMapReady]);

  const mapHTML = useMemo(() => {
    const centerLat = validatedDriverLocation.latitude;
    const centerLng = validatedDriverLocation.longitude;

    return `
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link href="https://unpkg.com/maplibre-gl@latest/dist/maplibre-gl.css" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap" rel="stylesheet">
        <script src="https://unpkg.com/maplibre-gl@latest/dist/maplibre-gl.js"></script>
        <style>
          * { margin: 0; padding: 0; }
          body { 
            height: 100vh; 
            font-family: 'Cairo', 'Segoe UI', Arial, sans-serif; 
            direction: rtl;
          }
          #map { height: 100%; width: 100%; }
          .marker {
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
          }
          .driver-marker {
            width: 40px;
            height: 40px;
            background-color: #2563EB;
            border: 3px solid white;
            border-radius: 50%;
            box-shadow: 0 4px 12px rgba(37, 99, 235, 0.4);
            font-size: 20px;
            color: white;
          }
          .pickup-marker {
            width: 36px;
            height: 36px;
            background-color: #10B981;
            border: 2px solid white;
            border-radius: 50%;
            box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
            font-size: 18px;
            color: white;
            font-weight: bold;
          }
          .dropoff-marker {
            width: 36px;
            height: 36px;
            background-color: #F59E0B;
            border: 2px solid white;
            border-radius: 50%;
            box-shadow: 0 4px 12px rgba(245, 158, 11, 0.4);
            font-size: 18px;
          }
          .popup-title {
            font-weight: bold;
            color: #2563EB;
            margin-bottom: 5px;
            direction: rtl;
            text-align: right;
            font-family: 'Cairo', 'Segoe UI', Arial, sans-serif;
          }
          .popup-text {
            font-size: 13px;
            color: #666;
            direction: rtl;
            text-align: right;
            font-family: 'Cairo', 'Segoe UI', Arial, sans-serif;
          }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script>
          // Enable RTL text support for Arabic place names
          maplibregl.setRTLTextPlugin(
            'https://unpkg.com/@mapbox/mapbox-gl-rtl-text@0.3.0/dist/mapbox-gl-rtl-text.js',
            true,
            function(error) {
              if (error) {
                console.log('RTL plugin load error (non-critical):', error);
              }
            }
          );
          
          // Use OpenFreeMap style - this is a raster style so place names are baked into tiles
          // For Arabic place names, the tiles themselves need to include Arabic labels
          // Some areas in Egypt may already have Arabic names in OpenStreetMap tiles
          const map = new maplibregl.Map({
            container: 'map',
            style: 'https://tiles.openfreemap.org/styles/liberty',
            center: [${centerLng}, ${centerLat}],
            zoom: 13,
            attributionControl: false,
            localIdeographFontFamily: 'Cairo, Noto Sans Arabic, Arial Unicode MS'
          });
          
          map.on('load', function() {
            // Add route source and layer
            map.addSource('route', {
              type: 'geojson',
              data: {
                type: 'FeatureCollection',
                features: []
              }
            });

            map.addLayer({
              id: 'route',
              type: 'line',
              source: 'route',
              layout: {
                'line-join': 'round',
                'line-cap': 'round'
              },
              paint: {
                'line-color': '#2563EB',
                'line-width': 5,
                'line-opacity': 0.8
              }
            });

            // Function to fetch and draw route using OSRM
            async function drawRoute(waypoints) {
              try {
                // Build OSRM API URL - format: lng,lat;lng,lat;...
                const coordString = waypoints.map(wp => wp.lng + ',' + wp.lat).join(';');
                const url = \`https://router.project-osrm.org/route/v1/driving/\${coordString}?overview=full&geometries=geojson&steps=false\`;
                
                console.log('Fetching route from OSRM...');
                const response = await fetch(url);
                const data = await response.json();
                
                if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
                  const route = data.routes[0];
                  const routeGeometry = route.geometry;
                  
                  // Update route source with the route geometry
                  map.getSource('route').setData({
                    type: 'Feature',
                    geometry: routeGeometry,
                    properties: {
                      distance: (route.distance / 1000).toFixed(2) + ' km',
                      duration: Math.round(route.duration / 60) + ' min'
                    }
                  });
                  
                  // Fit bounds to route
                  const routeCoords = routeGeometry.coordinates;
                  const bounds = routeCoords.reduce((bounds, coord) => {
                    return bounds.extend(coord);
                  }, new maplibregl.LngLatBounds(routeCoords[0], routeCoords[0]));
                  
                  map.fitBounds(bounds, { padding: 100 });
                  
                  console.log('Route drawn successfully:', {
                    distance: (route.distance / 1000).toFixed(2) + ' km',
                    duration: Math.round(route.duration / 60) + ' min'
                  });
                } else {
                  throw new Error('No route found');
                }
              } catch (error) {
                console.log('Route error:', error);
                // Still fit bounds to markers if route fails
                const bounds = new maplibregl.LngLatBounds();
                bounds.extend([${validatedDriverLocation.longitude}, ${validatedDriverLocation.latitude}]);
                ${validatedPickupLocations.map(loc => `bounds.extend([${loc.longitude}, ${loc.latitude}]);`).join('')}
                bounds.extend([${validatedDropoffLocation.longitude}, ${validatedDropoffLocation.latitude}]);
                map.fitBounds(bounds, { padding: 80 });
              }
            }

            // Driver marker (current GPS location)
            const driverEl = document.createElement('div');
            driverEl.className = 'marker driver-marker';
            driverEl.innerHTML = '🚌';
            const driverMarker = new maplibregl.Marker(driverEl)
              .setLngLat([${validatedDriverLocation.longitude}, ${validatedDriverLocation.latitude}])
              .setPopup(new maplibregl.Popup({ offset: 25 })
                .setHTML('<div class="popup-title">🚌 موقع السائق</div><div class="popup-text">الموقع الحالي عبر GPS</div>'))
              .addTo(map);

            // Pickup markers
            ${validatedPickupLocations.map((loc, i) => `
              const pickupEl${i} = document.createElement('div');
              pickupEl${i}.className = 'marker pickup-marker';
              pickupEl${i}.innerHTML = '${i + 1}';
              new maplibregl.Marker(pickupEl${i})
                .setLngLat([${loc.longitude}, ${loc.latitude}])
                .setPopup(new maplibregl.Popup({ offset: 25 })
                  .setHTML('<div class="popup-title">نقطة الاستلام ${i + 1}</div><div class="popup-text">موقع استلام الطالب</div>'))
                .addTo(map);
            `).join('')}

            // Dropoff marker
            const dropoffEl = document.createElement('div');
            dropoffEl.className = 'marker dropoff-marker';
            dropoffEl.innerHTML = '🎯';
            new maplibregl.Marker(dropoffEl)
              .setLngLat([${validatedDropoffLocation.longitude}, ${validatedDropoffLocation.latitude}])
              .setPopup(new maplibregl.Popup({ offset: 25 })
                .setHTML('<div class="popup-title">الوجهة النهائية</div><div class="popup-text">المدرسة / الوجهة</div>'))
              .addTo(map);

            // Build waypoints for route: driver -> pickups (in order) -> dropoff
            const waypoints = [
              { lng: ${validatedDriverLocation.longitude}, lat: ${validatedDriverLocation.latitude} },
              ${validatedPickupLocations.map(loc => `{ lng: ${loc.longitude}, lat: ${loc.latitude} }`).join(',\n              ')},
              { lng: ${validatedDropoffLocation.longitude}, lat: ${validatedDropoffLocation.latitude} }
            ];

            // Draw route navigation
            drawRoute(waypoints);

            // Notify that map is loaded
            if (window.ReactNativeWebView) {
              window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'mapLoaded' }));
            }
          });

          map.on('error', function() {
            if (window.ReactNativeWebView) {
              window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'mapLoaded' }));
            }
          });
        </script>
      </body>
      </html>
    `;
  }, [validatedDriverLocation, validatedPickupLocations, validatedDropoffLocation]);

  return (
    <View style={styles.container}>
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.white} />
          <Text style={styles.loadingText}>جاري تحميل الخريطة...</Text>
        </View>
      )}
      <WebView
        key={`${validatedDriverLocation.latitude}-${validatedDriverLocation.longitude}`}
        source={{ html: mapHTML }}
        style={styles.webView}
        scrollEnabled={false}
        onLoadEnd={handleMapLoad}
        onMessage={(event) => {
          try {
            const data = JSON.parse(event.nativeEvent.data);
            if (data.type === 'mapLoaded') {
              handleMapLoad();
            }
          } catch (e) {
            // Silently handle parse errors
            handleMapLoad();
          }
        }}
        originWhitelist={['*']}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        onError={() => handleMapLoad()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
  },
  webView: {
    flex: 1,
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    zIndex: 10,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: COLORS.white,
    fontWeight: '600',
  },
});

export default MapView;

