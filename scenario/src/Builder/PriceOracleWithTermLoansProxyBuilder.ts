import {Event} from '../Event';
import {addAction, World} from '../World';
import {PriceOracleWithTermLoansProxy} from '../Contract/PriceOracleWithTermLoansProxy';
import {Invokation} from '../Invokation';
import {Arg, Fetcher, getFetcherValue} from '../Command';
import {storeAndSaveContract} from '../Networks';
import {getContract} from '../Contract';
import {getAddressV} from '../CoreValue';
import {AddressV} from '../Value';

const PriceOracleWithTermLoansProxyContract = getContract("PriceOracleWithTermLoansProxy");

export interface PriceOracleWithTermLoansProxyData {
  invokation?: Invokation<PriceOracleWithTermLoansProxy>,
  contract?: PriceOracleWithTermLoansProxy,
  description: string,
  address?: string,
  cETH: string,
  cUSDC: string,
  cDAI: string
}

export async function buildPriceOracleWithTermLoansProxy(world: World, from: string, event: Event): Promise<{world: World, priceOracleProxy: PriceOracleWithTermLoansProxy, invokation: Invokation<PriceOracleWithTermLoansProxy>}> {
  const fetchers = [
    new Fetcher<{guardian: AddressV, priceOracle: AddressV, cETH: AddressV, cUSDC: AddressV, cSAI: AddressV, cDAI: AddressV, cUSDT: AddressV}, PriceOracleWithTermLoansProxyData>(`
        #### Price Oracle Proxy

        * "Deploy <Guardian:Address> <PriceOracleWithTermLoans:Address> <cETH:Address> <cUSDC:Address> <cSAI:Address> <cDAI:Address> <cUSDT:Address>" - The Price Oracle which proxies to a backing oracle
        * E.g. "PriceOracleWithTermLoansProxy Deploy Admin (PriceOracleWithTermLoans Address) cETH cUSDC cSAI cDAI cUSDT"
      `,
      "PriceOracleWithTermLoansProxy",
      [
        new Arg("guardian", getAddressV),
        new Arg("priceOracle", getAddressV),
        new Arg("cETH", getAddressV),
        new Arg("cUSDC", getAddressV),
        new Arg("cSAI", getAddressV),
        new Arg("cDAI", getAddressV),
        new Arg("cUSDT", getAddressV)
      ],
      async (world, {guardian, priceOracle, cETH, cUSDC, cSAI, cDAI, cUSDT}) => {
        return {
          invokation: await PriceOracleWithTermLoansProxyContract.deploy<PriceOracleWithTermLoansProxy>(world, from, [guardian.val, priceOracle.val, cETH.val, cUSDC.val, cSAI.val, cDAI.val, cUSDT.val]),
          description: "Price Oracle Proxy",
          cETH: cETH.val,
          cUSDC: cUSDC.val,
          cSAI: cSAI.val,
          cDAI: cDAI.val,
          cUSDT: cUSDT.val
        };
      },
      {catchall: true}
    )
  ];

  let priceOracleProxyData = await getFetcherValue<any, PriceOracleWithTermLoansProxyData>("DeployPriceOracleWithTermLoansProxy", fetchers, world, event);
  let invokation = priceOracleProxyData.invokation!;
  delete priceOracleProxyData.invokation;

  if (invokation.error) {
    throw invokation.error;
  }
  const priceOracleProxy = invokation.value!;
  priceOracleProxyData.address = priceOracleProxy._address;

  world = await storeAndSaveContract(
    world,
    priceOracleProxy,
    'PriceOracleWithTermLoansProxy',
    invokation,
    [
      { index: ['PriceOracleWithTermLoansProxy'], data: priceOracleProxyData }
    ]
  );

  return {world, priceOracleProxy, invokation};
}
