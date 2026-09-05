function Dm(e) {
    return e.includes(`상장`) ? `listed` : e.includes(`대기업`) ? `large` : e.includes(`중기업`) || e.includes(`중견`) ? `medium` : e.includes(`창업`) ? `startup` : `small`;
}

function Om(e) {
    return e.toUpperCase().replace(/[^A-Z0-9]/g, ``);
}

function km(e, t) {
    let n = Om(t);
    return e.filter(e => n.startsWith(Om(e.code))).sort((e, t) => Om(t.code).length - Om(e.code).length)[0];
}

function Am(e, t) {
    let n = Om(t);
    return e.find(e => Om(e.code) === n);
}

function jm(e, t) {
    return `${e.label} (${e.versions[t]})`;
}

var Mm = Uint8Array, Nm = Uint16Array, Pm = Uint32Array, Fm = new Mm([ 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0, 0, 0, 0 ]), Im = new Mm([ 0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13, 0, 0 ]), Lm = new Mm([ 16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15 ]), Rm = function(e, t) {
    for (var n = new Nm(31), r = 0; r < 31; ++r) n[r] = t += 1 << e[r - 1];
    for (var i = new Pm(n[30]), r = 1; r < 30; ++r) for (var a = n[r]; a < n[r + 1]; ++a) i[a] = a - n[r] << 5 | r;
    return [ n, i ];
}, zm = Rm(Fm, 2), Bm = zm[0], Vm = zm[1];

Bm[28] = 258, Vm[258] = 28;

for (var Hm = Rm(Im, 0), Um = Hm[0], Wm = Hm[1], Gm = new Nm(32768), Km = 0; Km < 32768; ++Km) {
    var qm = (Km & 43690) >>> 1 | (Km & 21845) << 1;
    qm = (qm & 52428) >>> 2 | (qm & 13107) << 2, qm = (qm & 61680) >>> 4 | (qm & 3855) << 4,
    Gm[Km] = ((qm & 65280) >>> 8 | (qm & 255) << 8) >>> 1;
}

for (var Jm = function(e, t, n) {
    for (var r = e.length, i = 0, a = new Nm(t); i < r; ++i) e[i] && ++a[e[i] - 1];
    var o = new Nm(t);
    for (i = 0; i < t; ++i) o[i] = o[i - 1] + a[i - 1] << 1;
    var s;
    if (n) {
        s = new Nm(1 << t);
        var c = 15 - t;
        for (i = 0; i < r; ++i) if (e[i]) for (var l = i << 4 | e[i], u = t - e[i], d = o[e[i] - 1]++ << u, f = d | (1 << u) - 1; d <= f; ++d) s[Gm[d] >>> c] = l;
    } else for (s = new Nm(r), i = 0; i < r; ++i) e[i] && (s[i] = Gm[o[e[i] - 1]++] >>> 15 - e[i]);
    return s;
}, Ym = new Mm(288), Km = 0; Km < 144; ++Km) Ym[Km] = 8;

for (var Km = 144; Km < 256; ++Km) Ym[Km] = 9;

for (var Km = 256; Km < 280; ++Km) Ym[Km] = 7;

for (var Km = 280; Km < 288; ++Km) Ym[Km] = 8;

for (var Xm = new Mm(32), Km = 0; Km < 32; ++Km) Xm[Km] = 5;

var Zm = Jm(Ym, 9, 0), Qm = Jm(Ym, 9, 1), $m = Jm(Xm, 5, 0), eh = Jm(Xm, 5, 1), th = function(e) {
    for (var t = e[0], n = 1; n < e.length; ++n) e[n] > t && (t = e[n]);
    return t;
}, nh = function(e, t, n) {
    var r = t / 8 | 0;
    return (e[r] | e[r + 1] << 8) >> (t & 7) & n;
}, rh = function(e, t) {
    var n = t / 8 | 0;
    return (e[n] | e[n + 1] << 8 | e[n + 2] << 16) >> (t & 7);
}, ih = function(e) {
    return (e + 7) / 8 | 0;
}, ah = function(e, t, n) {
    (t == null || t < 0) && (t = 0), (n == null || n > e.length) && (n = e.length);
    var r = new (e.BYTES_PER_ELEMENT == 2 ? Nm : e.BYTES_PER_ELEMENT == 4 ? Pm : Mm)(n - t);
    return r.set(e.subarray(t, n)), r;
}, oh = [ `unexpected EOF`, `invalid block type`, `invalid length/literal`, `invalid distance`, `stream finished`, `no stream handler`, , `no callback`, `invalid UTF-8 data`, `extra field too long`, `date not in range 1980-2099`, `filename too long`, `stream finishing`, `invalid zip data` ], sh = function(e, t, n) {
    var r = Error(t || oh[e]);
    if (r.code = e, Error.captureStackTrace && Error.captureStackTrace(r, sh), !n) throw r;
    return r;
}, ch = function(e, t, n) {
    var r = e.length;
    if (!r || n && n.f && !n.l) return t || new Mm(0);
    var i = !t || n, a = !n || n.i;
    n ||= {}, t ||= new Mm(r * 3);
    var o = function(e) {
        var n = t.length;
        if (e > n) {
            var r = new Mm(Math.max(n * 2, e));
            r.set(t), t = r;
        }
    }, s = n.f || 0, c = n.p || 0, l = n.b || 0, u = n.l, d = n.d, f = n.m, p = n.n, m = r * 8;
    do {
        if (!u) {
            s = nh(e, c, 1);
            var h = nh(e, c + 1, 3);
            if (c += 3, !h) {
                var g = ih(c) + 4, _ = e[g - 4] | e[g - 3] << 8, v = g + _;
                if (v > r) {
                    a && sh(0);
                    break;
                }
                i && o(l + _), t.set(e.subarray(g, v), l), n.b = l += _, n.p = c = v * 8, n.f = s;
                continue;
            } else if (h == 1) u = Qm, d = eh, f = 9, p = 5; else if (h == 2) {
                var y = nh(e, c, 31) + 257, b = nh(e, c + 10, 15) + 4, x = y + nh(e, c + 5, 31) + 1;
                c += 14;
                for (var S = new Mm(x), C = new Mm(19), w = 0; w < b; ++w) C[Lm[w]] = nh(e, c + w * 3, 7);
                c += b * 3;
                for (var T = th(C), E = (1 << T) - 1, D = Jm(C, T, 1), w = 0; w < x; ) {
                    var O = D[nh(e, c, E)];
                    c += O & 15;
                    var g = O >>> 4;
                    if (g < 16) S[w++] = g; else {
                        var k = 0, A = 0;
                        for (g == 16 ? (A = 3 + nh(e, c, 3), c += 2, k = S[w - 1]) : g == 17 ? (A = 3 + nh(e, c, 7),
                        c += 3) : g == 18 && (A = 11 + nh(e, c, 127), c += 7); A--; ) S[w++] = k;
                    }
                }
                var j = S.subarray(0, y), M = S.subarray(y);
                f = th(j), p = th(M), u = Jm(j, f, 1), d = Jm(M, p, 1);
            } else sh(1);
            if (c > m) {
                a && sh(0);
                break;
            }
        }
        i && o(l + 131072);
        for (var N = (1 << f) - 1, P = (1 << p) - 1, F = c; ;F = c) {
            var k = u[rh(e, c) & N], I = k >>> 4;
            if (c += k & 15, c > m) {
                a && sh(0);
                break;
            }
            if (k || sh(2), I < 256) t[l++] = I; else if (I == 256) {
                F = c, u = null;
                break;
            } else {
                var L = I - 254;
                if (I > 264) {
                    var w = I - 257, ee = Fm[w];
                    L = nh(e, c, (1 << ee) - 1) + Bm[w], c += ee;
                }
                var te = d[rh(e, c) & P], R = te >>> 4;
                te || sh(3), c += te & 15;
                var M = Um[R];
                if (R > 3) {
                    var ee = Im[R];
                    M += rh(e, c) & (1 << ee) - 1, c += ee;
                }
                if (c > m) {
                    a && sh(0);
                    break;
                }
                i && o(l + 131072);
                for (var z = l + L; l < z; l += 4) t[l] = t[l - M], t[l + 1] = t[l + 1 - M], t[l + 2] = t[l + 2 - M],
                t[l + 3] = t[l + 3 - M];
                l = z;
            }
        }
        n.l = u, n.p = F, n.b = l, n.f = s, u && (s = 1, n.m = f, n.d = d, n.n = p);
    } while (!s);
    return l == t.length ? t : ah(t, 0, l);
}, lh = function(e, t, n) {
    n <<= t & 7;
    var r = t / 8 | 0;
    e[r] |= n, e[r + 1] |= n >>> 8;
}, uh = function(e, t, n) {
    n <<= t & 7;
    var r = t / 8 | 0;
    e[r] |= n, e[r + 1] |= n >>> 8, e[r + 2] |= n >>> 16;
}, dh = function(e, t) {
    for (var n = [], r = 0; r < e.length; ++r) e[r] && n.push({
        s: r,
        f: e[r]
    });
    var i = n.length, a = n.slice();
    if (!i) return [ vh, 0 ];
    if (i == 1) {
        var o = new Mm(n[0].s + 1);
        return o[n[0].s] = 1, [ o, 1 ];
    }
    n.sort(function(e, t) {
        return e.f - t.f;
    }), n.push({
        s: -1,
        f: 25001
    });
    var s = n[0], c = n[1], l = 0, u = 1, d = 2;
    for (n[0] = {
        s: -1,
        f: s.f + c.f,
        l: s,
        r: c
    }; u != i - 1; ) s = n[n[l].f < n[d].f ? l++ : d++], c = n[l != u && n[l].f < n[d].f ? l++ : d++],
    n[u++] = {
        s: -1,
        f: s.f + c.f,
        l: s,
        r: c
    };
    for (var f = a[0].s, r = 1; r < i; ++r) a[r].s > f && (f = a[r].s);
    var p = new Nm(f + 1), m = fh(n[u - 1], p, 0);
    if (m > t) {
        var r = 0, h = 0, g = m - t, _ = 1 << g;
        for (a.sort(function(e, t) {
            return p[t.s] - p[e.s] || e.f - t.f;
        }); r < i; ++r) {
            var v = a[r].s;
            if (p[v] > t) h += _ - (1 << m - p[v]), p[v] = t; else break;
        }
        for (h >>>= g; h > 0; ) {
            var y = a[r].s;
            p[y] < t ? h -= 1 << t - p[y]++ - 1 : ++r;
        }
        for (;r >= 0 && h; --r) {
            var b = a[r].s;
            p[b] == t && (--p[b], ++h);
        }
        m = t;
    }
    return [ new Mm(p), m ];
}, fh = function(e, t, n) {
    return e.s == -1 ? Math.max(fh(e.l, t, n + 1), fh(e.r, t, n + 1)) : t[e.s] = n;
}, ph = function(e) {
    for (var t = e.length; t && !e[--t]; ) ;
    for (var n = new Nm(++t), r = 0, i = e[0], a = 1, o = function(e) {
        n[r++] = e;
    }, s = 1; s <= t; ++s) if (e[s] == i && s != t) ++a; else {
        if (!i && a > 2) {
            for (;a > 138; a -= 138) o(32754);
            a > 2 && (o(a > 10 ? a - 11 << 5 | 28690 : a - 3 << 5 | 12305), a = 0);
        } else if (a > 3) {
            for (o(i), --a; a > 6; a -= 6) o(8304);
            a > 2 && (o(a - 3 << 5 | 8208), a = 0);
        }
        for (;a--; ) o(i);
        a = 1, i = e[s];
    }
    return [ n.subarray(0, r), t ];
}, mh = function(e, t) {
    for (var n = 0, r = 0; r < t.length; ++r) n += e[r] * t[r];
    return n;
}, hh = function(e, t, n) {
    var r = n.length, i = ih(t + 2);
    e[i] = r & 255, e[i + 1] = r >>> 8, e[i + 2] = e[i] ^ 255, e[i + 3] = e[i + 1] ^ 255;
    for (var a = 0; a < r; ++a) e[i + a + 4] = n[a];
    return (i + 4 + r) * 8;
}, gh = function(e, t, n, r, i, a, o, s, c, l, u) {
    lh(t, u++, n), ++i[256];
    for (var d = dh(i, 15), f = d[0], p = d[1], m = dh(a, 15), h = m[0], g = m[1], _ = ph(f), v = _[0], y = _[1], b = ph(h), x = b[0], S = b[1], C = new Nm(19), w = 0; w < v.length; ++w) C[v[w] & 31]++;
    for (var w = 0; w < x.length; ++w) C[x[w] & 31]++;
    for (var T = dh(C, 7), E = T[0], D = T[1], O = 19; O > 4 && !E[Lm[O - 1]]; --O) ;
    var k = l + 5 << 3, A = mh(i, Ym) + mh(a, Xm) + o, j = mh(i, f) + mh(a, h) + o + 14 + 3 * O + mh(C, E) + (2 * C[16] + 3 * C[17] + 7 * C[18]);
    if (k <= A && k <= j) return hh(t, u, e.subarray(c, c + l));
    var M, N, P, F;
    if (lh(t, u, 1 + (j < A)), u += 2, j < A) {
        M = Jm(f, p, 0), N = f, P = Jm(h, g, 0), F = h;
        var I = Jm(E, D, 0);
        lh(t, u, y - 257), lh(t, u + 5, S - 1), lh(t, u + 10, O - 4), u += 14;
        for (var w = 0; w < O; ++w) lh(t, u + 3 * w, E[Lm[w]]);
        u += 3 * O;
        for (var L = [ v, x ], ee = 0; ee < 2; ++ee) for (var te = L[ee], w = 0; w < te.length; ++w) {
            var R = te[w] & 31;
            lh(t, u, I[R]), u += E[R], R > 15 && (lh(t, u, te[w] >>> 5 & 127), u += te[w] >>> 12);
        }
    } else M = Zm, N = Ym, P = $m, F = Xm;
    for (var w = 0; w < s; ++w) if (r[w] > 255) {
        var R = r[w] >>> 18 & 31;
        uh(t, u, M[R + 257]), u += N[R + 257], R > 7 && (lh(t, u, r[w] >>> 23 & 31), u += Fm[R]);
        var z = r[w] & 31;
        uh(t, u, P[z]), u += F[z], z > 3 && (uh(t, u, r[w] >>> 5 & 8191), u += Im[z]);
    } else uh(t, u, M[r[w]]), u += N[r[w]];
    return uh(t, u, M[256]), u + N[256];
}, _h = new Pm([ 65540, 131080, 131088, 131104, 262176, 1048704, 1048832, 2114560, 2117632 ]), vh = new Mm(0), yh = function(e, t, n, r, i, a) {
    var o = e.length, s = new Mm(r + o + 5 * (1 + Math.ceil(o / 7e3)) + i), c = s.subarray(r, s.length - i), l = 0;
    if (!t || o < 8) for (var u = 0; u <= o; u += 65535) {
        var d = u + 65535;
        d >= o && (c[l >> 3] = a), l = hh(c, l + 1, e.subarray(u, d));
    } else {
        for (var f = _h[t - 1], p = f >>> 13, m = f & 8191, h = (1 << n) - 1, g = new Nm(32768), _ = new Nm(h + 1), v = Math.ceil(n / 3), y = 2 * v, b = function(t) {
            return (e[t] ^ e[t + 1] << v ^ e[t + 2] << y) & h;
        }, x = new Pm(25e3), S = new Nm(288), C = new Nm(32), w = 0, T = 0, u = 0, E = 0, D = 0, O = 0; u < o; ++u) {
            var k = b(u), A = u & 32767, j = _[k];
            if (g[A] = j, _[k] = A, D <= u) {
                var M = o - u;
                if ((w > 7e3 || E > 24576) && M > 423) {
                    l = gh(e, c, 0, x, S, C, T, E, O, u - O, l), E = w = T = 0, O = u;
                    for (var N = 0; N < 286; ++N) S[N] = 0;
                    for (var N = 0; N < 30; ++N) C[N] = 0;
                }
                var P = 2, F = 0, I = m, L = A - j & 32767;
                if (M > 2 && k == b(u - L)) for (var ee = Math.min(p, M) - 1, te = Math.min(32767, u), R = Math.min(258, M); L <= te && --I && A != j; ) {
                    if (e[u + P] == e[u + P - L]) {
                        for (var z = 0; z < R && e[u + z] == e[u + z - L]; ++z) ;
                        if (z > P) {
                            if (P = z, F = L, z > ee) break;
                            for (var B = Math.min(L, z - 2), V = 0, N = 0; N < B; ++N) {
                                var ne = u - L + N + 32768 & 32767, H = ne - g[ne] + 32768 & 32767;
                                H > V && (V = H, j = ne);
                            }
                        }
                    }
                    A = j, j = g[A], L += A - j + 32768 & 32767;
                }
                if (F) {
                    x[E++] = 268435456 | Vm[P] << 18 | Wm[F];
                    var re = Vm[P] & 31, ie = Wm[F] & 31;
                    T += Fm[re] + Im[ie], ++S[257 + re], ++C[ie], D = u + P, ++w;
                } else x[E++] = e[u], ++S[e[u]];
            }
        }
        l = gh(e, c, a, x, S, C, T, E, O, u - O, l), !a && l & 7 && (l = hh(c, l + 1, vh));
    }
    return ah(s, 0, r + ih(l) + i);
}, bh = function() {
    for (var e = new Int32Array(256), t = 0; t < 256; ++t) {
        for (var n = t, r = 9; --r; ) n = (n & 1 && -306674912) ^ n >>> 1;
        e[t] = n;
    }
    return e;
}(), xh = function() {
    var e = -1;
    return {
        p: function(t) {
            for (var n = e, r = 0; r < t.length; ++r) n = bh[n & 255 ^ t[r]] ^ n >>> 8;
            e = n;
        },
        d: function() {
            return ~e;
        }
    };
}, Sh = function(e, t, n, r, i) {
    return yh(e, t.level == null ? 6 : t.level, t.mem == null ? Math.ceil(Math.max(8, Math.min(13, Math.log(e.length))) * 1.5) : 12 + t.mem, n, r, !i);
}, Ch = function(e, t) {
    var n = {};
    for (var r in e) n[r] = e[r];
    for (var r in t) n[r] = t[r];
    return n;
}, wh = function(e, t) {
    return e[t] | e[t + 1] << 8;
}, Th = function(e, t) {
    return (e[t] | e[t + 1] << 8 | e[t + 2] << 16 | e[t + 3] << 24) >>> 0;
}, Eh = function(e, t) {
    return Th(e, t) + Th(e, t + 4) * 4294967296;
}, Dh = function(e, t, n) {
    for (;n; ++t) e[t] = n, n >>>= 8;
};

function Oh(e, t) {
    return Sh(e, t || {}, 0, 0);
}

function kh(e, t) {
    return ch(e, t);
}

var Ah = function(e, t, n, r) {
    for (var i in e) {
        var a = e[i], o = t + i, s = r;
        Array.isArray(a) && (s = Ch(r, a[1]), a = a[0]), a instanceof Mm ? n[o] = [ a, s ] : (n[o += `/`] = [ new Mm(0), s ],
        Ah(a, o, n, r));
    }
}, jh = typeof TextEncoder < `u` && new TextEncoder, Mh = typeof TextDecoder < `u` && new TextDecoder;

try {
    Mh.decode(vh, {
        stream: !0
    });
} catch {}

var Nh = function(e) {
    for (var t = ``, n = 0; ;) {
        var r = e[n++], i = (r > 127) + (r > 223) + (r > 239);
        if (n + i > e.length) return [ t, ah(e, n - 1) ];
        i ? i == 3 ? (r = ((r & 15) << 18 | (e[n++] & 63) << 12 | (e[n++] & 63) << 6 | e[n++] & 63) - 65536,
        t += String.fromCharCode(55296 | r >> 10, 56320 | r & 1023)) : i & 1 ? t += String.fromCharCode((r & 31) << 6 | e[n++] & 63) : t += String.fromCharCode((r & 15) << 12 | (e[n++] & 63) << 6 | e[n++] & 63) : t += String.fromCharCode(r);
    }
};

function Ph(e, t) {
    if (t) {
        for (var n = new Mm(e.length), r = 0; r < e.length; ++r) n[r] = e.charCodeAt(r);
        return n;
    }
    if (jh) return jh.encode(e);
    for (var i = e.length, a = new Mm(e.length + (e.length >> 1)), o = 0, s = function(e) {
        a[o++] = e;
    }, r = 0; r < i; ++r) {
        if (o + 5 > a.length) {
            var c = new Mm(o + 8 + (i - r << 1));
            c.set(a), a = c;
        }
        var l = e.charCodeAt(r);
        l < 128 || t ? s(l) : l < 2048 ? (s(192 | l >> 6), s(128 | l & 63)) : l > 55295 && l < 57344 ? (l = 65536 + (l & 1047552) | e.charCodeAt(++r) & 1023,
        s(240 | l >> 18), s(128 | l >> 12 & 63), s(128 | l >> 6 & 63), s(128 | l & 63)) : (s(224 | l >> 12),
        s(128 | l >> 6 & 63), s(128 | l & 63));
    }
    return ah(a, 0, o);
}

function Fh(e, t) {
    if (t) {
        for (var n = ``, r = 0; r < e.length; r += 16384) n += String.fromCharCode.apply(null, e.subarray(r, r + 16384));
        return n;
    } else if (Mh) return Mh.decode(e); else {
        var i = Nh(e), a = i[0];
        return i[1].length && sh(8), a;
    }
}

var Ih = function(e, t) {
    return t + 30 + wh(e, t + 26) + wh(e, t + 28);
}, Lh = function(e, t, n) {
    var r = wh(e, t + 28), i = Fh(e.subarray(t + 46, t + 46 + r), !(wh(e, t + 8) & 2048)), a = t + 46 + r, o = Th(e, t + 20), s = n && o == 4294967295 ? Rh(e, a) : [ o, Th(e, t + 24), Th(e, t + 42) ], c = s[0], l = s[1], u = s[2];
    return [ wh(e, t + 10), c, l, i, a + wh(e, t + 30) + wh(e, t + 32), u ];
}, Rh = function(e, t) {
    for (;wh(e, t) != 1; t += 4 + wh(e, t + 2)) ;
    return [ Eh(e, t + 12), Eh(e, t + 4), Eh(e, t + 20) ];
}, zh = function(e) {
    var t = 0;
    if (e) for (var n in e) {
        var r = e[n].length;
        r > 65535 && sh(9), t += r + 4;
    }
    return t;
}, Bh = function(e, t, n, r, i, a, o, s) {
    var c = r.length, l = n.extra, u = s && s.length, d = zh(l);
    Dh(e, t, o == null ? 67324752 : 33639248), t += 4, o != null && (e[t++] = 20, e[t++] = n.os),
    e[t] = 20, t += 2, e[t++] = n.flag << 1 | (a < 0 && 8), e[t++] = i && 8, e[t++] = n.compression & 255,
    e[t++] = n.compression >> 8;
    var f = new Date(n.mtime == null ? Date.now() : n.mtime), p = f.getFullYear() - 1980;
    if ((p < 0 || p > 119) && sh(10), Dh(e, t, p << 25 | f.getMonth() + 1 << 21 | f.getDate() << 16 | f.getHours() << 11 | f.getMinutes() << 5 | f.getSeconds() >>> 1),
    t += 4, a != -1 && (Dh(e, t, n.crc), Dh(e, t + 4, a < 0 ? -a - 2 : a), Dh(e, t + 8, n.size)),
    Dh(e, t + 12, c), Dh(e, t + 14, d), t += 16, o != null && (Dh(e, t, u), Dh(e, t + 6, n.attrs),
    Dh(e, t + 10, o), t += 14), e.set(r, t), t += c, d) for (var m in l) {
        var h = l[m], g = h.length;
        Dh(e, t, +m), Dh(e, t + 2, g), e.set(h, t + 4), t += 4 + g;
    }
    return u && (e.set(s, t), t += u), t;
}, Vh = function(e, t, n, r, i) {
    Dh(e, t, 101010256), Dh(e, t + 8, n), Dh(e, t + 10, n), Dh(e, t + 12, r), Dh(e, t + 16, i);
};

function Hh(e, t) {
    t ||= {};
    var n = {}, r = [];
    Ah(e, ``, n, t);
    var i = 0, a = 0;
    for (var o in n) {
        var s = n[o], c = s[0], l = s[1], u = l.level == 0 ? 0 : 8, d = Ph(o), f = d.length, p = l.comment, m = p && Ph(p), h = m && m.length, g = zh(l.extra);
        f > 65535 && sh(11);
        var _ = u ? Oh(c, l) : c, v = _.length, y = xh();
        y.p(c), r.push(Ch(l, {
            size: c.length,
            crc: y.d(),
            c: _,
            f: d,
            m: m,
            u: f != o.length || m && p.length != h,
            o: i,
            compression: u
        })), i += 30 + f + g + v, a += 76 + 2 * (f + g) + (h || 0) + v;
    }
    for (var b = new Mm(a + 22), x = i, S = a - i, C = 0; C < r.length; ++C) {
        var d = r[C];
        Bh(b, d.o, d, d.f, d.u, d.c.length);
        var w = 30 + d.f.length + zh(d.extra);
        b.set(d.c, d.o + w), Bh(b, i, d, d.f, d.u, d.c.length, d.o, d.m), i += 16 + w + (d.m ? d.m.length : 0);
    }
    return Vh(b, i, r.length, S, x), b;
}

function Uh(e, t) {
    for (var n = {}, r = e.length - 22; Th(e, r) != 101010256; --r) (!r || e.length - r > 65558) && sh(13);
    var i = wh(e, r + 8);
    if (!i) return {};
    var a = Th(e, r + 16), o = a == 4294967295 || i == 65535;
    if (o) {
        var s = Th(e, r - 12);
        o = Th(e, s) == 101075792, o && (i = Th(e, s + 32), a = Th(e, s + 48));
    }
    for (var c = t && t.filter, l = 0; l < i; ++l) {
        var u = Lh(e, a, o), d = u[0], f = u[1], p = u[2], m = u[3], h = u[4], g = u[5], _ = Ih(e, g);
        a = h, (!c || c({
            name: m,
            size: f,
            originalSize: p,
            compression: d
        })) && (d ? d == 8 ? n[m] = kh(e.subarray(_, _ + f), new Mm(p)) : sh(14, `unknown compression type ` + d) : n[m] = ah(e, _, _ + f));
    }
    return n;
}

var Wh = e => typeof e == `number` && Number.isFinite(e) ? e : null, Gh = /^[A-Z]\d{2}$/, Kh = /^[A-Z]\d{2}[A-Z]$/;

function qh(e) {
    return [ ...e.match(/[A-Z]+/)?.[0] ?? `A` ].reduce((e, t) => e * 26 + t.charCodeAt(0) - 64, 0) - 1;
}

function Jh(e) {
    let t = (new DOMParser).parseFromString(e, `application/xml`);
    if (t.querySelector(`parsererror`)) throw Error(`엑셀 XML을 읽지 못했습니다.`);
    return t;
}

function Yh(e) {
    return e?.textContent ?? ``;
}

async function Xh(e) {
    let t = Uh(new Uint8Array(await e.arrayBuffer())), n = e => t[e] ? Fh(t[e]) : ``, r = n(`xl/sharedStrings.xml`) ? Jh(n(`xl/sharedStrings.xml`)) : null, i = r ? [ ...r.getElementsByTagName(`si`) ].map(e => Yh(e)) : [], a = Jh(n(`xl/workbook.xml`)), o = Jh(n(`xl/_rels/workbook.xml.rels`)), s = new Map([ ...o.getElementsByTagName(`Relationship`) ].map(e => [ e.getAttribute(`Id`) ?? ``, e.getAttribute(`Target`) ?? `` ])), c = {};
    for (let e of [ ...a.getElementsByTagName(`sheet`) ]) {
        let t = e.getAttribute(`name`) ?? `Sheet`, r = e.getAttribute(`r:id`) ?? e.getAttributeNS(`http://schemas.openxmlformats.org/officeDocument/2006/relationships`, `id`) ?? ``, a = s.get(r);
        if (!a) continue;
        let o = Jh(n(a.startsWith(`/`) ? a.slice(1) : `xl/${a.replace(/^\.\//, ``)}`)), l = [];
        for (let e of [ ...o.getElementsByTagName(`c`) ]) {
            let t = e.getAttribute(`r`) ?? `A1`, n = Math.max(0, Number(t.match(/\d+/)?.[0] ?? `1`) - 1), r = qh(t);
            for (;l.length <= n; ) l.push([]);
            for (;l[n].length <= r; ) l[n].push(null);
            let a = e.getAttribute(`t`), o = Yh(e.getElementsByTagName(`v`)[0] ?? e.getElementsByTagName(`t`)[0] ?? null);
            l[n][r] = a === `s` ? i[Number(o)] ?? `` : a === `inlineStr` || a === `str` ? o : a === `b` ? o === `1` : o === `` ? null : Number.isFinite(Number(o)) ? Number(o) : o;
        }
        c[t] = l;
    }
    return c;
}

