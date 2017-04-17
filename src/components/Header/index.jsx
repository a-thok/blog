/** @jsx Inferno */
import Inferno from 'inferno';
import { Link, IndexLink } from 'inferno-router';
import styles from './header.css';

const links = [
  { name: '灵光', to: '/' },
  { name: '博客', to: '/blog' },
  { name: '关于我', to: '/about' },
];

const Header = () => (
  <header className={styles.header}>
    <h1 className={styles.title}>
      <IndexLink>
        <ruby>佮<rt>kap</rt></ruby>
        <ruby>阿<rt>a</rt></ruby>
        <ruby>托<rt>thok</rt></ruby>
        <ruby>講<rt>kóng</rt></ruby>
        <ruby>話<rt>uē</rt></ruby>
      </IndexLink>
    </h1>

    <nav className={styles.nav}>
      {links.map(({ to, name }) => (
        <Link
          to={to}
          className={styles.link}
          activeClassName={styles.linkActive}
        >{name}</Link>
      ))}
    </nav>
  </header>
);

export default Header;
