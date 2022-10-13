function getStyle(element, attr) {
  // const rtnVal = parseInt(window.getComputedStyle(element, null).getPropertyValue(attr), 10);
  // return rtnVal;
  let strValue = '';
  if (document.defaultView && document.defaultView.getComputedStyle) {
    strValue = document.defaultView.getComputedStyle(element, '').getPropertyValue(attr);
  } else if (element.currentStyle) {
    attr = attr.replace(/\-(\w)/g, (strMatch, p1) => p1.toUpperCase()); // eslint-disable-line no-useless-escape
    strValue = element.currentStyle[attr];
  }
  return strValue;
}

function slideUp(elem, speed, fn) {
  if (getStyle(elem, 'display') === 'none' || elem.classList.contains('slideAction')) return;
  elem.classList.add('slideAction');
  if (speed === undefined) speed = 500;
  elem.style.overflow = 'hidden';
  anime({
    targets: elem,
    height: 0,
    marginTop: 0,
    marginBottom: 0,
    paddingTop: 0,
    paddingBottom: 0,
    duration: speed,
    easing: 'easeInOutQuad',
    complete: () => {
      elem.removeAttribute('style');
      elem.classList.remove('slideAction');
      elem.style.display = 'none';
      if (fn !== undefined && typeof fn === 'function') {
        fn();
      }
    }
  });
}

function slideDown(elem, speed, fn) {
  if (getStyle(elem, 'display') !== 'none' || elem.classList.contains('slideAction')) return;
  elem.classList.add('slideAction');
  if (speed === undefined) speed = 500;
  elem.removeAttribute('style');
  let isHide = false;
  if (getStyle(elem, 'display') === 'none') {
    elem.style.display = 'block';
    isHide = true;
  }
  const elHeight = elem.offsetHeight;
  const elMgT = parseInt(getStyle(elem, 'margin-top'), 10);
  const elMgB = parseInt(getStyle(elem, 'margin-bottom'), 10);
  const elPdT = parseInt(getStyle(elem, 'padding-top'), 10);
  const elPdB = parseInt(getStyle(elem, 'padding-bottom'), 10);

  elem.style.overflow = 'hidden';
  elem.style.height = '0px';
  elem.style.marginTop = '0px';
  elem.style.marginBottom = '0px';
  elem.style.paddingTop = '0px';
  elem.style.paddingBottom = '0px';

  anime({
    targets: elem,
    height: elHeight,
    marginTop: elMgT,
    marginBottom: elMgB,
    paddingTop: elPdT,
    paddingBottom: elPdB,
    duration: speed,
    easing: 'easeInOutQuad',
    complete: () => {
      elem.removeAttribute('style');
      elem.classList.remove('slideAction');
      if (isHide) elem.style.display = 'block';
      if (fn !== undefined && typeof fn === 'function') {
        fn();
      }
    }
  });
}
