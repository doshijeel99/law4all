"use client";

import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import { Loader2, MapPin } from "lucide-react";

// Mapbox CSS (required for markers and controls)
import "mapbox-gl/dist/mapbox-gl.css";

const Map = () => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const tickerRef = useRef(null);

  const [zoom, setZoom] = useState(18);
  const [lng, setLng] = useState(72.837296); // Default longitude
  const [lat, setLat] = useState(19.107093); // Default latitude
  const [loading, setLoading] = useState(false);

  console.log(lng, lat);

  const url = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))?.address?.googleMapLink
    : "";

  // Mock NGO data (replace with actual data from an API)
  const ngos = [
    { id: 1, name: "Aryan Foundation", lng: 72.9718, lat: 19.1971 },
    { id: 2, name: "Education For All", lng: 72.973, lat: 19.198 },
    { id: 3, name: "Helping Hands", lng: 72.9765, lat: 19.1955 },
    { id: 4, name: "Child Welfare Trust", lng: 72.97, lat: 19.2 },
    { id: 5, name: "Health and Hope", lng: 72.974, lat: 19.1995 },
    { id: 6, name: "Green Earth", lng: 72.968, lat: 19.1968 },
    { id: 7, name: "Food for All", lng: 72.975, lat: 19.1945 },
    { id: 8, name: "Women Empowerment", lng: 72.9775, lat: 19.1985 },
    { id: 9, name: "Future Leaders", lng: 72.979, lat: 19.2005 },
    { id: 10, name: "Youth Development", lng: 72.965, lat: 19.1925 },
    { id: 11, name: "Water for Life", lng: 72.9615, lat: 19.191 },
    { id: 12, name: "Rise and Shine", lng: 72.9665, lat: 19.202 },
    { id: 13, name: "Education Revolution", lng: 72.978, lat: 19.1935 },
    { id: 14, name: "Children's Future", lng: 72.9805, lat: 19.199 },
    { id: 15, name: "Health First", lng: 72.9635, lat: 19.195 },
    { id: 16, name: "Save the Earth", lng: 72.9705, lat: 19.2065 },
    { id: 17, name: "Dreams to Reality", lng: 72.96, lat: 19.2045 },
    { id: 18, name: "Youth for Change", lng: 72.966, lat: 19.188 },
    { id: 19, name: "New Horizons", lng: 72.9825, lat: 19.1955 },
    { id: 20, name: "Better Tomorrow", lng: 72.9735, lat: 19.1915 },
  ];

  // Mock underserved regions (replace with actual data)
  const underservedRegions = [
    { id: 1, lng: 72.975, lat: 19.198, radius: 500 }, // Radius in meters
    { id: 2, lng: 72.97, lat: 19.19, radius: 300 },
  ];

  useEffect(() => {
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/satellite-streets-v12",
      center: [lng, lat], // Initial center using default coordinates
      zoom: zoom,
      attributionControl: false,
    });

    mapRef.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    mapRef.current.on("move", () => {
      setLng(mapRef.current.getCenter().lng.toFixed(4));
      setLat(mapRef.current.getCenter().lat.toFixed(4));
      setZoom(mapRef.current.getZoom().toFixed(2));
    });

    // Create the user's location marker on the map
    const el = document.createElement("div");
    el.className = "custom-ticker";
    el.innerHTML = `<div class="pulse"></div>`;

    tickerRef.current = new mapboxgl.Marker({ element: el, draggable: true })
      .setLngLat([lng, lat]) // Initial marker position using default coordinates
      .addTo(mapRef.current);

    tickerRef.current.on("dragend", () => {
      const lngLat = tickerRef.current.getLngLat();
      setLng(lngLat.lng.toFixed(4));
      setLat(lngLat.lat.toFixed(4));
    });

    // Add NGO markers
    ngos.forEach((ngo) => {
      const ngoMarker = new mapboxgl.Marker({ color: "#FF5733" }) // Orange color for NGO markers
        .setLngLat([ngo.lng, ngo.lat])
        .setPopup(new mapboxgl.Popup().setHTML(`<h3>${ngo.name}</h3>`))
        .addTo(mapRef.current);
    });

    // Add underserved regions as circles
    underservedRegions.forEach((region) => {
      mapRef.current.on("load", () => {
        mapRef.current.addLayer({
          id: `underserved-region-${region.id}`,
          type: "circle",
          source: {
            type: "geojson",
            data: {
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: [region.lng, region.lat],
              },
              properties: {},
            },
          },
          paint: {
            "circle-radius": {
              stops: [
                [0, 0],
                [20, region.radius],
              ],
              base: 2,
            },
            "circle-color": "#FF00FF",
            "circle-opacity": 0.3,
          },
        });
      });
    });

    return () => {
      mapRef.current?.remove(); // Clean up the map on unmount
    };
  }, []);

  useEffect(() => {
    if (url) {
      fetchLocation();
    }
  }, [url]);

  const fetchLocation = async () => {
    if (!url?.trim()) {
      console.warn("URL is empty. Not fetching location.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("url", url);

      const apiUrl = `${process.env.NEXT_PUBLIC_AI_SERVER_URL}/extract_coordinates`;

      const response = await fetch(apiUrl, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        console.error(
          "API response not OK:",
          response.status,
          response.statusText
        );
        try {
          const errorData = await response.json();
          console.error("Error details:", errorData); // Log error response
        } catch (jsonError) {
          console.error("Failed to parse error response:", jsonError);
        }
        throw new Error(
          `Failed to fetch coordinates. Status: ${response.status}`
        );
      }

      const data = await response.json();

      if (data && data.longitude !== undefined && data.latitude !== undefined) {
        const newLng = data.longitude;
        const newLat = data.latitude;

        setLng(newLng);
        setLat(newLat);

        mapRef.current.flyTo({
          center: [newLng, newLat],
          zoom: 18,
          essential: true,
          duration: 10000,
          easing: (t) => t * (2 - t),
        });

        if (tickerRef.current) {
          tickerRef.current.setLngLat([newLng, newLat]);
        }
      } else {
        console.warn("Invalid coordinates received from API:", data);
      }
    } catch (error) {
      console.error("Error fetching location:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateTickerLocation = (newLng, newLat) => {
    if (tickerRef.current) {
      tickerRef.current.setLngLat([newLng, newLat]);
    }
  };

  useEffect(() => {
    if (mapRef.current) {
      updateTickerLocation(lng, lat);
    }
  }, [lng, lat]);

  return (
    <div className="relative h-screen w-full overflow-hidden">
      <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-lg rounded-lg p-4 shadow-lg">
        <div className="flex items-center gap-2 mb-3">
          <MapPin className="w-5 h-5 text-blue-500" />
          <h3 className="text-lg font-semibold text-gray-800">User Location</h3>
        </div>
        <p className="text-sm font-medium text-gray-700">
          Longitude: <span className="font-semibold">{lng}</span>
        </p>
        <p className="text-sm font-medium text-gray-700">
          Latitude: <span className="font-semibold">{lat}</span>
        </p>
        <p className="text-sm font-medium text-gray-700">
          Zoom: <span className="font-semibold">{zoom}</span>
        </p>
        {loading ? (
          <div className="flex items-center justify-center mt-2">
            <Loader2 className="animate-spin text-gray-600 mr-2" />
            <span className="text-sm text-gray-600">Fetching location...</span>
          </div>
        ) : (
          <button
            onClick={fetchLocation}
            className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200 flex items-center gap-2"
          >
            <MapPin className="w-4 h-4" />
            Update Location
          </button>
        )}
      </div>
      <div
        ref={mapContainerRef}
        className="absolute top-0 left-0 w-full h-full"
      />
    </div>
  );
};

export default Map;
