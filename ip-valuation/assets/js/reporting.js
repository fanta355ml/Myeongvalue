function O_(e) {
    let t = e.replaceAll(`,`, ``).replaceAll(`%`, ``).replace(/[^0-9.+-]/g, ``);
    return t && Number.isFinite(Number(t)) ? Number(t) : 0;
}

function k_(e) {
    let t = e.replace(/\s+/g, ``).replaceAll(`·`, ``);
    return {
        "매출총액": `매출총이익`,
        "매출총익": `매출총이익`,
        "판매비와관리비": `판매비와관리비`,
        "판관비": `판매비와관리비`,
        "판매관리비율": `판매비와관리비율`,
        "물류원가및관리비율": `판매비와관리비율`,
        "물류원가관리비율": `판매비와관리비율`,
        "영어뵈비용": `영업외비용`,
        "법인센": `법인세`,
        "세전이익": `법인세차감전순이익`,
        "당기순손익": `당기순이익`
    }[t] ?? t;
}

function A_(e) {
    let t = e.trim().replaceAll(`.`, `-`).replaceAll(`/`, `-`).replace(/-+$/, ``).match(/(\d{4})-(\d{1,2})-(\d{1,2})/);
    return t ? `${t[1]}-${t[2].padStart(2, `0`)}-${t[3].padStart(2, `0`)}` : ``;
}

function j_(e, t) {
    let [n, r, i] = (A_(e) || `2025-12-31`).split(`-`), a = Number(n);
    return Array.from({
        length: Math.max(1, t)
    }, (e, n) => `${a - Math.max(1, t) + 1 + n}-${r}-${i}`);
}

function buildCompetitionYears(e) {
    let t = Number(e);
    return Number.isFinite(t) && t >= 1902 ? [ t - 2, t - 1, t ] : [ 2023, 2024, 2025 ];
}

function ensureCompetitorRows(e) {
    let t = Array.isArray(e) ? e.slice(0, 4) : [], n = [ `경쟁기업 A`, `경쟁기업 B`, `경쟁기업 C` ];
    t.length || t.push({
        name: `사업화주체`,
        cost: [ 92.97, 106.14, 122.14 ],
        sga: [ 8.22, 12.06, 22.13 ],
        source: `사업화주체 비율표 연계`
    });
    for (let e = 1; e <= 3; e += 1) t[e] || (t[e] = {
        name: n[e - 1],
        cost: [ 0, 0, 0 ],
        sga: [ 0, 0, 0 ],
        source: `직접입력`
    });
    return t;
}

function selectProfitabilityComparisonPeriods(e, t, n) {
    let r = [ ...new Set(e) ].filter(Number.isFinite).sort((e, t) => t - e).slice(0, 5), i = [ ...new Set(t) ].filter(Number.isFinite).sort((e, t) => t - e).slice(0, 5), a = Math.min(5, r.length, i.length), o = Math.min(Math.max(1, Number(n) || 1), a);
    return {
        companyYears: r.slice(0, o),
        industryYears: i.slice(0, o),
        availableYears: a,
        appliedYears: o
    };
}

function M_(e) {
    return e.length ? e.reduce((e, t) => e + t, 0) / e.length : 0;
}

function N_(e, t) {
    return e.mode === `growth` ? [] : [ ...e.mode === `three` ? [ {
        year: e.pastYear,
        value: e.pastValue,
        kind: t
    } ] : [], {
        year: e.baseYear,
        value: e.baseValue,
        kind: t
    }, {
        year: e.futureYear,
        value: e.futureValue,
        kind: t
    } ];
}

function P_(e, t, n) {
    return e.find(e => e.label === t)?.values[n] ?? 0;
}

