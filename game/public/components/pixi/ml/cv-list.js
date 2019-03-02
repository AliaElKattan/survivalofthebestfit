import Resume from './cv';
import {uv2px} from '../../../controllers/common/utils.js';

export default class {
    constructor(options) {
        this.xAnchor = options.x || 20;
        this.yAnchor = options.y;
        this.numOfResumes = options.num || 20; // TODO fix that
        this.resumeXOffset = uv2px(1/this.numOfResumes, 'w');
        this.resumeList = [];
        this._initalizeResumes();
    }

    draw() {
        this.resumeList.forEach((resume) => resume.draw());
    }

    _initalizeResumes() {
        for (let i = 0; i < this.numOfResumes; i++) {
            const resume = new Resume({
                x: this.xAnchor + i*this.resumeXOffset,
                y: this.yAnchor,
            });
            this.resumeList.push(resume);
        }
    }
}

