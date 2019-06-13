/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Utility class for collections of ledger states --  a state list
const StateList = require('./../ledger-api/statelist.js');

const Ehr = require('./ehr.js');

class EhrList extends StateList {

    constructor(ctx) {
        super(ctx, 'org.ehrrnet.ehrlist');
        this.use(Ehr);
    }

    async addEhr(ehr) {
        return this.addState(ehr);
    }

    async getEhr(ehrKey) {
        return this.getState(ehrKey);
    }

    async updateEhr(ehr) {
        return this.updateState(ehr);
    }
}


module.exports = EhrList;