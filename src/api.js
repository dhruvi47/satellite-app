// api.js
export async function fetchSatelliteData() {
    try {
      const response = await fetch("/public/satellites.json");
      if (!response.ok) {
        throw new Error("Network response was not ok.");
      }
      return await response.json();
    } catch (error) {
      throw new Error("Error fetching satellite data:", error);
    }
  }
  