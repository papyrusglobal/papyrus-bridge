require('dotenv').config();
const fs = require('fs')
const Web3 = require('web3');
const Web3Utils = require('web3-utils')
const fetch = require('node-fetch');
const {sendRawTx, sendTx} = require('./tx/sendTx');
const {createMessage, signatureToVRS} = require('./message');
const {getNonce} = require('./tx/web3');
const {getGasPrices} = require('./gasPrice');
const {asyncForEach} = require('./utils');

const {
  HOME_RPC_URL,
  FOREIGN_RPC_URL,
  ERC20_ADDRESS,
  FOREIGN_BRIDGE_ADDRESS,
  HOME_BRIDGE_ADDRESS,
  VALIDATOR_ADDRESS,
  VALIDATOR_ADDRESS_PRIVATE_KEY
} = process.env;


const homeProvider = new Web3.providers.HttpProvider(HOME_RPC_URL);
const web3Home = new Web3(homeProvider);
const HomeABI = require('../abis/HomeBridge.abi');
const homeBridge =  new web3Home.eth.Contract(HomeABI, HOME_BRIDGE_ADDRESS);

const foreignProvider = new Web3.providers.HttpProvider(FOREIGN_RPC_URL);
const web3Foreign = new Web3(foreignProvider);
const ForeignABI = require('../abis/ForeignBridge.abi');
const foreignBridge =  new web3Foreign.eth.Contract(ForeignABI, FOREIGN_BRIDGE_ADDRESS);

const ERC20ABI = require('../abis/ERC20.abi');
const erc20token = new web3Foreign.eth.Contract(ERC20ABI, ERC20_ADDRESS);


const DB_FILE_NAME = 'erc20_transfer.json'
let db = require(`../db/${DB_FILE_NAME}`)
let dbNonce = require(`../db/nonce.json`)

async function processWithdraw(homeChainId){
  try {
    let foreignBlockNumber = await sendRawTx({
      url: FOREIGN_RPC_URL,
      params: [],
      method: 'eth_blockNumber'
    })
    if(foreignBlockNumber === undefined) {
      return;
    }
    foreignBlockNumber = Web3Utils.hexToNumber(foreignBlockNumber);
    if(foreignBlockNumber === db.processedBlock){
      return;
    }
    
    let transfers = await erc20token.getPastEvents('Transfer', {fromBlock: db.processedBlock + 1, toBlock: foreignBlockNumber});
    transfers = transfers.filter((transfer) => {
      return transfer.returnValues.to.toLowerCase() === FOREIGN_BRIDGE_ADDRESS.toLowerCase()
    })
    console.log(`Found ${transfers.length} Transfers on Foreign Network`);
    if(transfers.length > 0){
      await processTransfers(transfers, homeChainId);
    }

    db.processedBlock = foreignBlockNumber;
    console.log('writing db transfers', foreignBlockNumber)
    fs.writeFileSync(`${__dirname}/../db/${DB_FILE_NAME}`, JSON.stringify(db,null,4));
  } catch(e) {
    console.error(e);
  }
}

async function processTransfers(transfers, homeChainId){
  try{
    let nonce = await getNonce(web3Home, VALIDATOR_ADDRESS);
    nonce = Math.max(dbNonce.home, nonce);
    await asyncForEach(transfers, async (transfer, index) => {
      const {from, value} = transfer.returnValues;
      console.log('from: ', from, 'amount :', Web3Utils.fromWei(value))
      let gasEstimate;
      try {
        gasEstimate = await homeBridge.methods.deposit(
          from, value, transfer.transactionHash
        ).estimateGas({from: VALIDATOR_ADDRESS});
      } catch(e) {
        console.log(index+1, '# already processed token transfer', transfer.transactionHash)
        return;
      }
      const data = await homeBridge.methods.deposit(
        from, value, transfer.transactionHash
      ).encodeABI({from: VALIDATOR_ADDRESS});
      const gasPrice = await getGasPrices();
      const txHash = await sendTx({
        rpcUrl: HOME_RPC_URL,
        data,
        nonce,
        gasPrice: gasPrice.toString(10),
        amount: '0',
        gasLimit: 2000000,
        privateKey: VALIDATOR_ADDRESS_PRIVATE_KEY,
        to: HOME_BRIDGE_ADDRESS,
        chainId: homeChainId,
        web3: web3Home
      })
      console.log(index+1, '# processing token transfer', transfer.transactionHash, txHash);
      nonce += 1;
    })
    dbNonce.home = nonce;
    fs.writeFileSync(`${__dirname}/../db/nonce.json`, JSON.stringify(dbNonce,null,4));
  } catch(e) {
    throw new Error(e);
    console.error(e)
  }
}

module.exports = processWithdraw;