function F_({industry: e, companyFinancials: t, onCompanyFinancialsChange: n, salesMix: r, onSalesMixChange: i, onIndustryRevenueSeriesChange: a, onIndustryAssetMetricsChange: onIndustryAssetMetricsChange, relatedSalesBasis: o, onRelatedSalesBasisChange: s, domesticMarket: c, worldMarket: l, onDomesticMarketChange: u, onWorldMarketChange: d, profitabilityScore: f, onProfitabilityScoreChange: p, onIndustryProfitabilityChange: m, setNotice: h}) {
    let selectedValuationMethod = window.localStorage.getItem(`ip-valuation-current-method`) ?? `royaltyDeduction2`, showRoyalty1Financials = g => g === `starvalue` || selectedValuationMethod === `royaltyDeduction1`;
    let [g, _] = (0, C.useState)(`starvalue`), [v, y] = (0, C.useState)(``), [b, x] = (0,
    C.useState)(2024), [S, w] = (0, C.useState)(D_), [T, E] = (0, C.useState)(3), [D, O] = (0,
    C.useState)(``), [k, A] = (0, C.useState)(``), [j, M] = (0, C.useState)(() => Math.max(...r.map(e => e.year), 2025)), [N, P] = (0,
    C.useState)(3), [starvalueBalanceRows, setStarvalueBalanceRows] = (0, C.useState)([]), [F, I] = (0, C.useState)(``), [L, te] = (0, C.useState)(`2025-12-31`), [R, z] = (0,
    C.useState)([ {
        date: `2023-12-31`,
        cost: 82.35,
        sga: 7.7
    }, {
        date: `2024-12-31`,
        cost: 92.97,
        sga: 8.22
    }, {
        date: `2025-12-31`,
        cost: 108.14,
        sga: 12.06
    } ]), [competitionLatestYear, setCompetitionLatestYear] = (0, C.useState)(2025), [ne, H] = (0, C.useState)([ {
        name: `사업화주체`,
        cost: [ 92.97, 106.14, 122.14 ],
        sga: [ 8.22, 12.06, 22.13 ],
        source: `사업화주체 비율표 연계`
    }, {
        name: `경쟁기업 A`,
        cost: [ 98.33, 96.49, 85.32 ],
        sga: [ 12.46, 9.19, 8.72 ],
        source: `직접입력`
    }, {
        name: `경쟁기업 B`,
        cost: [ 116.69, 93.96, 92.24 ],
        sga: [ 5.43, 8.26, 4.89 ],
        source: `직접입력`
    }, {
        name: `경쟁기업 C`,
        cost: [ 0, 0, 0 ],
        sga: [ 0, 0, 0 ],
        source: `직접입력`
    } ]);
    let B = (0, C.useMemo)(() => buildCompetitionYears(competitionLatestYear), [ competitionLatestYear ]);
    Sm(pm, {
        source: g,
        paste: v,
        latestYear: b,
        industryRows: S,
        starvalueBalanceRows,
        comparisonYears: T,
        financialPaste: D,
        revenuePaste: k,
        salesMixLatestYear: j,
        salesMixYears: N,
        companyRatioPaste: F,
        companyRatioLatestDate: L,
        companyRatios: R,
        competitionLatestYear,
        competitionYears: B,
        competitors: ne
    }, e => {
        e.source && _(e.source), typeof e.paste == `string` && y(e.paste), typeof e.latestYear == `number` && x(e.latestYear),
        Array.isArray(e.industryRows) && w(e.industryRows), Array.isArray(e.starvalueBalanceRows) && setStarvalueBalanceRows(e.starvalueBalanceRows), typeof e.comparisonYears == `number` && E(e.comparisonYears),
        typeof e.financialPaste == `string` && O(e.financialPaste), typeof e.revenuePaste == `string` && A(e.revenuePaste),
        typeof e.salesMixLatestYear == `number` && M(e.salesMixLatestYear), typeof e.salesMixYears == `number` && e.salesMixYears >= 1 && e.salesMixYears <= 5 && P(e.salesMixYears),
        typeof e.companyRatioPaste == `string` && I(e.companyRatioPaste), typeof e.companyRatioLatestDate == `string` && te(e.companyRatioLatestDate),
        Array.isArray(e.companyRatios) && z(e.companyRatios), typeof e.competitionLatestYear == `number` ? setCompetitionLatestYear(e.competitionLatestYear) : Array.isArray(e.competitionYears) && e.competitionYears.length && setCompetitionLatestYear(Number(e.competitionYears.at(-1)) || 2025),
        Array.isArray(e.competitors) && H(ensureCompetitorRows(e.competitors));
    });
    let ie = (0, C.useMemo)(() => Array.from({
        length: g === `starvalue` ? 5 : 3
    }, (e, t) => b - (g === `starvalue` ? 4 : 2) + t), [ b, g ]), U = (0, C.useMemo)(() => S.map(e => ({
        ...e,
        values: e.values.slice(-ie.length)
    })), [ S, ie.length ]), ae = (0, C.useMemo)(() => {
        let e = U.find(e => e.label === `매출액`)?.values ?? [];
        return ie.map((t, n) => ({
            year: t,
            revenue: e[n] ?? 0
        }));
    }, [ ie, U ]);
    let starvalueAssetMetrics = (0, C.useMemo)(() => {
        let tangible = starvalueBalanceRows.find(e => e.label === `유형자산`)?.values ?? [], intangible = starvalueBalanceRows.find(e => e.label === `무형자산`)?.values ?? [], combined = ie.map((year, index) => {
            let tangibleValue = tangible[index], intangibleValue = intangible[index];
            return Number.isFinite(tangibleValue) && Number.isFinite(intangibleValue) ? { year, value: tangibleValue + intangibleValue } : { year, value: null };
        }), changes = combined.slice(1).map((current, index) => ({
            year: current.year,
            value: current.value !== null && combined[index].value !== null ? current.value - combined[index].value : null
        })), recent = changes.filter(e => Number.isFinite(e.value)).slice(-3), averageThousandWon = recent.length === 3 ? recent.reduce((sum, item) => sum + item.value, 0) / 3 : null;
        return {
            source: `starvalue`,
            sourceLabel: `KISTI StarValue 동업종 재무상태표`,
            years: ie,
            tangible,
            intangible,
            combined,
            changes,
            averageRecent3Million: averageThousandWon === null ? null : averageThousandWon / 1000,
            complete: averageThousandWon !== null
        };
    }, [ starvalueBalanceRows, ie ]);
    (0, C.useEffect)(() => {
        onIndustryAssetMetricsChange?.(starvalueAssetMetrics);
    }, [ onIndustryAssetMetricsChange, starvalueAssetMetrics ]);
    (0, C.useEffect)(() => {
        a(ae);
    }, [ a, ae ]);
    let oe = lm(c), se = lm(l), ce = N_(c, `국내`), le = N_(l, `해외`), salesAvailableYears = Math.min(5, r.filter(e => e.totalRevenue > 0).length), companyFinancialByYear = new Map(t.map(e => [ Number(e.closingDate.slice(0, 4)), e ])), companyRatioByYear = new Map(R.map(e => [ Number(e.date.slice(0, 4)), e ])), industryIndexByYear = new Map(ie.map((e, t) => [ e, t ])), companyComparableYears = [ ...companyFinancialByYear.keys() ].filter(e => {
        let t = companyFinancialByYear.get(e), n = companyRatioByYear.get(e);
        return !!(t?.revenue && n && Number.isFinite(n.cost) && Number.isFinite(n.sga));
    }), industryComparableYears = ie.filter(e => {
        let t = industryIndexByYear.get(e);
        return !!(t != null && P_(U, `매출액`, t));
    }), comparisonPeriods = selectProfitabilityComparisonPeriods(companyComparableYears, industryComparableYears, T), availableComparisonYears = comparisonPeriods.availableYears, appliedComparisonYears = comparisonPeriods.appliedYears, selectedCompanyYears = comparisonPeriods.companyYears, selectedIndustryYears = comparisonPeriods.industryYears, ue = selectedIndustryYears.map(e => industryIndexByYear.get(e)).filter(e => e != null).map(e => {
        let t = P_(U, `매출액`, e);
        return {
            cost: t ? P_(U, `매출원가`, e) / t * 100 : 0,
            sga: t ? P_(U, `판매비와관리비`, e) / t * 100 : 0,
            operating: t ? P_(U, `영업이익`, e) / t * 100 : 0
        };
    }), de = selectedCompanyYears.map(e => companyFinancialByYear.get(e)).filter(e => e), fe = selectedCompanyYears.map(e => companyRatioByYear.get(e)).filter(e => e), pe = [ {
        label: `매출원가율`,
        company: M_(fe.map(e => e.cost)),
        industry: M_(ue.map(e => e.cost))
    }, {
        label: `판매관리비율`,
        company: M_(fe.map(e => e.sga)),
        industry: M_(ue.map(e => e.sga))
    }, {
        label: `영업이익률`,
        company: M_(de.map(am)),
        industry: M_(ue.map(e => e.operating))
    } ], companyCostRate = pe[0].company, companySgaRate = pe[1].company, companyOperatingMargin = pe[2].company, me = M_(ue.map(e => e.cost)), he = M_(ue.map(e => e.sga)), ge = M_(ue.map(e => e.operating));
    (0, C.useEffect)(() => {
        availableComparisonYears > 0 && T > availableComparisonYears && E(availableComparisonYears);
    }, [ T, availableComparisonYears ]), (0, C.useEffect)(() => {
        salesAvailableYears > 0 && N > salesAvailableYears && P(salesAvailableYears);
    }, [ N, salesAvailableYears ]), (0, C.useEffect)(() => {
        m({
            source: g,
            years: appliedComparisonYears,
            companyCostRate,
            companySgaRate,
            companyOperatingMargin,
            costRate: me,
            sgaRate: he,
            operatingMargin: ge
        });
    }, [ appliedComparisonYears, companyCostRate, companySgaRate, companyOperatingMargin, me, ge, he, m, g ]);
    let _e = [ ...r ].sort((e, t) => t.year - e.year)[0], ve = _e ? o.selected.includes(`totalRevenue`) ? _e.totalRevenue : o.selected.reduce((e, t) => e + _e[t], 0) : 0, ye = _e?.totalRevenue ? ve / _e.totalRevenue * 100 : 0, be = Qp(r, o), xe = (e = v) => {
        y(e);
        let t = g === `starvalue` ? 5 : 3, n = new Map, r = e.split(/\r?\n/).map(e => e.trim()).filter(Boolean), balanceLabels = [ `고정자산`, `유형자산`, `무형자산`, `유동자산`, `유동부채`, `자산총계`, `부채총계`, `매출채권`, `재고자산`, `매입채무` ], recognizedLabels = [ ...E_, ...balanceLabels ];
        r.map(e => e.split(`\t`).map(e => e.trim())).forEach(e => {
            let r = k_(e[0] ?? ``), i = e.slice(1).filter(e => /[-+]?\d/.test(e)).map(O_).slice(-t);
            i.length && recognizedLabels.includes(r) && n.set(r, Array(Math.max(0, t - i.length)).fill(null).concat(i));
        });
        if (g === `starvalue`) {
            let positional = globalThis.MyeongValuationMethods?.parseStarValueFinancialText(e, t);
            positional?.incomeRows?.forEach(row => {
                n.has(row.label) || n.set(row.label, row.values);
            }), positional?.balanceRows?.forEach(row => {
                n.has(row.label) || n.set(row.label, row.values);
            });
        }
        if (!n.size) {
            let e = r.map(e => {
                let n = e.match(/[-+]?\d[\d,]*(?:\.\d+)?%?/g) ?? [], r = n[0]?.includes(`%`) || n.length > t ? n.slice(-t) : n;
                return r.length ? Array(Math.max(0, t - r.length)).fill(0).concat(r.slice(-t).map(O_)) : [];
            }).filter(e => e.length === t).slice(0, E_.length);
            e.length && e.forEach((e, t) => n.set(E_[t], e));
        }
        if (!n.size) {
            h(`재무통계 행을 인식하지 못했습니다. 구분명과 수치 열을 함께 복사해 주세요.`);
            return;
        }
        w(e => E_.map(r => {
            let i = e.find(e => e.label === r)?.values ?? [], a = Array(Math.max(0, t - i.length)).fill(0).concat(i.slice(-t));
            return {
                label: r,
                values: n.get(r) ?? a
            };
        })), g === `starvalue` && setStarvalueBalanceRows(balanceLabels.filter(label => n.has(label)).map(label => ({
            label,
            values: n.get(label)
        }))), h(`${b}년을 최근연도로 하여 손익 ${[ ...n.keys() ].filter(label => E_.includes(label)).length}개·재무상태표 ${[ ...n.keys() ].filter(label => balanceLabels.includes(label)).length}개 계정과목을 자동 매칭했습니다. StarValue 금액은 천 원 단위 원문값으로 보존합니다.`);
    }, Se = (e = D, t = ``) => {
        let r = e.split(/\r?\n/).map(e => e.split(`\t`).map(e => e.trim())).filter(e => e.some(Boolean)), i = t && typeof DOMParser < `u` ? Array.from((new DOMParser).parseFromString(t, `text/html`).querySelectorAll(`tr`)).map(e => Array.from(e.querySelectorAll(`th,td`)).map(e => e.textContent?.trim() ?? ``)).filter(e => e.some(Boolean)) : [], a = i.some(e => e.length >= 7) ? i : r, o = {
            "총자산": `totalAssets`,
            "자산총계": `totalAssets`,
            "납입자본금": `paidInCapital`,
            "자본금": `paidInCapital`,
            "자본총계": `totalEquity`,
            "자기자본": `totalEquity`,
            "매출액": `revenue`,
            "영업수익": `revenue`,
            "영업이익": `operatingProfit`,
            "영업손익": `operatingProfit`,
            "순이익": `netIncome`,
            "당기순이익": `netIncome`,
            "당기순손익": `netIncome`
        }, s = e => ({
            closingDate: e,
            totalAssets: 0,
            paidInCapital: 0,
            totalEquity: 0,
            revenue: 0,
            operatingProfit: 0,
            netIncome: 0
        }), c = new Set([ `결산일자`, `결산기준일`, `결산일`, `기준일` ]), l = e => c.has(k_(e)), u = [], d = a.find(e => e.filter(e => A_(e)).length >= 1);
        if (d) {
            let e = d.map((e, t) => ({
                closingDate: A_(e),
                index: t
            })).filter(e => e.closingDate);
            if (e.length) {
                let t = e.map(e => s(e.closingDate));
                a.forEach(n => {
                    let r = n.find(e => o[k_(e)]), i = r ? o[k_(r)] : void 0;
                    i && e.forEach((e, r) => {
                        t[r][i] = O_(n[e.index] ?? `0`);
                    });
                }), u = t.filter(e => e.revenue || e.totalAssets || e.totalEquity);
            }
        }
        if (!u.length) {
            let e = a.find(e => e.some(l) && e.some(e => o[k_(e)]));
            if (e) {
                let t = e.findIndex(l), n = e.map((e, t) => ({
                    key: o[k_(e)],
                    index: t
                })).filter(e => e.key);
                u = a.map(e => {
                    let r = A_(e[t] ?? ``);
                    if (!r) return null;
                    let i = s(r);
                    return n.forEach(t => {
                        i[t.key] = O_(e[t.index] ?? `0`);
                    }), i;
                }).filter(e => !!(e && (e.revenue || e.totalAssets || e.totalEquity)));
            }
        }
        if (u.length || (u = a.map(e => {
            let t = e.findIndex(e => !!A_(e));
            if (t < 0) return null;
            let n = e.slice(t + 1).filter(e => /[-+]?\d/.test(e)).map(O_);
            return n.length < 6 ? null : {
                closingDate: A_(e[t]),
                totalAssets: n[0],
                paidInCapital: n[1],
                totalEquity: n[2],
                revenue: n[3],
                operatingProfit: n[4],
                netIncome: n[5]
            };
        }).filter(e => !!e)), u.length || (u = e.split(/\r?\n/).map(e => {
            let t = A_(e);
            if (!t) return null;
            let n = e.match(/\d{4}[./-]\d{1,2}[./-]\d{1,2}/), r = (n ? e.slice((n.index ?? 0) + n[0].length) : ``).match(/[-+]?\d[\d,]*(?:\.\d+)?/g)?.map(O_) ?? [];
            return r.length < 6 ? null : {
                closingDate: t,
                totalAssets: r[0],
                paidInCapital: r[1],
                totalEquity: r[2],
                revenue: r[3],
                operatingProfit: r[4],
                netIncome: r[5]
            };
        }).filter(e => !!e)), !u.length) {
            let t = e.split(/\t|\r?\n/).map(e => e.trim()).filter(Boolean), n = t.map((e, t) => l(e) || o[k_(e)] ? t : -1).filter(e => e >= 0), r = n.length ? Math.max(...n) + 1 : 0, i = t.slice(r), a = [];
            for (let e = 0; e <= i.length - 7; ) {
                let t = A_(i[e]);
                if (!t) {
                    e += 1;
                    continue;
                }
                let n = i.slice(e + 1, e + 7);
                if (n.every(e => /[-+]?\d/.test(e))) {
                    let r = n.map(O_);
                    a.push({
                        closingDate: t,
                        totalAssets: r[0],
                        paidInCapital: r[1],
                        totalEquity: r[2],
                        revenue: r[3],
                        operatingProfit: r[4],
                        netIncome: r[5]
                    }), e += 7;
                } else e += 1;
            }
            u = a;
        }
        if (!u.length) {
            h(`크레탑 사업화주체 재무정보를 인식하지 못했습니다. 표 머리글과 결산일이 포함된 범위를 다시 복사해 주세요.`);
            return;
        }
        let f = u.sort((e, t) => t.closingDate.localeCompare(e.closingDate)).slice(0, 5);
        n(f), O(e), h(`${f.length}개년 사업화주체 재무정보를 자동 인식하여 가치산정 참조표에 연결했습니다.`);
    }, Ce = (e = k) => {
        let t = e.split(/\r?\n/).map(e => e.split(`\t`).map(e => e.trim())).filter(e => e.some(Boolean)), n = t.flatMap(e => e.map(e => Number(e.match(/20\d{2}/)?.[0] ?? 0))).filter(Boolean), a = [ ...new Set(n) ].sort((e, t) => e - t).slice(-5), o = Math.min(5, Math.max(0, ...t.map(e => e.filter(e => /[-+]?\d/.test(e) && !/^20\d{2}(?:[-./]\d{1,2})?/.test(e)).length))) || Math.min(5, Math.max(1, r.length)), s = a.length ? a : Array.from({
            length: o
        }, (e, t) => j - o + 1 + t);
        if (!s.length) {
            h(`매출구성 결산연도를 찾지 못했습니다.`);
            return;
        }
        let c = s.map(e => ({
            year: e,
            totalRevenue: 0,
            productRevenue: 0,
            constructionRevenue: 0,
            otherRevenue: 0,
            rentalRevenue: 0,
            wholesaleRetailRevenue: 0
        })), l = 0;
        if (t.forEach(e => {
            let t = e.map(qp).find(Boolean);
            if (!t) return;
            let n = e.filter(e => /[-+]?\d/.test(e) && !/^20\d{2}(?:[-./]\d{1,2})?/.test(e)).map(O_).slice(-s.length);
            n.length && (n.forEach((e, r) => {
                let i = c[c.length - n.length + r];
                i && (i[t] = e / 1e3);
            }), l += 1);
        }), !l) {
            h(`매출액 구분을 인식하지 못했습니다. 매출액·제품매출액 등 행 이름과 연도별 수치를 함께 복사해 주세요.`);
            return;
        }
        c.forEach(e => {
            e.totalRevenue ||= e.productRevenue + e.constructionRevenue + e.otherRevenue + e.rentalRevenue + e.wholesaleRetailRevenue;
        }), i(c.sort((e, t) => e.year - t.year)), A(e), h(`${c.length}개년 매출구성 ${l}개 항목을 인식했습니다. 천 원 원문을 백만 원으로 변환하고 최우측 수치를 ${s.at(-1)}년으로 배정했습니다.`);
    };
    let competitionRatioByYear = new Map(R.map(e => [ Number(e.date.slice(0, 4)), e ])), competitionRows = ne.map((e, t) => t ? {
        ...e,
        source: e.source || `직접입력`
    } : {
        ...e,
        cost: B.map((t, n) => competitionRatioByYear.get(t)?.cost ?? e.cost[n] ?? 0),
        sga: B.map((t, n) => competitionRatioByYear.get(t)?.sga ?? e.sga[n] ?? 0),
        source: `사업화주체 비율표 연계`
    }), importCompetitorPdf = async (e, t) => {
        if (!t) return;
        try {
            let n = window.CretopPdfImportParser;
            if (!n?.extractPdf || !n?.normalizeCompetitorRatios) throw new Error(`PDF 인식 모듈을 불러오지 못했습니다.`);
            let r = await n.extractPdf(t, t => h(`${ne[e]?.name || `경쟁기업`} · ${t}`)), i = n.normalizeCompetitorRatios(r);
            if (!i.years.length) throw new Error(`기업종합보고서에서 원가율·판관비율을 찾지 못했습니다.`);
            setCompetitionLatestYear(Number(i.years.at(-1)) || competitionLatestYear), H(t => ensureCompetitorRows(t).map((t, n) => n === e ? {
                ...t,
                name: i.companyName || t.name,
                cost: i.cost,
                sga: i.sga,
                source: `CRET0P PDF · ${i.fileName || `업로드 완료`}`
            } : t)), h(`${i.companyName}의 ${i.years.length}개년 원가율·판관비율을 PDF에서 인식했습니다. 아래 표에서 직접 수정할 수 있습니다.`);
        } catch (e) {
            h(e instanceof Error ? e.message : `경쟁기업 PDF를 읽지 못했습니다.`);
        }
    };
    return (0, W.jsxs)(`section`, {
        className: `benchmark-workspace`,
        children: [ (0, W.jsxs)(`div`, {
            className: `applied-industry-banner`,
            children: [ (0, W.jsxs)(`div`, {
                children: [ (0, W.jsx)(`span`, {
                    children: `사업화제품 기준 표준산업분류`
                }), (0, W.jsx)(`strong`, {
                    children: e.code
                }), (0, W.jsx)(`p`, {
                    children: e.name
                }) ]
            }), (0, W.jsxs)(`div`, {
                children: [ (0, W.jsx)(`span`, {
                    children: `적용 범위`
                }), (0, W.jsx)(`strong`, {
                    children: `StarValue 검색·업종평균·가치산정`
                }), (0, W.jsx)(`p`, {
                    children: `업체정보에서 확정한 기준값`
                }) ]
            }) ]
        }), (0, W.jsxs)(`div`, {
            className: `benchmark-source-switch`,
            children: [ (0, W.jsxs)(`div`, {
                children: [ (0, W.jsx)(`span`, {
                    className: `eyebrow`,
                    children: `수익구조 비교 데이터`
                }), (0, W.jsx)(`strong`, {
                    children: `동업종 재무통계 원천`
                }) ]
            }), (0, W.jsxs)(`label`, {
                className: g === `starvalue` ? `active` : ``,
                children: [ (0, W.jsx)(`input`, {
                    type: `radio`,
                    name: `industry-source`,
                    checked: g === `starvalue`,
                    onChange: () => _(`starvalue`)
                }), (0, W.jsxs)(`span`, {
                    children: [ `KISTI StarValue`, (0, W.jsx)(`small`, {
                        children: `기본값 · 최대 5개년`
                    }) ]
                }) ]
            }), (0, W.jsxs)(`label`, {
                className: g === `cretop` ? `active` : ``,
                children: [ (0, W.jsx)(`input`, {
                    type: `radio`,
                    name: `industry-source`,
                    checked: g === `cretop`,
                    onChange: () => {
                        _(`cretop`), E(Math.min(3, T));
                    }
                }), (0, W.jsxs)(`span`, {
                    children: [ `크레탑 동업종 비교`, (0, W.jsx)(`small`, {
                        children: `StarValue 불가 시 · 최대 3개년`
                    }) ]
                }) ]
            }) ]
        }), (0, W.jsxs)(`div`, {
            className: `stage-grid benchmark-grid`,
            children: [ (0, W.jsxs)(`article`, {
                className: `stage-card span-2 benchmark-paste-card`,
                children: [ (0, W.jsxs)(`div`, {
                    className: `card-title`,
                    children: [ (0, W.jsxs)(`div`, {
                        children: [ (0, W.jsxs)(`span`, {
                            className: `eyebrow`,
                            children: [ g === `starvalue` ? `KISTI STARVALUE` : `CRET0P 동업종`, ` 원자료` ]
                        }), (0, W.jsx)(`h2`, {
                            children: `재무통계 표 붙여넣기`
                        }) ]
                    }), (0, W.jsxs)(`label`, {
                        className: `latest-year-field`,
                        children: [ (0, W.jsx)(`span`, {
                            children: `동업종 통계 최근연도`
                        }), (0, W.jsx)(`input`, {
                            type: `number`,
                            value: b,
                            onChange: e => x(Number(e.target.value) || 2024)
                        }) ]
                    }) ]
                }), (0, W.jsx)(`p`, {
                    className: `card-help`,
                    children: g === `starvalue` ? `손익계산서 11행 다음에 재무상태표 10행을 붙여넣으면 계정명이 복사되지 않아도 고정 순서로 인식합니다. 유형자산·무형자산은 최근 3개년 증감 산출 후 로열티공제법Ⅰ 개척률 후보값으로 연결합니다.` : `연도·계정과목명이 복사되지 않아도 11개 행의 고정 순서로 인식하고, 최우측 수치를 최근연도로 보아 왼쪽으로 1년씩 자동 배정합니다.`
                }), (0, W.jsx)(`textarea`, {
                    value: v,
                    onChange: e => y(e.target.value),
                    onPaste: e => {
                        let t = e.clipboardData.getData(`text`);
                        t.trim() && (e.preventDefault(), xe(t));
                    },
                    placeholder: `100%\t24,326,844\t25,968,378\t29,540,386\t29,959,405\t28,536,978\n81.12%\t20,636,155\t22,100,474\t25,509,044\t25,677,319\t24,331,459`
                }), (0, W.jsxs)(`div`, {
                    className: `paste-actions`,
                    children: [ (0, W.jsx)(`span`, {
                        children: v.trim() ? `${v.trim().split(/\r?\n/).length}개 행 감지 · ${ie[0]}~${b}년 자동매칭` : `붙여넣기 대기`
                    }), (0, W.jsxs)(`button`, {
                        type: `button`,
                        onClick: () => xe(),
                        children: [ (0, W.jsx)(ee, {
                            size: 15
                        }), ` 인식·적용` ]
                    }) ]
                }) ]
            }), (0, W.jsxs)(`article`, {
                className: `stage-card span-2`,
                children: [ (0, W.jsxs)(`div`, {
                    className: `card-title`,
                    children: [ (0, W.jsxs)(`div`, {
                        children: [ (0, W.jsx)(`span`, {
                            className: `eyebrow`,
                            children: e.code
                        }), (0, W.jsx)(`h2`, {
                            children: e.name
                        }) ]
                    }), (0, W.jsxs)(`span`, {
                        className: `source-chip`,
                        children: [ g === `starvalue` ? `StarValue ${ie[0]}~${b}` : `크레탑 ${ie[0]}~${b}`, ` · 단위: 천 원` ]
                    }) ]
                }), (0, W.jsx)(`div`, {
                    className: `industry-table-wrap`,
                    children: (0, W.jsxs)(`table`, {
                        className: `industry-finance-table`,
                        children: [ (0, W.jsx)(`thead`, {
                            children: (0, W.jsxs)(`tr`, {
                                children: [ (0, W.jsx)(`th`, {
                                    children: `구분`
                                }), ie.map(e => (0, W.jsxs)(`th`, {
                                    children: [ e, `년` ]
                                }, e)) ]
                            })
                        }), (0, W.jsx)(`tbody`, {
                            children: U.map(e => (0, W.jsxs)(`tr`, {
                                children: [ (0, W.jsx)(`th`, {
                                    children: e.label
                                }), e.values.map((e, t) => (0, W.jsx)(`td`, {
                                    children: Number(e).toLocaleString()
                                }, t)) ]
                            }, e.label))
                        }) ]
                    })
                }), (0, W.jsx)(`p`, {
                    className: `card-help`,
                    children: `표의 모든 금액은 StarValue 원문과 동일한 천 원 단위로 저장·표시합니다. 가치산정에서 금액으로 연결할 때만 백만 원 단위로 자동 변환합니다.`
                }), showRoyalty1Financials(g) && (0, W.jsxs)(W.Fragment, {
                    children: [ (0, W.jsxs)(`h3`, { className: `royalty1-financial-heading`, children: [ `로열티공제법Ⅰ 개척률용 재무상태표`, (0, W.jsx)(`small`, { children: ` · StarValue 붙여넣기 인식 결과` }) ] }), starvalueBalanceRows.length ? (0, W.jsx)(`div`, {
                        className: `industry-table-wrap`,
                        children: (0, W.jsxs)(`table`, {
                            className: `industry-finance-table`,
                            children: [ (0, W.jsx)(`thead`, { children: (0, W.jsxs)(`tr`, { children: [ (0, W.jsx)(`th`, { children: `구분` }), ie.map(year => (0, W.jsxs)(`th`, { children: [ year, `년` ] }, year)) ] }) }), (0, W.jsx)(`tbody`, { children: starvalueBalanceRows.map(row => (0, W.jsxs)(`tr`, { children: [ (0, W.jsx)(`th`, { children: row.label }), row.values.map((value, index) => (0, W.jsx)(`td`, { children: Number.isFinite(value) ? Number(value).toLocaleString() : `-` }, index)) ] }, row.label)) }) ]
                        })
                    }) : (0, W.jsx)(`p`, { className: `card-help`, children: `StarValue 손익계산서 11행 뒤에 재무상태표 10행을 이어 붙여넣으면 고정 순서로 별도 인식하여 이 표에 표시합니다.` }), (0, W.jsxs)(`div`, {
                        className: `reference-match-note`,
                        children: [ (0, W.jsx)(`span`, { children: `개척률 자동연결` }), (0, W.jsx)(`strong`, { children: starvalueAssetMetrics.complete ? `${starvalueAssetMetrics.averageRecent3Million.toLocaleString(`ko-KR`, { maximumFractionDigits: 6 })}백만원` : `산출 전` }), (0, W.jsx)(`small`, { children: starvalueAssetMetrics.complete ? `유형자산+무형자산의 최근 3개년 순증감 평균 · 가치산정에서 ECOS 연구개발비율과 자동 결합` : `유형자산·무형자산 4개년 이상 자료가 필요합니다.` }) ]
                    }) ]
                }) ]
            }), (0, W.jsxs)(`article`, {
                className: `stage-card span-2 company-finance-input`,
                children: [ (0, W.jsxs)(`div`, {
                    className: `card-title`,
                    children: [ (0, W.jsxs)(`div`, {
                        children: [ (0, W.jsx)(`span`, {
                            className: `eyebrow`,
                            children: `크레탑 사업화주체 재무자료`
                        }), (0, W.jsx)(`h2`, {
                            children: `재무자료 긁어 붙이기`
                        }) ]
                    }), (0, W.jsx)(`span`, {
                        className: `source-chip`,
                        children: `붙여넣는 즉시 자동연결 · 백만원`
                    }) ]
                }), (0, W.jsx)(`p`, {
                    className: `card-help`,
                    children: `크레탑의 ‘경영규모’ 표 머리글부터 마지막 결산연도까지 드래그해 복사한 뒤 아래 입력창에 붙여넣으세요. 엑셀식 표와 크레탑 웹 화면 선택복사 형식을 모두 인식합니다.`
                }), (0, W.jsx)(`textarea`, {
                    rows: 4,
                    "aria-label": `크레탑 사업화주체 재무자료 붙여넣기`,
                    value: D,
                    onChange: e => O(e.target.value),
                    onPaste: e => {
                        let t = e.clipboardData.getData(`text`), n = e.clipboardData.getData(`text/html`);
                        t.trim() && (e.preventDefault(), Se(t, n));
                    },
                    placeholder: `결산기준일\t총자산\t납입자본금\t자본총계\t매출액\t영업이익\t순이익\n2025-12-31\t56,717\t4,467\t11,982\t171,442\t2,246\t2,480`
                }), (0, W.jsxs)(`div`, {
                    className: `paste-actions`,
                    children: [ (0, W.jsx)(`span`, {
                        children: D.trim() ? `붙여넣기 내용 인식 완료` : `입력창을 클릭한 뒤 Ctrl+V로 붙여넣으세요`
                    }), (0, W.jsxs)(`button`, {
                        type: `button`,
                        disabled: !D.trim(),
                        onClick: () => Se(),
                        children: [ (0, W.jsx)(ee, {
                            size: 15
                        }), ` 다시 인식` ]
                    }) ]
                }), (0, W.jsxs)(`div`, {
                    className: `benchmark-financial-summary-grid`,
                    children: [ (0, W.jsx)(I_, {
                        rows: t
                    }), (0, W.jsx)(L_, {
                        title: `사업화주체 매출액 추이`,
                        rows: t.map(e => ({
                            year: e.closingDate.slice(0, 4),
                            revenue: e.revenue
                        }))
                    }), (0, W.jsx)(L_, {
                        title: `동업종 매출액 추이`,
                        rows: ae.map(e => ({
                            year: e.year,
                            revenue: e.revenue / 1e3
                        })),
                        tone: `industry`
                    }) ]
                }) ]
            }), (0, W.jsxs)(`article`, {
                className: `stage-card span-2 revenue-paste-card`,
                children: [ (0, W.jsxs)(`div`, {
                    className: `card-title`,
                    children: [ (0, W.jsxs)(`div`, {
                        children: [ (0, W.jsx)(`span`, {
                            className: `eyebrow`,
                            children: `크레탑 사업화주체 매출구성`
                        }), (0, W.jsx)(`h2`, {
                            children: `매출액 구분 긁어 붙이기`
                        }), (0, W.jsx)(`span`, {
                            className: `source-chip`,
                            children: `원문 단위: 천 원 → 백만 원 자동변환`
                        }) ]
                    }), (0, W.jsxs)(`label`, {
                        className: `latest-year-field`,
                        children: [ (0, W.jsx)(`span`, {
                            children: `매출구성 최종 기준년도`
                        }), (0, W.jsx)(`input`, {
                            type: `number`,
                            value: j,
                            onChange: e => {
                                let t = Number(e.target.value) || 2025;
                                M(t);
                                let n = [ ...r ].sort((e, t) => e.year - t.year);
                                i(n.map((e, r) => ({
                                    ...e,
                                    year: t - n.length + 1 + r
                                })));
                            }
                        }) ]
                    }) ]
                }), (0, W.jsx)(`p`, {
                    className: `card-help`,
                    children: `손익계산서의 전체·제품·공사·기타·임대·도소매 매출액 행만 복사해 붙여넣으세요. 연도가 없으면 최우측 수치를 선택한 최종 기준년도로 보고 왼쪽으로 1년씩 자동 배정합니다. ‘매출액(수익)(*)’처럼 뒤에 붙은 표시는 무시하며, ‘공사수입(*)’은 공사 매출액으로 인식합니다. 국내공사·해외공사는 공사수입의 하위 내역이므로 중복 반영하지 않습니다. 새 원문에 없는 매출항목은 기존 값을 승계하지 않고 0으로 초기화합니다.`
                }), (0, W.jsx)(`textarea`, {
                    rows: 7,
                    "aria-label": `사업화주체 매출구성 붙여넣기`,
                    value: k,
                    onChange: e => A(e.target.value),
                    onPaste: e => {
                        let t = e.clipboardData.getData(`text`);
                        t.trim() && (e.preventDefault(), Ce(t));
                    },
                    placeholder: `매출액(수익)(*)\t58,902,573\t50,849,944\t33,289,190\n공사수입(*)\t54,722,720\t48,505,081\t30,718,833\n기타매출액\t4,179,847\t2,344,863\t2,570,365`
                }), (0, W.jsxs)(`div`, {
                    className: `paste-actions`,
                    children: [ (0, W.jsx)(`span`, {
                        children: k.trim() ? `매출구성 인식 완료 · 백만 원 변환 적용` : `입력창을 클릭한 뒤 Ctrl+V로 붙여넣으세요`
                    }), (0, W.jsxs)(`button`, {
                        type: `button`,
                        disabled: !k.trim(),
                        onClick: () => Ce(),
                        children: [ (0, W.jsx)(ee, {
                            size: 15
                        }), ` 인식·적용` ]
                    }) ]
                }) ]
            }), (0, W.jsxs)(`article`, {
                className: `stage-card span-2 related-sales-card`,
                children: [ (0, W.jsxs)(`div`, {
                    className: `card-title`,
                    children: [ (0, W.jsxs)(`div`, {
                        children: [ (0, W.jsx)(`span`, {
                            className: `eyebrow`,
                            children: `PM·평가자 확정`
                        }), (0, W.jsx)(`h2`, {
                            children: `사업화제품 연관매출액 비중`
                        }) ]
                    }), (0, W.jsxs)(`label`, {
                        className: `comparison-period inline-period`,
                        children: [ (0, W.jsx)(`span`, {
                            children: `표시기간`
                        }), (0, W.jsxs)(`select`, {
                            value: N,
                            disabled: salesAvailableYears === 0,
                            onChange: e => P(Number(e.target.value)),
                            children: [ 1, 2, 3, 4, 5 ].map(e => (0, W.jsxs)(`option`, {
                                value: e,
                                disabled: e > salesAvailableYears,
                                children: [ `최근 `, e, `개년`, e > salesAvailableYears ? ` — 자료 부족` : `` ]
                            }, e))
                        }) ]
                    }) ]
                }), (0, W.jsx)(`div`, {
                    className: `related-sales-unit`,
                    children: `단위: 백만 원`
                }), (0, W.jsx)(R_, {
                    rows: r,
                    years: N,
                    selected: o.selected,
                    onToggle: e => {
                        let t = o.selected, n = e === `totalRevenue` ? [ `totalRevenue` ] : t.includes(e) ? t.filter(t => t !== e) : [ ...t.filter(e => e !== `totalRevenue`), e ];
                        s({
                            ...o,
                            selected: n.length ? n : [ `productRevenue` ]
                        });
                    },
                    onChange: i
                }), (0, W.jsxs)(`div`, {
                    className: `related-sales-footer`,
                    children: [ (0, W.jsxs)(`label`, {
                        children: [ (0, W.jsx)(`span`, {
                            children: `평가대상특허 매출액 비중`
                        }), (0, W.jsx)(B_, {
                            value: o.patentShareWithinRelated,
                            onChange: e => s({
                                ...o,
                                patentShareWithinRelated: Math.min(100, Math.max(0, e))
                            })
                        }) ]
                    }), (0, W.jsxs)(`label`, {
                        children: [ (0, W.jsx)(`span`, {
                            children: `사업화제품 매출액 최초 발생년도`
                        }), (0, W.jsxs)(`span`, {
                            className: `year-cell`,
                            children: [ (0, W.jsx)(`input`, {
                                type: `number`,
                                min: `1900`,
                                max: `2100`,
                                value: o.commercializationFirstRevenueYear,
                                onChange: e => s({
                                    ...o,
                                    commercializationFirstRevenueYear: Number(e.target.value) || 0
                                })
                            }), `년` ]
                        }) ]
                    }), (0, W.jsxs)(`div`, {
                        className: `related-sales-result`,
                        children: [ (0, W.jsxs)(`span`, {
                            children: [ `최신연도 연관매출 비중 `, (0, W.jsxs)(`b`, {
                                children: [ ye.toFixed(2), `%` ]
                            }) ]
                        }), (0, W.jsxs)(`strong`, {
                            children: [ `최종 평가대상특허 매출액 비중 `, be.toFixed(2), `%` ]
                        }) ]
                    }) ]
                }), (0, W.jsx)(`p`, {
                    className: `card-help`,
                    children: `체크박스는 표 안에서 선택합니다. 전체 매출액은 단독 기준이며, 세부 매출액은 복수 선택할 수 있습니다.`
                }) ]
            }), (0, W.jsxs)(`article`, {
                className: `stage-card span-2 profitability-card`,
                children: [ (0, W.jsxs)(`div`, {
                    className: `card-title`,
                    children: [ (0, W.jsxs)(`div`, {
                        children: [ (0, W.jsx)(`span`, {
                            className: `eyebrow`,
                            children: `사업화주체·동업종 수익구조`
                        }), (0, W.jsx)(`h2`, {
                            children: `선택기간 평균 수익구조 비교`
                        }) ]
                    }), (0, W.jsxs)(`label`, {
                        className: `comparison-period`,
                        children: [ (0, W.jsx)(`span`, {
                            children: `평균 기준기간`
                        }), (0, W.jsx)(`select`, {
                            value: T,
                            disabled: availableComparisonYears === 0,
                            onChange: e => E(Number(e.target.value)),
                            children: [ 1, 2, 3, 4, 5 ].map(e => (0, W.jsxs)(`option`, {
                                value: e,
                                disabled: e > availableComparisonYears,
                                children: [ `최근 `, e, `개년`, e > availableComparisonYears ? ` — 유효자료 부족` : `` ]
                            }, e))
                        }) ]
                    }) ]
                }), (0, W.jsx)(U_, {
                    metrics: pe,
                    years: appliedComparisonYears
                }), (0, W.jsxs)(`div`, {
                    className: `suggested-rating confirmed-rating`,
                    children: [ (0, W.jsxs)(`div`, {
                        children: [ (0, W.jsx)(`span`, {
                            children: `수익성 평점`
                        }), (0, W.jsx)(`small`, {
                            children: `통계 확인 후 평가자 확정 · 가치산정 자동연계`
                        }) ]
                    }), (0, W.jsx)(`input`, {
                        "aria-label": `수익성 평점`,
                        type: `number`,
                        min: `1`,
                        max: `5`,
                        value: f,
                        onChange: e => {
                            let t = Math.min(5, Math.max(1, Number(e.target.value) || 1));
                            p(t), h(`수익성 평점을 ${t}점으로 확정하여 가치산정에 연결했습니다.`);
                        }
                    }), (0, W.jsxs)(`strong`, {
                        children: [ f, `점` ]
                    }) ]
                }), (0, W.jsx)(`p`, {
                    className: `card-help`,
                    children: availableComparisonYears ? `사업화주체와 동업종의 최신 유효자료를 각각 같은 개수로 비교합니다. 현재 사업화주체 ${selectedCompanyYears.slice().reverse().join(`·`)}년 · 동업종 ${selectedIndustryYears.slice().reverse().join(`·`)}년을 적용합니다. 음수 영업이익률은 0% 축 아래에 표시합니다.` : `사업화주체 또는 동업종의 유효자료가 없어 수익구조 비교를 비활성화했습니다.`
                }) ]
            }), (0, W.jsxs)(`article`, {
                className: `stage-card span-2 ratio-compare-card`,
                children: [ (0, W.jsxs)(`div`, {
                    className: `card-title`,
                    children: [ (0, W.jsxs)(`div`, {
                        children: [ (0, W.jsx)(`span`, {
                            className: `eyebrow`,
                            children: `크레탑 동사 재무비율`
                        }), (0, W.jsx)(`h2`, {
                            children: `사업화주체 원가율·판관비율`
                        }) ]
                    }), (0, W.jsx)(`span`, {
                        className: `source-chip`,
                        children: `자동인식 후 개별 수정 가능`
                    }) ]
                }), (0, W.jsxs)(`div`, {
                    className: `ratio-paste-settings`,
                    children: [ (0, W.jsxs)(`label`, {
                        className: `ratio-latest-date-field`,
                        children: [ (0, W.jsx)(`span`, {
                            children: `최종 결산일`
                        }), (0, W.jsx)(`input`, {
                            type: `date`,
                            value: L,
                            onChange: e => {
                                let t = e.target.value;
                                te(t);
                                let n = j_(t, R.length);
                                z(e => e.map((e, t) => ({
                                    ...e,
                                    date: n[t]
                                })));
                            }
                        }) ]
                    }), (0, W.jsx)(`small`, {
                        children: `연도 없이 붙여넣으면 최우측 수치를 최종 결산일로 보고 왼쪽으로 1년씩 배정합니다.`
                    }) ]
                }), (0, W.jsx)(z_, {
                    label: `사업화주체 원가율·판관비율 붙여넣기`,
                    value: F,
                    onChange: I,
                    onApply: (e = F) => {
                        I(e);
                        let t = e.split(/\r?\n/).map(e => e.split(`\t`).map(e => e.trim())).filter(e => e.some(Boolean)), n = (t.find(e => e.filter(e => A_(e) || /20\d{2}/.test(e)).length >= 2) ?? []).map(e => A_(e) || (e.match(/20\d{2}/)?.[0] ? `${e.match(/20\d{2}/)?.[0]}-12-31` : ``)).filter(Boolean).slice(-5), r = e => (e ?? []).filter(e => /[-+]?\d/.test(e) && !/20\d{2}/.test(e)).map(O_).slice(-5), i = e => {
                            let n = t.findIndex(t => t.some(t => e.test(k_(t))));
                            if (n < 0) return [];
                            let i = r(t[n]);
                            if (i.length) return i;
                            for (let e = n + 1; e < Math.min(t.length, n + 3); e += 1) {
                                let n = r(t[e]);
                                if (n.length) return n;
                            }
                            return [];
                        }, a = i(/매출원가율|원가비율/), o = i(/판관비율|판매비와관리비율/), s = [];
                        if (a.length || o.length) {
                            let e = Math.max(a.length, o.length), t = n.length >= e ? n.slice(-e) : j_(L, e);
                            s = t.map((e, n) => ({
                                date: e,
                                cost: a[n - (t.length - a.length)] ?? 0,
                                sga: o[n - (t.length - o.length)] ?? 0
                            }));
                        }
                        if (s.length || (s = t.map(e => {
                            let t = e.map(A_).find(Boolean), n = e.filter(e => /[-+]?\d/.test(e) && !A_(e)).map(O_);
                            return t && n.length >= 2 ? {
                                date: t,
                                cost: n.at(-2) ?? 0,
                                sga: n.at(-1) ?? 0
                            } : null;
                        }).filter(e => !!e)), !s.length) {
                            h(`원가율·판관비율을 인식하지 못했습니다. 원가비율과 판관비율 행을 붙여넣거나 아래 표에 직접 입력해 주세요.`);
                            return;
                        }
                        z(s.sort((e, t) => e.date.localeCompare(t.date)).slice(-5)), h(`사업화주체 비율을 자동 인식하고 최우측 열을 ${s.at(-1)?.date ?? L} 결산으로 배정했습니다.`);
                    },
                    placeholder: `매출원가율\t82.35\t92.97\t108.14\n판관비율\t7.70\t8.22\t12.06`
                }), (0, W.jsx)(`div`, {
                    className: `horizontal-table-wrap`,
                    children: (0, W.jsxs)(`table`, {
                        className: `horizontal-input-table`,
                        children: [ (0, W.jsx)(`thead`, {
                            children: (0, W.jsxs)(`tr`, {
                                children: [ (0, W.jsx)(`th`, {
                                    children: `계정명`
                                }), R.map((e, t) => (0, W.jsx)(`th`, {
                                    children: (0, W.jsx)(`input`, {
                                        type: `date`,
                                        value: e.date,
                                        onChange: e => z(n => n.map((n, r) => r === t ? {
                                            ...n,
                                            date: e.target.value
                                        } : n))
                                    })
                                }, t)) ]
                            })
                        }), (0, W.jsxs)(`tbody`, {
                            children: [ (0, W.jsxs)(`tr`, {
                                children: [ (0, W.jsx)(`th`, {
                                    children: `매출원가율`
                                }), R.map((e, t) => (0, W.jsx)(`td`, {
                                    children: (0, W.jsx)(B_, {
                                        value: e.cost,
                                        onChange: e => z(n => n.map((n, r) => r === t ? {
                                            ...n,
                                            cost: e
                                        } : n))
                                    })
                                }, t)) ]
                            }), (0, W.jsxs)(`tr`, {
                                children: [ (0, W.jsx)(`th`, {
                                    children: `판관비율`
                                }), R.map((e, t) => (0, W.jsx)(`td`, {
                                    children: (0, W.jsx)(B_, {
                                        value: e.sga,
                                        onChange: e => z(n => n.map((n, r) => r === t ? {
                                            ...n,
                                            sga: e
                                        } : n))
                                    })
                                }, t)) ]
                            }) ]
                        }) ]
                    })
                }), (0, W.jsx)(`p`, {
                    className: `card-help`,
                    children: `자동인식이 일부 누락되면 날짜와 비율 셀을 직접 수정할 수 있습니다. 최근 결산일은 가장 우측에 배치합니다.`
                }) ]
            }), (0, W.jsxs)(`article`, {
                className: `stage-card span-2 competitor-card`,
                children: [ (0, W.jsxs)(`div`, {
                    className: `card-title`,
                    children: [ (0, W.jsxs)(`div`, {
                        children: [ (0, W.jsx)(`span`, {
                            className: `eyebrow`,
                            children: `사업성·제품경쟁력 · PM 직접입력`
                        }), (0, W.jsx)(`h2`, {
                            children: `가격경쟁력 비교용 재무입력`
                        }) ]
                    }), (0, W.jsxs)(`div`, {
                        className: `competitor-card-controls`,
                        children: [ (0, W.jsxs)(`label`, {
                            className: `latest-year-field competitor-latest-year-field`,
                            children: [ (0, W.jsx)(`span`, {
                                children: `최종 기준년도`
                            }), (0, W.jsx)(`input`, {
                                type: `number`,
                                min: `1902`,
                                max: `9999`,
                                value: competitionLatestYear,
                                onChange: e => setCompetitionLatestYear(Number(e.target.value) || 2025)
                            }) ]
                        }), (0, W.jsx)(`span`, {
                            className: `source-chip`,
                            children: `PDF 업로드 또는 직접입력`
                        }) ]
                    }) ]
                }), (0, W.jsx)(`div`, {
                    className: `competitor-import-grid`,
                    children: competitionRows.slice(1).map((e, t) => (0, W.jsxs)(`div`, {
                        className: `competitor-import-item`,
                        children: [ (0, W.jsxs)(`div`, {
                            children: [ (0, W.jsx)(`strong`, {
                                children: e.name
                            }), (0, W.jsx)(`small`, {
                                children: e.source || `직접입력`
                            }) ]
                        }), (0, W.jsxs)(`label`, {
                            className: `competitor-pdf-button`,
                            children: [ `크레탑 PDF 업로드`, (0, W.jsx)(`input`, {
                                type: `file`,
                                accept: `.pdf,application/pdf`,
                                "aria-label": `${e.name} 크레탑 기업종합보고서 PDF 업로드`,
                                onChange: async e => {
                                    let n = e.target.files?.[0];
                                    e.target.value = ``;
                                    await importCompetitorPdf(t + 1, n);
                                }
                            }) ]
                        }) ]
                    }, `${e.name}-${t}`))
                }), (0, W.jsx)(`div`, {
                    className: `competitor-table-wrap`,
                    children: (0, W.jsxs)(`table`, {
                        className: `competitor-horizontal-table`,
                        children: [ (0, W.jsx)(`thead`, {
                            children: (0, W.jsxs)(`tr`, {
                                children: [ (0, W.jsx)(`th`, {
                                    children: `기업`
                                }), (0, W.jsx)(`th`, {
                                    children: `입력근거`
                                }), (0, W.jsx)(`th`, {
                                    children: `구분`
                                }), B.map((e, t) => (0, W.jsx)(`th`, {
                                    children: `${e}년`
                                }, t)), (0, W.jsx)(`th`, {
                                    children: `최근 3개년 평균`
                                }) ]
                            })
                        }), (0, W.jsx)(`tbody`, {
                            children: competitionRows.flatMap((e, t) => [ `cost`, `sga` ].map((n, r) => (0, W.jsxs)(`tr`, {
                                children: [ r === 0 && (0, W.jsx)(`th`, {
                                    rowSpan: 2,
                                    className: `competitor-name-cell`,
                                    children: (0, W.jsx)(`input`, {
                                        value: e.name,
                                        readOnly: t === 0,
                                        "aria-label": `${t + 1}번째 기업명`,
                                        onChange: e => H(n => n.map((n, r) => r === t ? {
                                            ...n,
                                            name: e.target.value
                                        } : n))
                                    })
                                }), r === 0 && (0, W.jsx)(`td`, {
                                    rowSpan: 2,
                                    className: `competitor-source-cell`,
                                    children: e.source || `직접입력`
                                }), (0, W.jsx)(`th`, {
                                    children: n === `cost` ? `원가비율` : `판관비율`
                                }), e[n].map((e, r) => (0, W.jsx)(`td`, {
                                    children: t === 0 ? (0, W.jsxs)(`strong`, {
                                        children: [ Number(e || 0).toFixed(2), `%` ]
                                    }) : (0, W.jsx)(B_, {
                                        value: e,
                                        onChange: e => H(i => i.map((i, a) => a === t ? {
                                            ...i,
                                            source: `직접입력`,
                                            [n]: i[n].map((t, n) => n === r ? e : t)
                                        } : i))
                                    })
                                }, r)), (0, W.jsx)(`td`, {
                                    children: (0, W.jsxs)(`strong`, {
                                        children: [ M_(e[n]).toFixed(2), `%` ]
                                    })
                                }) ]
                            }, `${t}-${n}`)))
                        }) ]
                    })
                }), (0, W.jsx)(`p`, {
                    className: `card-help`,
                    children: `사업화주체는 위 비율표와 자동 연계됩니다. 경쟁기업은 크레탑 기업종합보고서 PDF에서 최근 비율을 인식하거나 표에서 직접 입력할 수 있으며, 평균은 입력 즉시 자동 계산됩니다.`
                }) ]
            }), (0, W.jsxs)(`article`, {
                className: `stage-card span-2 market-card`,
                children: [ (0, W.jsxs)(`div`, {
                    className: `card-title`,
                    children: [ (0, W.jsxs)(`div`, {
                        children: [ (0, W.jsx)(`span`, {
                            className: `eyebrow`,
                            children: `목표시장 성장률`
                        }), (0, W.jsx)(`h2`, {
                            children: `국내·해외시장 기준값`
                        }) ]
                    }), (0, W.jsx)(`span`, {
                        className: `source-chip`,
                        children: `과거·기준·향후 / 성장률 직접입력`
                    }) ]
                }), (0, W.jsxs)(`div`, {
                    className: `market-layout`,
                    children: [ (0, W.jsxs)(`div`, {
                        className: `market-inputs`,
                        children: [ (0, W.jsx)(V_, {
                            title: `국내시장`,
                            value: c,
                            growth: oe,
                            onChange: u
                        }), (0, W.jsx)(V_, {
                            title: `해외시장`,
                            value: l,
                            growth: se,
                            onChange: d
                        }) ]
                    }), (0, W.jsxs)(`div`, {
                        className: `market-chart-stack`,
                        children: [ (0, W.jsx)(H_, {
                            title: `국내시장`,
                            unit: c.unit,
                            points: ce,
                            growth: oe,
                            tone: `domestic`
                        }), (0, W.jsx)(H_, {
                            title: `해외시장`,
                            unit: l.unit,
                            points: le,
                            growth: se,
                            tone: `world`
                        }) ]
                    }) ]
                }) ]
            }), (0, W.jsxs)(`article`, {
                className: `stage-card span-2 info-banner`,
                children: [ (0, W.jsx)(re, {
                    size: 20
                }), (0, W.jsxs)(`div`, {
                    children: [ (0, W.jsx)(`strong`, {
                        children: `기관별 변수데이터 선택은 가치산정에서 관리합니다.`
                    }), (0, W.jsx)(`p`, {
                        children: `경제적 수명(TCT), 로열티율, 할인율은 서로 다른 기관 자료를 적용할 수 있으므로 각 가치산정 탭에서 선택하며 기본값은 KISTI 기준입니다.`
                    }) ]
                }) ]
            }) ]
        }) ]
    });
}

