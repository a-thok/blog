var $ = function (selector, context) {
  if ( context === void 0 ) context = document;

  return context.querySelector(selector);
};


if ('speechSynthesis' in window) {
  var readBtn = $('.article-speak');
  readBtn.removeAttribute('hidden');

  var articleText = $('.article-content').textContent;
  var changeBtnText = function (text) { readBtn.textContent = text; };

  var utterance = new SpeechSynthesisUtterance();
  utterance.text = articleText;
  utterance.rate = 0.95;
  utterance.lang = 'zh-CN';

  utterance.addEventListener('start', function () { return changeBtnText('暂停朗读'); });
  utterance.addEventListener('pause', function () { return changeBtnText('继续朗读'); });
  utterance.addEventListener('resume', function () { return changeBtnText('暂停朗读'); });
  utterance.addEventListener('end', function () { return changeBtnText('重新朗读'); });

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
  readBtn.addEventListener('click', function () {
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
  window.addEventListener('beforeunload', function () {
    speechSynthesis.cancel();
  });
}

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3BlYWsuanMiLCJzb3VyY2VzIjpbInNwZWFrLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImNvbnN0ICQgPSAoc2VsZWN0b3IsIGNvbnRleHQgPSBkb2N1bWVudCkgPT4gY29udGV4dC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKTtcclxuXHJcblxyXG5pZiAoJ3NwZWVjaFN5bnRoZXNpcycgaW4gd2luZG93KSB7XHJcbiAgY29uc3QgcmVhZEJ0biA9ICQoJy5hcnRpY2xlLXNwZWFrJyk7XHJcbiAgcmVhZEJ0bi5yZW1vdmVBdHRyaWJ1dGUoJ2hpZGRlbicpO1xyXG5cclxuICBjb25zdCBhcnRpY2xlVGV4dCA9ICQoJy5hcnRpY2xlLWNvbnRlbnQnKS50ZXh0Q29udGVudDtcclxuICBjb25zdCBjaGFuZ2VCdG5UZXh0ID0gKHRleHQpID0+IHsgcmVhZEJ0bi50ZXh0Q29udGVudCA9IHRleHQ7IH07XHJcblxyXG4gIGNvbnN0IHV0dGVyYW5jZSA9IG5ldyBTcGVlY2hTeW50aGVzaXNVdHRlcmFuY2UoKTtcclxuICB1dHRlcmFuY2UudGV4dCA9IGFydGljbGVUZXh0O1xyXG4gIHV0dGVyYW5jZS5yYXRlID0gMC45NTtcclxuICB1dHRlcmFuY2UubGFuZyA9ICd6aC1DTic7XHJcblxyXG4gIHV0dGVyYW5jZS5hZGRFdmVudExpc3RlbmVyKCdzdGFydCcsICgpID0+IGNoYW5nZUJ0blRleHQoJ+aaguWBnOacl+ivuycpKTtcclxuICB1dHRlcmFuY2UuYWRkRXZlbnRMaXN0ZW5lcigncGF1c2UnLCAoKSA9PiBjaGFuZ2VCdG5UZXh0KCfnu6fnu63mnJfor7snKSk7XHJcbiAgdXR0ZXJhbmNlLmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc3VtZScsICgpID0+IGNoYW5nZUJ0blRleHQoJ+aaguWBnOacl+ivuycpKTtcclxuICB1dHRlcmFuY2UuYWRkRXZlbnRMaXN0ZW5lcignZW5kJywgKCkgPT4gY2hhbmdlQnRuVGV4dCgn6YeN5paw5pyX6K+7JykpO1xyXG5cclxuICAvLyBjb25zdCBjaGFuZ2VWb2ljZSA9ICh2b2ljZSkgPT4ge1xyXG4gIC8vICAgaWYgKHNwZWVjaFN5bnRoZXNpcy5zcGVha2luZykge1xyXG4gIC8vICAgICBzcGVlY2hTeW50aGVzaXMuY2FuY2VsKCk7XHJcbiAgLy8gICAgIHV0dGVyYW5jZS52b2ljZSA9IHZvaWNlO1xyXG4gIC8vICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAvLyAgICAgICBjaGFuZ2VCdG5UZXh0KCflpITnkIbkuK0uLi4nKTtcclxuICAvLyAgICAgICBzcGVlY2hTeW50aGVzaXMuc3BlYWsodXR0ZXJhbmNlKTtcclxuICAvLyAgICAgfSk7XHJcbiAgLy8gICB9IGVsc2Uge1xyXG4gIC8vICAgICB1dHRlcmFuY2Uudm9pY2UgPSB2b2ljZTtcclxuICAvLyAgIH1cclxuICAvLyB9O1xyXG5cclxuICAvLyBjb25zdCBjcmVhdGVWb2ljZVNlbGVjdCA9ICh2b2ljZXMpID0+IHtcclxuICAvLyAgIGNvbnN0IGRvY0ZyYWdtZW50ID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xyXG5cclxuICAvLyAgIGNvbnN0IGxhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGFiZWwnKTtcclxuICAvLyAgIGxhYmVsLnRleHRDb250ZW50ID0gJ+WjsOmfs++8mic7XHJcblxyXG4gIC8vICAgY29uc3Qgc2VsZWN0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2VsZWN0Jyk7XHJcbiAgLy8gICBzZWxlY3QuY2xhc3NMaXN0LmFkZCgnZm9ybScpO1xyXG5cclxuICAvLyAgIHZvaWNlcy5mb3JFYWNoKCh2b2ljZSwgaW5kZXgpID0+IHtcclxuICAvLyAgICAgY29uc3Qgb3B0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnb3B0aW9uJyk7XHJcbiAgLy8gICAgIG9wdGlvbi50ZXh0Q29udGVudCA9IHZvaWNlLm5hbWUucmVwbGFjZSgvKC4qKVxccy1cXHMuKi8sICckMScpO1xyXG4gIC8vICAgICBvcHRpb24udmFsdWUgPSBpbmRleDtcclxuICAvLyAgICAgc2VsZWN0LmFwcGVuZENoaWxkKG9wdGlvbik7XHJcbiAgLy8gICB9KTtcclxuXHJcbiAgLy8gICBkb2NGcmFnbWVudC5hcHBlbmRDaGlsZChsYWJlbCk7XHJcbiAgLy8gICBkb2NGcmFnbWVudC5hcHBlbmRDaGlsZChzZWxlY3QpO1xyXG5cclxuICAvLyAgIGFydGljbGVSZWFkLmluc2VydEJlZm9yZShkb2NGcmFnbWVudCwgcmVhZEJ0bik7XHJcblxyXG4gIC8vICAgcmV0dXJuIHNlbGVjdDtcclxuICAvLyB9O1xyXG5cclxuICAvLyBsZXQgdm9pY2VzO1xyXG4gIC8vIHZvaWNlcyA9IHNwZWVjaFN5bnRoZXNpcy5nZXRWb2ljZXMoKTtcclxuICAvLyBpZiAodm9pY2VzLmxlbmd0aCkge1xyXG4gIC8vICAgY29uc3Qgc2VsZWN0ID0gY3JlYXRlVm9pY2VTZWxlY3Qodm9pY2VzKTtcclxuICAvLyAgIHNlbGVjdC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCAoZXZlbnQpID0+IHtcclxuICAvLyAgICAgY29uc3Qgdm9pY2UgPSB2b2ljZXNbZXZlbnQudGFyZ2V0XTtcclxuICAvLyAgICAgY2hhbmdlVm9pY2Uodm9pY2UpO1xyXG4gIC8vICAgfSk7XHJcbiAgLy8gfSBlbHNlIHtcclxuICAvLyAgIHNwZWVjaFN5bnRoZXNpcy5hZGRFdmVudExpc3RlbmVyKCd2b2ljZXNjaGFuZ2VkJywgKCkgPT4ge1xyXG4gIC8vICAgICB2b2ljZXMgPSBzcGVlY2hTeW50aGVzaXMuZ2V0Vm9pY2VzKCk7XHJcbiAgLy8gICAgIGlmICh2b2ljZXMubGVuZ3RoKSB7XHJcbiAgLy8gICAgICAgY29uc3Qgc2VsZWN0ID0gY3JlYXRlVm9pY2VTZWxlY3Qodm9pY2VzKTtcclxuICAvLyAgICAgICBzZWxlY3QuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgKGV2ZW50KSA9PiB7XHJcbiAgLy8gICAgICAgICBjb25zdCB2b2ljZSA9IHZvaWNlc1tldmVudC50YXJnZXRdO1xyXG4gIC8vICAgICAgICAgY2hhbmdlVm9pY2Uodm9pY2UpO1xyXG4gIC8vICAgICAgIH0pO1xyXG4gIC8vICAgICB9XHJcbiAgLy8gICB9KTtcclxuICAvLyB9XHJcblxyXG4gIC8vIHJlYWRpbmcgY29udHJvbFxyXG4gIHJlYWRCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XHJcbiAgICBpZiAoc3BlZWNoU3ludGhlc2lzLnBhdXNlZCkge1xyXG4gICAgICBzcGVlY2hTeW50aGVzaXMucmVzdW1lKCk7XHJcbiAgICB9IGVsc2UgaWYgKHNwZWVjaFN5bnRoZXNpcy5zcGVha2luZykge1xyXG4gICAgICBzcGVlY2hTeW50aGVzaXMucGF1c2UoKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJlYWRCdG4udGV4dENvbnRlbnQgPSAn5aSE55CG5LitLi4uJztcclxuICAgICAgc3BlZWNoU3ludGhlc2lzLnNwZWFrKHV0dGVyYW5jZSk7XHJcbiAgICB9XHJcbiAgfSk7XHJcblxyXG4gIC8vIGRvbid0IGtub3cgd2h5LCBidXQgdGhlIHNwZWVjaCBtaWdodCBjb250aW51ZSBkaXNwaXRlIHRoZSBwYWdlIGJlaW5nIHJlZnJlc2hlZCBvciBjbG9zZWRcclxuICAvLyBzbyBJJ3ZlIHRvIGNhbmNlbCBpdCBtYW51YWxseVxyXG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdiZWZvcmV1bmxvYWQnLCAoKSA9PiB7XHJcbiAgICBzcGVlY2hTeW50aGVzaXMuY2FuY2VsKCk7XHJcbiAgfSk7XHJcbn1cclxuIl0sIm5hbWVzIjpbImNvbnN0Il0sIm1hcHBpbmdzIjoiQUFBQUEsR0FBSyxDQUFDLENBQUMsR0FBRyxTQUFBLENBQUMsUUFBUSxFQUFFLE9BQWtCLEVBQUUsQUFBRyxDQUFoQjttQ0FBQSxHQUFHLFFBQVE7QUFBSztTQUFBLE9BQU8sQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDO0FBQUEsQ0FBQSxDQUFDOzs7QUFHNUUsSUFBSSxpQkFBaUIsSUFBSSxNQUFNLEVBQUU7RUFDL0JBLEdBQUssQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLENBQUM7RUFDcEMsT0FBTyxDQUFDLGVBQWUsQ0FBQyxRQUFRLENBQUMsQ0FBQzs7RUFFbENBLEdBQUssQ0FBQyxXQUFXLEdBQUcsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLENBQUMsV0FBVyxDQUFDO0VBQ3REQSxHQUFLLENBQUMsYUFBYSxHQUFHLFNBQUEsQ0FBQyxJQUFJLEVBQUUsQUFBRyxFQUFFLE9BQU8sQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQzs7RUFFaEVBLEdBQUssQ0FBQyxTQUFTLEdBQUcsSUFBSSx3QkFBd0IsRUFBRSxDQUFDO0VBQ2pELFNBQVMsQ0FBQyxJQUFJLEdBQUcsV0FBVyxDQUFDO0VBQzdCLFNBQVMsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO0VBQ3RCLFNBQVMsQ0FBQyxJQUFJLEdBQUcsT0FBTyxDQUFDOztFQUV6QixTQUFTLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLFNBQUEsR0FBRyxBQUFHLFNBQUEsYUFBYSxDQUFDLE1BQU0sQ0FBQyxHQUFBLENBQUMsQ0FBQztFQUNqRSxTQUFTLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLFNBQUEsR0FBRyxBQUFHLFNBQUEsYUFBYSxDQUFDLE1BQU0sQ0FBQyxHQUFBLENBQUMsQ0FBQztFQUNqRSxTQUFTLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxFQUFFLFNBQUEsR0FBRyxBQUFHLFNBQUEsYUFBYSxDQUFDLE1BQU0sQ0FBQyxHQUFBLENBQUMsQ0FBQztFQUNsRSxTQUFTLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxFQUFFLFNBQUEsR0FBRyxBQUFHLFNBQUEsYUFBYSxDQUFDLE1BQU0sQ0FBQyxHQUFBLENBQUMsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztFQTZEL0QsT0FBTyxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxTQUFBLEdBQUcsQUFBRztJQUN0QyxJQUFJLGVBQWUsQ0FBQyxNQUFNLEVBQUU7TUFDMUIsZUFBZSxDQUFDLE1BQU0sRUFBRSxDQUFDO0tBQzFCLE1BQU0sSUFBSSxlQUFlLENBQUMsUUFBUSxFQUFFO01BQ25DLGVBQWUsQ0FBQyxLQUFLLEVBQUUsQ0FBQztLQUN6QixNQUFNO01BQ0wsT0FBTyxDQUFDLFdBQVcsR0FBRyxRQUFRLENBQUM7TUFDL0IsZUFBZSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQztLQUNsQztHQUNGLENBQUMsQ0FBQzs7OztFQUlILE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxjQUFjLEVBQUUsU0FBQSxHQUFHLEFBQUc7SUFDNUMsZUFBZSxDQUFDLE1BQU0sRUFBRSxDQUFDO0dBQzFCLENBQUMsQ0FBQztDQUNKOyJ9
