// Sinh src/shared/ui/icons.ts từ web/icons-fluent.js của repo Web_Notification (nhánh giao diện mới).
// Dùng: node scripts/tao-icons.mjs <đường dẫn icons-fluent.js>
import { readFileSync, writeFileSync } from 'node:fs'
import vm from 'node:vm'

const nguon = process.argv[2]
if (!nguon) throw new Error('Thiếu đường dẫn icons-fluent.js')
const ctx = vm.createContext({})
vm.runInContext(readFileSync(nguon, 'utf8') + '\n;globalThis.__ICON = ICON_FL', ctx)
const bo = ctx.__ICON
const ten = Object.keys(bo).sort()
const dong = [
  '/* TỰ SINH bởi scripts/tao-icons.mjs, đừng sửa tay. Fluent UI System Icons, giấy phép MIT, © Microsoft Corporation. */',
  'export type IconSize = 16 | 20 | 24',
  'export type IconPaths = Partial<Record<`${IconSize}` | `f${IconSize}`, string>>',
  `export const ICON_NAMES = ${JSON.stringify(ten)} as const`,
  'export type IconName = (typeof ICON_NAMES)[number]',
  `export const ICONS: Record<IconName, IconPaths> = ${JSON.stringify(bo)}`,
  '',
]
writeFileSync('src/shared/ui/icons.ts', dong.join('\n'))
console.log(`Đã sinh ${ten.length} icon`)
