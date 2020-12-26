import {Event} from '../Event';
import {addAction, World} from '../World';
import {MaximillionWithTermLoans} from '../Contract/MaximillionWithTermLoans';
import {Invokation} from '../Invokation';
import {Arg, Fetcher, getFetcherValue} from '../Command';
import {storeAndSaveContract} from '../Networks';
import {getContract} from '../Contract';
import {getAddressV} from '../CoreValue';
import {AddressV} from '../Value';

const MaximillionWithTermLoansContract = getContract("MaximillionWithTermLoans");

export interface MaximillionWithTermLoansData {
  invokation: Invokation<MaximillionWithTermLoans>,
  description: string,
  cEtherAddress: string,
  address?: string
}

export async function buildMaximillionWithTermLoans(world: World, from: string, event: Event): Promise<{world: World, maximillion: MaximillionWithTermLoans, maximillionData: MaximillionWithTermLoansData}> {
  const fetchers = [
    new Fetcher<{cEther: AddressV}, MaximillionWithTermLoansData>(`
        #### MaximillionWithTermLoans

        * "" - Maximum Eth Repays Contract
          * E.g. "MaximillionWithTermLoans Deploy"
      `,
      "MaximillionWithTermLoans",
      [
        new Arg("cEther", getAddressV)
      ],
      async (world, {cEther}) => {
        return {
          invokation: await MaximillionWithTermLoansContract.deploy<MaximillionWithTermLoans>(world, from, [cEther.val]),
          description: "MaximillionWithTermLoans",
          cEtherAddress: cEther.val
        };
      },
      {catchall: true}
    )
  ];

  let maximillionData = await getFetcherValue<any, MaximillionWithTermLoansData>("DeployMaximillionWithTermLoans", fetchers, world, event);
  let invokation = maximillionData.invokation;
  delete maximillionData.invokation;

  if (invokation.error) {
    throw invokation.error;
  }
  const maximillion = invokation.value!;
  maximillionData.address = maximillion._address;

  world = await storeAndSaveContract(
    world,
    maximillion,
    'MaximillionWithTermLoans',
    invokation,
    [
      { index: ['MaximillionWithTermLoans'], data: maximillionData }
    ]
  );

  return {world, maximillion, maximillionData};
}
