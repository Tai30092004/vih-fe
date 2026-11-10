# UC-AI-01 — Hỏi trợ lý AI, xem HTML artifact (kế hoạch kỹ thuật frontend)

> Usecase: `docs/product-usecase/UC-AI-01.md` · Thiết kế: `DESIGN-README.md` · Trạng thái: **plan**. Phụ thuộc UC-NEN-01.

## 1. Plan
- `src/features/assistant/sse.ts`: `parseSse(chunk, buf)` ghép khối bị cắt.
- `src/data/assistantRepo.ts`: `ask(question, conversationId, onEvent, signal)` → `POST /api/assistant`, đọc `ReadableStream`; header `X-VIH: 1`; lỗi HTTP → `ApiException`.
- `toAgentEvent({event, data})` → `delta | artifact | done | error` (một chỗ duy nhất để chỉnh khi chốt định dạng sự kiện của `vih-ai-agent`).
- `src/features/assistant/artifacts.ts`: `splitArtifacts(text)` tách khối ```` ```html ````.
- `ArtifactFrame.tsx`: `<iframe sandbox="allow-scripts" srcdoc>` (không `allow-same-origin`), chèn CSP `default-src 'none'; img-src data: https:; style-src 'unsafe-inline'; script-src 'unsafe-inline'`; nút mở toàn màn hình.
- `useAssistant()`: `messages`, `send`, `stop`, `retry`; `conversationId` trong `sessionStorage`.
- `ChatPanel.tsx`, `MessageList.tsx`, `Composer.tsx` (đếm ký tự, tối đa 2000).
- i18n `chat.*`.

## 2. Test
- `sse.test.ts`: ghép đúng khi khối cắt giữa `data:`.
- `artifacts.test.ts`: tách văn bản và hai khối html theo thứ tự.
- `chat.test.tsx`: AC.1 tin nhắn dài dần; AC.2 artifact hiện iframe; AC.3 iframe có `sandbox="allow-scripts"`, không có `allow-same-origin`, `srcdoc` có CSP `default-src 'none'`; AC.4 / EX.3 sự kiện error → trạng thái lỗi + Gửi lại; EX.1 trống / quá 2000 ký tự không gửi; EX.4 Dừng giữ phần đã nhận.

## 3. Implement
## 4. Review
Bắt buộc `security-reviewer` (HTML từ ngoài).
## 5. Verify
## 6. Remember
## 7. Improve
