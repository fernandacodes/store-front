<template>
    <div class="container">
        <div class="login-container">
            <div class="login-container-title">
                <h2>Login</h2>
            </div>
      <form @submit="onSubmit" class="login-form">
        <FormField v-slot="{ componentField: emailField }" name="email">
          <FormItem>
            <FormLabel >Email</FormLabel>
            <FormControl>
              <Input type="text" placeholder="shadcn" v-bind="emailField" />
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
    </div>
    </div>
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
  
  const formSchema = toTypedSchema(z.object({
    email: z.string().min(2).max(255),
    password: z.string().min(6).max(30),
  }));
  
  const form = useForm({
    validationSchema: formSchema,
  });
  
  const onSubmit = form.handleSubmit((values) => {
    console.log('Form submitted!', values);
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

.login-container-title{
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
.login-button{
    margin-top: 1rem;
}
.login-form h2 {
  margin-bottom: 20px;
}

.login-form .form-item {
  width: 100%;
  margin-bottom: 15px;
}
</style>

  