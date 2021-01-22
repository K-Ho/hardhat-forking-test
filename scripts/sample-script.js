// We require the Hardhat Runtime Environment explicitly here. This is optional 
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
const ethers = hre.ethers
const ethersReal = require("ethers")
const { getContractInterface } = require('@eth-optimism/contracts/build/src/contract-defs')

async function main() {
  let l1Addresses = {
    'OVM_AddressManager': '0x1De8CFD4C1A486200286073aE91DE6e8099519f1',
  }
  
  await hre.network.provider.request({
    method: "hardhat_impersonateAccount",
    params: ["0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A"]}
  )
  const signer = await ethers.provider.getSigner('0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A')
  const AddressManager = new ethers.Contract(
    '0x1De8CFD4C1A486200286073aE91DE6e8099519f1',
    getContractInterface('Lib_AddressManager'),
    ethers.provider
  )
  const originalAddress = await AddressManager.getAddress('OVM_StateCommitmentChain')
  console.log('orignal SCC address', originalAddress)
  console.log('get owner', await AddressManager.owner())
  const txData = await AddressManager.populateTransaction.setAddress('OVM_StateCommitmentChain', '0x162459Bb429a63D2e31Fe2d1cdb5b058f2D31AdF')
  console.log('sending tx', txData)
  
  const sentTx = await signer.sendTransaction(txData)
  const receipt = await sentTx.wait()
  console.log('address set', receipt)
  const updatedAddress = await AddressManager.getAddress('OVM_StateCommitmentChain')
  console.log('updated SCC address', updatedAddress)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
