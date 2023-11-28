"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProposedTier = exports.getLiquidityTier = exports.getMidPriceImpacts = exports.getTierWithAdjustedNetBorrows = exports.coinTiersToNames = exports.calculateMarketTradingParams = exports.LISTING_PRESETS_PYTH = exports.LISTING_PRESETS = void 0;
const bn_js_1 = __importDefault(require("bn.js"));
const PREMIUM_LISTING = {
    maxStalenessSlots: 10000,
    oracleConfFilter: 0.1,
    adjustmentFactor: 0.004,
    util0: 0.5,
    rate0: 0.052,
    util1: 0.8,
    rate1: 0.1446,
    maxRate: 1.4456,
    loanFeeRate: 0.005,
    loanOriginationFeeRate: 0.001,
    maintAssetWeight: 0.9,
    initAssetWeight: 0.8,
    maintLiabWeight: 1.1,
    initLiabWeight: 1.2,
    liquidationFee: 0.05,
    minVaultToDepositsRatio: 0.2,
    netBorrowLimitWindowSizeTs: 24 * 60 * 60,
    netBorrowLimitPerWindowQuote: toNative(50000, 6).toNumber(),
    insuranceFound: true,
    borrowWeightScaleStartQuote: toNative(250000, 6).toNumber(),
    depositWeightScaleStartQuote: toNative(250000, 6).toNumber(),
    preset_key: "PREMIUM",
    preset_name: "Blue chip",
    preset_target_amount: 100000,
    stablePriceDelayIntervalSeconds: 60 * 60,
    stablePriceGrowthLimit: 0.0003,
    stablePriceDelayGrowthLimit: 0.06,
    tokenConditionalSwapTakerFeeRate: 0,
    tokenConditionalSwapMakerFeeRate: 0,
    flashLoanSwapFeeRate: 0,
    reduceOnly: 0,
};
exports.LISTING_PRESETS = {
    //Price impact on $250,000 swap lower then 1%
    ULTRA_PREMIUM: Object.assign(Object.assign({}, PREMIUM_LISTING), { netBorrowLimitPerWindowQuote: toNative(125000, 6).toNumber(), borrowWeightScaleStartQuote: toNative(500000, 6).toNumber(), depositWeightScaleStartQuote: toNative(500000, 6).toNumber(), preset_name: "ULTRA PREMIUM", preset_key: "ULTRA_PREMIUM", preset_target_amount: 250000 }),
    //Price impact on $100,000 swap lower then 1%
    PREMIUM: Object.assign({}, PREMIUM_LISTING),
    //Price impact on $20,000 swap lower then 1%
    MID: Object.assign(Object.assign({}, PREMIUM_LISTING), { maintAssetWeight: 0.75, initAssetWeight: 0.5, maintLiabWeight: 1.2, initLiabWeight: 1.4, liquidationFee: 0.125, netBorrowLimitPerWindowQuote: toNative(20000, 6).toNumber(), borrowWeightScaleStartQuote: toNative(50000, 6).toNumber(), depositWeightScaleStartQuote: toNative(50000, 6).toNumber(), insuranceFound: false, preset_name: "Midwit", preset_key: "MID", preset_target_amount: 20000 }),
    //Price impact on $5,000 swap lower then 1%
    MEME: Object.assign(Object.assign({}, PREMIUM_LISTING), { loanOriginationFeeRate: 0.002, maintAssetWeight: 0, initAssetWeight: 0, maintLiabWeight: 1.25, initLiabWeight: 1.5, liquidationFee: 0.2, netBorrowLimitPerWindowQuote: toNative(5000, 6).toNumber(), borrowWeightScaleStartQuote: toNative(20000, 6).toNumber(), depositWeightScaleStartQuote: toNative(20000, 6).toNumber(), insuranceFound: false, preset_name: "Meme Coin", preset_key: "MEME", preset_target_amount: 5000 }),
    //Price impact on $1,000 swap lower then 1%
    SHIT: Object.assign(Object.assign({}, PREMIUM_LISTING), { loanOriginationFeeRate: 0.002, maintAssetWeight: 0, initAssetWeight: 0, maintLiabWeight: 1.4, initLiabWeight: 1.8, liquidationFee: 0.2, netBorrowLimitPerWindowQuote: toNative(1000, 6).toNumber(), borrowWeightScaleStartQuote: toNative(5000, 6).toNumber(), depositWeightScaleStartQuote: toNative(5000, 6).toNumber(), insuranceFound: false, preset_name: "Shit Coin", preset_key: "SHIT", preset_target_amount: 1000, reduceOnly: 2, maxStalenessSlots: -1 }),
    //should run untrusted instruction
    UNTRUSTED: {},
};
exports.LISTING_PRESETS_PYTH = {
    ULTRA_PREMIUM: Object.assign(Object.assign({}, exports.LISTING_PRESETS.ULTRA_PREMIUM), { maxStalenessSlots: 250 }),
    PREMIUM: Object.assign(Object.assign({}, exports.LISTING_PRESETS.PREMIUM), { maxStalenessSlots: 250 }),
    MID: Object.assign(Object.assign({}, exports.LISTING_PRESETS.MID), { maxStalenessSlots: 250 }),
    MEME: Object.assign(Object.assign({}, exports.LISTING_PRESETS.MEME), { maxStalenessSlots: 250 }),
    SHIT: Object.assign({}, exports.LISTING_PRESETS.SHIT),
    UNTRUSTED: {},
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
    ULTRA_PREMIUM: "Ultra Premium",
    PREMIUM: "Blue Chip",
    MID: "Mid-wit",
    MEME: "Meme",
    SHIT: "Shit Coin",
    UNTRUSTED: "Untrusted",
};
const getTierWithAdjustedNetBorrows = (tier, currentTotalDepositsInUsdc) => {
    const newNetBorrowLimitPerWindowQuote = Math.round(currentTotalDepositsInUsdc / 3 / 1000000000) * 1000000000;
    const minValue = toNative(10000, 6).toNumber();
    return Object.assign(Object.assign({}, tier), { netBorrowLimitPerWindowQuote: newNetBorrowLimitPerWindowQuote < minValue
            ? minValue
            : newNetBorrowLimitPerWindowQuote });
};
exports.getTierWithAdjustedNetBorrows = getTierWithAdjustedNetBorrows;
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
const getLiquidityTier = (presets, priceImpactTargetAmount) => {
    var _a;
    return (((_a = Object.values(presets)
        .sort((a, b) => b.preset_target_amount - a.preset_target_amount)
        .find((x) => x.preset_target_amount <= priceImpactTargetAmount)) === null || _a === void 0 ? void 0 : _a.preset_key) || "SHIT");
};
exports.getLiquidityTier = getLiquidityTier;
const getProposedTier = (presets, priceImpactTargetAmount, isPythOracle) => {
    const liquidityTier = priceImpactTargetAmount !== undefined
        ? (0, exports.getLiquidityTier)(presets, priceImpactTargetAmount)
        : "SHIT";
    const detieredTierWithoutPyth = liquidityTier === "ULTRA_PREMIUM" || liquidityTier === "PREMIUM"
        ? "MID"
        : liquidityTier === "MID"
            ? "MEME"
            : liquidityTier;
    const isPythRecommended = liquidityTier === "MID" ||
        liquidityTier === "PREMIUM" ||
        liquidityTier === "ULTRA_PREMIUM";
    const proposedTier = isPythRecommended && !isPythOracle
        ? detieredTierWithoutPyth
        : liquidityTier;
    return proposedTier;
};
exports.getProposedTier = getProposedTier;
