"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PersistentContainer {
    constructor(doc, saveInterval) {
        this.doc = doc;
        this.saveInterval = saveInterval;
        this.hasChanges = false;
        setInterval(() => {
            if (this.hasChanges)
                this.doc.save();
        }, this.saveInterval);
    }
    get(key, defaultValue) {
        if (Object.keys(this.doc).includes(key))
            return this.doc[key];
        return defaultValue;
    }
    set(key, value) {
        if (Object.keys(this.doc).includes(key)) {
            this.doc[key] = value;
            this.hasChanges = true;
            return this;
        }
        else
            return null;
    }
    unmark(key) {
        if (Object.keys(this.doc).includes(key))
            this.doc.unmarkModified(key);
    }
}
exports.PersistentContainer = PersistentContainer;
