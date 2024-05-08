<template>
  <div>
    <div v-if="error">{{ error }}</div>
    <div v-else>
      <div class="container mx-auto px-4 py-4">
        <div class="flex flex-wrap -mx-4">
          <div class="w-full lg:w-1/4 px-4 mb-4 lg:mb-0">
            <FilterPanel @updateFilters="updateAndFetchFilters" />
          </div>
          <div class="w-full lg:w-3/4 px-4">
            <div class="flex justify-between items-center p-5">
              <div class="flex items-center">
                <h1 class="text-xs font-bold text-custom-blue">{{ displayedProductCount }} résultats</h1>
                <h1 class="text-xs text-custom-blue font-medium ml-1">correspondent à votre recherche</h1>
              </div>
              <div class="flex items-center">
                <span class="text-sm text-gray-800">Trier par</span>
                <select v-model="sortOrder" @change="sortProducts" class="ml-2 border rounded-md px-2 py-1 bg-custom-bg">
                  <option value="none">Pertinence</option>
                  <option value="asc">Price: Low to High</option>
                  <option value="desc">Price: High to Low</option>
                </select>
              </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              <template v-for="(product, index) in paginatedProducts" :key="product.id">
                <ProductCard v-if="index % n !== (n - 1)" :product="product" :filters="filters" class="product-card" />
                <div v-else-if="index !== paginatedProducts.length - 0" class="ad-block">
                  <div class="ad-card">
                    <a href="/" class="ad-link-block">
                      <div class="flex flex-col ad-overlay">
                        <h2 class="ad-title">Vous ne trouvez pas votre bonheur? Nous faisons la recherche pour vous</h2>
                        <button class="discover-button"> &rarr; Découvrir</button>
                      </div>
                    </a>
                  </div>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="pagination flex justify-center space-x-4 my-4">
      <button
          @click="goToPage(page - 1)"
          :disabled="page === 1"
          class="px-4 py-2 text-sm font-semibold text-white bg-deep-blue hover:bg-deep-blue disabled:bg-gray-1 rounded-md transition-colors">
        Précédent
      </button>
      <span class="py-2 text-sm font-medium">
        Page {{ page }} sur {{ totalPages }}
      </span>
      <button
          @click="goToPage(page + 1)"
          :disabled="page === totalPages"
          class="px-4 py-2 text-sm font-semibold text-white bg-deep-blue hover:bg-deep-blue disabled:bg-gray-1 rounded-md transition-colors">
        Suivant
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive, watch } from 'vue';
import axios from 'axios';
import FilterPanel from './components/FilterPanel.vue';
import ProductCard from './components/ProductCard.vue';

const n = ref(6);
const products = ref([]);
const error = ref('');
const originalProducts = ref([]);
const loading = ref(false);
const filters = reactive({
  searchQuery: '',
  brand: [],
  year: null,
  energy: null,
  priceMin: 100,
  priceMax: 32000,
  monthly: false,
  brands: [],
  vehicleTypes: [],
  energies: []
});
const sortOrder = ref('none');

const sortProducts = () => {
  if (sortOrder.value === 'asc') {
    products.value.sort((a, b) => a.price - b.price);
  } else if (sortOrder.value === 'desc') {
    products.value.sort((a, b) => b.price - a.price);
  } else {
    products.value = [...originalProducts.value];
  }
};

const page = ref(1);
const pageSize = 14;
const totalPages = computed(() => Math.ceil(products.value.length / pageSize)); // Total number of pages based on the pageSize
const paginatedProducts = computed(() => {
  const startIndex = (page.value - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, products.value.length);
  return products.value.slice(startIndex, endIndex);
});
const displayedProductCount = computed(() => filteredProducts.value.length);

const filteredProducts = computed(() => {
  return products.value.filter(product => {
    return (!filters.brands.length || filters.brands.includes(product.brand)) &&
        (!filters.vehicleTypes.length || filters.vehicleTypes.includes(product.model)) &&
        (!filters.energies.length || filters.energies.includes(product.energy)) &&
        product.price >= filters.priceMin && product.price <= filters.priceMax;
  });
});



const goToPage = (pageNumber) => {
  if (pageNumber >= 1 && pageNumber <= totalPages.value) {
    page.value = pageNumber;
  }
};




function updateAndFetchFilters(newFilters) {
  Object.assign(filters, newFilters);
  fetchFilteredProducts();
}

const fetchFilteredProducts = async () => {
  loading.value = true;
  error.value = '';
  try {
    const response = await axios.get('http://sae401.mmi-troyes.fr:8313/api/vehicles', {
      params: { ...filters }
    });
    console.log('Fetched products:', response.data);
    products.value = response.data;
    originalProducts.value = [...response.data];
  } catch (err) {
    error.value = `Erreur lors du chargement des produits filtrés: ${err.message}`;
    console.error('Error fetching products:', err);
  } finally {
    loading.value = false;
  }
}

onMounted(fetchFilteredProducts);
watch(filters, fetchFilteredProducts, { deep: true });
watch(sortOrder, sortProducts);
</script>


<style scoped>
.product-card {
  transition: transform 0.3s ease-out;
}

.product-card:hover {
  transform: scale(1.05);
}
.ad-card {
  transition: transform 0.3s ease-out;
  position: relative;
  border-radius: 10px;
  overflow: hidden;
  height: 335px;
  width: 282.67px;
  background-image: url("assets/img/ad.jpg");
  background-size: cover;
  background-position: center;
}

.ad-card:hover {
  transform: scale(1.05);
}

.ad-card .ad-link-block {
  display: block;
  height: 100%;
  width: 100%;
  text-decoration: none;
  color: inherit;
}

.ad-card .ad-overlay {
  position: absolute;
  bottom: 20px;
  left: 0;
  right: 0;
  text-align: center;
  padding: 20px;
}

.ad-card .ad-title {
  color: #ffffff;
  margin-bottom: 10px;
}

.ad-card {
  font-size: 16px;
  color: #ffffff;
}

.ad-card .discover-button {
  font-size: 16px;
  color: #ffffff;
  padding: 10px 20px;
  border-radius: 20px;
  border: white 1px solid;
  cursor: pointer;
  margin-top: 15px;
  transition: background-color 0.3s;
}
</style>