function I_({rows: e}) {
    let t = e.length ? [ `totalAssets`, `paidInCapital`, `totalEquity`, `revenue`, `operatingProfit`, `netIncome` ].map(t => e.reduce((e, n) => e + n[t], 0) / e.length) : [];
    return (0, W.jsx)(`div`, {
        className: `company-financial-table-wrap`,
        children: (0, W.jsxs)(`table`, {
            children: [ (0, W.jsx)(`thead`, {
                children: (0, W.jsxs)(`tr`, {
                    children: [ (0, W.jsx)(`th`, {
                        children: `결산일자`
                    }), (0, W.jsx)(`th`, {
                        children: `총자산`
                    }), (0, W.jsx)(`th`, {
                        children: `납입자본금`
                    }), (0, W.jsx)(`th`, {
                        children: `자본총계`
                    }), (0, W.jsx)(`th`, {
                        children: `매출액`
                    }), (0, W.jsx)(`th`, {
                        children: `영업이익`
                    }), (0, W.jsx)(`th`, {
                        children: `순이익`
                    }), (0, W.jsx)(`th`, {
                        children: `자기자본비중`
                    }), (0, W.jsx)(`th`, {
                        children: `영업이익률`
                    }) ]
                })
            }), (0, W.jsxs)(`tbody`, {
                children: [ e.map(e => (0, W.jsxs)(`tr`, {
                    children: [ (0, W.jsx)(`td`, {
                        children: e.closingDate
                    }), (0, W.jsx)(`td`, {
                        children: e.totalAssets.toLocaleString()
                    }), (0, W.jsx)(`td`, {
                        children: e.paidInCapital.toLocaleString()
                    }), (0, W.jsx)(`td`, {
                        children: e.totalEquity.toLocaleString()
                    }), (0, W.jsx)(`td`, {
                        children: e.revenue.toLocaleString()
                    }), (0, W.jsx)(`td`, {
                        children: e.operatingProfit.toLocaleString()
                    }), (0, W.jsx)(`td`, {
                        children: e.netIncome.toLocaleString()
                    }), (0, W.jsxs)(`td`, {
                        children: [ im(e).toFixed(2), `%` ]
                    }), (0, W.jsxs)(`td`, {
                        children: [ am(e).toFixed(2), `%` ]
                    }) ]
                }, e.closingDate)), t.length > 0 && (0, W.jsxs)(`tr`, {
                    className: `average-row`,
                    children: [ (0, W.jsx)(`th`, {
                        children: `평균`
                    }), t.map((e, t) => (0, W.jsx)(`td`, {
                        children: e.toLocaleString(void 0, {
                            maximumFractionDigits: 1
                        })
                    }, t)), (0, W.jsx)(`td`, {
                        children: `—`
                    }), (0, W.jsx)(`td`, {
                        children: `—`
                    }) ]
                }) ]
            }) ]
        })
    });
}

