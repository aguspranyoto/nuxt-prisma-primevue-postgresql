<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import DataTable from "primevue/datatable";
import Column from "primevue/column";

const loading = ref(true);
const users = ref([]);
const totalRecords = ref(0);
const first = ref(0);
const rows = ref(10);
const pageOptions = [5, 10, 20, 50];
const search = ref(""); // Add this for search functionality

const sortField = ref("id");
const sortOrder = ref(1);

const loadUsers = async () => {
  try {
    loading.value = true;
    const page = Math.floor(first.value / rows.value) + 1;
    const response = await fetch(
      `/api/users?page=${page}&size=${rows.value}&sortField=${
        sortField.value
      }&sortOrder=${sortOrder.value}&search=${encodeURIComponent(search.value)}`
    );
    const data = await response.json();
    users.value = data.data;
    totalRecords.value = data.total;
  } catch (error) {
    console.error("Error fetching users:", error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadUsers();
});

watch([first, rows, sortField, sortOrder, search], () => {
  loadUsers();
});

const onPageChange = (event: { first: number; rows: number }) => {
  first.value = event.first;
};

const onSortChange = (event: { sortField: string; sortOrder: number }) => {
  sortField.value = event.sortField;
  sortOrder.value = event.sortOrder;
};
</script>

<template>
  <div>
    <h1>Users</h1>
    <input v-model="search" @input="loadUsers" placeholder="Search..." />
    <!-- Add this for search input -->
    <DataTable
      :value="users"
      :totalRecords="totalRecords"
      :lazy="true"
      :first="first"
      :rows="rows"
      :loading="loading"
      :rowsPerPageOptions="pageOptions"
      @page="onPageChange"
      @sort="onSortChange"
      paginator
      showGridlines
      stripedRows
      :sortField="sortField"
      :sortOrder="sortOrder"
      dataKey="id"
      tableStyle="min-width: 50rem"
    >
      <Column field="name" header="Name" sortable />
      <Column field="email" header="Email" sortable />
    </DataTable>
  </div>
</template>
