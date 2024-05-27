"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tierSettings = exports.tierToSwapValue = exports.getPresetWithAdjustedDepositLimit = exports.getProposedPreset = exports.getProposedKey = exports.getKeyForPriceImpact = exports.getMidPriceImpacts = exports.getPresetWithAdjustedNetBorrows = exports.coinTiersToNames = exports.calculateMarketTradingParams = exports.LISTING_PRESETS = void 0;
const bn_js_1 = __importDefault(require("bn.js"));
var ORACLE_TYPE;
(function (ORACLE_TYPE) {
    ORACLE_TYPE[ORACLE_TYPE["PYTH"] = 0] = "PYTH";
    ORACLE_TYPE[ORACLE_TYPE["SWITCHBOARD"] = 1] = "SWITCHBOARD";
    ORACLE_TYPE[ORACLE_TYPE["ALL"] = 2] = "ALL";
})(ORACLE_TYPE || (ORACLE_TYPE = {}));
const asset_5000 = {
    maxStalenessSlots: 250,
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
    liquidationFee: 0.01,
    minVaultToDepositsRatio: 0.2,
    netBorrowLimitWindowSizeTs: 24 * 60 * 60,
    netBorrowLimitPerWindowQuote: toNative(2000000, 6).toNumber(),
    groupInsuranceFund: true,
    borrowWeightScaleStartQuote: toNative(5000000, 6).toNumber(),
    depositWeightScaleStartQuote: toNative(5000000, 6).toNumber(),
    preset_key: "asset_5000",
    preset_name: "S",
    preset_target_amount: 5000000,
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
    depositLimitNotional: 20000000,
    oracle: ORACLE_TYPE.ALL,
    zeroUtilRate: 0,
    platformLiquidationFee: 0.04,
    collateralFeePerDay: 0,
    disableAssetLiquidation: false,
};
exports.LISTING_PRESETS = {
    //Price impact on $5000,000 swap lower then 1%
    asset_5000: Object.assign({}, asset_5000),
    //Price impact on $250,000 swap lower then 1%
    asset_250: Object.assign(Object.assign({}, asset_5000), { netBorrowLimitPerWindowQuote: toNative(250000, 6).toNumber(), borrowWeightScaleStartQuote: toNative(500000, 6).toNumber(), depositWeightScaleStartQuote: toNative(500000, 6).toNumber(), preset_key: "asset_250", preset_name: "AAA", preset_target_amount: 250000, depositLimitNotional: 2000000 }),
    //Price impact on $100,000 swap lower then 1%
    asset_100: Object.assign(Object.assign({}, asset_5000), { netBorrowLimitPerWindowQuote: toNative(125000, 6).toNumber(), borrowWeightScaleStartQuote: toNative(250000, 6).toNumber(), depositWeightScaleStartQuote: toNative(250000, 6).toNumber(), preset_name: "AA", preset_key: "asset_100", preset_target_amount: 100000, loanFeeRate: 0.01, loanOriginationFeeRate: 0.001, depositLimitNotional: 1000000 }),
    //Price impact on $20,000 swap lower then 1%
    asset_20: Object.assign(Object.assign({}, asset_5000), { maintAssetWeight: 0.8, initAssetWeight: 0.66, maintLiabWeight: 1.2, initLiabWeight: 1.4, liquidationFee: 0.02, loanFeeRate: 0.02, netBorrowLimitPerWindowQuote: toNative(50000, 6).toNumber(), borrowWeightScaleStartQuote: toNative(50000, 6).toNumber(), depositWeightScaleStartQuote: toNative(50000, 6).toNumber(), preset_name: "A", preset_key: "asset_20", preset_target_amount: 20000, loanOriginationFeeRate: 0.002, depositLimitNotional: 200000, platformLiquidationFee: 0.08 }),
    asset_10: Object.assign(Object.assign({}, asset_5000), { maintAssetWeight: 0.75, initAssetWeight: 0.5, maintLiabWeight: 1.25, initLiabWeight: 1.5, liquidationFee: 0.02, loanFeeRate: 0.03, netBorrowLimitPerWindowQuote: toNative(50000, 6).toNumber(), borrowWeightScaleStartQuote: toNative(20000, 6).toNumber(), depositWeightScaleStartQuote: toNative(20000, 6).toNumber(), groupInsuranceFund: false, preset_name: "A-", preset_key: "asset_10", preset_target_amount: 10000, loanOriginationFeeRate: 0.003, depositLimitNotional: 80000, platformLiquidationFee: 0.08 }),
    liab_5: Object.assign(Object.assign({}, asset_5000), { loanOriginationFeeRate: 0.004, maintAssetWeight: 0, initAssetWeight: 0, loanFeeRate: 0.04, maintLiabWeight: 1.25, initLiabWeight: 1.5, liquidationFee: 0.04, netBorrowLimitPerWindowQuote: toNative(50000, 6).toNumber(), borrowWeightScaleStartQuote: toNative(20000, 6).toNumber(), depositWeightScaleStartQuote: toNative(20000, 6).toNumber(), groupInsuranceFund: false, preset_name: "BBB", preset_key: "liab_5", preset_target_amount: 5000, depositLimitNotional: 200000, platformLiquidationFee: 0.06 }),
    //Price impact on $1,000 swap lower then 1%
    liab_3: Object.assign(Object.assign({}, asset_5000), { loanFeeRate: 0.05, loanOriginationFeeRate: 0.005, maintAssetWeight: 0, initAssetWeight: 0, maintLiabWeight: 1.3, initLiabWeight: 1.6, netBorrowLimitPerWindowQuote: toNative(50000, 6).toNumber(), borrowWeightScaleStartQuote: toNative(20000, 6).toNumber(), depositWeightScaleStartQuote: toNative(20000, 6).toNumber(), groupInsuranceFund: false, preset_name: "BB", preset_key: "liab_3", preset_target_amount: 3000, maxStalenessSlots: 1000, oracleConfFilter: 1000, depositLimitNotional: 200000, liquidationFee: 0.04, platformLiquidationFee: 0.06 }),
    liab_1: Object.assign(Object.assign({}, asset_5000), { loanFeeRate: 0.075, loanOriginationFeeRate: 0.0075, maintAssetWeight: 0, initAssetWeight: 0, maintLiabWeight: 1.4, initLiabWeight: 1.8, liquidationFee: 0.04, platformLiquidationFee: 0.06, netBorrowLimitPerWindowQuote: toNative(15000, 6).toNumber(), borrowWeightScaleStartQuote: toNative(5000, 6).toNumber(), depositWeightScaleStartQuote: toNative(5000, 6).toNumber(), groupInsuranceFund: false, preset_name: "B", preset_key: "liab_1", preset_target_amount: 1000, maxStalenessSlots: 1000, oracleConfFilter: 1000, depositLimitNotional: 200000 }),
    //should run untrusted, instruction preset should be named C
    UNTRUSTED: Object.assign(Object.assign({}, asset_5000), { loanFeeRate: 0.005, loanOriginationFeeRate: 0.0075, maintAssetWeight: 0, initAssetWeight: 0, maintLiabWeight: 1.4, initLiabWeight: 1.8, liquidationFee: 0.01, platformLiquidationFee: 0, netBorrowLimitPerWindowQuote: toNative(5000, 6).toNumber(), borrowWeightScaleStartQuote: toNative(5000, 6).toNumber(), depositWeightScaleStartQuote: toNative(5000, 6).toNumber(), groupInsuranceFund: false, preset_name: "C", preset_key: "UNTRUSTED", preset_target_amount: 0, maxStalenessSlots: -1, oracleConfFilter: 1000, depositLimitNotional: 0, reduceOnly: 2, oraclePriceBand: 19, disableAssetLiquidation: true }),
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
const calculateMarketTradingParams = (basePrice, quotePrice, baseDecimals, quoteDecimals) => {
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
        priceIncrement = Math.pow(10, quoteLotExponent + baseDecimals - baseLotExponent - quoteDecimals);
        priceIncrementRelative = (priceIncrement * quotePrice) / basePrice;
        if (priceIncrementRelative > MIN_PRICE_INCREMENT_RELATIVE) {
            break;
        }
        quoteLotExponent++;
    } while (quoteLotExponent < EXPONENT_THRESHOLD);
    //exception override values in that case example eth/btc market
    if (quoteLotExponent === 0 &&
        priceIncrementRelative > 0.001 &&
        minOrderSize < 1) {
        baseLotExponent = baseLotExponent + 1;
        minOrderSize = Math.pow(10, baseLotExponent - baseDecimals);
        minOrderValue = basePrice * minOrderSize;
        priceIncrement = Math.pow(10, quoteLotExponent + baseDecimals - baseLotExponent - quoteDecimals);
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
exports.calculateMarketTradingParams = calculateMarketTradingParams;
function toNative(uiAmount, decimals) {
    return new bn_js_1.default((uiAmount * Math.pow(10, decimals)).toFixed(0));
}
exports.coinTiersToNames = {
    asset_5000: "S",
    asset_250: "AAA",
    asset_100: "AA",
    asset_20: "A",
    asset_10: "A-",
    liab_5: "BBB",
    liab_3: "BB",
    liab_1: "B",
    UNTRUSTED: "C",
};
const getPresetWithAdjustedNetBorrows = (tier, uiDeposits, uiPrice, minNotionalValue = 10000) => {
    const newNetBorrowLimitPerWindowQuote = Math.max(minNotionalValue, Math.min(uiDeposits * uiPrice, 300000) / 3 +
        Math.max(0, uiDeposits * uiPrice - 300000) / 5);
    return Object.assign(Object.assign({}, tier), { netBorrowLimitPerWindowQuote: toNative(newNetBorrowLimitPerWindowQuote, 6).toNumber() });
};
exports.getPresetWithAdjustedNetBorrows = getPresetWithAdjustedNetBorrows;
const getMidPriceImpacts = (priceImpacts) => {
    return priceImpacts.reduce((acc, val) => {
        if (val.side === "ask") {
            const bidSide = priceImpacts.find((x) => x.symbol === val.symbol &&
                x.target_amount === val.target_amount &&
                x.side === "bid");
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
exports.getMidPriceImpacts = getMidPriceImpacts;
const getKeyForPriceImpact = (presets, priceImpactTargetAmount) => {
    var _a;
    return (((_a = Object.values(presets)
        .sort((a, b) => b.preset_target_amount - a.preset_target_amount)
        .find((x) => x.preset_target_amount <= priceImpactTargetAmount)) === null || _a === void 0 ? void 0 : _a.preset_key) || "UNTRUSTED");
};
exports.getKeyForPriceImpact = getKeyForPriceImpact;
const getProposedKey = (priceImpactTargetAmount) => {
    const filtredPresets = exports.LISTING_PRESETS;
    const liquidityTier = priceImpactTargetAmount !== undefined
        ? (0, exports.getKeyForPriceImpact)(filtredPresets, priceImpactTargetAmount)
        : "UNTRUSTED";
    return liquidityTier;
};
exports.getProposedKey = getProposedKey;
const getProposedPreset = (priceImpactTargetAmount) => {
    return exports.LISTING_PRESETS[(0, exports.getProposedKey)(priceImpactTargetAmount)];
};
exports.getProposedPreset = getProposedPreset;
const getPresetWithAdjustedDepositLimit = (tier, tokenPrice, tokenDecimals) => {
    return Object.assign(Object.assign({}, tier), { depositLimit: tokenPrice && tier.depositLimitNotional
            ? Math.ceil(tier.depositLimitNotional / tokenPrice) *
                Math.pow(10, tokenDecimals)
            : 0 });
};
exports.getPresetWithAdjustedDepositLimit = getPresetWithAdjustedDepositLimit;
exports.tierToSwapValue = {
    asset_5000: "500000",
    asset_250: "25000",
    asset_100: "10000",
    asset_20: "2000",
    asset_10: "1000",
    liab_5: "500",
    liab_3: "500",
    liab_1: "100",
    UNTRUSTED: "100",
};
exports.tierSettings = {
    asset_5000: {
        fundAmount: 6.5,
        minRequiredOracleResults: 2,
        minUpdateDelaySeconds: 60,
        batchSize: 5,
    },
    asset_250: {
        fundAmount: 6.5,
        minRequiredOracleResults: 2,
        minUpdateDelaySeconds: 60,
        batchSize: 5,
    },
    asset_100: {
        fundAmount: 6.5,
        minRequiredOracleResults: 2,
        minUpdateDelaySeconds: 60,
        batchSize: 5,
    },
    asset_20: {
        fundAmount: 3.3,
        minRequiredOracleResults: 1,
        minUpdateDelaySeconds: 60,
        batchSize: 2,
    },
    asset_10: {
        fundAmount: 3.3,
        minRequiredOracleResults: 1,
        minUpdateDelaySeconds: 60,
        batchSize: 2,
    },
    liab_5: {
        fundAmount: 3.3,
        minRequiredOracleResults: 1,
        minUpdateDelaySeconds: 60,
        batchSize: 2,
    },
    liab_3: {
        fundAmount: 3.3,
        minRequiredOracleResults: 1,
        minUpdateDelaySeconds: 60,
        batchSize: 2,
    },
    liab_1: {
        fundAmount: 3.3,
        minRequiredOracleResults: 1,
        minUpdateDelaySeconds: 60,
        batchSize: 2,
    },
    UNTRUSTED: {
        fundAmount: 0.34,
        batchSize: 2,
        minRequiredOracleResults: 1,
        minUpdateDelaySeconds: 600,
    },
};
