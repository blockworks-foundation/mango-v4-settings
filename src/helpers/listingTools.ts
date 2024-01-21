import BN from "bn.js";

enum ORACLE_TYPE {
  PYTH,
  SWITCHBOARD,
  ALL,
}

export type LISTING_PRESETS_KEY =
  | "asset_250p"
  | "asset_100"
  | "asset_20"
  | "asset_10p"
  | "liab_5p"
  | "liab_5"
  | "liab_1"
  | "UNTRUSTED";

const asset_250p = {
  maxStalenessSlots: 250 as number | null,
  oracleConfFilter: 0.1,
  adjustmentFactor: 0.004,
  util0: 0.5,
  rate0: 0.018,
  util1: 0.75,
  rate1: 0.05,
  maxRate: 0.5,
  loanFeeRate: 0.005,
  loanOriginationFeeRate: 0.0005,
  maintAssetWeight: 0.9,
  initAssetWeight: 0.8,
  maintLiabWeight: 1.1,
  initLiabWeight: 1.2,
  liquidationFee: 0.05,
  minVaultToDepositsRatio: 0.2,
  netBorrowLimitWindowSizeTs: 24 * 60 * 60,
  netBorrowLimitPerWindowQuote: toNative(250000, 6).toNumber(),
  groupInsuranceFund: true,
  borrowWeightScaleStartQuote: toNative(500000, 6).toNumber(),
  depositWeightScaleStartQuote: toNative(500000, 6).toNumber(),
  preset_key: "asset_250p" as LISTING_PRESETS_KEY,
  preset_name: "AAA",
  preset_target_amount: 250000,
  stablePriceDelayIntervalSeconds: 60 * 60,
  stablePriceGrowthLimit: 0.0003,
  stablePriceDelayGrowthLimit: 0.06,
  tokenConditionalSwapTakerFeeRate: 0,
  tokenConditionalSwapMakerFeeRate: 0,
  flashLoanSwapFeeRate: 0,
  reduceOnly: 0,
  interestCurveScaling: 4,
  interestTargetUtilization: 0.5,
  depositLimit: 0,
  oraclePriceBand: 1,
  depositLimitNotional: 2000000,
  oracle: ORACLE_TYPE.PYTH,
};

export type LISTING_PRESET = typeof asset_250p;
export type ILISTING_PRESETS = typeof LISTING_PRESETS;

export const LISTING_PRESETS: {
  [key in LISTING_PRESETS_KEY]: LISTING_PRESET;
} = {
  //Price impact on $250,000 swap lower then 1%
  asset_250p: {
    ...asset_250p,
  },
  //Price impact on $100,000 swap lower then 1%
  asset_100: {
    ...asset_250p,
    netBorrowLimitPerWindowQuote: toNative(125000, 6).toNumber(),
    borrowWeightScaleStartQuote: toNative(250000, 6).toNumber(),
    depositWeightScaleStartQuote: toNative(250000, 6).toNumber(),
    preset_name: "AA",
    preset_key: "asset_100",
    preset_target_amount: 100000,
    loanFeeRate: 0.01,
    loanOriginationFeeRate: 0.001,
    oracle: ORACLE_TYPE.ALL,
    depositLimitNotional: 1000000,
  },
  //Price impact on $20,000 swap lower then 1%
  asset_20: {
    ...asset_250p,
    maintAssetWeight: 0.75,
    initAssetWeight: 0.5,
    maintLiabWeight: 1.2,
    initLiabWeight: 1.4,
    liquidationFee: 0.1,
    loanFeeRate: 0.02,
    netBorrowLimitPerWindowQuote: toNative(50000, 6).toNumber(),
    borrowWeightScaleStartQuote: toNative(50000, 6).toNumber(),
    depositWeightScaleStartQuote: toNative(50000, 6).toNumber(),
    preset_name: "A",
    preset_key: "asset_20",
    preset_target_amount: 20000,
    loanOriginationFeeRate: 0.002,
    oracle: ORACLE_TYPE.ALL,
    depositLimitNotional: 200000,
  },
  asset_10p: {
    ...asset_250p,
    maintAssetWeight: 0.5,
    initAssetWeight: 0.25,
    maintLiabWeight: 1.25,
    initLiabWeight: 1.5,
    liquidationFee: 0.1,
    loanFeeRate: 0.03,
    netBorrowLimitPerWindowQuote: toNative(50000, 6).toNumber(),
    borrowWeightScaleStartQuote: toNative(20000, 6).toNumber(),
    depositWeightScaleStartQuote: toNative(20000, 6).toNumber(),
    groupInsuranceFund: false,
    preset_name: "A-",
    preset_key: "asset_10p",
    preset_target_amount: 10000,
    loanOriginationFeeRate: 0.003,
    oracle: ORACLE_TYPE.PYTH,
    depositLimitNotional: 80000,
  },
  liab_5p: {
    ...asset_250p,
    loanOriginationFeeRate: 0.004,
    maintAssetWeight: 0,
    initAssetWeight: 0,
    loanFeeRate: 0.04,
    maintLiabWeight: 1.25,
    initLiabWeight: 1.5,
    liquidationFee: 0.1,
    netBorrowLimitPerWindowQuote: toNative(50000, 6).toNumber(),
    borrowWeightScaleStartQuote: toNative(20000, 6).toNumber(),
    depositWeightScaleStartQuote: toNative(20000, 6).toNumber(),
    groupInsuranceFund: false,
    preset_name: "BBB",
    preset_key: "liab_5p",
    preset_target_amount: 5000,
    oracle: ORACLE_TYPE.PYTH,
    depositLimitNotional: 200000,
  },
  //Price impact on $1,000 swap lower then 1%
  liab_5: {
    ...asset_250p,
    loanFeeRate: 0.05,
    loanOriginationFeeRate: 0.005,
    maintAssetWeight: 0,
    initAssetWeight: 0,
    maintLiabWeight: 1.3,
    initLiabWeight: 1.6,
    liquidationFee: 0.1,
    netBorrowLimitPerWindowQuote: toNative(50000, 6).toNumber(),
    borrowWeightScaleStartQuote: toNative(20000, 6).toNumber(),
    depositWeightScaleStartQuote: toNative(20000, 6).toNumber(),
    groupInsuranceFund: false,
    preset_name: "BB",
    preset_key: "liab_5",
    preset_target_amount: 5000,
    maxStalenessSlots: 1000,
    oracleConfFilter: 1000,
    oracle: ORACLE_TYPE.ALL,
    depositLimitNotional: 200000,
  },
  liab_1: {
    ...asset_250p,
    loanFeeRate: 0.075,
    loanOriginationFeeRate: 0.0075,
    maintAssetWeight: 0,
    initAssetWeight: 0,
    maintLiabWeight: 1.4,
    initLiabWeight: 1.8,
    liquidationFee: 0.1,
    netBorrowLimitPerWindowQuote: toNative(15000, 6).toNumber(),
    borrowWeightScaleStartQuote: toNative(5000, 6).toNumber(),
    depositWeightScaleStartQuote: toNative(5000, 6).toNumber(),
    groupInsuranceFund: false,
    preset_name: "B",
    preset_key: "liab_1",
    preset_target_amount: 1000,
    maxStalenessSlots: 1000,
    oracleConfFilter: 1000,
    oracle: ORACLE_TYPE.ALL,
    depositLimitNotional: 200000,
  },
  //should run untrusted, instruction preset should be named C
  UNTRUSTED: {
    ...asset_250p,
    loanFeeRate: 0.005,
    loanOriginationFeeRate: 0.002,
    maintAssetWeight: 0,
    initAssetWeight: 0,
    maintLiabWeight: 1.4,
    initLiabWeight: 1.8,
    liquidationFee: 0.2,
    netBorrowLimitPerWindowQuote: toNative(5000, 6).toNumber(),
    borrowWeightScaleStartQuote: toNative(5000, 6).toNumber(),
    depositWeightScaleStartQuote: toNative(5000, 6).toNumber(),
    groupInsuranceFund: false,
    preset_name: "C",
    preset_key: "UNTRUSTED",
    preset_target_amount: 0,
    maxStalenessSlots: -1,
    oracleConfFilter: 1000,
    depositLimitNotional: 0,
    oracle: ORACLE_TYPE.ALL,
    reduceOnly: 2,
    oraclePriceBand: 19,
  },
};

