<template>
    <div class="header">
      <NavBar></NavBar>
    </div>
    <div class="container">
      <div class="categories-list">
        <Card v-for="category in paginatedCategories" :key="category.id" class="w-[350px] mb-6">
          <CardHeader>
            <CardTitle>id:{{ category.id }}</CardTitle>
            <CardTitle>{{ category.name }}</CardTitle>
          </CardHeader>
          <CardContent>
          </CardContent>
          <CardFooter class="flex justify-between px-6 pb-6">
            <Button variant="outline">Editar</Button>
            <AlertDialog>
              <AlertDialogTrigger as-child>
                <Button>Excluir</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta ação não pode ser desfeita. Isso excluirá permanentemente a categoria.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction @click="deleteCategory(category.id)">Confirmar</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardFooter>
        </Card>
      </div>
    </div>
    <div class="container-pagination">
      <Pagination v-slot="{ page }" :total="totalPages" :sibling-count="1" show-edges :default-page="currentPage"
        @update:page="changePage">
        <PaginationList class="flex items-center gap-1">
          <PaginationFirst />
          <PaginationPrev />
          <template v-for="(item, index) in items">
            <PaginationListItem v-if="item.type === 'page'" :key="index" :value="item.value" as-child>
              <Button class="w-10 h-10 p-0" :variant="item.value === page ? 'default' : 'outline'">
                {{ item.value }}
              </Button>
            </PaginationListItem>
            <PaginationEllipsis v-else :key="item.type" :index="index" />
          </template>
          <PaginationNext />
          <PaginationLast />
        </PaginationList>
      </Pagination>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, onMounted } from 'vue';
  import NavBar from "./../features/NavBar.vue"
  import axios from 'axios';
  import {
      Card,
      CardContent,
      CardHeader,
      CardTitle,
  } from '@/components/ui/card';
  import {
      Pagination,
      PaginationEllipsis,
      PaginationFirst,
      PaginationLast,
      PaginationList,
      PaginationListItem,
      PaginationNext,
      PaginationPrev,
  } from '@/components/ui/pagination'
  import {
      AlertDialog,
      AlertDialogAction,
      AlertDialogCancel,
      AlertDialogContent,
      AlertDialogDescription,
      AlertDialogFooter,
      AlertDialogHeader,
      AlertDialogTitle,
      AlertDialogTrigger,
  } from '@/components/ui/alert-dialog'
  import Button from './ui/button/Button.vue';
  
  const currentPage = ref(1); // Estado inicial da página atual
  const itemsPerPage = ref(10); // Quantidade de itens por página
  const categories = ref<Category[]>([]); // Todas as categorias retornadas pela API
  const paginatedCategories = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage.value;
      const end = start + itemsPerPage.value;
      return categories.value.slice(start, end);
  });
  
  const totalPages = computed(() => {
      return Math.ceil(categories.value.length / itemsPerPage.value);
  });
  
  const items = computed(() => {
      let result = [];
      for (let i = 1; i <= totalPages.value; i++) {
          result.push({ type: 'page', value: i });
      }
      return result;
  });
  
  async function fetchCategories() {
      try {
          const response = await axios.get('http://localhost:8000/api/categories', {
              headers: {
                  Authorization: `Bearer ${localStorage.getItem('token')}`,
              },
          });
          categories.value = response.data; 
      } catch (error) {
          console.error('Erro ao buscar categorias:', error);
      }
  }
  
  async function deleteCategory(categoryId: number) {
      try {
          await axios.delete(`http://localhost:8000/api/categories/${categoryId}`, {
              headers: {
                  Authorization: `Bearer ${localStorage.getItem('token')}`,
              },
          });
          categories.value = categories.value.filter(category => category.id !== categoryId);
      } catch (error) {
          console.error('Erro ao excluir categoria:', error);
      }
  }
  
  function changePage(newPage: number) {
      currentPage.value = newPage;
  }
  
  onMounted(() => {
      fetchCategories();
  });
  </script>
  
  <style scoped>
  .container {
      display: flex;
      align-items: center;
      width: 100%;
      flex-wrap: wrap;
      flex-grow: 1;
      height: 750px;
  }
  .container-pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
  }
  </style>
  