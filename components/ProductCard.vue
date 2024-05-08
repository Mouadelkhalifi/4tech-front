<template>
  <div v-if="isVisible" class="card-container">
    <div class="max-w-lg max-h-[400px] mx-auto bg-white rounded-lg overflow-hidden shadow-lg">
      <img :src="getFirstImage(product.pics)" alt="Car image" class="w-full object-cover" style="height: 200px;">
      <div class="flex flex-row p-4 bg-white justify-between items-start" style="background: #F1F8F9; border-radius: 0px 0px 10px 10px;">
        <div class="flex-1 min-w-0 pr-0">
          <h2 class="text-xs font-medium leading-5 uppercase tracking-tight text-[#70B4C3]">{{ product.brand }}</h2>
          <h3 class="font-druk text-lg font-medium tracking-normal text-custom-blue text-left uppercase">{{ product.model }}</h3>
          <p class="w-[193px] h-[16px] mt-4 font-semibold text-13 leading-24 text-custom-blue text-left tracking-tightest">{{ product.version }}</p>
          <div class="text-sm text-gray-800 flex items-center mt-6">
            <span>{{ product.year }}</span>
            <span class="mx-1">-</span>
            <span>{{ product.energy }}</span>
            <span class="mx-1">-</span>
            <span>{{ product.power }}ch</span>
          </div>
        </div>
        <div class="w-1/2 flex-1 flex-col justify-between">
          <div>
            <div class="text-lg font-bold text-gray-800 ml-12">{{ formattedPrice }} €</div>
            <div class="flex items-center mt-1 ml-5">
              <span class="text-xs font-bold text-gray-800 line-through mr-2">{{ formattedPriceRetail }} €</span>
              <span class="text-sm font-bold text-custom-blue bg-[#F4AB22] px-2 py-1">{{ discountPercentage }}%</span>
            </div>
          </div>
          <p class="text-xs font-semibold text-right text-custom-blue opacity-60 tracking-tighter">
            Ou à partir de <br><span class="font-bold text-lg leading-6 font-inter text-right tracking-tighter text-dark-blue opacity-80">{{ product.priceMonthly }}</span>
            <br>
          </p>
          <p class="text-xs font-semibold text-right font-inter text-custom-blue opacity-60">/ mois</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, computed } from 'vue';


const props = defineProps({
  product: {
    type: Object,
    required: true
  },
  filters: {
    type: Object,
    required: false,
    default: () => ({
      brands: [],
      vehicleTypes: [],
      energies: [],
      priceMin: 0,
      priceMax: Infinity,
      monthly: false
    })
  }
});


const getFirstImage = (pics) => {
  if (pics && pics.length > 0) {
    return pics[0];
  } else {
    return '';
  }
};

const discountPercentage = computed(() => {
  if (props.product.priceRetail && props.product.priceRetail > 0) {
    return Math.round(((props.product.priceRetail - props.product.price) / props.product.priceRetail) * 100);
  }
  return 0;
});

const formattedPrice = computed(() => {
  if (!props.product.price) return '';
  return props.product.price.toLocaleString('fr-FR');
});

const formattedPriceRetail = computed(() => {
  if (!props.product.priceRetail) return '';
  return props.product.priceRetail.toLocaleString('fr-FR');
});

const isVisible = computed(() => {
  const brandMatches = !props.filters.brands.length || props.filters.brands.includes(props.product.brand);
  const typeMatches = !props.filters.vehicleTypes.length || props.filters.vehicleTypes.includes(props.product.model);
  const energyMatches = !props.filters.energies.length || props.filters.energies.includes(props.product.energy);
  const priceMatches = props.filters.monthly ?
      props.product.priceMonthly >= props.filters.priceMin && props.product.priceMonthly <= props.filters.priceMax :
      props.product.price >= props.filters.priceMin && props.product.price <= props.filters.priceMax;

  return brandMatches && typeMatches && energyMatches && priceMatches;
});</script>


<style scoped>
.text-custom-blue {
  color: #042A38;
  font-family: 'Inter', sans-serif;
}

.card-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 20px;
}

.card img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.card {
  padding: 15px;
  background: #F1F8F9;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 200px;
}

</style>
