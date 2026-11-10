# UC-HOME-01 — DESIGN-README (Hôm nay)

> Theo `viewToday()` nhánh `feat/build-new-ui-v2` và `refactor-design/04-bo-cuc.md` mục "Màn gốc: Hôm nay".

## 1. Vùng tổng quan (`l-td-dau`)
Chip "Vị trí của tôi" (mint đã báo, amber chưa báo) → `Hero` "Tiến độ tuần" tone rose có vòng phần trăm → lưới 4 `Stat`: Chờ tôi quyết (rose), Quá hạn (coral), Hạn hôm nay (amber), Lịch hôm nay (sky); số 0 thì tone slate.

## 2. Vùng nội dung (`l-td-khoi`)
`Tabs` 4 mục có icon và số đếm: Cần làm (inbox, rose), Lịch (cal, sky), Đội (team, mint), Bảng tin (news, amber). Chỉ dựng tab đang mở.

## 3. Thẻ
- Việc: `TaskCard` viên hạn đổi màu (quá hạn coral nếu của mình, amber nếu của người khác; hôm nay amber; sau đó mint), chip dự án, chip Bảo mật, nút thao tác.
- Chờ tôi quyết: `Row` có dải nút bên dưới (`below`), không ô icon.
- Lịch: `EventCard` giờ lớn; đang diễn ra có nền đậm và nút "Vào họp".

## 4. Trống, đang tải
Mỗi tab trống có `EmptyState` theo tone tab. Đang tải: skeleton thẻ.

## 5. Responsive
Điện thoại một cột, thanh dưới; máy tính hai cột (tổng quan trái, tab phải) theo `l-td-*` của `pages.css`.
