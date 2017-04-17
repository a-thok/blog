/** @jsx Inferno */
import Inferno from 'inferno';
import Component from 'inferno-component';
import styles from './about.css';

class About extends Component {
  componentDidMount() {
    document.title = 'About Me - A Talk To me';
  }

  render() {
    return (
      <section>
        <h2 className={styles.title}>
          Victor Loo<small className={styles.profession}>前端工程师</small>
        </h2>

        <section>
          <p>赚钱的时候最喜欢敲代码，不赚钱的时候最喜欢学语言，什么都不喜欢的时候最喜欢写文章。</p>
          <p>希望永远不被任何人记住，随时转身消失在世界里。</p>
        </section>

        <section className={styles.skills}>
          <dl>
            <dt>熟练</dt>
            <dd>JavaScript (ES6+)</dd>
            <dd>HTML</dd>
            <dd>CSS (CSS3+)</dd>
            <dd>React (&Redux)</dd>
            <dd>jQuery</dd>
          </dl>
          <dl>
            <dt>熟悉</dt>
            <dd>Vue</dd>
            <dd>Angular</dd>
            <dd>HTML5</dd>
            <dd>Node.js (&Express)</dd>
            <dd>MongoDB</dd>
            <dd>Typescript</dd>
            <dd>Bootstrap</dd>
          </dl>
          <dl>
            <dt>工具</dt>
            <dd>Opera</dd>
            <dd>VS Code</dd>
            <dd>git</dd>
            <dd>npm</dd>
            <dd>webpack</dd>
            <dd>gulp</dd>
          </dl>
          <dl>
            <dt>涉猎</dt>
            <dd>Shell Script</dd>
            <dd>Python</dd>
          </dl>
        </section>

        <address className={styles.address}><span>联系我：</span>a-thok@outlook.com</address>
      </section>
    );
  }
}

export default About;
