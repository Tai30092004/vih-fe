> Nguồn: `refactor-design/05-common-components.md` nhánh `feat/build-new-ui-v2` repo `Web_Notification` (commit 106a476), giữ nguyên nội dung. Đường dẫn `web/…` là của app cũ; ở vih-fe tương ứng `src/styles/*` và `src/shared/ui/*`.

# Common components

Skill chủ: `ecc:frontend-a11y` (truy cập), `icons8:ui-polish` (kiểu dáng), `icons8:motion` (thời lượng), `icons8:ux-check` (trạng thái), `design-skills:interaction-design` (tương tác phức tạp).

## 1. Cách tổ chức

```
web/ui-kit.js      hàm trả chuỗi HTML: UI.btn(), UI.field(), UI.row()…
web/ui-motion.js   chuyển động cần JS: kéo hộp thoại, FLIP (bọc GSAP)
web/css/           tokens, base, layout, components, pages
```

```js
UI.btn({ label: 'Nộp báo cáo', icon: 'send', kind: 'primary', a: 'openReport', data: { id: t.id } })
// <button type="button" class="c-btn c-btn--primary" data-a="openReport" data-id="…">…</button>
```

- **Giữ nguyên `data-a`, `data-submit`, `data-d`.** Component chỉ tạo HTML, hành vi vẫn đi qua `A`, `FORMS`, `call()`.
- Mọi chữ qua `esc()` trong component; truyền HTML có sẵn phải ghi rõ bằng tham số `html`.
- **Tiền tố class:** `c-` cho component, `l-` cho bố cục. Tránh đụng 710 class cũ (lỗi `.bd` là ví dụ thật). Trạng thái ưu tiên thuộc tính: `[aria-selected]`, `[aria-expanded]`, `[disabled]`.
- `ui-kit.js` không chạy trên máy chủ, không đặt logic nghiệp vụ vào đây.
- **Catalogue:** `refactor-design/preview/kit.html` nạp đúng CSS và JS thật, hiện mọi biến thể và trạng thái, sáng và tối, 390 px và 1440 px. Đây là chỗ duyệt trước khi lắp vào trang.

## 2. Phản hồi khi rê chuột, bấm, chạm

Đây là phần "cảm giác" của yêu cầu. Giá trị từ `icons8:motion`; rê chuột có chuyển động nằm trong `@media (hover: hover) and (pointer: fine)`.

| Component | Rê chuột | Bấm, chạm | Tiêu điểm bàn phím | Khác |
|---|---|---|---|---|
| Nút chính | Nền đậm hơn, 150 ms | Thu `scale(.97)`, 120 ms | Vòng 2 px `--ink`, cách 2 px | Đang gửi: spinner thay icon, không đổi chiều rộng |
| Nút phụ, nút icon | Nền `--hover` | Nền `--active`, thu nhẹ | Như trên | Nút icon có tooltip trên máy tính |
| Hàng danh sách | Nền `--hover`, hiện thao tác | Nền `--active` ngay lập tức | Vòng trong | Không dịch chuyển nội dung |
| Thẻ bấm được | Viền đậm hơn | Nền `--hover` | Vòng | Không nhấc lên, không tăng bóng |
| Tab | Chữ đậm hơn | Vạch chỉ trượt 180 ms | Vòng | Nhớ tab qua `aria-selected` |
| Công tắc, chọn | Viền đậm hơn | Nút trượt 150 ms; dấu tích hiện 120 ms | Vòng | Đổi được khi đang chạy dở |
| Menu, popover | | Mở từ phía nút: `scale(.96)` cùng mờ, 180 ms; đóng 120 ms | Tiêu điểm vào mục đầu | Esc đóng và trả tiêu điểm |
| Tooltip | Hiện sau 400 ms, 125 ms | | Hiện ngay khi có tiêu điểm | Esc ẩn; không chứa thao tác |
| Hộp thoại | | Trượt lên 320 ms, nền mờ; kéo theo ngón | Tiêu điểm vào hộp, không viền | Thả có quán tính |
| Thông báo nổi | Tạm dừng đếm giờ | Vuốt để bỏ | | Dùng transition để đổi được giữa chừng |

Giảm chuyển động: bỏ thu nhỏ, trượt và kéo có quán tính; giữ đổi màu và mờ.

## 3. Danh mục

### Hành động

