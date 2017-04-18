---
{
  "title": "试用Grid布局",
  "date": "2017-04-18",
  "tags": ["技术"]
}
---

在我着手搭建这个博客的时候，正好浏览器厂商开始支持CSS中的`display: grid`。于是我便在这个站点中简单地试验了grid的使用。  
目前Chrome、Firefox以及Opera的最新版本均已支持`display: grid`。如果你使用这些浏览器浏览本页面，那么你所看到的页面主框架就是使用grid来进行布局的。

Grid学起来稍微有些费劲，主要是涉及到的属性比较多、取值也比较复杂，光是记忆上就要花费不少功夫。过程中还会接触到一些比较陌生的概念，尤其是对于还没未开始使用`display: flex`的开发人员。  
事实上，grid是CSS里**有史以来**第一个真真正正用来进行页面布局的方法。以往我们所使用的布局方式，例如`float`和`position`，某种意义上而言都是一种“hack”。

我个人只简单地看过一些介绍grid布局的文章，缺乏实践，对于这种布局方式还有许许多多不熟悉的细节。不过熟练使用过flex布局后，在flex的知识基础上一知半解地用一用grid还是挺容易的。  
具体到这个网站，我只是拿它写了一个非常简单的两排单列布局。初版代码如下：


```css
@supports (display: grid) {
  .app {
    display: grid;
    grid-template-areas: "header" "main";
    grid-template-rows: auto 1fr;
    grid-template-columns: 100%;
    justify-items: center;
    min-height: 100vh;
  }

  .header {
    grid-area: header;
  }

  .main {
    grid-area: main;
  }
}
```

看起来是不是还挺简单的？  
这里我们使用`@support`来查询支持此语法的浏览器，只在这些浏览器下使用新的布局方法，这能够方便我们针对这些浏览器做一些相关的样式调整，如果有必要的话。  

在这个版本的代码上线的时候，实际上还没有任何浏览器默认启用grid语法。我也只把这段代码当成一个无关紧要的点缀，几乎没有做任何实际的测试。  
昨天，我完成了对这个博客的一次代码重构。主要是重写了后端服务器以及构建静态页面的方法。现在服务端的逻辑变得非常简单，代码很少，大部分的工作都在构建过程中就完成了。前端的部分，基本上没有做实质的改动，只是调整了目录结构以及小部分细节样式。结果测试的时候，在Firefox下出现了一个问题，`.header`的内容跑到页面中间去了。在调试器里一看，发现`.header`占据了垂直方向上的绝大多数空间。因为这时候浏览器已经启用grid语法了，所以很自然地想到可能是grid布局引起的。更确切地说，应该跟`grid-template-rows: auto 1fr`这句代码有关。

我的理解是，一排（raw）的高度如果是`auto`，那么它的高度应该由内容的高度来决定，内容有多高元素就有多高。  
而`1fr`，在没有其它子项也使用这个单位的时候，表示占据剩下的所有垂直空间。  
所以我的意思是，`.header`自动按内容高度定高，剩下的所有高度都给`.main`。在Opera（Blink）下，渲染结果也确实是这样的。

那Firefox中是怎么回事？我想过可能是我对`auto`的理解有误，但扫了扫文档，也没发现有其它值是用来自适应内容高度的。最后也不知道我是怎么想的，搞来搞去都搞不出Firefox下该怎么做、正觉得烦躁时，“灵机一动”调了一下顺序，写成`grid-template-rows: 1fr auto`，在Firefox就正常了。  
不过这下子轮到Opera出现刚才Firefox所出的那个问题了。怎么办？我对Firefox不是很熟悉，临时在网上查了一个针对性的“hack”，写成下面这样：

```css
  .app {
    grid-template-rows: auto 1fr;
  }

  @-moz-document url-prefix() {
    .app {
      grid-template-rows: 1fr auto;
    }
  }

```

搞定。

不清楚这是不是Gecko的一个bug，直觉上我还是认为Blink的做法才是对的。不过我毕竟对grid布局不熟悉。  
在之后继续学习grid布局的过程里，也许会有什么新的发现和体会。