function Zh(e, t) {
    return e.filter(e => typeof e[t] == `string` && Gh.test(String(e[t]).trim())).map(e => ({
        code: String(e[t]).trim(),
        name: String(e[t + 1] ?? ``).trim(),
        count: Wh(e[t + 2]),
        average: Wh(e[t + 3]),
        min: Wh(e[t + 4]),
        lower5: Wh(e[t + 5]),
        q1: Wh(e[t + 6]),
        median: Wh(e[t + 7]),
        q3: Wh(e[t + 8]),
        upper5: Wh(e[t + 9]),
        max: Wh(e[t + 10])
    }));
}

function Qh(e, t) {
    return e.filter(e => typeof e[t] == `string` && Gh.test(String(e[t]).trim())).map(e => ({
        code: String(e[t]).trim(),
        costOfEquity: {
            listed: Wh(e[t + 1]),
            large: Wh(e[t + 2]),
            medium: Wh(e[t + 3]),
            small: Wh(e[t + 4]),
            startup: Wh(e[t + 5])
        },
        equityRatio: Wh(e[t + 6]),
        costOfDebt: {
            listed: Wh(e[t + 7]),
            large: Wh(e[t + 8]),
            medium: Wh(e[t + 9]),
            small: Wh(e[t + 10]),
            startup: Wh(e[t + 11])
        }
    }));
}

function $h(e, t) {
    return e.filter(e => typeof e[t] == `string` && Kh.test(String(e[t]).trim())).map(e => ({
        code: String(e[t]).trim(),
        name: String(e[t + 1] ?? ``).trim(),
        average: Wh(e[t + 2]),
        q1: Wh(e[t + 3]),
        median: Wh(e[t + 4]),
        q3: Wh(e[t + 5])
    }));
}

function eg(e, t, n, r, i) {
    let a = t => e.filter(e => typeof e[t] == `string` && i.test(String(e[t]).trim())).length;
    if (t === `kipa` && a(r)) return r;
    if (a(n)) return n;
    let o = Math.max(0, ...e.map(e => e.length));
    for (let e = 0; e < o; e += 1) if (a(e) >= 3) return e;
    return n;
}

async function tg(e, t, n) {
    let r = await Xh(e), i = structuredClone(n), a = e.name.match(/20\d{2}[.\-_]?\d{2}[.\-_]?\d{2}/)?.[0]?.replaceAll(`_`, `.`).replaceAll(`-`, `.`) ?? (new Date).toISOString().slice(0, 10).replaceAll(`-`, `.`), o = Object.entries(r).find(([e]) => e.includes(`로열티`)), s = Object.entries(r).find(([e]) => e.includes(`할인율`)), c = Object.entries(r).find(([e]) => e.toUpperCase().includes(`TCT`) || e.includes(`경제적 수명`));
    if (o) {
        let e = eg(o[1], t, 0, 11, Gh), n = Zh(o[1], e);
        n.length && (i.royalty = n, i.versions.royalty = a);
    }
    if (s) {
        let e = eg(s[1], t, 0, 13, Gh), n = Qh(s[1], e);
        n.length && (i.discount = n, i.versions.discount = a);
    }
    if (c) {
        let e = eg(c[1], t, 0, 7, Kh), n = $h(c[1], e);
        n.length && (i.tct = n, i.versions.tct = a);
    }
    return {
        data: i,
        recognized: {
            tct: !!c,
            royalty: !!o,
            discount: !!s
        }
    };
}

var ng = {
    growth: 0,
    maturity: 1,
    decline: 2
}, rg = [ `신규성 또는 진보성 무효화 가능성`, `기타 요인에 의한 무효 가능성`, `제품 보호 가능성`, `IP포트폴리오 구축 적절성`, `침해발견 및 입증 용이성`, `권리행사 제한 가능성`, `분쟁 및 라이선스 활성도`, `특허출원 활성도` ], ig = [ 4, 4, 3, 3, 3, 4, 3, 3 ], ag = {
    superiority: 3,
    innovation: 3,
    utility: 3,
    differentiation: 4,
    techCompetition: 3,
    commercializationEnvironment: 4,
    substitutability: 3,
    infringement: 4,
    rippleEffect: 3,
    imitationDifficulty: 4,
    outlook: 3,
    rightStability: 4,
    protectionStrength: 3,
    enforcementEase: 3,
    ipTransactionMarketability: 3,
    marketEntry: 4,
    marketCompetition: 3,
    marketCompetitionChange: 3,
    marketGrowthOutlook: 3,
    newProductLikelihood: 3,
    demandSensitivity: 3,
    productionEase: 4,
    commercializationCapital: 3,
    salesGrowthTrend: 3,
    marketShare: 3,
    profitability: 4
}, og = [ {
    title: `기술성`,
    rows: [ {
        label: `우월성`,
        key: `superiority`
    }, {
        label: `혁신성`,
        key: `innovation`
    }, {
        label: `차별성`,
        key: `differentiation`
    }, {
        label: `기술경쟁강도`,
        key: `techCompetition`
    }, {
        label: `기술사업화환경`,
        key: `commercializationEnvironment`
    }, {
        label: `대체가능성`,
        key: `substitutability`
    }, {
        label: `침해성`,
        key: `infringement`
    }, {
        label: `파급성`,
        key: `rippleEffect`
    }, {
        label: `모방난이도`,
        key: `imitationDifficulty`
    }, {
        label: `전망성`,
        key: `outlook`
    } ]
}, {
    title: `권리성`,
    rows: [ {
        label: `권리안정성`,
        key: `rightStability`
    }, {
        label: `권리보호강도`,
        key: `protectionStrength`
    }, {
        label: `권리행사용이성`,
        key: `enforcementEase`
    }, {
        label: `지식재산거래시장성`,
        key: `ipTransactionMarketability`
    } ]
}, {
    title: `시장성`,
    rows: [ {
        label: `시장진입가능성`,
        key: `marketEntry`
    }, {
        label: `시장경쟁강도`,
        key: `marketCompetition`
    }, {
        label: `시장경쟁의 변화`,
        key: `marketCompetitionChange`
    }, {
        label: `시장 성장전망`,
        key: `marketGrowthOutlook`
    }, {
        label: `신제품 출현가능성`,
        key: `newProductLikelihood`
    }, {
        label: `수요민감도`,
        key: `demandSensitivity`
    } ]
}, {
    title: `사업성`,
    rows: [ {
        label: `생산용이성`,
        key: `productionEase`
    }, {
        label: `예상 시장점유율`,
        key: `marketShare`
    }, {
        label: `수익성`,
        key: `profitability`
    } ]
} ], sg = [ {
    group: `기술요인`,
    label: `우월성`,
    key: `superiority`,
    weight: 7
}, {
    group: `기술요인`,
    label: `기술경쟁강도`,
    key: `techCompetition`,
    weight: 4
}, {
    group: `기술요인`,
    label: `대체가능성`,
    key: `substitutability`,
    weight: 5
}, {
    group: `기술요인`,
    label: `모방난이도`,
    key: `imitationDifficulty`,
    weight: 3
}, {
    group: `기술요인`,
    label: `권리보호강도`,
    key: `protectionStrength`,
    weight: 3
}, {
    group: `시장요인`,
    label: `시장진입가능성`,
    key: `marketEntry`,
    weight: 4
}, {
    group: `시장요인`,
    label: `시장경쟁강도`,
    key: `marketCompetition`,
    weight: 4
}, {
    group: `시장요인`,
    label: `시장경쟁의 변화`,
    key: `marketCompetitionChange`,
    weight: 4
}, {
    group: `시장요인`,
    label: `신제품 출현가능성`,
    key: `newProductLikelihood`,
    weight: 3
}, {
    group: `시장요인`,
    label: `예상 시장점유율`,
    key: `marketShare`,
    weight: 4
} ], cg = [ {
    group: `기술적 특성`,
    label: `혁신성`,
    key: `innovation`
}, {
    group: `기술적 특성`,
    label: `차별성`,
    key: `differentiation`
}, {
    group: `기술적 특성`,
    label: `대체가능성`,
    key: `substitutability`
}, {
    group: `기술적 특성`,
    label: `전망성`,
    key: `outlook`
}, {
    group: `기술적 특성`,
    label: `파급성`,
    key: `rippleEffect`
}, {
    group: `시장·사업적 특성`,
    label: `시장경쟁강도`,
    key: `marketCompetition`
}, {
    group: `시장·사업적 특성`,
    label: `시장성장전망`,
    key: `marketGrowthOutlook`
}, {
    group: `시장·사업적 특성`,
    label: `수요민감도`,
    key: `demandSensitivity`
}, {
    group: `시장·사업적 특성`,
    label: `생산용이성`,
    key: `productionEase`
}, {
    group: `시장·사업적 특성`,
    label: `수익성`,
    key: `profitability`
} ], lg = [ {
    group: `기술 및 권리위험`,
    label: `차별성`,
    key: `differentiation`
}, {
    group: `기술 및 권리위험`,
    label: `기술경쟁강도`,
    key: `techCompetition`
}, {
    group: `기술 및 권리위험`,
    label: `기술사업화 환경`,
    key: `commercializationEnvironment`
}, {
    group: `기술 및 권리위험`,
    label: `모방난이도`,
    key: `imitationDifficulty`
}, {
    group: `기술 및 권리위험`,
    label: `권리안정성`,
    key: `rightStability`
}, {
    group: `시장 및 사업위험`,
    label: `시장진입가능성`,
    key: `marketEntry`
}, {
    group: `시장 및 사업위험`,
    label: `시장경쟁강도`,
    key: `marketCompetition`
}, {
    group: `시장 및 사업위험`,
    label: `시장 성장전망`,
    key: `marketGrowthOutlook`
}, {
    group: `시장 및 사업위험`,
    label: `생산용이성`,
    key: `productionEase`
}, {
    group: `시장 및 사업위험`,
    label: `수익성`,
    key: `profitability`
} ], ug = {
    superiority: `경쟁기술 대비 성능·품질·효율의 우수성`,
    innovation: `기존 기술과 구별되는 기술적 진전 수준`,
    differentiation: `경쟁기술과 구분되는 독자적 특성`,
    techCompetition: `유사기술의 수와 개발경쟁의 정도`,
    commercializationEnvironment: `사업화에 필요한 인프라·규제·공급환경`,
    substitutability: `다른 기술이나 제품으로 대체될 가능성`,
    infringement: `제품 구현 시 평가대상 권리를 실시할 개연성`,
    rippleEffect: `다른 제품·산업으로 확산될 가능성`,
    imitationDifficulty: `경쟁자가 기술을 모방하기 어려운 정도`,
    outlook: `기술의 향후 활용성과 발전 가능성`,
    rightStability: `무효 가능성이 낮고 권리가 안정적인 정도`,
    protectionStrength: `청구범위가 제품과 기술을 보호하는 정도`,
    enforcementEase: `침해 발견·입증 및 권리행사의 용이성`,
    ipTransactionMarketability: `라이선스·양도 등 거래 가능성`,
    marketEntry: `규제·유통·설비 등 시장진입 장벽의 수준`,
    marketCompetition: `시장 내 경쟁자와 경쟁강도의 수준`,
    marketCompetitionChange: `향후 경쟁구조가 유리하게 변화할 가능성`,
    marketGrowthOutlook: `목표시장의 중장기 성장 가능성`,
    newProductLikelihood: `대체 신제품이 출현할 가능성`,
    demandSensitivity: `가격·경기 등 외부요인에 대한 수요 민감도`,
    productionEase: `안정적 생산과 규모 확대의 용이성`,
    marketShare: `사업화제품이 확보할 것으로 예상되는 점유율`,
    profitability: `사업화주체와 동업종 수익구조 비교 결과`,
    utility: `사업전략과의 부합성 및 기술 활용을 통한 경제적 이익 창출 가능성`,
    commercializationCapital: `후속개발·실증·인증·생산준비에 필요한 자본 부담 수준`,
    salesGrowthTrend: `현금흐름 추정기간의 매출 성장률과 동업종·목표시장 성장률 비교 결과`
}, method1RatingGroups = [ {
    title: `기술성`,
    rows: [ `superiority`, `innovation`, `utility`, `differentiation`, `techCompetition`, `commercializationEnvironment`, `substitutability`, `imitationDifficulty` ]
}, {
    title: `권리성`,
    rows: [ `rightStability`, `protectionStrength`, `enforcementEase` ]
}, {
    title: `시장성`,
    rows: [ `marketEntry`, `marketCompetition`, `marketCompetitionChange`, `marketGrowthOutlook`, `newProductLikelihood`, `demandSensitivity`, `marketShare` ]
}, {
    title: `사업성`,
    rows: [ `productionEase`, `commercializationCapital`, `salesGrowthTrend`, `profitability` ]
} ].map(e => ({
    title: e.title,
    rows: e.rows.map(t => ({
        key: t,
        label: {
            superiority: `우월성`, innovation: `혁신성`, utility: `활용성`, differentiation: `차별성`, techCompetition: `기술경쟁강도`,
            commercializationEnvironment: `기술사업화환경`, substitutability: `대체가능성`, imitationDifficulty: `모방난이도`,
            rightStability: `권리안정성`, protectionStrength: `권리보호강도`, enforcementEase: `침해발견 및 입증용이성`,
            marketEntry: `시장진입가능성`, marketCompetition: `시장경쟁강도`, marketCompetitionChange: `시장경쟁의 변화`,
            marketGrowthOutlook: `시장 성장전망`, newProductLikelihood: `신제품 출현가능성`, demandSensitivity: `수요민감도`,
            marketShare: `예상 시장점유율`, productionEase: `생산용이성`, commercializationCapital: `사업화 소요자본`,
            salesGrowthTrend: `매출성장 추세`, profitability: `수익성`
        }[t]
    }))
})), method1LifeKeys = sg.map(e => e.key), method1AdjustmentRows = [ {
    group: `기술성`, label: `혁신성`, key: `innovation`
}, {
    group: `기술성`, label: `활용성`, key: `utility`
}, {
    group: `기술성`, label: `차별성`, key: `differentiation`
}, {
    group: `기술성`, label: `기술경쟁강도`, key: `techCompetition`
}, {
    group: `기술성`, label: `대체가능성`, key: `substitutability`
}, {
    group: `기술성`, label: `모방난이도`, key: `imitationDifficulty`
}, {
    group: `권리성`, label: `권리안정성`, key: `rightStability`
}, {
    group: `권리성`, label: `권리보호강도`, key: `protectionStrength`
}, {
    group: `권리성`, label: `침해발견 및 입증용이성`, key: `enforcementEase`
}, {
    group: `시장성·사업성`, label: `시장경쟁강도`, key: `marketCompetition`
}, {
    group: `시장성·사업성`, label: `수요민감도`, key: `demandSensitivity`
}, {
    group: `시장성·사업성`, label: `예상 시장점유율`, key: `marketShare`
}, {
    group: `시장성·사업성`, label: `사업화 소요자본`, key: `commercializationCapital`
}, {
    group: `시장성·사업성`, label: `매출성장 추세`, key: `salesGrowthTrend`
}, {
    group: `시장성·사업성`, label: `수익성`, key: `profitability`
} ], dg = e => [ ``, `매우 미흡`, `미흡`, `보통`, `우수`, `매우 우수` ][e] ?? `-`, $ = e => `${e.toFixed(2)}%`, fg = e => Number.isFinite(e) ? Math.round(e * 100) / 100 : 0;

function pg(e) {
    let [t, n, r] = e.split(`-`).map(Number), i = new Date(Date.UTC(t, (n || 1) - 1, r || 1));
    return Number.isFinite(i.getTime()) ? i : new Date(Date.UTC(2026, 7, 27));
}

function mg(e) {
    return e.toISOString().slice(0, 10);
}

function hg(e, t) {
    let n = new Date(e);
    return n.setUTCDate(n.getUTCDate() + t), n;
}

function gg(e, t) {
    let n = new Date(e);
    return n.setUTCFullYear(n.getUTCFullYear() + t), n;
}

function countCalendarYearPeriods(e, t) {
    let r = globalThis.MyeongValuationMethods?.calculateCalendarPeriodCount(mg(e), mg(t));
    if (Number.isInteger(r)) return r;
    if (t.getTime() < e.getTime()) return 0;
    let n = 0;
    while (gg(e, n).getTime() <= t.getTime()) n += 1;
    return n;
}

function addCalendarMonths(e, t) {
    let n = new Date(e), r = n.getUTCDate();
    n.setUTCDate(1), n.setUTCMonth(n.getUTCMonth() + t);
    let i = new Date(Date.UTC(n.getUTCFullYear(), n.getUTCMonth() + 1, 0)).getUTCDate();
    return n.setUTCDate(Math.min(r, i)), n;
}

function _g(e) {
    return `${e.replaceAll(`-`, `.`)}.`;
}

function vg(e, t) {
    return Math.round((t.getTime() - e.getTime()) / 864e5) + 1;
}

function yg(e) {
    return (Date.UTC(e + 1, 0, 1) - Date.UTC(e, 0, 1)) / 864e5;
}

function TaxEngineCard({ companyForm, effectiveRate, royaltyIncomes, taxRows, afterTaxRoyalty }) {
    return (0, W.jsxs)(`article`, {
        className: `stage-card span-2 tax-engine-card`,
        children: [ (0, W.jsxs)(`div`, {
            className: `card-title`,
            children: [ (0, W.jsxs)(`div`, {
                children: [ (0, W.jsx)(`span`, { className: `eyebrow`, children: `세금 자동계산 · 확인용` }), (0, W.jsxs)(`h2`, { children: [ companyForm === `corporation` ? `법인기업` : `개인사업자`, ` 누진세액` ] }) ]
            }), (0, W.jsx)(`span`, { className: `source-chip`, children: `2026년 시행 기준 · 수정 불가` }) ]
        }), (0, W.jsxs)(`div`, {
            className: `tax-reference-strip`,
            children: [ (0, W.jsxs)(`div`, { children: [ (0, W.jsx)(`span`, { children: `국세` }), (0, W.jsx)(`strong`, { children: companyForm === `corporation` ? `법인세법 제55조` : `소득세법 제55조` }) ] }), (0, W.jsxs)(`div`, { children: [ (0, W.jsx)(`span`, { children: `지방소득세` }), (0, W.jsx)(`strong`, { children: companyForm === `corporation` ? `지방세법 제103조의20·제103조의21` : `지방세법 제92조·제93조` }) ] }), (0, W.jsxs)(`div`, { children: [ (0, W.jsx)(`span`, { children: `평균 유효세율` }), (0, W.jsx)(`strong`, { children: $(effectiveRate) }) ] }) ]
        }), (0, W.jsx)(`div`, {
            className: `calculation-matrix-wrap tax-preview-table`,
            children: (0, W.jsxs)(`table`, {
                className: `calculation-matrix tax-calculation-table`,
                children: [ (0, W.jsx)(`thead`, { children: (0, W.jsxs)(`tr`, { children: [ (0, W.jsx)(`th`, { children: `구분` }), royaltyIncomes.map((e, index) => (0, W.jsxs)(`th`, { children: [ index + 1, `차년도` ] }, index)) ] }) }), (0, W.jsxs)(`tbody`, {
                    children: [
                        [ `과세표준(로열티수입)`, royaltyIncomes.map(value => value.toLocaleString(void 0, { minimumFractionDigits: 2, maximumFractionDigits: 2 })) ],
                        [ `과세표준 구간`, taxRows.map(row => row.bracket) ],
                        [ `구간 세율(지방세 포함)`, taxRows.map(row => $(row.combinedRate)) ],
                        [ `누진공제(백만원)`, taxRows.map(row => row.deduction.toLocaleString()) ],
                        [ `국세`, taxRows.map(row => row.national.toLocaleString(void 0, { minimumFractionDigits: 2, maximumFractionDigits: 2 })) ],
                        [ `지방소득세`, taxRows.map(row => row.local.toLocaleString(void 0, { minimumFractionDigits: 2, maximumFractionDigits: 2 })) ],
                        [ `세금 합계`, taxRows.map(row => row.total.toLocaleString(void 0, { minimumFractionDigits: 2, maximumFractionDigits: 2 })) ],
                        [ `세후 로열티수입`, afterTaxRoyalty.map(value => value.toLocaleString(void 0, { minimumFractionDigits: 2, maximumFractionDigits: 2 })) ]
                    ].map(([ label, values ], rowIndex) => (0, W.jsxs)(`tr`, { children: [ (0, W.jsx)(`th`, { children: label }), values.map((value, index) => (0, W.jsx)(`td`, { children: rowIndex >= 6 ? (0, W.jsx)(`strong`, { children: value }) : value }, index)) ] }, label))
                }) ]
            })
        }), (0, W.jsx)(`p`, { className: `card-help`, children: `과세표준별 국세 세율과 누진공제를 적용한 뒤 지방소득세를 별도 계산합니다. 이 표는 로열티 현금흐름 검산용이며 평가자가 수정할 수 없습니다.` }) ]
    });
}

function bg(e, t, n) {
    let i = t + 1, r = e.slice(0, i).map((e, t) => ({
        ...e,
        year: n + t
    }));
    for (;r.length < i; ) {
        let e = r.at(-1), t = e?.stage ?? `decline`;
        r.push({
            year: n + r.length,
            stage: t,
            preset: t === `decline` ? `lifecycle` : e?.preset ?? `weighted`,
            directRate: e?.directRate ?? 0
        });
    }
    return r;
}

function xg(e, t, n) {
    let i = Math.max(2, n), r = [ ...e ].sort((e, t) => e.year - t.year).filter(e => e[t] > 0).slice(-i);
    if (r.length < i || r.some((e, t) => t > 0 && e.year !== r[t - 1].year + 1)) return null;
    let a = r[0], o = r.at(-1), s = o.year - a.year;
    return s > 0 ? ((o[t] / a[t]) ** (1 / s) - 1) * 100 : null;
}

function Sg(e, t, n) {
    let i = Math.max(2, t), r = [ ...e ].sort((e, t) => e.year - t.year).filter(e => e.revenue > 0 && e.year <= n).slice(-i);
    if (r.length < i || r.some((e, t) => t > 0 && e.year !== r[t - 1].year + 1)) return 0;
    let a = r[0], o = r.at(-1), s = o.year - a.year;
    return s > 0 ? ((o.revenue / a.revenue) ** (1 / s) - 1) * 100 : 0;
}

function availableConsecutiveYears(e, t, n = 1 / 0) {
    let r = [ ...e ].filter(e => e.year <= n && e[t] > 0).sort((e, t) => t.year - e.year);
    if (!r.length) return 0;
    let i = 1;
    for (;i < r.length && r[i].year === r[i - 1].year - 1; i += 1) ;
    return Math.min(5, i);
}

function hasUsableEquityData(e) {
    return Number.isFinite(e?.totalAssets) && e.totalAssets > 0 && Number.isFinite(e.totalEquity);
}

function formatStickyCashFlowPeriod(e) {
    let t = Array.isArray(e?.cashFlows) ? e.cashFlows : [], n = t[0]?.period?.split(`~`)[0], r = t.at(-1)?.period?.split(`~`)[1];
    if (!n || !r) return `산출 전`;
    return `${e.economicLifeLabel || `0년 0개월`} : ${n.replaceAll(`-`, `.`)}.~${r.replaceAll(`-`, `.`)}.`;
}

function Cg(e, t) {
    let n = Math.max(0, e), r = (t === `corporation` ? [ {
        cap: 200,
        rate: .1,
        deduction: 0,
        label: `2억원 이하`
    }, {
        cap: 2e4,
        rate: .2,
        deduction: 20,
        label: `2억원 초과~200억원 이하`
    }, {
        cap: 3e5,
        rate: .22,
        deduction: 420,
        label: `200억원 초과~3,000억원 이하`
    }, {
        cap: 1 / 0,
        rate: .25,
        deduction: 9420,
        label: `3,000억원 초과`
    } ] : [ {
        cap: 14,
        rate: .06,
        deduction: 0,
        label: `1,400만원 이하`
    }, {
        cap: 50,
        rate: .15,
        deduction: 1.26,
        label: `1,400만원 초과~5,000만원 이하`
    }, {
        cap: 88,
        rate: .24,
        deduction: 5.76,
        label: `5,000만원 초과~8,800만원 이하`
    }, {
        cap: 150,
        rate: .35,
        deduction: 15.44,
        label: `8,800만원 초과~1억5,000만원 이하`
    }, {
        cap: 300,
        rate: .38,
        deduction: 19.94,
        label: `1억5,000만원 초과~3억원 이하`
    }, {
        cap: 500,
        rate: .4,
        deduction: 25.94,
        label: `3억원 초과~5억원 이하`
    }, {
        cap: 1e3,
        rate: .42,
        deduction: 35.94,
        label: `5억원 초과~10억원 이하`
    }, {
        cap: 1 / 0,
        rate: .45,
        deduction: 65.94,
        label: `10억원 초과`
    } ]).find(e => n <= e.cap), i = Math.max(0, n * r.rate - r.deduction), a = i * .1, o = i + a;
    return {
        national: i,
        local: a,
        total: o,
        effectiveRate: n ? o / n * 100 : 0,
        bracket: r.label,
        nationalRate: r.rate * 100,
        combinedRate: r.rate * 110,
        deduction: r.deduction
    };
}

async function extractPioneeringPdfText(file) {
    if (!file) throw new Error(`PDF 파일이 필요합니다.`);
    if (!window.pdfjsLib) throw new Error(`PDF 처리 모듈을 불러오지 못했습니다.`);
    window.pdfjsLib.GlobalWorkerOptions.workerSrc = `./assets/vendor/pdfjs/pdf.worker.min.js`;
    let documentTask = window.pdfjsLib.getDocument({
        data: new Uint8Array(await file.arrayBuffer())
    }), document = await documentTask.promise, pages = [];
    for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber += 1) {
        let page = await document.getPage(pageNumber), content = await page.getTextContent();
        pages.push(content.items.map(e => e.str).join(` `));
    }
    return pages.join(`\n`);
}

