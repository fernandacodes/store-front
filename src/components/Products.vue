<template>
  <div class="header">
    <NavBar></NavBar>
  </div>
  <div class="container">
    <div class="search-container">
      <Input type="text" v-model="searchTerm" placeholder="Pesquise por nome ou descrição..." class="search-input" />
      <Button variant="default" @click="searchProducts">Pesquisar</Button>
      <div class="radio-group">
        <input type="radio" id="name" value="name" v-model="searchOption">
        <label for="name">Nome</label>
        <div class="radio-item">
          <input type="radio" id="description" value="description" v-model="searchOption">
          <label for="description">Descrição</label>
        </div>
      </div>
    </div>
    <div class="products-list">
      <Card v-for="product in paginatedProducts" :key="product.id" class="w-[350px] mb-6">
        <CardHeader>
          <CardTitle>{{ product.name }}</CardTitle>
          <CardDescription>{{ product.description }}</CardDescription>
          <CardFooter>{{product.price }}$</CardFooter>
        </CardHeader>
        <CardContent>
        </CardContent>
        <CardFooter class="flex justify-between px-6 pb-6">
          <Button variant="outline" @click="editProduct(product.id)">Editar</Button>
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
    <div class="container-pagination">
      <Pagination v-slot="{ page }" :total="totalPages" :sibling-count="1" show-edges :default-page="currentPage"
        @update:page="changePage">
        <PaginationList class="flex items-center gap-1">
          <PaginationFirst />
          <PaginationPrev />
          <template v-for="(item, index) in items">
            <PaginationListItem v-if="item.type === 'page'" :key="index" :value="item.value" as-child>
              <Button class="w-10 h-10 p-0" :variant="item.value === page? 'default' : 'outline'">
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
  </div>
  <Toaster />
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import NavBar from "./../features/NavBar.vue";
import axios from 'axios';
import { Input } from './ui/input';
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
import router from '@/router/route';
import { Toaster, useToast } from '@/components/ui/toast';
const { toast } = useToast();

const searchOption = ref('name'); 
const searchTerm = ref('');
const currentPage = ref(1); 
const itemsPerPage = ref(5); 
const products = ref<Product[]>([]);
const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return products.value.slice(start, end);
});

const editProduct = (productId : any) => {
  router.push({ name: 'UpdateProduct', params: { id: productId } });
};

const totalPages = computed(() => {
  return Math.ceil(products.value.length / itemsPerPage.value);
});

async function searchProducts() {
  if (!searchTerm.value.trim()) {
    alert("Por favor, insira um termo de pesquisa.");
    return;
  }

  try {
    const response = await axios.get('http://localhost:8000/api/products', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    const allProducts = response.data;

    if (searchOption.value === 'name') {
      products.value = allProducts.filter(product =>
        product.name.toLowerCase().includes(searchTerm.value.toLowerCase())
      );
    } else if (searchOption.value === 'description') {
      products.value = allProducts.filter(product =>
        product.description.toLowerCase().includes(searchTerm.value.toLowerCase())
      );
    }

    currentPage.value = 1;
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
    products.value = response.data;
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
    products.value = products.value.filter(product => product.id!== productId);
    toast({
      title: 'sucesso',
      description: 'produto removido',
      duration:1000
    });
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
}

.products-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center; 
  gap: 20px; 
}

@media (max-width: 768px) {
  .search-container {
    flex-direction: column;
    align-items: stretch; 
  }
  .container {
    flex-direction: column; 
  }
 .products-list {
    flex-direction: column; 
  }
}
.search-container {

  margin-top: 1rem;
  margin-bottom: 1rem;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
}
.container-pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.radio-group {
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: flex-start!important;
  align-items: center;
}

.products-list.card {
  max-width: calc(20% - 40px);
  box-sizing: border-box; 
}

@media (max-width: 768px) {
 .products-list.card {
    max-width: 90%;
  }
}
</style>

