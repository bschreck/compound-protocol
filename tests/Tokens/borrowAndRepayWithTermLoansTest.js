const {
  etherUnsigned,
  etherMantissa,
  UInt256Max
} = require('../Utils/Ethereum');

const {
  makeCToken,
  balanceOf,
  borrowSnapshot,
  totalBorrows,
  fastForward,
  setBalance,
  preApprove,
  pretendBorrow
} = require('../Utils/Compound');

const borrowAmount = etherUnsigned(10e3);
const repayAmount = etherUnsigned(10e2);

async function preBorrow(cToken, borrower, borrowAmount) {
  await send(cToken.comptroller, 'setBorrowAllowed', [true]);
  await send(cToken.comptroller, 'setBorrowVerify', [true]);
  await send(cToken.interestRateModel, 'setFailBorrowRate', [false]);
  await send(cToken.underlying, 'harnessSetBalance', [cToken._address, borrowAmount]);
  await send(cToken, 'harnessSetFailTransferToAddress', [borrower, false]);
  await send(cToken, 'harnessSetAccountBorrows', [borrower, 0, 0]);
  await send(cToken, 'harnessSetTotalBorrows', [0]);
}

async function borrowFresh(cToken, borrower, borrowAmount, deadline) {
  return send(cToken, 'harnessBorrowFresh', [borrower, borrowAmount, deadline]);
}

async function borrow(cToken, borrower, borrowAmount, deadline, opts = {}) {
  // make sure to have a block delta so we accrue interest
  await send(cToken, 'harnessFastForward', [1]);
  return send(cToken, 'borrow', [borrowAmount, deadline], {from: borrower});
}

async function preRepay(cToken, benefactor, borrower, repayAmount, loanIndex, deadline) {
  // setup either benefactor OR borrower for success in repaying
  await send(cToken.comptroller, 'setRepayBorrowAllowed', [true]);
  await send(cToken.comptroller, 'setRepayBorrowVerify', [true]);
  await send(cToken.interestRateModel, 'setFailBorrowRate', [false]);
  await send(cToken.underlying, 'harnessSetFailTransferFromAddress', [benefactor, false]);
  await send(cToken.underlying, 'harnessSetFailTransferFromAddress', [borrower, false]);
  await pretendBorrow(cToken, borrower, 1, 1, repayAmount, loanIndex=loanIndex, deadline=deadline);
  await preApprove(cToken, benefactor, repayAmount, loanIndex);
  await preApprove(cToken, borrower, repayAmount, loanIndex);
}

async function repayBorrowFresh(cToken, payer, borrower, repayAmount, loanIndex) {
  return send(cToken, 'harnessRepayBorrowFresh', [payer, borrower, repayAmount, loanIndex], {from: payer});
}

async function repayBorrow(cToken, borrower, repayAmount, loanIndex) {
  // make sure to have a block delta so we accrue interest
  await send(cToken, 'harnessFastForward', [1]);
  return send(cToken, 'repayBorrow', [repayAmount, loanIndex], {from: borrower});
}

async function repayBorrowBehalf(cToken, payer, borrower, repayAmount, loanIndex) {
  // make sure to have a block delta so we accrue interest
  await send(cToken, 'harnessFastForward', [1]);
  return send(cToken, 'repayBorrowBehalf', [borrower, repayAmount, loanIndex], {from: payer});
}

