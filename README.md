# Học Mỗi Ngày — hệ thống học trực tuyến

Ứng dụng web tiếng Việt cho phép học viên tạo tài khoản, đăng nhập, khám phá khóa học, đăng ký, xem bài học và lưu tiến độ riêng trên MySQL. Bộ triển khai Docker Compose đi kèm Nginx reverse proxy, phpMyAdmin, Prometheus/Grafana và Loki/Promtail.

## Yêu cầu

- Docker Desktop có Docker Compose v2, đã khởi động.
- Windows PowerShell hoặc một shell tương thích.
- Cổng `8088`, `8082`, `3000`, `9090` còn trống.

## Chạy trên Windows

Mở PowerShell tại thư mục dự án:

```powershell
Copy-Item .env.example .env
notepad .env
```

Trong `.env`, thay các giá trị `CHANGE_ME_...` bằng mật khẩu ngẫu nhiên mạnh, riêng biệt; nên dùng chuỗi chữ và số dài để tương thích với MySQL exporter. Không đưa `.env` lên Git.

Khởi động và kiểm tra:

```powershell
docker compose config
docker compose up --build -d
docker compose ps
```

Lần đầu Docker cần tải các image. Đợi `app`, `db` và `proxy` chuyển sang trạng thái healthy; các dịch vụ monitoring có thể mất thêm một phút để thu thập dữ liệu đầu tiên.

| Thành phần | Địa chỉ | Đăng nhập |
| --- | --- | --- |
| Website học trực tuyến | http://localhost:8088 | Tạo tài khoản học viên trong website |
| phpMyAdmin — quản lý MySQL | http://localhost:8082 | Server `db`, DB `elearning`, user `elearning`, mật khẩu `MYSQL_PASSWORD` |
| Grafana — dashboard và LogQL | http://localhost:3000 | User `admin`, mật khẩu `GRAFANA_ADMIN_PASSWORD` |
| Prometheus — targets/metrics | http://localhost:9090 | Không yêu cầu đăng nhập; chỉ bind localhost |

Dashboard dựng sẵn có tên **E-learning system**, trong folder **E-learning**. Cả phpMyAdmin, Grafana và Prometheus chỉ được publish lên loopback máy host; website được publish qua Nginx tại cổng `8088`.

### Chạy bằng phím F5 trong VS Code

1. Mở **Docker Desktop** và đợi Docker Engine chạy.
2. Mở VS Code → **File → Open Folder...** → chọn đúng thư mục chứa `docker-compose.yml` và `README.md`.
3. Nếu chưa có file `.env`, tạo một lần từ PowerShell trong Terminal của VS Code:

   ```powershell
   Copy-Item .env.example .env
   notepad .env
   ```

   Thay các giá trị `CHANGE_ME_...` bằng mật khẩu riêng, mạnh rồi lưu file.
4. Chọn **Run and Debug** ở thanh bên trái (hoặc nhấn **Ctrl+Shift+D**), chọn cấu hình **Học Mỗi Ngày: Chrome**.
5. Nhấn **F5**. VS Code sẽ chạy `docker compose up --build -d`, chờ health check của website thành công rồi mở trang trong Google Chrome.

Lần đầu Docker cần tải image nên F5 có thể mất vài phút. Những lần sau, nhấn F5 sẽ khởi động lại các container hiện có và mở website khi sẵn sàng. Nếu chưa thấy Chrome mở, hãy kiểm tra danh sách cấu hình ở Run and Debug và chọn **Học Mỗi Ngày: Chrome**. Docker Desktop phải đang chạy; nếu Compose báo thiếu `.env`, hãy thực hiện bước 3.

Nhấn **Shift+F5** để kết thúc phiên debug trong VS Code. Các container vẫn chạy nền; muốn dừng toàn bộ ứng dụng, mở Terminal tại thư mục dự án và chạy `docker compose down`. Nếu máy đang dùng cổng `8088`, hãy giải phóng cổng đó hoặc đổi port trong `docker-compose.yml` đồng thời cập nhật URL ở `.vscode/launch.json` và health check trong `.vscode/tasks.json`.

### Dừng, xem log và dọn dữ liệu

```powershell
docker compose logs -f app proxy db
docker compose logs -f loki promtail grafana
docker compose down
```

`docker compose down` giữ lại dữ liệu trong named volumes. Muốn xóa sạch CSDL, Grafana và lịch sử metrics/log thì dùng `docker compose down -v` (thao tác này không thể hoàn tác).

## Chức năng ứng dụng