export type MarketTradingParams = {
  baseLots: number;
  quoteLots: number;
  minOrderValue: number;
  baseLotExponent: number;
  quoteLotExponent: number;
  minOrderSize: number;
  priceIncrement: number;
  priceIncrementRelative: number;
};

// definitions:
// baseLots = 10 ^ baseLotExponent
// quoteLots = 10 ^ quoteLotExponent
// minOrderSize = 10^(baseLotExponent - baseDecimals)
// minOrderValue = basePrice * minOrderSize
// priceIncrement =  10^(quoteLotExponent + baseDecimals - baseLotExponent - quoteDecimals)
// priceIncrementRelative =  priceIncrement * quotePrice / basePrice

// derive: baseLotExponent <= min[ basePrice * minOrderSize > 0.05]
// baseLotExponent = 10
// While (baseLotExponent < 10):
//     minOrderSize =  10^(baseLotExponent - baseDecimals)
//     minOrderValue =  basePrice * minOrderSize
//     if minOrderValue > 0.05:
//         break;

// Derive: quoteLotExponent <= min[ priceIncrement * quotePrice / basePrice > 0.000025 ]
// quoteLotExponent = 0
// While (quoteLotExponent < 10):
//     priceIncrement =  10^(quoteLotExponent + baseDecimals - baseLotExponent - quoteDecimals)
//         priceIncrementRelative =  priceIncrement * quotePrice / basePrice
//     if priceIncrementRelative > 0.000025:
//         break;
export const calculateMarketTradingParams = (
  basePrice: number,
  quotePrice: number,
  baseDecimals: number,
  quoteDecimals: number,
): MarketTradingParams => {
  const MAX_MIN_ORDER_VALUE = 0.05;
  const MIN_PRICE_INCREMENT_RELATIVE = 0.000025;
  const EXPONENT_THRESHOLD = 10;

  let minOrderSize = 0;
  let priceIncrement = 0;
  let baseLotExponent = 0;
  let quoteLotExponent = 0;
  let minOrderValue = 0;
  let priceIncrementRelative = 0;

  // Calculate minimum order size
  do {
    minOrderSize = Math.pow(10, baseLotExponent - baseDecimals);
    minOrderValue = basePrice * minOrderSize;

    if (minOrderValue > MAX_MIN_ORDER_VALUE) {
      break;
    }

    baseLotExponent++;
  } while (baseLotExponent < EXPONENT_THRESHOLD);

  // Calculate price increment
  do {
    priceIncrement = Math.pow(
      10,
      quoteLotExponent + baseDecimals - baseLotExponent - quoteDecimals,
    );
    priceIncrementRelative = (priceIncrement * quotePrice) / basePrice;
    if (priceIncrementRelative > MIN_PRICE_INCREMENT_RELATIVE) {
      break;
    }

    quoteLotExponent++;
  } while (quoteLotExponent < EXPONENT_THRESHOLD);

  //exception override values in that case example eth/btc market
  if (
    quoteLotExponent === 0 &&
    priceIncrementRelative > 0.001 &&
    minOrderSize < 1
  ) {
    baseLotExponent = baseLotExponent + 1;
    minOrderSize = Math.pow(10, baseLotExponent - baseDecimals);
    minOrderValue = basePrice * minOrderSize;
    priceIncrement = Math.pow(
      10,
      quoteLotExponent + baseDecimals - baseLotExponent - quoteDecimals,
    );
    priceIncrementRelative = (priceIncrement * quotePrice) / basePrice;
  }

  return {
    baseLots: Math.pow(10, baseLotExponent),
    quoteLots: Math.pow(10, quoteLotExponent),
    minOrderValue: minOrderValue,
    baseLotExponent: baseLotExponent,
    quoteLotExponent: quoteLotExponent,
    minOrderSize: minOrderSize,
    priceIncrement: priceIncrement,
    priceIncrementRelative: priceIncrementRelative,
  };
};

function toNative(uiAmount: number, decimals: number): BN {
  return new BN((uiAmount * Math.pow(10, decimals)).toFixed(0));
}

export const coinTiersToNames: {
  [key in LISTING_PRESETS_KEY]: string;
} = {
  asset_250p: "AAA",
  asset_100: "AA",
  asset_20: "A",
  asset_10p: "A-",
  liab_5p: "BBB",
  liab_5: "BB",
  liab_1: "B",
  UNTRUSTED: "C",
};

