import { ButtonHTMLAttributes, FC } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'amber' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses =
    'font-semibold rounded-xl transition duration-150 flex items-center justify-center gap-2 select-none focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-stone-900 disabled:opacity-50 disabled:cursor-not-allowed';

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3.5 text-base shadow-lg',
  };

  const variantClasses = {
    primary:
      'bg-amber-500 hover:bg-amber-400 text-stone-950 active:scale-[0.98] shadow-amber-900/30',
    amber:
      'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold active:scale-[0.98] shadow-lg shadow-amber-950/40',
    secondary:
      'bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700/60 active:scale-[0.98]',
    danger:
      'bg-red-600 hover:bg-red-500 text-white active:scale-[0.98]',
    outline:
      'border-2 border-amber-600/60 hover:border-amber-500 text-amber-400 hover:bg-amber-950/40',
  };

  return (
    <button
      disabled={disabled}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
