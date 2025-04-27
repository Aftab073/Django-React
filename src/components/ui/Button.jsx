import React from 'react';

const Button = React.forwardRef(({ 
  children, 
  className = '',
  variant = 'primary',
  size = 'md',
  type = "button",
  as: Component = 'button',
  ...props 
}, ref) => {
  // Define the class names based on variant and size
  const variantClasses = {
    primary: "bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 active:from-blue-700 active:to-indigo-800 shadow-md hover:shadow-lg dark:from-blue-600 dark:to-indigo-700 dark:hover:from-blue-700 dark:hover:to-indigo-800 focus:ring-blue-500 dark:focus:ring-blue-400",
    outline: "border-2 border-gray-300 bg-white/90 dark:bg-gray-800/90 hover:bg-gray-50 dark:hover:bg-gray-700/80 text-gray-800 dark:text-gray-100 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 focus:ring-gray-400 dark:focus:ring-gray-600",
    secondary: "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 hover:from-gray-200 hover:to-gray-300 dark:from-gray-700 dark:to-gray-800 dark:text-gray-100 dark:hover:from-gray-600 dark:hover:to-gray-700 shadow-sm hover:shadow focus:ring-gray-300 dark:focus:ring-gray-700",
    ghost: "bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800/70 text-gray-800 dark:text-gray-100 focus:ring-gray-300 dark:focus:ring-gray-700",
    link: "bg-transparent underline-offset-4 hover:underline text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-transparent focus:ring-blue-500 dark:focus:ring-blue-400",
    danger: "bg-gradient-to-r from-red-500 to-rose-600 text-white hover:from-red-600 hover:to-rose-700 active:from-red-700 active:to-rose-800 shadow-md hover:shadow-lg dark:from-red-600 dark:to-rose-700 focus:ring-red-500 dark:focus:ring-red-400",
  };

  const sizeClasses = {
    sm: "h-8 px-3 text-xs",
    md: "h-10 px-4 py-2",
    lg: "h-12 px-6 py-3 text-base",
    icon: "h-9 w-9",
  };

  const baseClasses = "inline-flex items-center justify-center rounded-md font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900 disabled:opacity-60 disabled:pointer-events-none disabled:shadow-none";
  
  // Combine all classes
  const buttonClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  // Only include type if it's a button element
  const buttonProps = Component === 'button' ? { type, ...props } : props;

  return (
    <Component
      className={buttonClasses}
      ref={ref}
      {...buttonProps}
    >
      {children}
    </Component>
  );
});

Button.displayName = "Button";

export default Button; 