---
{
  "title": "用InfernoJS编写一个同构应用",
  "date": "2017-02-25",
  "tags": ["技术"]
}
---

在使用Service Worker给这个博客添加离线浏览功能的时候，我遇到了不少枝节上的问题。  
这些问题的详细将在另一篇文章中讨论。总而言之，为了更精细地控制离线缓存，我必须让这个博客具备前端渲染的能力。目前它是纯后端渲染的。

有许多成熟的第三方工具够帮助我们高效地进行前端渲染，怎么选择是一个问题。我首要考虑的主要有两点：

1. 轻量。因为这个博客本身是一个非常简单的站点，离线浏览只是一个渐进式的增强，如果为了这种渐进优化而把整个站点改造得过于笨重、复杂，就本末倒置了。  
2. 同构。博客这种站点是以内容为核心的，交互不太重要。尽快、并且尽可能地在各种环境下都能把内容呈现出来，应该是第一要务。如果完全依赖前端进行渲染，在很多性能相对比较差的设备上，比如大多数手机，体验可能就不太好。当JS不可用时，内容更是完全不可访问。此外，这对搜索引擎可能也不够友好。

Angular干的事情太多了，React就体积而言也不太轻量，Vue的某些细节我还不太熟悉导致我对它的服务端渲染有所畏惧……  
综合考虑后，最终我选择了Inferno这个不太主流的解决方案。

Inferno以性能著称，在官方提供的测试数据中，其渲染速度非常接近原生JS。  
它是一个类React框架，核心API与React大体兼容，如果有过React的开发经验，使用起来问题不大。并且它非常小巧，压缩后只有9KB。  
比较大的缺点应该是兼容性。对于IE，官方只兼容到它的最新版本IE11。不过只要把`Map`和`WeakMap`这两个接口垫一下，其实是可以继续向下兼容的。并且在实现了服务端渲染后，于IE8这种老旧的浏览器下也能够正常地访问基本内容。

这不是一篇关于React或者Inferno的教程，因此以下的内容并不会详细地解释框架的具体使用。  
这里我们关注的是如何在维持轻量的情况下，把这个博客改造成一个JavaScript同构应用。

### 客户端

客户端的代码写起来和普通的React应用区别不大，有几个点需要注意。

#### 状态传递和更新
在不使用Redux来管理状态的情况下，状态不太容易在路由组件之间做传递和更新。  
可以借助`Inferno.cloneVNode`（对应`React.cloneElement`）来把状态写入`children`所对应的组件里，这里我把父组件的所有`state`都传递下去。对于状态比较复杂的应用，考虑到性能，可能需要对`children`做一个判断然后有选择性地传递状态。不过真到那个程度了，直接引入Redux之类的状态管理器可能会是更明智的做法。  
除了`state`之外，我还传入了一个简单的`update`方法让子组件触发父组件的状态更新。同样的，这种做法很简便，但并不适合状态更复杂的应用。

除了使用`Inferno.cloneVNode`之外，也可以用`context`接口来做状态的传递和更新。不过这个接口在React中是不鼓励使用的，它不是一个正式的公共接口。

```javascript
class App extends Component {
  constructor() {
    super();
    this.update = this.update.bind(this);
  }

  update(updates) {
    this.setState({ ...this.state, ...updates });
  }

  render() {
    const Child = Inferno.cloneVNode(this.props.children, {
      ...this.props,
      ...this.state,
      update: this.update,
    });

    return (
      <div className="app">
        <Header />
        <div className="page-body">
          {Child}
          <Aside />
        </div>
      </div>
    );
  }
}
```

#### 浏览器接口的调用
组件是前后端共用的，因而在组件中调用浏览器接口时，要特别注意调用的时机。  
一般来说，应该把这类接口调用放置在`componentDidMount`和`componentWillUnmount`这两个生命周期方法中。因为组件只有在到达浏览器后，才可能触发装载（mount）和卸载（unmount）这两个事件。  
相反地，如果在`componentWillMount`或者`render`中调用浏览器端的接口，那么服务端在渲染时就会报错。因为这两个方法在前后端渲染的过程中都会触发。

