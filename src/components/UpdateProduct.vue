<template>
  <div class="header">
    <NavBar></NavBar>
  </div>
  <div class="container">
    <div class="product-form-container">
      <div class="product-form-container-title">
        <h2>Atualização de Produto</h2>
      </div>
      <form @submit.prevent="onSubmit" class="product-form">
        <FormField v-slot="{ componentField: nameField }" name="name">
          <FormItem>
            <FormLabel>Nome</FormLabel>
            <FormControl>
              <Input type="text" placeholder="Nome do Produto" v-bind="nameField" />
            </FormControl>
          </FormItem>
        </FormField>
        <FormField v-slot="{ componentField: priceField }" name="price">
          <FormItem>
            <FormLabel>Preço</FormLabel>
            <FormControl>
              <Input type="number" placeholder="Preço" v-bind="priceField" />
            </FormControl>
          </FormItem>
        </FormField>
        <FormField v-slot="{ componentField: descriptionField }" name="description">
          <FormItem>
            <FormLabel>Descrição</FormLabel>
            <FormControl>
              <Input type="text" v-bind="descriptionField"/>
            </FormControl>
          </FormItem>
        </FormField>
        <FormField v-slot="{ componentField: expirationDateField }" name="expiration_date">
          <FormItem>
            <FormLabel>Data de Expiração</FormLabel>
            <FormControl>
              <Input type="date" v-bind="expirationDateField" />
            </FormControl>
          </FormItem>
        </FormField>
        <FormField name="category_id">
          <FormItem>
            <FormLabel>Categoria</FormLabel>
            <FormControl>
              <Select v-model="selectedCategoryId">
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Categorias</SelectLabel>
                    <SelectItem v-for="category in categories" :key="category.id" :value="category.id">
                      {{ category.name }}
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </FormControl>
          </FormItem>
        </FormField>
        <Button type="submit" class="product-form-button">
          Atualizar Produto
        </Button>
      </form>
    </div>
  </div>
  <Toaster />
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { useRoute } from 'vue-router';
import Input from './ui/input/Input.vue';
import * as z from 'zod';
import NavBar from '@/features/NavBar.vue';
import { Button } from './ui/button';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/components/ui/toast/use-toast';
import { Toaster } from '@/components/ui/toast';
import axios from 'axios';

const { toast } = useToast();
const route = useRoute();
const productId = route.params.id;

const form = useForm({
  validationSchema: toTypedSchema(z.object({
    name: z.string().min(2).max(255),
    price: z.number(),
    description: z.string(),
    expiration_date: z.string().nullable(),
    category_id: z.string()
  })),
});

const categories = ref<Category[]>([]);
const selectedCategoryId = ref<string>('');

async function fetchCategories() {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      toast({
        title: 'Erro',
        description: 'Token não encontrado',
        variant: 'destructive',
      });
      return;
    }

    const response = await axios.get('http://localhost:8000/api/categories', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    categories.value = response.data;

    await fetchProduct(productId);
  } catch (error) {
    toast({
      title: 'Erro',
      description: 'Erro ao buscar categorias',
      variant: 'destructive',
    });
  }
}

async function fetchProduct(productId: string) {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      toast({
        title: 'Erro',
        description: 'Token não encontrado',
        variant: 'destructive',
      });
      return;
    }

    const response = await axios.get(`http://localhost:8000/api/products/${productId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const product = response.data;
    form.setFieldValue('name', product.name);
    form.setFieldValue('price', parseFloat(product.price));
    form.setFieldValue('description', product.description);
    form.setFieldValue('expiration_date', product.expiration_date);
    selectedCategoryId.value = product.category_id; // Define o ID da categoria selecionada no campo Select
    form.setFieldValue('category_id', product.category_id.toString()); // Define o ID da categoria no formulário
  } catch (error) {
    toast({
      title: 'Erro',
      description: 'Erro ao buscar produto',
      variant: 'destructive',
    });
  }
}

onMounted(() => {
  fetchCategories();
});

const onSubmit = form.handleSubmit(async (values) => {
  try {
    const token = localStorage.getItem('token');
    values.category_id = selectedCategoryId.value;
    await axios.put(`http://localhost:8000/api/products/${productId}`, values, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    toast({
      title: 'Sucesso',
      description: 'Produto atualizado com sucesso!',
      duration:500
    });
  } catch (error) {
    toast({
      title: 'Erro',
      description: 'Erro durante a atualização do produto',
      variant: 'destructive',
      duration:500
    });
  }
});
</script>

<style scoped>
.container {
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.product-form-container {
  width: 500px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.product-form {
  display: flex;
  flex-direction: column;
}

.product-form h2 {
  margin-bottom: 20px;
}

.product-form .form-item {
  width: 100%;
  margin-bottom: 15px;
}
</style>