| Component | Thay cho | Biến thể, tính năng mới | Truy cập |
|---|---|---|---|
| `c-btn` | `.btn` (262 chỗ), `.primary`, `.ghost`, `.danger`, `.linkish` | Chính, phụ, nhẹ, nguy hiểm, liên kết; cỡ sm, md, lg; có đang tải; có icon | `button` hoặc `a`; đang tải: `aria-busy`, không bấm trùng; lý do vô hiệu hiện cạnh nút |
| `c-iconbtn` | `.icon-btn` (26) | Cỡ theo `--control-h`; vùng chạm 44 px dù icon nhỏ | Bắt buộc `aria-label`; tooltip |
| `c-fab` | `.tab-fab`, `.side-add` | Theo ngữ cảnh màn | `aria-label`; né vùng an toàn, không che ô nhập |
| `c-actionbar` | `.sheet-f` (34), hàng nút rải rác | Dính đáy trên điện thoại; tối đa một nút chính | Không che tiêu điểm (WCAG 2.4.11) |
| `c-menu` | `details.ev-more`, hộp chọn thao tác | Menu thả, menu ngữ cảnh, mục nguy hiểm | `role=menu`, mũi tên, Esc, chữ đầu để nhảy; hoặc sheet trên điện thoại |

### Nhập liệu

| Component | Thay cho | Tính năng mới | Truy cập |
|---|---|---|---|
| `c-field` | `.f`, `.field-row` (32) | Nhãn, gợi ý, lỗi ngay dưới ô, đếm ký tự, tuỳ chọn ghi "(không bắt buộc)" | `label for`; lỗi `aria-describedby` + `aria-invalid` + `role=alert`; kiểm tra khi rời ô hoặc khi gửi |
| `c-input`, `c-textarea` | `input`, `textarea` | Tự giãn; xoá nhanh; viền theo `01` mục 4; 16 px trên cảm ứng | `inputmode`, `enterkeyhint`, `autocomplete` |
| `c-select` | `select` | Trên điện thoại dùng bộ chọn của máy; máy tính kiểu đồng bộ | Giữ thẻ `select` thật |
| `c-combobox` | Chọn người dạng thẻ, lọc tự viết | Chọn một hoặc nhiều, tìm có dấu và không dấu, ảnh đại diện, chọn gần đây | `role=combobox` + `listbox`, `aria-activedescendant`, thông báo số kết quả |
| `c-check`, `c-radio`, `c-switch` | `.check`, `.switch` | Vùng chạm cả dòng, nhóm có tiêu đề | `input` thật; `fieldset` + `legend` |
| `c-seg` | `.seg` (20), `.pills` (19) | Nhóm chọn một, vạch trượt | Nhóm radio; mũi tên để đổi |
| `c-datetime` | `input` ngày giờ, nút hạn nhanh | Giữ bộ chọn của máy, kèm chip Hôm nay 17:00, Mai, Thứ Sáu | Chip là nút có tên đầy đủ |
| `c-file` | `.tep-nut`, ô chọn tệp | Kéo thả trên máy tính, tiến trình, tên và cỡ | Ô tệp thật có nhãn; tiến trình `role=progressbar` |
| `c-rating` | Sao chấm điểm | Bàn phím, nhãn Xuất sắc, Tốt… | Nhóm radio |

### Hiển thị

| Component | Thay cho | Tính năng mới | Truy cập |
|---|---|---|---|
| `c-list`, `c-row` | `.list`, `.item`, `.item-t`, `.item-s` | Một mặt phẳng; khe trái, chính, phải; thao tác khi rê; vuốt trên cảm ứng | `ul`, `li`; vuốt luôn có cách thay thế bằng nút |
| `c-panel` | `.panel`, `.card` (70) | Mặc định không bóng; chỉ dùng khi thực sự cần nhóm | `section` + `aria-labelledby` |
| `c-table` | `.tbl-wrap` (12) | Đầu dính, sắp xếp, chọn mật độ; điện thoại thành danh sách | `th scope`, `aria-sort`, `caption` |
| `c-badge`, `c-count` | `.chip`, `.dot-badge`, `.badge` | Trạng thái kèm icon; "99+" | Số có `aria-label`; không chỉ dựa vào màu |
| `c-avatar` | `.av`, `.avt`, `.av-wrap` | Chữ cái, ảnh, chấm trạng thái, nhóm chồng | `alt` hoặc ẩn khi có tên cạnh bên; trạng thái có chữ |
| `c-stat` | `.tile`, `.bigscore`, `.tile-v` | Số, xu hướng so với kỳ trước | Mô tả xu hướng bằng chữ |
| `c-progress` | `.progress`, vòng tiến độ | Thanh và vòng | `role=progressbar`, `aria-valuenow` |
| `c-empty` | `.empty` (44), `.empty-line` | Icon, câu nói màn này để làm gì, nút hành động đầu tiên | Không chỉ "Không có dữ liệu" |
| `c-skeleton` | Màn chờ tĩnh | Khung đúng hình nội dung, không nhảy bố cục | `aria-busy` trên vùng |
| `c-banner` | `.strip-banner`, `.vis-note` | Thông tin, cảnh báo, lỗi, thành công; có nút | `role=status` hoặc `alert` |
| `c-kv` | `.tr-l`, `.meta-r` | Cặp nhãn và giá trị cho chi tiết | `dl`, `dt`, `dd` |
| `c-timeline` | `#tl`, nhật ký việc | Nhật ký, trao đổi, mốc trạng thái | `ol`, thời gian trong `time` |
| `c-steps` | Các bước Tờ trình, Chuyến đi | Bước đang ở, đã qua, lỗi | `aria-current="step"` |
| `c-tooltip` | `title` | Hiện khi rê và khi có tiêu điểm | `aria-describedby`; không dùng cho thông tin bắt buộc trên cảm ứng |
| `c-attach` | Dòng tệp, ô link | Icon theo loại, tải, xoá, xem trước | Tên tệp là liên kết |