```javascript
class Post extends Component {
  // ...

  componentWillMount() {
    // 这里会报错
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance();
      // ...
    }
  }

  componentDidMount() {
    // 应该写在这里
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance();
      // ...
    }
  }

  componentWillUnmount() {
    speechSynthesis.cancel();
  }


  // ...
}
```

#### 初始状态
应用首次加载时，应该接收服务端所给的一个初始状态对象，立刻以这个初始状态来渲染应用。上边的代码里，App组件在给子路由组件传递`props`时，所传递的`this.props`就是App组件所接收到的初始状态。  
Inferno和React会把这个状态同服务端已经渲染好的DOM结构做对比，只进行必要的更新。如果没有这个初始状态，应用一开始的状态将是空的，导致服务端渲染好的数据重新被清空。

```javascript
// createRoutes.jsx
const createRoutes = initialState => (
  <Route path="/" component={App} {...initialState}>
    <IndexRoute component={PostListView} />
    <Route path="posts" component={PostListView} key="posts" />
    <Route path="post/:name" component={PostView} key="post" />
  </Route>
);

// main.jsx
Inferno.render((
  <Router history={browserHistory}>
    {createRoutes(window.__INITIAL_STATE__)}
  </Router>
), document.getElementById('root'));
```

这里我碰到了一个烦人的小问题。当我切换路由的时候，Inferno一直对我报一个`key`相关的错误。  
开始我以为是哪个地方在`map`组件时忘记写`key`了，但几番检查后并没找到缺漏，报错信息里也看不出问题出在哪。  
后来我想这可能是路由组件本身的问题。我的两个路由组件，虽然一个是文章列表、一个是文章详情，但其实DOM结构都是一样的。这可能导致Inferno在路由切换时，不是卸载旧路由组件再加载新路由组建，而是直接在旧的组件上做更新，因此就产生了`key`的问题。当我给两个`Route`组件各自指定一个`key`之后，这个问题便解决了。  

### 服务端

#### 页面渲染
同构应用的服务端渲染，在概念上理解起来很简单。无非是框架提供了一个服务端的渲染方法，能够把组件渲染成一个对应的html字符串，然后我们把这个字符串与完整的页面模板拼合起来发送给浏览器就好了。  
但应用变得复杂的时候，实际操作起来可能也会有些棘手。

具体到这个博客，做服务端渲染时我只需要关心两件事，一个是路由的判断，另一个是应用的初始状态。

路由方面，因为没有什么过分复杂的细节，直接把inferno-router的官方示例搬过来就可以。  
前面我们在编写客户端代码的时候，已经把路由组件包裹在一个接受初始状态的函数里，在服务端我们也一样调用这个函数并传入初始的状态。

```javascript
// 这是一个Node.js/Express应用

// 这一步，根据所请求的路由，准备好必须的状态（数据）
server.get('/post/:name', (req, res, next) => {
  const { name } = req.params;
  const post = markPost(
    postData.find(post => post.name === name)
  );

  req.partialState = { post };
  return next();
});

// 这一步，把上一步拿到的数据并入完整的状态结构里，得到完整的初始状态
// （还是那句话，状态复杂时请使用redux等成熟的第三方工具）
// 接着调用Inferno-router以及Inferno各自提供的服务端方法，得到一个html字符串
// 把这个字符串扔进模板里，得到完整的页面后返回给客户端
server.use((req, res) => {
  const initialState = {
    posts: [],
    post: {},
    ...req.partialState
  };

  const routes = createRoutes(initialState);
  const renderProps = match(routes, req.originalUrl);

  if (renderProps.redirect) {
    return res.redirect(renderProps.redirect);
  }
  const content = InfernoServer.renderToString(<RouterContext {...renderProps} />);
  return res.send(renderPage(content, initialState));
});
```

我的页面模板只是一个简单模板字符串
除了组件渲染出来的html字符串外，记得把初始状态本身也写入页面中以供客户端初始化应用

