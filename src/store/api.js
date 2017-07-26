/**
 * fetchList
 * @param {number} page
 * @param {string} tag
 */
export const fetchList = (page, tag) =>
  fetch(`/json/blog?page=${page}&tag=${encodeURIComponent(tag)}`)
    .then(res => res.json())
    .then(({ success, result }) => {
      if (success) return result;
      throw Error('error');
    });


/**
 * fetchPost
 * @param {string} name
 */
export const fetchPost = name =>
  fetch(`/json/blog/${name}`)
    .then(res => res.json())
    .then(({ success, result }) => {
      if (success) return result;
      throw Error('error');
    });

export const fetchTalk = () =>
  fetch('/json/talk')
    .then(res => res.json())
    .then(({ success, result }) => {
      if (success) return result;
      throw Error('error');
    });
