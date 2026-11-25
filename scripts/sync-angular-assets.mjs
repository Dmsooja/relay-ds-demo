import { cp, mkdir } from 'node:fs/promises'

const source = new URL('../shared/public/', import.meta.url)
const target = new URL('../frameworks/angular/public/', import.meta.url)
await mkdir(target, { recursive: true })
await cp(source, target, { recursive: true })
