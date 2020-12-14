import {Contract} from '../Contract';
import {Callable, Sendable} from '../Invokation';

interface MaximillionMethods {
  cEther(): Callable<string>
  repayBehalf(string, number): Sendable<void>
}

export interface Maximillion extends Contract {
  methods: MaximillionMethods
}
