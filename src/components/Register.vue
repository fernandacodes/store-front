<template>
  <div class="container">
    <div class="register-container">
      <div class="register-container-title">
        <h2>Cadastro</h2>
      </div>
      <form @submit.prevent="onSubmit" class="register-form">
        <FormField v-slot="{ componentField: nameField }" name="name">
          <FormItem>
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input type="text" placeholder="Your Name" v-bind="nameField" />
            </FormControl>
          </FormItem>
        </FormField>
        <FormField v-slot="{ componentField: emailField }" name="email">
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input type="email" placeholder="example@example.com" v-bind="emailField" />
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
        <FormField v-slot="{ componentField: confirmPasswordField }" name="password_confirmation">
          <FormItem>
            <FormLabel>Password Confirmation</FormLabel>
            <FormControl>
              <Input type="password" placeholder="Confirm Password" v-bind="confirmPasswordField" />
            </FormControl>
          </FormItem>
        </FormField>
        <Button type="submit" class="register-button">
          Register
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
import router from '@/router/route';
import Button from './ui/button/Button.vue';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { useToast } from '@/components/ui/toast/use-toast';
import { Toaster } from '@/components/ui/toast';
import axios from 'axios';

const { toast } = useToast();

const formSchema = toTypedSchema(z.object({
  name: z.string().min(2).max(255),
  email: z.string().email(),
  password: z.string().min(6).max(30),
  password_confirmation: z.string().min(6).max(30),
}));

const form = useForm({
  validationSchema: formSchema,
});

const onSubmit = form.handleSubmit(async (values) => {
  

  try {
    const response = await axios.post('http://localhost:8000/api/register', values);
    if(response.status=201){
      toast({
      title: 'Sucesso',
      description: 'Registration successful!',
      duration:1000
    });
    }
  } catch (error) {
    toast({
      title: 'Erro',
      description: 'Error during registration.',
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

.register-container-title {
  display: flex;
  width: 100%;
  justify-content: center;
}

.register-container {
  width: 500px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.register-form {
  display: flex;
  flex-direction: column;
}

.register-button {
  margin-top: 1rem;
}

.register-form h2 {
  margin-bottom: 20px;
}

.register-form .form-item {
  width: 100%;
  margin-bottom: 15px;
}
</style>
