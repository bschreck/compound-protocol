import {Contract} from '../Contract';
import {Callable, Sendable} from '../Invokation';

interface MaximillionWithTermLoansMethods {
  cEther(): Callable<string>
  repayBehalf(string, number): Sendable<void>
}

export interface MaximillionWithTermLoans extends Contract {
  methods: MaximillionWithTermLoansMethods
}
