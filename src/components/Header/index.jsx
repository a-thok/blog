import { Link, NavLink } from 'inferno-router';
import styles from './header.css';

const links = [
  { name: '灵光', to: '/' },
  { name: '博客', to: '/blog' },
  { name: '关于我', to: '/about' },
];

const Header = () => (
  <header className={styles.header}>
    <h1 className={styles.title}>
      <Link to="/">
        <ruby>
          佮
          <rt>kap</rt>
        </ruby>
        <ruby>
          阿
          <rt>a</rt>
        </ruby>
        <ruby>
          托
          <rt>thok</rt>
        </ruby>
        <ruby>
          講
          <rt>kóng</rt>
        </ruby>
        <ruby>
          話
          <rt>uē</rt>
        </ruby>
      </Link>
    </h1>

    <nav className={styles.nav}>
      {links.map(({ to, name }) => (
        <NavLink
          exact
          to={to}
          className={styles.link}
          activeClassName={styles.linkActive}
        >
          {name}
        </NavLink>
      ))}
    </nav>
  </header>
);

export default Header;
