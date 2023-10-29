const Admin = artifacts.require('Admin');

module.exports = async function issueRewards(callback){
    let admin = await Admin.deployed();
    await admin.issueTokens();
    console.log('Tokens have been issued successfully')
    callback()
}