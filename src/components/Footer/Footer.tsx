/**
 * @typedef {import('./DrawingCanvas.module.css').default} Styles
 * @type {Styles}
 */
import styles from './Footer.module.css'

const Footer = (): React.JSX.Element => {
  return (
    <footer className={styles.footer}>
      <p>🧠 Red neuronal entrenada con el dataset MNIST | TensorFlow.js</p>
      <p className={styles.small}>(Dibuja en el recuadro negro con el mouse/dedo)</p>
      <div className={styles.project}>
        <div className={styles.content}>
          <a
            href="https://github.com/FernandoRodriguezValdivia/digit-classifier"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.repoLink}
          >
            <svg className={styles.githubIcon} viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12c0 4.23 2.75 7.8 6.56 9.07.48.09.66-.21.66-.46 0-.23-.01-.84-.01-1.65-2.67.58-3.23-1.28-3.23-1.28-.44-1.11-1.07-1.41-1.07-1.41-.87-.6.07-.58.07-.58.96.07 1.47.98 1.47.98.85 1.45 2.23 1.03 2.77.79.09-.61.33-1.03.6-1.27-2.11-.24-4.33-1.06-4.33-4.71 0-1.04.37-1.89.98-2.56-.1-.24-.43-1.21.09-2.52 0 0 .8-.26 2.62.98.76-.21 1.58-.32 2.4-.32.82 0 1.64.11 2.4.32 1.82-1.24 2.62-.98 2.62-.98.52 1.31.19 2.28.09 2.52.61.67.98 1.52.98 2.56 0 3.66-2.22 4.47-4.33 4.71.34.29.64.86.64 1.73 0 1.25-.01 2.26-.01 2.57 0 .26.18.56.66.46C19.25 19.8 22 16.23 22 12c0-5.52-4.48-10-10-10z" />
            </svg>
            Ver código en GitHub
          </a>
          <p className={styles.note}>Desarrollado por Fernando Rodriguez</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer;