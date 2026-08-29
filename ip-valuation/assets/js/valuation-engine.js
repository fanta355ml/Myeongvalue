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
    for (var n = {}, r = e.length - 22; Th(e, r) != 101010256; --r) (!r || e.length - r > 65558) &