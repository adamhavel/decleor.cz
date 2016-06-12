/* ==========================================================================
   Waypoints
   ========================================================================== */

import utils from 'utils.js';

const waypoints = [];

const Observer = {
    lastOffset: window.scrollY || window.pageYOffset,
    init() {

        window.addEventListener('scroll', utils.debounce(() => {
            let offset = window.scrollY || window.pageYOffset;
            let lowerOffset = Math.min(offset, this.lastOffset);
            let higherOffset = Math.max(offset, this.lastOffset);
            let passed = this.select(lowerOffset, higherOffset);

            passed.forEach(item => item.callback());
            this.lastOffset = offset;
        }, 10));

    },
    add(offset, callback) {
        let waypoint = { offset, callback };

        if (!waypoints.length) {
            this.init();
        }

        waypoints.push(waypoint);
        waypoints.sort((a, b) => a.offset - b.offset);

        if (waypoint.offset < this.lastOffset) {
            waypoint.callback();
        }

        return waypoint;
    },
    addElement(element, callback, border = 'top', shift = 0) {
        let bounds = element.getBoundingClientRect();
        let windowOffset = window.scrollY || window.pageYOffset;
        let offset = Math.round(bounds[border] + windowOffset + shift);

        return this.add(offset, callback);
    },
    select(lowerOffset, higherOffset) {
        let passed = [];

        waypoints.some(function(item, index) {
            if (item.offset > higherOffset) {
                return true;
            } else if (item.offset >= lowerOffset) {
                passed.push(waypoints[index]);
            }
        });

        return passed;
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

export default Observer;

