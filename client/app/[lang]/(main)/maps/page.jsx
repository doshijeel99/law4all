"use client";

import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import { Filter, Loader2, MapPin, Search, X } from "lucide-react";

// Mapbox CSS (required for markers and controls)
import "mapbox-gl/dist/mapbox-gl.css";

const Map = () => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const tickerRef = useRef(null);
  const markersRef = useRef([]);

  const [zoom, setZoom] = useState(18);
  const [lng, setLng] = useState(72.837296); // Default longitude
  const [lat, setLat] = useState(19.107093); // Default latitude
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);

  console.log(lng, lat);

  console.log(JSON.parse(localStorage.getItem("user")));

  const url = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))?.address?.googleMapLink
    : "";

  // Mock Legal Clinics Data (replace with actual data from an API)
  const legalClinics = [
    {
      id: 1,
      name: "Justice League Law Firm",
      lng: 72.9718,
      lat: 19.1971,
      services: ["Criminal Defense", "Civil Rights", "Family Law"],
    },
    {
      id: 2,
      name: "Legal Aid Society",
      lng: 72.973,
      lat: 19.198,
      services: ["Immigration Law", "Employment Law", "Tenant Rights"],
    },
    {
      id: 3,
      name: "Innocence Project",
      lng: 72.9765,
      lat: 19.1955,
      services: ["Criminal Appeals", "Wrongful Convictions"],
    },
    {
      id: 4,
      name: "Family First Law Center",
      lng: 72.97,
      lat: 19.2,
      services: ["Divorce", "Child Custody", "Domestic Violence"],
    },
    {
      id: 5,
      name: "Hope Legal Services",
      lng: 72.974,
      lat: 19.1995,
      services: ["Consumer Rights", "Contract Disputes", "Real Estate Law"],
    },
    {
      id: 6,
      name: "Green Justice",
      lng: 72.968,
      lat: 19.1968,
      services: ["Environmental Law", "Land Disputes"],
    },
    {
      id: 7,
      name: "Equal Rights Advocates",
      lng: 72.975,
      lat: 19.1945,
      services: ["Gender Equality", "Workplace Discrimination"],
    },
    {
      id: 8,
      name: "Women's Legal Aid",
      lng: 72.9775,
      lat: 19.1985,
      services: ["Sexual Harassment", "Domestic Violence", "Family Law"],
    },
    {
      id: 9,
      name: "Future Justice",
      lng: 72.979,
      lat: 19.2005,
      services: ["Juvenile Law", "Education Law"],
    },
    {
      id: 10,
      name: "Defenders of Law",
      lng: 72.965,
      lat: 19.1925,
      services: ["Criminal Defense", "Civil Rights", "Employment Law"],
    },
    {
      id: 11,
      name: "Water Rights Legal Aid",
      lng: 72.9615,
      lat: 19.191,
      services: ["Water Law", "Environmental Law", "Public Policy"],
    },
    {
      id: 12,
      name: "Rise and Defend",
      lng: 72.9665,
      lat: 19.202,
      services: ["Human Rights", "Asylum Cases", "Civil Liberties"],
    },
    {
      id: 13,
      name: "Law for Education",
      lng: 72.978,
      lat: 19.1935,
      services: ["Student Rights", "University Policies", "Disability Rights"],
    },
    {
      id: 14,
      name: "Child Protection Law Center",
      lng: 72.9805,
      lat: 19.199,
      services: ["Child Welfare", "Adoption", "Foster Care Rights"],
    },
    {
      id: 15,
      name: "Health Rights Advocates",
      lng: 72.9635,
      lat: 19.195,
      services: ["Medical Malpractice", "Patient Rights", "Insurance Disputes"],
    },
    {
      id: 16,
      name: "Save the Innocent",
      lng: 72.9705,
      lat: 19.2065,
      services: ["Wrongful Convictions", "Criminal Appeals"],
    },
    {
      id: 17,
      name: "Dream Legal Solutions",
      lng: 72.96,
      lat: 19.2045,
      services: ["Business Law", "Startup Legalities", "Intellectual Property"],
    },
    {
      id: 18,
      name: "Youth Defense Lawyers",
      lng: 72.966,
      lat: 19.188,
      services: ["Juvenile Defense", "Youth Criminal Law"],
    },
    {
      id: 19,
      name: "New Horizons Legal Center",
      lng: 72.9825,
      lat: 19.1955,
      services: ["Immigration Law", "Refugee Rights"],
    },
    {
      id: 20,
      name: "Better Tomorrow Law Firm",
      lng: 72.9735,
      lat: 19.1915,
      services: ["Bankruptcy", "Debt Settlement", "Financial Law"],
    },
  ];

  // Extract all unique services for the dropdown
  const allServices = Array.from(
    new Set(legalClinics.flatMap((clinic) => clinic.services))
  ).sort();

  // Mock underserved regions (replace with actual data)
  const underservedRegions = [
    { id: 1, lng: 72.975, lat: 19.198, radius: 500 }, // Radius in meters
    { id: 2, lng: 72.97, lat: 19.19, radius: 300 },
  ];

  // Filter clinics based on search term and selected service
  const filteredClinics = legalClinics.filter((clinic) => {
    const matchesSearch = clinic.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesService = selectedService
      ? clinic.services.includes(selectedService)
      : true;
    return matchesSearch && matchesService;
  });

  // Function to render clinic markers
  const renderClinicMarkers = () => {
    // Remove existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Add new markers for filtered clinics
    filteredClinics.forEach((clinic) => {
      const el = document.createElement("div");
      el.className = "marker";
      el.style.width = "25px";
      el.style.height = "25px";
      el.style.backgroundColor = "#FF5733";
      el.style.borderRadius = "50%";
      el.style.cursor = "pointer";
      el.style.border = "2px solid white";

      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
        <div style="padding: 10px;">
          <h3 style="font-weight: bold; margin-bottom: 5px;">${clinic.name}</h3>
          <p style="font-size: 14px; margin-bottom: 5px;"><strong>Services:</strong></p>
          <ul style="font-size: 13px; margin-top: 0; padding-left: 15px;">
            ${clinic.services.map((service) => `<li>${service}</li>`).join("")}
          </ul>
        </div>
      `);

      const marker = new mapboxgl.Marker(el)
        .setLngLat([clinic.lng, clinic.lat])
        .setPopup(popup)
        .addTo(mapRef.current);

      markersRef.current.push(marker);
    });
  };

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

    // Initial rendering of clinic markers
    mapRef.current.on("load", () => {
      renderClinicMarkers();
    });

    return () => {
      mapRef.current?.remove(); // Clean up the map on unmount
    };
  }, []);

  // Re-render markers when filters change
  useEffect(() => {
    if (mapRef.current && mapRef.current.loaded()) {
      renderClinicMarkers();
    }
  }, [searchTerm, selectedService]);

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

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedService("");
  };

  useEffect(() => {
    if (mapRef.current) {
      updateTickerLocation(lng, lat);
    }
  }, [lng, lat]);

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* User Location Info */}
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

      {/* Clinic Search Filter */}
      <div className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur-lg rounded-lg p-4 shadow-lg max-w-sm w-full">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Search className="w-5 h-5 text-blue-500" />
            <h3 className="text-lg font-semibold text-gray-800">
              Find Legal Aid
            </h3>
          </div>
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className="text-gray-600 hover:text-blue-500 transition"
          >
            <Filter className="w-5 h-5" />
          </button>
        </div>

        <div className="relative mb-3">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search clinics by name..."
            className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {filtersOpen && (
          <div className="mb-3 animate-fadeIn">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filter by service:
            </label>
            <div className="relative">
              <select
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Services</option>
                {allServices.map((service) => (
                  <option key={service} value={service}>
                    {service}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {filteredClinics.length} clinic
            {filteredClinics.length !== 1 ? "s" : ""} found
          </div>
          {(searchTerm || selectedService) && (
            <button
              onClick={resetFilters}
              className="text-sm text-blue-500 hover:text-blue-700 flex items-center gap-1"
            >
              <X className="w-3 h-3" />
              Reset filters
            </button>
          )}
        </div>

        {filteredClinics.length > 0 && (
          <div className="mt-3 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {filteredClinics.map((clinic) => (
              <div
                key={clinic.id}
                className="p-2 hover:bg-gray-100 rounded cursor-pointer transition"
                onClick={() => {
                  mapRef.current.flyTo({
                    center: [clinic.lng, clinic.lat],
                    zoom: 18,
                    essential: true,
                    duration: 1000,
                  });
                }}
              >
                <h4 className="font-medium text-gray-800">{clinic.name}</h4>
                <div className="text-xs text-gray-500 mt-1">
                  {clinic.services.join(", ")}
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredClinics.length === 0 && (
          <div className="mt-3 py-4 text-center text-gray-500">
            No clinics match your search criteria
          </div>
        )}
      </div>

      <div
        ref={mapContainerRef}
        className="absolute top-0 left-0 w-full h-full"
      />

      {/* CSS for the pulse effect */}
      <style jsx global>{`
        .custom-ticker {
          width: 20px;
          height: 20px;
          position: relative;
        }

        .pulse {
          background: rgba(0, 120, 255, 0.7);
          border-radius: 50%;
          height: 14px;
          width: 14px;
          position: absolute;
          top: 3px;
          left: 3px;
          transform: scale(1);
          transform-origin: center;
          box-shadow: 0 0 0 0 rgba(0, 120, 255, 0.7);
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% {
            transform: scale(0.95);
            box-shadow: 0 0 0 0 rgba(0, 120, 255, 0.7);
          }

          70% {
            transform: scale(1);
            box-shadow: 0 0 0 10px rgba(0, 120, 255, 0);
          }

          100% {
            transform: scale(0.95);
            box-shadow: 0 0 0 0 rgba(0, 120, 255, 0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in-out;
        }

        /* Scrollbar styling */
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }

        .scrollbar-thumb-gray-300::-webkit-scrollbar-thumb {
          background-color: #d1d5db;
          border-radius: 3px;
        }

        .scrollbar-track-gray-100::-webkit-scrollbar-track {
          background-color: #f3f4f6;
        }
      `}</style>
    </div>
  );
};

export default Map;
