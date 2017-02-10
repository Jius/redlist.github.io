'use strict';

const Mate = {
  modal: (id) => {
    const action = (val) => {
      const modal = document.querySelector(id),
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
      register: (openCallback, closeCallBack) => {
        const modal = Mate.modal(id),
              trigger = {
                open: '#addItem',
                close: '.modal-close'
              },
              suffixModule = 'Callback';
        
        for (let prop in trigger) {
          if (trigger[prop]) {
            let query = document.querySelectorAll(trigger[prop]);
            if (query.length == 1) {
              (prop == 'open'? openCallback(trigger[prop], modal) : closeCallBack(trigger[prop], modal));
            } else {
              for (let i = 0; i < query.length; i++) {
                let getIdFromClass = '#' + query[i].getAttribute('id'); //Important to declare ID from action Trigger button
                (prop == 'open'? openCallback(getIdFromClass, modal) : closeCallBack(getIdFromClass, modal));
              }
            }
          }
        }
        
      },
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