- Trang tổng quan tiếng Việt, tìm kiếm/lọc khóa học theo danh mục và trạng thái.
- Học viên đăng ký bằng email, mật khẩu và tùy chọn mã học viên; tài khoản được đăng nhập ngay sau khi tạo.
- Đăng nhập/đăng xuất, xem hồ sơ và thống kê cá nhân; đăng ký khóa học và tiến độ được tách riêng theo tài khoản.
- Bốn khóa học mẫu gồm 16 bài có nội dung hướng dẫn bằng tiếng Việt: lập trình web, Python, UI/UX và SQL.
- Trong danh sách khóa học, học viên chọn **Vào học** để mở bài. Nút **Hoàn thành bài học** nằm trong màn hình đọc và chỉ được bật sau khi đọc đến cuối; sau khi hoàn thành, ứng dụng tự quay về danh sách nội dung khóa học để chọn bài tiếp theo. Máy chủ cũng từ chối hoàn thành nếu bài chưa được ghi nhận đã đọc.
- Đăng ký khóa học, theo dõi bài đã đọc/hoàn thành và lưu tiến độ riêng vào MySQL.
- API xác thực: `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/me`; `GET /api/profile` yêu cầu đăng nhập.
- API học tập: `GET /api/courses`, `GET /api/courses/:courseId`, `POST /api/courses/:courseId/enroll`, `GET /api/lessons/:lessonId` (lấy nội dung), `POST /api/lessons/:lessonId/read` (xác nhận đọc đến cuối), `POST /api/lessons/:lessonId/complete`. Các thao tác trên bài học yêu cầu đăng nhập và ghi danh; hoàn thành chỉ được chấp nhận sau bước xác nhận đã đọc.
- Health check `GET /api/healthz`; metrics Prometheus `/metrics` chỉ truy cập được từ mạng nội bộ Docker, Nginx trả 404 cho endpoint này.
- Schema và dữ liệu khóa học mẫu được tạo khi MySQL khởi tạo volume lần đầu. Ứng dụng tự bổ sung schema xác thực, nội dung bài học và trạng thái đã đọc khi khởi động, tương thích với volume cũ; nội dung tĩnh được nạp cho các bài học hiện có mà không xóa dữ liệu học viên.

## Giám sát và truy vấn log

Prometheus scrape metrics ứng dụng, Nginx exporter và MySQL exporter mỗi 15 giây. Grafana được provision sẵn cả datasource Prometheus và Loki. Promtail thu thập log JSON của ứng dụng cùng access/error log Nginx từ named volumes, không cần mount Docker socket.

Một số LogQL query để demo trong Grafana → Explore → Loki:

```logql
{job="elearning-app"}
```

```logql
{job="nginx"} |= "GET"
```

```logql
{job="elearning-app"} | json | level="error"
```

Ví dụ truy vấn Prometheus:

```promql
sum(rate(http_requests_total[5m])) by (method, route)
```

```promql
mysql_global_status_threads_connected
```

## Bảo vệ hệ thống

- Ứng dụng và Nginx chạy bằng user không phải root; hai container này dùng filesystem chỉ đọc, bỏ toàn bộ Linux capabilities và bật `no-new-privileges`.
- MySQL không publish port ra host. phpMyAdmin ở mạng data; app, proxy, database và observability được tách thành các Docker network.
- phpMyAdmin, Grafana và Prometheus chỉ mở trên `127.0.0.1`. Không dùng các cổng quản trị đó như dịch vụ Internet-facing.
- Nginx đặt security headers, giới hạn kích thước/thời gian request và ẩn phiên bản server; API có rate limit. Helmet áp dụng CSP và các HTTP security headers trong ứng dụng.
- Truy vấn SQL dùng parameter binding; body JSON bị giới hạn 16 KB. Secret nằm trong `.env`, không commit.
- Mật khẩu học viên được băm bằng bcrypt; session ngẫu nhiên lưu dạng hash trong MySQL và gửi qua cookie `HttpOnly`, `SameSite=Lax`, hết hạn sau 7 ngày. API giới hạn tần suất đăng nhập/đăng ký và từ chối request thay đổi dữ liệu khác origin.
- Log chỉ chứa method, path, status và thời gian xử lý; không ghi request body hay mật khẩu.

`COOKIE_SECURE=false` phù hợp với cấu hình HTTP local hiện tại. Khi triển khai sau HTTPS, đặt `COOKIE_SECURE=true` để bật cờ Secure cho cookie. Hệ thống hiện là demo học tập; trước khi dùng trên Internet cần cấu hình TLS, backup, giám sát/khôi phục session, quản lý secrets và kiểm thử bảo mật phù hợp.

## Cấu trúc

```text
database/init.sql                         Schema và khóa học mẫu
src/server.js, src/logger.js              API Express, MySQL, metrics và log JSON
public/index.html, app.js, styles.css      Giao diện học viên responsive
nginx/default.conf                        Reverse proxy và security headers
monitoring/prometheus.yml                 Scrape jobs
monitoring/promtail.yml                   Log scrape jobs cho Loki
monitoring/grafana/provisioning/          Datasource và dashboard dựng sẵn
docker-compose.yml, Dockerfile             Stack và image ứng dụng
docs/BAO-CAO.html                         Báo cáo mẫu in được 10+ trang A4
```

## GitHub và bàn giao

Đề bài yêu cầu tên tài khoản/repository theo mã số sinh viên. Hãy dùng tài khoản GitHub của bạn để tạo repository, sau khi thay mã sinh viên trong `.env` và điền tên/mã/lớp vào trang bìa `docs/BAO-CAO.html`. Không commit `.env`, mật khẩu, token hoặc dữ liệu thật. Trong repository có thể tổ chức tối thiểu ba commit riêng, có nội dung rõ ràng: nền tảng ứng dụng + CSDL; Nginx + giám sát; Loki/Promtail + hardening + tài liệu. Cấu hình credential Git của chính bạn trước khi push.

## Báo cáo

Mở `docs/BAO-CAO.html` trong trình duyệt, điền thông tin sinh viên và ngày nộp, sau đó chọn **In → Save as PDF**, khổ A4, scale 100%, bật background graphics. Báo cáo có sơ đồ kiến trúc và chỗ dành cho ảnh chụp minh chứng; hãy chèn ảnh thực tế sau khi stack chạy và thay phần kết quả kiểm thử mẫu bằng kết quả quan sát của bạn.
