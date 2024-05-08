<template>
  <div class="container mx-auto px-4">
    <div class="flex flex-wrap -mx-4">
      <div class="w-full lg:w-1/4 px-4 mb-4 lg:mb-0">
        <FilterPanel />
      </div>
      <div class="w-full lg:w-3/4 px-4">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <ProductCard v-for="product in products" :key="product.id" :product="product" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import FilterPanel from '@/components/FilterPanel.vue';
import ProductCard from '@/components/ProductCard.vue';

const products = ref([
  // Données des produits simulées
  { id: 1, name: 'Nissan Qashqai', imageUrl: 'https://cdn.drivek.com/configurator-imgs/cars/fr/Original/NISSAN/QASHQAI/40414_CROSSOVER-5-DOORS/nissan-qashqai-2021-side-front.jpg', price: '30,400 €' },
  {id: 2, name: 'Peugeot 2008', imageUrl: 'https://cdn.drivek.it/configurator-imgs/cars/fr/800/PEUGEOT/2008/40414_CROSSOVER-5-DOORS/peugeot-2008-2021-side-front.jpg', price: '25,000 €' },
  {id: 3, name: 'Renault Captur', imageUrl: 'https://cdn.drivek.it/configurator-imgs/cars/fr/800/RENAULT/CAPTUR/40414_CROSSOVER-5-DOORS/renault-captur-2021-side-front.jpg', price: '22,000 €' },
  {id: 4, name: 'Citroën C3 Aircross', imageUrl: 'https://cdn.drivek.it/configurator-imgs/cars/fr/800/CITROEN/C3-AIRCROSS/40414_CROSSOVER-5-DOORS/citroen-c3-aircross-2021-side-front.jpg', price: '20,000 €' },
  {id: 5, name: 'Ford Puma', imageUrl: 'https://cdn.drivek.it/configurator-imgs/cars/fr/800/FORD/PUMA/40414_CROSSOVER-5-DOORS/ford-puma-2021-side-front.jpg', price: '23,000 €' },
  {id: 6, name: 'Opel Crossland', imageUrl: 'https://cdn.drivek.it/configurator-imgs/cars/fr/800/OPEL/CROSSLAND/40414_CROSSOVER-5-DOORS/opel-crossland-2021-side-front.jpg', price: '21,000 €' },
  {id: 7, name: 'Toyota Yaris Cross', imageUrl: 'https://cdn.drivek.it/configurator-imgs/cars/fr/800/TOYOTA/YARIS-CROSS/40414_CROSSOVER-5-DOORS/toyota-yaris-cross-2021-side-front.jpg', price: '24,000 €' },
  {id: 8, name: 'Kia Stonic', imageUrl: 'https://cdn.drivek.it/configurator-imgs/cars/fr/800/KIA/STONIC/40414_CROSSOVER-5-DOORS/kia-stonic-2021-side-front.jpg', price: '19,000 €' },
  {id: 9, name: 'Hyundai Kona', imageUrl: 'https://cdn.drivek.it/configurator-imgs/cars/fr/800/HYUNDAI/KONA/40414_CROSSOVER-5-DOORS/hyundai-kona-2021-side-front.jpg', price: '22,000 €' },
  {id: 10, name: 'Dacia Sandero Stepway', imageUrl: 'https://cdn.drivek.it/configurator-imgs/cars/fr/800/DACIA/SANDERO-STEPWAY/40414_CROSSOVER-5-DOORS/dacia-sandero-stepway-2021-side-front.jpg', price: '15,000 €' },
  {id: 11, name: 'Skoda Kamiq', imageUrl: 'https://cdn.drivek.it/configurator-imgs/cars/fr/800/SKODA/KAMIQ/40414_CROSSOVER-5-DOORS/skoda-kamiq-2021-side-front.jpg', price: '23,000 €' },
]);

</script>
