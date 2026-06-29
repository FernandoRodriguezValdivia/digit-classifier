export interface ButtonProps {
  variant?: 'primary' | 'secondary';
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
}