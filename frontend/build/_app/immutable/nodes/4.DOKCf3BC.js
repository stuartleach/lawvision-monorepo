import { s as l, n } from '../chunks/scheduler.DUZ9pEMT.js';
import { S as r, i, e as c, c as m, g as p, b as d, d as f } from '../chunks/index.B2RTt-ug.js';
function h(s) {
	let t,
		a = 'hello';
	return {
		c() {
			(t = c('h2')), (t.textContent = a);
		},
		l(e) {
			(t = m(e, 'H2', { 'data-svelte-h': !0 })), p(t) !== 'svelte-14sggza' && (t.textContent = a);
		},
		m(e, o) {
			d(e, t, o);
		},
		p: n,
		i: n,
		o: n,
		d(e) {
			e && f(t);
		}
	};
}
class g extends r {
	constructor(t) {
		super(), i(this, t, null, h, l, {});
	}
}
export { g as component };
