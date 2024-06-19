<template>
   <div class="header">
        <NavBar></NavBar>
    </div>
    <div class="container">
      <div class="category-form-container">
        <div class="category-form-container-title">
          <h2>Cadastro de Categoria</h2>
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
  
  import axios from "axios";


  const formSchema = toTypedSchema(z.object({
    name: z.string().min(2).max(255),
  }));
  
  const form = useForm({
    validationSchema: formSchema,
  });
  
  const onSubmit = form.handleSubmit(async (values) => {
  try {
    // Verifica se o token existe no localStorage
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token not found');
    }

    // Configura o cabeçalho Authorization com o token
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await axios.post('http://localhost:8000/api/categories', values, config);
    console.log('Categoria cadastrada com sucesso!', response.data);
  } catch (error) {
    console.error('Erro durante o cadastro da categoria');
  }
});
  </script>
  
  <style scoped>
.container {
  width: 100%;
  min-height: 100vh; /* Alterado para min-height */
  display: flex;
  justify-content: center;
  align-items: center;
}

.category-container-title{
    display: flex;
    width: 100%;
    justify-content: center;
}

.category-container {
  width: 500px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.category-form {
  display: flex;
  flex-direction: column;
}
.category-button{
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