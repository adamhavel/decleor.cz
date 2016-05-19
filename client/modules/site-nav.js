import component from 'component.js';

export default function(node, selector) {

    const self = component(node, selector);
    var timer = null;

    self.define(
        {
            name: 'self',
            handlers: {
                mouseleave: function() {
                    timer = setTimeout(function() {
                        disableActiveSubNav();
                        timer = null;
                    }, 500);
                }
            }
        },
        {
            name: 'item',
            isCollection: true,
            handlers: {
                mouseover: function(ev, index) {
                    let subNav = self.element('subnav').get(index);

                    if (timer) {
                        clearTimeout(timer);
                        timer = null;
                    }

                    disableActiveSubNav();
                    subNav && subNav.classList.add('is-active');
                }
            }
        },
        {
            name: 'subnav',
            isCollection: true
        }
    );

    function disableActiveSubNav() {
        let activeSubNav = null;

        self.element('subnav').get().some(subNav => {
            if (subNav.classList.contains('is-active')) {
                activeSubNav = subNav;
                return true;
            }
        });

        activeSubNav && activeSubNav.classList.remove('is-active');
    }

    return self;
}
