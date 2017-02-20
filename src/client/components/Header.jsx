/** @jsx Inferno */
import Inferno from 'inferno';
import { Link, IndexLink } from 'inferno-router';

const Header = () => (
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
      <Link to="/" activeClassName="active">灵光</Link>
      <Link to="/blog" activeClassName="active">博客</Link>
      <Link to="/about" activeClassName="active">关于我</Link>
    </nav>
  </header>
);

export default Header;
