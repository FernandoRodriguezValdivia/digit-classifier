import styles from './Header.module.css'

const Header = () => {
  return (
    <header className={styles.container}>
      <h1 className={styles.title}>🔢 Clasificador de Dígitos</h1>
      <p className={styles.description}>Dibuja un número (0-9) y la red neuronal lo reconocerá</p>
    </header>
  )
}

export default Header;