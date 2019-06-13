/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Fabric smart contract classes
const { Contract, Context } = require('fabric-contract-api');

// EhrNet specifc classes
const Ehr = require('./ehr.js');
const EhrList = require('./ehrlist.js');

/**
 * A custom context provides easy access to list of all Ehr
 */
class EhrContext extends Context {

    constructor() {
        super();
        // All ehrs are held in a list of ehrs
        this.ehrList = new EhrList(this);
    }

}

/**
 * Define ehr smart contract by extending Fabric Contract class
 *
 */
class EhrContract extends Contract {

    constructor() {
        // Unique namespace when multiple contracts per chaincode file
        super('org.ehrnet.ehr');
    }

    /**
     * Define a custom context for ehr
    */
    createContext() {
        return new EhrContext();
    }

    /**
     * Instantiate to perform any setup of the ledger that might be required.
     * @param {Context} ctx the transaction context
     */
    async instantiate(ctx) {
        // No implementation required with this example
        // It could be where data migration is performed, if necessary
        console.log('Instantiate the contract');
    }

    /**
     * insert ehr  创建病例
     *
     * @param {Context} ctx the transaction context
     * @param {String} issuer ehr issuer 病人
     * @param {Integer} ehrNumber ehr number for this issuer
     * @param {String} issueDateTime ehr issue date  创建时间
     * @param {String} content  undefined
    */
    async insert(ctx, issuer, ehrNumber, issueDateTime, content) {
        if (!issuer || !ehrNumber || issuer.length==0 || ehrNumber.length==0) {
            return null;
        }
        let ehrKey = Ehr.makeKey([issuer, ehrNumber]);
        let ehr1 = await ctx.ehrList.getEhr(ehrKey);
        if (ehr1) {
            // throw new Error('ehr exists');
            return null;
        }
        // create an instance of the ehr

        let ehr = Ehr.createInstance(issuer, ehrNumber, issueDateTime, content);

        // Smart contract, rather than ehr, moves ehr into ISSUED state
        ehr.setIssued();

        // Newly issued ehr is owned by the issuer
        ehr.setOwner(issuer);

        // Add the ehr to the list of all similar ehr in the ledger world state
        await ctx.ehrList.addEhr(ehr);
        // Must return a serialized ehr to caller of smart contract
        return ehr.toBuffer();
    }

    /**
     * update commercial ehr　　病例传送给医院
     *
     * @param {Context} ctx the transaction context
     * @param {String} issuer ehr issuer
     * @param {Integer} ehrNumber ehr number for this issuer
     * @param {String} content undefiend
     * @param {String} updateDateTime time ehr was update
    */
    async update(ctx, issuer, ehrNumber, content) {

        // Retrieve the current ehr using key fields provided
        let ehrKey = Ehr.makeKey([issuer, ehrNumber]);
        let ehr = await ctx.ehrList.getEhr(ehrKey);

        // Check exists
        if (!ehr || ehr.length == 0) {
            // throw new Error('ehr does not exist');
            return null;
        }

        // Check ehr is not already DELETED
        if (ehr.isDeleted()) {
            // throw new ('Ehr ' + issuer + ehrNumber + ' is not used. Current state = ' +ehr.getCurrentState());
            return null;
        }

        ehr.setContent(content);
        await ctx.ehrList.updateEhr(ehr);
        return ehr.toBuffer();
    }

    /**
     * Redeem ehr
     *
     * @param {Context} ctx the transaction context
     * @param {String} issuer ehr issuer
     * @param {Integer} ehrNumber ehr number for this issuer
     * @param {String} redeemingOwner redeeming owner of ehr
     * @param {String} redeemDateTime time ehr was redeemed
    */
    // async redeem(ctx, issuer, ehrNumber, redeemingOwner, redeemDateTime) {

    //     let ehrKey = Ehr.makeKey([issuer, ehrNumber]);
    //     let ehr = await ctx.ehrList.getEhr(ehrKey);

    //     // Check exists
    //     if (!ehr || ehr.length == 0) {
    //         // throw new Error('ehr does not exist');
    //         return null;
    //     }

    //     // Check paper is not Deleted
    //     if (ehr.isDeleted()) {
    //         // throw new Error('Ehr ' + issuer + ehrNumber + ' already deleted');
    //         return null;
    //     }

    //     // Verify that the redeemer owns the ehr before redeeming it
    //     if (ehr.getOwner() === redeemingOwner) {
    //         ehr.setContent(ehr.getContent() + "redeem from-" + redeemDateTime + ':' + ehr.getOwner() + '\n');
    //         ehr.setOwner(issuer);
    //     } else if (ehr.getIssuer() == redemingOwner) {
    //         if (ehr.getOwner() != ehr.getIssuer()) {
    //             ehr.setContent(ehr.getContent() + "redeem from-" + redeemDateTime + ':' + ehr.getOwner() + '\n');
    //             ehr.setOwner(issuer);
    //         }
    //     }else {
    //         // throw new Error('Redeeming owner does not own ehr' + issuer + ehrNumber);
    //         return null;
    //     }

    //     await ctx.ehrList.updateEhr(ehr);
    //     return ehr.toBuffer();
    // }

    /**
     * Quere ehr
     *
     * @param {Context} ctx the transaction context
     * @param {String} issuer ehr issuer
     * @param {Integer} ehrNumber ehr number for this issuer
    */
    async query(ctx, issuer, ehrNumber) {
        if (!issuer || !ehrNumber || issuer.length==0 || ehrNumber==0) {
            return null;
        }
        let ehrKey = Ehr.makeKey([issuer, ehrNumber]);
        let ehr = await ctx.ehrList.getEhr(ehrKey);

        // Check exists
        if (!ehr || ehr.length == 0) {
            return null;
        }
    
        // Check paper is not Deleted
        if (ehr.isDeleted()) {
            // throw new Error('Ehr ' + issuer + ehrNumber + ' already deleted');
            return null;
        }
        await ctx.ehrList.updateEhr(ehr);
        return ehr.toBuffer();
    }

    /**
     * Delete ehr
     *
     * @param {Context} ctx the transaction context
     * @param {String} issuer ehr issuer
     * @param {Integer} ehrNumber ehr number for this issuer
    */
    async delete(ctx, issuer, ehrNumber) {
        if (!issuer || !ehrNumber || issuer.length==0 || ehrNumber==0) {
            return null;
        }
        let ehrKey = Ehr.makeKey([issuer, ehrNumber]);
        let ehr = await ctx.ehrList.getEhr(ehrKey);

        // Check exists
        if (!ehr || ehr.length == 0) {
            return null;
        }

        // Check paper is not Deleted
        if (ehr.isDeleted()) {
            return null;
        }
        ehr.setDeleted();
        return ehr.toBuffer();
    }
}

module.exports = EhrContract;
