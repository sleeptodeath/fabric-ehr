/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { FileSystemWallet, Gateway } = require('fabric-network');
const fs = require('fs');
const path = require('path');
const Ehr = require('../../../chaincode/ehr/lib/ehr.js');

class OPT {

    async insert(issuer, ehrNumber, issueDateTime, content) {
        try {
            const ccpPath = path.resolve(__dirname, 'connection.json');
            const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
            const ccp = JSON.parse(ccpJSON);
            // Create a new file system based wallet for managing identities.
            const walletPath = path.resolve(__dirname, '..',  'wallet');
            const wallet = new FileSystemWallet(walletPath);
            console.log(`Wallet path: ${walletPath}`);

            // Check to see if we've already enrolled the user.
            const userExists = await wallet.exists('user1');
            if (!userExists) {
                console.log('An identity for the user "user1" does not exist in the wallet');
                console.log('Run the registerUser.js application before retrying');
                return;
            }

            // Create a new gateway for connecting to our peer node.
            const gateway = new Gateway();
            await gateway.connect(ccp, { wallet, identity: 'user1', discovery: { enabled: false } });

            // Get the network (channel) our contract is deployed to.
            const network = await gateway.getNetwork('mychannel');

            // Get the contract from the network.
            const contract = network.getContract('ehrcontract');

            // issue ehr
            console.log('Submit ehr issue transaction.');
          
            const issueResponse = await contract.submitTransaction('insert', issuer, ehrNumber, issueDateTime, content);
            await gateway.disconnect();
            return issueResponse;
        } catch (error) {
            console.error(`Failed to evaluate transaction: ${error}`);
            // process.exit(1);
            return null;
        }
    }

    async update(issuer, ehrNumber, content) {
        try {
            const ccpPath = path.resolve(__dirname, 'connection.json');
            const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
            const ccp = JSON.parse(ccpJSON);
            // Create a new file system based wallet for managing identities.
            const walletPath = path.resolve(__dirname, '..', 'wallet');
            const wallet = new FileSystemWallet(walletPath);
            console.log(`Wallet path: ${walletPath}`);

            // Check to see if we've already enrolled the user.
            const userExists = await wallet.exists('user1');
            if (!userExists) {
                console.log('An identity for the user "user1" does not exist in the wallet');
                console.log('Run the registerUser.js application before retrying');
                return;
            }

            // Create a new gateway for connecting to our peer node.
            const gateway = new Gateway();
            await gateway.connect(ccp, { wallet, identity: 'user1', discovery: { enabled: false } });

            // Get the network (channel) our contract is deployed to.
            const network = await gateway.getNetwork('mychannel');

            // Get the contract from the network.
            const contract = network.getContract('ehrcontract');

            // issue ehr
            console.log('Submit ehr issue transaction.');
          
            const issueResponse = await contract.submitTransaction('update', issuer, ehrNumber, content);
            await gateway.disconnect();
            return issueResponse;
        } catch (error) {
            console.error(`Failed to evaluate transaction: ${error}`);
            // process.exit(1);
            return null;
        }
    }
    async query(issuer, ehrNumber) {
        try {
            const ccpPath = path.resolve(__dirname,  'connection.json');
            const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
            const ccp = JSON.parse(ccpJSON);
            // Create a new file system based wallet for managing identities.
            const walletPath = path.resolve(__dirname,  '..', 'wallet');
            const wallet = new FileSystemWallet(walletPath);
            console.log(`Wallet path: ${walletPath}`);
    
            // Check to see if we've already enrolled the user.
            const userExists = await wallet.exists('user1');
            if (!userExists) {
                console.log('An identity for the user "user1" does not exist in the wallet');
                console.log('Run the registerUser.js application before retrying');
                return;
            }
    
            // Create a new gateway for connecting to our peer node.
            const gateway = new Gateway();
            await gateway.connect(ccp, { wallet, identity: 'user1', discovery: { enabled: false } });
    
            // Get the network (channel) our contract is deployed to.
            const network = await gateway.getNetwork('mychannel');
    
            // Get the contract from the network.
            const contract = network.getContract('ehrcontract');
    
            // Evaluate the specified transaction.
            // queryCar transaction - requires 1 argument, ex: ('queryCar', 'CAR12')
            // queryAllCars transaction - requires no arguments, ex: ('queryAllCars')
            // const result = await contract.evaluateTransaction('query', 'CAR12');
            const queryResponse = await contract.submitTransaction('query', issuer, ehrNumber);
            console.log('Process query transaction response.');
    
            await gateway.disconnect();
            return queryResponse;
        } catch (error) {
            console.error(`Failed to evaluate transaction: ${error}`);
            // process.exit(1);
            return null;
        }
    }

