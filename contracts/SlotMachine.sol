pragma solidity ^0.4.4;

contract SlotMachine {

    address public slotMachineFunds;

    uint256 public coinPrice = 0.1 ether;

    address owner;

    event Rolled(address sender, uint rand1, uint rand2, uint rand3);

    struct Result {
        uint rand1;
        uint rand2;
        uint rand3;
    }

    mapping (address => Result) currResults;
    mapping (address => uint) pendingWithdrawals;

    modifier onlyOwner() {
        require(owner == msg.sender);
        _;
    }

    function SlotMachine() {
        owner = msg.sender;
    }

    //the user plays one roll of the machine putting in money for the win
    function oneRoll() payable {
        require(msg.value >= coinPrice);

        uint rand1 = randomGen(msg.value);
        uint rand2 = randomGen(msg.value + 10);
        uint rand3 = randomGen(msg.value + 20);

        uint result = gameLogic(rand1, rand2, rand3);

        Rolled(msg.sender, rand1, rand2, rand3);

        currResults[msg.sender] = Result(rand1, rand2, rand3);

        // if(result == 1) {
        //     pendingWithdrawals[msg.sender] += msg.value + coinPrice;
        // } else if(result == 2) {
            pendingWithdrawals[msg.sender] += msg.value;
        //}

    }
    
    function contractBalance() returns(uint) {
        return this.balance;
    }

    function gameLogic(uint rand1, uint rand2, uint rand3) returns(uint) {
        if((rand1 == rand2) && (rand1 == rand3)) {
            return 1;
        } else if ((rand1 == rand2) || (rand1 == rand3) || (rand2 == rand3)) {
            return 2;
        } else {
            return 3;
        }
    }

    function withdraw() {
        uint amount = pendingWithdrawals[msg.sender];

        pendingWithdrawals[msg.sender] = 0;

        msg.sender.transfer(amount);
    }

    function getResult(address user) constant returns(uint, uint, uint) {
        Result r = currResults[user];
        return (r.rand1, r.rand2, r.rand3);
    }

    function balanceOf(address user) constant returns(uint) {
        return pendingWithdrawals[user];
    }

    function setCoinPrice(uint _coinPrice) onlyOwner {
        coinPrice = _coinPrice;
    }

    function() onlyOwner payable {
    }

    function randomGen(uint seed) constant returns (uint randomNumber) {
        return(uint(sha3(block.blockhash(block.number-1), seed )) % 6);
    }

}
