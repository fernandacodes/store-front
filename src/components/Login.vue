<template>
  <div class="container">
    <div class="login-container">
      <div class="login-container-title">
        <h2>Login</h2>
      </div>
      <form @submit.prevent="onSubmit" class="login-form">
        <FormField v-slot="{ componentField: emailField }" name="email">
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input type="text" placeholder="shadcn@email.com" v-bind="emailField" />
            </FormControl>
          </FormItem>
        </FormField>
        <FormField v-slot="{ componentField: passwordField }" name="password">
          <FormItem>
            <FormLabel>Password</FormLabel>
            <FormControl>
              <Input type="password" placeholder="Password" v-bind="passwordField" />
            </FormControl>
          </FormItem>
        </FormField>
        <Button type="submit" class="login-button">
          Submit
        </Button>
      </form>
      <div class="register-link">
        Don't have an account? <a @click="goToRegister">Click here to create one</a>.
      </div>
    </div>
  </div>
  <Toaster />
</template>

<script setup lang="ts">
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import Input from './ui/input/Input.vue';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { useToast } from '@/components/ui/toast/use-toast';
import { Toaster } from '@/components/ui/toast';
import axios from 'axios';
import router from '@/router/route';

const { toast } = useToast();

const formSchema = toTypedSchema(z.object({
  email: z.string().min(2).max(255),
  password: z.string().min(6).max(30),
}));

const form = useForm({
  validationSchema: formSchema,
});

const onSubmit = form.handleSubmit(async (values) => {
  try {
    const response = await axios.post('http://localhost:8000/api/login', {
      email: values.email,
      password: values.password,
    });
    localStorage.setItem('token', response.data.token); // Ajuste 'response.data.token' conforme a estrutura da sua resposta
    toast({
      title: 'Sucesso',
      description: 'Login realizado com sucesso!',
    });
    setTimeout(() => {
      router.push('/');
    }, 3000);
  } catch (error) {
    toast({
      title: 'Erro',
      description: 'Erro durante o login. Verifique suas credenciais.',
      variant: 'destructive',
    });
  }
});

const goToRegister = () => {
  router.push('/register');
};
</script>

<style scoped>
.container {
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-container-title {
  display: flex;
  width: 100%;
  justify-content: center;
}

.login-container {
  width: 500px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.login-form {
  display: flex;
  flex-direction: column;
}

.login-button {
  margin-top: 1rem;
}

.login-form h2 {
  margin-bottom: 20px;
}

.login-form .form-item {
  width: 100%;
  margin-bottom: 15px;
}

.register-link {
  margin-top: 20px;
  text-align: center;
}

.register-link a {
  color: #007bff;
  cursor: pointer;
  text-decoration: underline;
}
</style>
