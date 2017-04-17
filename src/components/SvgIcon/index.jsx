/** @jsx Inferno */
import Inferno from 'inferno';

const SvgIcon = ({ name }) => (
  <svg dangerouslySetInnerHTML={{ __html: `<use xlink:href="#icon-${name}" />` }} />
);

export default SvgIcon;
