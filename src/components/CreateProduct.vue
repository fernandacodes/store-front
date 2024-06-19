<template>
  <div class="header">
    <NavBar></NavBar>
  </div>
  <div class="container">
    <div class="product-form-container">
      <div class="product-form-container-title">
        <h2>Cadastro de Produto</h2>
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
              <textarea v-bind="descriptionField"></textarea>
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
        <FormField  name="category_id">
          <FormItem>
            <FormLabel>Categoria</FormLabel>
            <FormControl>
              <Select v-model="selectedCategoryId">
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Categorias</SelectLabel>
                    <SelectItem v-for="category in categories" :key="category.id" :value="category.id">
                      {{ category.name}}
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </FormControl>
          </FormItem>
        </FormField>
        <Button type="submit" class="product-form-button">
          Cadastrar Produto
        </Button>
      </form>
    </div>
  </div>
  <Toaster />
</template>

<script setup lang="ts">
import { ref, computed, watchEffect } from 'vue';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import Input from './ui/input/Input.vue';
import * as z from 'zod';
import NavBar from '@/features/NavBar.vue';
import { Button } from '@/components/ui/button';
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

const selectedCategoryId = computed({
  get: () => categories.value.find(category => category.id === form.values.category_id),
  set: (value: any) => {
    const category = value.toString();
    form.setFieldValue('category_id', category); // Garante que seja uma string
  }
});

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
  } catch (error) {
    toast({
      title: 'Erro',
      description: 'Erro ao buscar categorias',
      variant: 'destructive',
    });
  }
}

fetchCategories();
watchEffect(fetchCategories);

const onSubmit = form.handleSubmit(async (values) => {
  try {
    const token = localStorage.getItem('token');
    await axios.post('http://localhost:8000/api/products', values, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    toast({
      title: 'Sucesso',
      description: 'Produto cadastrado com sucesso!',
    });
  } catch (error) {
    toast({
      title: 'Erro',
      description: 'Erro durante o cadastro do produto',
      variant: 'destructive',
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

.product-button {
  margin-top: 1rem;
}

.product-form h2 {
  margin-bottom: 20px;
}

.product-form.form-item {
  width: 100%;
  margin-bottom: 15px;
}
</style>
