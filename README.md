# MRSTUDY

Website tiếng Việt chia sẻ kiến thức công nghệ, tin tức và ứng dụng App Store miễn phí. HTML/CSS/JavaScript tĩnh, không cần cài thư viện hay biên dịch. Có giao diện điện thoại, tìm kiếm không dấu, bài đọc đầy đủ, danh sách đã lưu trên thiết bị và giao diện tối.

## Bật website trên GitHub Pages

Mã web nằm ở thư mục gốc, không cần build.

1. Trong kho `studyquanba2609/mrstudy`, mở **Settings → Pages**.
2. Chọn **Deploy from a branch**.
3. Chọn nhánh **main**, thư mục **/(root)** và bấm **Save**.
4. Chờ quy trình `pages build and deployment` thành công. Đường link chính thức được GitHub hiển thị trong trang Pages.

## Đăng bài mới

Chỉnh `content.js` trên GitHub và commit thay đổi. Trong mảng `articles`, sao chép một bài rồi đổi:

- `id`: liên kết duy nhất, chỉ dùng chữ thường không dấu và dấu gạch ngang.
- `type`: `knowledge` (kiến thức) hoặc `news` (tin tức).
- `category`, `title`, `description`: chuyên mục, tiêu đề và mô tả.
- `date`: ngày xuất bản `YYYY-MM-DD`; `readTime`: số phút đọc.
- `tags`: các từ khóa cho tìm kiếm.
- `body`: nội dung HTML trong cặp dấu backtick; dùng `<p>`, `<h2>`, `<ul>`, `<li>`.
- `sources`: tên và URL nguồn tham khảo.
- `image`: đường dẫn ảnh trong `assets/`, hoặc `art` là `icloud`, `localsend`, `github` cho minh họa sẵn có.

Các bài `news` được xếp theo ngày giảm dần. Nội dung HTML do chủ trang biên tập; chỉ đưa mã tin cậy vào trường `body`. Không có CMS, tài khoản quản trị hay chức năng đăng bài trực tiếp trên giao diện website.

## Thêm hoặc cập nhật ứng dụng

Chỉnh mảng `apps` trong `content.js`. Mỗi ứng dụng có `id`, `name`, `category` (`photo` hoặc `utility`), `categoryLabel`, `description`, `icon`, `platforms`, `price`, `iap`, `limited`, `checkedDate`, `url`, `developer`, `details` và `tips`.

- Bản đầu chỉ liệt kê ba ứng dụng tải miễn phí đã đối chiếu từ App Store Việt Nam ngày **02/11/2026**. Chưa có ưu đãi trả phí chuyển miễn phí có thời hạn được xác minh.
- Giao diện hiện chuyên cho giá tải xuống **0 đồng**. Không thêm ứng dụng trả phí vào danh sách này khi chưa sửa logic hiển thị giá.
- `iap: true` nghĩa là trang App Store ghi nhận mua trong ứng dụng. Miễn phí tải xuống không đồng nghĩa với mọi tính năng đều miễn phí.
- `limited: true` dành cho ưu đãi có thời hạn thực sự đã xác minh. Cần kiểm tra lại và gỡ ưu đãi ngay khi hết hạn.
- `checkedDate` là ngày đối chiếu thủ công. Sau 7 ngày, giao diện đổi nhãn sang **Cần kiểm tra lại giá**; không tự kiểm tra giá trực tiếp.
- Nếu thay đổi tổng số ứng dụng, cập nhật số đếm trong nút “Tất cả” ở `index.html`, mô tả hero và ngày đối chiếu hiển thị trong thanh lọc.

## Chạy thử

Phục vụ thư mục gốc bằng máy chủ HTTP tĩnh bất kỳ. Không có bước build. Không có máy chủ ứng dụng, phân tích truy cập, nhận email hay tự động đăng tin. Tìm kiếm thực hiện ngay trên trình duyệt. Mục đã lưu và lựa chọn giao diện dùng localStorage trên thiết bị; không đồng bộ qua tài khoản.

## Tệp chính

- `index.html`: cấu trúc trang và các vùng tương tác.
- `style.css`: giao diện và bố cục điện thoại.
- `content.js`: bài viết, nguồn tham khảo và ứng dụng.
- `app.js`: tìm kiếm, đọc bài, lọc app, lưu bài, đổi giao diện.
- `assets/`: hình ảnh App Store/Apple Newsroom, phông chữ và biểu tượng.
- `assets/image-sources.json`: nguồn hình ảnh.
GitHub Pages tự cập nhật sau mỗi lần thay đổi nhánh `main` khi đã bật xuất bản từ nhánh.

Ảnh sản phẩm do Apple cung cấp và biểu tượng ứng dụng từ App Store, có liên kết nguồn trong bài và tệp image-sources.json. Thương hiệu thuộc chủ sở hữu tương ứng; MRSTUDY là trang chia sẻ độc lập, không tự nhận được Apple hay các nhà phát triển bảo trợ.
