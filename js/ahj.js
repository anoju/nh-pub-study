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

window.requestAnimFrame = (function () {
  return (
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    function (callback) {
      window.setTimeout(callback, 1000 / 60);
    }
  );
})();
function winScrollTo(option, speed, callback) {
  // scrollTargetY: the target scrollY property of the window
  // speed: time in pixels per second
  // easing: easing equation to use

  const scrollX = window.scrollX;
  const scrollY = window.scrollY;
  const scrollTargetX = option.left || 0;
  const scrollTargetY = option.top || 0;
  const _speed = speed || 2000;
  const _easing = option.easing || 'easeOutSine';
  let currentTime = 0;

  // min time .1, max time .8 seconds
  let time = Math.max(0.1, Math.min(Math.abs(scrollY - scrollTargetY) / _speed, 0.8));
  console.log(time);
  // easing equations from https://github.com/danro/easing-js/blob/master/easing.js
  const PI_D2 = Math.PI / 2;
  const easingEquations = {
    easeOutSine: function (pos) {
      return Math.sin(pos * (Math.PI / 2));
    },
    easeInOutSine: function (pos) {
      return -0.5 * (Math.cos(Math.PI * pos) - 1);
    },
    easeInOutQuint: function (pos) {
      if ((pos /= 0.5) < 1) {
        return 0.5 * Math.pow(pos, 5);
      }
      return 0.5 * (Math.pow(pos - 2, 5) + 2);
    }
  };

  // add animation loop
  function tick() {
    currentTime += 1 / 60;

    const p = currentTime / time;
    console.log(p);
    const t = easingEquations[_easing](p);

    if (p < 1) {
      requestAnimFrame(tick);

      window.scrollTo(scrollX + (scrollTargetX - scrollX) * t, scrollY + (scrollTargetY - scrollY) * t);
    } else {
      window.scrollTo(scrollTargetX, scrollTargetY);
      if (!!callback) callback();
    }
  }

  // call it once to get started
  tick();
}
