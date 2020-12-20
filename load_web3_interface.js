//var Contract = require('web3-eth-contract');
//const fs = require('fs');
//
//function createContractObject(filename, contractName, addr='0x5802d9E92F1A818c1ABcd5F84E8277e3E4d6bA8d') {
//  let rawdata = fs.readFileSync('.build/contracts.json');
//  let contracts = JSON.parse(rawdata);
//  let contractAbi = JSON.parse(contracts.contracts['tests/Contracts/' + filename + ':' + contractName]['abi']);
//  console.log(contractAbi);
//  return new Contract(contractAbi, addr);
//}
//
////const [filename, contractName] = args;
//let contract = createContractObject('ComptrollerHarness.sol', 'BoolComptrollerWithTermLoans');
////console.log(contract.currentProvider());
////console.log(contract.methods.borrowAllowed);
//addr = '0x5802d9E92F1A818c1ABcd5F84E8277e3E4d6bA8d'
//console.log(contract.methods.borrowAllowed(addr, addr,5).estimateGas());


(async function() {
  let contract = await saddle.deploy('ComptrollerInterface');
})();
