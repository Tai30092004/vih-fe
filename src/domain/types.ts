/* Kiểu dữ liệu máy chủ trả về (GET /api/trang-thai → state, đã lọc theo người đăng nhập ở goc-nhin.js).
   Chỉ khai trường dùng tới; trường khác vẫn có trong dữ liệu (chỉ mục [k: string]: unknown). Giờ giấc: chuỗi 'YYYY-MM-DDTHH:mm'. */

export type Id = string
export type Perm = string

export interface Role {
  id: Id
  name: string
  level: number
  perms: Perm[]
}

export type UserStatus = 'HOAT_DONG' | 'CHO_KICH_HOAT' | 'KHOA'

export interface User {
  id: Id
  name: string
  email?: string
  role: Id
  level: number
  title: string
  perms: Perm[]
  boss: Id | null
  status: UserStatus
  locked?: boolean
  avatar?: string
  [k: string]: unknown
}

export type TaskStatus = 'CHUA_NHAN' | 'DANG_LAM' | 'CHO_CHAM' | 'LAM_LAI' | 'HOAN_THANH' | 'HUY' | string

export interface Task {
  id: Id
  code: string
  title: string
  desc: string
  by: Id
  to: Id
  due: string
  status: TaskStatus
  vis: 'branch' | 'secret' | string
  level: number
  project?: Id | null
  parent: Id | null
  personal: boolean
  group: boolean
  proposal: boolean
  coop: Id[]
  rejected: { reason: string; at?: string } | null
  ext: { proposed: string; reason?: string } | null
  ver?: number
  [k: string]: unknown
}

export interface CalEvent {
  id: Id
  date: string
  denNgay?: string
  buoi?: string
  start: string
  end: string
  title: string
  chair: Id
  prep: Id[]
  attendees: string
  place: string
  link: string
  dress: string
  priv: boolean
  busy?: boolean
  doiTac?: Id
  ver?: number
  [k: string]: unknown
}

export interface Notif {
  id: Id
  to: Id
  text: string
  href?: string
  at: string
  read?: boolean
  [k: string]: unknown
}

export interface Project {
  id: Id
  code?: string
  name: string
  members: Id[]
  [k: string]: unknown
}

export interface Checkin {
  uid: Id
  date: string
  type: string
  place?: string
  eta?: string
  [k: string]: unknown
}

export interface Initiative {
  id: Id
  by: Id
  at: string
  title?: string
  [k: string]: unknown
}

export interface Settings {
  appName?: string
  holidays?: string[]
  anonymous?: boolean
  [k: string]: unknown
}

export interface AppState {
  me: Id
  v?: number
  sessExp?: number
  settings: Settings
  roles: Role[]
  users: User[]
  tasks: Task[]
  events: CalEvent[]
  notifs: Notif[]
  projects: Project[]
  checkin: Checkin[] | Record<string, unknown>
  initiatives: Initiative[]
  [k: string]: unknown
}
