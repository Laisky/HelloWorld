/* Offline behavioral regressions for the historical dependency examples.
 * Run with each example's supported Node version; no external services. */
'use strict';
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const os = require('os');
const selected = process.argv[2] || 'all';
const root = process.env.DEPENDENCY_ROOT || path.resolve(__dirname, '..');
let passed = 0;
async function check(name, fn) {
  await fn();
  passed++;
  console.log('PASS ' + name);
}
function load(dir, name) { return require(path.join(root, dir, 'node_modules', name)); }
async function slides() {
  const dir = 'tools/google-slides';
  await check('Slides deep merge rejects prototype pollution and preserves nested data', () => {
    const extend = load(dir, 'extend');
    const result = extend(true, {}, {safe: {title: 'slide'}},
      JSON.parse('{"__proto__":{"polluted":"unsafe"}}'));
    assert.strictEqual({}.polluted, undefined);
    assert.strictEqual(result.safe.title, 'slide');
  });
  await check('Slides lodash deep paths cannot write Object.prototype', () => {
    const lodash = load(dir, 'lodash');
    lodash.zipObjectDeep(['__proto__.polluted'], ['unsafe']);
    assert.strictEqual({}.polluted, undefined);
    assert.deepStrictEqual(lodash.zipObjectDeep(['slide.title'], ['hello']),
      {slide: {title: 'hello'}});
  });
  await check('Slides query parsing keeps arrays and rejects prototype keys', () => {
    const qs = load(dir, 'qs');
    assert.deepStrictEqual(qs.parse('tag[]=a&tag[]=b'), {tag: ['a', 'b']});
    qs.parse('__proto__[polluted]=unsafe');
    assert.strictEqual({}.polluted, undefined);
  });
  await check('Slides schema validation accepts valid documents and rejects wrong types', () => {
    const validate = load(dir, 'is-my-json-valid')({type: 'object',
      properties: {title: {type: 'string'}}, required: ['title']});
    assert.strictEqual(validate({title: 'hello'}), true);
    assert.strictEqual(validate({title: 42}), false);
  });
  await check('Slides cookies and MIME lookup retain rendering input behavior', () => {
    const cookie = load(dir, 'tough-cookie').Cookie.parse('slide=one; Path=/; Secure');
    assert.strictEqual(cookie.key, 'slide');
    assert.strictEqual(cookie.secure, true);
    assert.strictEqual(load(dir, 'mime').lookup('image.png'), 'image/png');
  });
  await check('Slides string streaming keeps multibyte text across chunks', () => new Promise((resolve, reject) => {
    const Stream = load(dir, 'stringstream');
    const stream = new Stream('utf8');
    const chunks = [];
    stream.on('data', (data) => chunks.push(data));
    stream.on('error', reject);
    stream.on('end', () => {
      try { assert.strictEqual(chunks.join(''), 'hello 世界'); resolve(); } catch (e) { reject(e); }
    });
    const bytes = Buffer.from('hello 世界');
    stream.write(bytes.slice(0, 8)); stream.write(bytes.slice(8)); stream.end();
  }));
}
async function kibana() {
  const dir = 'kibana/plugins/demo';
  await check('Kibana async memoization handles prototype-looking keys', () => new Promise((resolve, reject) => {
    const memo = load(dir, 'async').memoize((key, callback) => callback(null, 'value:' + key));
    memo('__proto__', (error, value) => {
      try { assert.ifError(error); assert.strictEqual(value, 'value:__proto__'); resolve(); } catch (e) { reject(e); }
    });
  }));
  await check('Kibana async map values cannot inherit attacker properties', () => new Promise((resolve, reject) => {
    load(dir, 'async').mapValues(JSON.parse('{"__proto__":{"polluted":"unsafe"},"safe":"ok"}'),
      (value, key, callback) => callback(null, value),
      (error, result) => {
        try { assert.ifError(error); assert.strictEqual(result.polluted, undefined);
          assert.strictEqual(result.safe, 'ok'); resolve(); } catch (e) { reject(e); }
      });
  }));
  await check('Kibana loader query parsing handles untrusted keys safely', () => {
    const utils = load(dir, 'loader-utils');
    const query = utils.parseQuery('?__proto__=unsafe&name=demo');
    assert.strictEqual(query['__proto__'], 'unsafe');
    assert.strictEqual({}.polluted, undefined);
    assert.strictEqual(query.name, 'demo');
    assert.strictEqual(utils.interpolateName({resourcePath: '/tmp/icon.svg'},
      '[name].[ext]', {content: Buffer.from('x')}), 'icon.svg');
  });
  await check('Kibana secp256k1 signatures verify and reject changed messages', () => {
    const ec = new (load(dir, 'elliptic').ec)('secp256k1');
    const key = ec.keyFromPrivate('1');
    const signature = key.sign('0123456789abcdef');
    assert.strictEqual(key.verify('0123456789abcdef', signature), true);
    assert.strictEqual(key.verify('1123456789abcdef', signature), false);
  });
  await check('Kibana user agent, paths, and hosted Git URLs remain parseable', () => {
    const ua = load(dir, 'ua-parser-js')('Mozilla/5.0 Chrome/120.0.0.0 Safari/537.36');
    assert.strictEqual(ua.browser.name, 'Chrome');
    assert.strictEqual(load(dir, 'path-parse')('/tmp/demo/index.js').name, 'index');
    assert.strictEqual(load(dir, 'hosted-git-info').fromUrl('git+https://github.com/Laisky/HelloWorld.git').project, 'HelloWorld');
  });
  await check('Kibana locale interpolation and lodash objects remain usable', () => {
    const folder = fs.mkdtempSync(path.join(os.tmpdir(), 'helloworld-locale-'));
    try {
      const locale = load(dir, 'y18n')({directory: folder, updateFiles: false});
      assert.strictEqual(locale.__('hello %s', 'world'), 'hello world');
      assert.deepStrictEqual(load(dir, 'lodash').map([{n: 1}, {n: 2}], 'n'), [1, 2]);
    } finally { fs.rmdirSync(folder); }
  });
  await check('Actual Kibana route registers GET and replies with an ISO timestamp', () => {
    const source = fs.readFileSync(path.join(root, dir, 'server/routes/example.js'), 'utf8');
    load(dir, 'babel-eslint').parse(source);
    const context = {module: {exports: {}}, Date};
    vm.runInNewContext(source.replace('export default ', 'module.exports = '), context);
    let route;
    context.module.exports({route: (value) => { route = value; }});
    assert.strictEqual(route.path, '/api/demo/example');
    assert.strictEqual(route.method, 'GET');
    let reply;
    route.handler({}, (value) => { reply = value; });
    assert.strictEqual(new Date(reply.time).toISOString(), reply.time);
  });
}
async function webpack() {
  const dir = 'FE/webpack/webpack_v1';
  await check('Webpack keeps Bootstrap 3 styling and glyphicons', () => {
    const css = fs.readFileSync(path.join(root, dir, 'node_modules/bootstrap/dist/css/bootstrap.css'), 'utf8');
    assert(css.includes('.glyphicon'));
    assert(css.includes('.navbar-default'));
    assert(fs.existsSync(path.join(root, dir, 'node_modules/bootstrap/fonts/glyphicons-halflings-regular.woff2')));
  });
  await check('Webpack JSX compiles with the existing Babel 6 presets', () => {
    const result = load(dir, 'babel-core').transform('ReactDOM.render(<h1>Hello World</h1>, target)', {
      presets: ['es2015', 'react'].map(n => path.join(root, dir, 'node_modules/babel-preset-' + n))
    }).code;
    assert(result.includes('React.createElement'));
    assert(result.includes('Hello World'));
  });
  await check('Webpack 1 configuration keeps the legacy compiler and plugins usable', () => {
    const compiler = load(dir, 'webpack')(require(path.join(root, dir, 'webpack.config.js')));
    assert.strictEqual(typeof compiler.run, 'function');
    assert.strictEqual(typeof compiler.plugin, 'function');
  });
  await check('Webpack local preview serves compiled assets without modern compiler hooks', () => {
    require('child_process').execFileSync(process.execPath, [
      path.join(root, dir, 'tests/preview.test.cjs')
    ], {stdio: 'inherit'});
  });
}
(async () => {
  if (selected === 'slides' || selected === 'all') await slides();
  if (selected === 'kibana' || selected === 'all') await kibana();
  if (selected === 'webpack' || selected === 'all') await webpack();
  console.log(passed + ' behavioral checks passed');
})().catch(error => { console.error(error); process.exitCode = 1; });
