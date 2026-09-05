(function (root, factory) {
    const api = factory();
    if (typeof module === "object" && module.exports) module.exports = api;
    if (root) root.MyeongValuationMethods = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
    "use strict";

    const ROYALTY_METHOD_1 = "royaltyDeduction1";
    const ROYALTY_METHOD_2 = "royaltyDeduction2";

    function normalizeValuationMethod(value) {
        return value === ROYALTY_METHOD_1 ? ROYALTY_METHOD_1 : ROYALTY_METHOD_2;
    }

    function requireFinite(value, label) {
        const number = typeof value === "number" ? value : Number(value);
        if (!Number.isFinite(number)) throw new TypeError(`${label}은(는) 숫자로 입력해야 합니다.`);
        return number;
    }

    function requireRating(value, label = "평점") {
        const rating = requireFinite(value, label);
        if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
            throw new RangeError(`${label}은(는) 1~5의 정수여야 합니다.`);
        }
        return rating;
    }

    function toModel1Score(value, label) {
        return requireRating(value, label) - 3;
    }

    function sumModel1Scores(ratings, keys) {
        if (!ratings || typeof ratings !== "object") throw new TypeError("평점 자료가 필요합니다.");
        if (!Array.isArray(keys) || keys.length === 0) throw new TypeError("평가항목이 필요합니다.");
        return keys.reduce((sum, key) => sum + toModel1Score(ratings[key], key), 0);
    }

    function calculateEconomicLifeModel1({ q1, q2, q3, ratings, keys }) {
        const firstQuartile = requireFinite(q1, "Q1");
        const median = requireFinite(q2, "Q2");
        const thirdQuartile = requireFinite(q3, "Q3");
        if (firstQuartile < 0 || median < firstQuartile || thirdQuartile < median) {
            throw new RangeError("TCT의 Q1, Q2, Q3 순서를 확인해 주세요.");
        }
        const score = sumModel1Scores(ratings, keys);
        const years = score < 0
            ? firstQuartile + (median - firstQuartile) * (score / 20)
            : median + (thirdQuartile - median) * (score / 20);
        return { score, years: Math.max(0, years) };
    }

    function calculateAdjustmentCoefficient1({ ratings, keys }) {
        const score = sumModel1Scores(ratings, keys);
        return { score, coefficient: 1 + score / 30 };
    }

    function calculateTechnologyShare(rows) {
        if (!Array.isArray(rows) || rows.length === 0) throw new TypeError("기술의 비중 구성자료가 필요합니다.");
        let weightTotal = 0;
        let share = 0;
        rows.forEach((row, index) => {
            const weight = requireFinite(row?.weight, `${index + 1}행 대분류 비중`);
            const appliedShare = requireFinite(row?.patentShare, `${index + 1}행 대상기술 비중`);
            if (weight < 0 || weight > 100 || appliedShare < 0 || appliedShare > 100) {
                throw new RangeError("기술의 비중 입력값은 0~100% 범위여야 합니다.");
            }
            weightTotal += weight;
            share += weight * appliedShare / 100;
        });
        if (Math.abs(weightTotal - 100) > 1e-9) throw new RangeError("대분류 비중 합계는 100%여야 합니다.");
        return { weightTotal, share };
    }

    function calculatePioneeringRate({
        annualCommercializationCost,
        annualCommercializationCosts,
        industryAssetIncrease,
        industryResearchDevelopment,
        preparationYears,
        overrideRate = null,
        overrideReason = ""
    }) {
        const years = requireFinite(preparationYears, "사업화 준비기간");
        if (!Number.isInteger(years) || years < 0) {
            throw new RangeError("사업화 준비기간은 0 이상의 정수여야 합니다.");
        }
        let costTotal = 0;
        let benchmarkTotal = 0;
        let ratio = 0;
        let recommendedRate = 100;
        if (years > 0) {
            const costs = Array.isArray(annualCommercializationCosts)
                ? annualCommercializationCosts
                : Array.from({ length: years }, () => annualCommercializationCost);
            if (costs.length < years) throw new RangeError("사업화 준비기간의 연도별 투자금액이 부족합니다.");
            costTotal = costs.slice(0, years).reduce((sum, value, index) => {
                const cost = requireFinite(value, `${index + 1}차년도 사업화 투자금액`);
                if (cost < 0) throw new RangeError("사업화 투자금액은 음수가 될 수 없습니다.");
                return sum + cost;
            }, 0);
            const assetIncrease = requireFinite(industryAssetIncrease, "동업종 유·무형자산 증감액");
            const researchDevelopment = requireFinite(industryResearchDevelopment, "동업종 연구개발비");
            if (researchDevelopment < 0) throw new RangeError("동업종 연구개발비는 음수가 될 수 없습니다.");
            benchmarkTotal = (assetIncrease + researchDevelopment) * years;
            if (benchmarkTotal <= 0) throw new RangeError("사업화 준비기간이 있으면 동업종 기준금액이 필요합니다.");
            ratio = costTotal / benchmarkTotal;
            recommendedRate = ratio > 1 ? 50 : ratio >= 0.5 ? 75 : 100;
        }
        let appliedRate = recommendedRate;
        if (overrideRate !== null && overrideRate !== "") {
            appliedRate = requireFinite(overrideRate, "개척률 확정값");
            if (appliedRate < 50 || appliedRate > 100) throw new RangeError("개척률 확정값은 50~100% 범위여야 합니다.");
            if (Math.abs(appliedRate - recommendedRate) > 1e-9 && !String(overrideReason).trim()) {
                throw new RangeError("개척률 자동추천값을 변경하려면 근거를 입력해야 합니다.");
            }
        }
        return { costTotal, benchmarkTotal, ratio, recommendedRate, appliedRate };
    }

    function calculateRoyaltyRate1({ baseRoyaltyRate, adjustmentCoefficient, technologyShare, pioneeringRate }) {
        const base = requireFinite(baseRoyaltyRate, "기준 로열티율");
        const adjustment = requireFinite(adjustmentCoefficient, "조정계수1");
        const share = requireFinite(technologyShare, "기술의 비중");
        const pioneer = requireFinite(pioneeringRate, "개척률");
        if (base < 0 || adjustment < 0 || share < 0 || share > 100 || pioneer < 0 || pioneer > 100) {
            throw new RangeError("로열티율 산정 입력값의 범위를 확인해 주세요.");
        }
        return base * adjustment * (share / 100) * (pioneer / 100);
    }

    function calculateTax(income, companyForm = "corporation") {
        const taxableIncome = Math.max(0, requireFinite(income, "과세대상 로열티 수입"));
        const corporation = [
            { cap: 200, rate: 0.10, deduction: 0, label: "2억원 이하" },
            { cap: 20000, rate: 0.20, deduction: 20, label: "2억원 초과~200억원 이하" },
            { cap: 300000, rate: 0.22, deduction: 420, label: "200억원 초과~3,000억원 이하" },
            { cap: Infinity, rate: 0.25, deduction: 9420, label: "3,000억원 초과" }
        ];
        const individual = [
            { cap: 14, rate: 0.06, deduction: 0, label: "1,400만원 이하" },
            { cap: 50, rate: 0.15, deduction: 1.26, label: "1,400만원 초과~5,000만원 이하" },
            { cap: 88, rate: 0.24, deduction: 5.76, label: "5,000만원 초과~8,800만원 이하" },
            { cap: 150, rate: 0.35, deduction: 15.44, label: "8,800만원 초과~1억5,000만원 이하" },
            { cap: 300, rate: 0.38, deduction: 19.94, label: "1억5,000만원 초과~3억원 이하" },
            { cap: 500, rate: 0.40, deduction: 25.94, label: "3억원 초과~5억원 이하" },
            { cap: 1000, rate: 0.42, deduction: 35.94, label: "5억원 초과~10억원 이하" },
            { cap: Infinity, rate: 0.45, deduction: 65.94, label: "10억원 초과" }
        ];
        const bracket = (companyForm === "corporation" ? corporation : individual).find(item => taxableIncome <= item.cap);
        const national = Math.max(0, taxableIncome * bracket.rate - bracket.deduction);
        const local = national * 0.1;
        return {
            national,
            local,
            total: national + local,
            effectiveRate: taxableIncome ? (national + local) / taxableIncome * 100 : 0,
            bracket: bracket.label,
            nationalRate: bracket.rate * 100,
            combinedRate: bracket.rate * 110,
            deduction: bracket.deduction
        };
    }

    function parseIsoDate(value) {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(String(value || ""))) return null;
        const date = new Date(`${value}T00:00:00Z`);
        return Number.isFinite(date.getTime()) ? date : null;
    }

    function prorateAnnualSales(startDate, endDate, annualSales) {
        const start = parseIsoDate(startDate);
        const end = parseIsoDate(endDate);
        if (!start || !end) throw new TypeError("일할계산 시작일과 종료일은 YYYY-MM-DD 형식이어야 합니다.");
        if (start.getTime() > end.getTime()) throw new RangeError("일할계산 종료일은 시작일보다 빠를 수 없습니다.");
        if (!Array.isArray(annualSales) || annualSales.length === 0) throw new TypeError("연도별 추정매출액 자료가 필요합니다.");
        const salesByYear = new Map(annualSales.map((row, index) => {
            const year = requireFinite(row?.year, `${index + 1}행 연도`);
            const amount = requireFinite(row?.amount, `${index + 1}행 추정매출액`);
            if (!Number.isInteger(year) || amount < 0) throw new RangeError("연도는 정수이고 추정매출액은 0 이상이어야 합니다.");
            return [year, amount];
        }));
        const millisecondsPerDay = 86400000;
        let cursor = new Date(start);
        let total = 0;
        const details = [];
        while (cursor.getTime() <= end.getTime()) {
            const year = cursor.getUTCFullYear();
            const yearEnd = new Date(Date.UTC(year, 11, 31));
            const segmentEnd = yearEnd.getTime() < end.getTime() ? yearEnd : end;
            const days = Math.round((segmentEnd.getTime() - cursor.getTime()) / millisecondsPerDay) + 1;
            const daysInYear = (Date.UTC(year + 1, 0, 1) - Date.UTC(year, 0, 1)) / millisecondsPerDay;
            const annualAmount = salesByYear.get(year) ?? 0;
            const amount = annualAmount * days / daysInYear;
            details.push({ year, days, daysInYear, annualAmount, amount });
            total += amount;
            cursor = new Date(segmentEnd.getTime() + millisecondsPerDay);
        }
        return { total, details };
    }

    function calculatePeriodFractions(years, maximumPeriods) {
        const duration = requireFinite(years, "현금흐름 추정기간");
        const limit = requireFinite(maximumPeriods, "최대 차년도 수");
        if (duration < 0 || !Number.isInteger(limit) || limit < 1) throw new RangeError("현금흐름 추정기간 또는 최대 차년도 수를 확인해 주세요.");
        const normalized = Math.max(0, Math.round(duration * 1e8) / 1e8);
        const fullYears = Math.floor(normalized);
        const partial = Math.round((normalized - fullYears) * 1e8) / 1e8;
        const periodCount = fullYears + Number(partial > 0);
        return Array.from({ length: Math.min(periodCount, limit) }, (_, index) => (
            index === periodCount - 1 && partial > 0 ? partial : 1
        ));
    }

    function calculateDiscountedCashFlows({ sales, royaltyRate, discountRate, discountPeriods, companyForm = "corporation" }) {
        if (!Array.isArray(sales) || sales.length === 0) throw new TypeError("일할 후 매출액 자료가 필요합니다.");
        if (discountPeriods !== undefined && (!Array.isArray(discountPeriods) || discountPeriods.length !== sales.length)) {
            throw new RangeError("할인기간은 추정매출액과 같은 개수여야 합니다.");
        }
        const rate = requireFinite(royaltyRate, "최종 로열티율");
        const discount = requireFinite(discountRate, "할인율");
        if (rate < 0 || discount <= -100) throw new RangeError("로열티율 또는 할인율 범위를 확인해 주세요.");
        const cashFlows = sales.map((value, index) => {
            const revenue = requireFinite(value, `${index + 1}차년도 매출액`);
            if (revenue < 0) throw new RangeError("추정매출액은 음수가 될 수 없습니다.");
            const royaltyIncome = revenue * rate / 100;
            const tax = calculateTax(royaltyIncome, companyForm);
            const afterTaxRoyalty = royaltyIncome - tax.total;
            const discountPeriod = discountPeriods === undefined
                ? index + 1
                : requireFinite(discountPeriods[index], `${index + 1}차년도 할인기간`);
            if (discountPeriod < 0) throw new RangeError("할인기간은 음수가 될 수 없습니다.");
            const presentFactor = 1 / (1 + discount / 100) ** discountPeriod;
            const presentValue = afterTaxRoyalty * presentFactor;
            return { revenue, royaltyIncome, tax, afterTaxRoyalty, discountPeriod, presentFactor, presentValue };
        });
        return {
            cashFlows,
            presentValueTotal: cashFlows.reduce((sum, row) => sum + row.presentValue, 0)
        };
    }

    function parsePioneeringTableText(text) {
        const source = String(text || "").replace(/,/g, "").replace(/\s+/g, " ");
        const numberAfter = patterns => {
            for (const pattern of patterns) {
                const match = source.match(pattern);
                if (match) {
                    const value = Number(match[1]);
                    if (Number.isFinite(value)) return value;
                }
            }
            return null;
        };
        return {
            annualCommercializationCost: numberAfter([
                /연간\s*사업화\s*소요(?:금액|자본)[^0-9-]*(-?\d+(?:\.\d+)?)/i,
                /사업화\s*투자금액[^0-9-]*(-?\d+(?:\.\d+)?)/i
            ]),
            industryAssetIncrease: numberAfter([
                /(?:최근\s*3개년\s*)?동업종\s*유[·\s]?무형\s*자산(?:증가액|증감)[^0-9-]*(-?\d+(?:\.\d+)?)/i,
                /평균\s*유[·\s]?무형\s*자산증감[^0-9-]*(-?\d+(?:\.\d+)?)/i
            ]),
            industryResearchDevelopment: numberAfter([
                /동업종\s*연구개발비[^0-9-]*(-?\d+(?:\.\d+)?)/i,
                /평균\s*연구개발비[^0-9-]*(-?\d+(?:\.\d+)?)/i
            ]),
            preparationYears: numberAfter([
                /사업화(?:준비)?기간\s*\(?년\)?[^0-9-]*(-?\d+(?:\.\d+)?)/i,
                /사업화\s*준비기간[^0-9-]*(-?\d+(?:\.\d+)?)/i
            ])
        };
    }

    function migrateValuationState(saved) {
        const source = saved && typeof saved === "object" ? saved : {};
        return { ...source, valuationMethod: normalizeValuationMethod(source.valuationMethod) };
    }

    return {
        ROYALTY_METHOD_1,
        ROYALTY_METHOD_2,
        normalizeValuationMethod,
        toModel1Score,
        sumModel1Scores,
        calculateEconomicLifeModel1,
        calculateAdjustmentCoefficient1,
        calculateTechnologyShare,
        calculatePioneeringRate,
        calculateRoyaltyRate1,
        calculateTax,
        prorateAnnualSales,
        calculatePeriodFractions,
        calculateDiscountedCashFlows,
        parsePioneeringTableText,
        migrateValuationState
    };
});