function L_({title: e, rows: t, tone: n = `company`}) {
    let r = [ ...t ].sort((e, t) => String(e.year).localeCompare(String(t.year))).slice(-5), i = Math.max(...r.map(e => e.revenue), 1), a = r.map((e, t) => `${(t + .5) / Math.max(r.length, 1) * 100},${100 - Math.max(8, e.revenue / i * 100)}`).join(` `), o = n === `company` ? Yp(r.map(e => ({
        closingDate: `${e.year}-12-31`,
        totalAssets: 0,
        paidInCapital: 0,
        totalEquity: 0,
        revenue: e.revenue,
        operatingProfit: 0,
        netIncome: 0
    })), 5) ?? 0 : r.length > 1 && r[0].revenue > 0 ? ((r.at(-1).revenue / r[0].revenue) ** (1 / (r.length - 1)) - 1) * 100 : 0;
    return (0, W.jsxs)(`section`, {
        className: `benchmark-revenue-panel ${n === `industry` ? `industry` : ``}`,
        children: [ (0, W.jsxs)(`div`, {
            className: `benchmark-revenue-panel-head`,
            children: [ (0, W.jsxs)(`div`, {
                children: [ (0, W.jsx)(`span`, {
                    children: `최근 연도별 매출 흐름`
                }), (0, W.jsx)(`strong`, {
                    children: e
                }) ]
            }), (0, W.jsxs)(`b`, {
                children: [ `CAGR `, o.toFixed(2), `%` ]
            }) ]
        }), (0, W.jsxs)(`div`, {
            className: `recent-revenue-chart benchmark-revenue-chart`,
            style: {
                gridTemplateColumns: `repeat(${Math.max(r.length, 1)}, minmax(34px, 1fr))`
            },
            children: [ (0, W.jsx)(`span`, {
                className: `recent-revenue-unit`,
                children: `단위: 백만원`
            }), (0, W.jsx)(`svg`, {
                viewBox: `0 0 100 100`,
                preserveAspectRatio: `none`,
                "aria-hidden": `true`,
                children: (0, W.jsx)(`polyline`, {
                    points: a
                })
            }), (0, W.jsx)(`div`, {
                className: `recent-revenue-dots`,
                "aria-hidden": `true`,
                children: r.map((e, t) => (0, W.jsx)(`i`, {
                    style: {
                        left: `${(t + .5) / r.length * 100}%`,
                        top: `${100 - Math.max(8, e.revenue / i * 100)}%`
                    }
                }, e.year))
            }), r.map(e => (0, W.jsxs)(`div`, {
                children: [ (0, W.jsx)(`span`, {
                    children: (0, W.jsx)(`em`, {
                        style: {
                            height: `${Math.max(8, e.revenue / i * 100)}%`
                        },
                        children: (0, W.jsx)(`b`, {
                            children: e.revenue.toLocaleString(void 0, {
                                maximumFractionDigits: 2
                            })
                        })
                    })
                }), (0, W.jsx)(`small`, {
                    children: e.year
                }) ]
            }, e.year)) ]
        }) ]
    });
}

