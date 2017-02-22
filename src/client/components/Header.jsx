/** @jsx Inferno */
import Inferno from 'inferno';
import { Link, IndexLink } from 'inferno-router';

const Header = ({ url }) => {
  const links = [
    { name: '灵光', to: '/' },
    { name: '博客', to: '/blog' },
    { name: '关于我', to: '/about' },
  ];

  const className = (to) => {
    if (to === url) {
      return 'active';
    }
    return null;
  };

  return (
    <header className="app-header">
      <h1 className="app-title">
        <IndexLink>
          <ruby>佮<rt>kap</rt></ruby>
          <ruby>阿<rt>a</rt></ruby>
          <ruby>托<rt>thok</rt></ruby>
          <ruby>講<rt>kóng</rt></ruby>
          <ruby>話<rt>uē</rt></ruby>
        </IndexLink>
      </h1>
      <nav className="app-nav">
        {links.map(({ to, name }) => (
          <Link to={to} activeClassName={className(to)}>{name}</Link>
        ))}
      </nav>
    </header>
  );
};

export default Header;
