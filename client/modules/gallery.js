/* ==========================================================================
   Gallery
   ========================================================================== */

import component from 'component.js';

export default function(node, selector) {

    const self = component(node, selector);
    var currentIndex;
    var boundingRect;
    var offsetTop;

    self.define(
        {
            name: 'images',
            isCollection: true,
            handlers: {
                mouseover: function() {
                    console.log('on');
                    boundingRect = self.container.getBoundingClientRect();
                    offsetTop = self.container.offsetTop;
                    this.classList.add('is-manipulated');
                },
                mousemove: function(ev) {
                    var deltaX = (50 - Math.round(100 * (ev.pageX - boundingRect.left) / boundingRect.width)) * .4;
                    var deltaY = (50 - Math.round(100 * (ev.pageY - offsetTop) / boundingRect.height)) * .2;
                    //console.log(`x: ${deltaX}, y: ${deltaY}`);
                    this.style.transform = `translate(${-50 + deltaX}%, ${-50 + deltaY}%)`
                },
                mouseout: function() {
                    this.classList.remove('is-manipulated');
                    this.style.transform = `translate(-50%, -50%)`
                    console.log('off');
                }
            }
        },
        {
            name: 'thumbnails',
            isCollection: true,
            handlers: {
                click: setActive
            }
        }
    );

    function setActive(ev, index) {
        self.element('thumbnails').get(currentIndex).classList.remove('is-active');
        self.element('images').get(currentIndex).classList.remove('is-active');

        self.element('thumbnails').get(index).classList.add('is-active');
        self.element('images').get(index).classList.add('is-active');

        currentIndex = index;
    }

    (function init() {

        currentIndex = 0;

        setActive(null, currentIndex);

    })();

    return self;

}
