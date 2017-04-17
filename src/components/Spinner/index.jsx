/** @jsx Inferno */
import Inferno from 'inferno';
import { SvgIcon } from '..';
import styles from './spinner.css';

const Spinner = () => (
  <div className={styles.spinner}>
    <SvgIcon name="spinner" />
  </div>
);

export default Spinner;
