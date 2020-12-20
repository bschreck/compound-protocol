pragma solidity ^0.5.16;

import "../../contracts/ComptrollerG5.sol";

contract ComptrollerScenarioG5 is ComptrollerG5 {
    uint public blockNumber;

    constructor() ComptrollerG5() public {}

    function fastForward(uint blocks) public returns (uint) {
        blockNumber += blocks;
        return blockNumber;
    }

    function setBlockNumber(uint number) public {
        blockNumber = number;
    }

    function membershipLength(CTokenWithTermLoans cToken) public view returns (uint) {
        return accountAssets[address(cToken)].length;
    }

    function unlist(CTokenWithTermLoans cToken) public {
        markets[address(cToken)].isListed = false;
    }
}
