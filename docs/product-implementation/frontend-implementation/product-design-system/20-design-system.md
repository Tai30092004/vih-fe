> Nguồn: `refactor-design/04-bo-cuc.md` nhánh `feat/build-new-ui-v2` repo `Web_Notification` (commit 106a476), giữ nguyên nội dung. Đường dẫn `web/…` là của app cũ; ở vih-fe tương ứng `src/styles/*` và `src/shared/ui/*`.

# Bố cục

Skill chủ: `ui-ux-pro-max` (`pro-rules.md`, mục 2, 5, 9) cho điện thoại; `frontend-design` cho máy tính. Wireframe chỉ thể hiện cấu trúc; icon vẽ tạm bằng ký tự.

## 1. Điện thoại: gần native

### Những thay đổi tạo ra cảm giác native

| Mẫu native | Hiện tại | Sẽ làm | Cách làm |
|---|---|---|---|
| Thanh trên đổi theo màn | Lời chào cố định ở mọi màn | Màn gốc có tiêu đề lớn; màn sâu có nút lùi, tiêu đề ngắn, thao tác | `page()` nhận thêm `back`; `shell()` chọn kiểu thanh |
| Vào sâu trượt từ phải | Mờ lên 6 px | Vào trượt sang, lùi trượt ngược, đổi tab không trượt | View Transitions API, không có thì chuyển ngay |
| Thanh dưới chỉ ở màn gốc | Luôn hiện | Màn sâu ẩn thanh dưới, thay bằng thanh hành động cố định | Theo độ sâu route |
| Mỗi tab nhớ vị trí cuộn | Về đầu | Quay lại đúng chỗ đang đọc | Lưu `scrollY` theo hash |
| Danh sách gom nhóm | Nhiều thẻ rời | Một mặt phẳng, hàng ngăn bằng đường kẻ | `c-list` |
| Hộp thoại kéo được | Có tay nắm nhưng chưa kéo | Kéo theo ngón, có nấc, thả để đóng; vẫn có nút đóng cho người không vuốt được | GSAP Draggable, Inertia |
| Phản hồi khi chạm | Một số chỗ có | Nền đổi ngay khi chạm, nút thu nhẹ; không dính trạng thái rê chuột | `:active`, gating `hover` |
| Vùng chạm đủ lớn | 20/41 mục dưới 44 px ở Hôm nay | Từ 44 px, mở rộng vùng chạm khi icon nhỏ | `--control-h`, `::after` |
| Bàn phím không che ô nhập | Xử lý riêng lẻ | Ô soạn dính trên bàn phím | `interactive-widget=resizes-content`, `visualViewport` |
| Nhập liệu đúng loại | Phần lớn đã có | `inputmode`, `enterkeyhint`, `autocomplete` đầy đủ; bộ chọn ngày giờ của máy | `c-field` |
| Không chọn nhầm chữ, không chớp xanh | Một phần | `-webkit-tap-highlight-color`, `user-select` ở thanh điều hướng, `touch-action: manipulation` | `base.css` |
| Cuộn không kéo cả trang | Một phần | `overscroll-behavior: contain` ở hộp thoại, khung chat | `base.css` |

### Thanh dưới (chờ D4)

Đề xuất: **Hôm nay · Lịch · Việc · Tin nhắn · Thêm**, mục đang chọn dùng icon đặc. Nút tạo nổi ở góc phải, theo ngữ cảnh: Việc thì "Giao việc", Lịch thì "Thêm lịch", Tin nhắn thì "Soạn", Hôm nay thì mở menu tạo nhanh. "Thêm" là một màn đầy đủ (không phải hộp thoại) liệt kê mọi mục còn lại. Giữ tính năng giữ tay để đổi 4 vị trí đầu.

### Màn gốc: Hôm nay

```
┌────────────────────────────────┐
│ Thứ năm, 05/11           (o) ◉ │  ngày, chuông, ảnh đại diện
│ Chào Chủ tịch                  │  tiêu đề lớn, cuộn lên thì thu vào thanh trên
│ ● Văn phòng VIH            Đổi │  một dòng vị trí, chạm là đổi
├────────────────────────────────┤
│ Cần bạn quyết               2  │
│ ┌────────────────────────────┐ │
│ │ Soạn công văn gửi Sở…      │ │  gom vào một mặt phẳng
│ │ Chuyên viên 3 đã gửi kết quả │
│ │               [ Nghiệm thu ] │
│ ├────────────────────────────┤ │
│ │ Xin gia hạn: Soạn thư mời…  ›│
│ └────────────────────────────┘ │
│ Lịch hôm nay           Cả tuần │
│ 09:00  Làm việc với đối tác X  │
│ ━━━━━━━ 10:24 ━━━━━━━━━━━━━━━  │  vạch Bây giờ: điểm nhấn duy nhất
│ 14:00  Họp Ban điều hành       │
│ Sắp đến hạn            Tất cả  │
│ ▌Tổng hợp danh sách…  Mai 17:00│
│                           (＋) │  nút tạo nổi
├────────────────────────────────┤
│ Hôm nay  Lịch  Việc  Tin  Thêm │  56 px + vùng an toàn
└────────────────────────────────┘
```

