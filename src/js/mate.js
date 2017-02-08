'use strict';

const Mate = {
  modal: (el) => {
    const action = (val) => {
      const modal = document.querySelector(el),
            getClass =  modal.getAttribute('class'),
            openClass = 'open';
      let   newClass = '';
      
      if (val == 'open') {
        newClass = (getClass.search(openClass) == -1 ? getClass + ' ' + openClass : getClass);
      } else {
        newClass = getClass.replace(openClass, '');
      }
      modal.setAttribute('class', newClass);
    };
    
    return {
      open: () => {
        action('open');
      },
      close: () => {
        action('close');
      }
    }
  }
}

module.exports = Mate;