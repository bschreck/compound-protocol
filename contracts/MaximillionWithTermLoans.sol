pragma solidity ^0.5.16;

import "./CEtherWithTermLoans.sol";

/**
 * @title Compound's Maximillion Contract
 * @author Ben Schreck
 */
contract MaximillionWithTermLoans {
    /**
     * @notice The default cEther market to repay in
     */
    CEtherWithTermLoans public cEther; // MODIFIED

    /**
     * @notice Construct a Maximillion to repay max in a CEther market
     */
    constructor(CEtherWithTermLoans cEther_) public {
        cEther = cEther_;
    }

    /**
     * @notice msg.sender sends Ether to repay an account's borrow in the cEther market
     * @dev The provided Ether is applied towards the borrow balance, any excess is refunded
     * @param borrower The address of the borrower account to repay on behalf of
     * @param loanIndex Index of loan to repay
     */
    function repayBehalf(address borrower, uint loanIndex) public payable {
        repayBehalfExplicit(borrower, loanIndex, cEther);
    }

    /**
     * @notice msg.sender sends Ether to repay an account's borrow in a cEther market
     * @dev The provided Ether is applied towards the borrow balance, any excess is refunded
     * @param borrower The address of the borrower account to repay on behalf of
     * @param loanIndex Index of loan to repay
     * @param cEther_ The address of the cEther contract to repay in
     */
    function repayBehalfExplicit(address borrower, uint loanIndex, CEtherWithTermLoans cEther_) public payable {
        uint received = msg.value;
        uint borrows = cEther_.borrowBalanceCurrent(borrower);
        if (received > borrows) {
            cEther_.repayBorrowBehalf.value(borrows)(borrower, loanIndex);
            msg.sender.transfer(received - borrows);
        } else {
            cEther_.repayBorrowBehalf.value(received)(borrower, loanIndex);
        }
    }
}
