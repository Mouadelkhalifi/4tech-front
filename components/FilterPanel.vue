<template>
  <div class="max-w-lg mx-auto bg-white p-6 rounded-lg">
    <h2 class="font-inter text-lg text-deepblue font-bold mb-4">FILTRER MA RECHERCHE</h2>
    <div v-show="showFilters" class="space-y-4 pb-7">
      <div v-for="(filter, index) in filterSettings" :key="index"
           :class="[filters[filter.model] ? 'bg-deep-blue opacity-100' : 'bg-deep-blue opacity-65', 'flex items-center p-2 rounded-md']">
        <label class="flex-1 text-sm font-medium text-white">
          {{ filter.label }}
        </label>
        <input :type="filter.type" v-model="filters[filter.model]" :class="filter.class">
      </div>
      <div class="p-2 bg-white rounded-md">
        <label class="block text-sm font-medium text-gray-700">Budget</label>
        <div class="flex justify-center my-2">
          <button :class="['w-1/2 py-2 rounded-l-lg', !monthly ? 'bg-white text-deep-blue' : 'bg-deep-blue text-white']"
                  @click="updateFilters(true)">Mensuel</button>
          <button :class="['w-1/2 py-2 rounded-r-lg', monthly ? 'bg-white text-deep-blue' : 'bg-deep-blue text-white']"
                  @click="updateFilters(false)">Total</button>
        </div>
      </div>
      <div v-if="monthly" class="budget-section mt-4 mb-6">
        <div class="slider-container mt-2 relative" :style="sliderStyle">
          <input type="range" id="minSlider" v-model="minMonthlyBudget" @input="updateSliderStyle" min="100" max="3200" class="slider">
          <span :style="{ left: calculateLabelPosition(minMonthlyBudget, 100, 3200) + '%' }" class="slider-label">{{ minMonthlyBudget }} €</span>
          <input type="range" id="maxSlider" v-model="maxMonthlyBudget" @input="updateSliderStyle" min="100" max="3200" class="slider">
          <span :style="{ left: calculateLabelPosition(maxMonthlyBudget, 100, 3200) + '%' }" class="slider-label">{{ maxMonthlyBudget }} €</span>
        </div>
      </div>
      <div v-else class="budget-section mt-4 mb-6">
        <div class="slider-container mt-2 relative" :style="totalSliderStyle">
          <input type="range" id="minTotalSlider" v-model="minTotalBudget" @input="updateSliderStyle" min="10000" max="32000" class="slider">
          <span :style="{ left: calculateLabelPosition(minTotalBudget, 10000, 32000) + '%' }" class="slider-label">{{ minTotalBudget }} €</span>
          <input type="range" id="maxTotalSlider" v-model="maxTotalBudget" @input="updateSliderStyle" min="10000" max="32000" class="slider">
          <span :style="{ left: calculateLabelPosition(maxTotalBudget, 10000, 32000) + '%' }" class="slider-label">{{ maxTotalBudget }} €</span>
        </div>
      </div>
    </div>

    <hr class="custom-hr"/>

    <div class="mt-4">
      <button @click="toggleBrandFilters" class="toggle-button flex items-center justify-between w-full p-2 rounded-md">
        <span class="font-medium text-gray-700">Marque</span>
        <ChevronIcon :class="{'rotate-180': showBrandFilters}" />
      </button>
      <transition name="fade">
        <div v-show="showBrandFilters" class="vehicle-options mt-2">
          <div class="flex flex-col p-2 rounded-md">
            <div v-for="brand in brands" :key="brand" class="checkbox-option">
              <input type="checkbox" :id="'brand-' + brand" v-model="filters.brands" :value="brand" class="hidden-checkbox">
              <label :for="'brand-' + brand" class="label">{{ brand }}</label>
            </div>
          </div>
        </div>
      </transition>
    </div>
    <hr class="custom-hr"/>

    <div>
      <button @click="toggleVehicleTypeFilters" class="toggle-button flex items-center justify-between w-full p-2 rounded-md">
        <span class="font-medium text-gray-700">Type de véhicule</span>
        <ChevronIcon :class="{'rotate-180': showVehicleTypeFilters}" />
      </button>
      <transition name="fade">
        <div v-show="showVehicleTypeFilters" class="vehicle-options mt-2">
          <div class="flex flex-col p-2 rounded-md">
            <div v-for="vehicleType in vehicleTypes" :key="vehicleType" class="checkbox-option">
              <input type="checkbox" :id="'vehicleType-' + vehicleType" v-model="filters.vehicleTypes" :value="vehicleType" class="hidden-checkbox">
              <label :for="'vehicleType-' + vehicleType" class="label">{{ vehicleType }}</label>
            </div>
          </div>
        </div>
      </transition>
    </div>


    <hr class="custom-hr"/>

    <div>
      <button @click="toggleEnergyFilters" class="toggle-button flex items-center justify-between w-full p-2 rounded-md">
        <span class="font-medium text-gray-700">Energie</span>
        <ChevronIcon :class="{'rotate-180': showEnergyFilters}" />
      </button>
      <transition name="fade">
        <div v-show="showEnergyFilters" class="vehicle-options mt-2">
          <div class="flex flex-col p-2 rounded-md">
            <div v-for="energy in energies" :key="energy" class="checkbox-option">
              <input type="checkbox" :id="'energy-' + energy" v-model="filters.energies" :value="energy" class="hidden-checkbox">
              <label :for="'energy-' + energy" class="label">{{ energy }}</label>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import {ref, reactive, computed, watch} from 'vue';
