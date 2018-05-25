require('dotenv').config();
const {sendRawTx} = require('./tx/sendTx');
const processCollectedSignatures = require('./processCollectedSignatures');
const processWithdraw = require('./processWithdraw');
const processTransfer = require('./processTransfers');


async function getChainIds(){
  const {
    HOME_RPC_URL,
    FOREIGN_RPC_URL
  } = process.env;
  let homeChainId = await sendRawTx({
    url: HOME_RPC_URL,
    params: [],
    method: 'net_version'
  })
  const foreignChainId = await sendRawTx({
    url: FOREIGN_RPC_URL,
    params: [],
    method: 'net_version'
  })
  console.log('Home Chain ID:', homeChainId);
  console.log('Foreign Chain ID:', foreignChainId);
  main({
    foreignChainId,
    homeChainId
  })

}

async function main({
  homeChainId,
  foreignChainId
}){ 
  await processTransfer(homeChainId);
  
  await processCollectedSignatures(foreignChainId)
  
  await processWithdraw(homeChainId);
  
  setTimeout(() => {
    main({
      foreignChainId,
      homeChainId
    });
  }, 1000)
}
getChainIds();
