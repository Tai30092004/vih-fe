# Nhận diện thương hiệu VIH

> Áp dụng cho mọi màn hình của vih-fe. Giá trị màu, chữ, khoảng cách chi tiết ở `10-design-tokens.md`; bố cục ở `20-design-system.md`; component ở `30-common-components.md`. Ba tài liệu 10–30 lấy từ bộ `refactor-design/` của nhánh `feat/build-new-ui-v2` (repo `Web_Notification`), giữ nguyên nội dung; đường dẫn `web/…` trong đó là của app cũ.

## 1. Sản phẩm
Bàn làm việc điều hành của Văn phòng Chủ tịch Vietnam Innovation Hub (VIH). Người dùng: Chủ tịch, Chánh Văn phòng, Trưởng nhóm, Thư ký, Chuyên viên. Mở ra là biết việc gì cần mình quyết ngay; điện thoại ra quyết định nhanh một tay, máy tính xử lý nhiều việc liên tục.

## 2. Ý tưởng: "Bàn điều hành"
Thông tin được nhìn trước khi được đọc: mỗi khối có màu nền mang nghĩa, số liệu cỡ lớn, thẻ khác nhau theo vai trò (thẻ nổi bật, thẻ số liệu, thẻ việc, hàng danh sách).

## 3. Logo và tên
- Logo máy bay giấy đỏ – cam (`public/icons/logo-420.png`, `public/icon.svg`); không đổi màu, không kéo giãn.
- Tên hiển thị: "Lịch công tác VIH"; tên đầy đủ: "Lịch công tác và Giao việc VIH".

## 4. Màu mang nghĩa
| Nghĩa | Tone |
|---|---|
| Cần xử lý ngay, hôm nay, đang chọn | rose (`--accent` #DE0015) |
| Quá hạn, lỗi | coral |
| Sắp hạn, chờ | amber |
| Lịch, thông tin | sky |
| Xong, tốt | mint |
| Trung tính | slate |

Một màu nhấn đỏ VIH cho nút chính; chữ đỏ dùng `--link`. Trạng thái luôn kèm icon hoặc chữ, không chỉ dựa vào màu. Có Sáng, Tối, Tự động.

## 5. Chữ và icon
- Chữ IBM Plex Sans (OFL), chữ số đều cho giờ giấc và số liệu.
- Icon bộ Fluent UI System Icons (MIT), qua `<Icon name>`; không emoji trong giao diện.

## 6. Giọng văn
Tiếng Việt ngắn, rõ, nói việc cần làm ("Giao việc", "Nhận việc", "Mở việc"). Không viết hoa toàn bộ, không chuỗi "A · B · C". Thông báo lỗi lấy đúng chữ máy chủ trả về.

## 7. Dấu ấn riêng
Vạch **Bây giờ** màu đỏ có chấm nhịp đập, nhất quán ở lịch tuần, lịch hôm nay, dải giờ.
