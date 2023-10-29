const Ws = artifacts.require('Ws');
const RWD = artifacts.require('RWD');
const Admin = artifacts.require('Admin');

module.exports = async function(deployer, network, accounts){
    //Deploy WithSports token Contract
    await deployer.deploy(Ws)
    const ws = await Ws.deployed()

    //Deploy RWD Contract
    await deployer.deploy(RWD)
    const rwd = await RWD.deployed()

    //Deploy Admin Contract
    await deployer.deploy(Admin, rwd.address, ws.address)
    const admin = await Admin.deployed()

    //Transfer all RWD tokens to Admin
    await rwd.transfer(admin.address,'1000000000000000000000000')

    //Distribute 10000 Ws tokens to investor
    await ws.transfer(accounts[9], '10000000000000000000000')
}