// utils.js

// Filter satellites based on selected filters and search query
export function filterSatellites(satellites, filters, searchQuery) {
    return satellites.filter((satellite) => {
      const countryCodeMatch =
        !filters.countryCode || satellite.countryCode === filters.countryCode;
      const orbitRegimeMatch =
        !filters.orbitRegime || satellite.orbitCode === filters.orbitRegime;
      const objectTypeMatch =
        !filters.objectType || satellite.objectType === filters.objectType;
      const searchMatch = !searchQuery || isSearchMatch(satellite, searchQuery);
  
      return countryCodeMatch && orbitRegimeMatch && objectTypeMatch && searchMatch;
    });
  }
  
  // Check if a satellite matches the search query
  function isSearchMatch(satellite, searchQuery) {
    const catIdMatch =
      satellite.noradCatId.toLowerCase().includes(searchQuery.toLowerCase());
    const nameMatch = satellite.name.toLowerCase().includes(searchQuery.toLowerCase());
  
    return catIdMatch || nameMatch;
  }
  
  // Paginate an array of satellites
  export function paginate(array, page, perPage) {
    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    return array.slice(startIndex, endIndex);
  }
      