
const Mvp = artifacts.require('Mvp');
const RWD = artifacts.require('RWD');
const Admin = artifacts.require('Admin');

require('chai')
.use(require('chai-as-promised'))
.should() 

contract('Admin',([owner, user]) =>{
    let mvp, rwd, admin

    function tokens(number){
        return web3.utils.toWei(number, 'ether')
    }
    before(async () => {
        //계약 가져오기
        mvp = await Mvp.new()
        rwd = await RWD.new()
        admin = await Admin.new(rwd.address, mvp.address)

        //"rwd" 토큰을 "admin.address"로 100만 개 전송
        await rwd.transfer(admin.address, tokens('1000000'))

        // "mvp" 토큰을 "owner"에서 "user"로 1만 개 전송
        await mvp.transfer(user, tokens('10000'), {from: owner})
    })
    describe('Mvp Token Deployment', async () =>{
        it('matches name succesfully', async () => {
            const name = await mvp.name()
            assert.equal(name, 'Mvp Token' )
        })
    })
    describe('Reward Token Deployment', async () =>{
        it('matches name succesfully', async () => {
            const name = await rwd.name()
            assert.equal(name, 'Reward Token' )
        })
    })
    describe('Admin Deployment', async () =>{
        it('matches name succesfully', async () => {
            const name = await admin.name()
            assert.equal(name, 'Admin' )
        })
        
        it('contract has tokens', async() => {
            
            let balance = await rwd.balanceOf(admin.address)
            assert.equal(balance, tokens('1000000'))
        })
        describe('Yield Farming', async () =>{
            it('reward tokens for staking', async() =>{
                let result
                //check investor balance 
                result = await mvp.balanceOf(user) 
                assert.equal(result.toString(), tokens('10000'), ('스테이킹 전 사용자 지갑 잔액'))

                //Check staking for user of 10000 token 
                await mvp.approve(admin.address, tokens('10000'),{from: user}) 
                await admin.depositTokens(tokens('10000'), {from: user})
                //Check Updated Balance of user 
                result = await mvp.balanceOf(user) 
                assert.equal(result.toString(), tokens('0'), ('10000개의 토큰을 스테이킹한 후 사용자 지갑 잔액'))
                //Check Updated Balance of admin
                result = await mvp.balanceOf(admin.address)
                assert.equal(result.toString(), tokens('10000'), ('고객으로부터 스테이킹한 후 관리자 지갑 잔액'))

                //Is Staking Update 
                result = await admin.isStaking(user) 
                assert.equal(result.toString(), 'true', '스테이킹 후 스테이킹 상태 업데이트(사용자)')

                //토큰 발행여부 확인
                await admin.issueTokens({from: owner})
                //user의 토큰 발행 거부
                await admin.issueTokens({from: user}).should.be.rejected;
                //unstake tokens
                await admin.unstakeTokens({from:user})

                //Check Unstaking Balances
                result = await mvp.balanceOf(user) 
                assert.equal(result.toString(), tokens('10000'), '언스테이킹 후 사용자 지갑 잔액')
                 
                //Check Updated Balance of admin
                result = await mvp.balanceOf(admin.address)
                assert.equal(result.toString(), tokens('10000'), '사용자로부터 스테이킹한 후 관리자 지갑 잔액')
 
                //Is Staking Update
                result = await admin.isStaking(user)
                assert.equal(result.toString(), 'false', '사용자는 언스테이킹 이후 스테이킹 하지 않는다.')

                //rwd token
                result = await rwd.balanceOf(user) 
                const initialRewardBalance = result.toString()
                console.log(`Initial Reward Balance: ${initialRewardBalance}`)
          
                // 토큰 발행
                await admin.issueTokens({from: owner})
          
                // 스테이킹 후 사용자의 보상 토큰 잔액 확인
                result = await rwd.balanceOf(user)
                const finalRewardBalance = result.toString()
                console.log(`Final Reward Balance: ${finalRewardBalance}`)
          
                // 보상 비율 확인
                const rewardRatio = finalRewardBalance / tokens('10000')
                console.log(`Reward Ratio: ${rewardRatio}`)
            }) 
        })
    })
})