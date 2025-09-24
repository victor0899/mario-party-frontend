import * as Yup from 'yup';

// Create group validation schema
export const createGroupSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'El nombre del grupo debe tener al menos 2 caracteres')
    .max(100, 'El nombre del grupo no puede exceder los 100 caracteres')
    .required('El nombre del grupo es requerido'),
  description: Yup.string()
    .max(500, 'La descripción no puede exceder los 500 caracteres')
    .optional(),
  is_public: Yup.boolean()
    .default(false),
  max_members: Yup.number()
    .min(2, 'El grupo debe permitir al menos 2 miembros')
    .max(50, 'El grupo no puede tener más de 50 miembros')
    .integer('El número de miembros debe ser un entero')
    .default(10)
});

export type CreateGroupFormValues = Yup.InferType<typeof createGroupSchema>;

// Join group validation schema
export const joinGroupSchema = Yup.object().shape({
  invite_code: Yup.string()
    .length(8, 'El código de invitación debe tener exactamente 8 caracteres')
    .matches(
      /^[A-Z0-9]+$/,
      'El código de invitación solo puede contener letras mayúsculas y números'
    )
    .required('El código de invitación es requerido')
});

export type JoinGroupFormValues = Yup.InferType<typeof joinGroupSchema>;

// Add CPU member validation schema
export const addCPUSchema = Yup.object().shape({
  cpu_name: Yup.string()
    .min(2, 'El nombre del CPU debe tener al menos 2 caracteres')
    .max(50, 'El nombre del CPU no puede exceder los 50 caracteres')
    .required('El nombre del CPU es requerido'),
  cpu_avatar: Yup.string()
    .oneOf([
      'mario', 'luigi', 'peach', 'daisy', 'yoshi', 'toad', 'toadette',
      'bowser', 'bowser_jr', 'koopa_troopa', 'shy_guy', 'boo',
      'rosalina', 'wario', 'waluigi', 'donkey_kong', 'diddy_kong'
    ], 'Selecciona un avatar válido')
    .optional()
});

export type AddCPUFormValues = Yup.InferType<typeof addCPUSchema>;

// Update group validation schema
export const updateGroupSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'El nombre del grupo debe tener al menos 2 caracteres')
    .max(100, 'El nombre del grupo no puede exceder los 100 caracteres')
    .optional(),
  description: Yup.string()
    .max(500, 'La descripción no puede exceder los 500 caracteres')
    .optional(),
  is_public: Yup.boolean()
    .optional(),
  max_members: Yup.number()
    .min(2, 'El grupo debe permitir al menos 2 miembros')
    .max(50, 'El grupo no puede tener más de 50 miembros')
    .integer('El número de miembros debe ser un entero')
    .optional()
});

export type UpdateGroupFormValues = Yup.InferType<typeof updateGroupSchema>;

// Transfer ownership validation schema
export const transferOwnershipSchema = Yup.object().shape({
  newOwnerId: Yup.string()
    .required('Debes seleccionar un nuevo propietario'),
  confirmTransfer: Yup.boolean()
    .oneOf([true], 'Debes confirmar la transferencia de propiedad')
    .required('La confirmación es requerida')
});

export type TransferOwnershipFormValues = Yup.InferType<typeof transferOwnershipSchema>;