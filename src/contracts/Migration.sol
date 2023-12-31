pragma solidity ^0.5.0;

contract Migrations{
    address public owner;
    uint public last_completed_migration;

    constructor() public {
        owner=msg.sender;
    }

    modifier restriceted(){
        if(msg.sender == owner)_; 
    }

    function setCompleted(uint completed) public restriceted{
        last_completed_migration = completed;
    }

    function upgrade(address new_address) public restriceted{
        Migrations upgraded = Migrations(new_address);
        upgraded.setCompleted(last_completed_migration);
    }
}