export const getPresetWithAdjustedNetBorrows = (
  tier: LISTING_PRESET,
  uiDeposits: number,
  uiPrice: number,
): LISTING_PRESET => {
  const newNetBorrowLimitPerWindowQuote = Math.max(
    10_000,
    Math.min(uiDeposits * uiPrice, 300_000) / 3 +
      Math.max(0, uiDeposits * uiPrice - 300_000) / 5,
  );

  return {
    ...tier,
    netBorrowLimitPerWindowQuote: toNative(
      newNetBorrowLimitPerWindowQuote,
      6,
    ).toNumber(),
  };
};

export const getMidPriceImpacts = (priceImpacts: PriceImpact[]) => {
  return priceImpacts.reduce((acc: MidPriceImpact[], val: PriceImpact) => {
    if (val.side === "ask") {
      const bidSide = priceImpacts.find(
        (x) =>
          x.symbol === val.symbol &&
          x.target_amount === val.target_amount &&
          x.side === "bid",
      );
      acc.push({
        target_amount: val.target_amount,
        avg_price_impact_percent: bidSide
          ? (bidSide.avg_price_impact_percent + val.avg_price_impact_percent) /
            2
          : val.avg_price_impact_percent,
        symbol: val.symbol,
      });
    }
    return acc;
  }, []);
};

export const getKeyForPriceImpact = (
  presets: ILISTING_PRESETS,
  priceImpactTargetAmount: number,
): LISTING_PRESETS_KEY => {
  return (Object.values(presets)
    .sort((a, b) => b.preset_target_amount - a.preset_target_amount)
    .find((x) => x.preset_target_amount <= priceImpactTargetAmount)
    ?.preset_key || "UNTRUSTED") as LISTING_PRESETS_KEY;
};

export const getProposedKey = (
  priceImpactTargetAmount: number | undefined,
  isPythOracle: boolean,
): LISTING_PRESETS_KEY => {
  const filtredPresets = isPythOracle
    ? getPythPresets(LISTING_PRESETS)
    : getSwitchBoardPresets(LISTING_PRESETS);
  const liquidityTier =
    priceImpactTargetAmount !== undefined
      ? getKeyForPriceImpact(filtredPresets, priceImpactTargetAmount)
      : "UNTRUSTED";

  return liquidityTier;
};

export const getProposedPreset = (
  priceImpactTargetAmount: number | undefined,
  isPythOracle: boolean,
): LISTING_PRESET => {
  return LISTING_PRESETS[getProposedKey(priceImpactTargetAmount, isPythOracle)];
};

export const getPresetWithAdjustedDepositLimit = (
  tier: LISTING_PRESET,
  tokenPrice: number,
  tokenDecimals: number,
): LISTING_PRESET => {
  return {
    ...tier,
    depositLimit:
      tokenPrice && tier.depositLimitNotional
        ? Math.ceil(tier.depositLimitNotional / tokenPrice) *
          Math.pow(10, tokenDecimals)
        : 0,
  };
};

export function getSwitchBoardPresets(
  presets: ILISTING_PRESETS,
): ILISTING_PRESETS {
  const filteredPresets = {} as ILISTING_PRESETS;

  for (const [key, preset] of Object.entries(presets)) {
    if (preset.oracle !== ORACLE_TYPE.PYTH) {
      filteredPresets[key as keyof ILISTING_PRESETS] = preset;
    }
  }

  return filteredPresets;
}

export function getPythPresets(presets: ILISTING_PRESETS): ILISTING_PRESETS {
  const filteredPresets = {} as ILISTING_PRESETS;

  for (const [key, preset] of Object.entries(presets)) {
    if (preset.preset_key !== "liab_5") {
      filteredPresets[key as keyof ILISTING_PRESETS] = preset;
    }
  }

  return filteredPresets;
}

export type PriceImpact = {
  symbol: string;
  side: "bid" | "ask";
  target_amount: number;
  avg_price_impact_percent: number;
  min_price_impact_percent: number;
  max_price_impact_percent: number;
};

export type MidPriceImpact = Omit<
  PriceImpact,
  "side" | "min_price_impact_percent" | "max_price_impact_percent"
>;
