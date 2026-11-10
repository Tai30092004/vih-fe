# UC-HOME-01 — Trang Hôm nay

> Nguồn: `viewToday()` ở nhánh giao diện mới (`feat/build-new-ui-v2`), số liệu theo `web/core.js` nhánh đang chạy thật. Kế hoạch: 1.

## 1. Mục tiêu
Mở app là biết ngay hôm nay mình cần quyết gì, việc nào quá hạn hoặc tới hạn, lịch của Chủ tịch, tình hình đội và tin mới.

## 2. Tác nhân và quyền
Mọi người đã đăng nhập. Nội dung theo cấp:
- Cấp 1–2 (Chủ tịch, Chánh Văn phòng, Trưởng nhóm có quyền) thấy việc mình được xem.
- Cấp 3 thấy việc của mình.
- Người giao được việc thấy nút **Giao việc**; người không giao được thấy **Đề xuất việc**.
- Người sửa được lịch thấy **Thêm lịch**.

## 3. Tiền điều kiện
Đã đăng nhập (UC-AUTH-01).

## 4. Luồng chính
1. Đầu trang: lời chào, thứ ngày (ghi "ngày nghỉ" nếu là ngày nghỉ), nút Giao việc / Đề xuất việc, Thêm lịch; chip "Vị trí của tôi".
2. Khối **Tiến độ tuần**: số việc xong trên số việc đến hạn trong tuần, vòng phần trăm, một câu "điều cần biết nhất" (việc chờ quyết, quá hạn, hay số lịch hôm nay).
3. Bốn ô số bấm được: **Chờ tôi quyết**, **Quá hạn**, **Hạn hôm nay**, **Lịch hôm nay**.
4. Bốn tab:
   - **Cần làm**: dải "Cần làm ngay" khi có việc quá hạn của mình; danh sách "Chờ tôi quyết" có nút quyết ngay (Nhận việc, Từ chối, Nghiệm thu, Duyệt…); việc hạn hôm nay, việc ngày mai.
   - **Lịch**: lịch hôm nay; lịch riêng tư của người khác chỉ hiện "Bận".
   - **Đội**: vị trí hôm nay của Chủ tịch (ai được xem), số người chưa báo vị trí, cấp dưới quá hạn.
   - **Bảng tin**: tin mới, sáng kiến, bản tin, khung **trợ lý AI** (UC-AI-01).

## 5. Luồng phụ và ngoại lệ
- EX.1 Không có gì ở một tab: hiện ô trống có hướng dẫn (vd "Giao việc đầu tiên cho đồng nghiệp").
- EX.2 Thao tác nhanh thất bại (mất mạng, xung đột phiên bản): báo lỗi, dữ liệu tải lại, nút không bị kẹt.

## 6. Quy tắc nghiệp vụ
- BR-HOME-01: ô **Quá hạn** và dải "Cần làm ngay" chỉ đếm việc của **chính mình**; việc cấp dưới quá hạn ở tab Đội.
- BR-HOME-02: việc Bảo mật chỉ hiện tiêu đề nếu máy chủ đã cho xem; không bao giờ tự đoán.
- BR-HOME-03: màu mang nghĩa: đỏ cần xử lý, san hô quá hạn, hổ phách hôm nay, xanh lá sau hôm nay.

## 7. Tiêu chí chấp nhận
- AC.1 Chuyên viên thấy "Đề xuất việc", Chủ tịch thấy "Giao việc".
- AC.2 Đếm Quá hạn không tính việc của người khác.
- AC.3 Bấm "Nhận việc" trên thẻ → việc chuyển sang đang làm, có thông báo.
- AC.4 Đổi tab bằng phím mũi tên được.

## 8. Ngoài phạm vi
Mở chi tiết việc / lịch (UC-VIEC, UC-LICH); thông báo vị trí (UC-DOI-01).
