import { Event } from '../Event';
import { World } from '../World';
import { CErc20WithTermLoansDelegate, CErc20WithTermLoansDelegateScenario } from '../Contract/CErc20WithTermLoansDelegate';
import { CTokenWithTermLoans } from '../Contract/CTokenWithTermLoans';
import { Invokation } from '../Invokation';
import { getStringV } from '../CoreValue';
import { AddressV, NumberV, StringV } from '../Value';
import { Arg, Fetcher, getFetcherValue } from '../Command';
import { storeAndSaveContract } from '../Networks';
import { getContract, getTestContract } from '../Contract';

const CDaiWithTermLoansDelegateContract = getContract('CDaiWithTermLoansDelegate');
const CDaiWithTermLoansDelegateScenarioContract = getTestContract('CDaiWithTermLoansDelegateScenario');
const CErc20WithTermLoansDelegateContract = getContract('CErc20WithTermLoansDelegate');
const CErc20WithTermLoansDelegateScenarioContract = getTestContract('CErc20WithTermLoansDelegateScenario');


export interface CTokenWithTermLoansDelegateData {
  invokation: Invokation<CErc20WithTermLoansDelegate>;
  name: string;
  contract: string;
  description?: string;
}

export async function buildCTokenWithTermLoansDelegate(
  world: World,
  from: string,
  params: Event
): Promise<{ world: World; cTokenDelegate: CErc20WithTermLoansDelegate; delegateData: CTokenWithTermLoansDelegateData }> {
  const fetchers = [
    new Fetcher<{ name: StringV; }, CTokenWithTermLoansDelegateData>(
      `
        #### CDaiWithTermLoansDelegate

        * "CDaiWithTermLoansDelegate name:<String>"
          * E.g. "CTokenWithTermLoansDelegate Deploy CDaiWithTermLoansDelegate cDAIDelegate"
      `,
      'CDaiWithTermLoansDelegate',
      [
        new Arg('name', getStringV)
      ],
      async (
        world,
        { name }
      ) => {
        return {
          invokation: await CDaiWithTermLoansDelegateContract.deploy<CErc20WithTermLoansDelegate>(world, from, []),
          name: name.val,
          contract: 'CDaiWithTermLoansDelegate',
          description: 'Standard CDaiWithTermLoans Delegate'
        };
      }
    ),

    new Fetcher<{ name: StringV; }, CTokenWithTermLoansDelegateData>(
      `
        #### CDaiWithTermLoansDelegateScenario

        * "CDaiWithTermLoansDelegateScenario name:<String>" - A CDaiWithTermLoansDelegate Scenario for local testing
          * E.g. "CTokenWithTermLoansDelegate Deploy CDaiWithTermLoansDelegateScenario cDAIDelegate"
      `,
      'CDaiWithTermLoansDelegateScenario',
      [
        new Arg('name', getStringV)
      ],
      async (
        world,
        { name }
      ) => {
        return {
          invokation: await CDaiWithTermLoansDelegateScenarioContract.deploy<CErc20WithTermLoansDelegateScenario>(world, from, []),
          name: name.val,
          contract: 'CDaiWithTermLoansDelegateScenario',
          description: 'Scenario CDaiWithTermLoans Delegate'
        };
      }
    ),

    new Fetcher<{ name: StringV; }, CTokenWithTermLoansDelegateData>(
      `
        #### CErc20WithTermLoansDelegate

        * "CErc20WithTermLoansDelegate name:<String>"
          * E.g. "CTokenWithTermLoansDelegate Deploy CErc20WithTermLoansDelegate cDAIDelegate"
      `,
      'CErc20WithTermLoansDelegate',
      [
        new Arg('name', getStringV)
      ],
      async (
        world,
        { name }
      ) => {
        return {
          invokation: await CErc20WithTermLoansDelegateContract.deploy<CErc20WithTermLoansDelegate>(world, from, []),
          name: name.val,
          contract: 'CErc20WithTermLoansDelegate',
          description: 'Standard CErc20WithTermLoans Delegate'
        };
      }
    ),

    new Fetcher<{ name: StringV; }, CTokenWithTermLoansDelegateData>(
      `
        #### CErc20WithTermLoansDelegateScenario

        * "CErc20WithTermLoansDelegateScenario name:<String>" - A CErc20WithTermLoansDelegate Scenario for local testing
          * E.g. "CTokenWithTermLoansDelegate Deploy CErc20WithTermLoansDelegateScenario cDAIDelegate"
      `,
      'CErc20WithTermLoansDelegateScenario',
      [
        new Arg('name', getStringV),
      ],
      async (
        world,
        { name }
      ) => {
        return {
          invokation: await CErc20WithTermLoansDelegateScenarioContract.deploy<CErc20WithTermLoansDelegateScenario>(world, from, []),
          name: name.val,
          contract: 'CErc20WithTermLoansDelegateScenario',
          description: 'Scenario CErc20WithTermLoans Delegate'
        };
      }
    )
  ];

  let delegateData = await getFetcherValue<any, CTokenWithTermLoansDelegateData>("DeployCTokenWithTermLoans", fetchers, world, params);
  let invokation = delegateData.invokation;
  delete delegateData.invokation;

  if (invokation.error) {
    throw invokation.error;
  }

  const cTokenDelegate = invokation.value!;

  world = await storeAndSaveContract(
    world,
    cTokenDelegate,
    delegateData.name,
    invokation,
    [
      {
        index: ['CTokenWithTermLoansDelegate', delegateData.name],
        data: {
          address: cTokenDelegate._address,
          contract: delegateData.contract,
          description: delegateData.description
        }
      }
    ]
  );

  return { world, cTokenDelegate, delegateData };
}
