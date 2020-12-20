pragma solidity ^0.5.16;

import "./CErc20WithTermLoansDelegate.sol";
import "./CCompLikeDelegate.sol";

/**
 * @title Compound's CCompLikeDelegate Contract
 * @notice CTokens which can 'delegate votes' of their underlying ERC-20
 * @author Compound
 */
contract CCompWithTermLoansLikeDelegate is CErc20WithTermLoansDelegate {
  /**
   * @notice Construct an empty delegate
   */
  constructor() public CErc20WithTermLoansDelegate() {}

  /**
   * @notice Admin call to delegate the votes of the COMP-like underlying
   * @param compLikeDelegatee The address to delegate votes to
   */
  function _delegateCompLikeTo(address compLikeDelegatee) external {
    require(msg.sender == admin, "only the admin may set the comp-like delegate");
    CompLike(underlying).delegate(compLikeDelegatee);
  }
}
