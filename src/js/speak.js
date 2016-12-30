const $ = (selector, context = document) => context.querySelector(selector);

// text to read
const article = $('.article-content');
const articleRead = $('.article-read');
const readBtn = $('button', articleRead);
const changeBtnText = (text) => { readBtn.textContent = text; };
const LANG = 'zh-CN';

if ('speechSynthesis' in window) {
  const utterance = new window.SpeechSynthesisUtterance(article.textContent);
  utterance.rate = 0.95;
  utterance.lang = LANG;
  utterance.addEventListener('start', () => changeBtnText('暂停朗读'));
  utterance.addEventListener('pause', () => changeBtnText('继续朗读'));
  utterance.addEventListener('resume', () => changeBtnText('暂停朗读'));
  utterance.addEventListener('end', () => changeBtnText('重新朗读'));

  const voices = window.speechSynthesis.getVoices()
    .filter(voice => voice.lang === LANG);

  if (voices.length) {
    const docFragment = document.createDocumentFragment();

    const label = document.createElement('label');
    label.textContent = '声音：';
    docFragment.appendChild(label);

    const select = document.createElement('select');
    select.classList.add('form');
    docFragment.appendChild(select);

    const createAndAppendOption = (value, text) => {
      const option = document.createElement('option');
      option.value = value;
      option.textContent = text;
      select.appendChild(option);
    };

    createAndAppendOption('', 'Default');

    voices
      .forEach((voice, index) => {
        createAndAppendOption(index, voice.name.replace(/(.*)\s-\s.*/, '$1'));
      });

    select.addEventListener('change', (event) => {
      const { value: index } = event.target;
      const voice = index ? voices[index] : null;

      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
        utterance.voice = voice;
        setTimeout(() => {
          changeBtnText('处理中...');
          window.speechSynthesis.speak(utterance);
        });
      } else {
        utterance.voice = voice;
      }
    });

    articleRead.insertBefore(docFragment, readBtn);
  }

  // reading control
  readBtn.addEventListener('click', () => {
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    } else if (window.speechSynthesis.speaking) {
      window.speechSynthesis.pause();
    } else {
      readBtn.textContent = '处理中...';
      window.speechSynthesis.speak(utterance);
    }
  });

  // don't know why, but the speech might continue dispite the page being refreshed or closed
  // so I've to cancel it manually
  window.addEventListener('beforeunload', () => {
    window.speechSynthesis.cancel();
  });
} else {
  readBtn.addEventListener('click', () => {
    /* eslint-disable no-alert */
    alert('抱歉，您的浏览器不支持此功能');
  });
}
