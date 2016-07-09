/* ==========================================================================
   Waypoints
   ========================================================================== */

import utils from 'utils.js';

const Waypoints = {
    init() {

        this.waypoints = [];
        this.lastOffset = window.scrollY || window.pageYOffset;

        window.addEventListener('scroll', utils.debounce(() => {
            let offset = window.scrollY || window.pageYOffset;
            let lowerOffset = Math.min(offset, this.lastOffset);
            let higherOffset = Math.max(offset, this.lastOffset);
            let passed = this.select(lowerOffset, higherOffset);

            passed.forEach(item => item.callback(offset > item.offset));
            this.lastOffset = offset;
        }, 10));

    },
    add(offset, callback) {
        if (!this.waypoints) {
            this.init();
        }

        let waypoint = { offset, callback };
        let isBelow = waypoint.offset < this.lastOffset;

        this.waypoints.push(waypoint);
        this.waypoints.sort((a, b) => a.offset - b.offset);
        waypoint.callback(isBelow);

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

        this.waypoints && this.waypoints.some((item, index) => {
            if (item.offset > higherOffset) {
                return true;
            } else if (item.offset >= lowerOffset) {
                passed.push(this.waypoints[index]);
            }
        });

        return passed;
    },
    remove(waypoint) {
        this.waypoints && this.waypoints.some((item, index) => {
            if (waypoint === item) {
                this.waypoints.splice(index, 1);

                return true;
            }
        });
    }
};

export default Waypoints;
