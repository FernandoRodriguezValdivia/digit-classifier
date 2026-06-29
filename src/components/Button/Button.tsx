import { PropsWithChildren } from 'react';
import styles from './Button.module.css'
import { ButtonProps } from '../../types/button.types';

const Button = ({ children, variant = 'primary', onClick, disabled = false }: PropsWithChildren<ButtonProps>) => {
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