function R_({rows: e, years: t, selected: n, onToggle: r, onChange: i}) {
    let a = [ ...e ].sort((e, t) => e.year - t.year).slice(-t), o = (t, n, r) => i(e.map(e => e.year === t ? {
        ...e,
        [n]: r
    } : e));
    return (0, W.jsx)(`div`, {
        className: `related-sales-table-wrap`,
        children: (0, W.jsxs)(`table`, {
            className: `related-sales-table`,
            children: [ (0, W.jsx)(`thead`, {
                children: (0, W.jsxs)(`tr`, {
                    children: [ (0, W.jsx)(`th`, {
                        children: `선택`
                    }), (0, W.jsx)(`th`, {
                        children: `구분`
                    }), a.map(e => (0, W.jsxs)(`th`, {
                        children: [ e.year, `년` ]
                    }, e.year)) ]
                })
            }), (0, W.jsx)(`tbody`, {
                children: Jp.map(e => (0, W.jsxs)(`tr`, {
                    className: n.includes(e.key) ? `selected-row` : ``,
                    children: [ (0, W.jsx)(`td`, {
                        children: (0, W.jsx)(`input`, {
                            "aria-label": `${e.label} 선택`,
                            type: `checkbox`,
                            checked: n.includes(e.key),
                            onChange: () => r(e.key)
                        })
                    }), (0, W.jsx)(`th`, {
                        children: e.label
                    }), a.map(t => (0, W.jsx)(`td`, {
                        children: (0, W.jsx)(`input`, {
                            "aria-label": `${t.year}년 ${e.label}`,
                            type: `number`,
                            value: t[e.key],
                            onChange: n => o(t.year, e.key, Number(n.target.value) || 0)
                        })
                    }, t.year)) ]
                }, e.key))
            }) ]
        })
    });
}

