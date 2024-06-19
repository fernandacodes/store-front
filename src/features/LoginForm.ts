import { useForm } from 'vee-validate';
interface LoginForm {
  email: string;
  password: string;
}
// in your setup
const { errors } = useForm<LoginForm>();