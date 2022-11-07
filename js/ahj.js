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

// easing functions http://goo.gl/5HLl8
Math.easeInOutQuad = function (t, b, c, d) {
  t /= d / 2;
  if (t < 1) {
    return (c / 2) * t * t + b;
  }
  t--;
  return (-c / 2) * (t * (t - 2) - 1) + b;
};

Math.easeInCubic = function (t, b, c, d) {
  const tc = (t /= d) * t * t;
  return b + c * tc;
};

Math.inOutQuintic = function (t, b, c, d) {
  const ts = (t /= d) * t;
  const tc = ts * t;
  return b + c * (6 * tc * ts + -15 * ts * ts + 10 * tc);
};

// requestAnimationFrame for Smart Animating http://goo.gl/sx5sts
const requestAnimFrame = (function () {
  return (
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    function (callback) {
      window.setTimeout(callback, 1000 / 60);
    }
  );
})();

function scrollTo(option, duration, callback) {
  const _top = option.top || 0;
  const _left = option.left || 0;
  // because it's so fucking difficult to detect the scrolling element, just move them all
  function move(top, left) {
    document.documentElement.scrollTop = top;
    document.body.parentNode.scrollTop = top;
    document.body.scrollTop = top;
    document.documentElement.scrollLeft = left;
    document.body.parentNode.scrollLeft = left;
    document.body.scrollLeft = left;
  }
  function position() {
    const _top = document.documentElement.scrollTop || document.body.parentNode.scrollTop || document.body.scrollTop;
    const _left = document.documentElement.scrollLeft || document.body.parentNode.scrollLeft || document.body.scrollLeft;
    return { top: _top, left: _left };
  }
  const startTop = position().top;
  const changeTop = _top - startTop;
  const startLeft = position().left;
  const changeLeft = _left - startLeft;
  let currentTime = 0;
  const increment = 20;
  const _duration = typeof duration === 'undefined' ? 500 : duration;
  const animateScroll = function () {
    // increment the time
    currentTime += increment;
    // find the value with the quadratic in-out easing function
    const top = Math.easeInOutQuad(currentTime, startTop, changeTop, _duration);
    const left = Math.easeInOutQuad(currentTime, startLeft, changeLeft, _duration);
    // move the document.body
    move(top, left);
    // do the animation unless its over
    if (currentTime < _duration) {
      requestAnimFrame(animateScroll);
    } else {
      if (callback && typeof callback === 'function') {
        // the animation is done so lets callback
        callback();
      }
    }
  };
  animateScroll();
}
