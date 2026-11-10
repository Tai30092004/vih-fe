> Nguồn: `refactor-design/03-nen-tang-thiet-ke.md` nhánh `feat/build-new-ui-v2` repo `Web_Notification` (commit 106a476), giữ nguyên nội dung. Đường dẫn `web/…` là của app cũ; ở vih-fe tương ứng `src/styles/*` và `src/shared/ui/*`.

# Nền tảng thiết kế

Skill chủ: `frontend-design` (hướng), `icons8:design-tokens` (token), `icons8:motion` (chuyển động). Phần còn chờ chốt được đánh dấu D1, D2.

## 1. Hướng thiết kế

**Sản phẩm:** bàn làm việc điều hành của Văn phòng Chủ tịch. Người dùng: Chủ tịch, Chánh Văn phòng, trưởng nhóm, thư ký, chuyên viên.

**Việc chính của giao diện:** mở ra là biết việc gì cần mình quyết ngay. Trên điện thoại là ra quyết định nhanh một tay; trên máy tính là xử lý nhiều việc liên tục.

**Ý tưởng: "Bàn điều hành" (đổi ngày 05/11 theo yêu cầu chủ dự án, thay hướng "Sổ điều hành" phẳng).** Thông tin được nhìn trước khi được đọc: mỗi khối có màu nền gradient theo ý nghĩa, icon, số lớn, biểu đồ nhỏ; chữ chỉ giữ phần cần chữ. Chuyển động cho thấy dữ liệu đang sống. Vẫn đáng tin và gọn: màu có quy luật, không trang trí vô nghĩa.

**Màu mang nghĩa, không chọn ngẫu nhiên:** đỏ là cần xử lý ngay, san hô là quá hạn, hổ phách là sắp hạn, xanh dương là lịch và thông tin, xanh lá là xong và tốt, xám mực là trung tính và số liệu. Người dùng học một lần là đọc được cả app.

**Vạch Bây giờ vẫn là dấu ấn riêng:** đường đỏ đánh dấu thời điểm hiện tại, có chấm nhịp đập, xuất hiện nhất quán ở lịch tuần, lịch hôm nay, dải giờ.

**Soát theo `frontend-design`:** skill này coi "gradient wash" là dấu hiệu mẫu **khi là mặc định vô thức**, và ghi rõ lời của đề bài luôn thắng. Ở đây gradient là yêu cầu của chủ dự án và có nghĩa nên giữ. Các dấu hiệu còn lại vẫn loại:

| Dấu hiệu giao diện mẫu | Bản hiện tại | Hướng mới |
|---|---|---|
| Thẻ giống hệt nhau, không phân cấp | Có, ở hầu hết các màn | Thẻ khác nhau theo vai trò: thẻ nổi bật, thẻ số liệu, thẻ việc, hàng danh sách |
| Một bán kính cho mọi thứ | 16 px phổ biến, 23 giá trị | 3 bán kính, bo lồng nhau đúng phép tính |
| Nhãn in hoa giãn chữ | "TIỆN ÍCH", "CÔNG VIỆC" | Nhãn thường, phân cấp bằng cỡ và độ đậm |
| Phông mono cho nhãn nhỏ | Giờ giấc JetBrains Mono | Chữ số đều của phông chính |
| Chuỗi "A · B · C" | Khắp nơi | Nhãn nhỏ có icon, tách dòng, khoảng cách |

## 2. Màu: giữ nguyên từng mã

Không đổi giá trị nào trong khối token ở `styles.css` (dòng 23 đến 97). Chuyển nguyên vẹn sang `web/css/tokens.css`. Giữ cả ba chế độ Sáng, Tối, Tự động và cài đặt "Màu chủ đạo".

| Tên gọi | Token | Sáng | Tối | Dùng cho |
|---|---|---|---|---|
| Đỏ VIH | `--accent` | `#DE0015` | `#E5112A` | Nút chính, vạch Bây giờ, số chưa đọc |
| Đỏ đậm | `--link` | `#B5000F` | `#FF8A95` | Mọi chữ đỏ, liên kết, mục đang chọn |
| Mực | `--ink` | `#1F2937` | `#F2F3F5` | Chữ chính, ô chọn tối, vòng tiêu điểm |
| Nền | `--page` | `#F3F4F6` | `#0C0D0F` | Nền trang |
| Giấy | `--panel` | `#FFFFFF` | `#17181B` | Vùng nội dung |
| Viền | `--border` | `#E5E7EB` | `#2B2C30` | Đường kẻ |