    async queryAll(issuer) {
        try {
            const ccpPath = path.resolve(__dirname, 'connection.json');
            const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
            const ccp = JSON.parse(ccpJSON);
            // Create a new file system based wallet for managing identities.
            const walletPath = path.resolve(__dirname, '..', 'wallet');
            const wallet = new FileSystemWallet(walletPath);
            console.log(`Wallet path: ${walletPath}`);
    
            // Check to see if we've already enrolled the user.
            const userExists = await wallet.exists('user1');
            if (!userExists) {
                console.log('An identity for the user "user1" does not exist in the wallet');
                console.log('Run the registerUser.js application before retrying');
                return;
            }
            
            // Create a new gateway for connecting to our peer node.
            const gateway = new Gateway();
            await gateway.connect(ccp, { wallet, identity: 'user1', discovery: { enabled: false } });
    
            // Get the network (channel) our contract is deployed to.
            const network = await gateway.getNetwork('mychannel');
    
            // Get the contract from the network.
            const contract = network.getContract('ehrcontract');
    
            // Evaluate the specified transaction.
            // queryCar transaction - requires 1 argument, ex: ('queryCar', 'CAR12')
            // queryAllCars transaction - requires no arguments, ex: ('queryAllCars')
            // const result = await contract.evaluateTransaction('query', 'CAR12');
            const ret = [];
            for (var i = 1; i <= 5; i++) {
                console.log("GG" + issuer +" "+i);
                const queryResponse = await contract.submitTransaction('query', issuer, i.toString());
                // if (!queryResponse) {
                //     console.log("非空");
                if (queryResponse.length != 0) {
                   
                    ret.push(queryResponse);
                }
            }
            
            console.log('Process query transaction response.');
         
            await gateway.disconnect();
            return ret;
        } catch (error) {
            console.error(`Failed to evaluate transaction: ${error}`);
            // process.exit(1);
            return null;
        }
    }

    async delete(issuer, ehrNumber) {
        try {
            const ccpPath = path.resolve(__dirname, 'connection.json');
            const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
            const ccp = JSON.parse(ccpJSON);
            // Create a new file system based wallet for managing identities.
            const walletPath = path.resolve(__dirname, '..',  'wallet');
            const wallet = new FileSystemWallet(walletPath);
            console.log(`Wallet path: ${walletPath}`);
    
            // Check to see if we've already enrolled the user.
            const userExists = await wallet.exists('user1');
            if (!userExists) {
                console.log('An identity for the user "user1" does not exist in the wallet');
                console.log('Run the registerUser.js application before retrying');
                return;
            }
    
            // Create a new gateway for connecting to our peer node.
            const gateway = new Gateway();
            await gateway.connect(ccp, { wallet, identity: 'user1', discovery: { enabled: false } });
    
            // Get the network (channel) our contract is deployed to.
            const network = await gateway.getNetwork('mychannel');
    
            // Get the contract from the network.
            const contract = network.getContract('ehrcontract');
    
            // Evaluate the specified transaction.
            // queryCar transaction - requires 1 argument, ex: ('queryCar', 'CAR12')
            // queryAllCars transaction - requires no arguments, ex: ('queryAllCars')
            // const result = await contract.evaluateTransaction('query', 'CAR12');
            const queryResponse = await contract.submitTransaction('delete', issuer, ehrNumber);
            console.log('Process query transaction response.');
    
            await gateway.disconnect();
            return queryResponse;
        } catch (error) {
            console.error(`Failed to evaluate transaction: ${error}`);
            // process.exit(1);
            return null;
        }
    }
}

module.exports=OPT;