describe('CTokenWithTermLoans', function () {
  let cToken, root, borrower, benefactor, accounts;
  let loanIndex = 0;
  let deadline = UInt256Max();
  beforeEach(async () => {
    [root, borrower, benefactor, ...accounts] = saddle.accounts;
    cToken = await makeCToken(opts={withTermLoans: true, comptrollerOpts: {kind: 'bool-with-term-loans'}});
  });

  describe('test', () => {
    it ("makes cToken", async () => {
      expect(cToken.comptroller).toEqualNumber(3);
    })
  });
  //describe('borrowFresh', () => {
  //  beforeEach(async () => await preBorrow(cToken, borrower, borrowAmount, loanIndex));

  //  it("fails if comptroller tells it to", async () => {
  //    await send(cToken.comptroller, 'setBorrowAllowed', [false]);
  //    expect(await borrowFresh(cToken, borrower, borrowAmount, deadline)).toHaveTrollReject('BORROW_COMPTROLLER_REJECTION');
  //  });

  //  it("proceeds if comptroller tells it to", async () => {
  //    await expect(await borrowFresh(cToken, borrower, borrowAmount, deadline)).toSucceed();
  //  });

  //  it("fails if market not fresh", async () => {
  //    await fastForward(cToken);
  //    expect(await borrowFresh(cToken, borrower, borrowAmount, deadline)).toHaveTokenFailure('MARKET_NOT_FRESH', 'BORROW_FRESHNESS_CHECK');
  //  });

  //  it("continues if fresh", async () => {
  //    await expect(await send(cToken, 'accrueInterest')).toSucceed();
  //    await expect(await borrowFresh(cToken, borrower, borrowAmount, deadline)).toSucceed();
  //  });

  //  it("fails if error if protocol has less than borrowAmount of underlying", async () => {
  //    expect(await borrowFresh(cToken, borrower, borrowAmount.plus(1), deadline)).toHaveTokenFailure('TOKEN_INSUFFICIENT_CASH', 'BORROW_CASH_NOT_AVAILABLE');
  //  });

  //  it("fails if borrowBalanceStored fails (due to non-zero stored principal with zero account index)", async () => {
  //    await pretendBorrow(cToken, borrower, 0, 3e18, 5e18, loanIndex=loanIndex, deadline=deadline);
  //    expect(await borrowFresh(cToken, borrower, borrowAmount, deadline)).toHaveTokenFailure('MATH_ERROR', 'BORROW_ACCUMULATED_BALANCE_CALCULATION_FAILED');
  //  });

  //  it("fails if calculating account new total borrow balance overflows", async () => {
  //    await pretendBorrow(cToken, borrower, 1e-18, 1e-18, UInt256Max(), loanIndex=loanIndex, deadline=deadline);
  //    expect(await borrowFresh(cToken, borrower, borrowAmount, deadline)).toHaveTokenFailure('MATH_ERROR', 'BORROW_NEW_ACCOUNT_BORROW_BALANCE_CALCULATION_FAILED');
  //  });

  //  it("fails if calculation of new total borrow balance overflows", async () => {
  //    await send(cToken, 'harnessSetTotalBorrows', [UInt256Max()]);
  //    expect(await borrowFresh(cToken, borrower, borrowAmount, deadline)).toHaveTokenFailure('MATH_ERROR', 'BORROW_NEW_TOTAL_BALANCE_CALCULATION_FAILED');
  //  });

  //  it("reverts if transfer out fails", async () => {
  //    await send(cToken, 'harnessSetFailTransferToAddress', [borrower, true]);
  //    await expect(borrowFresh(cToken, borrower, borrowAmount, deadline)).rejects.toRevert("revert TOKEN_TRANSFER_OUT_FAILED");
  //  });

  //  it("reverts if borrowVerify fails", async() => {
  //    await send(cToken.comptroller, 'setBorrowVerify', [false]);
  //    await expect(borrowFresh(cToken, borrower, borrowAmount, deadline)).rejects.toRevert("revert borrowVerify rejected borrow");
  //  });

  //  it("transfers the underlying cash, tokens, and emits Transfer, Borrow events", async () => {
  //    const beforeProtocolCash = await balanceOf(cToken.underlying, cToken._address);
  //    const beforeProtocolBorrows = await totalBorrows(cToken);
  //    const beforeAccountCash = await balanceOf(cToken.underlying, borrower);
  //    const result = await borrowFresh(cToken, borrower, borrowAmount, deadline);
  //    expect(result).toSucceed();
  //    expect(await balanceOf(cToken.underlying, borrower)).toEqualNumber(beforeAccountCash.plus(borrowAmount));
  //    expect(await balanceOf(cToken.underlying, cToken._address)).toEqualNumber(beforeProtocolCash.minus(borrowAmount));
  //    expect(await totalBorrows(cToken)).toEqualNumber(beforeProtocolBorrows.plus(borrowAmount));
  //    expect(result).toHaveLog('Transfer', {
  //      from: cToken._address,
  //      to: borrower,
  //      amount: borrowAmount.toString()
  //    });
  //    expect(result).toHaveLog('Borrow', {
  //      borrower: borrower,
  //      borrowAmount: borrowAmount.toString(),
  //      accountBorrows: borrowAmount.toString(),
  //      totalBorrows: beforeProtocolBorrows.plus(borrowAmount).toString(),
  //      loanIndex: 0
  //    });
  //  });

  //  it("stores new borrow principal and interest index", async () => {
  //    const beforeProtocolBorrows = await totalBorrows(cToken);
  //    await pretendBorrow(cToken, borrower, 0, 3, 0, deadline=deadline, loanIndex=loanIndex);
  //    await borrowFresh(cToken, borrower, borrowAmount, deadline);
  //    const borrowSnap = await borrowSnapshot(cToken, borrower, loanIndex=loanIndex);
  //    expect(borrowSnap.principal).toEqualNumber(borrowAmount);
  //    expect(borrowSnap.interestIndex).toEqualNumber(etherMantissa(3));
  //    expect(borrowSnap.deadline).toEqualNumber(UInt256Max());
  //    expect(await totalBorrows(cToken)).toEqualNumber(beforeProtocolBorrows.plus(borrowAmount));
  //  });
  //});

  //describe('borrow', () => {
  //  const deadline = UInt256Max();
  //  beforeEach(async () => await preBorrow(cToken, borrower, borrowAmount));

  //  it("emits a borrow failure if interest accrual fails", async () => {
  //    await send(cToken.interestRateModel, 'setFailBorrowRate', [true]);
  //    await expect(borrow(cToken, borrower, borrowAmount, deadline)).rejects.toRevert("revert INTEREST_RATE_MODEL_ERROR");
  //  });

  //  it("returns error from borrowFresh without emitting any extra logs", async () => {
  //    expect(await borrow(cToken, borrower, borrowAmount.plus(1), deadline)).toHaveTokenFailure('TOKEN_INSUFFICIENT_CASH', 'BORROW_CASH_NOT_AVAILABLE');
  //  });

  //  it("returns success from borrowFresh and transfers the correct amount", async () => {
  //    const beforeAccountCash = await balanceOf(cToken.underlying, borrower);
  //    await fastForward(cToken);
  //    expect(await borrow(cToken, borrower, borrowAmount, deadline)).toSucceed();
  //    expect(await balanceOf(cToken.underlying, borrower)).toEqualNumber(beforeAccountCash.plus(borrowAmount));
  //  });
  //});

  //describe('repayBorrowFresh', () => {
  //  [true, false].forEach((benefactorIsPayer) => {
  //    let payer;
  //    const label = benefactorIsPayer ? "benefactor paying" : "borrower paying";
  //    const loanIndex = 0;
  //    const deadline = UInt256Max();
  //    describe(label, () => {
  //      beforeEach(async () => {
  //        payer = benefactorIsPayer ? benefactor : borrower;
  //        await preRepay(cToken, payer, borrower, repayAmount, loanIndex, deadline);
  //      });

  //      it("fails if repay is not allowed", async () => {
  //        await send(cToken.comptroller, 'setRepayBorrowAllowed', [false]);
  //        expect(await repayBorrowFresh(cToken, payer, borrower, repayAmount, loanIndex)).toHaveTrollReject('REPAY_BORROW_COMPTROLLER_REJECTION', 'MATH_ERROR');
  //      });

  //      it("fails if block number ≠ current block number", async () => {
  //        await fastForward(cToken);
  //        expect(await repayBorrowFresh(cToken, payer, borrower, repayAmount, loanIndex)).toHaveTokenFailure('MARKET_NOT_FRESH', 'REPAY_BORROW_FRESHNESS_CHECK');
  //      });

  //      it("fails if insufficient approval", async() => {
  //        await preApprove(cToken, payer, 1);
  //        await expect(repayBorrowFresh(cToken, payer, borrower, repayAmount, loanIndex)).rejects.toRevert('revert Insufficient allowance');
  //      });

  //      it("fails if insufficient balance", async() => {
  //        await setBalance(cToken.underlying, payer, 1);
  //        await expect(repayBorrowFresh(cToken, payer, borrower, repayAmount, loanIndex)).rejects.toRevert('revert Insufficient balance');
  //      });


  //      it("returns an error if calculating account new account borrow balance fails", async () => {
  //        await pretendBorrow(cToken, borrower, 1, 1, 1, deadline);
  //        await expect(repayBorrowFresh(cToken, payer, borrower, repayAmount, loanIndex)).rejects.toRevert("revert REPAY_BORROW_NEW_ACCOUNT_BORROW_BALANCE_CALCULATION_FAILED");
  //      });

  //      it("returns an error if calculation of new total borrow balance fails", async () => {
  //        await send(cToken, 'harnessSetTotalBorrows', [1]);
  //        await expect(repayBorrowFresh(cToken, payer, borrower, repayAmount, loanIndex)).rejects.toRevert("revert REPAY_BORROW_NEW_TOTAL_BALANCE_CALCULATION_FAILED");
  //      });


  //      it("reverts if doTransferIn fails", async () => {
  //        await send(cToken.underlying, 'harnessSetFailTransferFromAddress', [payer, true]);
  //        await expect(repayBorrowFresh(cToken, payer, borrower, repayAmount, loanIndex)).rejects.toRevert("revert TOKEN_TRANSFER_IN_FAILED");
  //      });

  //      it("reverts if repayBorrowVerify fails", async() => {
  //        await send(cToken.comptroller, 'setRepayBorrowVerify', [false]);
  //        await expect(repayBorrowFresh(cToken, payer, borrower, repayAmount, loanIndex)).rejects.toRevert("revert repayBorrowVerify rejected repayBorrow");
  //      });

  //      it("transfers the underlying cash, and emits Transfer, RepayBorrow events", async () => {
  //        const beforeProtocolCash = await balanceOf(cToken.underlying, cToken._address);
  //        const result = await repayBorrowFresh(cToken, payer, borrower, repayAmount, loanIndex);
  //        expect(await balanceOf(cToken.underlying, cToken._address)).toEqualNumber(beforeProtocolCash.plus(repayAmount));
  //        expect(result).toHaveLog('Transfer', {
  //          from: payer,
  //          to: cToken._address,
  //          amount: repayAmount.toString()
  //        });
  //        expect(result).toHaveLog('RepayBorrow', {
  //          payer: payer,
  //          borrower: borrower,
  //          repayAmount: repayAmount.toString(),
  //          loanIndex: loanIndex,
  //          accountBorrows: "0",
  //          totalBorrows: "0"
  //        });
  //      });

  //      it("stores new borrow principal and interest index", async () => {
  //        const beforeProtocolBorrows = await totalBorrows(cToken);
  //        const beforeAccountBorrowSnap = await borrowSnapshot(cToken, borrower, loanIndex);
  //        expect(await repayBorrowFresh(cToken, payer, borrower, repayAmount, loanIndex)).toSucceed();
  //        const afterAccountBorrows = await borrowSnapshot(cToken, borrower, loanIndex);
  //        expect(afterAccountBorrows.principal).toEqualNumber(beforeAccountBorrowSnap.principal.minus(repayAmount));
  //        expect(afterAccountBorrows.interestIndex).toEqualNumber(etherMantissa(1));
  //        expect(afterAccountBorrows.deadline).toEqualNumber(deadline);
  //        expect(await totalBorrows(cToken)).toEqualNumber(beforeProtocolBorrows.minus(repayAmount));
  //      });
  //    });
  //  });
  //});

  //describe('repayBorrow', () => {
  //  const loanIndex = 0;
  //  const deadline = UInt256Max();
  //  beforeEach(async () => {
  //    await preRepay(cToken, borrower, borrower, repayAmount, loanIndex, deadline);
  //  });

  //  it("emits a repay borrow failure if interest accrual fails", async () => {
  //    await send(cToken.interestRateModel, 'setFailBorrowRate', [true]);
  //    await expect(repayBorrow(cToken, borrower, repayAmount, loanIndex)).rejects.toRevert("revert INTEREST_RATE_MODEL_ERROR");
  //  });

  //  it("returns error from repayBorrowFresh without emitting any extra logs", async () => {
  //    await setBalance(cToken.underlying, borrower, 1);
  //    await expect(repayBorrow(cToken, borrower, repayAmount, loanIndex)).rejects.toRevert('revert Insufficient balance');
  //  });

  //  it("returns success from repayBorrowFresh and repays the right amount", async () => {
  //    await fastForward(cToken);
  //    const beforeAccountBorrowSnap = await borrowSnapshot(cToken, borrower, loanIndex);
  //    expect(await repayBorrow(cToken, borrower, repayAmount, loanIndex)).toSucceed();
  //    const afterAccountBorrowSnap = await borrowSnapshot(cToken, borrower, loanIndex);
  //    expect(afterAccountBorrowSnap.principal).toEqualNumber(beforeAccountBorrowSnap.principal.minus(repayAmount));
  //  });

  //  it("repays the full amount owed if payer has enough", async () => {
  //    await fastForward(cToken);
  //    expect(await repayBorrow(cToken, borrower, UInt256Max(), loanIndex)).toSucceed();
  //    const afterAccountBorrowSnap = await borrowSnapshot(cToken, borrower, loanIndex);
  //    expect(afterAccountBorrowSnap.principal).toEqualNumber(0);
  //  });

  //  it("fails gracefully if payer does not have enough", async () => {
  //    await setBalance(cToken.underlying, borrower, 3);
  //    await fastForward(cToken);
  //    await expect(repayBorrow(cToken, borrower, UInt256Max(), deadline)).rejects.toRevert('revert Insufficient balance');
  //  });
  //});

  //describe('repayBorrowBehalf', () => {
  //  let payer;
  //  const loanIndex = 0;
  //  const deadline = UInt256Max();

  //  beforeEach(async () => {
  //    payer = benefactor;
  //    await preRepay(cToken, payer, borrower, repayAmount, loanIndex, deadline);
  //  });

  //  it("emits a repay borrow failure if interest accrual fails", async () => {
  //    await send(cToken.interestRateModel, 'setFailBorrowRate', [true]);
  //    await expect(repayBorrowBehalf(cToken, payer, borrower, repayAmount, loanIndex)).rejects.toRevert("revert INTEREST_RATE_MODEL_ERROR");
  //  });

  //  it("returns error from repayBorrowFresh without emitting any extra logs", async () => {
  //    await setBalance(cToken.underlying, payer, 1);
  //    await expect(repayBorrowBehalf(cToken, payer, borrower, repayAmount, loanIndex)).rejects.toRevert('revert Insufficient balance');
  //  });

  //  it("returns success from repayBorrowFresh and repays the right amount", async () => {
  //    await fastForward(cToken);
  //    const beforeAccountBorrowSnap = await borrowSnapshot(cToken, borrower, loanIndex);
  //    expect(await repayBorrowBehalf(cToken, payer, borrower, repayAmount, loanIndex)).toSucceed();
  //    const afterAccountBorrowSnap = await borrowSnapshot(cToken, borrower);
  //    expect(afterAccountBorrowSnap.principal).toEqualNumber(beforeAccountBorrowSnap.principal.minus(repayAmount));
  //  });
  //});
});