**Quy tắc dùng (từ bảng tương phản ở `01`, mục 4):**

- Chữ đỏ luôn dùng `--link`, không dùng `--accent` (ở bản tối chỉ 3,76:1).
- Mỗi vùng màn hình tối đa một nút `--accent`.
- Ô nhập: viền `--control` kèm cạnh dưới `--faint`, để nhận biết được ô (5,78:1).
- Trạng thái luôn có thêm icon hoặc chữ, không chỉ dựa vào màu.

**Gom màu lẻ thành token, giữ nguyên giá trị:** chấm trạng thái (`#2f9e6a`, `#d4a017`, `#d9482b`, `#9aa1aa`) thành `--presence-*`; toast tối `#2a2b2f` thành `--toast`; nền bản đồ `#e8e6df` thành `--map-bg`; chấm vị trí bản đồ `#2563eb` thành `--map-me`. Logo giữ nguyên màu riêng.

**Kiểm tra giữ màu:** sau giai đoạn 1, so khối token mới với bản trên cột "Sáng", "Tối" và toàn bộ `styles.css` cũ bằng script; khác một mã là không qua cửa.

### Gradient: chỉ pha từ token sẵn có

Không thêm mã màu mới. Mọi gradient là công thức trên các token hiện tại, nên tự đổi theo Sáng, Tối, theo "Màu chủ đạo" và theo `tools/dong-goi`. Mỗi component nhận tham số `tone`; class `t-*` đặt các biến `--tone`, `--tone-soft`, `--tone-grad`, `--tone-solid`, `--tone-on`.

| Tone | Nghĩa | Nền nhạt cho card | Nền đậm cho icon, card nổi bật |
|---|---|---|---|
| `t-rose` | Cần xử lý, hôm nay, đang chọn | `--accent-soft` sang `--panel` | `--accent` sang `--link` (bản tối: sang `--accent-soft`) |
| `t-coral` | Quá hạn, lỗi | `--bad-soft` sang `--panel` | `--bad` sang `--bad-ink` |
| `t-amber` | Sắp hạn, chờ | `--warn-soft` sang `--panel` | `--warn` pha đậm dần |
| `t-sky` | Lịch, thông tin | `--info-soft` sang `--panel` | `--info` pha đậm dần |
| `t-mint` | Xong, tốt, đúng hạn | `--ok-soft` sang `--panel` | `--ok` sang `--ok-ink` |
| `t-slate` | Trung tính, số liệu | `--active` sang `--panel` | `--ink` sang `--muted` (bản tối: `--active` sang `--raised`) |

**Tương phản:** script `tools/kiem-giao-dien.js` tính cả hai đầu của mỗi gradient, lấy đầu xấu hơn. Chữ trên nền nhạt dùng `--ink`, `--muted`; chữ và icon trên nền đậm dùng `--tone-on`. Nền đậm chỉ dùng cho icon, thẻ nổi bật và nút; không đặt đoạn văn dài trên nền đậm.

### Không chỉ toàn chữ

