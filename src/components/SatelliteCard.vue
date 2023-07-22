<template>
  <div class="satellite-card">
    <h3>{{ data.name }}</h3>
    <p><strong>NORAD CAT ID:</strong> {{ data.noradCatId }}</p>
    <p><strong>International Designator:</strong> {{ data.intlDes }}</p>
    <p><strong>Launch Date:</strong> {{ data.launchDate }}</p>
    <p><strong>Decay Date:</strong> {{ data.decayDate ? data.decayDate : "N/A" }}</p>
    <p><strong>Object Type:</strong> {{ data.objectType }}</p>
    <p><strong>Orbit Code:</strong> {{ data.orbitCode ? data.orbitCode : "N/A" }}</p>
    <p><strong>Country Code:</strong> {{ data.countryCode }}</p>
    <!-- Add other satellite information as needed -->
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style lang="scss">
@import "./SatelliteCard.scss";
/* The rest of the style section is now in the SatelliteCard.scss file */
</style>