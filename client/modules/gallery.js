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
            name: 'self',
            handlers: {
                mouseenter: function() {
                    this.classList.add('is-manipulated');
                    boundingRect = this.getBoundingClientRect();
                    offsetTop = this.offsetTop;
                    self.element('image').get(currentIndex).classList.add('is-manipulated');
                },
                mousemove: function(ev) {
                    positionImage(self.element('image').get(currentIndex), ev.pageX, ev.pageY);
                },
                mouseleave: function() {
                    this.classList.remove('is-manipulated');
                    resetImage(self.element('image').get(currentIndex));
                }
            }
        },
        {
            name: 'image'
        },
        {
            name: 'thumbnail',
            isCollection: true,
            handlers: {
                click: function(ev, index) {
                    setActiveImage(index);
                    resetImage(self.element('image').get(currentIndex));
                    self.element('image').get(index).classList.add('is-manipulated');
                    positionImage(self.element('image').get(index), ev.pageX, ev.pageY);
                }
            }
        }
    );

    function positionImage(image, x, y) {
        var deltaX = (50 - Math.round(100 * (x - boundingRect.left) / boundingRect.width)) * .4;
        var deltaY = (50 - Math.round(100 * (y - offsetTop) / boundingRect.height)) * .4;

        image.style.transform = `translate(${-50 + deltaX}%, ${-50 + deltaY}%)`;
    }

    function resetImage(image) {
        image.classList.remove('is-manipulated');
        image.style.transform = `translate(-50%, -50%)`;
    }

    function setActiveImage(index) {
        self.element('thumbnail').get(currentIndex).classList.remove('is-active');
        self.element('image').get(currentIndex).classList.remove('is-active');

        self.element('thumbnail').get(index).classList.add('is-active');
        self.element('image').get(index).classList.add('is-active');

        currentIndex = index;
    }

    (function init() {

        currentIndex = 0;

        setActiveImage(currentIndex);

    })();

    return self;

}