```javascript
export const renderPage = (content, initialState) => (`<!DOCTYPE html>
<html lang="zh-cmn-Hans">
<head>
  <!-- ... -->
  <title>A Talk To Me</title>
  <!-- ... -->
  <!--[if lt IE 9]>
    <script src="https://cdn.bootcss.com/html5shiv/3.7.3/html5shiv.min.js"></script>
    <script src="https://cdn.bootcss.com/es5-shim/4.5.9/es5-shim.min.js"></script>
    <script src="https://cdn.bootcss.com/es5-shim/4.5.9/es5-sham.min.js"></script>
    <script src="https://cdn.bootcss.com/ie8/0.4.1/ie8.js"></script>
  <![endif]-->
  <link rel="stylesheet" href="/style.css">
  <script>var __INITIAL_STATE__ = ${JSON.stringify(initialState)}</script>
  <script src="https://cdn.polyfill.io/v2/polyfill.min.js?features=Object.assign,Promise,fetch,Map,WeakMap" defer></script>
  <script src="/app.js" defer></script>
</head>
<body>
  <div id="root">${content}</div>
</body>
</html>`);
```

[polyfill.io](https://polyfill.io/v2/docs/)是一个很方便的垫片服务，它会根据浏览器的版本自动返回所必须的垫片。  
老式的偷懒做法是，不管三七二十一把所有可能需要的垫片都发送给客户端，这样就导致用户在最新浏览器下也必须下载一大堆根本不需要的字节，这显然是不理想的。  
但不知道polyfill.io在国内的网络环境下表现如何，我还没有仔细做测试（我习惯挂着VPN）。

所有带src的script标签上都指定了`defer`这个属性，这可以防止脚本文件的加载阻塞页面的渲染。  
我们的页面在服务端就已经完整渲染出来，并不需要依赖JS文件来呈现内容，JS只是用来增强交互。因此可以像这样把所有的JS推迟到页面加载完成后再执行，这样可以让内容尽可能早地呈现。  
把`script`标签写在`head`里，而不是像一般做法那样写在`body`的最后，是为了让浏览器尽早下载相关文件。虽然JS还不会被真正运行，但是当浏览器读到`script`标签后，它就已经在后台开始下载文件。

关于为什么使用`defer`而不是`async`属性，可以阅读文章最后的参考篇目。

#### 区分请求类型
在同构以后，服务端上的一个问题是，我们现在需要区分客户端的两种请求。  
一种请求的是页面，也就是上面的代码所展示的渲染页面的过程。  
另一种请求的是json数据。页面到达客户端后，浏览器上运行着一个单页面应用，在这个应用上点击文章链接，不会再向服务端请求完整的页面，而只请求具体的文章数据，由客户端自己来做渲染。

要解决这个问题，我们可以在后端多分出一套路由。每个请求都有两个版本，一个响应页面请求，另一个响应json数据请求。  
但我们也可以做得更简单一点，给所有请求约定一个统一的参数，用来判断请求的类型。比如说，当请求的是`/post`时，返回页面；而当请求的是`/post?json=true`时，返回json数据。

```javascript
server.get('/post/:name', (req, res, next) => {
  const { json } = req.query;
  
  //...

  if (json) {
    return res.status(200).send({
      success: true,
      post,
    });
  }

  req.partialState = { post };
  return next();
});

```

### 总结

以上，我们便成功地使用Inferno这个轻量但高效的前端JS框架把这个博客重构成了一个前后端共同渲染的同构应用。  
它的前端渲染功能能够使我们在使用Service Worker做离线浏览功能时，达到更精细、理想的效果。

由于我担心还有一些细节上的粗糙未被发现与修正，因此这个重构的版本暂时还没有部署。我考虑再用一两天时间做打磨，之后再上线。


### 参考
* [Inferno - Doc](https://Infernojs.org/docs/guides/installation)
* [Prefer DEFER Over ASYNC](https://calendar.perfplanet.com/2016/prefer-defer-over-async/)
