const Mvp = artifacts.require('Mvp');
const RWD = artifacts.require('RWD');
const Admin = artifacts.require('Admin');

module.exports = async function(deployer, network, accounts){
    //Deploy WithSports token Contract
    await deployer.deploy(Mvp)
    const mvp = await Mvp.deployed()

    //Deploy RWD Contract
    await deployer.deploy(RWD)
    const rwd = await RWD.deployed()

    //Deploy Admin Contract
    await deployer.deploy(Admin, rwd.address, mvp.address)
    const admin = await Admin.deployed()

    //Transfer all RWD tokens to Admin
    await rwd.transfer(admin.address,'1000000000000000000000000')

    //Distribute 10000 Mvp tokens to investor
    await mvp.transfer(accounts[1], '10000000000000000000000')
}
/*
const RWD = artifacts.require('RWD');
const Admin = artifacts.require('Admin');
const Mvp = artifacts.require('Mvp');

module.exports = async function(callback) {
  try {
    const rwd = await RWD.at('0x5225ad55ad7ed9056b824eeca8e499bd831b5435');
    const mvp = await Mvp.at('0x39d3fb2fbf1cd742e9700bf7750702486862db28');
    const admin = await Admin.at('0x4958d118da55cf629f8bc7d93bf1784f9f72f4c5');

    await rwd.transfer('0x4958d118da55cf629f8bc7d93bf1784f9f72f4c5', '1000000000000000000000000');
    await mvp.transfer('0xe33237108613639Ca6262afEd0492C965C450127', '10000000000000000000000');
    
    callback();
  } catch (error) {
    console.error(error);
    callback(error);
  }
};
*/