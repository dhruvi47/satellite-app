<template>
  <div>
    <h1>Satellite Data Viewer</h1>
    <div v-if="loading" class="loading-indicator">
      <img src="@/assets/loading.gif" alt="Loading..." />
    </div>
    <div v-else>
      <div class="filter-section">
        <label>Country Code:</label>
        <select v-model="filters.countryCode">
          <option value="">All</option>
          <option v-for="country in getCountries" :key="country" :value="country">{{ country }}</option>
        </select>

        <label>Orbit Regime:</label>
        <select v-model="filters.orbitRegime">
          <option value="">All</option>
          <option v-for="orbit in getOrbitRegimes" :key="orbit" :value="orbit">{{ orbit }}</option>
        </select>

        <label>Object Type:</label>
        <select v-model="filters.objectType">
          <option value="">All</option>
          <option v-for="type in getObjectTypes" :key="type" :value="type">{{ type }}</option>
        </select>
      </div>

      <div class="search-section">
        <input type="text" v-model="searchQuery" placeholder="Search by NORAD CAT ID or Satellite Name" />
      </div>

      <div v-if="filteredSatellites.length > 0">
        <div class="satellite-list">
          <satellite-card v-for="satellite in paginatedSatellites" :key="satellite.noradCatId" :data="satellite" />
        </div>
        <div class="pagination">
          <button :disabled="currentPage === 1" @click="prevPage">Previous</button>
          <span>Page {{ currentPage }}</span>
          <button :disabled="currentPage === totalPages" @click="nextPage">Next</button>
        </div>
      </div>
      <div v-else>
        <p>No satellites found with the selected filters.</p>
      </div>
    </div>
  </div>
</template>
<script>
import { ref, computed, watch } from "vue";
import SatelliteCard from "@/components/SatelliteCard";

export default {
  components: {
    SatelliteCard,
  },
  setup() {
    const loading = ref(true);
    const satellites = ref([]);
    const filters = ref({
      countryCode: "",
      orbitRegime: "",
      objectType: "",
    });
    const searchQuery = ref('');
    const perPage = ref(10);
    const currentPage = ref(1);

    const fetchSatellitesData = async () => {
      try {
        const response = await fetch("/satellites.json");
        if (!response.ok) {
          throw new Error("Network response was not ok.");
        }
        satellites.value = await response.json();
        loading.value = false;
      } catch (error) {
        console.error("Error fetching satellite data:", error);
      }
    };

    const getCountries = computed(() => {
      // Get unique country codes from satellites
      return [...new Set(satellites.value.map((satellite) => satellite.countryCode))];
    });

    const getOrbitRegimes = computed(() => {
      // Get unique orbit regimes from satellites
      return [...new Set(satellites.value.map((satellite) => satellite.orbitCode))];
    });

    const getObjectTypes = computed(() => {
      // Get unique object types from satellites
      return [...new Set(satellites.value.map((satellite) => satellite.objectType))];
    });

    watch(searchQuery, (newValue, oldValue) => {
      if (newValue !== oldValue) {
        currentPage.value = 1; // Reset current page to the first page when searchQuery changes
      }
    });

    const isSearchMatch = (satellite, searchQuery) => {
      if (!searchQuery) return true; // Return true if searchQuery is null or empty

      const catIdMatch = satellite.noradCatId
        .toString()
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const nameMatch = satellite.name.toLowerCase().includes(searchQuery.toLowerCase());

      return catIdMatch || nameMatch;
    };


    
    const filteredSatellites = computed(() => {
      return satellites.value.filter((satellite) => {
        const countryCodeMatch =
          !filters.value.countryCode || satellite.countryCode === filters.value.countryCode;
        const orbitRegimeMatch =
          !filters.value.orbitRegime || satellite.orbitCode === filters.value.orbitRegime;
        const objectTypeMatch =
          !filters.value.objectType || satellite.objectType === filters.value.objectType;
        const searchMatch = searchQuery.value
          ? isSearchMatch(satellite, searchQuery.value)
          : true;

        return countryCodeMatch && orbitRegimeMatch && objectTypeMatch && searchMatch;
      });
    });

    const paginatedSatellites = computed(() => {
      const startIndex = (currentPage.value - 1) * perPage.value;
      const endIndex = startIndex + perPage.value;
      return filteredSatellites.value.slice(startIndex, endIndex);
    });

    const totalPages = computed(() => {
      return Math.ceil(filteredSatellites.value.length / perPage.value);
    });

    const prevPage = () => {
      if (currentPage.value > 1) {
        currentPage.value--;
      }
    };

    const nextPage = () => {
      if (currentPage.value < totalPages.value) {
        currentPage.value++;
      }
    };

    fetchSatellitesData();

    return {
      loading,
      satellites,
      filters,
      searchQuery,
      perPage,
      currentPage,
      getCountries: getCountries.value, // Expose the getCountries computed property
      getOrbitRegimes: getOrbitRegimes.value, // Expose the getOrbitRegimes computed property
      getObjectTypes: getObjectTypes.value, // Expose the getObjectTypes computed property
      filteredSatellites,
      paginatedSatellites,
      totalPages,
      prevPage,
      nextPage,
    };
  },
};
</script>

<style lang="scss">
@import "./App.scss";
/* The rest of the style section is now in the App.scss file */
</style>