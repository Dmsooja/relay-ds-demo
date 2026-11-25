import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'

const schema = JSON.parse(readFileSync('code-connect/components.json', 'utf8'))
execFileSync(process.execPath, ['scripts/generate-connect.mjs', '--check'], { stdio: 'inherit' })

const variants = {
  react: ['figma.config.json', 'React', 18],
  angular: ['figma.angular.config.json', 'Angular', 18],
  'web-components': ['figma.web-components.config.json', 'Web Components', 18],
  'react-native': ['figma.react-native.config.json', 'React Native', 7],
}
for (const [framework, [config, label, count]] of Object.entries(variants)) {
  const cli = './node_modules/.bin/figma'
  const raw = execFileSync(cli, ['connect', 'parse', '--config', config, '--skip-update-check', '--exit-on-unreadable-files'], { encoding: 'utf8' })
  const docs = JSON.parse(raw)
  assert.equal(docs.length, count, framework + ' document count')
  for (const doc of docs) {
    const name = Object.keys(schema).find(key => doc.figmaNode.endsWith('node-id=' + schema[key].id.replace(':', '-')))
    assert.ok(name, doc.figmaNode)
    assert.equal(doc.label, label)
    assert.ok(doc.template?.trim())
    for (const [prop, values] of Object.entries(schema[name].properties)) {
      if (!Array.isArray(values)) continue
      const source = readFileSync('code-connect/' + framework + '/' + name + '.figma.ts', 'utf8')
      const line = source.split('\n').find(line => line.includes('getEnum(' + JSON.stringify(prop)))
      assert.ok(line && values.every(value => line.includes(JSON.stringify(value))), name + ' ' + prop)
      const enumObject = line.match(/getEnum\([^,]+,\s*(\{.*\})\)/)?.[1]
      assert.ok(enumObject, `${framework} ${name} ${prop}: readable enum mapping`)
      const mapping = JSON.parse(enumObject)
      assert.deepEqual(Object.keys(mapping).sort(), [...values].sort(), `${framework} ${name} ${prop}: enum keys`)
      for (const value of values) assert.equal(mapping[value], value.toLowerCase().replaceAll(' ', '-'), `${framework} ${name} ${prop}=${value}`)
    }
  }
  console.log(label + ': ' + docs.length + ' templates parsed and validated')
}