import axios from 'axios';
import ChevronIcon from '../components/ChevronIcon.vue';

const emit = defineEmits(['updateFilters']);
const monthly = ref(false);
const minMonthlyBudget = ref(100);
const maxMonthlyBudget = ref(3200);
const minTotalBudget = ref(10000);
const maxTotalBudget = ref(32000);
const brands = ref([]);
const vehicleTypes = ref([]);
const energies = ref([]);
const products = ref([]);

const fetchFilters = async () => {
  try {
    const response = await axios.get('http://sae401.mmi-troyes.fr:8313/api/vehicles');
    const vehicles = response.data;

  } catch (error) {
    console.error('Failed to fetch filters:', error);
  }
};

onMounted(fetchFilters);

onMounted(async () => {
  try {
    const response = await axios.get('http://sae401.mmi-troyes.fr:8313/api/vehicles');
    brands.value = [...new Set(response.data.map(v => v.brand))];
    vehicleTypes.value = [...new Set(response.data.map(v => v.model))];
    energies.value = [...new Set(response.data.map(v => v.energy))];
  } catch (error) {
    console.error('Failed to fetch brands:', error);
  }
});

const fetchEnergyTypes = async () => {
  try {
    const response = await axios.get('http://sae401.mmi-troyes.fr:8313/api/vehicles');
    const allEnergies = response.data.map(vehicle => vehicle.energy);
    energies.value = [...new Set(allEnergies)];
  } catch (error) {
    console.error('Failed to fetch energy types:', error);
  }
};

onMounted(fetchEnergyTypes);
const fetchVehicleTypes = async () => {
  try {
    const response = await axios.get('http://sae401.mmi-troyes.fr:8313/api/vehicles');
    const allTypes = response.data.map(vehicle => vehicle.model);
    vehicleTypes.value = [...new Set(allTypes)];
  } catch (error) {
    console.error('Failed to fetch vehicle types:', error);
  }
};

onMounted(fetchVehicleTypes);


const fetchBrands = async () => {
  try {
    const response = await axios.get('http://sae401.mmi-troyes.fr:8313/api/vehicles');
    const allBrands = response.data.map(vehicle => vehicle.brand);
    brands.value = [...new Set(allBrands)];
  } catch (error) {
    console.error('Failed to fetch brands:', error);
  }
};

onMounted(fetchBrands);

const updateFilters = (useMonthly) => {
  monthly.value = useMonthly;
  emit('updateFilters', {
    monthly: useMonthly,
    minPrice: useMonthly ? minMonthlyBudget.value : minTotalBudget.value,
    maxPrice: useMonthly ? maxMonthlyBudget.value : maxTotalBudget.value
  });
};

const calculateLabelPosition = (value, min, max) => {
  return ((value - min) / (max - min)) * 100;
};

