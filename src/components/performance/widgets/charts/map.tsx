import React, { useEffect, useState } from 'react';
import { IgrGeographicMap, IgrGeographicMapModule } from 'igniteui-react-maps';
import { IgrGeographicProportionalSymbolSeries } from 'igniteui-react-maps';

IgrGeographicMapModule.register();

const regionalData = [
  { name: "North America", latitude: 54.5260, longitude: -105.2551, allocation: 60 },
  { name: "Europe", latitude: 54.5260, longitude: 15.2551, allocation: 25 },
  { name: "Asia Pacific", latitude: -25.2744, longitude: 133.7751, allocation: 10 },
  { name: "Latin America", latitude: -14.2350, longitude: -51.9253, allocation: 3 },
  { name: "Africa/Middle East", latitude: -8.7832, longitude: 34.5085, allocation: 2 }
];

const Map = () => {
  const [windowRect, setWindowRect] = useState({ left: -130, top: 25, width: 50, height: 30 });

  useEffect(() => {
    // Set the bounds to zoom in on the USA
    setWindowRect({ left: -125, top: 50, width: 30, height: 20 });
  }, []);

  return (
    <div className="map-container">
      <IgrGeographicMap width="100%" height="500px" windowRect={windowRect}>
        <IgrGeographicProportionalSymbolSeries
          name="series"
          markerType="Circle"
          markerBrush="LightBlue"
          markerOutline="DarkBlue"
          latitudeMemberPath="latitude"
          longitudeMemberPath="longitude"
          radiusMemberPath="allocation"
          dataSource={regionalData}
        />
      </IgrGeographicMap>
    </div>
  );
};

export default Map;
