const SmartsdxToken = artifacts.require('SmartsdxToken.sol')
// const CipherToken = artifacts.require('CipherToken.sol')
const xSSDXToken = artifacts.require('xSSDXToken.sol')
const MasterChef = artifacts.require('MasterChef.sol')

//const GovernerAlpha = artifacts.require('GovernerAlpha.sol')

module.exports = async function(deployer) {
  // Deploy Sushi Token
  await deployer.deploy(SmartsdxToken)
  const smartsdxToken = await SmartsdxToken.deployed()
  // smartsdxToken.mint('0x713a803e73Ce6B7584203bB5B8d837a9572011E1', 10000000000000000)

  await deployer.deploy(xSSDXToken, smartsdxToken.address)
  const xsmartsdxToken = await xSSDXToken.deployed()
  // xsmartsdxToken.mint('0x713a803e73Ce6B7584203bB5B8d837a9572011E1', 10000000000)

  // await deployer.deploy(
  //   GovernerAlpha,
  //   'timelock',
  //   smartsdxToken.address,
  //   'guardian address here'
  // )

  // Deploy Masterchef Contract
  await deployer.deploy(
    MasterChef,
    smartsdxToken.address,
    process.env.DEV_ADDRESS, // Your address where you get sushi tokens - should be a multisig
    web3.utils.toWei(process.env.TOKENS_PER_BLOCK), // Number of tokens rewarded per block, e.g., 100
    process.env.START_BLOCK, // Block number when token mining starts
    process.env.BONUS_END_BLOCK // Block when bonus ends
  )

  // Make Masterchef contract token owner
  const masterChef = await MasterChef.deployed()
  await smartsdxToken.transferOwnership(masterChef.address)
  //await xsmartsdxToken.transferOwnership(masterChef.address)

  // Add Liquidity pool for rewards, e.g., "ETH/DAI Pool"
  await masterChef.add(
    process.env.ALLOCATION_POINT,
    process.env.LP_TOKEN_ADDRESS,
    false
  )

  // Add more liquidity pools here upon deployment, or add them later manually
  await masterChef.add(
    process.env.ALLOCATION_POINT,
    '0xaB46d7b46e38dFd57AaB9D916d93fb307304B374', // lp token address for each pool you want to add
    true
  )




}