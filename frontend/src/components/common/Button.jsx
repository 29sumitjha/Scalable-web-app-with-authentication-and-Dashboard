const Button = ({ 
  children, 
  variant = 'primary', 
  type = 'button', 
  onClick, 
  disabled = false,
  className = '',
  fullWidth = false 
}) => {
  const baseClass = 'btn';
  const variantClass = `btn-${variant}`;
  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClass} ${variantClass} ${widthClass} ${className} bg-gray-400`}
    >
      {children}
    </button>
  );
};

export default Button;