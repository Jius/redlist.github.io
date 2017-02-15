'use strict';

const Mate = {
  modal: (id, options) => {
    let   init = false;
    
    const defaultOptions = {
            overlay: true,
            showCloseBtn: true,
            triggers: {
              open: '#addItem',
              close: '.modal-close'
            }
          },
          
          checkUserOption = (key, userOptions) => {
            if (userOptions[key] == undefined) {
              userOptions[key] = defaultOptions[key];
            } else if (typeof defaultOptions[key] == 'object') {
              for (let action in defaultOptions[key]) {
                if (userOptions[key][action] == undefined) {
                  userOptions[key][action] = defaultOptions[key][action];
                }
              }
            }
            return userOptions[key];
          },
          
          initOptions = (opt) => {
            if (!opt) {
              opt = defaultOptions;
            } else {
              for (let prop in defaultOptions) {
                opt[prop] = checkUserOption(prop, opt);
              }
            }
            console.log(opt);
            init = true;
            return opt;
          };
          
    if (!init) {
      options = initOptions(options);
    }
    
    const Overlay = (idOverlay) => {
      return {
        selectOrCreate: () => {
          let overlay = document.querySelector(idOverlay);
          
          if (!overlay || overlay == undefined) {
            overlay = document.createElement('div');
            overlay.setAttribute('id', idOverlay.replace('#', ''));
            overlay.setAttribute('class', 'modal-overlay');
            document.body.appendChild(overlay);
          }
          return overlay;
        }
      }
    };
    
    const action = (val) => {
      const modal = document.querySelector(id),
            overlay = Overlay('#overlay').selectOrCreate();
      
      if (val == 'open') {
        modal.classList.add('open');
        overlay.classList.add('active');
      } else {
        modal.classList.remove('open')
        overlay.classList.remove('active');
      }
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