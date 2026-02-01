import { forwardRef } from 'react';

const Input = forwardRef(({
  label,
  error,
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  name,
  required = false,
  disabled = false,
  fullWidth = true,
  className = '',
  rows = 4
}, ref) => {
  const baseStyles = 'block w-full rounded-lg border px-4 py-2.5 text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200';
  const errorStyles = error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600';

  const InputComponent = type === 'textarea' ? 'textarea' : 'input';

  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <InputComponent
        ref={ref}
        type={type !== 'textarea' ? type : undefined}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        rows={type === 'textarea' ? rows : undefined}
        className={`${baseStyles} ${errorStyles} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      />
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;