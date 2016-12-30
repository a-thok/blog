%TITLE 为博客增加文章朗读功能
%DATE 2017-01-07
%TAGS 技术

### Web Speech API

Web Speech API是浏览器上一组相对较新的接口，包含Speech Recognition（语音识别）和Speech Synthesis（语音合成）两大部分。  
简单地说，前者处理的是从语音到文本的转换；后者反之，处理的是从文本到语音的转换。

本文所实现的文章朗读功能基于Speech Synthesis。

### Speech Synthesis的基本使用

Speech Synthesis在全局暴露了两个接口，分别是`window.SpeechSynthesisUtterance`和`window.speechSynthesis`。

#### window.SpeechSynthesisUtterance

`SpeechSynthesisUtterance`是一个构造函数，用来生成语音实例。它接收一个字符串参数，即将要被转换成语音的文本内容：

<pre><code class="language-javascript">
const utterance = new SpeechSynthesisUtterance('Hello World');
</code></pre>

此参数并不是必须的，你也可以像下面这样做：

<pre><code class="language-javascript">
const utterance = new SpeechSynthesisUtterance();
utterance.text = 'Hello World';
</code></pre>

除了`text`以外，`SpeechSynthesisUtterance`的实例还提供了其它的一些属性让开发者控制合成语音的细节，比如音量、语速等。

<pre><code class="language-javascript">
utterance.lang = 'zh-CN'; // 语种，默认等同于html标签的lang属性，如果此属性未设置，则等同于用户代理（浏览器）的设置
utterance.pitch = 1; // 音高，0 - 1，默认1
utterance.rate = 0.95; // 语速，0.1 - 10，默认1
utterance.volumn = 1; // 音量，0 - 1，默认1
</code></pre>

我们还可以监听实例的状态变化：

<pre><code class="language-javascript">
utterance.addEventListener('start', () => console.log('语音朗读已开始'));
utterance.addEventListener('end', () => console.log('语音朗读已结束'));
</code></pre>

#### window.speechSynthesis

生成并配置好语音实例后，我们使用`speechSynthesis`来调用设备的语音服务。

<pre><code class="language-javascript">
speechSynthesis.speak(utterance); // 开始朗读
speechSynthesis.pause(); // 暂停朗读
speechSynthesis.resume(); // 恢复朗读
speechSynthesis.cancel(); // 停止朗读
</code></pre>

多次调用`speak`将形成一个朗读队列，前一个实例朗读完成后继续朗读下一个实例。  
一个设备上同一时间只能有一个实例正在朗读，因此`pause`与`resume`不需要指定参数，它们操作当前正在朗读的那个实例。  
`cancel`将停止朗读并清空整个朗读队列。

`speechSynthesis`上还有三个对应于以上操作的只读属性，让开发者获取语音朗读的状态。  
其中`speaking`与`paused`分别判断是否处于朗读和暂停状态，`pending`则判断朗读队列中是否有等待朗读的语音实例。  

我们还可以通过speechSynthesis.getVoices方法获取当前设备上可用的声音，它返回一个数组。

<pre><code class="language-javascript">
const voices = speechSynthesis.getVoices();
utterance.voice = voices[0]; // 声音，默认将根据lang属性的值自动选择合适的声音
</code></pre>

### 实践

整个Speech Synthesis接口的使用并不复杂，但使用中可能有一些细节需要注意。

#### 移动端性能

调用`speechSynthesis.speak`后，浏览器似乎要先对语音实例进行一些运算处理才能把最终的合成数据呈现给用户。  
这个过程在桌面设备上比较短暂，但在性能相对较差的移动设备上，则会耗费相当的时间。我没有特地计算，但在我自己的*Lumia 830*上，朗读一段2000字左右的文章，感觉上至少等待了半分钟。这样的时长显然是不理想的，在等待过程中，用户可能会以为这个操作根本没有效果。因此需要在视图上给予用户某种形式的反馈，让用户知悉该操作的进度。  
在这个博客里，我采用的方式是改变操作按钮的文本。

<pre><code class="language-javascript">
// ......

const changeBtnText = text => readBtn.textContent = text;

// 根据语音实例的不同状态改变按钮的文本
utterance.addEventListener('start', () => changeBtnText('暂停朗读'));
utterance.addEventListener('pause', () => changeBtnText('继续朗读'));
utterance.addEventListener('resume', () => changeBtnText('暂停朗读'));
utterance.addEventListener('end', () => changeBtnText('重新朗读'));

