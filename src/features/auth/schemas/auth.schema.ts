import * as Yup from 'yup';


export const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Por favor ingresa un email válido')
    .required('El email es requerido'),
  password: Yup.string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .required('La contraseña es requerida')
});

export type LoginFormValues = Yup.InferType<typeof loginSchema>;


export const registerSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no puede exceder los 50 caracteres')
    .required('El nombre es requerido'),
  email: Yup.string()
    .email('Por favor ingresa un email válido')
    .required('El email es requerido'),
  password: Yup.string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .max(100, 'La contraseña no puede exceder los 100 caracteres')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'La contraseña debe contener al menos una minúscula, una mayúscula y un número'
    )
    .required('La contraseña es requerida'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Las contraseñas deben coincidir')
    .required('Confirma tu contraseña')
});

export type RegisterFormValues = Yup.InferType<typeof registerSchema>;


export const profileUpdateSchema = Yup.object().shape({
  nickname: Yup.string()
    .min(2, 'El nickname debe tener al menos 2 caracteres')
    .max(30, 'El nickname no puede exceder los 30 caracteres')
    .matches(
      /^[a-zA-Z0-9_-]+$/,
      'El nickname solo puede contener letras, números, guiones y guiones bajos'
    )
    .optional(),
  bio: Yup.string()
    .max(500, 'La biografía no puede exceder los 500 caracteres')
    .optional(),
  birthDate: Yup.date()
    .max(new Date(), 'La fecha de nacimiento no puede ser en el futuro')
    .min(new Date('1900-01-01'), 'La fecha de nacimiento debe ser posterior a 1900')
    .optional(),
  nationality: Yup.string()
    .max(50, 'La nacionalidad no puede exceder los 50 caracteres')
    .optional(),
  favoriteMinigame: Yup.string()
    .max(100, 'El minijuego favorito no puede exceder los 100 caracteres')
    .optional(),
  profilePicture: Yup.string()
    .url('Debe ser una URL válida')
    .optional()
});

export type ProfileUpdateFormValues = Yup.InferType<typeof profileUpdateSchema>;


export const passwordResetSchema = Yup.object().shape({
  email: Yup.string()
    .email('Por favor ingresa un email válido')
    .required('El email es requerido')
});

export type PasswordResetFormValues = Yup.InferType<typeof passwordResetSchema>;


export const newPasswordSchema = Yup.object().shape({
  password: Yup.string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .max(100, 'La contraseña no puede exceder los 100 caracteres')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'La contraseña debe contener al menos una minúscula, una mayúscula y un número'
    )
    .required('La contraseña es requerida'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Las contraseñas deben coincidir')
    .required('Confirma tu contraseña')
});

export type NewPasswordFormValues = Yup.InferType<typeof newPasswordSchema>;