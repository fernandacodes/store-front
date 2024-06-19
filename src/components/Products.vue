<template>
    <div class="header">
        <NavBar></NavBar>
    </div>
    <div class="container">
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
                <Button>Excluir</Button>
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
</div>
</template>
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import NavBar from "./../features/NavBar.vue"
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
import Button from './ui/button/Button.vue';

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

function changePage(newPage: number) {
    currentPage.value = newPage;
}

onMounted(() => {
    fetchProducts();
});
</script>

<style scoped>
.container{
    display: flex;
    align-items: center;
    width: 100%;
    flex-wrap: wrap;
    flex-grow: 1;
    height: 750px;
}
.container-pagination{
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
}

</style>