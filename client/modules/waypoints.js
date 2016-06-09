/* ==========================================================================
   Waypoints
   ========================================================================== */

import utils from 'utils.js';

const waypoints = [];
let lastOffset = window.scrollY;

document.addEventListener('scroll', utils.debounce(function() {
    let offset = window.scrollY;
    let lowerOffset = Math.min(offset, lastOffset);
    let higherOffset = Math.max(offset, lastOffset);

    let passed = waypoints.filter(function(item) {
        return item.offset > lowerOffset && item.offset < higherOffset;
    });

    passed.forEach(item => item.callback());

    lastOffset = offset;
}, 50));

export default {
    add(offset, callback) {
        let waypoint = { offset, callback };

        waypoints.push(waypoint);

        return waypoint;
    },
    addElement(element, callback) {
        let bounds = element.getBoundingClientRect();
        let offset = bounds.top + window.scrollY;

        return this.add(Math.round(offset), callback);
    },
    remove(waypoint) {
        waypoints.some(function(item, index) {
            if (waypoint === item) {
                waypoints.splice(index, 1);

                return true;
            }
        });
    }
};