Mỗi loại thông tin có một cách trình bày trực quan. Chi tiết ở [05, mục 3](05-common-components.md#3-hiển-thị-thông-tin-giàu-hình-ảnh).

| Thông tin | Thay vì chữ | Trình bày |
|---|---|---|
| Hạn việc | "Quá hạn 2 ngày" | Chip có icon đồng hồ, màu theo độ gấp, nền thẻ đổi theo |
| Tiến độ | "3/5" | Vòng hoặc thanh có màu, chạy khi hiện ra |
| Số liệu | Một dòng số | Thẻ số lớn, icon, xu hướng so với kỳ trước, biểu đồ nhỏ |
| Phân bố trạng thái | Danh sách đếm | Thanh nhiều đoạn màu kèm chú giải |
| Người | Tên | Ảnh đại diện có chấm trạng thái, nhóm ảnh chồng nhau |
| Thông tin chi tiết | "Nhãn: giá trị" | Lưới ô có icon, nhãn nhỏ, giá trị đậm |
| Nhật ký | Danh sách dòng | Dòng thời gian có nút icon màu |
| Quy trình | "Đã duyệt" | Thanh bước có trạng thái từng bước |

### Nội dung dài, nhiều thông tin

- **Tiêu đề:** tối đa 2 dòng rồi "…"; luôn có cách xem đủ (mở chi tiết hoặc `title`). Không cắt mất chữ ở thông tin quan trọng.
- **Đoạn dài:** thu lại 3 dòng, nút "Xem thêm" mở ra có chuyển động; chỉ hiện nút khi thật sự bị cắt.
- **Chuỗi không ngắt được (email, link, mã):** `overflow-wrap: anywhere`, nhóm thông tin xuống dòng thay vì đẩy tràn.
- **Nhiều chip:** xuống dòng, hoặc cuộn ngang có mờ mép; nhiều người thì nhóm ảnh kèm "+n".
- **Danh sách dài:** tiêu đề nhóm dính khi cuộn, hiện từng phần với "Xem thêm n mục".
- **Bảng nhiều cột:** đầu bảng dính, cột đầu dính; ô hẹp tự chuyển thành thẻ xếp dọc có nhãn.
- **Component tự thích ứng** bằng container query, nên cùng một thẻ đúng cả ở cột hẹp và rộng.

## 3. Chữ

**Đề xuất (D2): IBM Plex Sans**, một họ duy nhất, variable 400 đến 700, lưu trong `web/fonts/`, giấy phép OFL.

| Phông | Chữ số đều | Rộng câu mẫu 14 px | Latin + tiếng Việt | Nhận xét |
|---|---|---:|---:|---|
| **IBM Plex Sans** | Có | 445 px | 58 KB | Sắc thái tập đoàn rõ, chữ dễ phân biệt ở cỡ nhỏ |
| Public Sans | Có | 464 px | 34 KB | Trung tính, nhẹ nhất; ít cá tính hơn |
| Inter | Có | 476 px | 57 KB | Rất phổ biến nên không tạo nét riêng |
| Plus Jakarta Sans | Có | 461 px | 35 KB | `ui-ux-pro-max` gợi ý, thiên về thân thiện |
| Source Sans 3 | Có | 414 px | 38 KB | Hẹp nhất, nhưng trông nhỏ hơn cùng cỡ |
| Momo Trust Sans | **Không** | 475 px | 59 KB | Gắn với thương hiệu khác |
| Be Vietnam Pro (hiện tại) | **Không** | 488 px | 132 KB, cộng 22 KB mono | Phải kèm JetBrains Mono cho giờ |

Số đo do trình duyệt đo trong `preview/chon-chu-va-icon.html`; dung lượng từ Google Fonts ngày 05/11. Đổi sang Plex tiết kiệm khoảng 96 KB (62%) và bỏ được phông mono.

**Thang chữ (đơn vị rem, để "Chữ lớn" đổi cỡ gốc thay vì `zoom`):**

| Token | Cỡ | Dùng cho |
|---|---:|---|
| `--text-xs` | 12 px | Chú thích, thấp nhất được phép |
| `--text-sm` | 13 px | Bảng, thông tin phụ trên máy tính |
| `--text-md` | 14 px | Nội dung trên máy tính |
| `--text-base` | 16 px | Nội dung trên điện thoại, ô nhập cảm ứng |
| `--text-lg` | 18 px | Tiêu đề khối, tiêu đề hộp thoại |
| `--text-xl` | 22 px | Tiêu đề trang máy tính |
| `--text-2xl` | 28 px | Tiêu đề lớn trên điện thoại |

- Độ đậm: 400, 500, 600. Không in hoa nhãn.
- Khoảng dòng: nội dung 1,5; tiêu đề 1,25 đến 1,3. Không dưới 1,2 vì tiếng Việt có dấu chồng.
- Đoạn văn tối đa 72 ký tự. Giờ, điểm, tiền, mã luôn `tabular-nums`.
- **Chữ lớn thành 3 mức:** Thường, Lớn (112,5%), Rất lớn (125%), đổi `font-size` của `html`. Không còn `zoom` và các dòng bù `vh`.

## 4. Icon

**Đề xuất (D1): Fluent UI System Icons** (`@fluentui/svg-icons` 1.1.345, MIT).

| Tiêu chí | Fluent | Icons8 |
|---|---|---|
| Phủ khái niệm đang dùng | 90/90 đã kiểm từng tên ([phụ lục](phu-luc/anh-xa-icon.md)) | Chưa kiểm được, MCP chưa xác thực |
| Cặp nét và đặc cùng hình | Có | Có theo cặp bộ |
| Tô màu theo chữ và bản tối | Có, `currentColor` | Có với bản SVG |
| Lấy SVG để nhúng vào app | Miễn phí | Cần gói trả phí. PNG miễn phí nhưng không đổi màu theo giao diện, và tải từ `img.icons8.com` thì trái CSP, không chạy ngoại tuyến |
| Gắn ghi công | Không, chỉ giữ tệp giấy phép | Bản miễn phí phải có link "Icons by Icons8" hiển thị trong app |
| Dùng tiếp khi ngừng thuê bao | Luôn được | Theo giấy phép API, phần mềm phát hành **sau** khi hết hạn không còn được phép |
| Giao sản phẩm cho công ty khác (`tools/dong-goi`) | Được | Giấy phép API: "not distributed to other companies", cần giấy phép riêng cho từng đơn vị. Bản Universal: bên thứ ba phải chấp nhận điều khoản |
| Số người dùng tài khoản | Không giới hạn | Mỗi tài khoản một người; từ 2 người cần Team License |

Nguồn đối chiếu: [Universal Multimedia Licensing Agreement](https://intercom.help/icons8-7fb7577e8170/en/articles/5534926-universal-multimedia-licensing-agreement-for-icons8), [Icons8 API license](https://developers.icons8.com/license), [Fluent UI System Icons](https://github.com/microsoft/fluentui-system-icons). Đây là đọc hiểu kỹ thuật, không phải tư vấn pháp lý. Giá gói Icons8 chưa xác minh được (trang giá chặn truy cập tự động).

**Cách làm:**

- Giữ hàm `ic(tên, cỡ)` và tên hiện có; chỉ đổi nội dung bảng. `ICONS`, `ICON_TP` bỏ đi, `.ic.tp` và các token `--tp-*` bỏ theo.
- Script `tools/icons/tao-bo-icon.js` đọc danh sách, lấy SVG từ gói npm trong thư mục tạm, sinh `web/icons-fluent.js` chỉ gồm icon đang dùng. Không thêm thư viện vào lúc chạy.
- **Cỡ:** 16 cho dòng thông tin dày, 20 mặc định trên máy tính, 24 cho thanh điều hướng điện thoại. Dùng đúng bản vẽ của cỡ đó, không phóng to.
- **Quy tắc:** nét là mặc định; đặc chỉ cho mục đang chọn. Bộ này khoảng 43 KB cho toàn bộ 20 regular, cộng phần 24 và 16 cần dùng.
- Icon cạnh chữ có `aria-hidden`; nút chỉ có icon phải có `aria-label`.
- `🔒 Việc bảo mật` giữ trong dữ liệu (kiểm thử và `goc-nhin.js` dựa vào); giao diện tách chuỗi và vẽ icon khoá. Cảm xúc diễn đàn vẫn là emoji vì đó là nội dung, không phải icon giao diện.

## 5. Khoảng cách, bo góc, độ nổi

| Nhóm | Token | Giá trị |
|---|---|---|
| Khoảng cách | `--sp-1` đến `--sp-8` | 4, 8, 12, 16, 20, 24, 32, 48 px |
| Bo góc | `--r-sm`, `--r-md`, `--r-lg` | 6, 10, 16 px; thêm hình tròn và viên cho ảnh đại diện, nhãn đếm |
| Độ nổi | `--shadow-1` | Card nằm yên |
| | `--shadow-2` | Card khi rê chuột, nhấc lên |
| | `--shadow-pop` | Menu, popover, tooltip |
| | `--shadow-modal` | Hộp thoại, thông báo nổi |
| Lớp phủ | `--z-sticky`, `--z-nav`, `--z-menu`, `--z-scrim`, `--z-modal`, `--z-toast` | Không còn số thô |
| Điều khiển | `--control-h` | 36 px; `pointer: coarse` thì 44 px |

Bo góc lồng nhau tính bằng phép toán: `calc(var(--r-lg) - var(--sp-1))`, không đặt số mới. Tên cũ `--r-panel`, `--r-card`, `--r-control` giữ làm bí danh trong lúc chuyển đổi, xoá ở giai đoạn cuối.

## 6. Chuyển động

Đổi ngày 05/11: chủ dự án yêu cầu **áp dụng nhiều chuyển động vào component**, nên bảng tần suất dưới đây không còn dùng để cắt bớt, chỉ dùng để chọn độ mạnh. Thời lượng và đường cong vẫn theo `icons8:motion`. CSS cho phản hồi tức thời; GSAP (`web/ui-motion.js`) cho chuỗi vào trang, số chạy, vòng và thanh, FLIP, kéo thả.

**Ba luật không đổi:** chỉ `transform` và `opacity` (thanh, vòng dùng `scaleX`, `stroke-dashoffset`); không chạy lại khi tín hiệu SSE làm mới dữ liệu, chỉ chạy khi đổi màn hoặc khi giá trị thật sự đổi; `prefers-reduced-motion` thì chỉ còn đổi mờ và màu.

| Component | Chuyển động |
|---|---|
| Vào màn | Các khối hiện lần lượt: mờ và dịch 14 px, cách nhau 45 ms, 380 ms, tối đa 14 khối |
| Card | Rê chuột: nhấc 2 px, bóng lớn dần, gradient trôi nhẹ. Bấm: thu 1,5% |
| Nút | Rê: sáng lên, bóng đậm. Bấm: thu 3%, gợn sóng từ điểm chạm. Đang gửi: spinner |
| Số liệu | Đếm từ 0 lên giá trị khi hiện ra và khi đổi, 800 ms |
| Vòng, thanh tiến độ, biểu đồ nhỏ | Chạy từ 0 đến giá trị, 800 ms, vẽ đường khi hiện ra |
| Icon trong ô màu | Rê chuột: phóng nhẹ, nghiêng 4 độ |
| Tab, chọn đoạn | Vạch hoặc ô chọn trượt tới mục mới 240 ms |
| Công tắc, ô chọn | Nút trượt có nảy nhẹ; dấu tích tự vẽ |
| Danh sách | Thêm, xoá, đổi thứ tự: FLIP; mục mới loé nền rồi tắt |
| Nhãn đếm | Nảy khi số đổi |
| Trạng thái sống | Chấm "đang diễn ra", vạch Bây giờ, người đang hoạt động: nhịp đập |
| Đang tải | Khung xương có dải sáng chạy |
| Xem thêm, mở rộng | Chiều cao mở ra mượt |
| Hộp thoại | Trượt lên kiểu ngăn kéo, các khối bên trong hiện lần lượt, kéo theo ngón |
| Menu, popover | Mở từ phía nút, `scale(.96)` về 1 |
| Thông báo nổi | Trượt lên, có vạch đếm giờ, tạm dừng khi rê chuột |
| Lỗi ô nhập | Rung nhẹ một lần |
| Màn trống | Icon lơ lửng nhẹ |
| Hoàn thành việc lớn | Dấu tích vẽ ra, giấy màu |

Giá trị nền:

```css
--ease-out: cubic-bezier(0.23, 1, 0.32, 1);    /* vào, ra */
--ease-in-out: cubic-bezier(0.77, 0, 0.175, 1); /* di chuyển trên màn */
--ease-drawer: cubic-bezier(0.32, 0.72, 0, 1);  /* hộp thoại dưới */
--t-press: 120ms; --t-hover: 150ms; --t-menu: 180ms; --t-page: 260ms; --t-sheet: 320ms;
```

**Độ mạnh theo tần suất:** thao tác hơn 100 lần mỗi ngày (đổi tab, phím tắt) giữ dưới 240 ms; hàng chục lần mỗi ngày (rê chuột, chọn hàng) dưới 180 ms; thỉnh thoảng (hộp thoại, vào màn) đầy đủ; hiếm (hoàn thành việc lớn) được phép nổi bật.

**Không bao giờ:** `transition: all`, vào từ `scale(0)`, `ease-in` cho giao diện, hiệu ứng vào trang khi chỉ làm mới dữ liệu qua SSE. Rê chuột có chuyển động phải nằm trong `@media (hover: hover) and (pointer: fine)`.

## 7. Điểm ngắt

| Khoảng | Khung | Điều hướng |
|---|---|---|
| Dưới 600 px | Điện thoại | Thanh dưới, thanh trên kiểu native |
| 600 đến 899 px | Máy bảng | Thanh dọc hẹp 64 px |
| 900 đến 1279 px | Máy xách tay | Thanh bên 232 px, thu được |
| Từ 1280 px | Máy bàn | Thanh bên, chi tiết hai ngăn rộng hơn |

Media query chỉ dùng cho khung trang. Bên trong component dùng container query, để cùng một component tự thích ứng khi nằm ở cột hẹp hay rộng.