function z_({label: e, value: t, onChange: n, onApply: r, placeholder: i}) {
    return (0, W.jsxs)(`div`, {
        className: `ratio-paste-box`,
        children: [ (0, W.jsx)(`textarea`, {
            rows: 5,
            "aria-label": e,
            value: t,
            onChange: e => n(e.target.value),
            onPaste: e => {
                let t = e.clipboardData.getData(`text`);
                t.trim() && (e.preventDefault(), n(t), r(t));
            },
            placeholder: i
        }), (0, W.jsxs)(`div`, {
            className: `paste-actions`,
            children: [ (0, W.jsx)(`span`, {
                children: t.trim() ? `인식 결과를 아래 표에서 확인·수정하세요` : `크레탑 표를 붙여넣으면 즉시 자동 인식합니다`
            }), (0, W.jsxs)(`button`, {
                type: `button`,
                disabled: !t.trim(),
                onClick: () => r(),
                children: [ (0, W.jsx)(ee, {
                    size: 15
                }), ` 다시 인식` ]
            }) ]
        }) ]
    });
}

function B_({value: e, onChange: t}) {
    return (0, W.jsxs)(`span`, {
        className: `percent-cell`,
        children: [ (0, W.jsx)(`input`, {
            type: `number`,
            step: `0.01`,
            value: e,
            onChange: e => t(Number(e.target.value) || 0)
        }), (0, W.jsx)(`b`, {
            children: `%`
        }) ]
    });
}

function V_({title: e, value: t, growth: n, onChange: r}) {
    let i = (e, n) => r({
        ...t,
        [e]: n
    });
    return (0, W.jsxs)(`div`, {
        className: `market-input-card expanded horizontal-market-card`,
        children: [ (0, W.jsxs)(`div`, {
            children: [ (0, W.jsx)(`strong`, {
                children: e
            }), (0, W.jsxs)(`span`, {
                children: [ `CAGR `, n ? `${n.toFixed(2)}%` : `산출 전` ]
            }) ]
        }), (0, W.jsxs)(`div`, {
            className: `market-meta`,
            children: [ (0, W.jsxs)(`label`, {
                children: [ (0, W.jsx)(`span`, {
                    children: `목표시장명`
                }), (0, W.jsx)(`input`, {
                    value: t.name,
                    onChange: e => i(`name`, e.target.value)
                }) ]
            }), (0, W.jsxs)(`label`, {
                children: [ (0, W.jsx)(`span`, {
                    children: `단위`
                }), (0, W.jsx)(`input`, {
                    value: t.unit,
                    onChange: e => i(`unit`, e.target.value)
                }) ]
            }), (0, W.jsxs)(`label`, {
                children: [ (0, W.jsx)(`span`, {
                    children: `입력방식`
                }), (0, W.jsxs)(`select`, {
                    value: t.mode,
                    onChange: e => i(`mode`, e.target.value),
                    children: [ (0, W.jsx)(`option`, {
                        value: `three`,
                        children: `과거·기준·향후`
                    }), (0, W.jsx)(`option`, {
                        value: `two`,
                        children: `기준·향후`
                    }), (0, W.jsx)(`option`, {
                        value: `growth`,
                        children: `성장률만 입력`
                    }) ]
                }) ]
            }) ]
        }), t.mode === `growth` ? (0, W.jsxs)(`label`, {
            className: `direct-growth-field`,
            children: [ (0, W.jsx)(`span`, {
                children: `성장률`
            }), (0, W.jsx)(B_, {
                value: t.directGrowth,
                onChange: e => i(`directGrowth`, e)
            }) ]
        }) : (0, W.jsx)(`div`, {
            className: `horizontal-table-wrap`,
            children: (0, W.jsxs)(`table`, {
                className: `market-period-table`,
                children: [ (0, W.jsx)(`thead`, {
                    children: (0, W.jsxs)(`tr`, {
                        children: [ (0, W.jsx)(`th`, {
                            children: `구분`
                        }), t.mode === `three` && (0, W.jsx)(`th`, {
                            children: `과거`
                        }), (0, W.jsx)(`th`, {
                            children: `기준`
                        }), (0, W.jsx)(`th`, {
                            children: `향후`
                        }) ]
                    })
                }), (0, W.jsxs)(`tbody`, {
                    children: [ (0, W.jsxs)(`tr`, {
                        children: [ (0, W.jsx)(`th`, {
                            children: `연도`
                        }), t.mode === `three` && (0, W.jsx)(`td`, {
                            children: (0, W.jsx)(`input`, {
                                type: `number`,
                                value: t.pastYear,
                                onChange: e => i(`pastYear`, Number(e.target.value))
                            })
                        }), (0, W.jsx)(`td`, {
                            children: (0, W.jsx)(`input`, {
                                type: `number`,
                                value: t.baseYear,
                                onChange: e => i(`baseYear`, Number(e.target.value))
                            })
                        }), (0, W.jsx)(`td`, {
                            children: (0, W.jsx)(`input`, {
                                type: `number`,
                                value: t.futureYear,
                                onChange: e => i(`futureYear`, Number(e.target.value))
                            })
                        }) ]
                    }), (0, W.jsxs)(`tr`, {
                        children: [ (0, W.jsx)(`th`, {
                            children: `시장규모`
                        }), t.mode === `three` && (0, W.jsx)(`td`, {
                            children: (0, W.jsx)(`input`, {
                                type: `number`,
                                value: t.pastValue,
                                onChange: e => i(`pastValue`, Number(e.target.value))
                            })
                        }), (0, W.jsx)(`td`, {
                            children: (0, W.jsx)(`input`, {
                                type: `number`,
                                value: t.baseValue,
                                onChange: e => i(`baseValue`, Number(e.target.value))
                            })
                        }), (0, W.jsx)(`td`, {
                            children: (0, W.jsx)(`input`, {
                                type: `number`,
                                value: t.futureValue,
                                onChange: e => i(`futureValue`, Number(e.target.value))
                            })
                        }) ]
                    }) ]
                }) ]
            })
        }), (0, W.jsxs)(`label`, {
            className: `market-source-input`,
            children: [ (0, W.jsx)(`span`, {
                children: `자료출처`
            }), (0, W.jsx)(`input`, {
                value: t.source,
                onChange: e => i(`source`, e.target.value)
            }) ]
        }) ]
    });
}

function H_({title: e, unit: t, points: n, growth: r, tone: i}) {
    let a = Math.max(...n.map(e => e.value), 1);
    return (0, W.jsxs)(`section`, {
        className: `separated-market-chart`,
        children: [ (0, W.jsxs)(`div`, {
            className: `market-chart-head`,
            children: [ (0, W.jsxs)(`div`, {
                children: [ (0, W.jsx)(`strong`, {
                    children: e
                }), (0, W.jsxs)(`small`, {
                    children: [ `단위: `, t || `미입력` ]
                }) ]
            }), (0, W.jsxs)(`span`, {
                children: [ `CAGR `, r ? `${r.toFixed(2)}%` : `산출 전` ]
            }) ]
        }), (0, W.jsx)(`div`, {
            className: `market-chart`,
            "aria-label": `${e} 규모 그래프`,
            children: n.length ? n.map((e, t) => (0, W.jsxs)(`div`, {
                children: [ (0, W.jsx)(`span`, {
                    className: i,
                    style: {
                        height: `${Math.max(e.value ? 12 : 2, e.value / a * 100)}%`
                    }
                }), (0, W.jsx)(`strong`, {
                    children: e.value.toLocaleString()
                }), (0, W.jsx)(`small`, {
                    children: e.year
                }) ]
            }, `${e.kind}-${e.year}-${t}`)) : (0, W.jsxs)(`div`, {
                className: `growth-only-chart`,
                children: [ (0, W.jsx)(pe, {
                    size: 20
                }), (0, W.jsx)(`strong`, {
                    children: `성장률 직접입력`
                }), (0, W.jsxs)(`small`, {
                    children: [ r.toFixed(2), `%` ]
                }) ]
            })
        }) ]
    });
}

function U_({metrics: e, years: t}) {
    let n = Math.max(10, ...e.flatMap(e => [ Math.abs(e.company), Math.abs(e.industry) ]));
    return (0, W.jsxs)(`div`, {
        className: `average-profitability`,
        children: [ (0, W.jsxs)(`div`, {
            className: `average-profit-chart`,
            "aria-label": `사업화주체와 동업종의 원가비율·판관비율·영업이익률 막대그래프`,
            children: [ (0, W.jsx)(`div`, {
                className: `average-zero-axis`,
                children: (0, W.jsx)(`span`, {
                    children: `0%`
                })
            }), (0, W.jsx)(`div`, {
                className: `average-profit-columns`,
                children: e.map(e => (0, W.jsxs)(`div`, {
                    className: `average-metric`,
                    children: [ (0, W.jsx)(`div`, {
                        className: `average-bar-area`,
                        children: [ [ `company`, e.company ], [ `industry`, e.industry ] ].map(([e, t]) => (0,
                        W.jsx)(`span`, {
                            className: `average-bar ${e} ${t < 0 ? `negative` : ``}`,
                            style: {
                                height: `${Math.max(2, Math.abs(t) / n * 44)}%`,
                                top: t >= 0 ? `${50 - Math.abs(t) / n * 44}%` : `50%`
                            },
                            children: (0, W.jsxs)(`b`, {
                                children: [ t.toFixed(2), `%` ]
                            })
                        }, e))
                    }), (0, W.jsx)(`strong`, {
                        children: e.label
                    }) ]
                }, e.label))
            }), (0, W.jsxs)(`div`, {
                className: `chart-legend average-chart-legend`,
                children: [ (0, W.jsxs)(`span`, {
                    children: [ (0, W.jsx)(`i`, {
                        className: `company`
                    }), `사업화주체` ]
                }), (0, W.jsxs)(`span`, {
                    children: [ (0, W.jsx)(`i`, {
                        className: `industry`
                    }), `동업종` ]
                }) ]
            }) ]
        }), (0, W.jsxs)(`table`, {
            className: `average-profit-table`,
            children: [ (0, W.jsx)(`thead`, {
                children: (0, W.jsxs)(`tr`, {
                    children: [ (0, W.jsx)(`th`, {
                        children: `구분`
                    }), (0, W.jsxs)(`th`, {
                        children: [ `최근 `, t, `개년 평균` ]
                    }) ]
                })
            }), (0, W.jsx)(`tbody`, {
                children: e.map(e => (0, W.jsxs)(`tr`, {
                    children: [ (0, W.jsx)(`th`, {
                        children: e.label
                    }), (0, W.jsxs)(`td`, {
                        children: [ `사업화주체 `, e.company.toFixed(2), `% · 동업종 `, e.industry.toFixed(2), `% · 차이 `, (e.company - e.industry).toFixed(2), `%p` ]
                    }) ]
                }, e.label))
            }) ]
        }) ]
    });
}

var W_ = e => String(e ?? ``).replaceAll(`&`, `&amp;`).replaceAll(`<`, `&lt;`).replaceAll(`>`, `&gt;`).replaceAll(`"`, `&quot;`);

function G_(e) {
    let t = e + 1, n = ``;
    for (;t; ) --t, n = String.fromCharCode(65 + t % 26) + n, t = Math.floor(t / 26);
    return n;
}

