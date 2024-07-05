var C = Object.defineProperty;
var O = (e, t, n) =>
	t in e ? C(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : (e[t] = n);
var y = (e, t, n) => O(e, typeof t != 'symbol' ? t + '' : t, n);
import {
	r as h,
	n as p,
	f as v,
	h as B,
	i as E,
	j as L,
	k as b,
	l as I,
	m as P,
	p as N,
	q as T,
	v as D,
	w as H
} from './scheduler.DUZ9pEMT.js';
let $ = !1;
function q() {
	$ = !0;
}
function M() {
	$ = !1;
}
function z(e, t, n, i) {
	for (; e < t; ) {
		const a = e + ((t - e) >> 1);
		n(a) <= i ? (e = a + 1) : (t = a);
	}
	return e;
}
function F(e) {
	if (e.hydrate_init) return;
	e.hydrate_init = !0;
	let t = e.childNodes;
	if (e.nodeName === 'HEAD') {
		const s = [];
		for (let r = 0; r < t.length; r++) {
			const o = t[r];
			o.claim_order !== void 0 && s.push(o);
		}
		t = s;
	}
	const n = new Int32Array(t.length + 1),
		i = new Int32Array(t.length);
	n[0] = -1;
	let a = 0;
	for (let s = 0; s < t.length; s++) {
		const r = t[s].claim_order,
			o = (a > 0 && t[n[a]].claim_order <= r ? a + 1 : z(1, a, (d) => t[n[d]].claim_order, r)) - 1;
		i[s] = n[o] + 1;
		const u = o + 1;
		(n[u] = s), (a = Math.max(u, a));
	}
	const f = [],
		l = [];
	let c = t.length - 1;
	for (let s = n[a] + 1; s != 0; s = i[s - 1]) {
		for (f.push(t[s - 1]); c >= s; c--) l.push(t[c]);
		c--;
	}
	for (; c >= 0; c--) l.push(t[c]);
	f.reverse(), l.sort((s, r) => s.claim_order - r.claim_order);
	for (let s = 0, r = 0; s < l.length; s++) {
		for (; r < f.length && l[s].claim_order >= f[r].claim_order; ) r++;
		const o = r < f.length ? f[r] : null;
		e.insertBefore(l[s], o);
	}
}
function G(e, t) {
	if ($) {
		for (
			F(e),
				(e.actual_end_child === void 0 ||
					(e.actual_end_child !== null && e.actual_end_child.parentNode !== e)) &&
					(e.actual_end_child = e.firstChild);
			e.actual_end_child !== null && e.actual_end_child.claim_order === void 0;

		)
			e.actual_end_child = e.actual_end_child.nextSibling;
		t !== e.actual_end_child
			? (t.claim_order !== void 0 || t.parentNode !== e) && e.insertBefore(t, e.actual_end_child)
			: (e.actual_end_child = t.nextSibling);
	} else (t.parentNode !== e || t.nextSibling !== null) && e.appendChild(t);
}
function le(e, t, n) {
	$ && !n ? G(e, t) : (t.parentNode !== e || t.nextSibling != n) && e.insertBefore(t, n || null);
}
function R(e) {
	e.parentNode && e.parentNode.removeChild(e);
}
function ae(e, t) {
	for (let n = 0; n < e.length; n += 1) e[n] && e[n].d(t);
}
function U(e) {
	return document.createElement(e);
}
function V(e) {
	return document.createElementNS('http://www.w3.org/2000/svg', e);
}
function x(e) {
	return document.createTextNode(e);
}
function ce() {
	return x(' ');
}
function fe() {
	return x('');
}
function ue(e, t, n, i) {
	return e.addEventListener(t, n, i), () => e.removeEventListener(t, n, i);
}
function A(e, t, n) {
	n == null ? e.removeAttribute(t) : e.getAttribute(t) !== n && e.setAttribute(t, n);
}
const W = ['width', 'height'];
function J(e, t) {
	const n = Object.getOwnPropertyDescriptors(e.__proto__);
	for (const i in t)
		t[i] == null
			? e.removeAttribute(i)
			: i === 'style'
				? (e.style.cssText = t[i])
				: i === '__value'
					? (e.value = e[i] = t[i])
					: n[i] && n[i].set && W.indexOf(i) === -1
						? (e[i] = t[i])
						: A(e, i, t[i]);
}
function K(e, t) {
	Object.keys(t).forEach((n) => {
		Q(e, n, t[n]);
	});
}
function Q(e, t, n) {
	const i = t.toLowerCase();
	i in e
		? (e[i] = typeof e[i] == 'boolean' && n === '' ? !0 : n)
		: t in e
			? (e[t] = typeof e[t] == 'boolean' && n === '' ? !0 : n)
			: A(e, t, n);
}
function oe(e) {
	return /-/.test(e) ? K : J;
}
function _e(e) {
	return e.dataset.svelteH;
}
function X(e) {
	return Array.from(e.childNodes);
}
function Y(e) {
	e.claim_info === void 0 && (e.claim_info = { last_index: 0, total_claimed: 0 });
}
function S(e, t, n, i, a = !1) {
	Y(e);
	const f = (() => {
		for (let l = e.claim_info.last_index; l < e.length; l++) {
			const c = e[l];
			if (t(c)) {
				const s = n(c);
				return s === void 0 ? e.splice(l, 1) : (e[l] = s), a || (e.claim_info.last_index = l), c;
			}
		}
		for (let l = e.claim_info.last_index - 1; l >= 0; l--) {
			const c = e[l];
			if (t(c)) {
				const s = n(c);
				return (
					s === void 0 ? e.splice(l, 1) : (e[l] = s),
					a ? s === void 0 && e.claim_info.last_index-- : (e.claim_info.last_index = l),
					c
				);
			}
		}
		return i();
	})();
	return (f.claim_order = e.claim_info.total_claimed), (e.claim_info.total_claimed += 1), f;
}
function j(e, t, n, i) {
	return S(
		e,
		(a) => a.nodeName === t,
		(a) => {
			const f = [];
			for (let l = 0; l < a.attributes.length; l++) {
				const c = a.attributes[l];
				n[c.name] || f.push(c.name);
			}
			f.forEach((l) => a.removeAttribute(l));
		},
		() => i(t)
	);
}
function de(e, t, n) {
	return j(e, t, n, U);
}
function me(e, t, n) {
	return j(e, t, n, V);
}
function Z(e, t) {
	return S(
		e,
		(n) => n.nodeType === 3,
		(n) => {
			const i = '' + t;
			if (n.data.startsWith(i)) {
				if (n.data.length !== i.length) return n.splitText(i.length);
			} else n.data = i;
		},
		() => x(t),
		!0
	);
}
function he(e) {
	return Z(e, ' ');
}
function $e(e, t) {
	(t = '' + t), e.data !== t && (e.data = t);
}
function ye(e, t) {
	e.value = t ?? '';
}
function pe(e, t, n, i) {
	n == null ? e.style.removeProperty(t) : e.style.setProperty(t, n, '');
}
function xe(e, t, n) {
	e.classList.toggle(t, !!n);
}
function ge(e, t) {
	return new e(t);
}
const m = new Set();
let _;
function we() {
	_ = { r: 0, c: [], p: _ };
}
function ve() {
	_.r || h(_.c), (_ = _.p);
}
function k(e, t) {
	e && e.i && (m.delete(e), e.i(t));
}
function be(e, t, n, i) {
	if (e && e.o) {
		if (m.has(e)) return;
		m.add(e),
			_.c.push(() => {
				m.delete(e), i && (n && e.d(1), i());
			}),
			e.o(t);
	} else i && i();
}
function Ne(e, t, n) {
	const i = e.$$.props[t];
	i !== void 0 && ((e.$$.bound[i] = n), n(e.$$.ctx[i]));
}
function Ee(e) {
	e && e.c();
}
function Ae(e, t) {
	e && e.l(t);
}
function ee(e, t, n) {
	const { fragment: i, after_update: a } = e.$$;
	i && i.m(t, n),
		b(() => {
			const f = e.$$.on_mount.map(T).filter(E);
			e.$$.on_destroy ? e.$$.on_destroy.push(...f) : h(f), (e.$$.on_mount = []);
		}),
		a.forEach(b);
}
function te(e, t) {
	const n = e.$$;
	n.fragment !== null &&
		(I(n.after_update),
		h(n.on_destroy),
		n.fragment && n.fragment.d(t),
		(n.on_destroy = n.fragment = null),
		(n.ctx = []));
}
function ne(e, t) {
	e.$$.dirty[0] === -1 && (D.push(e), H(), e.$$.dirty.fill(0)),
		(e.$$.dirty[(t / 31) | 0] |= 1 << t % 31);
}
function Se(e, t, n, i, a, f, l = null, c = [-1]) {
	const s = P;
	N(e);
	const r = (e.$$ = {
		fragment: null,
		ctx: [],
		props: f,
		update: p,
		not_equal: a,
		bound: v(),
		on_mount: [],
		on_destroy: [],
		on_disconnect: [],
		before_update: [],
		after_update: [],
		context: new Map(t.context || (s ? s.$$.context : [])),
		callbacks: v(),
		dirty: c,
		skip_bound: !1,
		root: t.target || s.$$.root
	});
	l && l(r.root);
	let o = !1;
	if (
		((r.ctx = n
			? n(e, t.props || {}, (u, d, ...g) => {
					const w = g.length ? g[0] : d;
					return (
						r.ctx &&
							a(r.ctx[u], (r.ctx[u] = w)) &&
							(!r.skip_bound && r.bound[u] && r.bound[u](w), o && ne(e, u)),
						d
					);
				})
			: []),
		r.update(),
		(o = !0),
		h(r.before_update),
		(r.fragment = i ? i(r.ctx) : !1),
		t.target)
	) {
		if (t.hydrate) {
			q();
			const u = X(t.target);
			r.fragment && r.fragment.l(u), u.forEach(R);
		} else r.fragment && r.fragment.c();
		t.intro && k(e.$$.fragment), ee(e, t.target, t.anchor), M(), B();
	}
	N(s);
}
class je {
	constructor() {
		y(this, '$$');
		y(this, '$$set');
	}
	$destroy() {
		te(this, 1), (this.$destroy = p);
	}
	$on(t, n) {
		if (!E(n)) return p;
		const i = this.$$.callbacks[t] || (this.$$.callbacks[t] = []);
		return (
			i.push(n),
			() => {
				const a = i.indexOf(n);
				a !== -1 && i.splice(a, 1);
			}
		);
	}
	$set(t) {
		this.$$set && !L(t) && ((this.$$.skip_bound = !0), this.$$set(t), (this.$$.skip_bound = !1));
	}
}
const ie = '4';
typeof window < 'u' && (window.__svelte || (window.__svelte = { v: new Set() })).v.add(ie);
export {
	me as A,
	ue as B,
	ae as C,
	oe as D,
	J as E,
	ye as F,
	Ne as G,
	xe as H,
	je as S,
	A as a,
	le as b,
	de as c,
	R as d,
	U as e,
	X as f,
	_e as g,
	Z as h,
	Se as i,
	he as j,
	G as k,
	$e as l,
	fe as m,
	be as n,
	ve as o,
	k as p,
	pe as q,
	we as r,
	ce as s,
	x as t,
	ge as u,
	Ee as v,
	Ae as w,
	ee as x,
	te as y,
	V as z
};
