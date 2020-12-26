import { Contract } from '../Contract';
import { Callable, Sendable } from '../Invokation';
import { CTokenWithTermLoansMethods } from './CTokenWithTermLoans';
import { encodedNumber } from '../Encoding';

interface CErc20WithTermLoansDelegatorMethods extends CTokenWithTermLoansMethods {
  implementation(): Callable<string>;
  _setImplementation(
    implementation_: string,
    allowResign: boolean,
    becomImplementationData: string
  ): Sendable<void>;
}

interface CErc20WithTermLoansDelegatorScenarioMethods extends CErc20WithTermLoansDelegatorMethods {
  setTotalBorrows(amount: encodedNumber): Sendable<void>;
  setTotalReserves(amount: encodedNumber): Sendable<void>;
}

export interface CErc20WithTermLoansDelegator extends Contract {
  methods: CErc20WithTermLoansDelegatorMethods;
  name: string;
}

export interface CErc20WithTermLoansDelegatorScenario extends Contract {
  methods: CErc20WithTermLoansDelegatorMethods;
  name: string;
}