function K_(e) {
    let t = e.map((e, t) => `<row r="${t + 1}">${e.map((e, n) => {
        let r = `${G_(n)}${t + 1}`;
        return typeof e == `number` ? `<c r="${r}" s="${+(t === 0)}"><v>${e}</v></c>` : `<c r="${r}" t="inlineStr" s="${+(t === 0)}"><is><t xml:space="preserve">${W_(e)}</t></is></c>`;
    }).join(``)}</row>`).join(``);
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetViews><sheetView workbookViewId="0"><pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews><cols>${(e[0] ?? [ `` ]).map((e, t) => `<col min="${t + 1}" max="${t + 1}" width="${t === 0 ? 8 : t === 4 ? 34 : 18}" customWidth="1"/>`).join(``)}</cols><sheetData>${t}</sheetData><autoFilter ref="A1:${`${G_(Math.max(0, (e[0]?.length ?? 1) - 1))}${Math.max(1, e.length)}`}"/></worksheet>`;
}

function q_(e) {
    let t = {};
    return t[`[Content_Types].xml`] = Ph(`<?xml version="1.0" encoding="UTF-8"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>${e.map((e, t) => `<Override PartName="/xl/worksheets/sheet${t + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`).join(``)}</Types>`),
    t[`_rels/.rels`] = Ph(`<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>`),
    t[`xl/workbook.xml`] = Ph(`<?xml version="1.0" encoding="UTF-8"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets>${e.map((e, t) => `<sheet name="${W_(e.name)}" sheetId="${t + 1}" r:id="rId${t + 1}"/>`).join(``)}</sheets></workbook>`),
    t[`xl/_rels/workbook.xml.rels`] = Ph(`<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">${e.map((e, t) => `<Relationship Id="rId${t + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet${t + 1}.xml"/>`).join(``)}<Relationship Id="rId${e.length + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>`),
    t[`xl/styles.xml`] = Ph(`<?xml version="1.0" encoding="UTF-8"?><styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><fonts count="2"><font><name val="Malgun Gothic"/><sz val="10"/></font><font><b/><color rgb="FFFFFFFF"/><name val="Malgun Gothic"/><sz val="10"/></font></fonts><fills count="3"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill><fill><patternFill patternType="solid"><fgColor rgb="FF173D61"/><bgColor indexed="64"/></patternFill></fill></fills><borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="2"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/><xf numFmtId="0" fontId="1" fillId="2" borderId="0" xfId="0" applyFont="1" applyFill="1"><alignment horizontal="center" vertical="center"/></xf></cellXfs><cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles></styleSheet>`),
    e.forEach((e, n) => {
        t[`xl/worksheets/sheet${n + 1}.xml`] = Ph(K_(e.rows));
    }), new Blob([ Hh(t, {
        level: 6
    }) ], {
        type: `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`
    });
}

function J_(e, t, n) {
    let r = e.filter(e => e.state === `target` && e.reviewed), i = e.filter(e => e.state === `excluded`);
    return [ {
        name: `평가대상특허`,
        rows: [ [ `No.`, `판정`, `등록번호`, `출원번호`, `발명의 명칭`, `IPC`, `최종권리자`, `관련 사업화제품`, `대표 기술군`, `연관성`, `조건·특이사항` ], ...r.map((e, n) => [ n + 1, e.reviewed ? `평가대상특허` : `평가대상 후보특허`, e.registrationNo, e.applicationNo, e.title, e.ipc, e.owner, e.product || t, e.technology, e.relation, e.note ]) ]
    }, {
        name: `제외특허`,
        rows: [ [ `No.`, `제외구분`, `등록·출원번호`, `발명의 명칭`, `IPC`, `최종권리자`, `권리상태`, `기준 사업화제품`, `상이 사업화제품명`, `사업화제품 연관성`, `제외사유` ], ...i.map((e, r) => [ r + 1, n(e) ? `필수 제외` : `PM 추가 제외`, e.registrationNo === `-` ? e.applicationNo : e.registrationNo, e.title, e.ipc, e.owner, e.patentStatus, t || e.product, e.exclusionCategory === `사업화제품 상이` ? e.differentProduct : ``, e.relation, e.note ]) ]
    }, {
        name: `전체특허`,
        rows: [ [ `No.`, `판정`, `등록번호`, `출원번호`, `발명의 명칭`, `IPC`, `최종권리자`, `권리상태`, `관련 사업화제품`, `상이 사업화제품명`, `대표 기술군`, `연관성`, `특이사항·제외사유` ], ...e.map((e, n) => [ n + 1, e.state === `target` ? e.reviewed ? `평가대상특허` : `평가대상 후보특허` : e.state === `excluded` ? `제외대상` : e.state === `conditional` ? `예외 제외 가능` : `PM 확인 필요`, e.registrationNo, e.applicationNo, e.title, e.ipc, e.owner, e.patentStatus, e.product || t, e.differentProduct, e.technology, e.relation, e.note ]) ]
    } ];
}

function Y_(e) {
    let t = e.map(e => [ ...new Set(e.toUpperCase().match(/[A-HY]\d{2}[A-Z]/g) ?? []) ]), n = t.flat();
    if (t.length <= 1) return [ ...new Set(n) ];
    let r = n.reduce((e, t) => (e.set(t, (e.get(t) ?? 0) + 1), e), new Map), i = Math.max(...r.values());
    return [ ...r.entries() ].filter(([, e]) => i === 1 || e === i).map(([e]) => e);
}

var X_ = {
    status: [ `상태`, `권리상태` ],
    title: [ `발명의명칭`, `발명의명칭(국문)` ],
    titleEnglish: [ `발명의명칭(영문)`, `영문명칭` ],
    ipc: [ `IPC분류`, `IPC` ],
    cpc: [ `CPC분류`, `CPC` ],
    applicationNo: [ `출원번호` ],
    applicationDate: [ `출원일자`, `출원일` ],
    applicant: [ `출원인` ],
    owner: [ `최종권리자`, `권리자` ],
    citationCount: [ `피인용횟수`, `피인용 횟수` ],
    registrationNo: [ `등록번호` ],
    registrationDate: [ `등록일자`, `등록일` ],
    publicationNo: [ `공개번호` ],
    publicationDate: [ `공개일자`, `공개일` ],
    agent: [ `대리인` ],
    inventors: [ `발명자` ],
    abstract: [ `요약`, `초록` ]
};

function Z_(e) {
    return String(e ?? ``).replace(/^\uFEFF/, ``).replace(/\s+/g, ``).trim();
}

function Q_(e) {
    return String(e ?? ``).trim();
}

function $_(e) {
    return e.replace(/주식회사|㈜|\(주\)|株式会社/gi, ``).replace(/[\s·.,()]/g, ``).toLowerCase();
}

function ev(e) {
    return e.split(/[|;]/).map(e => e.trim()).filter(Boolean);
}

function tv(e, t) {
    let n = $_(e), r = $_(t);
    return !!(n && r && (n === r || n.includes(r) || r.includes(n)));
}

function nv(e) {
    if (typeof e == `number` && Number.isFinite(e)) {
        let t = new Date(Date.UTC(1899, 11, 30));
        return t.setUTCDate(t.getUTCDate() + Math.floor(e)), t.toISOString().slice(0, 10);
    }
    let t = Q_(e), n = t.match(/(19|20)\d{2}[^0-9]?(\d{1,2})[^0-9]?(\d{1,2})/);
    return n ? `${n[0].slice(0, 4)}-${String(Number(n[2])).padStart(2, `0`)}-${String(Number(n[3])).padStart(2, `0`)}` : t;
}

function rv(e, t) {
    let n = Q_(e);
    if (!n) return `-`;
    let r = n.replace(/\D/g, ``);
    return t === `registration` && /^10\d{7}0000$/.test(r) ? `10-${r.slice(2, 9)}` : (t === `application` || t === `publication`) && /^10\d{11}$/.test(r) ? `10-${r.slice(2, 6)}-${r.slice(6)}` : t === `registration` && /^10\d{7}$/.test(r) ? `10-${r.slice(2)}` : n;
}

function iv(e, t, n) {
    let r = rv(e.registrationNo, `registration`), i = nv(e.applicationDate ?? ``), a = av(i, 20), o = Q_(e.title) || `명칭 미확인`, s = cv(Q_(e.ipc ?? ``)) || `-`, c = lv(o, ``, s);
    return {
        id: n,
        state: `target`,
        patentStatus: r === `-` ? `확인 필요` : `등록·유효`,
        rawStatus: r === `-` ? `확인 필요` : `등록`,
        title: o,
        titleEnglish: ``,
        ipc: s,
        cpc: ``,
        applicationNo: rv(e.applicationNo ?? ``, `application`),
        applicationDate: i || `-`,
        applicant: Q_(e.owner ?? ``),
        owner: Q_(e.owner ?? ``),
        citationCount: null,
        registrationNo: r,
        registrationDate: nv(e.registrationDate ?? ``) || `-`,
        publicationNo: `-`,
        publicationDate: `-`,
        agent: ``,
        inventors: ``,
        abstract: ``,
        product: t.productName?.trim() || `미분류`,
        differentProduct: ``,
        exclusionCategory: ``,
        exclusionDetail: ``,
        technology: c,
        relation: `확인 필요`,
        confidence: 0,
        note: `개별 직접등록 · 평가대상 확정 전`,
        remaining: a ? sv(t.evaluationDate, a) : `확인 필요`,
        expirationDate: a,
        dueDate: `특허등록원부 확인 필요`,
        source: `개별 직접등록`,
        portfolioIncluded: !0,
        reviewed: !1,
        portfolioOwner: Q_(e.owner ?? ``)
    };
}

function av(e, t) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(e)) return ``;
    let n = new Date(`${e}T00:00:00Z`);
    return n.setUTCFullYear(n.getUTCFullYear() + t), n.toISOString().slice(0, 10);
}

function ov(e, t) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(e) || !/^\d{4}-\d{2}-\d{2}$/.test(t)) return null;
    let n = new Date(`${e}T00:00:00Z`), r = new Date(`${t}T00:00:00Z`), i = (r.getUTCFullYear() - n.getUTCFullYear()) * 12 + r.getUTCMonth() - n.getUTCMonth();
    return r.getUTCDate() < n.getUTCDate() && --i, i;
}

function sv(e, t) {
    let n = ov(e, t);
    return n === null ? `확인 필요` : n <= 0 ? `만료` : `${Math.floor(n / 12)}년 ${n % 12}개월`;
}

function cv(e) {
    return e.split(`|`)[0]?.trim().replace(/\s+/g, ` `) || `-`;
}

function lv(e, t, n) {
    let r = `${e} ${t}`;
    if (/고액분리|고액 분리|분쇄|발효|소멸기/.test(r)) return `처리·고액분리 기술`;
    if (/계량|요금|바코드|인증|감지|모니터링|제어방법/.test(r)) return `계량·인증·운영제어 기술`;
    if (/투입구|투입장치|슈트|게이트.?밸브|배출밸브/.test(r)) return `투입·배출 제어기술`;
    if (/진공|공기.?이송|자동수거|자동 수거|집하|포집|이송관/.test(r)) return `진공 이송·집하 시스템기술`;
    let i = cv(n).replace(/\s/g, ``).slice(0, 4);
    return i && i !== `-` ? `${i} 계열 기술` : `기타 연관기술`;
}

function uv(e, t, n) {
    if (n?.trim()) return n.trim();
    let r = `${e} ${t}`;
    return /음식물|음식쓰레기|주방쓰레기/.test(r) ? `음식물쓰레기 자동수거·처리시스템` : /쓰레기|폐기물/.test(r) ? `쓰레기 자동수거시스템` : `미분류`;
}

function dv(e) {
    return e.title.replace(/\s+/g, ` `).trim().replace(/^(?:개선된|향상된|고효율|다기능)\s+/, ``).replace(/\s*(?:및 이를 이용한 방법|및 그 방법|제조 방법|제어 방법)$/, ``).trim() || `${cv(e.ipc).replace(/\s/g, ``)} 계열 적용제품`;
}

function fv(e) {
    let t = e.filter(e => e.patentStatus === `등록·유효` && e.state === `target`), n = new Map;
    for (let e of t) {
        let t = dv(e), r = cv(e.ipc).replace(/\s/g, ``).slice(0, 4) || `미분류`, i = n.get(t) ?? {
            count: 0,
            ipcs: new Map
        };
        i.count += 1, i.ipcs.set(r, (i.ipcs.get(r) ?? 0) + 1), n.set(t, i);
    }
    return [ ...n.entries() ].sort((e, t) => t[1].count - e[1].count || e[0].localeCompare(t[0], `ko`)).slice(0, 6).map(([e, t]) => {
        let n = [ ...t.ipcs.entries() ].sort((e, t) => t[1] - e[1])[0]?.[0] ?? `미분류`;
        return {
            name: e,
            count: t.count,
            basis: `title_ipc`,
            reason: `발명의 명칭 우선 · 주 IPC ${n} 교차확인 · 적격특허 ${t.count}건`
        };
    });
}

function pv(e) {
    return new Set(e.replace(/[^가-힣A-Za-z0-9]+/g, ` `).split(/\s+/).filter(e => e.length >= 2));
}

function mv(e, t) {
    let n = pv(e), r = pv(t);
    if (!n.size || !r.size) return 0;
    let i = 0;
    for (let e of n) r.has(e) && (i += 1);
    return i / Math.max(n.size, r.size);
}

function hv(e, t, n) {
    let r = e.find(e => e.id === t);
    if (!r) return e;
    let i = r.ipc.replace(/\s/g, ``).slice(0, 4), a = `${r.title} ${r.abstract} ${r.technology} ${n}`;
    return e.map(e => {
        if (e.id === t) return {
            ...e,
            state: `target`,
            product: n,
            relation: `핵심`,
            confidence: 100,
            reviewed: !1,
            source: `기존 재평가 대상특허 후보`,
            note: `기존 평가대상특허로 불러옴 · 평가자 최종 확정 필요`
        };
        if (e.state === `excluded` || e.patentStatus !== `등록·유효`) return e;
        let o = !!(i && e.ipc.replace(/\s/g, ``).startsWith(i)), s = e.technology === r.technology, c = mv(a, `${e.title} ${e.abstract} ${e.technology}`), l = o || s || c >= .12;
        return {
            ...e,
            state: l ? `target` : `review`,
            product: n,
            relation: l ? `직접 관련` : `확인 필요`,
            confidence: Math.round(Math.min(96, 68 + c * 70 + (o ? 12 : 0) + (s ? 10 : 0))),
            reviewed: !1,
            source: l ? `기존 대상특허 기반 추가대상 추천` : `기존 대상특허 기반 연관성 확인`,
            note: l ? `기존 대상특허와 ${o ? `IPC·` : ``}${s ? `기술군·` : ``}명칭 유사성을 근거로 추가대상 추천` : `기존 대상특허와의 연관성 PM 확인 필요`
        };
    });
}

function gv(e, t, n = 20) {
    if (!t.trim()) return e;
    let r = e.filter(e => e.state === `target`).sort((e, n) => {
        let r = e => {
            let n = e.relation === `핵심` ? 300 : e.relation === `직접 관련` ? 220 : e.relation === `연관 권리` ? 120 : 0, r = Math.max(mv(t, e.title), mv(t, e.abstract)) * 200;
            return (e.reviewed ? 1e3 : 0) + n + r + e.confidence;
        };
        return r(n) - r(e) || e.id - n.id;
    }), i = new Set(r.slice(0, n).map(e => e.id));
    return e.map(e => e.state === `target` && !i.has(e.id) ? {
        ...e,
        state: `review`,
        relation: `후순위 후보`,
        reviewed: !1,
        source: `평가대상특허 20건 권고 자동조정`,
        note: `발명진흥회 권고 최대 ${n}건 초과에 따른 후순위 후보·PM 교체 검토 필요`
    } : e);
}

function _v(e, t) {
    return e.includes(`소멸`) ? `소멸` : e.includes(`거절`) ? `거절` : e.includes(`포기`) || e.includes(`취하`) ? e : e.includes(`등록`) && t !== `-` ? `등록·유효` : e || `출원·심사 중`;
}

function vv(e) {
    return pp.find(t => t.name === e)?.code ?? `OTHER`;
}

function yv(e, t) {
    let n = pp.find(e => e.code === vv(t.bankName)) ?? pp.at(-1), r = ev(e.owner), i = t.executiveOwners ?? [], a = r.some(t => tv(t, e.portfolioOwner)), o = e => i.some(t => tv(e, t)), s = r.some(o), c = r.length > 1 && r.some(t => !tv(t, e.portfolioOwner) && !o(t)), l = s && r.every(t => tv(t, e.portfolioOwner) || o(t)), u = e.patentStatus === `등록·유효` && e.registrationNo !== `-`, d = ov(t.evaluationDate, e.expirationDate), f = ov(e.registrationDate, t.evaluationDate), p = `target`, m = `유효 등록특허·최종권리자 일치`;
    u ? !e.owner || !a && !s ? (p = `excluded`, m = `최종권리자가 ${e.portfolioOwner || `주요 출원인`}와 달라 현재 권리 미보유`) : c ? (p = `excluded`,
    m = `제3자 공동권리권 특허로 평가대상 제외`) : d !== null && d < n.minimumRemainingYears * 12 ? (p = `excluded`,
    m = `${n.name} 기준 법적 잔존기간 ${n.minimumRemainingYears}년 미만으로 필수 제외`) : n.underSixMonthsException && f !== null && f < 6 && (p = `excluded`,
    m = `${n.name} 기준 등록 후 6개월 미경과로 필수 제외`) : (p = `excluded`, m = `${e.patentStatus} 특허로 IP담보 평가대상 제외`),
    l && (m = p === `target` ? `경영주/경영진 권리이전 조건부` : `${m} · 경영주/경영진 권리이전 조건부`);
    let h = uv(e.title, e.abstract, t.productName), g = lv(e.title, e.abstract, e.ipc), _ = h !== `미분류` && g !== `기타 연관기술`, v = t.productName?.trim() ?? ``, y = v ? Math.max(mv(v, e.title), mv(v, e.abstract)) : 1, b = `${e.title}${e.abstract}`.replace(/[^가-힣A-Za-z0-9]/g, ``).toLowerCase(), x = [ ...pv(v) ].some(e => e.length >= 3 && b.includes(e.toLowerCase())), S = !!(v && p === `target` && y === 0 && !x);
    S && (p = `review`, m = `선택한 사업화제품군과 명확히 달라 ‘사업화제품 상이’ 분류제외 여부 PM 확인 필요`);
    let C = Math.max(55, Math.min(97, 70 + (_ ? 16 : 0) + (u ? 6 : 0) - (p === `excluded` ? 8 : 0)));
    return {
        ...e,
        state: p,
        product: h,
        differentProduct: S ? e.differentProduct || dv(e) : e.differentProduct,
        exclusionCategory: p === `excluded` ? `필수 제외` : e.exclusionCategory,
        exclusionDetail: p === `excluded` ? m : e.exclusionDetail,
        technology: g,
        relation: S ? `무관 가능성` : _ ? p === `excluded` ? `연관 권리` : `직접 관련` : `확인 필요`,
        confidence: C,
        note: m,
        remaining: sv(t.evaluationDate, e.expirationDate),
        dueDate: u ? `특허등록원부 확인 필요` : `-`,
        source: `키프리스 원자료·시스템 자동판정`,
        portfolioIncluded: _,
        reviewed: !1
    };
}

function bv(e, t) {
    let n = new Map;
    for (let r of e) for (let e of ev(Q_(r[String(t.applicant)]))) {
        let t = $_(e);
        if (!t) continue;
        let r = n.get(t);
        n.set(t, {
            label: e,
            count: (r?.count ?? 0) + 1
        });
    }
    return [ ...n.values() ].sort((e, t) => t.count - e.count)[0]?.label ?? ``;
}

function xv(e) {
    let t = e.map(Z_), n = Object.entries(X_).map(([e, n]) => [ e, t.findIndex(e => n.some(t => Z_(t) === e)) ]);
    return Object.fromEntries(n);
}

function Sv(e, t) {
    let n = e.slice(0, 10).findIndex(e => {
        let t = e.map(Z_);
        return t.includes(`상태`) && t.includes(`발명의명칭`) && t.includes(`출원번호`);
    });
    if (n < 0) throw Error(`키프리스 기본 열(상태·발명의 명칭·출원번호)을 찾지 못했습니다.`);
    let r = xv(e[n]), i = e.slice(n + 1).filter(e => Q_(e[r.title]) || Q_(e[r.applicationNo])).map(e => Object.fromEntries(e.map((e, t) => [ String(t), e ]))), a = bv(i, r);
    return {
        rows: i.map((e, n) => {
            let i = t => r[t] >= 0 ? e[String(r[t])] : null, o = nv(i(`applicationDate`)), s = rv(i(`registrationNo`), `registration`), c = Q_(i(`status`));
            return yv({
                id: n + 1,
                state: `review`,
                patentStatus: _v(c, s),
                rawStatus: c,
                title: Q_(i(`title`)) || `명칭 미확인`,
                titleEnglish: Q_(i(`titleEnglish`)),
                ipc: cv(Q_(i(`ipc`))),
                cpc: Q_(i(`cpc`)),
                applicationNo: rv(i(`applicationNo`), `application`),
                applicationDate: o,
                applicant: Q_(i(`applicant`)),
                owner: Q_(i(`owner`)),
                citationCount: Number.isFinite(Number(i(`citationCount`))) ? Number(i(`citationCount`)) : null,
                registrationNo: s,
                registrationDate: nv(i(`registrationDate`)) || `-`,
                publicationNo: rv(i(`publicationNo`), `publication`),
                publicationDate: nv(i(`publicationDate`)) || `-`,
                agent: Q_(i(`agent`)),
                inventors: Q_(i(`inventors`)),
                abstract: Q_(i(`abstract`)),
                product: `미분류`,
                differentProduct: ``,
                exclusionCategory: ``,
                exclusionDetail: ``,
                technology: `기타 연관기술`,
                relation: `확인 필요`,
                confidence: 0,
                note: `자동판정 전`,
                remaining: `확인 필요`,
                expirationDate: av(o, 20),
                dueDate: `확인 필요`,
                source: `키프리스 원자료`,
                portfolioIncluded: !1,
                reviewed: !1,
                portfolioOwner: a
            }, t);
        }),
        owner: a
    };
}

function Cv(e) {
    let t = [], n = [], r = ``, i = !1;
    for (let a = 0; a < e.length; a += 1) {
        let o = e[a];
        o === `"` ? i && e[a + 1] === `"` ? (r += `"`, a += 1) : i = !i : o === `,` && !i ? (n.push(r),
        r = ``) : (o === `\n` || o === `\r`) && !i ? (o === `\r` && e[a + 1] === `\n` && (a += 1),
        n.push(r), t.push(n), n = [], r = ``) : r += o;
    }
    return (r || n.length) && (n.push(r), t.push(n)), t;
}

