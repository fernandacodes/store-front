<template>
  <div class="header">
    <NavBar></NavBar>
  </div>
  <div class="container">
    <div class="search-container">
      <input type="text" v-model="searchTerm" placeholder="Pesquise por nome ou descrição..." class="search-input" />
            <Button variant="default" @click="searchProducts">Pesquisar</Button>
            <RadioGroup v-model="searchOption" name="search-option"class="radio-group">
        <RadioGroupItem value="name">Nome</RadioGroupItem>
        <RadioGroupItem value="description">Descrição</RadioGroupItem>
      </RadioGroup>
    </div>
    <div class="products-list">
      <Card v-for="product in paginatedProducts" :key="product.id" class="w-[350px] mb-6">
        <CardHeader>
          <CardTitle>{{ product.name }}</CardTitle>
          <CardDescription>{{ product.description }}</CardDescription>
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
                  Esta ação não pode ser desfeita. Isso excluirá permanentemente o produto.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction @click="deleteProduct(product.id)">Confirmar</AlertDialogAction>
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
import NavBar from "./../features/NavBar.vue";
import axios from 'axios';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { Label } from "@/components/ui/label"



const searchOption = ref('name'); // Pode ser 'name' ou 'description'

const searchTerm = ref('');
const currentPage = ref(1); // Estado inicial da página atual
const itemsPerPage = ref(10); // Quantidade de itens por página
const products = ref<Product[]>([]); // Todos os produtos retornados pela API
const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return products.value.slice(start, end);
});

const totalPages = computed(() => {
  return Math.ceil(products.value.length / itemsPerPage.value);
});


async function searchProducts() {
  if (!searchTerm.value.trim()) {
    alert("Por favor, insira um termo de pesquisa.");
    return;
  }

  let url = `http://localhost:8000/api/search?`;
  if (searchOption.value === 'name') {
    url += `nome=${encodeURIComponent(searchTerm.value)}`;
  } else if (searchOption.value === 'description') {
    url += `descricao=${encodeURIComponent(searchTerm.value)}`;
  }

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    products.value = response.data; // Atualize a lista de produtos com os resultados da pesquisa
  } catch (error) {
    console.error('Erro ao realizar a pesquisa:', error);
  }
}



const items = computed(() => {
  let result = [];
  for (let i = 1; i <= totalPages.value; i++) {
    result.push({ type: 'page', value: i });
  }
  return result;
});

async function fetchProducts() {
  try {
    const response = await axios.get('http://localhost:8000/api/products', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    products.value = response.data; // Ajuste conforme a estrutura da resposta da sua API
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
  }
}

async function deleteProduct(productId: number) {
  try {
    await axios.delete(`http://localhost:8000/api/products/${productId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    products.value = products.value.filter(product => product.id !== productId);
  } catch (error) {
    console.error('Erro ao excluir produto:', error);
  }
}

function changePage(newPage: number) {
  currentPage.value = newPage;
}

onMounted(() => {
  fetchProducts();
});
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  flex-wrap: wrap;
  flex-grow: 1;
  height: 750px;
}

.products-list{
  display: flex;
  width: 100%;
  justify-content: flex-start;
}

.search-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.container-pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.radio-group {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}
</style>
