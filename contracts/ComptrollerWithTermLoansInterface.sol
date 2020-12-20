pragma solidity ^0.5.16;
import "./ComptrollerInterface.sol";

contract ComptrollerWithTermLoansInterface is ComptrollerInterface{
    function borrowAllowed(
      address cToken,
      address borrower,
      uint borrowAmount,
      uint loanIndex) external returns (uint);
    function borrowVerify(
      address cToken,
      address borrower,
      uint borrowAmount,
      uint loanIndex) external;

    function repayBorrowAllowed(
        address cToken,
        address payer,
        address borrower,
        uint repayAmount,
        uint loanIndex) external returns (uint);
    function repayBorrowVerify(
        address cToken,
        address payer,
        address borrower,
        uint repayAmount,
        uint borrowerIndex,
        uint loanIndex) external;

    function liquidateBorrowAllowed(
        address cTokenBorrowed,
        address cTokenCollateral,
        address liquidator,
        address borrower,
        uint repayAmount,
        uint loanIndex) external returns (uint);
    function liquidateBorrowVerify(
        address cTokenBorrowed,
        address cTokenCollateral,
        address liquidator,
        address borrower,
        uint repayAmount,
        uint seizeTokens,
        uint loanIndex) external;
}
