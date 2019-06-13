#!/bin/bash
#
# Copyright IBM Corp All Rights Reserved
#
# SPDX-License-Identifier: Apache-2.0
#
# Exit on first error
set -e

# don't rewrite paths for Windows Git Bash users
export MSYS_NO_PATHCONV=1
starttime=$(date +%s)
CC_RUNTIME_LANGUAGE=node # chaincode runtime language is node.js
CC_SRC_PATH=/opt/gopath/src/github.com/ehr


# clean the keystore
rm -rf ./hfc-key-store

# launch network; create channel and join peer to channel
cd ../basic-network

#./start.sh
# down
docker-compose -f docker-compose.yml down
# start
docker-compose -f docker-compose.yml up -d ca1.example.com ca2.example.com orderer.example.com peer0.org1.example.com peer0.org2.example.com couchdb

# Now launch the CLI container in order to install, instantiate chaincode
# and prime the ledger with our 10 cars
docker-compose -f ./docker-compose.yml up -d cli

# create channel
docker exec -e "CORE_PEER_ADDRESS=peer0.org1.example.com:7051" -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp" cli peer channel create -o orderer.example.com:7050 -c mychannel -f ./config/channel.tx

# join peer0.org1 channel
docker exec -e "CORE_PEER_ADDRESS=peer0.org1.example.com:7051" -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp" cli peer channel join -b mychannel.block
# join peer0.org2 channel
docker exec -e "CORE_PEER_ADDRESS=peer0.org2.example.com:7051" -e "CORE_PEER_LOCALMSPID=Org2MSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp" cli peer channel join -b mychannel.block


# install
#docker exec -e "CORE_PEER_ADDRESS=peer0.org1.example.com:7051" -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp" cli peer chaincode install -n fabcar -v 1.0 -p "$CC_SRC_PATH" -l "$CC_RUNTIME_LANGUAGE"
docker exec -e "CORE_PEER_ADDRESS=peer0.org1.example.com:7051" -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp" cli peer chaincode install -n ehrcontract  -v 1.0 -p "$CC_SRC_PATH" -l "$CC_RUNTIME_LANGUAGE"

# initiate
#docker exec -e "CORE_PEER_ADDRESS=peer0.org1.example.com:7051" -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp" cli peer chaincode instantiate -o orderer.example.com:7050 -C mychannel -n fabcar -l "$CC_RUNTIME_LANGUAGE" -v 1.0 -c '{"Args":[]}' -P "OR ('Org1MSP.member','Org2MSP.member')"
docker exec -e "CORE_PEER_ADDRESS=peer0.org1.example.com:7051" -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp" cli peer chaincode instantiate -C mychannel -n ehrcontract -v 1.0 -l "$CC_RUNTIME_LANGUAGE" -c '{"Args":[]}' -P "OR ('Org1MSP.member','Org2MSP.member')"
# docker exec -e "CORE_PEER_ADDRESS=peer0.org1.example.com:7051" -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp" cli peer chaincode instantiate -C mychannel -n ehrcontract -v 1.0 -l "$CC_RUNTIME_LANGUAGE" -c '{"Args":[]}' -P "OR ('Org1MSP.member')"
sleep 10
echo nsml
# initLedger
#docker exec -e "CORE_PEER_ADDRESS=peer0.org1.example.com:7051" -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp" cli peer chaincode invoke -o orderer.example.com:7050 -C mychannel -n fabcar -c '{"function":"initLedger","Args":[]}'


# docker exec -e "CORE_PEER_ADDRESS=peer0.org1.example.com:7051" -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp" cli peer chaincode invoke -o orderer.example.com:7050 -C mychannel -n fabcar -c '{"function":"queryAllCars","Args":[]}'

# cat <<EOF

# Total setup execution time : $(($(date +%s) - starttime)) secs ...

# Next, use the FabCar applications to interact with the deployed FabCar contract.
# The FabCar applications are available in multiple programming languages.
# Follow the instructions for the programming language of your choice:

# JavaScript:

#   Start by changing into the "javascript" directory:
#     cd javascript

#   Next, install all required packages:
#     npm install

#   Then run the following applications to enroll the admin user, and register a new user
#   called user1 which will be used by the other applications to interact with the deployed
#   FabCar contract:
#     node enrollAdmin
#     node registerUser

#   You can run the invoke application as follows. By default, the invoke application will
#   create a new car, but you can update the application to submit other transactions:
#     node invoke

#   You can run the query application as follows. By default, the query application will
#   return all cars, but you can update the application to evaluate other transactions:
#     node query

# TypeScript:

#   Start by changing into the "typescript" directory:
#     cd typescript

#   Next, install all required packages:
#     npm install

#   Next, compile the TypeScript code into JavaScript:
#     npm run build

#   Then run the following applications to enroll the admin user, and register a new user
#   called user1 which will be used by the other applications to interact with the deployed
#   FabCar contract:
#     node dist/enrollAdmin
#     node dist/registerUser

#   You can run the invoke application as follows. By default, the invoke application will
#   create a new car, but you can update the application to submit other transactions:
#     node dist/invoke

#   You can run the query application as follows. By default, the query application will
#   return all cars, but you can update the application to evaluate other transactions:
#     node dist/query

# EOF
