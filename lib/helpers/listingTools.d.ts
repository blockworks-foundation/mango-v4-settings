declare enum ORACLE_TYPE {
    PYTH = 0,
    SWITCHBOARD = 1,
    ALL = 2
}
export type LISTING_PRESETS_KEY = "asset_250p" | "asset_100" | "asset_20" | "asset_10p" | "liab_5p" | "liab_5" | "liab_1" | "UNTRUSTED";
declare const asset_250p: {
    maxStalenessSlots: number | null;
    oracleConfFilter: number;
    adjustmentFactor: number;
    util0: number;
    rate0: number;
    util1: number;
    rate1: number;
    maxRate: number;
    loanFeeRate: number;
    loanOriginationFeeRate: number;
    maintAssetWeight: number;
    initAssetWeight: number;
    maintLiabWeight: number;
    initLiabWeight: number;
    liquidationFee: number;
    minVaultToDepositsRatio: number;
    netBorrowLimitWindowSizeTs: number;
    netBorrowLimitPerWindowQuote: number;
    groupInsuranceFund: boolean;
    borrowWeightScaleStartQuote: number;
    depositWeightScaleStartQuote: number;
    preset_key: LISTING_PRESETS_KEY;
    preset_name: string;
    preset_target_amount: number;
    stablePriceDelayIntervalSeconds: number;
    stablePriceGrowthLimit: number;
    stablePriceDelayGrowthLimit: number;
    tokenConditionalSwapTakerFeeRate: number;
    tokenConditionalSwapMakerFeeRate: number;
    flashLoanSwapFeeRate: number;
    reduceOnly: number;
    interestCurveScaling: number;
    interestTargetUtilization: number;
    depositLimit: number;
    oraclePriceBand: number;
    depositLimitNotional: number;
    oracle: ORACLE_TYPE;
    zeroUtilRate: number;
    platformLiquidationFee: number;
    collateralFeePerDay: number;
    disableAssetLiquidation: boolean;
};
export type LISTING_PRESET = typeof asset_250p;
export type ILISTING_PRESETS = typeof LISTING_PRESETS;
export declare const LISTING_PRESETS: {
    [key in LISTING_PRESETS_KEY]: LISTING_PRESET;
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
export declare const calculateMarketTradingParams: (basePrice: number, quotePrice: number, baseDecimals: number, quoteDecimals: number) => MarketTradingParams;
export declare const coinTiersToNames: {
    [key in LISTING_PRESETS_KEY]: string;
};
export declare const getPresetWithAdjustedNetBorrows: (tier: LISTING_PRESET, uiDeposits: number, uiPrice: number, minNotionalValue?: number) => LISTING_PRESET;
export declare const getMidPriceImpacts: (priceImpacts: PriceImpact[]) => MidPriceImpact[];
export declare const getKeyForPriceImpact: (presets: ILISTING_PRESETS, priceImpactTargetAmount: number) => LISTING_PRESETS_KEY;
export declare const getProposedKey: (priceImpactTargetAmount: number | undefined, isPythOracle: boolean) => LISTING_PRESETS_KEY;
export declare const getProposedPreset: (priceImpactTargetAmount: number | undefined, isPythOracle: boolean) => LISTING_PRESET;
export declare const getPresetWithAdjustedDepositLimit: (tier: LISTING_PRESET, tokenPrice: number, tokenDecimals: number) => LISTING_PRESET;
export declare function getSwitchBoardPresets(presets: ILISTING_PRESETS): ILISTING_PRESETS;
export declare function getPythPresets(presets: ILISTING_PRESETS): ILISTING_PRESETS;
export type PriceImpact = {
    symbol: string;
    side: "bid" | "ask";
    target_amount: number;
    avg_price_impact_percent: number;
    min_price_impact_percent: number;
    max_price_impact_percent: number;
};
export type MidPriceImpact = Omit<PriceImpact, "side" | "min_price_impact_percent" | "max_price_impact_percent">;
export {};
