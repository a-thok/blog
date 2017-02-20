---
{
  "title": "用Node.js编写一个简单的静态站点生成器",
  "date": "2017-01-11",
  "tags": ["技术"]
}
---

搭建一个博客有很多种办法。作为一个Web开发人员，我倾向于尽可能地“自己动手丰衣足食”。

考虑到我目前唯一熟悉的语言是Javascript，我希望这个博客的后端是基于Node.js的，所以首先排除了Wordpress一类的方案。  
一个简单的博客，所需要实现的后端功能并不复杂。虽然我从事的是前端开发，但我感觉这种程度的后端代码应该在我的能力范围之类，因此也没有直接采用Ghost这种使用Node.js编写的CMS。

现在似乎流行一种静态的博客搭建方案，不使用数据库，而是通过某种办法直接从纯文本生成最终的静态页面。比较具有代表性的平台应该是GitHub Pages。  
我了解到Github Pages使用的是一个叫Jekyll的生成器。虽然我并不准备把我的博客托管在GitHub Pages上，但把它的生成器借来用一用应该还是不错的。Jekyll是开源的。但仔细了解后，发现Jekyll是用Ruby写的，我的胃口马上没了。

最终我回归了传统的方式，使用Node.js上的express框架、以及MongoDB作为数据库，编写了这个博客的第一个版本。

### 使用数据库的问题

就展示文章而言，数据库的操作非常简单，无非是查查文章、分分页面。  
但怎么把文章发出去就有些麻烦了。我需要专门在前端写一个界面来管理和发布文章，事实上我也确实用Angular写了这么一个应用。为了使用起来舒服，我不得不花时间把它“设计”得漂亮一些；为了安全性，我必须在前后端交互的时候设置一些口令之类的东西。总的来说，感觉很不轻量。只是为了发布一篇文章却要额外做许多事情。  
这时候，那种静态的方案又开始在我的脑子里蹦来蹦去了。对一个开发人员而言，只需要写一个Markdown文档就能完成文章的发布，确实是一个很有吸引力的做法。

### 基于JS的第三方生成器

在Jekyll以外，其实还有很多很多的[静态站点生成器](https://www.staticgen.com)。其中有不少是使用JS编写的。我试用了其中比较流行的一个，发现它非常复杂。  
这种复杂主要不是指使用上的难度（虽然确实有些麻烦），而是它做了很多你并不需要它去做的事。当然，作为一个通用方案，它必须考虑各种各样的使用场景，这没有问题。但如果你需要的只是一个简单的核心功能，使用这样的第三方工具就有种杀鸡用牛刀的笨重感，即没有必要也不灵活。

### 自己动手丰衣足食

我不清楚这些第三方的生成器究竟做了多少事情、怎么做的，但我一开始接触这个概念时，我就直觉它实现起来非常简单。  
最终我自己用Node.js写了一个脚本来实现这个功能，整个脚本算上空行也只有38行。当然，我的实现肯定不如成熟的第三方方案来得完备、可靠，但对这个简单的个人博客来说，真的已经够用了。

### 实现

在动手写代码之前，先思考一下我们到底需要一个怎样的功能。

我的设想是这样的：

1. 我有一个专门的文件夹用来放置我的博客文章，每一篇文章分别是一个Markdown文档，我需要一个脚本把这些Markdown文档自动转换为HTML文档
2. 我将事先拥有一个HTML模板，这个模板包含了文章以外的内容，这些内容对于每个文章页面都是不变的
3. 我会使用一个第三方的工具来做Markdown到HTML的转换，把转换后的内容插入模板内，在预定的目录里写入一个对应的HTML文件

```javascript
const fs = require('fs');
const path = require('path');
const marked = require('marked');

const POST_DIR_PATH = 'path/to/posts';
const filenames = fs.readdirSync(POST_DIR_PATH);
const template = fs.readFileSync('/path/to/tempalte', 'utf-8');

filenames.forEach((filename) => {
  const postMarkdown =  fs.readdirSync(path.join(POST_DIR_PATH, filename), 'utf-8');
  const postHTML = marked(postMarkdown);
  const html = template.replace(/\{post\}/, postHTML); // 这里只是简单地查找替换，更复杂的情况可以使用成熟的第三方模板
  fs.writeFileSync('/path/to/html', html);
});
```

为了便于阅读，上面代码里涉及到文件操作的，都使用了同步的方式。  
这样短短的一段代码就已经能基本实现我们所设想的功能了。

不过这里有一个问题是，除了文章详情页，我们的博客还需要每一页的文章列表。另外，我这个博客的列表页还有用标签筛选的功能。  
我们当然可以编写额外的代码来生成这些列表页面，但文章和标签一多的话，这种做法感觉上就有点累赘。想来想去，最后我决定把Markdonw文件里提取出的内容以数组的形式写入一个json文件里，而不是直接生成HTML文件。生成HTML文件的步骤可以放到服务器的请求里。

```javascript
// ...

const posts = JSON.parse(
  fs.readFileSync('./posts.json'), 'utf-8')
);

server.get('/', (req, res) => {
  const PER_PAGE = 10; // 每页文章数
  const { p, tag } = req.query; // 请求的页数和标签

  const startIndex = p ? PER_PAGE * (p - 1) : 0;
  const result = posts
    .filter(post => !tag || post.tags.includes(tag)) // 用标签做筛选
    .sort((a, b) => new Date(b.date) - new Date(a.date)) // 按时间排序
    .slice(startIndex, startIndex + PER_PAGE); // 分页

  // 把文章数据扔进ejs模板里
  res.render('index', {
    posts: result.map(post => markPost(post, true)),
  });
});
```

由于我在列表页必须显示文章的摘要，因此Markdown到HTML的转换（markPost）也放到服务器请求里操作。

实际代码里我们应用使用异步的方式来操作文件读写，这样性能更好。  
这里我使用Promise封装Node.js的原生方法，然后使用Promise.all来控制流程。完整的代码如下：

```javascript
const fs = require('fs');
const path = require('path');

const POST_DIR_PATH = 'path/to/posts';

// 处理读取出来的Markdown文本
const getPostInfo = (filename, postStr) => {
  // 提取Markdown文档的文件名，作为文章详情页的url路径
  // 在Markdonw文档里按自己喜欢的格式定义好标题、日期、标签，在这一步把它们抽取出来
  const matches = postStr.match(/%TITLE\s*(.*)\s*%DATE(.*)\s*%TAGS\s*(.*)\s*([\s\S]*)/);
  return {
    name: path.basename(filename, '.md'),
    title: matches[1],
    date: matches[2],
    tags: matches[3].split(','),
    content: matches[4],
  };
};

// 用Promise封装fs.readFile
const readPost = filename => new Promise((resolve, reject) => {
  fs.readFile(filename, 'utf-8', (error, str) => {
    if (error) {
      reject(error);
    } else {
      resolve(getPostInfo(filename, str));
    }
  });
});

// 读取Markdown文件
const filenames = fs.readdirSync(POST_DIR_PATH);
Promise.all(
  filenames.map(filename => readPost(path.join(POST_DIR_PATH, filename)))
)
  .then((posts) => {
    fs.writeFileSync(
      path.resolve(__dirname, 'posts.json'),
      JSON.stringify(posts, null, 2)
    );
  })
  .catch(error => console.log(error));
```