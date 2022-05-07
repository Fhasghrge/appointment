export const getUrlParams = (url) => {
  const arrSearch = url.split('?').pop().split('#').shift().split('&');
  let obj = {};
  arrSearch.forEach((item) => {
    const [k, v] = item.split('=');
    obj[k] = v;
    return obj;
  });
  return obj;
};