async function wv(e, t) {
    let n = e.name.split(`.`).pop()?.toLowerCase(), r;
    if (n === `csv`) r = [ Cv(await e.text()) ]; else if (n === `xlsx`) r = Object.values(await Xh(e)); else throw Error(`키프리스 원자료는 XLSX 또는 CSV 파일만 업로드할 수 있습니다.`);
    let i = r.find(e => e.some(e => {
        let t = e.map(Z_);
        return t.includes(`판정`) && t.includes(`발명의명칭`) && t.includes(`관련사업화제품`);
    }));
    if (i) return Tv(i);
    let a = r.find(e => e.some(e => e.map(Z_).includes(`발명의명칭`)));
    if (!a) throw Error(`키프리스 특허 목록 시트를 찾지 못했습니다.`);
    return Sv(a, t);
}

function Tv(e) {
    let t = e.findIndex(e => e.map(Z_).includes(`판정`) && e.map(Z_).includes(`발명의명칭`));
    if (t < 0) throw Error(`PM 분류 포트폴리오의 판정·발명의 명칭 열을 찾지 못했습니다.`);
    let n = e[t].map(Z_), r = (...e) => n.findIndex(t => e.map(Z_).includes(t)), i = (e, ...t) => {
        let n = r(...t);
        return n >= 0 ? Q_(e[n]) : ``;
    }, a = e.slice(t + 1).filter(e => i(e, `발명의 명칭`)), o = a.map(e => i(e, `최종권리자`)).find(Boolean) ?? ``;
    return {
        rows: a.map((e, t) => {
            let n = i(e, `판정`), r = /제외|excluded/i.test(n) ? `excluded` : /예외|conditional/i.test(n) ? `conditional` : /확인|후순위|review/i.test(n) ? `review` : `target`, a = i(e, `등록번호`) || `-`, s = i(e, `특이사항·제외사유`, `조건·특이사항`, `제외사유`);
            /기준 법적 잔존기간|등록 후 6개월 미경과/.test(s) && (r = `excluded`);
            let c = i(e, `상이 사업화제품명`);
            return {
                id: t + 1,
                state: r,
                patentStatus: i(e, `권리상태`) || (a === `-` ? `확인 필요` : `등록·유효`),
                rawStatus: i(e, `권리상태`),
                title: i(e, `발명의 명칭`),
                titleEnglish: ``,
                ipc: i(e, `IPC`) || `-`,
                cpc: ``,
                applicationNo: i(e, `출원번호`) || `-`,
                applicationDate: `-`,
                applicant: ``,
                owner: i(e, `최종권리자`),
                citationCount: null,
                registrationNo: a,
                registrationDate: `-`,
                publicationNo: `-`,
                publicationDate: `-`,
                agent: ``,
                inventors: ``,
                abstract: ``,
                product: i(e, `관련 사업화제품`, `기준 사업화제품`) || `미분류`,
                differentProduct: c,
                exclusionCategory: r === `excluded` ? c ? `사업화제품 상이` : i(e, `제외구분`) || `PM 분류 제외` : ``,
                exclusionDetail: r === `excluded` ? s : ``,
                technology: i(e, `대표 기술군`) || `기타 연관기술`,
                relation: i(e, `연관성`, `사업화제품 연관성`) || `확인 필요`,
                confidence: 100,
                note: s || `PM 분류 포트폴리오 업로드`,
                remaining: `확인 필요`,
                expirationDate: ``,
                dueDate: `특허등록원부 확인 필요`,
                source: `PM 분류 포트폴리오 업로드`,
                portfolioIncluded: r === `target`,
                reviewed: r === `excluded`,
                portfolioOwner: o
            };
        }),
        owner: o
    };
}

function Ev(e, t) {
    return e.source === `평가자 확정` || e.source.startsWith(`PM 분류 포트폴리오`) || e.source.startsWith(`개별 직접등록`) ? {
        ...e,
        product: t.productName?.trim() || e.product
    } : yv(e, t);
}

var Dv = {
    registrationNo: ``,
    title: ``,
    ipc: ``,
    applicationNo: ``,
    applicationDate: ``,
    registrationDate: ``,
    owner: ``
};

function Ov(e) {
    return e.patentStatus !== `등록·유효` || /기준 법적 잔존기간|제3자 공동권리|현재 권리 미보유|최종권리자.*달라|공공기관 근질권|선순위 근질권|선순위.*질권|실시권|라이선스|미등록|소멸|거절|포기|취하/.test(`${e.note} ${e.patentStatus}`);
}

function kv(e) {
    let t = [];
    return e.patentStatus !== `등록·유효` && t.push(`권리상태: ${e.patentStatus}`), /제3자 공동권리|현재 권리 미보유|최종권리자.*달라/.test(e.note) && t.push(e.note),
    /기준 법적 잔존기간|등록 후 6개월/.test(e.note) && t.push(e.note), [ ...new Set(t) ];
}

var Av = {
    target: {
        label: `평가대상 후보특허`,
        className: `badge-target`
    },
    conditional: {
        label: `예외 제외 가능`,
        className: `badge-conditional`
    },
    review: {
        label: `PM 확인 필요`,
        className: `badge-review`
    },
    excluded: {
        label: `제외대상`,
        className: `badge-excluded`
    }
};

function jv(e) {
    return e.state === `target` && e.reviewed ? `평가대상특허` : Av[e.state].label;
}

var Mv = [ {
    id: `basic`,
    label: `평가 기본정보`,
    icon: V
}, {
    id: `company`,
    label: `업체정보`,
    icon: A
}, {
    id: `benchmarks`,
    label: `업종평균·시장정보`,
    icon: F
}, {
    id: `portfolio`,
    label: `IP 포트폴리오`,
    icon: U
}, {
    id: `valuation`,
    label: `가치산정`,
    icon: fe
}, {
    id: `report`,
    label: `결과보고서`,
    icon: ee
} ];
