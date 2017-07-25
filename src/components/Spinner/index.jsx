import Inferno from 'inferno';
import styles from './spinner.css';

const Spinner = () => (
  <div className={styles.spinner}>
    <svg><use xlinkHref="#icon-spinner" /></svg>
  </div>
);

export default Spinner;
