// 复现：prop 的 DOM 反射属性名只做了读的一侧都没做，写进去变成 HTML 不认的假属性
import { describe, it } from 'vitest';
import { load } from '../src/index.js';

describe('现状', () => {
  it('打出全部现状', () => {
    const $ = load('<div id=d class="a b" for="x" tabindex="3"><b>x</b></div><input id=i readonly>');
    const d = $('#d');
    function tryIt(label: string, fn: () => unknown) {
      try {
        console.log(label, '=>', JSON.stringify(fn()));
      } catch (error) {
        console.log(label, '=> THROW', (error as Error).message.slice(0, 60));
      }
    }
    tryIt('X01 read class      ', () => d.prop('class'));
    tryIt('X02 read className  ', () => d.prop('className'));
    tryIt('X03 read tabindex   ', () => d.prop('tabindex'));
    tryIt('X04 read tabIndex   ', () => d.prop('tabIndex'));
    tryIt('X05 read htmlFor    ', () => d.prop('htmlFor'));
    tryIt('X06 write tabIndex=7', () => (d.prop('tabIndex', 7), d.attr()));
    tryIt('X07 write className=c', () => (d.prop('className', 'c'), d.attr('class')));
    tryIt('X08 write htmlFor=y ', () => (d.prop('htmlFor', 'y'), d.attr('for')));
    tryIt('X09 attr dump       ', () => d.attr());
    tryIt('X10 html()          ', () => $.html().slice(0, 150));
    tryIt('X11 write nodeName  ', () => (d.prop('nodeName', 'span'), d.attr('nodeName')));
    tryIt('Y01 xml className   ', () => {
      const $x = load('<p className="k">x</p>', { xml: true });
      $x('p').prop('className', 'm');
      return $x.html();
    });
    const $m = load('<p id=m class="a" className="b">m</p>');
    const mm = $m('#m');
    tryIt('Y02 mirror read class    ', () => mm.prop('class'));
    tryIt('Y03 mirror read className', () => mm.prop('className'));
    tryIt('Y04 mirror write className=c', () => (mm.prop('className', 'c'), mm.attr()));
    const $m2 = load('<p id=m class="a" className="b">m</p>');
    const mm2 = $m2('#m');
    tryIt('Y05 mirror write class=d ', () => (mm2.prop('class', 'd'), mm2.attr()));
    tryIt('Y06 mirror html out      ', () => (mm.prop('tabIndex', 9), $m.html()));
    tryIt('X12 readonly prop   ', () => $('#i').prop('readonly'));
  });
});
