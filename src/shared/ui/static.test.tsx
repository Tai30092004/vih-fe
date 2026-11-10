import { render, screen } from '@testing-library/react'
import { describe, expect, test, vi } from 'vitest'
import { Avatar, Button, Chip, EmptyState, EventCard, Hero, Icon, IconButton, Row, Stat, TaskCard } from './index'

describe('Icon', () => {
  test('vẽ svg có aria-hidden và viewBox theo cỡ', () => {
    const { container } = render(<Icon name="home" />)
    const svg = container.querySelector('svg')!
    expect(svg).toHaveAttribute('aria-hidden', 'true')
    expect(svg.getAttribute('viewBox')).toBe('0 0 20 20')
  })
  test('tên không có thì không vỡ, rơi về info', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    // @ts-expect-error tên icon không có trong bộ
    const { container } = render(<Icon name="khong-co" />)
    expect(container.querySelector('svg')).not.toBeNull()
    warn.mockRestore()
  })
})

describe('Button', () => {
  test('loading: aria-busy, không bấm được lần nữa', () => {
    const onClick = vi.fn()
    render(<Button loading onClick={onClick}>Lưu</Button>)
    const b = screen.getByRole('button', { name: /Lưu/ })
    expect(b).toHaveAttribute('aria-busy', 'true')
    b.click()
    expect(onClick).not.toHaveBeenCalled()
  })
  test('href thì là liên kết, có class theo kind và size', () => {
    render(<Button href="#/tasks" kind="primary" size="lg">Mở</Button>)
    const a = screen.getByRole('link', { name: 'Mở' })
    expect(a).toHaveAttribute('href', '#/tasks')
    expect(a.className).toContain('c-btn--primary')
    expect(a.className).toContain('c-btn--lg')
  })
  test('href javascript: bị chặn', () => {
    render(<Button href="javascript:alert(1)">X</Button>)
    expect(screen.getByRole('link')).toHaveAttribute('href', '#')
  })
})

test('IconButton bắt buộc label và dùng làm aria-label', () => {
  render(<IconButton icon="x" label="Đóng" />)
  expect(screen.getByRole('button', { name: 'Đóng' })).toBeInTheDocument()
  // @ts-expect-error thiếu label
  void (<IconButton icon="x" />)
})

test('Chip có tone', () => {
  render(<Chip label="Bảo mật" tone="slate" icon="lock" />)
  expect(screen.getByText('Bảo mật').closest('.c-chip')!.className).toContain('t-slate')
})

test('Avatar không ảnh thì hiện chữ tắt', () => {
  render(<Avatar name="Chuyên viên Một" />)
  expect(screen.getByText('CM')).toBeInTheDocument()
})

test('Stat hiện số theo vi-VN và là liên kết khi có href', () => {
  render(<Stat label="Quá hạn" value={1234} icon="alert" tone="coral" href="#/tasks" />)
  expect(screen.getAllByText('1.234').length).toBeGreaterThan(0)
  expect(screen.getByRole('link', { name: 'Quá hạn' })).toHaveAttribute('href', '#/tasks')
})

test('Hero có vòng tiến độ role progressbar', () => {
  render(<Hero title="Tiến độ tuần" value={3} unit="/ 5 việc xong" sub="2 việc đang chờ" tone="rose" ring={{ value: 60, label: 'Hoàn thành 60%' }} />)
  expect(screen.getByRole('progressbar', { name: 'Hoàn thành 60%' })).toHaveAttribute('aria-valuenow', '60')
})

test('Row có tiêu đề là liên kết và dải nút bên dưới', () => {
  render(<Row title="Duyệt đề xuất" sub="Chuyên viên 1 gửi" href="#/tasks/t1" below={<button>Duyệt</button>} />)
  expect(screen.getByRole('link', { name: 'Duyệt đề xuất' })).toHaveAttribute('href', '#/tasks/t1')
  expect(screen.getByRole('button', { name: 'Duyệt' })).toBeInTheDocument()
})

test('EmptyState hiện tiêu đề và mô tả', () => {
  render(<EmptyState icon="tasks" title="Chưa có việc" text="Giao việc đầu tiên." />)
  expect(screen.getByText('Chưa có việc')).toBeInTheDocument()
})

test('TaskCard liên kết tới #/tasks/<id>, có viên hạn', () => {
  render(<TaskCard title="Soạn báo cáo" href="#/tasks/t9" tone="amber" due={{ label: 'Hôm nay 17:00', tone: 'amber' }} />)
  expect(screen.getByRole('link', { name: 'Soạn báo cáo' })).toHaveAttribute('href', '#/tasks/t9')
  expect(screen.getByText('Hôm nay 17:00')).toBeInTheDocument()
})

test('EventCard đang diễn ra có nhãn và nút vào họp mở tab mới', () => {
  render(<EventCard time="09:00" end="10:30" title="Giao ban" live join={{ href: 'https://meet.google.com/x', label: 'Vào họp' }} />)
  expect(screen.getByText('Đang diễn ra')).toBeInTheDocument()
  expect(screen.getByRole('link', { name: /Vào họp/ })).toHaveAttribute('target', '_blank')
})
