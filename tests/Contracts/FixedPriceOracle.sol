pragma solidity ^0.5.16;

import "../../contracts/PriceOracleWithTermLoans.sol";

contract FixedPriceOracleWithTermLoans is PriceOracleWithTermLoans {
    uint public price;

    constructor(uint _price) public {
        price = _price;
    }

    function getUnderlyingPrice(CTokenWithTermLoans cToken) public view returns (uint) {
        cToken;
        return price;
    }

    function assetPrices(address asset) public view returns (uint) {
        asset;
        return price;
    }
}