// 点击朗读按钮时，把按钮文本更改为'处理中...'，让用户知道其操作有效果
readBtn.addEventListener('click', () => {
  changeBtnText('处理中...');
  window.speechSynthesis.speak(utterance);
});
</code></pre>

#### 声音选择

不同的设备上`speechSynthesis.getVoices`会得到不同的结果。默认情况下，最简单、可靠的方式是不设置语音实例的`voice`属性，让浏览器自己选择合适的声音。  
如果想让用户选择自己喜欢的声音，可以将声音列表以下拉框的形式呈现给用户，根据用户的选择去改变`voice`属性。  
一个奇怪的问题是，同一台设备，我在*Opera（Blink）*下取到的声音列表是空的，但在*Edeg*下可以正常取到列表。因此这里多做了一个判断，只有取得到列表时才进行相应的操作。

<pre><code class="language-javascript">
const voices = window.speechSynthesis.getVoices()
  .filter(voice => voice.lang === 'zh-CN');

if (voices.length) {
  const select = document.createElement('select');

  const createAndAppendOption = (value, text) => {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = text;
    select.appendChild(option);
  };

  voices
    .forEach((voice, index) => {
      createAndAppendOption(index, voice.name);
    });

  // .......
}
</code></pre>

用户可能会在朗读开始之前或朗读过程之中选择改变声音。后一种情况稍微复杂一些。  
我原本的想法是，若改变声音时已经在朗读，就进行这样的三步操作：暂停朗读、改变`voice`、恢复朗读。但这个想法显然太乐观了。实践的结果是，语音实例一旦进入朗读队列，再去改变实例的属性并不会影响朗读的效果。  
因此只能把队列清空，再把改变后的实例重新插入队列。这样会导致原本朗读到一半的文本必须从头开始朗读，但我暂时没有找到更好的办法。

<pre><code class="language-javascript">
if (voices.length) {
  // ......

  select.addEventListener('change', (event) => {
    const { value: index } = event.target;
    const voice = index ? voices[index] : null;

    if (speechSynthesis.speaking) {
      speechSynthesis.cancel(); // 这里会改变按钮的文本
      utterance.voice = voice;
      setTimeout(() => {
        // 把操作异步化确保这里的文本改变在其它文本改变后进行
        changeBtnText('处理中...');
        speechSynthesis.speak(utterance);
      });
    } else {
      utterance.voice = voice;
    }
  });

  // ......
}
</code></pre>

#### 非纯文本

这里所说的*非纯文本*，指的是列表、表格、表单这种有语义格式的文本。代码块也可以算是*非纯文本*。这样的文本直接丢进接口里，朗读效果可能会和预期有差距，甚至没办法听懂。  
如果要把朗读做得细致一些，可能要对这样的文本进行一些预处理。

#### 兼容性
Speech Synthesis的兼容性还不错，根据[caniuse](http://caniuse.com/#search=Speech%20Synthesis)上的资料，基本上所有现代浏览器的桌面和移动版本都能完整地支持此接口。  

对于不兼容的浏览器，我们可以做一个简单的回退。或者视图上直接不显示与此功能相关的元素；或者在用户操作后提示用户其浏览器不受支持。  
可以使用`'speechSynthesis' in window`来检测不兼容的浏览器，也可以把相关的代码放入一个`try...catch`之中。


### 感想

* 相对于其它主流的语言，我个人感觉汉语的语速是偏慢的。用默认的语速朗读汉语文本，在我听来太快了，不太自然。因此把`rate`属性的值降低一些可能效果会更好。  
不过不同的声音降低语速后的效果也不尽相同，同样是0.9的语速，我手机上的女声听起来还不错，男声就开始有点失真了。保险起见，`rate`的值最好不要偏离默认值太远。

* 相比我印象里好多年前的情况，现在语音合成技术效果已经很不错了。但朗读的文本一长，机械感还是非常明显，特别是朗读散文、小说一类的东西。目前而言，这个技术可能比较适合用在说明文上。

* 聆听自己写作的文本，会发现有些节奏和自己的期许不一样，比如自己感觉该停顿的地方没有停顿。机器是按照标点符号来停顿的，但我们写句子时，出于种种原因，标点符号的使用并不与文本的节奏完全吻合。如果我们根据机器的朗读去修改标点符号的使用，可能会使我们的文本在视觉上有更合适的节奏感。


### 参考
* [MDN - Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)
* [Web apps that talk - Introduction to the Speech Synthesis API](https://developers.google.com/web/updates/2014/01/Web-apps-that-talk-Introduction-to-the-Speech-Synthesis-API)