function wg({bank: e, companyForm: t, industry: n, evaluationDate: r, companyFinancials: i, salesMix: a, industryRevenueSeries: o, industryAssetMetrics, onSalesMixChange: s, relatedSalesBasis: c, onRelatedSalesBasisChange: l, domesticMarket: u, worldMarket: d, onDomesticMarketChange: f, onWorldMarketChange: p, companySize: m, patentIpcs: h, patentExpirationDates: g, patentCount: _, profitabilityScore: v, setNotice: y, onValueChange: b, onReportSnapshotChange: x}) {
    let [valuationMethod, setValuationMethod] = (0, C.useState)(`royaltyDeduction2`), [dcfPlannedNotice, setDcfPlannedNotice] = (0, C.useState)(!1), isMethod1 = valuationMethod === `royaltyDeduction1`, [lifeModel, setLifeModel] = (0, C.useState)(`model2`), [salesGrowthTrendManuallyAdjusted, setSalesGrowthTrendManuallyAdjusted] = (0, C.useState)(!1), [S, w] = (0, C.useState)(`growth`), [T, E] = (0, C.useState)(`totalRevenue`), [D, O] = (0,
    C.useState)(5), [k, A] = (0, C.useState)(5), [M, I] = (0, C.useState)(() => o.at(-1)?.year ?? 2024), [L, ee] = (0,
    C.useState)(!1), [B, V] = (0, C.useState)(null), [H, ie] = (0, C.useState)(`industry`), [U, ae] = (0,
    C.useState)(`domestic`), [se, ue] = (0, C.useState)(50), [pe, ge] = (0, C.useState)(`domestic`), [_e, ve] = (0,
    C.useState)(Number(r.slice(0, 4)) || 2026), [ye, be] = (0, C.useState)(1), [xe, Se] = (0,
    C.useState)(3), [Ce, we] = (0, C.useState)((Number(r.slice(0, 4)) || 2026) + 3), [Te, Ee] = (0,
    C.useState)([ {
        id: 1,
        name: `사업화제품 1`,
        values: {}
    } ]), [De, Oe] = (0, C.useState)([]), [ke, Ae] = (0, C.useState)([ {
        year: 2026,
        stage: `growth`,
        preset: `weighted`,
        directRate: 0
    }, {
        year: 2027,
        stage: `growth`,
        preset: `weighted`,
        directRate: 0
    }, {
        year: 2028,
        stage: `growth`,
        preset: `weighted`,
        directRate: 0
    }, {
        year: 2029,
        stage: `maturity`,
        preset: `half`,
        directRate: 0
    }, {
        year: 2030,
        stage: `maturity`,
        preset: `third`,
        directRate: 0
    }, {
        year: 2031,
        stage: `maturity`,
        preset: `lifecycle`,
        directRate: 0
    }, {
        year: 2032,
        stage: `decline`,
        preset: `lifecycle`,
        directRate: 0
    }, {
        year: 2033,
        stage: `decline`,
        preset: `lifecycle`,
        directRate: 0
    } ]), [je, Me] = (0, C.useState)(Em), [Ne, Pe] = (0, C.useState)(`kisti`), Fe = h.join(`|`), [Ie, Le] = (0,
    C.useState)(() => ({
        sourceKey: Fe,
        values: h
    })), Re = Ie.sourceKey === Fe ? Ie.values : h, ze = e => {
        Le(t => {
            let n = t.sourceKey === Fe ? t.values : h;
            return {
                sourceKey: Fe,
                values: typeof e == `function` ? e(n) : e
            };
        });
    }, [Be, Ve] = (0, C.useState)(``), [He, Ue] = (0, C.useState)(`daily`), [We, Ge] = (0,
    C.useState)(``), [Ke, qe] = (0, C.useState)({
        ...ag
    }), [method1PreparationYears, setMethod1PreparationYears] = (0, C.useState)(0), [method1PreparationMonths, setMethod1PreparationMonths] = (0, C.useState)(0), [method1AnnualCost, setMethod1AnnualCost] = (0,
    C.useState)(``), [method1Investments, setMethod1Investments] = (0, C.useState)([]), [method1IndustryAssetIncrease, setMethod1IndustryAssetIncrease] = (0,
    C.useState)(``), [method1IndustryResearchDevelopment, setMethod1IndustryResearchDevelopment] = (0, C.useState)(``), [method1PioneeringOverride, setMethod1PioneeringOverride] = (0,
    C.useState)(null), [method1PioneeringReason, setMethod1PioneeringReason] = (0, C.useState)(``), [method1PioneeringSource, setMethod1PioneeringSource] = (0,
    C.useState)(`starvalue-ecos`), [method1SourceDetail, setMethod1SourceDetail] = (0, C.useState)(``), [method1SourceBaseYear, setMethod1SourceBaseYear] = (0,
    C.useState)(``), [method1SourceSampleCount, setMethod1SourceSampleCount] = (0, C.useState)(``), [method1BenchmarkLookbackYears, setMethod1BenchmarkLookbackYears] = (0,
    C.useState)(3), [method1CretopIndustryCode, setMethod1CretopIndustryCode] = (0, C.useState)(String(n.code ?? ``).slice(0, 4)), [method1CretopIndustryName, setMethod1CretopIndustryName] = (0,
    C.useState)(n.name ?? ``), [method1CretopResearchRows, setMethod1CretopResearchRows] = (0, C.useState)(() => {
        let e = [ ...o ].sort((e, t) => e.year - t.year).at(-1)?.year ?? new Date().getUTCFullYear() - 1;
        return Array.from({ length: 3 }, (t, n) => ({
            year: e - 2 + n,
            incomeExpense: ``,
            incomeSampleCount: ``,
            manufacturingExpense: ``,
            manufacturingSampleCount: ``
        }));
    }), [method1EcosCustomData, setMethod1EcosCustomData] = (0, C.useState)(null), [method1PdfCandidate, setMethod1PdfCandidate] = (0,
    C.useState)(null), method1PdfInputRef = (0, C.useRef)(null), method1EcosInputRef = (0, C.useRef)(null), Je = {
        ...Ke,
        profitability: v
    }, [Ye, Xe] = (0, C.useState)(`kisti`), [Ze, Qe] = (0, C.useState)(`median`), [$e, et] = (0,
    C.useState)(null), [tt, nt] = (0, C.useState)(75), [rt, it] = (0, C.useState)([ {
        id: 1,
        technology: `열교환 핵심구조 설계기술`,
        weight: 60,
        patentShare: 80
    }, {
        id: 2,
        technology: `유로·제어 구조기술`,
        weight: 25,
        patentShare: 60
    }, {
        id: 3,
        technology: `조립·설치 연계기술`,
        weight: 15,
        patentShare: 80
    } ]), [at, ot] = (0, C.useState)(`kisti`), [st, ct] = (0, C.useState)(`company`), [lt, ut] = (0,
    C.useState)(Math.min(5, Math.max(1, i.length))), [G, dt] = (0, C.useState)(58.87), [ft, pt] = (0,
    C.useState)(``), [mt, ht] = (0, C.useState)(ig), [gt, _t] = (0, C.useState)(Math.max(1, _)), [vt, yt] = (0,
    C.useState)(!1), [bt, xt] = (0, C.useState)(4), [St, Ct] = (0, C.useState)(3), [wt, Tt] = (0,
    C.useState)(``), [Et, Dt] = (0, C.useState)(``), Ot = (0, C.useRef)(``), kt = (0,
    C.useRef)({
        kisti: null,
        kipa: null
    });
    Sm(mm, {
        valuationMethod,
        lifeModel,
        salesGrowthTrendManuallyAdjusted,
        salesMethod: S,
        companyGrowthBasis: T,
        companyGrowthYears: D,
        industryGrowthYears: k,
        industryGrowthEndYear: M,
        industryGrowthEndYearEdited: L,
        industryGrowthOverride: B,
        referenceGrowthSource: H,
        marketGrowthScope: U,
        companyWeight: se,
        marketShareScope: pe,
        firstRevenueYear: _e,
        firstMarketShare: ye,
        planYearCount: xe,
        planGrowthStartYear: Ce,
        salesPlanItems: Te,
        salesYears: ke,
        tctSource: Ne,
        selectedIpcs: Re,
        selectedIpcSourceKey: Fe,
        ipcQuery: Be,
        lifeRounding: He,
        lifeReason: We,
        ratings: Ke,
        method1PreparationYears,
        method1PreparationMonths,
        method1AnnualCost,
        method1Investments,
        method1IndustryAssetIncrease,
        method1IndustryResearchDevelopment,
        method1PioneeringOverride,
        method1PioneeringReason,
        method1PioneeringSource,
        method1SourceDetail,
        method1SourceBaseYear,
        method1SourceSampleCount,
        method1BenchmarkLookbackYears,
        method1CretopIndustryCode,
        method1CretopIndustryName,
        method1CretopResearchRows,
        method1EcosCustomData,
        royaltySource: Ye,
        royaltyStatistic: Ze,
        royaltyOverride: $e,
        utilization: tt,
        utilRows: rt,
        discountSource: at,
        equityMethod: st,
        financialYears: lt,
        directEquity: G,
        discountReason: ft,
        validity: mt,
        domesticIpCount: gt,
        overseasIp: vt,
        stabilityOverride: bt,
        protectionOverride: St,
        stabilityReason: wt,
        protectionReason: Et
    }, e => {
        setDcfPlannedNotice(!1), setValuationMethod(e.valuationMethod === `royaltyDeduction1` ? `royaltyDeduction1` : `royaltyDeduction2`),
        (e.lifeModel === `model1` || e.lifeModel === `model2`) && setLifeModel(e.lifeModel),
        typeof e.salesGrowthTrendManuallyAdjusted == `boolean` && setSalesGrowthTrendManuallyAdjusted(e.salesGrowthTrendManuallyAdjusted),
        typeof e.salesMethod == `string` && w(e.salesMethod), e.companyGrowthBasis && E(e.companyGrowthBasis),
        typeof e.companyGrowthYears == `number` && O(Math.max(2, e.companyGrowthYears)),
        typeof e.industryGrowthYears == `number` && A(Math.max(2, e.industryGrowthYears)),
        typeof e.industryGrowthEndYear == `number` && I(e.industryGrowthEndYear), typeof e.industryGrowthEndYearEdited == `boolean` && ee(e.industryGrowthEndYearEdited),
        (typeof e.industryGrowthOverride == `number` || e.industryGrowthOverride === null) && V(e.industryGrowthOverride),
        e.referenceGrowthSource && ie(e.referenceGrowthSource), e.marketGrowthScope && ae(e.marketGrowthScope),
        typeof e.companyWeight == `number` && ue(e.companyWeight), e.marketShareScope && ge(e.marketShareScope),
        typeof e.firstRevenueYear == `number` && ve(e.firstRevenueYear), typeof e.firstMarketShare == `number` && be(e.firstMarketShare),
        typeof e.planYearCount == `number` && Se(e.planYearCount), typeof e.planGrowthStartYear == `number` && we(e.planGrowthStartYear),
        Array.isArray(e.salesPlanItems) && Ee(e.salesPlanItems), Array.isArray(e.salesYears) && Ae(e.salesYears),
        e.tctSource && Pe(e.tctSource), e.selectedIpcSourceKey === Fe && Array.isArray(e.selectedIpcs) && ze(e.selectedIpcs),
        typeof e.ipcQuery == `string` && Ve(e.ipcQuery), typeof e.lifeRounding == `string` && Ue(e.lifeRounding),
        typeof e.lifeReason == `string` && Ge(e.lifeReason), e.ratings && qe({
            ...ag,
            ...e.ratings
        }),
        typeof e.method1PreparationYears == `number` && setMethod1PreparationYears(Math.max(0, e.method1PreparationYears)),
        typeof e.method1PreparationMonths == `number` && setMethod1PreparationMonths(Math.min(11, Math.max(0, e.method1PreparationMonths))),
        (typeof e.method1AnnualCost == `number` || typeof e.method1AnnualCost == `string`) && setMethod1AnnualCost(e.method1AnnualCost),
        Array.isArray(e.method1Investments) && setMethod1Investments(e.method1Investments),
        (typeof e.method1IndustryAssetIncrease == `number` || typeof e.method1IndustryAssetIncrease == `string`) && setMethod1IndustryAssetIncrease(e.method1IndustryAssetIncrease),
        (typeof e.method1IndustryResearchDevelopment == `number` || typeof e.method1IndustryResearchDevelopment == `string`) && setMethod1IndustryResearchDevelopment(e.method1IndustryResearchDevelopment),
        (typeof e.method1PioneeringOverride == `number` || e.method1PioneeringOverride === null) && setMethod1PioneeringOverride(e.method1PioneeringOverride),
        typeof e.method1PioneeringReason == `string` && setMethod1PioneeringReason(e.method1PioneeringReason),
        typeof e.method1PioneeringSource == `string` && setMethod1PioneeringSource(e.method1PioneeringSource),
        typeof e.method1SourceDetail == `string` && setMethod1SourceDetail(e.method1SourceDetail),
        (typeof e.method1SourceBaseYear == `number` || typeof e.method1SourceBaseYear == `string`) && setMethod1SourceBaseYear(e.method1SourceBaseYear),
        (typeof e.method1SourceSampleCount == `number` || typeof e.method1SourceSampleCount == `string`) && setMethod1SourceSampleCount(e.method1SourceSampleCount),
        typeof e.method1BenchmarkLookbackYears == `number` && setMethod1BenchmarkLookbackYears(Math.max(1, e.method1BenchmarkLookbackYears)),
        typeof e.method1CretopIndustryCode == `string` && setMethod1CretopIndustryCode(e.method1CretopIndustryCode),
        typeof e.method1CretopIndustryName == `string` && setMethod1CretopIndustryName(e.method1CretopIndustryName),
        Array.isArray(e.method1CretopResearchRows) && setMethod1CretopResearchRows(e.method1CretopResearchRows),
        e.method1EcosCustomData && Array.isArray(e.method1EcosCustomData.rows) && setMethod1EcosCustomData(e.method1EcosCustomData),
        e.royaltySource && Xe(e.royaltySource), typeof e.royaltyStatistic == `string` && Qe(e.royaltyStatistic),
        (typeof e.royaltyOverride == `number` || e.royaltyOverride === null) && et(e.royaltyOverride),
        typeof e.utilization == `number` && nt(e.utilization), Array.isArray(e.utilRows) && it(e.utilRows),
        e.discountSource && ot(e.discountSource), typeof e.equityMethod == `string` && ct(e.equityMethod),
        typeof e.financialYears == `number` && ut(e.financialYears), typeof e.directEquity == `number` && dt(e.directEquity),
        typeof e.discountReason == `string` && pt(e.discountReason), Array.isArray(e.validity) && ht(e.validity),
        typeof e.domesticIpCount == `number` && _t(e.domesticIpCount), typeof e.overseasIp == `boolean` && yt(e.overseasIp),
        typeof e.stabilityOverride == `number` && xt(e.stabilityOverride), typeof e.protectionOverride == `number` && Ct(e.protectionOverride),
        typeof e.stabilityReason == `string` && Tt(e.stabilityReason), typeof e.protectionReason == `string` && Dt(e.protectionReason);
    });
    let At = je.institutions[Ne], jt = je.institutions[Ye], Mt = je.institutions[at], Nt = jm(At, `tct`), Pt = jm(jt, `royalty`), Ft = jm(Mt, `discount`);
    (0, C.useEffect)(() => {
        let e = window.localStorage.getItem(`ip-valuation-reference-data-v1`);
        if (e) try {
            let t = JSON.parse(e);
            queueMicrotask(() => Me(t));
        } catch {}
    }, []);
    (0, C.useEffect)(() => {
        window.localStorage.setItem(`ip-valuation-current-method`, valuationMethod);
    }, [ valuationMethod ]);
    let It = [ ...o ].sort((e, t) => e.year - t.year).at(-1)?.year;
    (0, C.useEffect)(() => {
        It && !L && I(It);
    }, [ L, It ]);
    let zt = Qp(a, c), Bt = c.historicalSalesInputMode ?? `ratio`, Vt = c.historicalSalesShareByYear ?? {}, Ht = Zp(i, a), Ut = Bt === `ratio` ? Ht.map(e => ({
        ...e,
        productRevenue: e.totalRevenue * (Vt[e.year] ?? zt) / 100
    })) : Ht, Wt = [ ...Ut ].sort((e, t) => e.year - t.year).at(-1), Gt = Wt ? Vt[Wt.year] ?? zt : zt, Kt = Wt?.productRevenue ?? 0, ii = availableConsecutiveYears(Ut, T === `productRevenue` ? `productRevenue` : `totalRevenue`), ai = availableConsecutiveYears(o, `revenue`, M), oi = [ ...i ].filter(hasUsableEquityData).sort((e, t) => t.closingDate.localeCompare(e.closingDate)), si = Math.min(5, oi.length);
    (0, C.useEffect)(() => {
        ii >= 2 && D > ii && O(ii);
    }, [ ii, D ]), (0, C.useEffect)(() => {
        ai >= 2 && k > ai && (A(ai), V(null));
    }, [ ai, k ]), (0, C.useEffect)(() => {
        si > 0 && lt > si && ut(si), si === 0 && st === `company` && ct(`industry`);
    }, [ si, lt, st ]);
    let ecosRows = method1EcosCustomData?.rows ?? globalThis.ECOS_RD_RATIO_DATA?.rows ?? [], ecosSourceLabel = method1EcosCustomData?.source ?? globalThis.ECOS_RD_RATIO_DATA?.source ?? `한국은행 경제통계시스템(ECOS)`, normalizedIndustryCode = String(n.code ?? ``).replace(/[^A-Z0-9]/gi, ``).toUpperCase(), ecosMatch = ecosRows.map(e => ({ ...e, normalizedCode: String(e.code ?? ``).replace(/[^A-Z0-9]/gi, ``).toUpperCase() })).filter(e => normalizedIndustryCode.startsWith(e.normalizedCode) || normalizedIndustryCode.replace(/^[A-Z]/, ``).startsWith(e.normalizedCode)).sort((e, t) => t.normalizedCode.length - e.normalizedCode.length)[0] ?? null, method1AssetChanges = (industryAssetMetrics?.changes ?? []).filter(e => Number.isFinite(e.value)).sort((e, t) => e.year - t.year), method1AssetChangeByYear = new Map(method1AssetChanges.map(e => [ e.year, e.value / 1000 ])), method1AutoBenchmarkRows = [ ...o ].sort((e, t) => e.year - t.year).filter(e => Number.isFinite(e.revenue) && Number.isFinite(ecosMatch?.rates?.[e.year]) && Number.isFinite(method1AssetChangeByYear.get(e.year))).map(e => ({
        year: e.year,
        revenue: e.revenue,
        rate: ecosMatch.rates[e.year],
        assetIncrease: method1AssetChangeByYear.get(e.year),
        researchDevelopment: globalThis.MyeongValuationMethods.calculateEstimatedIndustryResearch(e.revenue, ecosMatch.rates[e.year])
    })), method1AvailableLookbackYears = method1AutoBenchmarkRows.length, method1AppliedLookbackYears = method1AvailableLookbackYears ? Math.min(method1BenchmarkLookbackYears, method1AvailableLookbackYears) : 0, ecosResearchValues = method1AppliedLookbackYears ? method1AutoBenchmarkRows.slice(-method1AppliedLookbackYears) : [], starvalueAutoAssetIncrease = ecosResearchValues.length ? ecosResearchValues.reduce((e, t) => e + t.assetIncrease, 0) / ecosResearchValues.length : null, ecosAutoResearchDevelopment = ecosResearchValues.length ? ecosResearchValues.reduce((e, t) => e + t.researchDevelopment, 0) / ecosResearchValues.length : null, method1CretopAssetRows = method1AssetChanges.slice(-3), method1CretopAutoAssetIncrease = method1CretopAssetRows.length === 3 ? method1CretopAssetRows.reduce((e, t) => e + t.value / 1000, 0) / 3 : null, method1CretopMetadataReady = method1CretopIndustryCode.trim().length === 4 && !!method1CretopIndustryName.trim(), method1CretopHasInput = method1CretopResearchRows.some(e => [ e.incomeExpense, e.incomeSampleCount, e.manufacturingExpense, e.manufacturingSampleCount ].some(e => e !== `` && e !== null && e !== undefined)), method1CretopCalculation = null, method1CretopError = ``;
    if (method1CretopHasInput) try {
        method1CretopCalculation = globalThis.MyeongValuationMethods?.calculateCretopResearchAverage(method1CretopResearchRows) ?? null;
    } catch (e) {
        method1CretopError = e instanceof Error ? e.message : `크레탑 경상개발비 입력값을 확인해 주세요.`;
    }
    (0, C.useEffect)(() => {
        if (method1PioneeringSource !== `starvalue-ecos`) return;
        if (starvalueAutoAssetIncrease === null || ecosAutoResearchDevelopment === null) {
            setMethod1IndustryAssetIncrease(``);
            setMethod1IndustryResearchDevelopment(``);
            setMethod1SourceBaseYear(``);
            setMethod1SourceSampleCount(``);
            setMethod1SourceDetail(`StarValue 자산증감·매출액과 ${ecosSourceLabel} 연구개발비율의 공통연도 자료가 필요합니다.`);
            return;
        }
        setMethod1IndustryAssetIncrease(Number(starvalueAutoAssetIncrease.toFixed(6)));
        setMethod1IndustryResearchDevelopment(Number(ecosAutoResearchDevelopment.toFixed(6)));
        setMethod1SourceBaseYear(ecosResearchValues.at(-1)?.year ?? ``);
        setMethod1SourceSampleCount(``);
        setMethod1SourceDetail(`KISTI StarValue 동업종 재무통계 + ${ecosSourceLabel} 연구개발비대매출액`);
    }, [ method1PioneeringSource, starvalueAutoAssetIncrease, ecosAutoResearchDevelopment, method1AppliedLookbackYears, ecosResearchValues.at(-1)?.year, ecosSourceLabel ]);
    (0, C.useEffect)(() => {
        if (method1PioneeringSource !== `starvalue-cretop`) return;
        if (method1CretopAutoAssetIncrease === null || !method1CretopMetadataReady || !method1CretopCalculation) {
            setMethod1IndustryAssetIncrease(``);
            setMethod1IndustryResearchDevelopment(``);
            setMethod1SourceBaseYear(``);
            setMethod1SourceSampleCount(``);
            setMethod1SourceDetail(`크레탑 산업분류·최근 3개년 경상개발비·연도별 대상기업 수와 StarValue 최근 3개년 자산증감 자료가 필요합니다.`);
            return;
        }
        setMethod1IndustryAssetIncrease(Number(method1CretopAutoAssetIncrease.toFixed(6)));
        setMethod1IndustryResearchDevelopment(Number(method1CretopCalculation.average.toFixed(6)));
        setMethod1SourceBaseYear(method1CretopCalculation.details.at(-1)?.year ?? ``);
        setMethod1SourceSampleCount(``);
        setMethod1SourceDetail(`KISTI StarValue 동업종 재무상태표 + 크레탑 산업통계(손익계산서·제조원가명세서 경상개발비)`);
    }, [ method1PioneeringSource, method1CretopAutoAssetIncrease, method1CretopMetadataReady, method1CretopCalculation?.average, method1CretopCalculation?.details?.at(-1)?.year ]);
    let Lt = Sg(o, k, M), Rt = B ?? Lt, qt = xg(Ut, `productRevenue`, D), Jt = Yp(i, D), Yt = T === `productRevenue` && qt === null, Xt = Yt ? `totalRevenue` : T, Zt = (Xt === `productRevenue` ? qt : Jt) ?? 0, Qt = lm(u), $t = lm(d), en = (Qt + $t) / 2, tn = U === `domestic` ? Qt : U === `world` ? $t : en, nn = pg(r), rn = nn.getUTCFullYear(), an = rn, on = rn + ke.length - 1, sn = um(u, rn, on), cn = um(d, rn, on), ln = (pe === `domestic` ? um(u, _e, _e)[0]?.value : pe === `world` ? um(d, _e, _e)[0]?.value : (um(u, _e, _e)[0]?.value ?? 0) + (um(d, _e, _e)[0]?.value ?? 0)) ?? 0, un = ln * ye / 100, dn = Math.max(1, Math.min(5, on - an + 1)), fn = Math.min(xe, dn), pn = Array.from({
        length: fn
    }, (e, t) => an + t), mn = pn.map(e => Te.reduce((t, n) => {
        let r = n.values[e] ?? {
            quantity: 0,
            unitPrice: 0
        };
        return t + r.quantity * r.unitPrice / 1e3;
    }, 0)), hn = new Map(pn.map((e, t) => [ e, mn[t] ?? 0 ])), gn = [ ...new Set([ ...Array.from({
        length: Math.max(1, Math.min(fn, on - an))
    }, (e, t) => an + t + 1), Math.min(on, an + fn) ]) ].sort((e, t) => e - t), _n = gn.includes(Ce) ? Ce : gn.at(-1) ?? Math.min(on, an + 1), vn = H === `market` ? tn : Rt, yn = Zt * se / 100 + vn * (100 - se) / 100, bn = mn[0] ?? 0, xn = Bt === `ratio` ? Xp(Wt?.totalRevenue ?? 0, Gt, yn) : Kt * (1 + yn / 100), Sn = S === `share` ? un : S === `plan` ? bn : S === `growth` ? xn : Kt, Cn = sg.reduce((e, t) => e + Je[t.key] * (t.weight ?? 1), 0), wn = Cn / 205 * 100, method1LifeScore = method1LifeKeys.reduce((e, t) => e + Je[t] - 3, 0), Tn = cg.reduce((e, t) => e + Je[t.key], 0), method1AdjustmentScore = method1AdjustmentRows.reduce((e, t) => e + Je[t.key] - 3, 0), method1AdjustmentCoefficient = 1 + method1AdjustmentScore / 30, En = lg.reduce((e, t) => e + Je[t.key], 0), Dn = je.businessRiskPremium[String(Math.min(50, Math.max(20, En)))] ?? 0, On = Re.map(e => Am(At.tct, e)).filter(e => !!e), kn = e => {
        let t = On.map(t => t[e]).filter(e => typeof e == `number`);
        return t.length ? t.reduce((e, t) => e + t, 0) / t.length : 0;
    }, An = kn(`q1`), jn = kn(`median`), Mn = kn(`q3`), Nn = Math.max(0, lifeModel === `model1` ? method1LifeScore < 0 ? An + (jn - An) * method1LifeScore / 20 : jn + (Mn - jn) * method1LifeScore / 20 : wn >= 60 ? jn + (Mn - jn) * (wn - 60) / 40 : An + (jn - An) * (wn - 20) / 40), Pn = He === `floor` ? Math.floor(Nn) : He === `round` ? Math.round(Nn) : Nn, Fn = Wp(r, g), In = Fn?.years ?? null, preparationTotalMonths = method1PreparationYears * 12 + method1PreparationMonths, preparationDurationYears = preparationTotalMonths / 12, preparationInvestmentPeriods = Math.ceil(preparationDurationYears), commercializationStart = addCalendarMonths(nn, preparationTotalMonths), Ln = Math.floor(Pn), Rn = Math.max(0, (Pn - Ln) * 365), economicEndFromCommercialization = Rn > 1e-4 ? hg(gg(commercializationStart, Ln), Math.max(1, Math.round(Rn)) - 1) : hg(gg(commercializationStart, Ln), -1), legalExpirationDate = Fn ? pg(Fn.expirationDate) : null, Bn = legalExpirationDate !== null && legalExpirationDate.getTime() < economicEndFromCommercialization.getTime(), finalValuationEnd = Bn ? legalExpirationDate : economicEndFromCommercialization, Vn = finalValuationEnd.getTime() < commercializationStart.getTime() ? 0 : vg(commercializationStart, finalValuationEnd) / 365, valuationPeriodYears = finalValuationEnd.getTime() < nn.getTime() ? 0 : vg(nn, finalValuationEnd) / 365, cashFlowPeriodCount = countCalendarYearPeriods(nn, finalValuationEnd), Hn = Math.max(2, cashFlowPeriodCount), Un = bg(ke, Hn, rn), Wn = (e, t) => e.preset === `weighted` ? yn : e.preset === `market` ? tn : e.preset === `industry` ? Rt : e.preset === `previous` ? t : e.preset === `half` ? t / 2 : e.preset === `third` ? t / 3 : e.preset === `quarter` ? t / 4 : e.preset === `direct` ? e.directRate : 0, Gn = Un.reduce((e, t, n) => {
        let r = rn + n, i = e.at(-1)?.rate ?? yn, a = ke.slice(0, n).filter(e => e.stage === `decline`).length, o = e.filter(e => e.stage === `maturity` && Math.abs(e.rate) > 1e-6).map(e => Math.abs(e.rate)).reverse(), s = -(o[a] ?? o.at(-1) ?? Math.abs(yn / 3)), c = S === `plan` && r < an, l = S === `plan` && r >= an && r < _n ? hn.get(r) ?? 0 : null, u = c ? 0 : l === null ? S === `plan` ? yn : t.stage === `decline` && t.preset === `lifecycle` ? s : t.stage === `maturity` && t.preset === `lifecycle` ? 0 : Wn(t, i) : n > 0 && e[n - 1].beforeProration > 0 ? (l / e[n - 1].beforeProration - 1) * 100 : 0, d = c ? `pre-revenue` : l === null ? S === `plan` ? `weighted` : t.stage === `decline` && t.preset === `lifecycle` ? `lifecycle-decline` : t.stage === `maturity` && t.preset === `lifecycle` ? `lifecycle-maturity` : t.preset : `sales-plan`, f = n === 0 ? Sn : e[n - 1].beforeProration, p = c ? 0 : l === null ? n === 0 ? Sn : f * (1 + u / 100) : l, m = p * (t.partialRatio ?? 1);
        return e.push({
            ...t,
            year: r,
            rate: u,
            beforeProration: p,
            amount: Math.round(m),
            rateBasis: d
        }), e;
    }, []), Kn = km(jt.royalty, n.code), qn = Ze === `average` ? Kn?.average : Kn?.median, Jn = $e ?? qn ?? 0, Yn = Kn?.q1 ?? Jn, Xn = Kn?.median ?? Jn, Zn = Kn?.q3 ?? Jn, Qn = Tn <= 30 ? Yn + (Xn - Yn) * Math.max(0, Tn - 10) / 20 : Xn + (Zn - Xn) * Math.min(20, Tn - 30) / 20, $n = Jn ? Qn / Jn : 0, method1AssetInputProvided = method1IndustryAssetIncrease !== `` && Number.isFinite(Number(method1IndustryAssetIncrease)), method1ResearchInputProvided = method1IndustryResearchDevelopment !== `` && Number.isFinite(Number(method1IndustryResearchDevelopment)), method1AutomaticBenchmarkReady = method1PioneeringSource === `starvalue-ecos` ? starvalueAutoAssetIncrease !== null && ecosAutoResearchDevelopment !== null : method1PioneeringSource === `starvalue-cretop` ? method1CretopAutoAssetIncrease !== null && method1CretopMetadataReady && !!method1CretopCalculation : true, method1InvestmentInputsReady = preparationTotalMonths === 0 || method1Investments.length >= preparationInvestmentPeriods && method1Investments.slice(0, preparationInvestmentPeriods).every(e => e !== `` && Number.isFinite(Number(e)) && Number(e) >= 0), method1CostTotal = preparationTotalMonths === 0 ? 0 : method1InvestmentInputsReady ? method1Investments.slice(0, preparationInvestmentPeriods).reduce((e, t) => e + Number(t), 0) : NaN, method1BenchmarkTotal = (Number(method1IndustryAssetIncrease) + Number(method1IndustryResearchDevelopment)) * preparationDurationYears, method1PioneeringInputsReady = preparationTotalMonths === 0 || method1AutomaticBenchmarkReady && method1InvestmentInputsReady && method1AssetInputProvided && method1ResearchInputProvided && method1BenchmarkTotal > 0, method1PioneeringRatio = preparationTotalMonths === 0 ? 0 : method1PioneeringInputsReady ? method1CostTotal / method1BenchmarkTotal : NaN, method1PioneeringRecommended = !method1PioneeringInputsReady ? null : preparationTotalMonths === 0 || method1PioneeringRatio < .5 ? 100 : method1PioneeringRatio <= 1 ? 75 : 50, method1PioneeringOverrideValid = method1PioneeringOverride === null || Number.isFinite(method1PioneeringOverride) && method1PioneeringOverride >= 50 && method1PioneeringOverride <= 100, method1PioneeringRate = method1PioneeringInputsReady && method1PioneeringOverrideValid ? method1PioneeringOverride ?? method1PioneeringRecommended : null, method1CalculationReady = !isMethod1 || method1PioneeringInputsReady && method1PioneeringOverrideValid, er = isMethod1 ? method1CalculationReady ? Jn * method1AdjustmentCoefficient * tt / 100 * method1PioneeringRate / 100 : NaN : Qn * tt / 100, tr = rt.reduce((e, t) => e + t.weight * t.patentShare / 100, 0), nr = rt.reduce((e, t) => e + t.weight, 0), rr = oi.map(im), ir = Math.min(lt, rr.length), ar = ir ? rr.slice(0, ir).reduce((e, t) => e + t, 0) / ir : 0, or = km(Mt.discount, n.code), sr = Dm(m), cr = or?.equityRatio ?? 0, lr = st === `company` && ir > 0 ? ar : st === `direct` ? G : cr, ur = or?.costOfEquity[sr] ?? 0, dr = ur + Dn, fr = or?.costOfDebt[sr] ?? 0, pr = new Date(Date.UTC(rn, 11, 31)), mr = hg(gg(nn, 1), -1), hr = vg(nn, pr), gr = new Date(Date.UTC(rn + 1, 0, 1)), _r = vg(gr, mr), vr = mg(mr), periodCount = cashFlowPeriodCount, periodStarts = Array.from({ length: periodCount }, (e, t) => gg(nn, t)), xr = periodStarts.map((e, t) => {
        let n = hg(gg(nn, t + 1), -1);
        return n.getTime() > finalValuationEnd.getTime() ? finalValuationEnd : n;
    }), yr = periodStarts.map((e, t) => vg(e, xr[t]) / 365), br = periodStarts.map((e, t) => yr[t] < .999 || e.getTime() < commercializationStart.getTime() && xr[t].getTime() >= commercializationStart.getTime()), Sr = mg(xr.at(-1) ?? hg(nn, -1)), Cr = periodStarts.map((e, t) => `${mg(e)}~${mg(xr[t])}`), wr = Math.max(0, preparationTotalMonths + Math.round(Vn * 12)), Tr = `${Math.floor(wr / 12)}년 ${wr % 12}개월`, Er = periodStarts.map((e, t) => xr[t].getTime() < commercializationStart.getTime() ? 0 : Up(mg(e.getTime() < commercializationStart.getTime() ? commercializationStart : e), mg(xr[t]), Gn.map(e => ({
        year: e.year,
        amount: e.beforeProration
    })))), Dr = gg(nn, Math.max(0, periodStarts.length - 1)), Or = xr.at(-1) ?? Dr, kr = Array.from({
        length: Or.getUTCFullYear() - Dr.getUTCFullYear() + 1
    }, (e, t) => Dr.getUTCFullYear() + t), Ar = kr.map(e => Gn.find(t => t.year === e)?.beforeProration ?? 0).map(e => Math.round(e).toLocaleString()).join(` · `), jr = Er.map(e => e * er / 100), Mr = jr.map(e => Cg(e, t)), Nr = jr.reduce((e, t) => e + t, 0), Pr = Nr ? Mr.reduce((e, t) => e + t.total, 0) / Nr * 100 : 0, Fr = dr * lr / 100 + fr * (1 - lr / 100) * (1 - Pr / 100), Ir = gt <= 1 ? 2 : vt ? 4 : 3, Lr = mt.map((e, t) => t === 3 ? Ir : e), Rr = Lr.reduce((e, t) => e + t, 0), zr = Rr / 40, Br = Math.min(Lr[0], Lr[1]), Vr = Math.min(Lr[2], Lr[3]), Hr = jr.map((e, t) => Math.max(0, e - Mr[t].total)), Ur = jr.map((e, t) => 1 / (1 + Fr / 100) ** (t + 1)), Wr = Hr.map((e, t) => e * Ur[t]), Gr = Wr.reduce((e, t) => e + t, 0), Kr = isMethod1 ? Gr : Gr * zr, qr = async (e, t) => {
        if (t) try {
            let n = await tg(t, e, je.institutions[e]), r = {
                ...je,
                importedFrom: `${t.name} · 사용자 업로드`,
                institutions: {
                    ...je.institutions,
                    [e]: n.data
                }
            };
            Me(r), window.localStorage.setItem(`ip-valuation-reference-data-v1`, JSON.stringify(r));
            let i = Object.entries(n.recognized).filter(([, e]) => e).map(([e]) => ({
                tct: `TCT`,
                royalty: `로열티율`,
                discount: `할인율`
            }[e])).join(`·`);
            y(`${n.data.label} 변수데이터를 갱신했습니다. 인식 항목: ${i || `확인 필요`}`);
        } catch {
            y(`변수데이터 엑셀을 읽지 못했습니다. 시트명과 표 머리글을 확인해 주세요.`);
        }
    }, Jr = () => {
        Me(Em), window.localStorage.removeItem(`ip-valuation-reference-data-v1`), y(`샘플 엑셀 기준 기본 변수데이터로 복원했습니다.`);
    };
    let forecastSalesCagr = globalThis.MyeongValuationMethods?.calculateForecastCagr(Er) ?? null, salesGrowthRecommendation = Number.isFinite(forecastSalesCagr) && Number.isFinite(Rt) ? globalThis.MyeongValuationMethods?.recommendSalesGrowthScore({
        forecastCagr: forecastSalesCagr,
        industryCagr: Rt
    }) ?? null : null;
    (0, C.useEffect)(() => {
        if (salesGrowthTrendManuallyAdjusted || !salesGrowthRecommendation || Ke.salesGrowthTrend === salesGrowthRecommendation.score) return;
        qe(e => ({
            ...e,
            salesGrowthTrend: salesGrowthRecommendation.score
        }));
    }, [ salesGrowthTrendManuallyAdjusted, salesGrowthRecommendation?.score, Ke.salesGrowthTrend ]);
    let method1OverrideReasonReady = method1PioneeringOverride === null || method1PioneeringOverride === method1PioneeringRecommended || method1PioneeringReason.trim().length > 0;
    if (isMethod1) {
        method1CalculationReady = method1CalculationReady && method1OverrideReasonReady;
        if (method1CalculationReady && globalThis.MyeongValuationMethods) {
            let method1PioneeringResult = globalThis.MyeongValuationMethods.calculatePioneeringRate({
                annualCommercializationCosts: method1Investments,
                industryAssetIncrease: method1IndustryAssetIncrease,
                industryResearchDevelopment: method1IndustryResearchDevelopment,
                preparationYears: method1PreparationYears,
                preparationMonths: method1PreparationMonths,
                overrideRate: method1PioneeringOverride,
                overrideReason: method1PioneeringReason
            });
            method1CostTotal = method1PioneeringResult.costTotal;
            method1BenchmarkTotal = method1PioneeringResult.benchmarkTotal;
            method1PioneeringRatio = method1PioneeringResult.ratio;
            method1PioneeringRecommended = method1PioneeringResult.recommendedRate;
            method1PioneeringRate = method1PioneeringResult.appliedRate;
            er = globalThis.MyeongValuationMethods.calculateRoyaltyRate1({
                baseRoyaltyRate: Jn,
                adjustmentCoefficient: method1AdjustmentCoefficient,
                technologyShare: tt,
                pioneeringRate: method1PioneeringRate
            });
            jr = Er.map(e => e * er / 100);
            Mr = jr.map(e => Cg(e, t));
            Nr = jr.reduce((e, t) => e + t, 0);
            Pr = Nr ? Mr.reduce((e, t) => e + t.total, 0) / Nr * 100 : 0;
            Fr = dr * lr / 100 + fr * (1 - lr / 100) * (1 - Pr / 100);
            let method1DcfResult = globalThis.MyeongValuationMethods.calculateDiscountedCashFlows({
                sales: Er,
                royaltyRate: er,
                discountRate: Fr,
                companyForm: t
            });
            Hr = method1DcfResult.cashFlows.map(e => e.afterTaxRoyalty);
            Ur = method1DcfResult.cashFlows.map(e => e.presentFactor);
            Wr = method1DcfResult.cashFlows.map(e => e.presentValue);
            Gr = method1DcfResult.presentValueTotal;
            Kr = Gr;
        }
    }
    (0, C.useEffect)(() => {
        b(method1CalculationReady ? Math.round(Kr) : null);
    }, [ Kr, b, method1CalculationReady ]), (0, C.useEffect)(() => {
        if (!x) return;
        let e = {
            growth: [ `성장률 추세 반영`, `혼합추정` ],
            share: [ `시장점유율 방식`, `시장점유율 매출추정` ],
            plan: [ `판매계획 방식`, `직접추정·혼합추정` ],
            direct: [ `평가자 직접입력`, `직접추정` ]
        }, [t, n] = e[S] ?? e.growth, r = {
            valuationMethod,
            valuationMethodLabel: isMethod1 ? `로열티공제법Ⅰ` : `로열티공제법Ⅱ`,
            salesMethod: S,
            salesMethodLabel: t,
            salesMethodClassification: n,
            initialSales: Sn,
            companyGrowth: Zt,
            referenceGrowth: vn,
            referenceGrowthLabel: H === `market` ? `목표시장 성장률` : `동업종 성장률`,
            weightedGrowth: yn,
            companyWeight: se,
            annualSales: Gn.map(e => ({
                year: e.year,
                stage: e.stage,
                rate: e.rate,
                beforeProration: e.beforeProration,
                rateBasis: e.rateBasis
            })),
            calculationComplete: method1CalculationReady,
            cashFlows: method1CalculationReady ? Er.map((e, t) => ({
                year: t + 1,
                period: Cr[t],
                sales: e,
                partial: br[t],
                royaltyIncome: jr[t],
                tax: Mr[t].total,
                afterTaxRoyalty: Hr[t],
                presentFactor: Ur[t],
                presentValue: Wr[t]
            })) : [],
            economicLife: Vn,
            economicLifeLabel: Tr,
            lifeModel,
            preparationYears: method1PreparationYears,
            preparationMonths: method1PreparationMonths,
            cashFlowPeriodYears: valuationPeriodYears,
            legalLifeApplied: Bn,
            baseRoyalty: Jn,
            finalRoyalty: method1CalculationReady ? er : null,
            utilization: tt,
            utilizationLabel: isMethod1 ? `기술의 비중` : `이용률`,
            adjustmentCoefficient1: isMethod1 ? method1AdjustmentCoefficient : null,
            adjustmentScore1: isMethod1 ? method1AdjustmentScore : null,
            pioneeringRate: isMethod1 ? method1PioneeringRate : null,
            pioneeringRatio: isMethod1 && method1PioneeringInputsReady ? method1PioneeringRatio : null,
            pioneeringCostTotal: isMethod1 && method1InvestmentInputsReady ? method1CostTotal : null,
            pioneeringBenchmarkTotal: isMethod1 && method1PioneeringInputsReady ? method1BenchmarkTotal : null,
            pioneeringSource: isMethod1 ? method1PioneeringSource : null,
            pioneeringSourceDetail: isMethod1 ? method1SourceDetail : null,
            pioneeringSourceBaseYear: isMethod1 ? method1SourceBaseYear : null,
            pioneeringSourceSampleCount: isMethod1 ? method1SourceSampleCount : null,
            pioneeringAverageYears: isMethod1 ? method1PioneeringSource === `starvalue-ecos` ? method1AppliedLookbackYears : 3 : null,
            pioneeringIndustryAssetIncrease: isMethod1 && method1AssetInputProvided ? Number(method1IndustryAssetIncrease) : null,
            pioneeringIndustryResearchDevelopment: isMethod1 && method1ResearchInputProvided ? Number(method1IndustryResearchDevelopment) : null,
            pioneeringCretopIndustryCode: isMethod1 && method1PioneeringSource === `starvalue-cretop` ? method1CretopIndustryCode : null,
            pioneeringCretopIndustryName: isMethod1 && method1PioneeringSource === `starvalue-cretop` ? method1CretopIndustryName : null,
            pioneeringCretopRows: isMethod1 && method1PioneeringSource === `starvalue-cretop` ? method1CretopCalculation?.details ?? [] : [],
            pioneeringEcosSource: isMethod1 && method1PioneeringSource === `starvalue-ecos` ? ecosSourceLabel : null,
            discountRate: Fr,
            validityRate: isMethod1 ? null : zr,
            presentValueTotal: method1CalculationReady ? Gr : null,
            finalValue: method1CalculationReady ? Kr : null,
            ratings: (isMethod1 ? method1RatingGroups : og).map(e => ({
                title: e.title,
                rows: e.rows.map(e => ({
                    label: e.label,
                    score: Je[e.key],
                    definition: ug[e.key]
                }))
            }))
        }, i = JSON.stringify(r);
        i !== Ot.current && (Ot.current = i, x(r));
    }, [ Gn, Vn, Tr, Je, br, Cr, Er, Zt, se, Fr, Sn, er, Kr, Bn, x, Ur, Gr, vn, H, jr, S, Mr, Hr, Wr, tt, zr, yn, Jn, valuationMethod, isMethod1, lifeModel, method1PreparationYears, method1PreparationMonths, valuationPeriodYears, method1AdjustmentCoefficient, method1AdjustmentScore, method1PioneeringRate, method1PioneeringRatio, method1CostTotal, method1BenchmarkTotal, method1PioneeringSource, method1SourceDetail, method1SourceBaseYear, method1SourceSampleCount, method1AppliedLookbackYears, method1IndustryAssetIncrease, method1IndustryResearchDevelopment, method1CretopIndustryCode, method1CretopIndustryName, method1CretopResearchRows, method1CretopCalculation?.average, ecosSourceLabel, method1CalculationReady, method1PioneeringInputsReady, method1InvestmentInputsReady ]);
    let Yr = (e, t, n, r) => {
        Ee(i => i.map(i => i.id === e ? {
            ...i,
            values: {
                ...i.values,
                [t]: {
                    ...i.values[t] ?? {
                        quantity: 0,
                        unitPrice: 0
                    },
                    [n]: Math.max(0, r)
                }
            }
        } : i));
    }, Xr = e => {
        Ee(t => t.filter(t => t.id !== e)), Oe(t => t.filter(t => t !== e));
    }, Zr = () => {
        De.length && (Ee(e => {
            let t = e.filter(e => !De.includes(e.id));
            return t.length ? t : [ {
                id: Date.now(),
                name: `사업화제품 1`,
                values: {}
            } ];
        }), Oe([]));
    }, Qr = (e, t) => {
        Ae(n => bg(n, Hn, rn).map((n, r) => r === e ? {
            ...n,
            ...t
        } : n));
    }, $r = (e, t) => {
        let n = Un.map((n, r) => r === e ? {
            ...n,
            stage: t,
            preset: t === `decline` ? `lifecycle` : n.preset === `lifecycle` ? t === `growth` ? `weighted` : `half` : n.preset
        } : n);
        if (n.some((e, t) => t > 0 && ng[e.stage] < ng[n[t - 1].stage])) {
            y(`수명주기는 성장기 → 성숙기 → 쇠퇴기 순서로만 변경할 수 있습니다.`);
            return;
        }
        let r = n.reduce((e, t, n) => t.stage === `maturity` ? n : e, -1);
        n = n.map((e, t) => e.stage === `decline` || e.stage === `maturity` && t === r ? {
            ...e,
            preset: `lifecycle`
        } : e.stage === `maturity` && e.preset === `lifecycle` ? {
            ...e,
            preset: `half`
        } : e), Ae(n);
    }, ei = (e, t) => {
        ht(n => n.map((n, r) => r === e ? t : n));
    }, ti = [ Re.length === 0 ? `대표 IPC를 한 개 이상 선택해야 합니다.` : null, He === `round` && !We.trim() ? `경제적 수명 반올림 근거가 필요합니다.` : null, nr === 100 ? null : `${isMethod1 ? `기술의 비중` : `이용률`} 구성기술 비중 합계가 100%가 아닙니다.`, isMethod1 && preparationTotalMonths > 0 && !method1InvestmentInputsReady ? `사업화 준비기간의 구간별 투자금액을 모두 입력해야 합니다.` : null, isMethod1 && preparationTotalMonths > 0 && (!method1AssetInputProvided || !method1ResearchInputProvided || method1BenchmarkTotal <= 0) ? `개척률 산정을 위한 동업종 유·무형자산 증가액과 연구개발비가 필요합니다.` : null, isMethod1 && !method1PioneeringOverrideValid ? `개척률 확정값은 50~100% 범위여야 합니다.` : null, isMethod1 && method1PioneeringOverride !== null && method1PioneeringOverride !== method1PioneeringRecommended && !method1PioneeringReason.trim() ? `개척률 자동추천값 변경 근거가 필요합니다.` : null, st === `direct` && !ft.trim() ? `자기자본비율 직접입력 근거가 필요합니다.` : null, !isMethod1 && bt > Br && !wt.trim() ? `권리안정성 상향근거가 필요합니다.` : null, !isMethod1 && St > Vr && !Et.trim() ? `권리보호강도 상향근거가 필요합니다.` : null, En < 20 || En > 50 ? `사업화위험 평점 합계는 20~50점 범위여야 합니다.` : null ].filter(Boolean);
    let pioneeringCard = isMethod1 ? (0, W.jsxs)(Eg, {
        title: `개척률 산정`,
        badge: `평가자 확정`,
        children: [ (0, W.jsx)(Dg, {
            label: `기준자료 경로`,
            children: (0, W.jsxs)(`select`, {
                value: method1PioneeringSource,
                onChange: e => setMethod1PioneeringSource(e.target.value),
                children: [ (0, W.jsx)(`option`, {
                    value: `starvalue-ecos`, children: `StarValue + 한국은행 ECOS 자동산출`
                }), (0, W.jsx)(`option`, {
                    value: `starvalue-cretop`, children: `StarValue + 크레탑 산업통계`
                }), (0, W.jsx)(`option`, {
                    value: `direct`, children: `평가자 직접입력`
                }), (0, W.jsx)(`option`, {
                    value: `kodata-table`, children: `KoDATA 업종별 개척률 표`
                }), (0, W.jsx)(`option`, {
                    value: `pdf`, children: `기타 PDF 산정표`
                }) ]
            })
        }), (0, W.jsx)(`input`, {
            className: `sr-only`, ref: method1PdfInputRef, type: `file`, accept: `.pdf,application/pdf`,
            onChange: async e => {
                let t = e.target.files?.[0];
                if (!t) return;
                try {
                    let n = await extractPioneeringPdfText(t), r = globalThis.MyeongValuationMethods?.parsePioneeringTableText(n);
                    setMethod1PdfCandidate({ ...r, fileName: t.name }), setMethod1PioneeringSource(`pdf`), y(`개척률 PDF에서 후보값을 인식했습니다. 검토 후 적용해 주세요.`);
                } catch {
                    setMethod1PdfCandidate(null), y(`개척률 PDF를 인식하지 못했습니다. 직접입력값을 사용해 주세요.`);
                }
                e.currentTarget.value = ``;
            }
        }), method1PioneeringSource === `pdf` && (0, W.jsxs)(`button`, {
            className: `detail-calc-button`, type: `button`, onClick: () => method1PdfInputRef.current?.click(),
            children: [ (0, W.jsx)(R, { size: 15 }), ` 개척률 산정표 PDF 불러오기` ]
        }), method1PioneeringSource === `pdf` && method1PdfCandidate && (0, W.jsxs)(`div`, {
            className: `reference-match-note`,
            children: [ (0, W.jsx)(`span`, { children: `PDF 인식 후보 · 자동확정 안 함` }), (0, W.jsx)(`strong`, { children: method1PdfCandidate.fileName }), (0, W.jsxs)(`small`, {
                children: [ `준비기간 `, method1PdfCandidate.preparationYears ?? `미인식`, `년 · 연간 투자 `, method1PdfCandidate.annualCommercializationCost ?? `미인식`, ` · 자산증감 `, method1PdfCandidate.industryAssetIncrease ?? `미인식`, ` · 연구개발비 `, method1PdfCandidate.industryResearchDevelopment ?? `미인식` ]
            }), (0, W.jsx)(`button`, {
                type: `button`,
                onClick: () => {
                    let e = method1PdfCandidate.preparationYears, t = Number.isFinite(e) ? Math.max(0, Math.floor(e)) : method1PreparationYears;
                    Number.isFinite(e) && (setMethod1PreparationYears(t), setMethod1PreparationMonths(0));
                    Number.isFinite(method1PdfCandidate.annualCommercializationCost) && (setMethod1AnnualCost(method1PdfCandidate.annualCommercializationCost), setMethod1Investments(Array.from({ length: t }, () => method1PdfCandidate.annualCommercializationCost)));
                    Number.isFinite(method1PdfCandidate.industryAssetIncrease) && setMethod1IndustryAssetIncrease(method1PdfCandidate.industryAssetIncrease);
                    Number.isFinite(method1PdfCandidate.industryResearchDevelopment) && setMethod1IndustryResearchDevelopment(method1PdfCandidate.industryResearchDevelopment);
                    setMethod1SourceDetail(method1PdfCandidate.fileName), y(`PDF 인식 후보값을 적용했습니다.`);
                },
                children: `인식값 적용`
            }) ]
        }), (0, W.jsx)(`input`, {
            className: `sr-only`, ref: method1EcosInputRef, type: `file`, accept: `.json,.csv,.tsv,.txt,application/json,text/csv,text/tab-separated-values,text/plain`,
            onChange: async e => {
                let t = e.target.files?.[0];
                if (!t) return;
                try {
                    let n = globalThis.MyeongValuationMethods?.parseEcosResearchRatioText(await t.text());
                    if (!n?.rows?.length) throw new Error(`유효한 업종별 비율이 없습니다.`);
                    setMethod1EcosCustomData({ ...n, source: `${n.source} · ${t.name}` }), y(`${t.name}의 ECOS 연구개발비율 ${n.rows.length}개 업종을 불러왔습니다.`);
                } catch (n) {
                    y(n instanceof Error ? n.message : `ECOS 연구개발비율 파일을 인식하지 못했습니다.`);
                }
                e.currentTarget.value = ``;
            }
        }), method1PioneeringSource === `starvalue-ecos` && (0, W.jsxs)(`div`, {
            className: `reference-match-note pioneering-auto-note`,
            children: [ (0, W.jsx)(`span`, { children: `필수 자동연결 · StarValue + ECOS` }), (0, W.jsx)(`strong`, {
                children: starvalueAutoAssetIncrease !== null && ecosAutoResearchDevelopment !== null ? `자동 반영됨 · 최근 ${method1AppliedLookbackYears}개년 평균` : `자료 대기`
            }), (0, W.jsxs)(`small`, {
                children: [ `유·무형자산 증감액 `, starvalueAutoAssetIncrease === null ? `산출 전` : `${starvalueAutoAssetIncrease.toLocaleString(`ko-KR`, { maximumFractionDigits: 6 })}백만원`, ` + 연구개발비 `, ecosAutoResearchDevelopment === null ? `산출 전` : `${ecosAutoResearchDevelopment.toLocaleString(`ko-KR`, { maximumFractionDigits: 6 })}백만원`, ` · `, ecosMatch?.code ?? `-`, ` `, ecosMatch?.name ?? `ECOS 일치 업종 없음` ]
            }), (0, W.jsxs)(`div`, {
                className: `pioneering-auto-controls`,
                children: [ (0, W.jsxs)(`label`, {
                    children: [ (0, W.jsx)(`span`, { children: `평균기간` }), (0, W.jsx)(`select`, {
                        value: method1AppliedLookbackYears || method1BenchmarkLookbackYears,
                        disabled: method1AvailableLookbackYears < 1,
                        onChange: e => setMethod1BenchmarkLookbackYears(Number(e.target.value)),
                        children: Array.from({ length: Math.max(1, method1AvailableLookbackYears) }, (e, t) => (0, W.jsxs)(`option`, { value: t + 1, children: [ t + 1, `개년` ] }, t + 1))
                    }) ]
                }), (0, W.jsxs)(`button`, {
                    type: `button`, onClick: () => method1EcosInputRef.current?.click(),
                    children: [ (0, W.jsx)(R, { size: 14 }), ` ECOS 최신자료 업로드` ]
                }), method1EcosCustomData && (0, W.jsx)(`button`, {
                    type: `button`, onClick: () => setMethod1EcosCustomData(null), children: `웹 내장자료로 복원`
                }) ]
            }), (0, W.jsxs)(`small`, {
                children: [ ecosSourceLabel, ` · `, ecosResearchValues.map(e => `${e.year}년 ${e.revenue.toLocaleString(`ko-KR`, { maximumFractionDigits: 3 })}×${e.rate}%`).join(` · `) || `StarValue 자산증감·매출액과 ECOS 비율의 공통연도 자료가 필요합니다.` ]
            }) ]
        }), method1PioneeringSource === `starvalue-cretop` && (0, W.jsxs)(`div`, {
            className: `cretop-pioneering-card`,
            children: [ (0, W.jsxs)(`div`, {
                className: `cretop-pioneering-head`,
                children: [ (0, W.jsxs)(`div`, { children: [ (0, W.jsx)(`strong`, { children: `크레탑 산업통계 경상개발비` }), (0, W.jsx)(`small`, { children: `산업분류 세세분류(넷째 자리) 기준 · 최근 3개년` }) ] }), (0, W.jsx)(`span`, { children: method1CretopCalculation && method1CretopAutoAssetIncrease !== null && method1CretopMetadataReady ? `자동 반영됨` : `입력 대기` }) ]
            }), (0, W.jsxs)(`div`, {
                className: `section-grid two-columns`,
                children: [ (0, W.jsx)(Dg, {
                    label: `산업분류코드(넷째 자리)`, children: (0, W.jsx)(`input`, { value: method1CretopIndustryCode, maxLength: 4, onChange: e => setMethod1CretopIndustryCode(e.target.value.replace(/\s/g, ``).slice(0, 4)) })
                }), (0, W.jsx)(Dg, {
                    label: `산업분류명`, children: (0, W.jsx)(`input`, { value: method1CretopIndustryName, onChange: e => setMethod1CretopIndustryName(e.target.value) })
                }) ]
            }), (0, W.jsx)(`div`, {
                className: `cretop-pioneering-table-wrap`,
                children: (0, W.jsxs)(`table`, {
                    className: `cretop-pioneering-table`,
                    children: [ (0, W.jsx)(`thead`, { children: (0, W.jsxs)(`tr`, { children: [ (0, W.jsx)(`th`, { children: `연도` }), (0, W.jsx)(`th`, { children: `손익 경상개발비 합계` }), (0, W.jsx)(`th`, { children: `손익 대상기업 수` }), (0, W.jsx)(`th`, { children: `제조원가 경상개발비 합계` }), (0, W.jsx)(`th`, { children: `제조원가 대상기업 수` }), (0, W.jsx)(`th`, { children: `기업당 합계` }) ] }) }), (0, W.jsx)(`tbody`, {
                        children: method1CretopResearchRows.map((e, t) => (0, W.jsxs)(`tr`, {
                            children: [ (0, W.jsx)(`td`, { children: (0, W.jsx)(`input`, { type: `number`, value: e.year, onChange: e => setMethod1CretopResearchRows(n => n.map((n, r) => r === t ? { ...n, year: e.target.value === `` ? `` : Number(e.target.value) } : n)) }) }), (0, W.jsx)(`td`, { children: (0, W.jsx)(`input`, { type: `number`, min: `0`, value: e.incomeExpense, onChange: e => setMethod1CretopResearchRows(n => n.map((n, r) => r === t ? { ...n, incomeExpense: e.target.value === `` ? `` : Math.max(0, Number(e.target.value)) } : n)) }) }), (0, W.jsx)(`td`, { children: (0, W.jsx)(`input`, { type: `number`, min: `1`, value: e.incomeSampleCount, onChange: e => setMethod1CretopResearchRows(n => n.map((n, r) => r === t ? { ...n, incomeSampleCount: e.target.value === `` ? `` : Math.max(1, Math.floor(Number(e.target.value))) } : n)) }) }), (0, W.jsx)(`td`, { children: (0, W.jsx)(`input`, { type: `number`, min: `0`, value: e.manufacturingExpense, onChange: e => setMethod1CretopResearchRows(n => n.map((n, r) => r === t ? { ...n, manufacturingExpense: e.target.value === `` ? `` : Math.max(0, Number(e.target.value)) } : n)) }) }), (0, W.jsx)(`td`, { children: (0, W.jsx)(`input`, { type: `number`, min: `1`, value: e.manufacturingSampleCount, onChange: e => setMethod1CretopResearchRows(n => n.map((n, r) => r === t ? { ...n, manufacturingSampleCount: e.target.value === `` ? `` : Math.max(1, Math.floor(Number(e.target.value))) } : n)) }) }), (0, W.jsx)(`td`, { children: method1CretopCalculation?.details?.[t] ? `${method1CretopCalculation.details[t].researchDevelopment.toLocaleString(`ko-KR`, { maximumFractionDigits: 6 })}` : `-` }) ]
                        }, t))
                    }) ]
                })
            }), (0, W.jsx)(`small`, { className: `cretop-unit-note`, children: `금액 단위: 백만원 · 각 명세서의 합계를 해당 연도·해당 명세서 대상기업 수로 나눈 뒤 합산합니다.` }), !method1CretopMetadataReady && (0, W.jsx)(`p`, { className: `cretop-input-error`, children: `산업분류코드 넷째 자리와 산업분류명을 입력해 주세요.` }), method1CretopError && (0, W.jsx)(`p`, { className: `cretop-input-error`, children: method1CretopError }), (0, W.jsxs)(`div`, {
                className: `reference-match-note`,
                children: [ (0, W.jsx)(`span`, { children: `최근 3개년 자동산출` }), (0, W.jsx)(`strong`, { children: method1CretopCalculation ? `${method1CretopCalculation.average.toLocaleString(`ko-KR`, { maximumFractionDigits: 6 })}백만원` : `산출 전` }), (0, W.jsx)(`small`, { children: `StarValue 유·무형자산 증감액과 크레탑 기업당 경상개발비 평균을 자동 결합합니다.` }) ]
            }), (0, W.jsx)(`p`, {
                className: `cretop-exclusion-note`, children: `※ 연구개발비는 손익계산서 및 제조원가명세서상의 경상개발비를 기준으로 산정하며, 무형자산 개발비 및 개발비상각액은 유·무형자산 증감액과의 중복 반영을 방지하기 위해 제외함.`
            }) ]
        }), ![ `starvalue-ecos`, `starvalue-cretop` ].includes(method1PioneeringSource) && (0, W.jsxs)(`div`, {
            className: `section-grid two-columns`,
            children: [ (0, W.jsx)(Dg, {
                label: `기준연도`, children: (0, W.jsx)(`input`, { type: `number`, value: method1SourceBaseYear, placeholder: `예: 2024`, onChange: e => setMethod1SourceBaseYear(e.target.value) })
            }), (0, W.jsx)(Dg, {
                label: `표본기업 수`, children: (0, W.jsx)(`input`, { type: `number`, min: `1`, value: method1SourceSampleCount, placeholder: `확인된 경우`, onChange: e => setMethod1SourceSampleCount(e.target.value) })
            }) ]
        }), (0, W.jsx)(Dg, {
            label: `동업종 평균 유·무형자산 증감(백만원)`, children: (0, W.jsx)(`input`, { type: `number`, readOnly: [ `starvalue-ecos`, `starvalue-cretop` ].includes(method1PioneeringSource), value: method1IndustryAssetIncrease, onChange: e => setMethod1IndustryAssetIncrease(e.target.value === `` ? `` : Number(e.target.value)) })
        }), (0, W.jsx)(Dg, {
            label: `동업종 평균 연구개발비(백만원)`, children: (0, W.jsx)(`input`, { type: `number`, min: `0`, readOnly: [ `starvalue-ecos`, `starvalue-cretop` ].includes(method1PioneeringSource), value: method1IndustryResearchDevelopment, onChange: e => setMethod1IndustryResearchDevelopment(e.target.value === `` ? `` : Math.max(0, Number(e.target.value))) })
        }), preparationTotalMonths > 0 && (0, W.jsxs)(`div`, {
            className: `method1-investment-grid`,
            children: [ (0, W.jsx)(`strong`, { children: `사업화 준비기간 구간별 투자금액(백만원)` }), Array.from({ length: preparationInvestmentPeriods }, (e, t) => (0, W.jsx)(Dg, {
                label: t === preparationInvestmentPeriods - 1 && method1PreparationMonths > 0 ? `${rn + t}년 중 ${method1PreparationMonths}개월` : `${rn + t}년`,
                children: (0, W.jsx)(`input`, {
                    type: `number`, min: `0`, value: method1Investments[t] ?? ``,
                    onChange: e => {
                        let n = [ ...method1Investments ];
                        n[t] = e.target.value === `` ? `` : Math.max(0, Number(e.target.value)), setMethod1Investments(n);
                    }
                })
            }, t)) ]
        }), (0, W.jsx)(Dg, {
            label: `출처 상세`, children: (0, W.jsx)(`textarea`, { readOnly: [ `starvalue-ecos`, `starvalue-cretop` ].includes(method1PioneeringSource), value: method1SourceDetail, onChange: e => setMethod1SourceDetail(e.target.value), placeholder: `자료명·작성기관·기준일` })
        }), (0, W.jsx)(Dg, {
            label: `개척률 확정값`,
            children: (0, W.jsxs)(`div`, {
                className: `pioneering-confirm-grid`,
                children: [ (0, W.jsxs)(`select`, {
                    value: method1PioneeringOverride === null ? `auto` : `manual`, onChange: e => setMethod1PioneeringOverride(e.target.value === `auto` ? null : method1PioneeringRecommended ?? 100),
                    children: [ (0, W.jsxs)(`option`, { value: `auto`, children: [ `자동추천 `, method1PioneeringRecommended ?? `산출 전`, method1PioneeringRecommended === null ? `` : `%` ] }), (0, W.jsx)(`option`, { value: `manual`, children: `평가자 직접확정` }) ]
                }), method1PioneeringOverride !== null && (0, W.jsxs)(`span`, {
                    className: `percent-input`,
                    children: [ (0, W.jsx)(`input`, { type: `number`, min: `50`, max: `100`, step: `0.01`, value: method1PioneeringOverride, onChange: e => setMethod1PioneeringOverride(e.target.value === `` ? NaN : Number(e.target.value)) }), (0, W.jsx)(`b`, { children: `%` }) ]
                }) ]
            })
        }), method1PioneeringOverride !== null && method1PioneeringOverride !== method1PioneeringRecommended && (0, W.jsx)(Dg, {
            label: `확정 근거`, children: (0, W.jsx)(`textarea`, { value: method1PioneeringReason, onChange: e => setMethod1PioneeringReason(e.target.value) })
        }), (0, W.jsxs)(`div`, {
            className: `result-callout`,
            children: [ (0, W.jsx)(`span`, { children: `개척률` }), (0, W.jsx)(`strong`, { children: method1PioneeringRate === null ? `산출 전` : `${method1PioneeringRate}%` }), (0, W.jsx)(`small`, { children: preparationTotalMonths === 0 ? `사업화 준비기간 0개월: 즉시 사업화 가능한 상태로 보아 개척률 100%를 적용합니다.` : method1PioneeringInputsReady ? `투자금액 ${method1CostTotal.toLocaleString()} ÷ 기준금액 ${method1BenchmarkTotal.toLocaleString()} · 기간 ${preparationDurationYears.toFixed(4)}년 · 비율 ${method1PioneeringRatio.toFixed(2)}` : `준비기간·연도별 투자금액·동업종 기준자료를 입력해 주세요. 개월은 12로 나눈 소수연수로 자동 환산합니다.` }) ]
        }) ]
    }) : null;
    return (0, W.jsxs)(`section`, {
        className: `valuation-workbench${isMethod1 ? ` method1-valuation-workbench` : ``}`,
        children: [ (0, W.jsxs)(`div`, {
            className: `applied-industry-banner valuation-industry-banner`,
            children: [ (0, W.jsxs)(`div`, {
                children: [ (0, W.jsx)(`span`, {
                    children: `전체 가치산정 기준 산업분류`
                }), (0, W.jsx)(`strong`, {
                    children: n.code
                }), (0, W.jsx)(`p`, {
                    children: n.name
                }) ]
            }), (0, W.jsxs)(`div`, {
                children: [ (0, W.jsx)(`span`, {
                    children: `연결 항목`
                }), (0, W.jsx)(`strong`, {
                    children: `업종평균 · 로열티율 · 할인율 · TCT`
                }), (0, W.jsx)(`p`, {
                    children: `업체정보의 사업화제품 기준값 적용`
                }) ]
            }) ]
        }), (0, W.jsxs)(`div`, {
            className: `valuation-method-grid`,
            children: [ (0, W.jsxs)(`article`, {
                className: `stage-card valuation-method-display`,
                children: [ (0, W.jsx)(`span`, {
                    className: `eyebrow`,
                    children: `현재 평가모형`
                }), (0, W.jsx)(`h2`, {
                    children: isMethod1 ? `로열티공제법Ⅰ` : `로열티공제법Ⅱ`
                }), (0, W.jsx)(`p`, {
                    children: `선택 모형에 맞춰 평점항목과 로열티율 산정표를 표출합니다.`
                }) ]
            }), (0, W.jsxs)(`article`, {
                className: `stage-card valuation-method-selector`,
                children: [ (0, W.jsxs)(`label`, {
                    children: [ (0, W.jsx)(`span`, {
                        children: `평가방법 선택`
                    }), (0, W.jsxs)(`select`, {
                        value: valuationMethod,
                        onChange: e => {
                            if (e.target.value === `discountedCashFlow`) {
                                setDcfPlannedNotice(!0);
                                return;
                            }
                            setDcfPlannedNotice(!1), setValuationMethod(e.target.value);
                        },
                        children: [ (0, W.jsx)(`option`, {
                            value: `royaltyDeduction2`,
                            children: `로열티공제법Ⅱ`
                        }), (0, W.jsx)(`option`, {
                            value: `royaltyDeduction1`,
                            children: `로열티공제법Ⅰ`
                        }), (0, W.jsx)(`option`, {
                            value: `discountedCashFlow`,
                            children: `DCF · 업데이트 예정`
                        }) ]
                    }) ]
                }), dcfPlannedNotice && (0, W.jsxs)(`div`, {
                    className: `valuation-method-planned-note`,
                    role: `status`,
                    children: [ (0, W.jsx)(`strong`, { children: `DCF 평가모형은 업데이트 예정입니다.` }), (0, W.jsx)(`span`, { children: `현재 저장·계산 중인 로열티공제법 모형과 입력값은 변경되지 않습니다.` }) ]
                }) ]
            }), (0, W.jsxs)(`article`, {
                className: `stage-card valuation-formula-card`,
                children: [ (0, W.jsx)(`span`, {
                    className: `eyebrow`,
                    children: `대표 산출식`
                }), (0, W.jsxs)(`div`, {
                    className: `valuation-formula-list`,
                    children: [ (0, W.jsxs)(`div`, {
                        className: isMethod1 ? `is-active` : ``,
                        children: [ (0, W.jsx)(`strong`, { children: `로열티공제법Ⅰ` }), (0, W.jsx)(`code`, { children: `Σ[매출액 × 기준 로열티율 × 조정계수1 × 기술의 비중 × 개척률 × (1−세율) × 현가계수]` }) ]
                    }), (0, W.jsxs)(`div`, {
                        className: isMethod1 ? `` : `is-active`,
                        children: [ (0, W.jsx)(`strong`, { children: `로열티공제법Ⅱ` }), (0, W.jsx)(`code`, { children: `Σ[매출액 × 조정 로열티율 × 이용률 × (1−세율) × 현가계수] × IP유효성` }) ]
                    }) ]
                }) ]
            }) ]
        }), (0, W.jsxs)(`details`, {
            className: `reference-data-manager`,
            children: [ (0, W.jsxs)(`summary`, {
                children: [ (0, W.jsxs)(`span`, {
                    children: [ (0, W.jsx)(z, {
                        size: 17
                    }), (0, W.jsx)(`strong`, {
                        children: `기관별 변수데이터 관리`
                    }), (0, W.jsx)(`small`, {
                        children: je.importedFrom
                    }) ]
                }), (0, W.jsx)(N, {
                    size: 17
                }) ]
            }), (0, W.jsxs)(`div`, {
                className: `reference-data-manager-body`,
                children: [ [ `kisti`, `kipa` ].map(e => {
                    let t = je.institutions[e];
                    return (0, W.jsxs)(`article`, {
                        children: [ (0, W.jsxs)(`div`, {
                            children: [ (0, W.jsx)(`span`, {
                                children: t.label
                            }), (0, W.jsxs)(`strong`, {
                                children: [ `TCT `, t.tct.length, `개 · 로열티 `, t.royalty.length, `개 · 할인율 `, t.discount.length, `개` ]
                            }), (0, W.jsxs)(`small`, {
                                children: [ `TCT `, t.versions.tct, ` · 로열티 `, t.versions.royalty, ` · 할인율 `, t.versions.discount ]
                            }) ]
                        }), (0, W.jsx)(`input`, {
                            className: `sr-only`,
                            ref: t => {
                                kt.current[e] = t;
                            },
                            type: `file`,
                            accept: `.xlsx`,
                            onChange: t => {
                                qr(e, t.target.files?.[0]), t.currentTarget.value = ``;
                            }
                        }), (0, W.jsxs)(`button`, {
                            type: `button`,
                            onClick: () => kt.current[e]?.click(),
                            children: [ (0, W.jsx)(R, {
                                size: 15
                            }), ` 엑셀 갱신` ]
                        }) ]
                    }, e);
                }), (0, W.jsxs)(`div`, {
                    className: `common-risk-reference`,
                    children: [ (0, W.jsx)(ne, {
                        size: 17
                    }), (0, W.jsxs)(`span`, {
                        children: [ (0, W.jsx)(`strong`, {
                            children: `사업화위험 프리미엄`
                        }), (0, W.jsxs)(`small`, {
                            children: [ `두 기관 공통 · 20~50점 `, Object.keys(je.businessRiskPremium).length, `개 구간` ]
                        }) ]
                    }), (0, W.jsxs)(`button`, {
                        type: `button`,
                        onClick: Jr,
                        children: [ (0, W.jsx)(ce, {
                            size: 14
                        }), ` 기본값 복원` ]
                    }) ]
                }) ]
            }) ]
        }), (0, W.jsxs)(`article`, {
            className: `stage-card value-calculation-card`,
            children: [ (0, W.jsxs)(`div`, {
                className: `card-title`,
                children: [ (0, W.jsx)(`h2`, {
                    children: `${isMethod1 ? `로열티공제법Ⅰ` : `로열티공제법Ⅱ`} 지식재산가치 산출표`
                }), (0, W.jsx)(`span`, {
                    className: `source-chip`,
                    children: `단위: 백만원`
                }) ]
            }), (0, W.jsx)(`div`, {
                className: `calculation-matrix-wrap`,
                children: (0, W.jsxs)(`table`, {
                    className: `calculation-matrix value-calculation-table`,
                    children: [ (0, W.jsx)(`thead`, {
                        children: (0, W.jsxs)(`tr`, {
                            children: [ (0, W.jsx)(`th`, {
                                children: `구분`
                            }), Er.map((e, t) => (0, W.jsxs)(`th`, {
                                children: [ t + 1, `차년도` ]
                            }, t)) ]
                        })
                    }), (0, W.jsxs)(`tbody`, {
                        children: [ (0, W.jsxs)(`tr`, {
                            children: [ (0, W.jsx)(`th`, {
                                children: `매출액`
                            }), Er.map((e, t) => (0, W.jsx)(`td`, {
                                children: Math.round(e).toLocaleString()
                            }, t)) ]
                        }), (0, W.jsxs)(`tr`, {
                            children: [ (0, W.jsx)(`th`, {
                                children: `적정 로열티율`
                            }), (0, W.jsx)(`td`, {
                                colSpan: Er.length,
                                children: (0, W.jsx)(`strong`, {
                                    children: $(er)
                                })
                            }) ]
                        }), (0, W.jsxs)(`tr`, {
                            children: [ (0, W.jsx)(`th`, {
                                children: `로열티 수입`
                            }), jr.map((e, t) => (0, W.jsx)(`td`, {
                                children: e.toLocaleString(void 0, {
                                    minimumFractionDigits: 1,
                                    maximumFractionDigits: 1
                                })
                            }, t)) ]
                        }), (0, W.jsxs)(`tr`, {
                            children: [ (0, W.jsx)(`th`, {
                                children: t === `corporation` ? `법인세비용` : `소득세비용`
                            }), Mr.map((e, t) => (0, W.jsx)(`td`, {
                                children: e.total.toLocaleString(void 0, {
                                    minimumFractionDigits: 1,
                                    maximumFractionDigits: 1
                                })
                            }, t)) ]
                        }), (0, W.jsxs)(`tr`, {
                            children: [ (0, W.jsxs)(`th`, {
                                children: [ `세후 로열티 수입`, (0, W.jsx)(`br`, {}), `(여유현금흐름)` ]
                            }), Hr.map((e, t) => (0, W.jsx)(`td`, {
                                children: e.toLocaleString(void 0, {
                                    minimumFractionDigits: 1,
                                    maximumFractionDigits: 1
                                })
                            }, t)) ]
                        }), (0, W.jsxs)(`tr`, {
                            children: [ (0, W.jsx)(`th`, {
                                children: `현가계수`
                            }), Ur.map((e, t) => (0, W.jsx)(`td`, {
                                children: e.toFixed(4)
                            }, t)) ]
                        }), (0, W.jsxs)(`tr`, {
                            children: [ (0, W.jsx)(`th`, {
                                children: `여유현금흐름 현재가치`
                            }), Wr.map((e, t) => (0, W.jsx)(`td`, {
                                children: e.toLocaleString(void 0, {
                                    minimumFractionDigits: 1,
                                    maximumFractionDigits: 1
                                })
                            }, t)) ]
                        }), (0, W.jsxs)(`tr`, {
                            className: `calculation-total-row`,
                            children: [ (0, W.jsx)(`th`, {
                                children: `현재가치의 합계`
                            }), (0, W.jsx)(`td`, {
                                colSpan: Er.length,
                                children: (0, W.jsx)(`strong`, {
                                    children: Gr.toLocaleString(void 0, {
                                        minimumFractionDigits: 1,
                                        maximumFractionDigits: 1
                                    })
                                })
                            }) ]
                        }), !isMethod1 && (0, W.jsxs)(`tr`, {
                            children: [ (0, W.jsx)(`th`, {
                                children: `지식재산 유효성`
                            }), (0, W.jsx)(`td`, {
                                colSpan: Er.length,
                                children: (0, W.jsx)(`strong`, {
                                    children: $(zr * 100)
                                })
                            }) ]
                        }) ]
                    }), (0, W.jsx)(`tfoot`, {
                        children: (0, W.jsxs)(`tr`, {
                            children: [ (0, W.jsx)(`th`, {
                                children: `지식재산 가치`
                            }), (0, W.jsx)(`td`, {
                                colSpan: Er.length,
                                children: (0, W.jsxs)(`strong`, {
                                    children: method1CalculationReady ? [ isMethod1 ? `현재가치 합계 = ` : `현재가치 합계 × 지식재산 유효성 = `, Math.round(Kr).toLocaleString(), `백만원` ] : `개척률 필수자료 입력 후 산출`
                                })
                            }) ]
                        })
                    }) ]
                })
            }), (0, W.jsxs)(`div`, {
                className: `calculation-table-notes`,
                children: [ (0, W.jsxs)(`span`, {
                    children: [ `※ 평가기준일: `, r.replaceAll(`-`, `.`) ]
                }), (0, W.jsx)(`span`, {
                    children: `※ 차년도별 매출액은 평가기준일 기준 일할 후 매출액입니다.`
                }), (0, W.jsx)(`span`, {
                    children: `※ 계산은 반올림 전 수치를 사용하고 표에는 반올림하여 표시합니다.`
                }) ]
            }) ]
        }), (0, W.jsxs)(`div`, {
            className: `valuation-summary-grid`,
            children: [ (0, W.jsxs)(`article`, {
                className: `value-hero compact-value-hero`,
                children: [ (0, W.jsx)(`span`, {
                    className: `eyebrow`,
                    children: `최종 IP가치`
                }), (0, W.jsxs)(`strong`, {
                    children: method1CalculationReady ? [ Math.round(Kr).toLocaleString(), `백만원` ] : `산출 전`
                }), (0, W.jsx)(`p`, {
                    children: `반올림 전 계산값으로 산출하고 화면에는 백만원 단위로 표시합니다.`
                }), (0, W.jsx)(`div`, {
                    className: `value-progress`,
                    children: (0, W.jsx)(`span`, {
                        style: {
                            width: ti.length ? `84%` : `100%`
                        }
                    })
                }), (0, W.jsx)(`small`, {
                    children: ti.length ? `${ti.length}개 확인사항 남음` : `필수 산식과 검산 완료`
                }) ]
            }), (0, W.jsxs)(`article`, {
                className: `stage-card valuation-formula-card`,
                children: [ (0, W.jsx)(`span`, {
                    className: `eyebrow`,
                    children: `핵심 산정값`
                }), (0, W.jsxs)(`div`, {
                    className: `formula-metrics`,
                    children: [ (0, W.jsxs)(`div`, {
                        children: [ (0, W.jsx)(`span`, {
                            children: `경제적 수명`
                        }), (0, W.jsxs)(`strong`, {
                            children: [ Vn.toFixed(2), `년` ]
                        }) ]
                    }), (0, W.jsxs)(`div`, {
                        children: [ (0, W.jsx)(`span`, {
                            children: `최종 로열티율`
                        }), (0, W.jsx)(`strong`, {
                            children: $(er)
                        }) ]
                    }), (0, W.jsxs)(`div`, {
                        children: [ (0, W.jsx)(`span`, {
                            children: `할인율`
                        }), (0, W.jsx)(`strong`, {
                            children: $(Fr)
                        }) ]
                    }), !isMethod1 && (0, W.jsxs)(`div`, {
                        children: [ (0, W.jsx)(`span`, {
                            children: `IP유효성`
                        }), (0, W.jsx)(`strong`, {
                            children: $(zr * 100)
                        }) ]
                    }), (0, W.jsxs)(`div`, {
                        className: `cash-flow-period-metric`,
                        children: [ (0, W.jsxs)(`span`, {
                            children: [ `현금흐름 추정기간 (`, Tr, `)` ]
                        }), (0, W.jsxs)(`strong`, {
                            children: [ `: `, _g(r), `~`, _g(Sr) ]
                        }) ]
                    }) ]
                }), (0, W.jsx)(`p`, {
                    className: `calculation-line`,
                    children: isMethod1 ? `예상매출 × 최종 로열티율 − 누진세액 × 할인계수` : `예상매출 × 최종 로열티율 − 누진세액 × IP유효성 × 할인계수`
                }) ]
            }), (0, W.jsxs)(`article`, {
                className: `stage-card valuation-check-card ${ti.length ? `has-warning` : `is-ready`}`,
                children: [ (0, W.jsxs)(`div`, {
                    className: `card-title`,
                    children: [ (0, W.jsxs)(`div`, {
                        children: [ (0, W.jsx)(`span`, {
                            className: `eyebrow`,
                            children: `실시간 검산`
                        }), (0, W.jsx)(`h3`, {
                            children: ti.length ? `확인 필요` : `산정 가능`
                        }) ]
                    }), ti.length ? (0, W.jsx)(he, {
                        size: 22
                    }) : (0, W.jsx)(P, {
                        size: 22
                    }) ]
                }), ti.length ? (0, W.jsx)(`ul`, {
                    children: ti.slice(0, 3).map(e => (0, W.jsx)(`li`, {
                        children: e
                    }, e))
                }) : (0, W.jsx)(`p`, {
                    children: `가중치·단위·근거·법적 잔존기간 검증을 통과했습니다.`
                }) ]
            }) ]
        }), (0, W.jsxs)(Pp, {
            defaultValue: `scores`,
            className: `valuation-tabs`,
            children: [ (0, W.jsxs)(Ip, {
                variant: `line`,
                className: `valuation-tabs-list`,
                children: [ (0, W.jsxs)(Lp, {
                    value: `scores`,
                    children: [ (0, W.jsx)(fe, {}), ` 평점 입력` ]
                }), (0, W.jsxs)(Lp, {
                    value: `sales`,
                    children: [ (0, W.jsx)(F, {}), ` 매출추정` ]
                }), (0, W.jsxs)(Lp, {
                    value: `life`,
                    children: [ (0, W.jsx)(te, {}), ` 경제적 수명` ]
                }), (0, W.jsxs)(Lp, {
                    value: `royalty`,
                    children: [ (0, W.jsx)(j, {}), isMethod1 ? ` 로열티율·기술의 비중` : ` 로열티율·이용률` ]
                }), (0, W.jsxs)(Lp, {
                    value: `tax`,
                    children: [ (0, W.jsx)(F, {}), ` 세금` ]
                }), (0, W.jsxs)(Lp, {
                    value: `discount`,
                    children: [ (0, W.jsx)(le, {}), ` 할인율` ]
                }), !isMethod1 && (0, W.jsxs)(Lp, {
                    value: `validity`,
                    children: [ (0, W.jsx)(de, {}), ` IP유효성` ]
                }), (0, W.jsxs)(Lp, {
                    value: `proration`,
                    children: [ (0, W.jsx)(N, {}), ` 일할계산 검증` ]
                }) ]
            }), (0, W.jsx)(Rp, {
                value: `scores`,
                className: `valuation-tab-content`,
                children: (0, W.jsxs)(`div`, {
                    className: `score-workspace`,
                    children: [ (0, W.jsxs)(`article`, {
                        className: `stage-card rating-input-card`,
                        children: [ (0, W.jsxs)(`div`, {
                            className: `card-title`,
                            children: [ (0, W.jsxs)(`div`, {
                                children: [ (0, W.jsx)(`span`, {
                                    className: `eyebrow`,
                                    children: `정의·평정 자동표시`
                                }), (0, W.jsx)(`h2`, {
                                    children: `평가자 평점 입력표`
                                }) ]
                            }), (0, W.jsx)(`span`, {
                                className: `source-chip`,
                                children: `우측 숫자 입력 → 체크 자동이동`
                            }) ]
                        }), (0, W.jsx)(`p`, {
                            className: `card-help`,
                            children: `가장 우측 평점 칸에 1~5점을 입력하면 해당 등급에 체크가 자동 표시됩니다. 등급 칸은 확인용이며 직접 선택하지 않습니다.`
                        }), (0, W.jsx)(`div`, {
                            className: `quickvalue-rating-sections`,
                            children: (isMethod1 ? method1RatingGroups : og).map(e => (0, W.jsxs)(`section`, {
                                className: `quickvalue-rating-section`,
                                children: [ (0, W.jsx)(`h3`, {
                                    children: e.title
                                }), (0, W.jsx)(`div`, {
                                    className: `quickvalue-rating-wrap`,
                                    children: (0, W.jsxs)(`table`, {
                                        className: `quickvalue-rating-table`,
                                        children: [ (0, W.jsx)(`thead`, {
                                            children: (0, W.jsxs)(`tr`, {
                                                children: [ (0, W.jsx)(`th`, {
                                                    children: `평가항목`
                                                }), (0, W.jsx)(`th`, {
                                                    children: `정의`
                                                }), (0, W.jsx)(`th`, {
                                                    children: isMethod1 ? `매우우수 (+2)` : `매우우수`
                                                }), (0, W.jsx)(`th`, {
                                                    children: isMethod1 ? `우수 (+1)` : `우수`
                                                }), (0, W.jsx)(`th`, {
                                                    children: isMethod1 ? `보통 (0)` : `보통`
                                                }), (0, W.jsx)(`th`, {
                                                    children: isMethod1 ? `미흡 (-1)` : `미흡`
                                                }), (0, W.jsx)(`th`, {
                                                    children: isMethod1 ? `매우미흡 (-2)` : `매우미흡`
                                                }), (0, W.jsx)(`th`, {
                                                    children: `평점 입력`
                                                }) ]
                                            })
                                        }), (0, W.jsx)(`tbody`, {
                                            children: e.rows.map(e => {
                                                let t = e.key === `profitability`, isSalesGrowth = e.key === `salesGrowthTrend`, n = Je[e.key];
                                                return (0, W.jsxs)(`tr`, {
                                                    className: t ? `linked-rating-row` : ``,
                                                    children: [ (0, W.jsxs)(`th`, {
                                                        children: [ e.label, t && (0, W.jsx)(`small`, {
                                                            children: `업종평균 연계`
                                                        }), isSalesGrowth && (0, W.jsx)(`small`, {
                                                            children: salesGrowthTrendManuallyAdjusted ? `평가자 조정` : `CAGR 자동추천`
                                                        }) ]
                                                    }), (0, W.jsx)(`td`, {
                                                        className: `rating-definition`,
                                                        children: ug[e.key]
                                                    }), [ 5, 4, 3, 2, 1 ].map(e => (0, W.jsx)(`td`, {
                                                        className: n === e ? `rating-check active` : `rating-check`,
                                                        "aria-label": `${dg(e)}${n === e ? ` 선택됨` : ``}`,
                                                        children: n === e ? `●` : ``
                                                    }, e)), (0, W.jsx)(`td`, {
                                                        className: `rating-number-input`,
                                                        children: (0, W.jsx)(`input`, {
                                                            "aria-label": `${e.label} 평점 입력`,
                                                            type: `number`,
                                                            min: `1`,
                                                            max: `5`,
                                                            value: n,
                                                            readOnly: t,
                                                            "aria-readonly": t,
                                                            onChange: t ? void 0 : event => {
                                                                let n = Math.min(5, Math.max(1, Number(event.target.value) || 1));
                                                                isSalesGrowth && setSalesGrowthTrendManuallyAdjusted(!0), qe(t => ({
                                                                    ...t,
                                                                    [e.key]: n
                                                                }));
                                                            }
                                                        })
                                                    }) ]
                                                }, e.key);
                                            })
                                        }) ]
                                    })
                                }) ]
                            }, e.title))
                        }), salesGrowthRecommendation && (0, W.jsxs)(`div`, {
                            className: `sales-growth-auto-note`,
                            children: [ (0, W.jsxs)(`span`, {
                                children: [ `일할 후 최초·최종 매출 CAGR `, forecastSalesCagr.toFixed(2), `% · StarValue 동업종 CAGR `, Rt.toFixed(2), `% → `, salesGrowthRecommendation.score, `점 추천` ]
                            }), salesGrowthTrendManuallyAdjusted && (0, W.jsx)(`button`, {
                                type: `button`,
                                onClick: () => {
                                    setSalesGrowthTrendManuallyAdjusted(!1), qe(e => ({
                                        ...e,
                                        salesGrowthTrend: salesGrowthRecommendation.score
                                    }));
                                },
                                children: `자동추천값으로 복원`
                            }) ]
                        }), (0, W.jsx)(`p`, {
                            className: `rating-footnote`,
                            children: isMethod1 ? `※ 입력은 1~5점이며 로열티Ⅰ 산식에서는 3점을 차감하여 -2~+2점으로 자동 환산합니다. 수익성은 업종평균 확정값과 연계됩니다.` : `※ 입력범위 1~5점 · 수익성은 업종평균 확정값으로 자동 연결되어 수정할 수 없습니다.`
                        }) ]
                    }), (0, W.jsxs)(`article`, {
                        className: `stage-card info-banner`,
                        children: [ (0, W.jsx)(re, {
                            size: 20
                        }), (0, W.jsxs)(`div`, {
                            children: [ (0, W.jsx)(`strong`, {
                                children: `입력 즉시 자동 연결`
                            }), (0, W.jsx)(`p`, {
                                children: `별도 저장 버튼 없이 경제적 수명·로열티율·할인율 산출표에 바로 반영됩니다. 각 산출표는 해당 가치산정 탭에서 확인합니다.`
                            }) ]
                        }) ]
                    }) ]
                })
            }), (0, W.jsxs)(Rp, {
                value: `sales`,
                className: `valuation-tab-content`,
                children: [ (0, W.jsxs)(`div`, {
                    className: `section-grid three-columns sales-settings-grid`,
                    children: [ (0, W.jsxs)(Eg, {
                        title: `최초 추정연도 매출액`,
                        badge: `평가자 확정값`,
                        children: [ (0, W.jsx)(Dg, {
                            label: `산정방식`,
                            children: (0, W.jsxs)(`select`, {
                                value: S,
                                onChange: e => w(e.target.value),
                                children: [ (0, W.jsx)(`option`, {
                                    value: `growth`,
                                    children: `성장률 추세 반영`
                                }), (0, W.jsx)(`option`, {
                                    value: `share`,
                                    children: `시장점유율법`
                                }), (0, W.jsx)(`option`, {
                                    value: `plan`,
                                    children: `연도별 판매계획`
                                }), (0, W.jsx)(`option`, {
                                    value: `direct`,
                                    children: `본평가 직접입력`
                                }) ]
                            })
                        }), S === `share` ? (0, W.jsxs)(`div`, {
                            className: `market-share-inline-settings`,
                            children: [ (0, W.jsx)(Dg, {
                                label: `최초 매출 발생연도`,
                                children: (0, W.jsx)(`input`, {
                                    type: `number`,
                                    value: _e,
                                    onChange: e => ve(Number(e.target.value))
                                })
                            }), (0, W.jsx)(Dg, {
                                label: `적용 시장`,
                                children: (0, W.jsxs)(`select`, {
                                    value: pe,
                                    onChange: e => ge(e.target.value),
                                    children: [ (0, W.jsx)(`option`, {
                                        value: `domestic`,
                                        children: `국내시장`
                                    }), (0, W.jsx)(`option`, {
                                        value: `world`,
                                        children: `해외(세계)시장`
                                    }), (0, W.jsx)(`option`, {
                                        value: `combined`,
                                        children: `국내+해외 합산`
                                    }) ]
                                })
                            }), (0, W.jsx)(Dg, {
                                label: `최초년도 목표시장 점유율`,
                                children: (0, W.jsx)(Og, {
                                    value: ye,
                                    onChange: be
                                })
                            }) ]
                        }) : null, (0, W.jsxs)(`div`, {
                            className: `result-callout`,
                            children: [ (0, W.jsx)(`span`, {
                                children: `산출 최초 매출액`
                            }), (0, W.jsxs)(`strong`, {
                                children: [ Sn.toLocaleString(void 0, {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2
                                }), `백만원` ]
                            }), (0, W.jsx)(`small`, {
                                children: S === `share` ? `시장규모 ${ln.toLocaleString(void 0, {
                                    maximumFractionDigits: 2
                                })} × ${$(ye)}` : S === `plan` ? `${an}년 품목별 판매수량 × 단가 합계` : S === `growth` && Bt === `ratio` ? `최근연도 전체 매출액 ${(Wt?.totalRevenue ?? 0).toLocaleString(void 0, {
                                    maximumFractionDigits: 2
                                })} × 매출액 비중 ${$(Gt)} × (1 + 가중성장률 ${$(yn)})` : S === `growth` ? `최근연도 사업화제품 매출액 ${Kt.toLocaleString(void 0, {
                                    maximumFractionDigits: 2
                                })} × (1 + 가중성장률 ${$(yn)})` : `최근연도 사업화제품 매출액 직접입력값`
                            }) ]
                        }) ]
                    }), (0, W.jsxs)(Eg, {
                        title: `성장률 후보`,
                        badge: `자동연결`,
                        children: [ (0, W.jsx)(Dg, {
                            label: `사업화주체 성장률 기준`,
                            children: (0, W.jsxs)(`select`, {
                                value: T,
                                onChange: e => E(e.target.value),
                                children: [ (0, W.jsx)(`option`, {
                                    value: `productRevenue`,
                                    children: `사업화제품 매출액`
                                }), (0, W.jsx)(`option`, {
                                    value: `totalRevenue`,
                                    children: `전체 매출액`
                                }) ]
                            })
                        }), (0, W.jsx)(Dg, {
                            label: `사업화주체 기준개년`,
                            children: (0, W.jsx)(`select`, {
                                value: D,
                                disabled: ii < 2,
                                onChange: e => {
                                    let t = Math.max(2, Number(e.target.value));
                                    O(t), A(t), V(null);
                                },
                                children: [ 2, 3, 4, 5 ].map(e => (0, W.jsxs)(`option`, {
                                    value: e,
                                    disabled: e > ii,
                                    children: [ `최근 `, e, `개년`, e > ii ? ` — 연속자료 부족` : `` ]
                                }, e))
                            })
                        }), (0, W.jsxs)(`div`, {
                            className: `linked-score-note`,
                            children: [ (0, W.jsx)(`span`, {
                                children: `적용 성장률`
                            }), (0, W.jsx)(`strong`, {
                                children: $(Zt)
                            }), (0, W.jsxs)(`small`, {
                                children: [ Xt === `productRevenue` ? `사업화제품 매출액` : `전체 매출액`, ` 기준`, Yt ? ` · 제품매출 이력 부족으로 자동 대체` : `` ]
                            }) ]
                        }), (0, W.jsxs)(`div`, {
                            className: `inline-year-selects market-growth-inputs`,
                            children: [ (0, W.jsx)(Dg, {
                                label: `국내시장 성장률`,
                                children: (0, W.jsx)(Og, {
                                    value: Qt,
                                    onChange: e => f({
                                        ...u,
                                        mode: `growth`,
                                        directGrowth: e
                                    })
                                })
                            }), (0, W.jsx)(Dg, {
                                label: `세계시장 성장률`,
                                children: (0, W.jsx)(Og, {
                                    value: $t,
                                    onChange: e => p({
                                        ...d,
                                        mode: `growth`,
                                        directGrowth: e
                                    })
                                })
                            }) ]
                        }), (0, W.jsx)(Dg, {
                            label: `동업종 성장률`,
                            children: (0, W.jsx)(Og, {
                                value: Rt,
                                onChange: V
                            })
                        }), (0, W.jsxs)(`div`, {
                            className: `inline-year-selects`,
                            children: [ (0, W.jsx)(Dg, {
                                label: `동업종 기준개년`,
                                children: (0, W.jsx)(`select`, {
                                    value: k,
                                    disabled: ai < 2,
                                    onChange: e => {
                                        A(Number(e.target.value)), V(null);
                                    },
                                    children: [ 2, 3, 4, 5 ].map(e => (0, W.jsxs)(`option`, {
                                        value: e,
                                        disabled: e > ai,
                                        children: [ e, `개년`, e > ai ? ` — 연속자료 부족` : `` ]
                                    }, e))
                                })
                            }), (0, W.jsx)(Dg, {
                                label: `동업종 최종년도`,
                                children: (0, W.jsx)(`input`, {
                                    type: `number`,
                                    value: M,
                                    onChange: e => {
                                        I(Number(e.target.value)), ee(!0), V(null);
                                    }
                                })
                            }) ]
                        }), (0, W.jsxs)(`div`, {
                            className: `industry-growth-link-note`,
                            children: [ (0, W.jsx)(`span`, {
                                children: `StarValue 매출액 자동산출`
                            }), (0, W.jsxs)(`strong`, {
                                children: [ M - k + 1, `~`, M, `년 CAGR `, $(Rt) ]
                            }), (0, W.jsx)(`small`, {
                                children: `기준개년 변경 시 즉시 재계산되며 성장률 입력값은 필요 시 직접 수정할 수 있습니다.`
                            }) ]
                        }) ]
                    }), (0, W.jsxs)(Eg, {
                        title: `가중치`,
                        badge: `합계 100%`,
                        children: [ (0, W.jsx)(Dg, {
                            label: `비교 성장률`,
                            children: (0, W.jsxs)(`select`, {
                                value: H,
                                onChange: e => ie(e.target.value),
                                children: [ (0, W.jsx)(`option`, {
                                    value: `market`,
                                    children: `목표시장 성장률`
                                }), (0, W.jsx)(`option`, {
                                    value: `industry`,
                                    children: `동업종 성장률`
                                }) ]
                            })
                        }), (0, W.jsx)(Dg, {
                            label: `사업화제품 ${se}%`,
                            children: (0, W.jsx)(`input`, {
                                type: `range`,
                                min: `0`,
                                max: `100`,
                                step: `10`,
                                value: se,
                                onChange: e => ue(Number(e.target.value))
                            })
                        }), (0, W.jsxs)(`div`, {
                            className: `result-callout`,
                            children: [ (0, W.jsx)(`span`, {
                                children: `가중성장률`
                            }), (0, W.jsx)(`strong`, {
                                children: $(yn)
                            }), (0, W.jsxs)(`small`, {
                                children: [ H === `market` ? `목표시장` : `동업종`, ` `, 100 - se, `% 반영` ]
                            }) ]
                        }), H === `market` && (0, W.jsxs)(`div`, {
                            className: `market-growth-inline-settings`,
                            children: [ (0, W.jsx)(`span`, {
                                children: `목표시장 적용 기준`
                            }), (0, W.jsx)(`div`, {
                                className: `market-growth-choice-grid compact`,
                                children: [ [ `domestic`, `국내시장 성장률`, Qt ], [ `world`, `세계(해외)시장 성장률`, $t ], [ `average`, `국내·해외 성장률 평균`, en ] ].map(([e, t, n]) => (0,
                                W.jsxs)(`label`, {
                                    className: U === e ? `active` : ``,
                                    children: [ (0, W.jsx)(`input`, {
                                        type: `radio`,
                                        name: `market-growth-scope`,
                                        value: e,
                                        checked: U === e,
                                        onChange: () => ae(e)
                                    }), (0, W.jsxs)(`span`, {
                                        children: [ (0, W.jsx)(`strong`, {
                                            children: t
                                        }), (0, W.jsx)(`small`, {
                                            children: $(n)
                                        }) ]
                                    }) ]
                                }, e))
                            }) ]
                        }) ]
                    }) ]
                }), S === `plan` && (0, W.jsxs)(`article`, {
                    className: `stage-card sales-plan-card`,
                    children: [ (0, W.jsxs)(`div`, {
                        className: `card-title sales-plan-title`,
                        children: [ (0, W.jsxs)(`div`, {
                            children: [ (0, W.jsx)(`span`, {
                                className: `eyebrow`,
                                children: `평가기준연도부터 품목·연도별 직접 작성`
                            }), (0, W.jsx)(`h2`, {
                                children: `연도별 판매계획`
                            }) ]
                        }), (0, W.jsxs)(`div`, {
                            className: `sales-plan-controls`,
                            children: [ (0, W.jsx)(Dg, {
                                label: `판매계획 기간`,
                                children: (0, W.jsx)(`select`, {
                                    value: fn,
                                    onChange: e => {
                                        let t = Number(e.target.value);
                                        Se(t), (Ce > an + t || Ce <= an) && we(Math.min(on, an + t));
                                    },
                                    children: [ 1, 2, 3, 4, 5 ].filter(e => e <= dn).map(e => (0, W.jsxs)(`option`, {
                                        value: e,
                                        children: [ e, `개년` ]
                                    }, e))
                                })
                            }), (0, W.jsx)(Dg, {
                                label: `성장률 반영 시작`,
                                children: (0, W.jsx)(`select`, {
                                    value: _n,
                                    onChange: e => we(Number(e.target.value)),
                                    children: gn.map(e => (0, W.jsxs)(`option`, {
                                        value: e,
                                        children: [ e, `년부터` ]
                                    }, e))
                                })
                            }) ]
                        }) ]
                    }), (0, W.jsxs)(`p`, {
                        className: `card-help`,
                        children: [ `판매수량과 품목별 단가(천원)를 입력하면 연도별 매출액(백만원)을 자동 합산합니다. 선택한 `, _n, `년부터는 직전년도 매출액에 가중성장률을 적용하여 별도 추정합니다.` ]
                    }), (0, W.jsx)(`div`, {
                        className: `sales-plan-table-wrap`,
                        children: (0, W.jsxs)(`table`, {
                            className: `sales-plan-table`,
                            children: [ (0, W.jsx)(`thead`, {
                                children: (0, W.jsxs)(`tr`, {
                                    children: [ (0, W.jsx)(`th`, {
                                        className: `sales-plan-select-column`,
                                        children: `선택`
                                    }), (0, W.jsx)(`th`, {
                                        children: `매출 품목`
                                    }), pn.map(e => (0, W.jsxs)(`th`, {
                                        className: e >= _n ? `growth-transition` : ``,
                                        children: [ e, `년`, (0, W.jsx)(`span`, {
                                            children: e >= _n ? `성장률 추정 전환` : `수량 · 단가(천원) · 매출액`
                                        }) ]
                                    }, e)), (0, W.jsx)(`th`, {
                                        children: `관리`
                                    }) ]
                                })
                            }), (0, W.jsx)(`tbody`, {
                                children: Te.map(e => (0, W.jsxs)(`tr`, {
                                    className: De.includes(e.id) ? `selected-sales-plan-row` : ``,
                                    children: [ (0, W.jsx)(`td`, {
                                        className: `sales-plan-select-column`,
                                        children: (0, W.jsx)(`input`, {
                                            "aria-label": `${e.name} 삭제 선택`,
                                            type: `checkbox`,
                                            checked: De.includes(e.id),
                                            onChange: t => Oe(n => t.target.checked ? [ ...n, e.id ] : n.filter(t => t !== e.id))
                                        })
                                    }), (0, W.jsx)(`td`, {
                                        children: (0, W.jsx)(`input`, {
                                            "aria-label": `매출 품목명`,
                                            value: e.name,
                                            onChange: t => Ee(n => n.map(n => n.id === e.id ? {
                                                ...n,
                                                name: t.target.value
                                            } : n))
                                        })
                                    }), pn.map(t => {
                                        let n = e.values[t] ?? {
                                            quantity: 0,
                                            unitPrice: 0
                                        };
                                        return (0, W.jsx)(`td`, {
                                            children: (0, W.jsxs)(`div`, {
                                                className: `sales-plan-year-inputs`,
                                                children: [ (0, W.jsxs)(`label`, {
                                                    children: [ (0, W.jsx)(`span`, {
                                                        children: `수량`
                                                    }), (0, W.jsx)(`input`, {
                                                        type: `number`,
                                                        min: `0`,
                                                        value: n.quantity,
                                                        onChange: n => Yr(e.id, t, `quantity`, Number(n.target.value))
                                                    }) ]
                                                }), (0, W.jsxs)(`label`, {
                                                    children: [ (0, W.jsx)(`span`, {
                                                        children: `단가`
                                                    }), (0, W.jsx)(`input`, {
                                                        type: `number`,
                                                        min: `0`,
                                                        value: n.unitPrice,
                                                        onChange: n => Yr(e.id, t, `unitPrice`, Number(n.target.value))
                                                    }) ]
                                                }), (0, W.jsx)(`strong`, {
                                                    children: (n.quantity * n.unitPrice / 1e3).toLocaleString(void 0, {
                                                        minimumFractionDigits: 2,
                                                        maximumFractionDigits: 2
                                                    })
                                                }) ]
                                            })
                                        }, t);
                                    }), (0, W.jsx)(`td`, {
                                        children: (0, W.jsx)(`button`, {
                                            type: `button`,
                                            "aria-label": `${e.name} 삭제`,
                                            disabled: Te.length === 1,
                                            onClick: () => Xr(e.id),
                                            children: (0, W.jsx)(me, {
                                                size: 15
                                            })
                                        })
                                    }) ]
                                }, e.id))
                            }), (0, W.jsx)(`tfoot`, {
                                children: (0, W.jsxs)(`tr`, {
                                    children: [ (0, W.jsx)(`td`, {
                                        className: `sales-plan-select-column`
                                    }), (0, W.jsx)(`th`, {
                                        children: `연도별 계획매출액`
                                    }), mn.map((e, t) => (0, W.jsxs)(`td`, {
                                        children: [ (0, W.jsx)(`strong`, {
                                            children: e.toLocaleString(void 0, {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2
                                            })
                                        }), (0, W.jsx)(`span`, {
                                            children: `백만원`
                                        }) ]
                                    }, pn[t])), (0, W.jsx)(`td`, {}) ]
                                })
                            }) ]
                        })
                    }), (0, W.jsxs)(`div`, {
                        className: `sales-plan-actions`,
                        children: [ (0, W.jsxs)(`button`, {
                            className: `add-row-button sales-plan-add`,
                            type: `button`,
                            onClick: () => Ee(e => [ ...e, {
                                id: Date.now(),
                                name: `사업화제품 ${e.length + 1}`,
                                values: {}
                            } ]),
                            children: [ (0, W.jsx)(oe, {
                                size: 14
                            }), ` 매출 품목 추가` ]
                        }), (0, W.jsxs)(`button`, {
                            className: `delete-row-button sales-plan-delete`,
                            type: `button`,
                            disabled: !De.length,
                            onClick: Zr,
                            children: [ (0, W.jsx)(me, {
                                size: 14
                            }), ` 선택 품목 삭제`, De.length ? ` (${De.length})` : `` ]
                        }) ]
                    }) ]
                }), (0, W.jsxs)(`div`, {
                    className: `sales-reference-grid`,
                    children: [ (0, W.jsx)(Ag, {
                        rows: i,
                        salesMix: Ut,
                        years: D
                    }), (0, W.jsx)(jg, {
                        rows: Ut,
                        years: D,
                        onChange: s,
                        inputMode: Bt,
                        shareByYear: Vt,
                        defaultShare: zt,
                        onInputModeChange: e => {
                            e === `amount` && s(Ut), l({
                                ...c,
                                historicalSalesInputMode: e
                            }), y(e === `ratio` ? `업종평균에서 확정한 매출액 비중을 과거 각 연도에 동일하게 적용했습니다.` : `사업화제품 매출액 직접입력 방식으로 전환했습니다.`);
                        },
                        onShareChange: (e, t) => l({
                            ...c,
                            historicalSalesShareByYear: {
                                ...Vt,
                                [e]: Math.min(100, Math.max(0, t))
                            }
                        })
                    }) ]
                }), (0, W.jsxs)(`div`, {
                    className: `market-projection-grid`,
                    children: [ (0, W.jsx)(Mg, {
                        title: `국내시장 규모 및 전망`,
                        market: u,
                        onMarketChange: f,
                        rows: sn
                    }), (0, W.jsx)(Mg, {
                        title: `해외(세계)시장 규모 및 전망`,
                        market: d,
                        onMarketChange: p,
                        rows: cn
                    }) ]
                }), (0, W.jsxs)(`article`, {
                    className: `stage-card detailed-sales-card`,
                    children: [ (0, W.jsxs)(`div`, {
                        className: `card-title`,
                        children: [ (0, W.jsxs)(`div`, {
                            children: [ (0, W.jsx)(`span`, {
                                className: `eyebrow`,
                                children: `연차별 매출액과 제품수명주기`
                            }), (0, W.jsx)(`h2`, {
                                children: `일할 전 예상 매출액`
                            }) ]
                        }), (0, W.jsx)(`span`, {
                            className: `source-chip`,
                            children: `단위: 백만원`
                        }) ]
                    }), (0, W.jsx)(`div`, {
                        className: `sales-matrix-wrap`,
                        children: (0, W.jsxs)(`table`, {
                            className: `sales-matrix`,
                            children: [ (0, W.jsx)(`thead`, {
                                children: (0, W.jsxs)(`tr`, {
                                    children: [ (0, W.jsx)(`th`, {
                                        children: `구분`
                                    }), Gn.map(e => (0, W.jsxs)(`th`, {
                                        children: [ e.year, e.partialRatio && (0, W.jsx)(`em`, {
                                            children: `부분연도`
                                        }) ]
                                    }, e.year)) ]
                                })
                            }), (0, W.jsxs)(`tbody`, {
                                children: [ (0, W.jsxs)(`tr`, {
                                    children: [ (0, W.jsx)(`th`, {
                                        children: `수명주기`
                                    }), Gn.map((e, t) => (0, W.jsx)(`td`, {
                                        children: (0, W.jsxs)(`select`, {
                                            "aria-label": `${e.year} 수명주기`,
                                            value: e.stage,
                                            onChange: e => $r(t, e.target.value),
                                            children: [ (0, W.jsx)(`option`, {
                                                value: `growth`,
                                                children: `성장기`
                                            }), (0, W.jsx)(`option`, {
                                                value: `maturity`,
                                                children: `성숙기`
                                            }), (0, W.jsx)(`option`, {
                                                value: `decline`,
                                                children: `쇠퇴기`
                                            }) ]
                                        })
                                    }, e.year)) ]
                                }), (0, W.jsxs)(`tr`, {
                                    children: [ (0, W.jsx)(`th`, {
                                        children: `성장률 적용`
                                    }), Gn.map((e, t) => (0, W.jsx)(`td`, {
                                        children: S === `plan` ? (0, W.jsx)(`span`, {
                                            className: `sales-plan-lock`,
                                            children: e.year < an ? `매출 발생 전` : e.year < _n ? `판매계획 확정` : `가중성장률 추정`
                                        }) : (0, W.jsxs)(`select`, {
                                            "aria-label": `${e.year} 성장률`,
                                            value: e.preset,
                                            onChange: e => Qr(t, {
                                                preset: e.target.value
                                            }),
                                            children: [ (0, W.jsx)(`option`, {
                                                value: `weighted`,
                                                children: `가중성장률`
                                            }), (0, W.jsx)(`option`, {
                                                value: `market`,
                                                children: `목표시장 성장률`
                                            }), (0, W.jsx)(`option`, {
                                                value: `industry`,
                                                children: `동업종 성장률`
                                            }), (0, W.jsx)(`option`, {
                                                value: `previous`,
                                                children: `전년도 성장률 반영`
                                            }), (0, W.jsx)(`option`, {
                                                value: `half`,
                                                children: `전년도 성장률의 1/2`
                                            }), (0, W.jsx)(`option`, {
                                                value: `third`,
                                                children: `전년도 성장률의 1/3`
                                            }), (0, W.jsx)(`option`, {
                                                value: `quarter`,
                                                children: `전년도 성장률의 1/4`
                                            }), e.stage === `maturity` && e.preset === `lifecycle` && (0, W.jsx)(`option`, {
                                                value: `lifecycle`,
                                                children: `성숙기 말 0% (자동)`
                                            }), e.stage === `decline` && (0, W.jsx)(`option`, {
                                                value: `lifecycle`,
                                                children: `쇠퇴기 역추세 (자동)`
                                            }), (0, W.jsx)(`option`, {
                                                value: `direct`,
                                                children: `직접입력`
                                            }) ]
                                        })
                                    }, e.year)) ]
                                }), (0, W.jsxs)(`tr`, {
                                    children: [ (0, W.jsx)(`th`, {
                                        children: `연도별 성장률`
                                    }), Gn.map((e, t) => (0, W.jsx)(`td`, {
                                        children: S === `plan` ? (0, W.jsx)(`strong`, {
                                            children: e.year < an ? `미발생` : e.year === an ? `기준` : $(e.rate)
                                        }) : e.preset === `direct` ? (0, W.jsx)(Og, {
                                            value: e.directRate,
                                            onChange: e => Qr(t, {
                                                directRate: e
                                            })
                                        }) : (0, W.jsx)(`strong`, {
                                            children: $(e.rate)
                                        })
                                    }, e.year)) ]
                                }), (0, W.jsxs)(`tr`, {
                                    className: `sales-value-row`,
                                    children: [ (0, W.jsx)(`th`, {
                                        children: `일할 전 예상매출액`
                                    }), Gn.map(e => (0, W.jsx)(`td`, {
                                        children: (0, W.jsx)(`strong`, {
                                            children: Math.round(e.beforeProration).toLocaleString()
                                        })
                                    }, e.year)) ]
                                }) ]
                            }) ]
                        })
                    }), (0, W.jsxs)(`div`, {
                        className: `after-proration-heading`,
                        children: [ (0, W.jsxs)(`div`, {
                            children: [ (0, W.jsx)(`span`, {
                                className: `eyebrow`,
                                children: `평가기준일 기준 현금흐름`
                            }), (0, W.jsx)(`h2`, {
                                children: `일할 후 매출액`
                            }) ]
                        }), (0, W.jsx)(`span`, {
                            className: `source-chip`,
                            children: `항상 표시`
                        }) ]
                    }), (0, W.jsx)(`div`, {
                        className: `sales-matrix-wrap`,
                        children: (0, W.jsxs)(`table`, {
                            className: `sales-matrix after-proration-matrix`,
                            children: [ (0, W.jsx)(`thead`, {
                                children: (0, W.jsxs)(`tr`, {
                                    children: [ (0, W.jsx)(`th`, {
                                        children: `현금흐름 차수`
                                    }), Er.map((e, t) => (0, W.jsxs)(`th`, {
                                        children: [ t + 1, `차년도`, br[t] && (0, W.jsx)(`em`, {
                                            children: `부분연도`
                                        }) ]
                                    }, t)) ]
                                })
                            }), (0, W.jsxs)(`tbody`, {
                                children: [ (0, W.jsxs)(`tr`, {
                                    children: [ (0, W.jsx)(`th`, {
                                        children: `적용기간`
                                    }), Er.map((e, t) => (0, W.jsx)(`td`, {
                                        children: Cr[t]
                                    }, t)) ]
                                }), (0, W.jsxs)(`tr`, {
                                    className: `sales-value-row`,
                                    children: [ (0, W.jsx)(`th`, {
                                        children: `일할 후 매출액`
                                    }), Er.map((e, t) => (0, W.jsx)(`td`, {
                                        children: (0, W.jsx)(`strong`, {
                                            children: Math.round(e).toLocaleString()
                                        })
                                    }, t)) ]
                                }) ]
                            }) ]
                        })
                    }), (0, W.jsx)(Ng, {
                        items: Er.map((e, t) => ({
                            year: `${t + 1}차년도`,
                            amount: e,
                            partial: br[t]
                        }))
                    }) ]
                }) ]
            }), (0, W.jsx)(Rp, {
                value: `life`,
                className: `valuation-tab-content`,
                children: (0, W.jsxs)(`div`, {
                    className: `section-grid two-columns`,
                    children: [ (0, W.jsx)(`div`, {
                        className: `life-score-column`,
                        children: (0, W.jsx)(Tg, {
                            title: `기술수명 영향요인 산출`,
                            subtitle: lifeModel === `model1` ? `경제적 수명 모델Ⅰ · 1~5점에서 3점 차감` : `경제적 수명 모델Ⅱ · 기술수명 영향요인 평가표`,
                            rows: sg,
                            ratings: lifeModel === `model1` ? Object.fromEntries(method1LifeKeys.map(e => [ e, Je[e] - 3 ])) : Je,
                            ratingValues: lifeModel === `model1` ? [ 2, 1, 0, -1, -2 ] : void 0,
                            ratingLabels: lifeModel === `model1` ? [ `매우우수 (+2)`, `우수 (+1)`, `보통 (0)`, `미흡 (-1)`, `매우미흡 (-2)` ] : void 0,
                            weighted: lifeModel === `model2`,
                            totalLabel: lifeModel === `model1` ? `${method1LifeScore}` : `${Cn}`,
                            resultLabel: lifeModel === `model1` ? `모델Ⅰ 점수 ${method1LifeScore}` : `점수 ${$(wn)}`
                        })
                    }), (0, W.jsxs)(`article`, {
                        className: `stage-card tct-reference-card life-tct-column`,
                        children: [ (0, W.jsxs)(`div`, {
                            className: `card-title`,
                            children: [ (0, W.jsxs)(`div`, {
                                children: [ (0, W.jsx)(`span`, {
                                    className: `eyebrow`,
                                    children: `대표 IPC별 TCT 기관별 변수데이터`
                                }), (0, W.jsx)(`h2`, {
                                    children: `기술의 경제적 수명 준거표`
                                }) ]
                            }), (0, W.jsx)(`span`, {
                                className: `source-chip`,
                                children: Nt
                            }) ]
                        }), (0, W.jsxs)(`div`, {
                            className: `tct-toolbar`,
                            children: [ (0, W.jsx)(Dg, {
                                label: `기관별 변수데이터·버전`,
                                children: (0, W.jsxs)(`select`, {
                                    value: Ne,
                                    onChange: e => Pe(e.target.value),
                                    children: [ (0, W.jsx)(`option`, {
                                        value: `kisti`,
                                        children: jm(je.institutions.kisti, `tct`)
                                    }), (0, W.jsx)(`option`, {
                                        value: `kipa`,
                                        children: jm(je.institutions.kipa, `tct`)
                                    }) ]
                                })
                            }), (0, W.jsxs)(`label`, {
                                className: `ipc-add-field`,
                                children: [ (0, W.jsx)(`span`, {
                                    children: `IPC 추가`
                                }), (0, W.jsxs)(`span`, {
                                    children: [ (0, W.jsx)(`input`, {
                                        list: `tct-ipc-options`,
                                        value: Be,
                                        onChange: e => Ve(e.target.value.toUpperCase()),
                                        placeholder: `예: F28D`
                                    }), (0, W.jsx)(`button`, {
                                        type: `button`,
                                        onClick: () => {
                                            let e = Be.toUpperCase().replace(/[^A-Z0-9]/g, ``).slice(0, 4);
                                            Am(At.tct, e) ? (ze(t => [ ...new Set([ ...t, e ]) ]), Ve(``)) : y(`${Nt}에서 ${e || `입력값`} IPC를 찾지 못했습니다.`);
                                        },
                                        children: `추가`
                                    }) ]
                                }) ]
                            }), (0, W.jsx)(`datalist`, {
                                id: `tct-ipc-options`,
                                children: At.tct.map(e => (0, W.jsx)(`option`, {
                                    value: e.code,
                                    children: e.name
                                }, e.code))
                            }) ]
                        }), (0, W.jsx)(`div`, {
                            className: `tct-table-wrap`,
                            children: (0, W.jsxs)(`table`, {
                                className: `tct-reference-table`,
                                children: [ (0, W.jsx)(`thead`, {
                                    children: (0, W.jsxs)(`tr`, {
                                        children: [ (0, W.jsx)(`th`, {
                                            children: `IPC`
                                        }), (0, W.jsx)(`th`, {
                                            children: `기술 정의`
                                        }), (0, W.jsx)(`th`, {
                                            children: `평균`
                                        }), (0, W.jsx)(`th`, {
                                            children: `Q1`
                                        }), (0, W.jsx)(`th`, {
                                            children: `Q2`
                                        }), (0, W.jsx)(`th`, {
                                            children: `Q3`
                                        }), (0, W.jsx)(`th`, {}) ]
                                    })
                                }), (0, W.jsxs)(`tbody`, {
                                    children: [ On.map(e => (0, W.jsxs)(`tr`, {
                                        children: [ (0, W.jsx)(`td`, {
                                            children: (0, W.jsx)(`strong`, {
                                                children: e.code
                                            })
                                        }), (0, W.jsx)(`td`, {
                                            children: e.name
                                        }), (0, W.jsx)(`td`, {
                                            children: e.average?.toFixed(2) ?? `-`
                                        }), (0, W.jsx)(`td`, {
                                            children: e.q1?.toFixed(2) ?? `-`
                                        }), (0, W.jsx)(`td`, {
                                            children: e.median?.toFixed(2) ?? `-`
                                        }), (0, W.jsx)(`td`, {
                                            children: e.q3?.toFixed(2) ?? `-`
                                        }), (0, W.jsx)(`td`, {
                                            children: (0, W.jsx)(`button`, {
                                                type: `button`,
                                                "aria-label": `${e.code} 삭제`,
                                                onClick: () => ze(t => t.filter(t => t !== e.code)),
                                                children: (0, W.jsx)(me, {
                                                    size: 14
                                                })
                                            })
                                        }) ]
                                    }, e.code)), !On.length && (0, W.jsx)(`tr`, {
                                        children: (0, W.jsx)(`td`, {
                                            colSpan: 7,
                                            className: `empty-tct-row`,
                                            children: `선택된 IPC와 일치하는 기관 데이터가 없습니다.`
                                        })
                                    }) ]
                                }), (0, W.jsx)(`tfoot`, {
                                    children: (0, W.jsxs)(`tr`, {
                                        children: [ (0, W.jsx)(`th`, {
                                            colSpan: 2,
                                            children: `선택 IPC 평균`
                                        }), (0, W.jsx)(`td`, {
                                            children: On.length ? (On.reduce((e, t) => e + (t.average ?? 0), 0) / On.length).toFixed(2) : `-`
                                        }), (0, W.jsx)(`td`, {
                                            children: An.toFixed(2)
                                        }), (0, W.jsx)(`td`, {
                                            children: jn.toFixed(2)
                                        }), (0, W.jsx)(`td`, {
                                            children: Mn.toFixed(2)
                                        }), (0, W.jsx)(`td`, {}) ]
                                    })
                                }) ]
                            })
                        }), (0, W.jsx)(`p`, {
                            className: `helper-text`,
                            children: `PM 확정 평가대상특허가 1건이면 해당 IPC, 복수이면 최빈 IPC를 자동 연결합니다. 모든 특허의 IPC가 서로 다르면 각각을 불러오며, 복수 준거값은 산술평균합니다.`
                        }) ]
                    }), (0, W.jsxs)(Eg, {
                        title: `경제적 수명 적용`,
                        badge: `계산값 잠금`,
                        children: [ (0, W.jsxs)(`div`, {
                            className: `formula-metrics large`,
                            children: [ (0, W.jsxs)(`div`, {
                                children: [ (0, W.jsx)(`span`, {
                                    children: `평균 TCT Q1·Q2·Q3`
                                }), (0, W.jsxs)(`strong`, {
                                    children: [ An.toFixed(2), `·`, jn.toFixed(2), `·`, Mn.toFixed(2), `년` ]
                                }) ]
                            }), (0, W.jsxs)(`div`, {
                                children: [ (0, W.jsx)(`span`, {
                                    children: lifeModel === `model1` ? `모델Ⅰ 환산점수` : `모델Ⅱ 기술수명 획득값`
                                }), (0, W.jsx)(`strong`, {
                                    children: lifeModel === `model1` ? `${method1LifeScore}점` : $(wn)
                                }) ]
                            }), (0, W.jsxs)(`div`, {
                                children: [ (0, W.jsx)(`span`, {
                                    children: `산출 경제적 수명`
                                }), (0, W.jsxs)(`strong`, {
                                    children: [ Nn.toFixed(2), `년` ]
                                }) ]
                            }), (0, W.jsxs)(`div`, {
                                children: [ (0, W.jsx)(`span`, {
                                    children: `최종 적용기간`
                                }), (0, W.jsxs)(`strong`, {
                                    children: [ `${Vn.toFixed(2)}년 + 준비 ${method1PreparationYears}년 ${method1PreparationMonths}개월`, ` · 총 `, Tr ]
                                }) ]
                            }) ]
                        }), (0, W.jsx)(Dg, {
                            label: `수명모델`,
                            children: (0, W.jsxs)(`select`, {
                                value: lifeModel,
                                onChange: e => setLifeModel(e.target.value),
                                children: [ (0, W.jsx)(`option`, { value: `model1`, children: `수명모델Ⅰ` }), (0, W.jsx)(`option`, { value: `model2`, children: `수명모델Ⅱ` }) ]
                            })
                        }), (0, W.jsxs)(`div`, {
                            className: `preparation-period-grid`,
                            children: [ (0, W.jsx)(Dg, {
                                label: `사업화 준비기간(년)`,
                                children: (0, W.jsx)(`input`, {
                                    type: `number`,
                                    min: `0`,
                                    step: `1`,
                                    value: method1PreparationYears,
                                    onChange: e => setMethod1PreparationYears(Math.max(0, Math.floor(Number(e.target.value) || 0)))
                                })
                            }), (0, W.jsx)(Dg, {
                                label: `추가 개월`,
                                children: (0, W.jsx)(`input`, {
                                    type: `number`,
                                    min: `0`,
                                    max: `11`,
                                    step: `1`,
                                    value: method1PreparationMonths,
                                    onChange: e => setMethod1PreparationMonths(Math.min(11, Math.max(0, Math.floor(Number(e.target.value) || 0))))
                                })
                            }) ]
                        }), (0, W.jsx)(Dg, {
                            label: `소수점 처리`,
                            children: (0, W.jsxs)(`select`, {
                                value: He,
                                onChange: e => Ue(e.target.value),
                                children: [ (0, W.jsx)(`option`, {
                                    value: `daily`,
                                    children: `날짜·일수 기준 일할`
                                }), (0, W.jsx)(`option`, {
                                    value: `floor`,
                                    children: `소수점 이하 내림(정수 적용)`
                                }), (0, W.jsx)(`option`, {
                                    value: `round`,
                                    children: `소수점 이하 반올림(정수 적용)`
                                }) ]
                            })
                        }), He === `round` && (0, W.jsx)(Dg, {
                            label: `반올림 적용근거`,
                            children: (0, W.jsx)(`textarea`, {
                                value: We,
                                onChange: e => Ge(e.target.value),
                                placeholder: `반올림 적용근거를 입력하세요.`
                            })
                        }) ]
                    }), (0, W.jsxs)(`article`, {
                        className: `stage-card info-banner`,
                        children: [ (0, W.jsx)(re, {
                            size: 20
                        }), (0, W.jsxs)(`div`, {
                            children: [ (0, W.jsx)(`strong`, {
                                children: `최종 적용기간 판정`
                            }), (0, W.jsxs)(`p`, {
                                children: [ `수명모델`, lifeModel === `model1` ? `Ⅰ` : `Ⅱ`, `의 산출 경제적 수명 `, He === `daily` ? `${Nn.toFixed(2)}년을 날짜·일수 기준으로 적용` : `${Nn.toFixed(2)}년을 ${Pn.toFixed(2)}년으로 조정`, `합니다. 평가기준일로부터 준비기간 ${method1PreparationYears}년 ${method1PreparationMonths}개월 동안 매출액은 0이며, 이후 발생 매출을 일할 계산합니다. 포트폴리오 최단 법적 잔존기간 `, In === null ? `확인 필요` : `${In.toFixed(2)}년`, `을 넘지 않습니다.` ]
                            }) ]
                        }) ]
                    }) ]
                })
            }), (0, W.jsxs)(Rp, {
                value: `royalty`,
                className: `valuation-tab-content`,
                children: [ (0, W.jsxs)(`div`, {
                    className: `valuation-table-side-layout`,
                    children: [ (0, W.jsx)(`div`, {
                        className: `valuation-table-pane`,
                        children: (0, W.jsx)(Tg, {
                            title: isMethod1 ? `조정계수1 산출` : `조정계수 산출`,
                            subtitle: isMethod1 ? `15개 평점 · 1~5점에서 3점 차감` : `조정점수 산출표`,
                            rows: isMethod1 ? method1AdjustmentRows : cg,
                            ratings: isMethod1 ? Object.fromEntries(method1AdjustmentRows.map(e => [ e.key, Je[e.key] - 3 ])) : Je,
                            ratingValues: isMethod1 ? [ 2, 1, 0, -1, -2 ] : void 0,
                            ratingLabels: isMethod1 ? [ `매우우수 (+2)`, `우수 (+1)`, `보통 (0)`, `미흡 (-1)`, `매우미흡 (-2)` ] : void 0,
                            totalLabel: isMethod1 ? `${method1AdjustmentScore}` : `${Tn}`,
                            resultLabel: isMethod1 ? `조정계수1 ${method1AdjustmentCoefficient.toFixed(2)}` : `조정계수 ${$n.toFixed(2)}`
                        })
                    }), (0, W.jsxs)(`div`, {
                        className: `valuation-side-stack`,
                        children: [ (0, W.jsxs)(Eg, {
                            title: `기준 로열티율`,
                            badge: `기관별 변수값`,
                            children: [ (0, W.jsx)(Dg, {
                                label: `기관별 변수데이터·버전`,
                                children: (0, W.jsxs)(`select`, {
                                    value: Ye,
                                    onChange: e => {
                                        Xe(e.target.value), et(null);
                                    },
                                    children: [ (0, W.jsx)(`option`, {
                                        value: `kisti`,
                                        children: jm(je.institutions.kisti, `royalty`)
                                    }), (0, W.jsx)(`option`, {
                                        value: `kipa`,
                                        children: jm(je.institutions.kipa, `royalty`)
                                    }) ]
                                })
                            }), (0, W.jsx)(Dg, {
                                label: `통계값`,
                                children: (0, W.jsxs)(`select`, {
                                    value: Ze,
                                    onChange: e => {
                                        Qe(e.target.value), et(null);
                                    },
                                    children: [ (0, W.jsx)(`option`, {
                                        value: `median`,
                                        children: `중앙값(Q2) — 기본`
                                    }), (0, W.jsx)(`option`, {
                                        value: `average`,
                                        children: `평균값 — 근거 필요`
                                    }) ]
                                })
                            }), (0, W.jsx)(Dg, {
                                label: `기준 로열티율`,
                                children: (0, W.jsx)(Og, {
                                    value: Jn,
                                    onChange: et
                                })
                            }), (0, W.jsxs)(`div`, {
                                className: `reference-match-note`,
                                children: [ (0, W.jsx)(`span`, {
                                    children: `자동 매칭`
                                }), (0, W.jsxs)(`strong`, {
                                    children: [ Kn?.code ?? `-`, ` · `, Kn?.name ?? `일치 업종 없음` ]
                                }), (0, W.jsxs)(`small`, {
                                    children: [ Pt, ` · `, Ze === `median` ? `중앙값` : `평균값`, ` `, typeof qn == `number` ? $(qn) : `-` ]
                                }) ]
                            }) ]
                        }), (0, W.jsxs)(Eg, {
                            title: isMethod1 ? `조정계수1` : `조정계수·합리적 로열티율`,
                            badge: `평점 연계`,
                            children: [ (0, W.jsxs)(`div`, {
                                className: `linked-score-note`,
                                children: [ (0, W.jsx)(`span`, {
                                    children: `조정점수 합계`
                                }), (0, W.jsxs)(`strong`, {
                                    children: [ isMethod1 ? method1AdjustmentScore : Tn, `점` ]
                                }), (0, W.jsx)(`small`, {
                                    children: "`평점 입력` 탭의 공통 평점에서 자동 연결"
                                }) ]
                            }), (0, W.jsxs)(`div`, {
                                className: `equation-box`,
                                children: [ (0, W.jsx)(`span`, {
                                    children: $(Jn)
                                }), (0, W.jsx)(`b`, {
                                    children: `×`
                                }), (0, W.jsx)(`span`, {
                                    children: isMethod1 ? method1AdjustmentCoefficient.toFixed(2) : $n.toFixed(2)
                                }), (0, W.jsx)(`b`, {
                                    children: `=`
                                }), (0, W.jsx)(`strong`, {
                                    children: isMethod1 ? `조정계수1` : $(Qn)
                                }) ]
                            }), (0, W.jsx)(`p`, {
                                className: `helper-text`,
                                children: isMethod1 ? `1 + (15개 환산점수 합계 ÷ 30)으로 조정계수1을 산출합니다.` : `평점 변경 시 조정계수와 합리적 로열티율을 즉시 다시 산출합니다.`
                            }) ]
                        }) ]
                    }) ]
                }), pioneeringCard && (0, W.jsx)(`div`, {
                    className: `section-grid one-column method1-pioneering-row`,
                    children: pioneeringCard
                }), (0, W.jsx)(`div`, {
                    className: `section-grid one-column royalty-final-row`,
                    children: (0, W.jsxs)(Eg, {
                        title: isMethod1 ? `기술의 비중·개척률·최종 로열티율` : `이용률·최종 로열티율`,
                        badge: `평가자 확정`,
                        children: [ (0, W.jsx)(Dg, {
                            label: isMethod1 ? `기술의 비중` : `이용률`,
                            children: (0, W.jsx)(Og, {
                                value: tt,
                                onChange: nt
                            })
                        }), (0, W.jsxs)(wp, {
                            children: [ (0, W.jsx)(Tp, {
                                asChild: !0,
                                children: (0, W.jsxs)(`button`, {
                                    className: `detail-calc-button`,
                                    type: `button`,
                                    children: [ (0, W.jsx)(j, {
                                        size: 15
                                    }), ` 상세 산출표 열기` ]
                                })
                            }), (0, W.jsxs)(kp, {
                                className: `utilization-dialog`,
                                children: [ (0, W.jsxs)(Ap, {
                                    children: [ (0, W.jsx)(Mp, {
                                        children: isMethod1 ? `기술의 비중 상세 산출` : `이용률 상세 산출`
                                    }), (0, W.jsx)(Np, {
                                        children: isMethod1 ? `구성기술 비중과 평가대상기술 적용비중을 입력하면 기술의 비중을 자동 산출합니다.` : `구성기술 비중과 평가대상특허 적용비중을 입력하면 이용률을 자동 산출합니다.`
                                    }) ]
                                }), (0, W.jsxs)(`div`, {
                                    className: `utilization-table`,
                                    children: [ (0, W.jsxs)(`div`, {
                                        className: `util-head`,
                                        children: [ (0, W.jsx)(`span`, {
                                            children: `구성기술·세부기술`
                                        }), (0, W.jsx)(`span`, {
                                            children: `구성기술 비중`
                                        }), (0, W.jsx)(`span`, {
                                            children: isMethod1 ? `대상기술 적용비중` : `특허 적용비중`
                                        }), (0, W.jsx)(`span`, {
                                            children: `기여율`
                                        }), (0, W.jsx)(`span`, {}) ]
                                    }), rt.map(e => (0, W.jsxs)(`div`, {
                                        children: [ (0, W.jsx)(`input`, {
                                            value: e.technology,
                                            onChange: t => it(n => n.map(n => n.id === e.id ? {
                                                ...n,
                                                technology: t.target.value
                                            } : n))
                                        }), (0, W.jsx)(Og, {
                                            value: e.weight,
                                            onChange: t => it(n => n.map(n => n.id === e.id ? {
                                                ...n,
                                                weight: t
                                            } : n))
                                        }), (0, W.jsx)(Og, {
                                            value: e.patentShare,
                                            onChange: t => it(n => n.map(n => n.id === e.id ? {
                                                ...n,
                                                patentShare: t
                                            } : n))
                                        }), (0, W.jsx)(`strong`, {
                                            children: $(e.weight * e.patentShare / 100)
                                        }), (0, W.jsx)(`button`, {
                                            type: `button`,
                                            "aria-label": `${e.technology} 삭제`,
                                            onClick: () => it(t => t.filter(t => t.id !== e.id)),
                                            children: (0, W.jsx)(me, {
                                                size: 14
                                            })
                                        }) ]
                                    }, e.id)) ]
                                }), (0, W.jsxs)(`button`, {
                                    className: `add-row-button`,
                                    type: `button`,
                                    onClick: () => it(e => [ ...e, {
                                        id: Date.now(),
                                        technology: `새 구성기술`,
                                        weight: 0,
                                        patentShare: 0
                                    } ]),
                                    children: [ (0, W.jsx)(oe, {
                                        size: 14
                                    }), ` 행 추가` ]
                                }), (0, W.jsxs)(`div`, {
                                    className: `dialog-total ${nr === 100 ? `valid` : `invalid`}`,
                                    children: [ (0, W.jsxs)(`span`, {
                                        children: [ `비중 합계 `, $(nr) ]
                                    }), (0, W.jsxs)(`strong`, {
                                        children: [ isMethod1 ? `산출 기술의 비중 ` : `산출 이용률 `, $(tr) ]
                                    }) ]
                                }), (0, W.jsxs)(jp, {
                                    children: [ (0, W.jsx)(Dp, {
                                        asChild: !0,
                                        children: (0, W.jsx)(`button`, {
                                            className: `button secondary`,
                                            type: `button`,
                                            children: `취소`
                                        })
                                    }), (0, W.jsx)(Dp, {
                                        asChild: !0,
                                        children: (0, W.jsx)(`button`, {
                                            className: `button primary`,
                                            type: `button`,
                                            disabled: nr !== 100,
                                            onClick: () => {
                                                nt(Number(tr.toFixed(2))), y(`상세 산출표의 ${isMethod1 ? `기술의 비중` : `이용률`}을 최종값에 적용했습니다.`);
                                            },
                                            children: `적용`
                                        })
                                    }) ]
                                }) ]
                            }) ]
                        }), (0, W.jsxs)(`div`, {
                            className: `result-callout`,
                            children: [ (0, W.jsx)(`span`, {
                                children: `최종 로열티율`
                            }), (0, W.jsx)(`strong`, {
                                children: method1CalculationReady ? $(er) : `산출 전`
                            }), (0, W.jsxs)(`small`, {
                                children: isMethod1 ? method1CalculationReady ? [ $(Jn), ` × 조정계수1 `, method1AdjustmentCoefficient.toFixed(2), ` × 기술의 비중 `, $(tt), ` × 개척률 `, $(method1PioneeringRate) ] : `개척률 필수자료를 입력해 주세요.` : [ $(Qn), ` × 이용률 `, $(tt) ]
                            }) ]
                        }) ]
                    })
                }) ]
            }), (0, W.jsx)(Rp, {
                value: `tax`,
                className: `valuation-tab-content`,
                children: (0, W.jsx)(TaxEngineCard, {
                    companyForm: t,
                    effectiveRate: Pr,
                    royaltyIncomes: jr,
                    taxRows: Mr,
                    afterTaxRoyalty: Hr
                })
            }), (0, W.jsxs)(Rp, {
                value: `discount`,
                className: `valuation-tab-content`,
                children: [ (0, W.jsxs)(`div`, {
                    className: `valuation-table-side-layout`,
                    children: [ (0, W.jsx)(`div`, {
                        className: `valuation-table-pane`,
                        children: (0, W.jsx)(Tg, {
                            title: `IP 사업화 프리미엄 산출`,
                            subtitle: `IP사업화 위험프리미엄 평가표`,
                            rows: lg,
                            ratings: Je,
                            totalLabel: `${En}`,
                            resultLabel: `프리미엄 ${$(Dn)}`
                        })
                    }), (0, W.jsxs)(`div`, {
                        className: `valuation-side-stack`,
                        children: [ (0, W.jsxs)(Eg, {
                            title: `할인율 기관별 변수데이터`,
                            badge: `버전 관리`,
                            children: [ (0, W.jsx)(Dg, {
                                label: `기관별 변수데이터·버전`,
                                children: (0, W.jsxs)(`select`, {
                                    value: at,
                                    onChange: e => ot(e.target.value),
                                    children: [ (0, W.jsx)(`option`, {
                                        value: `kisti`,
                                        children: jm(je.institutions.kisti, `discount`)
                                    }), (0, W.jsx)(`option`, {
                                        value: `kipa`,
                                        children: jm(je.institutions.kipa, `discount`)
                                    }) ]
                                })
                            }), (0, W.jsxs)(`div`, {
                                className: `reference-strip`,
                                children: [ (0, W.jsxs)(`div`, {
                                    children: [ (0, W.jsx)(`span`, {
                                        children: `기준 자기자본비용`
                                    }), (0, W.jsx)(`strong`, {
                                        children: $(ur)
                                    }) ]
                                }), (0, W.jsxs)(`div`, {
                                    children: [ (0, W.jsx)(`span`, {
                                        children: `사업화위험`
                                    }), (0, W.jsxs)(`strong`, {
                                        children: [ `+ `, $(Dn) ]
                                    }) ]
                                }), (0, W.jsxs)(`div`, {
                                    children: [ (0, W.jsx)(`span`, {
                                        children: `적용 자기자본비용`
                                    }), (0, W.jsx)(`strong`, {
                                        children: $(dr)
                                    }) ]
                                }), (0, W.jsxs)(`div`, {
                                    children: [ (0, W.jsx)(`span`, {
                                        children: `세전 타인자본비용`
                                    }), (0, W.jsx)(`strong`, {
                                        children: $(fr)
                                    }) ]
                                }), (0, W.jsxs)(`div`, {
                                    className: `average-tax-rate-metric`,
                                    children: [ (0, W.jsx)(`span`, {
                                        children: t === `corporation` ? `평균 법인세율` : `평균 종합소득세율`
                                    }), (0, W.jsx)(`strong`, {
                                        children: $(Pr)
                                    }) ]
                                }) ]
                            }), (0, W.jsxs)(`p`, {
                                className: `helper-text`,
                                children: [ or?.code ?? `-`, ` 업종 · `, m, `(`, sr, `) 기준을 자동 적용합니다. 원본값·표시서식·내부 변환값을 분리하여 단위 이상을 검출합니다.` ]
                            }) ]
                        }), (0, W.jsxs)(Eg, {
                            title: `자기자본비율 적용`,
                            badge: `1~5개년 선택`,
                            children: [ (0, W.jsx)(Dg, {
                                label: `적용방식`,
                                children: (0, W.jsxs)(`select`, {
                                    value: st,
                                    onChange: e => ct(e.target.value),
                                    children: [ (0, W.jsx)(`option`, {
                                        value: `company`,
                                        disabled: si === 0,
                                        children: `사업화주체 재무비율`
                                    }), (0, W.jsx)(`option`, {
                                        value: `industry`,
                                        children: `기관 업종별 자기자본비율`
                                    }), (0, W.jsx)(`option`, {
                                        value: `direct`,
                                        children: `평가자 직접입력`
                                    }) ]
                                })
                            }), st === `company` && (0, W.jsx)(Dg, {
                                label: `평균기간`,
                                children: (0, W.jsx)(`select`, {
                                    value: ir,
                                    onChange: e => ut(Number(e.target.value)),
                                    children: [ 1, 2, 3, 4, 5 ].map(e => (0, W.jsxs)(`option`, {
                                        value: e,
                                        disabled: e > si,
                                        children: [ `최근 `, e, `개년`, e > si ? ` — 재무자료 부족` : `` ]
                                    }, e))
                                })
                            }), si === 0 && (0, W.jsx)(`p`, {
                                className: `helper-text`,
                                children: `유효한 자산·자본 자료가 없어 기관 업종별 비율로 자동 전환했습니다.`
                            }), st === `direct` && (0, W.jsxs)(W.Fragment, {
                                children: [ (0, W.jsx)(Dg, {
                                    label: `직접입력 비율`,
                                    children: (0, W.jsx)(Og, {
                                        value: G,
                                        onChange: dt
                                    })
                                }), (0, W.jsx)(Dg, {
                                    label: `적용근거`,
                                    children: (0, W.jsx)(`textarea`, {
                                        value: ft,
                                        onChange: e => pt(e.target.value),
                                        placeholder: `자본잠식·창업 초기 등 적용근거`
                                    })
                                }) ]
                            }), (0, W.jsxs)(`div`, {
                                className: `result-callout`,
                                children: [ (0, W.jsx)(`span`, {
                                    children: `적용 자기자본비율`
                                }), (0, W.jsx)(`strong`, {
                                    children: $(lr)
                                }), (0, W.jsxs)(`small`, {
                                    children: [ `타인자본비율 `, $(100 - lr) ]
                                }) ]
                            }) ]
                        }) ]
                    }) ]
                }), (0, W.jsxs)(`div`, {
                    className: `section-grid two-columns discount-lower-grid`,
                    children: [ (0, W.jsxs)(`article`, {
                        className: `stage-card span-2 discount-equation-card`,
                        children: [ (0, W.jsxs)(`div`, {
                            className: `card-title`,
                            children: [ (0, W.jsxs)(`div`, {
                                children: [ (0, W.jsx)(`span`, {
                                    className: `eyebrow`,
                                    children: `WACC 및 최종 할인율`
                                }), (0, W.jsx)(`h2`, {
                                    children: `할인율 산출 연결`
                                }) ]
                            }), (0, W.jsx)(`span`, {
                                className: `source-chip`,
                                children: Ft
                            }) ]
                        }), (0, W.jsxs)(`div`, {
                            className: `discount-equation`,
                            children: [ (0, W.jsxs)(`span`, {
                                children: [ `(기준 자기자본비용 `, $(ur), ` + 사업화위험 `, $(Dn), `) × `, $(lr) ]
                            }), (0, W.jsx)(`b`, {
                                children: `+`
                            }), (0, W.jsxs)(`span`, {
                                children: [ $(fr), ` × `, $(100 - lr), ` × (1-평균세율 `, $(Pr), `)` ]
                            }), (0, W.jsx)(`b`, {
                                children: `=`
                            }), (0, W.jsxs)(`strong`, {
                                children: [ `할인율(WACC) `, $(Fr) ]
                            }) ]
                        }) ]
                    }), (0, W.jsxs)(`article`, {
                        className: `stage-card span-2 tax-engine-card tax-engine-card-in-discount`,
                        children: [ (0, W.jsxs)(`div`, {
                            className: `card-title`,
                            children: [ (0, W.jsxs)(`div`, {
                                children: [ (0, W.jsx)(`span`, {
                                    className: `eyebrow`,
                                    children: `세금 계산 엔진`
                                }), (0, W.jsxs)(`h2`, {
                                    children: [ t === `corporation` ? `법인기업` : `개인사업자`, ` 누진세액` ]
                                }) ]
                            }), (0, W.jsx)(`span`, {
                                className: `source-chip`,
                                children: `기준 2026.08`
                            }) ]
                        }), (0, W.jsxs)(`div`, {
                            className: `tax-reference-strip`,
                            children: [ (0, W.jsxs)(`div`, {
                                children: [ (0, W.jsx)(`span`, {
                                    children: `국세`
                                }), (0, W.jsx)(`strong`, {
                                    children: t === `corporation` ? `법인세법 제55조` : `소득세법 제55조`
                                }) ]
                            }), (0, W.jsxs)(`div`, {
                                children: [ (0, W.jsx)(`span`, {
                                    children: `지방소득세`
                                }), (0, W.jsx)(`strong`, {
                                    children: t === `corporation` ? `지방세법 제103조의20·제103조의21` : `지방세법 제92조·제93조`
                                }) ]
                            }), (0, W.jsxs)(`div`, {
                                children: [ (0, W.jsx)(`span`, {
                                    children: `평균 유효세율`
                                }), (0, W.jsx)(`strong`, {
                                    children: $(Pr)
                                }) ]
                            }) ]
                        }), (0, W.jsx)(`div`, {
                            className: `calculation-matrix-wrap tax-preview-table`,
                            children: (0, W.jsxs)(`table`, {
                                className: `calculation-matrix tax-calculation-table`,
                                children: [ (0, W.jsx)(`thead`, {
                                    children: (0, W.jsxs)(`tr`, {
                                        children: [ (0, W.jsx)(`th`, {
                                            children: `구분`
                                        }), jr.map((e, t) => (0, W.jsxs)(`th`, {
                                            children: [ t + 1, `차년도` ]
                                        }, t)) ]
                                    })
                                }), (0, W.jsxs)(`tbody`, {
                                    children: [ (0, W.jsxs)(`tr`, {
                                        children: [ (0, W.jsxs)(`th`, {
                                            children: [ `과세표준`, (0, W.jsx)(`br`, {}), `(로열티수입)` ]
                                        }), jr.map((e, t) => (0, W.jsx)(`td`, {
                                            children: e.toLocaleString(void 0, {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2
                                            })
                                        }, t)) ]
                                    }), (0, W.jsxs)(`tr`, {
                                        children: [ (0, W.jsx)(`th`, {
                                            children: `과세표준 구간`
                                        }), Mr.map((e, t) => (0, W.jsx)(`td`, {
                                            children: e.bracket
                                        }, t)) ]
                                    }), (0, W.jsxs)(`tr`, {
                                        children: [ (0, W.jsxs)(`th`, {
                                            children: [ `구간 세율`, (0, W.jsx)(`br`, {}), `(지방세 포함)` ]
                                        }), Mr.map((e, t) => (0, W.jsx)(`td`, {
                                            children: $(e.combinedRate)
                                        }, t)) ]
                                    }), (0, W.jsxs)(`tr`, {
                                        children: [ (0, W.jsxs)(`th`, {
                                            children: [ `누진공제`, (0, W.jsx)(`br`, {}), `(백만원)` ]
                                        }), Mr.map((e, t) => (0, W.jsx)(`td`, {
                                            children: e.deduction.toLocaleString()
                                        }, t)) ]
                                    }), (0, W.jsxs)(`tr`, {
                                        children: [ (0, W.jsx)(`th`, {
                                            children: `국세`
                                        }), Mr.map((e, t) => (0, W.jsx)(`td`, {
                                            children: e.national.toLocaleString(void 0, {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2
                                            })
                                        }, t)) ]
                                    }), (0, W.jsxs)(`tr`, {
                                        children: [ (0, W.jsx)(`th`, {
                                            children: `지방소득세`
                                        }), Mr.map((e, t) => (0, W.jsx)(`td`, {
                                            children: e.local.toLocaleString(void 0, {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2
                                            })
                                        }, t)) ]
                                    }), (0, W.jsxs)(`tr`, {
                                        children: [ (0, W.jsx)(`th`, {
                                            children: `세금 합계`
                                        }), Mr.map((e, t) => (0, W.jsx)(`td`, {
                                            children: (0, W.jsx)(`strong`, {
                                                children: e.total.toLocaleString(void 0, {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2
                                                })
                                            })
                                        }, t)) ]
                                    }), (0, W.jsxs)(`tr`, {
                                        children: [ (0, W.jsx)(`th`, {
                                            children: `세후 로열티수입`
                                        }), Hr.map((e, t) => (0, W.jsx)(`td`, {
                                            children: (0, W.jsx)(`strong`, {
                                                children: e.toLocaleString(void 0, {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2
                                                })
                                            })
                                        }, t)) ]
                                    }) ]
                                }) ]
                            })
                        }), (0, W.jsx)(`p`, {
                            className: `card-help`,
                            children: `세율을 과세표준 전체에 단순 곱하지 않고 국세의 구간별 세율과 누진공제를 적용한 뒤 지방소득세를 별도 계산합니다. 세율표는 시행일과 함께 버전 관리합니다.`
                        }) ]
                    }) ]
                }) ]
            }), !isMethod1 && (0, W.jsx)(Rp, {
                value: `validity`,
                className: `valuation-tab-content`,
                children: (0, W.jsxs)(`div`, {
                    className: `validity-layout`,
                    children: [ (0, W.jsxs)(`article`, {
                        className: `stage-card validity-score-card`,
                        children: [ (0, W.jsxs)(`div`, {
                            className: `card-title`,
                            children: [ (0, W.jsxs)(`div`, {
                                children: [ (0, W.jsx)(`span`, {
                                    className: `eyebrow`,
                                    children: `8개 세부평가항목`
                                }), (0, W.jsx)(`h2`, {
                                    children: `지식재산 유효성 평점`
                                }) ]
                            }), (0, W.jsx)(`span`, {
                                className: `source-chip`,
                                children: `기본 27/40`
                            }) ]
                        }), (0, W.jsx)(`div`, {
                            className: `validity-rating-wrap`,
                            children: (0, W.jsxs)(`table`, {
                                className: `validity-rating-table`,
                                children: [ (0, W.jsx)(`thead`, {
                                    children: (0, W.jsxs)(`tr`, {
                                        children: [ (0, W.jsx)(`th`, {
                                            children: `평가항목`
                                        }), (0, W.jsx)(`th`, {
                                            children: `매우우수`
                                        }), (0, W.jsx)(`th`, {
                                            children: `우수`
                                        }), (0, W.jsx)(`th`, {
                                            children: `보통`
                                        }), (0, W.jsx)(`th`, {
                                            children: `미흡`
                                        }), (0, W.jsx)(`th`, {
                                            children: `매우미흡`
                                        }), (0, W.jsx)(`th`, {
                                            children: `평점 입력`
                                        }) ]
                                    })
                                }), (0, W.jsx)(`tbody`, {
                                    children: rg.map((e, t) => {
                                        let n = t === 3 ? Ir : mt[t];
                                        return (0, W.jsxs)(`tr`, {
                                            children: [ (0, W.jsxs)(`th`, {
                                                children: [ e, t === 3 && (0, W.jsx)(`small`, {
                                                    children: `포트폴리오 조건 자동반영`
                                                }) ]
                                            }), [ 5, 4, 3, 2, 1 ].map(e => (0, W.jsx)(`td`, {
                                                className: n === e ? `validity-check active` : `validity-check`,
                                                children: n === e ? `●` : ``
                                            }, e)), (0, W.jsx)(`td`, {
                                                className: `validity-number-input`,
                                                children: (0, W.jsx)(`input`, {
                                                    "aria-label": `${e} 평점 입력`,
                                                    type: `number`,
                                                    min: `1`,
                                                    max: `5`,
                                                    value: n,
                                                    disabled: t === 3,
                                                    onChange: e => ei(t, Math.min(5, Math.max(1, Number(e.target.value) || 1)))
                                                })
                                            }) ]
                                        }, e);
                                    })
                                }), (0, W.jsx)(`tfoot`, {
                                    children: (0, W.jsxs)(`tr`, {
                                        children: [ (0, W.jsx)(`th`, {
                                            colSpan: 6,
                                            children: `합계`
                                        }), (0, W.jsxs)(`td`, {
                                            children: [ Rr, `/40` ]
                                        }) ]
                                    })
                                }) ]
                            })
                        }), (0, W.jsx)(`p`, {
                            className: `card-help`,
                            children: `평가자 입력 및 관리자 확인용이며, IP포트폴리오 구축 적절성은 확정 특허 수를 자동 반영합니다.`
                        }) ]
                    }), (0, W.jsxs)(`div`, {
                        className: `validity-side`,
                        children: [ (0, W.jsxs)(Eg, {
                            title: `IP포트폴리오 구축 적절성`,
                            badge: `연관 권리 전체`,
                            children: [ (0, W.jsx)(Dg, {
                                label: `국내 연관 IP 수`,
                                children: (0, W.jsx)(`input`, {
                                    type: `number`,
                                    min: `1`,
                                    value: gt,
                                    onChange: e => _t(Math.max(1, Number(e.target.value) || 1))
                                })
                            }), (0, W.jsxs)(`label`, {
                                className: `checkbox-field`,
                                children: [ (0, W.jsx)(`input`, {
                                    type: `checkbox`,
                                    checked: vt,
                                    onChange: e => yt(e.target.checked)
                                }), (0, W.jsx)(`span`, {
                                    children: `해외 IP 있음(PCT 포함)`
                                }) ]
                            }), (0, W.jsxs)(`div`, {
                                className: `result-callout`,
                                children: [ (0, W.jsx)(`span`, {
                                    children: `자동추천`
                                }), (0, W.jsxs)(`strong`, {
                                    children: [ Ir, `점 · `, dg(Ir) ]
                                }), (0, W.jsx)(`small`, {
                                    children: gt <= 1 ? `국내 단건 기본 미흡` : vt ? `국내 복수 + 해외 IP` : `국내 복수는 최대 보통`
                                }) ]
                            }) ]
                        }), (0, W.jsxs)(Eg, {
                            title: `상위등급 추천`,
                            badge: `낮은 등급 기준`,
                            children: [ (0, W.jsx)(Dg, {
                                label: `권리안정성 추천 ${dg(Br)}`,
                                children: (0, W.jsx)(`select`, {
                                    value: bt,
                                    onChange: e => xt(Number(e.target.value)),
                                    children: [ 1, 2, 3, 4, 5 ].map(e => (0, W.jsx)(`option`, {
                                        value: e,
                                        children: dg(e)
                                    }, e))
                                })
                            }), bt > Br && (0, W.jsx)(Dg, {
                                label: `상향평가 근거`,
                                children: (0, W.jsx)(`textarea`, {
                                    value: wt,
                                    onChange: e => Tt(e.target.value)
                                })
                            }), (0, W.jsx)(Dg, {
                                label: `권리보호강도 추천 ${dg(Vr)}`,
                                children: (0, W.jsx)(`select`, {
                                    value: St,
                                    onChange: e => Ct(Number(e.target.value)),
                                    children: [ 1, 2, 3, 4, 5 ].map(e => (0, W.jsx)(`option`, {
                                        value: e,
                                        children: dg(e)
                                    }, e))
                                })
                            }), St > Vr && (0, W.jsx)(Dg, {
                                label: `상향평가 근거`,
                                children: (0, W.jsx)(`textarea`, {
                                    value: Et,
                                    onChange: e => Dt(e.target.value)
                                })
                            }) ]
                        }), (0, W.jsxs)(`article`, {
                            className: `validity-total`,
                            children: [ (0, W.jsx)(`span`, {
                                children: `지식재산 유효성`
                            }), (0, W.jsxs)(`strong`, {
                                children: [ Rr, `/40점` ]
                            }), (0, W.jsx)(`b`, {
                                children: $(zr * 100)
                            }), (0, W.jsx)(`small`, {
                                children: `상위등급은 요약용이며 40점 산식에 이중 합산하지 않습니다.`
                            }) ]
                        }) ]
                    }) ]
                })
            }), (0, W.jsx)(Rp, {
                value: `proration`,
                className: `valuation-tab-content`,
                children: (0, W.jsxs)(`div`, {
                    className: `section-grid two-columns`,
                    children: [ (0, W.jsxs)(Eg, {
                        title: `일할계산 기준`,
                        badge: `날짜 직접계산`,
                        children: [ (0, W.jsxs)(`div`, {
                            className: `formula-metrics large`,
                            children: [ (0, W.jsxs)(`div`, {
                                children: [ (0, W.jsx)(`span`, {
                                    children: `평가기준일`
                                }), (0, W.jsx)(`strong`, {
                                    children: r
                                }) ]
                            }), (0, W.jsxs)(`div`, {
                                children: [ (0, W.jsx)(`span`, {
                                    children: `1차년도 종료일`
                                }), (0, W.jsx)(`strong`, {
                                    children: vr
                                }) ]
                            }), (0, W.jsxs)(`div`, {
                                children: [ (0, W.jsx)(`span`, {
                                    children: `최종 적용 종료일`
                                }), (0, W.jsx)(`strong`, {
                                    children: Sr
                                }) ]
                            }), (0, W.jsxs)(`div`, {
                                children: [ (0, W.jsx)(`span`, {
                                    children: `법적 제한`
                                }), (0, W.jsx)(`strong`, {
                                    children: `해당 없음`
                                }) ]
                            }) ]
                        }), (0, W.jsx)(`p`, {
                            className: `helper-text`,
                            children: `윤년과 365·366일을 반영하고 계산값과 날짜는 잠금 처리합니다.`
                        }) ]
                    }), (0, W.jsx)(Eg, {
                        title: `1차년도 자동문안`,
                        badge: `보고서 연결`,
                        children: (0, W.jsxs)(`p`, {
                            className: `auto-copy`,
                            children: [ `평가기준일을 기준으로 `, rn, `년 예상 매출액 `, Gn[0].beforeProration.toLocaleString(void 0, {
                                maximumFractionDigits: 0
                            }), `백만원 중 `, hr, `일분과 `, rn + 1, `년 예상 매출액 `, Gn[1].beforeProration.toLocaleString(void 0, {
                                maximumFractionDigits: 0
                            }), `백만원 중 `, _r, `일분을 합산하여 1차년도 매출액을 산정하였다.` ]
                        })
                    }), (0, W.jsxs)(`article`, {
                        className: `stage-card span-2`,
                        children: [ (0, W.jsxs)(`div`, {
                            className: `card-title`,
                            children: [ (0, W.jsxs)(`div`, {
                                children: [ (0, W.jsx)(`span`, {
                                    className: `eyebrow`,
                                    children: `일할 전·후 연결표`
                                }), (0, W.jsx)(`h2`, {
                                    children: `현금흐름 차수별 매출액 검증`
                                }) ]
                            }), (0, W.jsx)(`span`, {
                                className: `source-chip`,
                                children: `단위: 백만원`
                            }) ]
                        }), (0, W.jsxs)(`div`, {
                            className: `proration-table`,
                            children: [ (0, W.jsxs)(`div`, {
                                children: [ (0, W.jsx)(`strong`, {
                                    children: `현금흐름 차수`
                                }), (0, W.jsx)(`strong`, {
                                    children: `적용기간`
                                }), (0, W.jsx)(`strong`, {
                                    children: `원천 연도`
                                }), (0, W.jsx)(`strong`, {
                                    children: `연간 예상매출액`
                                }), (0, W.jsx)(`strong`, {
                                    children: `적용일수`
                                }), (0, W.jsx)(`strong`, {
                                    children: `일할 반영액`
                                }) ]
                            }), (0, W.jsxs)(`div`, {
                                children: [ (0, W.jsx)(`span`, {
                                    children: `1차년도`
                                }), (0, W.jsxs)(`span`, {
                                    children: [ r, `~`, mg(pr) ]
                                }), (0, W.jsx)(`span`, {
                                    children: rn
                                }), (0, W.jsx)(`span`, {
                                    children: Gn[0].beforeProration.toLocaleString(void 0, {
                                        maximumFractionDigits: 0
                                    })
                                }), (0, W.jsxs)(`span`, {
                                    children: [ hr, `일` ]
                                }), (0, W.jsx)(`span`, {
                                    children: Math.round(Gn[0].beforeProration * hr / yg(rn)).toLocaleString()
                                }) ]
                            }), (0, W.jsxs)(`div`, {
                                children: [ (0, W.jsx)(`span`, {
                                    children: `1차년도`
                                }), (0, W.jsxs)(`span`, {
                                    children: [ mg(gr), `~`, vr ]
                                }), (0, W.jsx)(`span`, {
                                    children: rn + 1
                                }), (0, W.jsx)(`span`, {
                                    children: Gn[1].beforeProration.toLocaleString(void 0, {
                                        maximumFractionDigits: 0
                                    })
                                }), (0, W.jsxs)(`span`, {
                                    children: [ _r, `일` ]
                                }), (0, W.jsx)(`span`, {
                                    children: Math.round(Gn[1].beforeProration * _r / yg(rn + 1)).toLocaleString()
                                }) ]
                            }), (0, W.jsxs)(`div`, {
                                className: `total-row`,
                                children: [ (0, W.jsx)(`strong`, {
                                    children: `1차년도 합계`
                                }), (0, W.jsx)(`span`, {}), (0, W.jsx)(`span`, {}), (0, W.jsx)(`span`, {}), (0,
                                W.jsxs)(`strong`, {
                                    children: [ hr + _r, `일` ]
                                }), (0, W.jsx)(`strong`, {
                                    children: Math.round(Er[0]).toLocaleString()
                                }) ]
                            }), (0, W.jsxs)(`div`, {
                                children: [ (0, W.jsxs)(`span`, {
                                    children: [ yr.length, `차년도`, br.at(-1) ? ` · 부분연도` : `` ]
                                }), (0, W.jsxs)(`span`, {
                                    children: [ mg(Dr), `~`, mg(Or) ]
                                }), (0, W.jsx)(`span`, {
                                    children: kr.join(` · `)
                                }), (0, W.jsx)(`span`, {
                                    children: Ar
                                }), (0, W.jsxs)(`span`, {
                                    children: [ vg(Dr, Or), `일` ]
                                }), (0, W.jsx)(`span`, {
                                    children: Math.round(Er.at(-1) ?? 0).toLocaleString()
                                }) ]
                            }) ]
                        }) ]
                    }) ]
                })
            }) ]
        }), (0, W.jsxs)(`details`, {
            className: `calculation-trace`,
            children: [ (0, W.jsxs)(`summary`, {
                children: [ (0, W.jsxs)(`span`, {
                    children: [ (0, W.jsx)(j, {
                        size: 15
                    }), ` 계산 추적` ]
                }), (0, W.jsx)(`small`, {
                    children: `데이터처리 엔진의 연결값 보기`
                }) ]
            }), (0, W.jsxs)(`div`, {
                className: `trace-grid`,
                children: [ (0, W.jsxs)(`div`, {
                    children: [ (0, W.jsx)(`span`, {
                        children: `01 입력 정규화`
                    }), (0, W.jsx)(`strong`, {
                        children: `금액 백만원 · 비율 내부 소수값`
                    }), (0, W.jsx)(`small`, {
                        children: `원본값과 표시서식 분리`
                    }) ]
                }), (0, W.jsxs)(`div`, {
                    children: [ (0, W.jsx)(`span`, {
                        children: `02 매출 추정`
                    }), (0, W.jsxs)(`strong`, {
                        children: [ `최초 `, Math.round(Sn).toLocaleString(), `백만원 · 가중 `, $(yn) ]
                    }), (0, W.jsxs)(`small`, {
                        children: [ Xt === `productRevenue` ? `사업화제품 성장률` : `전체 매출 성장률`, ` 기준` ]
                    }) ]
                }), (0, W.jsxs)(`div`, {
                    children: [ (0, W.jsx)(`span`, {
                        children: `03 일할 계산`
                    }), (0, W.jsxs)(`strong`, {
                        children: [ hr, `일 + `, _r, `일` ]
                    }), (0, W.jsx)(`small`, {
                        children: `평가기준일 기준 현금흐름 차수 변환`
                    }) ]
                }), (0, W.jsxs)(`div`, {
                    children: [ (0, W.jsx)(`span`, {
                        children: `04 로열티`
                    }), (0, W.jsxs)(`strong`, {
                        children: [ $(Jn), ` × `, $n.toFixed(2), ` × `, $(tt) ]
                    }), (0, W.jsxs)(`small`, {
                        children: [ `최종 `, $(er) ]
                    }) ]
                }), (0, W.jsxs)(`div`, {
                    children: [ (0, W.jsx)(`span`, {
                        children: `05 세금`
                    }), (0, W.jsxs)(`strong`, {
                        children: [ t === `corporation` ? `법인세` : `종합소득세`, ` + 지방소득세` ]
                    }), (0, W.jsxs)(`small`, {
                        children: [ `누진공제 반영 · 평균 `, $(Pr) ]
                    }) ]
                }), (0, W.jsxs)(`div`, {
                    children: [ (0, W.jsx)(`span`, {
                        children: `06 현재가치`
                    }), (0, W.jsxs)(`strong`, {
                        children: [ `할인율 `, $(Fr) ]
                    }), (0, W.jsxs)(`small`, {
                        children: [ `IP유효성 `, $(zr * 100), ` 반영` ]
                    }) ]
                }) ]
            }) ]
        }), (0, W.jsxs)(`div`, {
            className: `valuation-footer-note`,
            children: [ (0, W.jsx)(re, {
                size: 15
            }), (0, W.jsxs)(`span`, {
                children: [ e, ` 적용규칙과 기관별 변수데이터 버전을 평가 건에 함께 저장합니다. 자동추천값·평가자 확정값·계산결과는 분리 보존됩니다.` ]
            }) ]
        }) ]
    });
}
