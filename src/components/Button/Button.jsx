import styles from './Button.module.css'

const Button = ({ children, variant = 'primary', onClick, disabled }) => {
  const className = [
    styles.button,
    styles[variant],
    disabled && styles.disabled
  ].filter(Boolean).join(' ');

  return (
    <button onClick={onClick} className={className} disabled={disabled}>
      {children}
    </button>
  )
}

export default Button;