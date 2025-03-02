import requests
import re
from urllib.parse import urlparse, parse_qs
from typing import Dict, Tuple, Union

async def extract_coordinates_from_maps_url(url: str) -> Dict[str, float]:
    """Extract latitude and longitude from a Google Maps URL (both short and full URLs)."""

    def resolve_short_url(short_url: str) -> str:
        """Resolve a shortened URL to its full form."""
        try:
            session = requests.Session()
            response = session.head(short_url, allow_redirects=True, timeout=5)  # Added timeout
            response.raise_for_status()  # Raise HTTPError for bad responses (4xx or 5xx)
            return response.url
        except requests.RequestException as e:
            raise ValueError(f"Error resolving shortened URL: {e}")

    def extract_from_full_url(full_url: str) -> Tuple[float, float]:
        """Extract coordinates from a full Google Maps URL."""
        try:
            # Try to find coordinates in the URL path
            # Pattern for both @ format and data coordinates
            coord_patterns = [
                r'@(-?\d+\.\d+),(-?\d+\.\d+)',  # Matches @lat,lng
                r'!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)',  # Matches !3d{lat}!4d{lng}
                r'%2F(-?\d+\.\d+)%2C(-?\d+\.\d+)'  # Matches encoded /lat,lng
            ]

            for pattern in coord_patterns:
                matches = re.search(pattern, full_url)
                if matches:
                    lat, lng = matches.groups()
                    return float(lat), float(lng)

            # If no coordinates found in patterns, try parsing query parameters
            parsed_url = urlparse(full_url)
            query_params = parse_qs(parsed_url.query)

            # Look for coordinates in known query parameter formats
            if 'll' in query_params:
                lat, lng = query_params['ll'][0].split(',')
                return float(lat), float(lng)

            raise ValueError("Could not find coordinates in the URL")  # Changed Exception to ValueError

        except Exception as e:
            raise ValueError(f"Error extracting coordinates: {e}")  # Changed Exception to ValueError

    try:
        if 'goo.gl' in url or 'maps.app.goo.gl' in url:
            full_url = resolve_short_url(url)
        else:
            full_url = url

        latitude, longitude = extract_from_full_url(full_url)

        return {
            "latitude": latitude,
            "longitude": longitude
        }

    except Exception as e:
        raise ValueError(f"Failed to process URL: {e}")  # Changed Exception to ValueError