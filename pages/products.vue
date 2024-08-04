<template>
  <div class="grid sm:grid-cols-2 md:grid-cols-5 gap-6 mb-6">
    <VaInput
      v-model.number="perPage"
      type="number"
      placeholder="Items..."
      label="Items per page"
      @update:modelValue="onPerPageChange"
    />
    <VaInput
      v-model.number="currentPage"
      type="number"
      placeholder="Page..."
      label="Current page"
      @update:modelValue="onCurrentPageChange"
    />
    <VaInput
      v-model="filter"
      class="sm:col-span-2 md:col-span-3"
      placeholder="Filter..."
    />
  </div>

  <VaDataTable
    :items="products"
    :columns="columns"
    :per-page="perPage"
    :current-page="0"
    selectable
    :filter="filter"
    @filtered="filtered = $event.items"
    :loading="loading"
    @sort="onSortChange"
  >
    <template #bodyAppend>
      <tr>
        <td :colspan="columns.length">
          <div class="flex justify-center mt-4">
            <VaPagination
              v-model="currentPage"
              :pages="totalPages"
              @update:modelValue="onCurrentPageChange"
            />
          </div>
        </td>
      </tr>
    </template>
  </VaDataTable>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from "vue";

const loading = ref(true);
const products = ref([]);
const totalRecords = ref(0);
const currentPage = ref(0);
const perPage = ref(10);
const filter = ref("");
const filtered = ref([]);

const sortField = ref("id");
const sortOrder = ref(1);

const columns = [
  { key: "name", title: "Name", sortable: true },
  { key: "price", title: "Price", sortable: true },
  // Add other columns as needed
];

const totalPages = computed(() =>
  Math.ceil(totalRecords.value / perPage.value)
);

const loadProducts = async () => {
  try {
    loading.value = true;
    const response = await fetch(
      `/api/products?page=${currentPage.value}&size=${perPage.value}&sortField=${sortField.value}&sortOrder=${sortOrder.value}`
    );
    const data = await response.json();
    products.value = data.data;
    totalRecords.value = data.total;
  } catch (error) {
    console.error("Error fetching products:", error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadProducts();
});

watch([currentPage, perPage, sortField, sortOrder], () => {
  loadProducts();
});

const onCurrentPageChange = (page: number) => {
  currentPage.value = page;
};

const onPerPageChange = (value: number) => {
  perPage.value = value;
  currentPage.value = 1; // Reset to first page when changing items per page
};

const onSortChange = (event: { sortBy: string; sortType: "desc" | "asc" }) => {
  sortField.value = event.sortBy;
  sortOrder.value = event.sortType === "asc" ? 1 : -1;
};
</script>
