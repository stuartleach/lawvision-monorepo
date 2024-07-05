function y() {}
function w(t, n) {
	for (const e in n) t[e] = n[e];
	return t;
}
function E(t) {
	return t();
}
function F() {
	return Object.create(null);
}
function j(t) {
	t.forEach(E);
}
function v(t) {
	return typeof t == 'function';
}
function M(t, n) {
	return t != t ? n == n : t !== n || (t && typeof t == 'object') || typeof t == 'function';
}
function S(t) {
	return Object.keys(t).length === 0;
}
function m(t, ...n) {
	if (t == null) {
		for (const o of n) o(void 0);
		return y;
	}
	const e = t.subscribe(...n);
	return e.unsubscribe ? () => e.unsubscribe() : e;
}
function A(t) {
	let n;
	return m(t, (e) => (n = e))(), n;
}
function B(t, n, e) {
	t.$$.on_destroy.push(m(n, e));
}
function D(t, n, e, o) {
	if (t) {
		const c = k(t, n, e, o);
		return t[0](c);
	}
}
function k(t, n, e, o) {
	return t[1] && o ? w(e.ctx.slice(), t[1](o(n))) : e.ctx;
}
function P(t, n, e, o) {
	if (t[2] && o) {
		const c = t[2](o(e));
		if (n.dirty === void 0) return c;
		if (typeof c == 'object') {
			const l = [],
				f = Math.max(n.dirty.length, c.length);
			for (let u = 0; u < f; u += 1) l[u] = n.dirty[u] | c[u];
			return l;
		}
		return n.dirty | c;
	}
	return n.dirty;
}
function U(t, n, e, o, c, l) {
	if (c) {
		const f = k(n, e, o, l);
		t.p(f, c);
	}
}
function G(t) {
	if (t.ctx.length > 32) {
		const n = [],
			e = t.ctx.length / 32;
		for (let o = 0; o < e; o++) n[o] = -1;
		return n;
	}
	return -1;
}
function H(t) {
	const n = {};
	for (const e in t) e[0] !== '$' && (n[e] = t[e]);
	return n;
}
function I(t, n) {
	const e = {};
	n = new Set(n);
	for (const o in t) !n.has(o) && o[0] !== '$' && (e[o] = t[o]);
	return e;
}
function J(t) {
	const n = {};
	for (const e in t) n[e] = !0;
	return n;
}
function K(t) {
	return t && v(t.destroy) ? t.destroy : y;
}
let i;
function _(t) {
	i = t;
}
function b() {
	if (!i) throw new Error('Function called outside component initialization');
	return i;
}
function L(t) {
	b().$$.on_mount.push(t);
}
function N(t) {
	b().$$.after_update.push(t);
}
function Q(t) {
	return b().$$.context.get(t);
}
function R(t, n) {
	const e = t.$$.callbacks[n.type];
	e && e.slice().forEach((o) => o.call(this, n));
}
const a = [],
	g = [];
let s = [];
const h = [],
	x = Promise.resolve();
let p = !1;
function O() {
	p || ((p = !0), x.then(z));
}
function T() {
	return O(), x;
}
function q(t) {
	s.push(t);
}
function V(t) {
	h.push(t);
}
const d = new Set();
let r = 0;
function z() {
	if (r !== 0) return;
	const t = i;
	do {
		try {
			for (; r < a.length; ) {
				const n = a[r];
				r++, _(n), C(n.$$);
			}
		} catch (n) {
			throw ((a.length = 0), (r = 0), n);
		}
		for (_(null), a.length = 0, r = 0; g.length; ) g.pop()();
		for (let n = 0; n < s.length; n += 1) {
			const e = s[n];
			d.has(e) || (d.add(e), e());
		}
		s.length = 0;
	} while (a.length);
	for (; h.length; ) h.pop()();
	(p = !1), d.clear(), _(t);
}
function C(t) {
	if (t.fragment !== null) {
		t.update(), j(t.before_update);
		const n = t.dirty;
		(t.dirty = [-1]), t.fragment && t.fragment.p(t.ctx, n), t.after_update.forEach(q);
	}
}
function W(t) {
	const n = [],
		e = [];
	s.forEach((o) => (t.indexOf(o) === -1 ? n.push(o) : e.push(o))), e.forEach((o) => o()), (s = n);
}
export {
	K as A,
	J as B,
	Q as C,
	R as D,
	V as E,
	A as F,
	N as a,
	g as b,
	B as c,
	D as d,
	P as e,
	F as f,
	G as g,
	z as h,
	v as i,
	S as j,
	q as k,
	W as l,
	i as m,
	y as n,
	L as o,
	_ as p,
	E as q,
	j as r,
	M as s,
	T as t,
	U as u,
	a as v,
	O as w,
	I as x,
	w as y,
	H as z
};
