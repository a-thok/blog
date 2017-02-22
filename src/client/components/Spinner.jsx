/** @jsx Inferno */
import Inferno from 'inferno';

const Spinner = () => (
  <div className="spinner">
    <svg dangerouslySetInnerHTML={{ __html: '<use xlink:href="/icons.svg#icon-spinner" />' }} />
  </div>
);

export default Spinner;
