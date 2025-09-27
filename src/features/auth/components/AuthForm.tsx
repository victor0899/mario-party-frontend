import { type FormEvent } from 'react';
import toast from 'react-hot-toast';
import { Button, Input } from '../../../shared/components';
import { useAuth } from '../hooks/useAuth';
import { useAuthForm } from '../hooks/useAuthForm';
import { PasswordRequirements } from './PasswordRequirements';

interface AuthFormProps {
  isLogin: boolean;
  onToggleMode: () => void;
  onSuccess?: () => void;
}

export const AuthForm = ({ isLogin, onToggleMode, onSuccess }: AuthFormProps) => {
  const { signUp, signIn, isLoading } = useAuth();
  const {
    email,
    password,
    name,
    setEmail,
    setPassword,
    setName,
    errors,
    passwordValidation,
    isFormValid,
    validateForm,
    resetForm
  } = useAuthForm(isLogin);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      if (isLogin) {
        const loadingToast = toast.loading('Iniciando sesión...');
        const result = await signIn({ email, password });
        toast.dismiss(loadingToast);

        if (result.success) {
          toast.success('¡Bienvenido de vuelta!');
          onSuccess?.();
        } else {
          toast.error(result.error?.message || 'Error al iniciar sesión');
        }
      } else {
        const loadingToast = toast.loading('Creando cuenta...');
        const result = await signUp({ email, password, name });
        toast.dismiss(loadingToast);

        if (result.success) {
          toast.success('¡Registro exitoso! Revisa tu email para confirmar tu cuenta.');
          resetForm();
          onToggleMode();
          onSuccess?.();
        } else {
          toast.error(result.error?.message || 'Error al crear la cuenta');
        }
      }
    } catch (error) {
      toast.error('Ha ocurrido un error inesperado');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {!isLogin && (
        <Input
          type="text"
          label="Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Tu nombre"
          required
          size="lg"
          error={errors.name}
        />
      )}

      <Input
        type="email"
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="tu@email.com"
        required
        size="lg"
        error={errors.email}
      />

      <div>
        <Input
          type="password"
          label="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={isLogin ? "Tu contraseña" : "Crea una contraseña segura"}
          required
          size="lg"
          error={errors.password}
          showPasswordToggle={true}
        />

        {!isLogin && password && (
          <PasswordRequirements requirements={passwordValidation.requirements} />
        )}
      </div>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        className="w-full"
        disabled={!isFormValid || isLoading}
      >
        {isLoading ? 'Cargando...' : (isLogin ? 'Iniciar Sesión' : 'Crear Cuenta')}
      </Button>

    </form>
  );
};