### Màn sâu: chi tiết việc

```
┌────────────────────────────────┐
│ ‹ Việc       CV-2026-0142    ⋯ │  nút lùi về đúng danh sách trước đó
├────────────────────────────────┤
│ Tổng hợp danh sách khách mời   │
│ [Đang thực hiện]  Hạn 17:00 6/11│
│ Người giao    Chủ tịch         │
│ Người làm     Thư ký 1         │
│ Yêu cầu  …                     │
│ Đầu việc 1/3                   │
│ Trao đổi 2                     │
├────────────────────────────────┤
│ [ Xin gia hạn ] [ Nộp báo cáo ]│  thanh hành động thay cho thanh dưới
└────────────────────────────────┘
```

### Hộp thoại

- **Ngắn** (xác nhận, chọn nhanh): cao theo nội dung, kéo xuống để đóng.
- **Dài** (giao việc, tờ trình): mở gần toàn màn, nút lưu dính ở đáy, hỏi lại trước khi bỏ nếu đã nhập.
- Luôn có nút đóng, Esc, trả tiêu điểm về nút đã mở. Bấm Back của máy là đóng hộp thoại, không rời trang.

## 2. Máy tính: sạch và trực quan

### Khung chung

```
┌──────────┬──────────────────────────────────────────────────────┐
│ ◣ Lịch   │ Tìm việc, người, dự án…   Ctrl K     [＋ Tạo mới] (o) ◉│ 52 px
│ công tác ├──────────────────────────────────────────────────────┤
│          │ Việc › CV-2026-0142                                  │ đường dẫn
│ Công việc│                                                      │
│  Hôm nay │                                                      │
│  Việc   3│              nội dung theo kiểu trang                │
│  Lịch    │                                                      │
│  Dự án   │                                                      │
│  Tin nhắn│                                                      │
│ Phê duyệt│                                                      │
│  Tờ trình│                                                      │
│  Chuyến đi                                                      │
│  Quy trình                                                      │
│ Đội ngũ ▸│                                                      │
│ Cộng đồng▸                                                      │
│ Quản trị │                                                      │
│ ◉ Chủ tịch ‹                                                    │ thu thanh bên
└──────────┴──────────────────────────────────────────────────────┘
```

- **Thanh bên 232 px, chia nhóm theo nghiệp vụ**, thu được còn 64 px, nhớ trên máy:
  - Công việc: Hôm nay, Việc, Lịch, Dự án, Tin nhắn
  - Phê duyệt: Tờ trình, Chuyến đi, Quy trình
  - Đội ngũ: Đội, Tổ chức, Bản đồ, Báo cáo, Bảng đánh giá
  - Cộng đồng: Bảng tin, Sáng kiến, Điểm & Ví
  - Quản trị
- Mục cao 36 px thay vì 44 px, 17 mục vừa màn 900 px mà không cuộn; nhóm thu gọn được. Nút đỏ to ở thanh bên chuyển thành "Tạo mới" trên thanh trên.
- **Bảng lệnh Ctrl K:** tìm việc, người, dự án (dùng lại `ketQuaTim()`), thêm các lệnh: giao việc, thêm lịch, đi tới màn.
- **Rê chuột hiện thao tác của hàng**; nút chỉ có icon luôn có tooltip.

### Sáu kiểu trang

Mọi màn thuộc một trong sáu kiểu, để người dùng học một lần.

```
A. Tổng quan                 B. Danh sách + chi tiết        C. Lưới + bảng bên
┌───────────────┬────────┐   ┌────────┬───────────────┐     ┌───────────────┬──────┐
│ việc cần quyết│ tiến độ│   │ hàng 1 │ tiêu đề       │     │ T2 T3 T4 T5 T6│ chi  │
│───────────────│ tuần   │   │ hàng 2 │ thông tin     │     │ ═══ bây giờ ══│ tiết │
│ lịch hôm nay  │────────│   │ hàng 3 │ trao đổi      │     │               │      │
│               │ đồng   │   │        │               │     │               │      │
│               │ nghiệp │   │        │ [thao tác]    │     │               │      │
└───────────────┴────────┘   └────────┴───────────────┘     └───────────────┴──────┘

D. Bảng dữ liệu              E. Cài đặt                     F. Dòng bài
┌───────────────────────┐    ┌──────┬────────────────┐      ┌──────────────┬───────┐
│ lọc   tìm     [xuất]  │    │ mục 1│ tiêu đề        │      │ bài          │ phụ   │
│═══════════════════════│    │ mục 2│ ô nhập         │      │──────────────│       │
│ đầu bảng dính         │    │ mục 3│ tối đa 720 px  │      │ bài          │       │
│ hàng, hàng, hàng      │    │      │                │      │ 640–720 px   │       │
└───────────────────────┘    └──────┴────────────────┘      └──────────────┴───────┘
```