### Điều hướng và khung

| Component | Thay cho | Tính năng mới | Truy cập |
|---|---|---|---|
| `l-appbar` | `.top`, `.top-me` | Tiêu đề lớn thu lại khi cuộn; nút lùi; thao tác | `header`; `h1` luôn có, kể cả ở Hôm nay |
| `l-tabbar` | `.tabbar`, `.tab` | Icon đặc khi chọn, số chưa đọc, giữ tay để đổi | `nav`, `aria-current="page"` |
| `l-sidebar`, `l-rail` | `.side`, `.side-nav` | Nhóm, thu gọn, thanh hẹp | `nav` có tên; nhóm dùng `button` + `aria-expanded` |
| `l-topbar` | `.top-r`, `.top-search` | Ô tìm mở bảng lệnh, Tạo mới, chuông | Liên kết "Bỏ qua tới nội dung" đầu trang |
| `c-tabs` | `.seg`, dải tab Quản trị | Cuộn ngang có mờ mép, vạch chỉ, nhớ qua route | `tablist`, mũi tên; hoặc `nav` khi đổi route |
| `c-breadcrumb` | Mới | Máy tính; điện thoại thay bằng nút lùi | `nav` + `aria-current` |

### Lớp phủ

| Component | Thay cho | Tính năng mới | Truy cập |
|---|---|---|---|
| `c-sheet` | `openSheet()`, `askSheet()` (92 hộp thoại) | Nấc cao, kéo thả, chân dính; giữ nguyên chữ ký hàm nên cả 92 hộp thoại được nâng cấp cùng lúc; **sửa viền đỏ** | `role=dialog`, `aria-modal`, tên từ tiêu đề; Tab quay vòng; Esc; trả tiêu điểm; Back đóng |
| `c-popover` | `pop` của `openSheet` | Neo theo nút, tự đổi hướng | Esc, bấm ngoài để đóng |
| `c-toast` | `toast()`, `toastUndo()` | Hàng đợi, thành công, lỗi, hoàn tác, tạm dừng khi rê | `role=status`; lỗi `role=alert` |
| `c-command` | `openSearch()` | Ctrl K, lệnh, gần đây | `combobox` + `listbox` |
| Trình xem ảnh | `vwMo()` | Giữ mã hiện có, chỉ đổi kiểu dáng | Giữ phím mũi tên, Esc |

### Thành phần nghiệp vụ

Lắp từ các phần trên, nằm trong `ui-kit.js`: `TaskRow`, `EventRow`, `PersonRow`, `MessageBubble`, `Composer`, `PostCard`, `ReactionBar`, `NowLine` (vạch Bây giờ), `CalendarGrid`.

## 3. Hiển thị thông tin giàu hình ảnh

