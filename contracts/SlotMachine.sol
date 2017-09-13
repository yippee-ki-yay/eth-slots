pragma solidity ^0.4.4;

contract SlotMachine {

    address public machineWallet;

    uint256 public coinPrice;

    function SlotMachine(uint256 _coinPrice) {
        coinPrice = _coinPrice;
    }

    //the user plays one roll of the machine putting in money for the win
    function oneRoll() payable returns(uint) {
        require(msg.value >= coinPrice);

        uint rand1 = randomGen(msg.value);
        uint rand2 = randomGen(msg.value + 10);
        uint rand3 = randomGen(msg.value + 20);

        uint result = gameLogic(rand1, rand2, rand3);

        return result;
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


    function randomGen(uint seed) constant returns (uint randomNumber) {
        return(uint(sha3(block.blockhash(block.number-1), seed )) % 6);
    }

    function buyTokens(uint256 numTokens) {
        require(numTokens <= 5);
        require(msg.value >= coinPrice * numTokens);

        //TODO

    }
}
