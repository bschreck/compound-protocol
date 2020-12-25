import {Contract} from '../Contract';
import {Callable, Sendable} from '../Invokation';
import {encodedNumber} from '../Encoding';

interface PriceOracleWithTermLoansProxyMethods {
  getUnderlyingPrice(asset: string): Callable<number>
  v1PriceOracleWithTermLoans(): Callable<string>;
  setSaiPrice(amount: encodedNumber): Sendable<number>
}

export interface PriceOracleWithTermLoansProxy extends Contract {
  methods: PriceOracleWithTermLoansProxyMethods
}
