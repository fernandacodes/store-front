<template>
  <div class="header">
    <NavBar></NavBar>
  </div>
  <div class="container">
    <div class="category-form-container">
      <div class="category-form-container-title">
        <h2>Cadastro de Categoria</h2>
      </div>
      <div class="category-description">
        <p>As categorias ajudam a organizar os produtos em grupos relacionados, facilitando a navegação e a busca pelos usuários. Preencha o campo abaixo para criar uma nova categoria.</p>
      </div>
      <form @submit.prevent="onSubmit" class="category-form">
        <FormField v-slot="{ componentField: nameField }" name="name">
          <FormItem>
            <FormLabel>Nome da Categoria</FormLabel>
            <FormControl>
              <Input type="text" placeholder="Digite o nome da categoria" v-bind="nameField" />
            </FormControl>
          </FormItem>
        </FormField>
        <Button type="submit" class="category-form-button">
          Cadastrar Categoria
        </Button>
      </form>
    </div>
  </div>
  <Toaster />
</template>

<script setup lang="ts">
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
import { useToast } from '@/components/ui/toast/use-toast';
import { Toaster } from '@/components/ui/toast';
import axios from "axios";

const { toast } = useToast();

const formSchema = toTypedSchema(z.object({
  name: z.string().min(2).max(255),
}));

const form = useForm({
  validationSchema: formSchema,
});

const onSubmit = form.handleSubmit(async (values) => {
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

     await axios.post('http://localhost:8000/api/categories', values, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    toast({
      title: 'Sucesso',
      description: 'Categoria cadastrada com sucesso!',
    });
  } catch (error) {
    toast({
      title: 'Erro',
      description: 'Erro durante o cadastro da categoria',
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

.category-form-container {
  width: 500px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.category-form-container-title {
  display: flex;
  width: 100%;
  justify-content: center;
}

.category-description {
  margin-bottom: 20px;
}

.category-form {
  display: flex;
  flex-direction: column;
}

.category-form-button {
  margin-top: 1rem;
}

.category-form h2 {
  margin-bottom: 20px;
}

.category-form .form-item {
  width: 100%;
  margin-bottom: 15px;
}
</style>