Thêm ngày 05/11 theo yêu cầu "đừng chỉ mỗi text". Mọi component dưới đây nhận `tone` (xem [03, Gradient](03-nen-tang-thiet-ke.md#gradient-chỉ-pha-từ-token-sẵn-có)).

| Component | Hàm | Trình bày | Khi nội dung dài |
|---|---|---|---|
| Thẻ nổi bật | `UI.hero()` | Nền gradient đậm, số lớn, vòng tiến độ, hành động nhanh, họa tiết tròn mờ | Tiêu đề 2 dòng; nút xuống dòng |
| Thẻ | `UI.card()` | Nền gradient nhạt theo tone; đầu thẻ có ô icon, tiêu đề, hành động | Thân thẻ tự co, tiêu đề 2 dòng |
| Thẻ số liệu | `UI.stat()` | Ô icon, số lớn đếm chạy, xu hướng lên xuống, biểu đồ nhỏ, icon mờ góc | Nhãn 2 dòng; hàng thẻ cuộn ngang trên điện thoại |
| Ô icon | `UI.tile()` | Icon trắng trên ô gradient đậm | |
| Vòng tiến độ | `UI.ring()` | `conic-gradient` theo tone, đầu bo tròn, có số ở giữa, chạy khi hiện ra | |
| Thanh tiến độ | `UI.bar()` | Fill gradient, nhãn và phần trăm | Nhãn cắt 1 dòng |
| Thanh nhiều đoạn | `UI.segbar()` | Phân bố trạng thái kèm chú giải có số | Chú giải xuống dòng |
| Biểu đồ nhỏ | `UI.spark()` | Đường và vùng màu, tự vẽ | |
| Thẻ việc | `UI.taskCard()` | Viên hạn gradient, mức độ, vòng tiến độ cạnh tiêu đề, chân thẻ có tên người làm. **Không có vạch màu bên trái** | Tiêu đề 2 dòng, chip xuống dòng, tên cắt 1 dòng |
| Thẻ lịch | `UI.eventCard()` | Giờ cỡ lớn là điểm nhìn, đang diễn ra thì nền gradient đậm và chấm nhịp đập, địa điểm có icon, nhóm ảnh, nút Vào họp | Địa điểm cắt 1 dòng kèm `title` |
| Lưới thông tin | `UI.info()` | Thay "nhãn: giá trị": ô icon, nhãn nhỏ, giá trị đậm | Giá trị xuống dòng, `overflow-wrap: anywhere`; mục rộng chiếm cả hàng |
| Chip | `UI.chip()` | Mặt thẻ nổi nhẹ, ô icon bo góc có nền màu theo tone (không tone thì xám), rồi tới chữ; `size: 'lg'`; không icon thì là nhãn phẳng | Không cắt, xuống dòng |
| Nhóm ảnh | `UI.avatars()` | Ảnh chồng nhau, rê chuột giãn ra, "+n" | Giới hạn số ảnh, phần còn lại trong "+n" |
| Thu gọn | `UI.more()` | Thu 3 dòng, "Xem thêm" mở ra mượt, chỉ hiện khi bị cắt | Đây là chính giải pháp |
| Dòng thời gian | `UI.timeline()` | Nút icon màu theo loại sự kiện, nối bằng đường | Nội dung dài dùng `UI.more()` |
| Thanh bước | `UI.steps()` | Bước đã qua, đang ở, lỗi; đường nối chạy theo | Điện thoại: dọc hoặc cuộn ngang |
| Bảng | `UI.table()`, `UI.cell()` | Phẳng, hàng thoáng, tiêu đề cột viết hoa nhỏ, ô đầu có tiêu đề đậm, tag, phụ đề; cột thao tác; ô hẹp chuyển thành thẻ có nhãn | Container query |
| Tag trạng thái | `UI.status()` | Viên tròn nền nhạt, chấm đậm bên trái | Xuống dòng |
| Dropdown | `UI.dropdown()` | Một lựa chọn có nhóm, dấu tích, mô tả; lọc nhiều lựa chọn có ô tích, số đã chọn, Xóa | Chữ xuống dòng, bảng cuộn |
| Chọn ngày, giờ | Tự động cho `input` date, time, datetime-local (`ui-picker.js`) | Lịch, chọn tháng, cột giờ phút; điện thoại dùng bộ chọn của máy | |
| Danh sách nhóm | `UI.group()` | Tiêu đề nhóm dính, "Xem thêm n mục" | Hiện từng phần |
| Màn trống | `UI.empty()` | Icon lớn trong ô gradient lơ lửng, câu mô tả, nút hành động | |
| Dải báo | `UI.banner()` | Nền gradient theo tone, icon, nút | Chữ xuống dòng |

## 4. Điều kiện xong của một component

- [ ] Đủ trạng thái: mặc định, rê chuột, bấm, tiêu điểm, chọn, vô hiệu, đang tải, lỗi (phần áp dụng được).
- [ ] Sáng và tối; đo tương phản thật.
- [ ] Chạy được chỉ bằng bàn phím, đúng mẫu ARIA ở bảng trên.
- [ ] Vùng chạm từ 44 px trên cảm ứng; không dưới 24 px trên máy tính.
- [ ] Giảm chuyển động hoạt động; bấm liên tục hai lần không giật về đầu.
- [ ] Chịu được dữ liệu xấu: tên 60 ký tự, tiêu đề 150 ký tự, email không ngắt được, số lớn, danh sách trống, tiếng Việt dấu chồng.
- [ ] Chữ người dùng nhập đã qua `esc()`.
- [ ] Không có số màu, cỡ, bo góc, z-index viết thẳng; chỉ dùng token.
- [ ] Có mặt trong catalogue.