const sliderStyle = computed(() => {
  return `background: linear-gradient(to right, #E6E6E6 0%, #E6E6E6 ${calculateLabelPosition(minMonthlyBudget.value, 100, 3200)}%, #70B4C3 ${calculateLabelPosition(minMonthlyBudget.value, 100, 3200)}%, #70B4C3 ${calculateLabelPosition(maxMonthlyBudget.value, 100, 3200)}%, #E6E6E6 ${calculateLabelPosition(maxMonthlyBudget.value, 100, 3200)}%, #E6E6E6 100%)`;
});
const totalSliderStyle = computed(() => {
  return `background: linear-gradient(to right, #E6E6E6 0%, #E6E6E6 ${calculateLabelPosition(minTotalBudget.value, 10000, 32000)}%, #70B4C3 ${calculateLabelPosition(minTotalBudget.value, 10000, 32000)}%, #70B4C3 ${calculateLabelPosition(maxTotalBudget.value, 10000, 32000)}%, #E6E6E6 ${calculateLabelPosition(maxTotalBudget.value, 10000, 32000)}%, #E6E6E6 100%)`;
});

const filterProductsByBrand = (products) => {
  if (filters.brands.length === 0) {
    return products;
  } else {
    return products.filter(product => filters.brands.includes(product.brand));
  }
};

const filterProductsByVehicleType = (products) => {
  if (filters.vehicleTypes.length === 0) {
    return products;
  } else {
    return products.filter(product => filters.vehicleTypes.includes(product.model));
  }
};

const showFilters = ref(true);
const showBrandFilters = ref(true);
const showVehicleTypeFilters = ref(true);
const showEnergyFilters = ref(true);

const filters = reactive({
  readyToGo: false,
  zeroKm: false,
  promotions: false,
  brands: [],
  vehicleTypes: [],
  energies: [],
  budget: 100,
  energy: '',
  priceToggle: false,
  vehicleType: 'Tous',
  priceMin: computed(() => monthly.value ? minMonthlyBudget.value : minTotalBudget.value),
  priceMax: computed(() => monthly.value ? maxMonthlyBudget.value : maxTotalBudget.value)
});

const filterSettings = ref([
  {label: 'Prêt à partir', type: 'checkbox', model: 'readyToGo', class: 'toggle'},
  {label: 'Zéro km', type: 'checkbox', model: 'zeroKm', class: 'toggle'},
  {label: 'Promotions', type: 'checkbox', model: 'promotions', class: 'toggle'},
]);

function toggleBrandFilters() {
  showBrandFilters.value = !showBrandFilters.value;
}

function toggleVehicleTypeFilters() {
  showVehicleTypeFilters.value = !showVehicleTypeFilters.value;
}
function toggleEnergyFilters() {
  showEnergyFilters.value = !showEnergyFilters.value;
}

const filteredProducts = computed(() => {
  let filtered = filterProductsByBrand(products.value);
  filtered = filterProductsByVehicleType(filtered);
  return products.filter(product => {
    if (filters.brand) {
      return product.brand === filters.brand;
    } else {
      return true;
    }
  });
});

watch([minMonthlyBudget, maxMonthlyBudget, minTotalBudget, maxTotalBudget, monthly, filters], () => {
  emit('updateFilters', {
    monthly: monthly.value,
    minPrice: monthly.value ? minMonthlyBudget.value : minTotalBudget.value,
    maxPrice: monthly.value ? maxMonthlyBudget.value : maxTotalBudget.value,
    brands: filters.brands,
    vehicleTypes: filters.vehicleTypes,
    energies: filters.energies
  });
}, { deep: true });

watch(filters, () => {
  emit('updateFilters', {
    ...filters,
    minPrice: monthly.value ? minMonthlyBudget.value : minTotalBudget.value,
    maxPrice: monthly.value ? maxMonthlyBudget.value : maxTotalBudget.value
  });
}, { deep: true });

</script>


<style scoped>


.budget-section {
  margin-bottom: 32px;
}

.slider-container {
  width: 100%;
  height: 5px;
  background: #E6E6E6;
  border-radius: 5px;
  position: relative;
}

.slider {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 5px;
  background: transparent;
  outline: none;
}


.slider:hover {
  opacity: 1;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #70B4C3;
  cursor: pointer;
}

.slider::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #70B4C3;
  cursor: pointer;
}

.input-number {
  width: 60px;
  padding: 5px;
  border: 1px solid #ddd;
  border-radius: 4px;
  text-align: center;
}

.values > div {
  text-align: center;
}

.custom-hr {
  border: none;
  height: 1px;
  background-color: #ccc;
  margin: 50px 20px 20px 20px;
}

