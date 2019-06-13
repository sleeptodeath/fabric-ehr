/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Utility class for ledger state
const State = require('./../ledger-api/state.js');

// Enumerate ehr state values
const cpState = {
    ISSUED: 1,
    DELETED: 2
};

/**
 * Ehr class extends State class
 * Class will be used by application and smart contract to define a ehr
 */
class Ehr extends State {

    constructor(obj) {
        super(Ehr.getClass(), [obj.issuer, obj.ehrNumber]);
        Object.assign(this, obj);
    }

    /**
     * Basic getters and setters
    */
    getIssuer() {
        return this.issuer;
    }

    setIssuer(newIssuer) {
        this.issuer = newIssuer;
    }

    getOwner() {
        return this.owner;
    }

    setOwner(newOwner) {
        this.owner = newOwner;
    }

    getContent() {
        return this.content;
    }

    setContent(newContent) {
        this.content = newContent;
    }

    /**
     * Useful methods to encapsulate ehr states
     */
    setIssued() {
        this.currentState = cpState.ISSUED;
    }

    setDeleted() {
        this.currentState = cpState.DELETED;
    }

    isIssued() {
        return this.currentState === cpState.ISSUED;
    }

    isDeleted() {
        return this.currentState === cpState.DELETED;
    }

    static fromBuffer(buffer) {
        return Ehr.deserialize(Buffer.from(JSON.parse(buffer)));
    }

    toBuffer() {
        return Buffer.from(JSON.stringify(this));
    }

    /**
     * Deserialize a state data to ehr
     * @param {Buffer} data to form back into the object
     */
    static deserialize(data) {
        return State.deserializeClass(data, Ehr);
    }

    /**
     * Factory method to create a ehr object
     */
    static createInstance(issuer, ehrNumber, issueDateTime, content) {
        return new Ehr({ issuer, ehrNumber, issueDateTime, content});
    }

    static getClass() {
        return 'org.ehrnet.ehr';
    }
}

module.exports = Ehr;