Trên điện thoại: A thành một cột theo thứ tự ưu tiên; B thành danh sách rồi đẩy sang chi tiết; C thành dải ngày cùng danh sách; D thành danh sách hàng hai dòng; E thành danh sách mục rồi đẩy sang form; F một cột.

## 3. Từng màn

Khối lượng dựa trên cỡ hàm view đo được (S dưới 3 KB, M từ 3 đến 8 KB, L từ 8 KB), chưa tính hàm con.

| Màn | Route | Kiểu | Điện thoại | Máy tính | Cỡ | Nhóm |
|---|---|---|---|---|---|---:|
| Đăng nhập, kích hoạt | (chưa đăng nhập), `kich-hoat`, `dat-lai` | Riêng | Một cột | Khối giữa, logo | S | A |
| Hôm nay | `today` | A | Như wireframe | 2 cột cân: việc cần quyết, lịch; cột phụ tiến độ, đồng nghiệp | L | A |
| Việc | `tasks` | B | Danh sách có nhóm hạn, lọc dạng thanh | Hai ngăn, chi tiết mở tại chỗ | M | A |
| Chi tiết việc | `tasks/:id` | B | Đẩy sang, thanh hành động | Ngăn phải | L | A |
| Lịch | `calendar` | C | Dải ngày, danh sách theo giờ, vạch Bây giờ | Lưới tuần, sửa lịch trùng giờ, bảng chi tiết | M | A |
| Tin nhắn | `chat`, `chat/:id` | B | Danh sách, đẩy sang khung chat | Hai ngăn | M | A |
| Dự án | `du-an`, `du-an/:id` | B | Danh sách, đẩy sang, tab cuộn ngang | Danh sách, trang có tab | M | B |
| Tờ trình | `trinh`, `trinh/:id` | B | Danh sách, đẩy sang, thanh quyết định | Hai ngăn | L | B |
| Chuyến đi | `chuyen`, `chuyen/:id` | B | Danh sách, các bước | Hai ngăn, bước tiến trình | L | B |
| Bảng tin | `fun`, `fun/*` | F | Một cột, ảnh tràn lề | Dòng bài, cột phụ | S | C |
| Sáng kiến | `sang-kien` | F | Một cột | Dòng bài, cột phụ | S | C |
| Điểm & Ví | `vi`, `vi/so-diem`, `me` | A, D | Số dư trên, lịch sử dưới | Hai cột, bảng sổ điểm | M | C |
| Tổ chức | `so-do` | C | Danh sách theo cấp | Cây, hồ sơ bên phải | S | C |
| Đội | `team` | D | Danh sách người | Bảng | S | C |
| Bản đồ | `ban-do` | C | Toàn màn, danh sách kéo lên | Bản đồ, danh sách bên phải | M | C |
| Báo cáo | `bao-cao` | A | Một cột, biểu đồ gọn | Lưới, **sửa đụng tên `.bd`** | M | D |
| Bảng đánh giá | `eval` | D | Danh sách người, đẩy sang chi tiết | Bảng, đầu bảng dính | S | D |
| Quy trình | `quy-trinh` | D, E | Danh sách, đẩy sang | Bảng, trình sửa | M | D |
| Quản trị (10 tab) | `admin/*` | E, D | Danh sách mục, đẩy sang | Cột mục bên trái thay dải tab | L | D |
| Tôi, Hồ sơ | `toi`, `ho-so` | E | Danh sách cài đặt | Cột mục, form | M | D |
| Cài ứng dụng | `cai-dat` | Riêng | Hướng dẫn theo máy | Hướng dẫn, ảnh | S | D |

Danh sách đầy đủ tab con và 92 hộp thoại: [phụ lục](phu-luc/kiem-ke-man-hinh.md). Quyền xem từng màn không đổi; `navItems()` chỉ đổi cách nhóm.

## 4. Giữ DOM khi dựng lại

Đây là điều kiện để chuyển động và trạng thái hoạt động, nên làm ở giai đoạn 1.

- **Đổi route:** thay nội dung, chạy chuyển trang.
- **Cùng route (`commit()`, SSE):** so sánh và chỉ sửa phần khác bằng morphdom (D3). Giữ nguyên nút, tiêu điểm, vị trí cuộn, chữ đang gõ. Hàng trong danh sách có `id` hoặc `data-k` để nhận diện.
- Sau đó các đoạn vá riêng (`capNhatTaiCho`, `giuMsg`, `dangSoanTin`) gỡ dần, và viết lại bài kiểm thử đang ghim chuỗi của chúng.
