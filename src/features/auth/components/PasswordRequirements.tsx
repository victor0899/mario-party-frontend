interface PasswordRequirements {
  minLength: boolean;
  hasUpperCase: boolean;
  hasLowerCase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
}

interface PasswordRequirementsProps {
  requirements: PasswordRequirements;
}

const CheckIcon = () => (
  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
  </svg>
);

interface RequirementItemProps {
  met: boolean;
  text: string;
}

const RequirementItem = ({ met, text }: RequirementItemProps) => (
  <div className="flex items-center gap-2">
    <div className={`w-4 h-4 rounded-full flex items-center justify-center ${met ? 'bg-green-500' : 'bg-gray-400'}`}>
      {met && <CheckIcon />}
    </div>
    <span className={`text-xs ${met ? 'text-green-600' : 'text-gray-500'}`}>
      {text}
    </span>
  </div>
);

export const PasswordRequirements = ({ requirements }: PasswordRequirementsProps) => {
  return (
    <div className="mt-3 space-y-2">
      <p className="text-sm text-gray-700 font-medium">Requisitos de contraseña:</p>
      <div className="space-y-1">
        <RequirementItem met={requirements.minLength} text="Mínimo 8 caracteres" />
        <RequirementItem met={requirements.hasUpperCase} text="Una mayúscula (A-Z)" />
        <RequirementItem met={requirements.hasLowerCase} text="Una minúscula (a-z)" />
        <RequirementItem met={requirements.hasNumber} text="Un número (0-9)" />
        <RequirementItem met={requirements.hasSpecialChar} text="Un símbolo (!@#$%...)" />
      </div>
    </div>
  );
};