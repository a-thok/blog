const $ = (selector, context = document) => context.querySelector(selector);

const readBtn = $('.article-speak');

if ('speechSynthesis' in window) {
  const articleText = $('.article-content').textContent;
  const changeBtnText = (text) => { readBtn.textContent = text; };

  const utterance = new SpeechSynthesisUtterance();
  utterance.text = articleText;
  utterance.rate = 0.95;
  utterance.lang = 'zh-CN';

  utterance.addEventListener('start', () => changeBtnText('暂停朗读'));
  utterance.addEventListener('pause', () => changeBtnText('继续朗读'));
  utterance.addEventListener('resume', () => changeBtnText('暂停朗读'));
  utterance.addEventListener('end', () => changeBtnText('重新朗读'));

  // const changeVoice = (voice) => {
  //   if (speechSynthesis.speaking) {
  //     speechSynthesis.cancel();
  //     utterance.voice = voice;
  //     setTimeout(() => {
  //       changeBtnText('处理中...');
  //       speechSynthesis.speak(utterance);
  //     });
  //   } else {
  //     utterance.voice = voice;
  //   }
  // };

  // const createVoiceSelect = (voices) => {
  //   const docFragment = document.createDocumentFragment();

  //   const label = document.createElement('label');
  //   label.textContent = '声音：';

  //   const select = document.createElement('select');
  //   select.classList.add('form');

  //   voices.forEach((voice, index) => {
  //     const option = document.createElement('option');
  //     option.textContent = voice.name.replace(/(.*)\s-\s.*/, '$1');
  //     option.value = index;
  //     select.appendChild(option);
  //   });

  //   docFragment.appendChild(label);
  //   docFragment.appendChild(select);

  //   articleRead.insertBefore(docFragment, readBtn);

  //   return select;
  // };

  // let voices;
  // voices = speechSynthesis.getVoices();
  // if (voices.length) {
  //   const select = createVoiceSelect(voices);
  //   select.addEventListener('change', (event) => {
  //     const voice = voices[event.target];
  //     changeVoice(voice);
  //   });
  // } else {
  //   speechSynthesis.addEventListener('voiceschanged', () => {
  //     voices = speechSynthesis.getVoices();
  //     if (voices.length) {
  //       const select = createVoiceSelect(voices);
  //       select.addEventListener('change', (event) => {
  //         const voice = voices[event.target];
  //         changeVoice(voice);
  //       });
  //     }
  //   });
  // }

  // reading control
  readBtn.addEventListener('click', () => {
    if (speechSynthesis.paused) {
      speechSynthesis.resume();
    } else if (speechSynthesis.speaking) {
      speechSynthesis.pause();
    } else {
      readBtn.textContent = '处理中...';
      speechSynthesis.speak(utterance);
    }
  });

  // don't know why, but the speech might continue dispite the page being refreshed or closed
  // so I've to cancel it manually
  window.addEventListener('beforeunload', () => {
    speechSynthesis.cancel();
  });
} else {
  readBtn.addEventListener('click', () => {
    /* eslint-disable no-alert */
    alert('抱歉，您的浏览器不支持此功能');
  });
}
