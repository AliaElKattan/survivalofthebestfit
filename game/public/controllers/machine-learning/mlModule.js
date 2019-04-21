class MlModule {
    constructor() {
        this.accepted = [];
        this.lastIndex = 0;
    }

    recordAccept(personIndex) {
        if (this.lastIndex > personIndex) {
            this.lastIndex = personIndex;
        }
        this.accepted.push(personIndex);
    }

    recordReject(personIndex) {
        if (this.lastIndex > personIndex) {
            this.lastIndex = personIndex;
        }
    }

    train() {
        console.log(this.accepted, this.rejected);
    }

    predict() {

    }

    // everyone who isn't accepted, is assumed to be rejected
    _getRejected() {
        rejected = [];
        for (let i = 0; i <= lastIndex; i++) {
            rejected.push(i);
        }
        rejected.filter((i) => {
            return this.accepted.indexOf(i) < 0;
        });
        return rejected;
    }
}

export const mlModule = new MlModule();
