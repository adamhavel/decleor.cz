/* ==========================================================================
   Utilities
   ========================================================================== */

const utils = {
    scripts: {},
    /**
     * Query the DOM for the first element that meets the given CSS selector.
     * @param  {string} selector CSS selector used for the query.
     * @param  {Node}   parent   Limit scope to this node.
     * @return {Node}            First node found.
     */
    query(selector, parent = document) {
        return parent.querySelector(selector);
    },
    /**
     * Query the DOM for all elements that meet the given CSS selector.
     * @param  {string} selector CSS selector used for the query.
     * @param  {Node}   parent   Limit scope to this node.
     * @return {Array}           Array of nodes found.
     */
    queryAll(selector, parent = document) {
        let elements = parent.querySelectorAll(selector);
        let arr = [];

        for (let i = elements.length; i--; i > 0) {
            arr.unshift(elements[i]);
        }

        return arr;
    },
    /**
     * Checks if an element matches a selector.
     * @param  {Node}    el
     * @param  {string}  selector
     * @return {boolean}
     */
    matches(el, selector) {
        let p = Element.prototype;
        let f = p.matches || p.webkitMatchesSelector || p.mozMatchesSelector || p.msMatchesSelector || function(s) {
            return [].indexOf.call(document.querySelectorAll(s), this) !== -1;
        };

        return f.call(el, selector);
    },
    /**
     * Debounce a function so that it can be run again only after a specified delay.
     * @param {Function} func      Function to be debounced.
     * @param {number}   delay     Delay between calls.
     * @param {boolean}  immediate Whether to run the function immediately.
     */
    debounce(func, delay, immediate) {
        var timeout;

        return function() {
            var context = this;
            var args = arguments;
            var later = function() {
                timeout = null;
                if (!immediate) {
                    func.apply(context, args);
                }
            };
            var callNow = immediate && !timeout;

            clearTimeout(timeout);
            timeout = setTimeout(later, delay);

            if (callNow) {
                func.apply(context, args);
            }
        };
    },
    /**
     * Toggle a boolean attribute of a given node.
     * @param {Node}   item Given node.
     * @param {string} attr Atribute to be toggled.
     */
    toggleAttribute(item, attr) {
        let value = item.getAttribute(attr);
        let negatedValue = value === 'true' ? 'false' : 'true';

        item.setAttribute(attr, negatedValue);

        return negatedValue === 'true';
    },
    /**
     * Query the current media query label as defined in the stylesheet.
     * @return {string} A media query label.
     */
    mediaQuery() {
        if (!this.mediaQuery && window.getComputedStyle) {
            this.mediaQuery = window.getComputedStyle(document.body, ':after').getPropertyValue('content').replace(/['"]/g, '');
        }

        return this.mediaQuery;
    },
    /**
     * Asynchronously load and inject a script.
     * @param  {string}   src      Path to the source file.
     * @param  {Function} callback Function called after script successfully loads.
     * @return {Node}              Injected script node.
     */
    loadScript(src, callback = null) {
        let status = this.scripts[src];

        if (status) {
            if (status === 'loading') {
                setTimeout(this.loadScript.bind(this, src, callback), 100);
            } else if (status === 'loaded') {
                if (callback) callback.call(window);
            }
        } else {
            this.scripts[src] = 'loading';

            let script = document.createElement('script');

            script.addEventListener('load', () => {
                status = 'loaded';

                if (callback) callback.call(window);
            });

            script.src = 'assets/site/js/' + src;
            document.head.appendChild(script);
        }
    },
    /**
     * Asynchronously load and inject a style.
     * @param  {string} src Path to the source file.
     * @return {Node}       Injected style node.
     */
    loadStyle(src) {
        let ref = document.getElementsByTagName('script')[0];
        let style = document.createElement('link');

        style.rel = 'stylesheet';
        style.href = 'assets/site/css/' + src;
        style.media = 'only x';
        ref.parentNode.insertBefore(style, ref);

        setTimeout(function() {
            style.media = 'all';
        });

        return style;
    },
    /**
     * Creates a DOM structure for a given string HTML representation.
     * @param  {Array|String} html Array of strings or a single string representing a HTML structure.
     * @return {Node}              Resulting node.
     */
    createNode(html) {
        let container = document.createElement('div');

        container.innerHTML = [].concat(html).join('');

        return container.firstElementChild;
    },
    /**
     * Remove all children from a given node.
     * @param {Node} node The parent node.
     */
    removeChildren(node) {
        while (node.firstElementChild) {
            node.removeChild(node.firstElementChild);
        }
    },
    /**
     * Scroll an element into view.
     * @param {Node}   element The element to scroll to.
     * @param {number} nudge   Nudge the scroll target by given amount in pixels.
     */
    scrollTo(element, nudge = -54) {
        let distance = element.getBoundingClientRect().top + nudge;
        let id = element.getAttribute('id');

        window.scrollBy({
            top: distance,
            behavior: 'smooth'
        });

        if (window.history && id) {
            window.history.pushState(null, null, '#' + id);
        }
    }
};

export default utils;
