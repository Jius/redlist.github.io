'use strict';

const Mate = {
  modal: (id, options) => {
    let   init = false;
    
    const defineOptions = {
            overlay: true,
            showCloseBtn: true,
            triggers: {
              open: '#addItem',
              close: '.modal-close'
            }
          },
          
          checkTriggersOptions = (triggers, defaultOptions) => {
            for (let act in triggers) {
              if (triggers[act] == undefined) {
                triggers[act] = defaultOptions[act];
              }
            }
            return triggers;
          },
          
          initOptions = (op) => {
            if (!op) {
              op = defineOptions;
            } else {
              for (let prop in defineOptions) {
                if (op[prop] == undefined) {
                  op[prop] = defineOptions[prop];
                } else if (prop == 'triggers') {
                  op[prop] = checkTriggersOptions(op[prop], defineOptions[prop]);
                }
              }
            }
            init = true;
            return op;
          };
          
    if (!init) {
      options = initOptions(options);
    }
    
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
        const modal = Mate.modal(id);
        
        for (let prop in options['triggers']) {
          if (options['triggers'][prop]) {
            let query = document.querySelectorAll(options['triggers'][prop]);
            if (query.length == 1) {
              (prop == 'open'? openCallback(options['triggers'][prop], modal) : closeCallBack(options['triggers'][prop], modal));
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