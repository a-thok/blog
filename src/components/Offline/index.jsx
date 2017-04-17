/** @jsx Inferno */
import Inferno from 'inferno';
import styles from './offline.css';

const Offline = () => (
  <div className={styles.offline}>
    您当前处于离线状态，部分内容可能无法访问
  </div>
);

export default Offline;
