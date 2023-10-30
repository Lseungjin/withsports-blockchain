//관리자지갑(은행개념으로 작성하는게 좋을 것 같다. -> 관리자 지갑에서 사용자에게 mvp발생떄마다 지급하기떄문에)
pragma solidity ^0.5.0;
import './RWD.sol';
import './Mvp.sol';

contract Admin{
    string public name = 'Admin';
    address public owner;
    Mvp public mvp;
    RWD public rwd;

    address[] public stakers;
    
    mapping (address => uint) public stakingBalance;
    mapping(address => bool) public hasStaked;
    mapping(address => bool) public isStaking;

    constructor(RWD _rwd, Mvp _mvp) public {
        rwd = _rwd;
        mvp = _mvp;
        owner = msg.sender;
    }

    // staking function
    function depositTokens(uint _amount) public {
        //require staking amount to be greater than zero
        require(_amount > 0,'amount cannot be 0');

        //Transfer tether tokens to this contract address for staking
        mvp.transferFrom(msg.sender, address(this), _amount);

        //Update StakingBalance
        stakingBalance[msg.sender] = stakingBalance[msg.sender] + _amount;

        if(!hasStaked[msg.sender]){
            stakers.push(msg.sender);

            //Update Staking Balance
            isStaking[msg.sender] = true;
            hasStaked[msg.sender] = true;
        }
    }

    //unstake tokens
    function unstakeTokens() public {
        uint balance = stakingBalance[msg.sender]; 
        // require the amoount to be greater zero        
        require(balance > 0, 'staking balance cannot be less than zero');

        //transfer the tokens to the sepecified contract address from our bank.
        mvp.transfer(msg.sender, balance);
        
        // reset staking balance
        stakingBalance[msg.sender] = 0;
        
        //Update Staking Status
        isStaking[msg.sender] = false;
    }

    //issue rewards
    function issueTokens() public {
        //require the owner to issue tokens only
        require(msg.sender == owner, ' caller must be the owner');

        for (uint i=0; i<stakers.length; i++){
            address recipient = stakers[i];
            // 10000 to create percentage incentive for stakers
            uint balance = stakingBalance[recipient] / 10000; 
    
            if(balance >0){
            rwd.transfer(recipient, balance); 
            }
        }
    }
}