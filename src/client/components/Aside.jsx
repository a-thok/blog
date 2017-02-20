/** @jsx Inferno */
import Inferno from 'inferno';

const Aside = () => (
  <aside className="page-aside">
    <div className="page-aside-panel">
      <h2>关于我</h2>
      <p>赚钱的时候最喜欢敲代码，不赚钱的时候最喜欢学语言，什么都不喜欢的时候最喜欢写文章。</p>
      <p>希望永远不被任何人记住，随时转身消失在世界里。</p>
    </div>
    <div className="page-aside-panel">
      <h2>技能</h2>
      <dl>
        <dt>熟练</dt>
        <dd>JavaScript/ES6</dd>
        <dd>HTML</dd>
        <dd>CSS/CSS3</dd>
        <dd>React</dd>
        <dd>jQuery</dd>
      </dl>
      <dl>
        <dt>熟悉</dt>
        <dd>Vue</dd>
        <dd>Angular</dd>
        <dd>HTML5</dd>
        <dd>Bootstrap</dd>
        <dd>Node.js</dd>
        <dd>Express</dd>
        <dd>MongoDB</dd>
        <dd>Typescript</dd>
      </dl>
      <dl>
        <dt>工具</dt>
        <dd>git</dd>
        <dd>npm</dd>
        <dd>webpack</dd>
        <dd>gulp</dd>
      </dl>
    </div>
  </aside>
);

export default Aside;