.toggle {
  appearance: none;
  width: 48px;
  height: 24px;
  background-color: #5f767f;
  border-radius: 9999px;
  position: relative;
  opacity: 0.65;

  &:checked {
    background-color: rgba(166, 206, 229, 0.36);
  }

  &:checked::after {
    transform: translateX(24px);
  }

  &::after {
    content: "";
    position: absolute;
    top: 2px;
    left: 2px;
    width: 20px;
    height: 20px;
    background-color: white;
    border-radius: 50%;
    transition: transform 0.2s;
  }
}

button {
  transition: background-color 0.3s, color 0.3s;
}

input[type=range]::-webkit-slider-thumb {
  -webkit-appearance: none;
  pointer-events: all;
  width: 24px;
  height: 24px;
  background-color: #fff;
  border-radius: 50%;
  box-shadow: 0 0 0 1px #C6C6C6;
  cursor: pointer;
  background: #18495c;
}

input[type=range]::-moz-range-thumb {
  -webkit-appearance: none;
  pointer-events: all;
  width: 24px;
  height: 24px;
  background-color: #fff;
  border-radius: 50%;
  box-shadow: 0 0 0 1px #C6C6C6;
  cursor: pointer;
}


input[type="number"] {
  color: #8a8383;
  width: 50px;
  height: 30px;
  font-size: 20px;
  border: none;
}

input[type=number]::-webkit-inner-spin-button,
input[type=number]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="range"] {
  -moz-appearance: textfield;
  appearance: textfield;
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  position: absolute;
  background-color: rgba(24, 73, 92, 0.3);
  pointer-events: none;
}

.budget-section {
  margin-bottom: 32px;
}

.slider-label {
  position: absolute;
  transform: translateX(-50%);
  padding: 10px;
  border-radius: 4px;
  -webkit-user-select: none;
  max-width: max-content;
  min-width: max-content;
  -moz-user-select: none;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #70B4C3;
  cursor: pointer;
}

.slider::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #70B4C3;
  cursor: pointer;
}


.values > div {
  text-align: center;
}

.budget-section, .vehicle-options, .toggle-button, .custom-hr {
  margin-bottom: 9px;
}

.label {
  cursor: pointer;
  font-size: 16px;
  color: #333;
  position: relative;
  padding-left: 35px;
}

.label::before {
  content: "";
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  height: 20px;
  width: 20px;
  background-color: #fff;
  border-radius: 50%;
  border: 2px solid #ccc;
  transition: background-color 0.3s, border-color 0.3s;
}

.label:checked::before {
  background-color: #70b4c3;
  border-color: #70b4c3;
}

.hidden-radio:checked + .label::before {
  background-color: #70b4c3;
  border-color: #70b4c3;
}

.hidden-radio:focus + .label::before {
}

.toggle-button {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  width: 100%;
  background: transparent;
  border: none;
  font-size: 18px;
  color: #18495C;
  cursor: pointer;
}

.toggle-button:hover {
  background-color: #f0f0f0;
}

.rotate-180 {
  transform: rotate(180deg);
}

.custom-hr {
  border: none;
  height: 1px;
  background-color: #ccc;
  margin: 20px 0;
}


.vehicle-options, .checkbox-option, .toggle-button, .custom-hr {
  margin-bottom: 9px;
}

.hidden-checkbox {
  opacity: 0;
  position: absolute;
  cursor: pointer;
}

.checkbox-option {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.label {
  cursor: pointer;
  font-size: 16px;
  color: #333;
  position: relative;
  padding-left: 35px;
}

.label::before {
  content: "";
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  height: 20px;
  width: 20px;
  background-color: #fff;
  border-radius: 50%;
  border: 2px solid #ccc;
  transition: background-color 0.3s, border-color 0.3s;
}

.hidden-checkbox:checked + .label::before {
  background-color: #70b4c3;
  border-color: #70b4c3;
}

.toggle-button {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  width: 100%;
  background: transparent;
  border: none;
  font-size: 18px;
  color: #18495C;
  cursor: pointer;
}

.toggle-button:hover {
  background-color: #f0f0f0;
}

.rotate-180 {
  transform: rotate(180deg);
}

.custom-hr {
  border: none;
  height: 1px;
  background-color: #ccc;
  margin: 20px 0;
}

</style>
