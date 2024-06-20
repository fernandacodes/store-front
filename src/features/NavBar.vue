<script setup lang="ts">
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu'
import { logout } from '@/utils/logout';
import Button from '@/components/ui/button/Button.vue';
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

// Define as rotas disponíveis na navegação
const routes = [
  {
    category: 'Produtos',
    items: [
      {
        title: 'Listar Produtos',
        href: '/',
        description: 'Veja todos os produtos.',
        requiresAuth: true
      },
      {
        title: 'Cadastrar Produto',
        href: '/create-product',
        description: 'Adicione um novo produto.',
        requiresAuth: true
      }
    ]
  },
  {
    category: 'Categorias',
    items: [
      {
        title: 'Cadastrar Categoria',
        href: '/create-category',
        description: 'Adicione uma nova categoria.',
        requiresAuth: true
      },
      {
        title: 'Listar categorias',
        href: '/categories',
        description: 'Liste as categorias',
        requiresAuth: true
      }
    ]
  }
];

async function handleLogout() {
  await logout();
}
</script>

<template>
  <NavigationMenu>
    <NavigationMenuList>
      <NavigationMenuItem v-for="route in routes" :key="route.category">
        <NavigationMenuTrigger>{{ route.category }}</NavigationMenuTrigger>
        <NavigationMenuContent>
          <ul class="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
            <li v-for="item in route.items" :key="item.title">
              <NavigationMenuLink :href="item.href">
                <div class="flex flex-col p-3 rounded-md bg-gray-100 hover:bg-gray-200">
                  <strong>{{ item.title }}</strong>
                  <span>{{ item.description }}</span>
                </div>
              </NavigationMenuLink>
            </li>
          </ul>
        </NavigationMenuContent>
      </NavigationMenuItem>
      <AlertDialog>
              <AlertDialogTrigger as-child>
                <Button>Logout</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Tem certeza que deseja sair ?</AlertDialogTitle>
                  <AlertDialogDescription>
                    você será redirecionado para a tela de login
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction @click="handleLogout()">Confirmar</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
    </NavigationMenuList>
  </NavigationMenu>
</template>
