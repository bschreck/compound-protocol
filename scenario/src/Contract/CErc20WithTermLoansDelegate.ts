import { Contract } from '../Contract';
import { Sendable } from '../Invokation';
import { CTokenWithTermLoansMethods, CTokenWithTermLoansScenarioMethods } from './CTokenWithTermLoans';

interface CErc20WithTermLoansDelegateMethods extends CTokenWithTermLoansMethods {
  _becomeImplementation(data: string): Sendable<void>;
  _resignImplementation(): Sendable<void>;
}

interface CErc20WithTermLoansDelegateScenarioMethods extends CTokenWithTermLoansScenarioMethods {
  _becomeImplementation(data: string): Sendable<void>;
  _resignImplementation(): Sendable<void>;
}

export interface CErc20WithTermLoansDelegate extends Contract {
  methods: CErc20WithTermLoansDelegateMethods;
  name: string;
}

export interface CErc20WithTermLoansDelegateScenario extends Contract {
  methods: CErc20WithTermLoansDelegateScenarioMethods;
  name: string;
}
