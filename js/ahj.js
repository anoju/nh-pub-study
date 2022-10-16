function getStyle(element, attr) {
  let strValue = '';
  if (document.defaultView && document.defaultView.getComputedStyle) {
    strValue = document.defaultView.getComputedStyle(element, '').getPropertyValue(attr);
  } else if (element.currentStyle) {
    attr = attr.replace(/\-(\w)/g, (strMatch, p1) => p1.toUpperCase());
    strValue = element.currentStyle[attr];
  }
  return strValue;
}

function getSiblings(e) {
  const siblings = [];
  if (!e.parentNode) {
    return siblings;
  }
  let sibling = e.parentNode.firstChild;
  while (sibling) {
    if (sibling.nodeType === 1 && sibling !== e) {
      siblings.push(sibling);
    }
    sibling = sibling.nextSibling;
  }
  return siblings;
}

const slideAry = [];
function slideAryChk(elem) {
  const _aryIdx = slideAry.findIndex((item) => item.el === elem);
  if (_aryIdx > -1) {
    slideAnime = slideAry[_aryIdx].fn;
    slideAnime.pause();
    slideAnime.remove(elem);
  }
}
function slideAryAdd(elem, func) {
  const _aryIdx = slideAry.findIndex((item) => item.el === elem);
  if (_aryIdx > -1) {
    slideAry[_aryIdx].fn = func;
  } else {
    slideAry.push({ el: elem, fn: func });
  }
}
function slideUp(elem, speed, fn) {
  if (getStyle(elem, 'display') === 'none') return;
  if (speed === undefined) speed = 500;
  slideAryChk(elem);
  elem.style.overflow = 'hidden';
  if (!elem.classList.contains('_slide-ing')) elem.classList.add('_slide-ing');
  slideAnime = anime({
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
      elem.classList.remove('_slide-ing');
      elem.style.display = 'none';
      if (fn !== undefined && typeof fn === 'function') {
        fn();
      }
    }
  });
  slideAryAdd(elem, slideAnime);
}

function slideDown(elem, speed, fn) {
  if (speed === undefined) speed = 500;
  let slideAnime = elem.dataset.slideAnime;
  slideAryChk(elem);
  let isHide = false;
  if (getStyle(elem, 'display') === 'none') {
    elem.style.display = 'block';
    isHide = true;
  }
  let elHeight = elem.offsetHeight;
  let elMgT = parseInt(getStyle(elem, 'margin-top'), 10);
  let elMgB = parseInt(getStyle(elem, 'margin-bottom'), 10);
  let elPdT = parseInt(getStyle(elem, 'padding-top'), 10);
  let elPdB = parseInt(getStyle(elem, 'padding-bottom'), 10);
  if (isHide) {
    elem.style.overflow = 'hidden';
    elem.style.height = '0px';
    elem.style.marginTop = '0px';
    elem.style.marginBottom = '0px';
    elem.style.paddingTop = '0px';
    elem.style.paddingBottom = '0px';
  } else if (elem.classList.contains('_slide-ing')) {
    const _elHeight = elHeight;
    const _elMgT = elMgT;
    const _elMgB = elMgB;
    const _elPdT = elPdT;
    const _elPdB = elPdB;
    elem.removeAttribute('style');
    elem.style.display = 'block';
    elem.style.overflow = 'hidden';
    elHeight = elem.offsetHeight;
    elMgT = parseInt(getStyle(elem, 'margin-top'), 10);
    elMgB = parseInt(getStyle(elem, 'margin-bottom'), 10);
    elPdT = parseInt(getStyle(elem, 'padding-top'), 10);
    elPdB = parseInt(getStyle(elem, 'padding-bottom'), 10);

    elem.style.height = _elHeight + 'px';
    elem.style.marginTop = _elMgT + 'px';
    elem.style.marginBottom = _elMgB + 'px';
    elem.style.paddingTop = _elPdT + 'px';
    elem.style.paddingBottom = _elPdB + 'px';
  }
  if (!elem.classList.contains('_slide-ing')) elem.classList.add('_slide-ing');
  slideAnime = anime({
    targets: elem,
    height: elHeight,
    marginTop: elMgT,
    marginBottom: elMgB,
    paddingTop: elPdT,
    paddingBottom: elPdB,
    duration: speed,
    easing: 'easeInOutQuad',
    complete: () => {
      elem.classList.remove('_slide-ing');
      elem.removeAttribute('style');
      elem.style.display = 'block';
      if (fn !== undefined && typeof fn === 'function') {
        fn();
      }
    }
  });
  slideAryAdd(elem, slideAnime);
}
