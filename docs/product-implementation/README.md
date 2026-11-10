# Product implementation — quy trình dev

Từ **product usecase** (`docs/product-usecase/UC-…md`) sang **product implementation** (`frontend-implementation/product-implementation/UC-…/`). Mỗi use case đi đủ 7 bước, theo thứ tự:

**plan → test → implement → review → verify → remember → improve**

## 1. plan
- Đọc usecase (AC, EX, BR) và design system. Viết `UC-…/README.md` mục 1 (Kế hoạch) và `UC-…/DESIGN-README.md`.
- Ghi rõ: file tạo/sửa, API gọi (`rpc` tên hàm, đường dẫn), ánh xạ lỗi máy chủ → giao diện theo từng EX, khoá i18n, test sẽ viết (tên + khẳng định).
- Use case lớn: tách task nhỏ, mỗi task một vòng test → implement. Skill: `superpowers:writing-plans`.

## 2. test
- Viết test **trước**: mỗi AC và EX ít nhất một test. Chạy thấy **đỏ** đúng lý do (thiếu tính năng, không phải gõ sai).
- Vitest + Testing Library + MSW (giả máy chủ). Dữ liệu mẫu chỉ ghi vai trò.
- Skill: `superpowers:test-driven-development`, ECC `tdd-workflow`.

## 3. implement
- Viết mã tối thiểu cho test **xanh**, rồi dọn (refactor) khi vẫn xanh.
- Theo quy ước ở `AGENTS.md` mục 3. Commit nhỏ, mỗi commit một ý.

## 4. review
- Agent review độc lập đọc diff của use case: `code-reviewer` (chất lượng), `typescript-reviewer` (kiểu), `security-reviewer` khi đụng đăng nhập, quyền, dữ liệu người dùng, HTML từ ngoài; `fixing-accessibility` khi có biểu mẫu, hộp thoại.
- Lỗi CRITICAL, HIGH phải sửa (mỗi sửa có test đỏ trước). MEDIUM, LOW ghi lại ở mục 4.

## 5. verify
- Chạy và đọc kết quả: `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`.
- Chạy thật với máy chủ chạy thử (`node server/api/chay-thu-cuc-bo.js` ở `Web_Notification`) và `npm run dev`; thử bằng Chrome ở 390 px và 1440 px với đúng các vai liên quan; console không lỗi.
- Đối chiếu từng AC của usecase: đạt hay chưa. Skill: `superpowers:verification-before-completion`, ECC `verification-loop`.

## 6. remember
- Ghi vào `docs/handover.md`: đã xong gì, commit, việc còn lại, quyết định đã chọn và vì sao.
- Cập nhật trạng thái ở `docs/product-usecase/README.md`.

## 7. improve
- Rút bài học (lỗi lặp lại, chỗ quy trình chậm, quy ước thiếu) vào `docs/bai-hoc.md`.
- Sửa ngay `AGENTS.md`, design system hoặc mẫu tài liệu nếu bài học áp dụng cho các use case sau.

## Mẫu `UC-…/README.md`

```markdown
# UC-<NHÓM>-<số> — <tên> (kế hoạch kỹ thuật frontend)

> Usecase: docs/product-usecase/UC-….md · Thiết kế: DESIGN-README.md · Trạng thái: plan | test | implement | review | verify | xong

## 1. Plan        (thành phần, file, API, lỗi → giao diện, i18n)
## 2. Test        (danh sách test, kết quả lần chạy đỏ)
## 3. Implement   (commit, quyết định khác kế hoạch)
## 4. Review      (ai review, phát hiện, đã sửa / để lại)
## 5. Verify      (lệnh + kết quả, trình duyệt, đối chiếu AC)
## 6. Remember    (đã ghi gì vào handover)
## 7. Improve     (bài học)
```
