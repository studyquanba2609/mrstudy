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


## Bảng giá
`bao-gia.html` đọc `data/prices.json`. Chạy `python scripts/update_prices.py` để lấy lại bảng giá nguồn, cộng một lần theo nhóm sản phẩm: điện thoại/iPad/MacBook +700.000đ; AirPods/tai nghe không dây +400.000đ; sạc/cáp/tai nghe có dây (EarPods) +100.000đ. Các nhóm khác giữ mức cũ +700.000đ. AirPods được nhận dạng trước từ “sạc” trong tên phiên bản (ví dụ AirPods sạc thường) (không cộng thêm phụ phí khách lẻ 300.000đ của nguồn). Hàng hết giá giữ `null`. Script dừng khi dữ liệu nguồn bất thường và giữ bản gần nhất. Dữ liệu công khai chỉ chứa giá bán đã cộng; không chứa giá vốn. Giá sửa chữa chưa được cung cấp.

## Ưu đãi: một topic mỗi ngày
`data/deals.json`: `{updatedAt: <ISO UTC hoặc null>, items: [...]}`. Chọn vài app hữu ích, không đặt chỉ tiêu bắt buộc 6 app. Giao diện tự gom thành **một topic/ngày** theo `topicDate`, tiêu đề ví dụ “Ngày 02/11/2026: 6 app miễn phí & ưu đãi trọn đời”. Cập nhật topic hiện có khi ưu đãi mới/đã hết, không tạo một bài riêng cho mỗi app. Link topic: `#bai-viet/deal-ngay-YYYY-MM-DD`, có tìm kiếm/lưu bài. Mỗi app chỉ cần công dụng ngắn tự viết, loại ưu đãi, vùng tải và link trực tiếp. Không cần bài dài.

Mỗi item bắt buộc có:
- `id`: duy nhất dạng `deal-<apple-id>-<kind>`; `topicDate`: ngày bài theo Việt Nam `YYYY-MM-DD`, giữ ổn định khi kiểm tra lại. `name`, `summary`: tên app và tóm tắt tiếng Việt tự viết 1–3 câu. `caveat`: giới hạn/IAP đáng biết nếu có. Không chép nguyên mô tả, không tự nhận trải nghiệm.
- `kind`: `download` hoặc `upgrade`.
- `sourceUrl`: bài gốc dạng https://appraven.net/app/<id> hoặc https://t.me/DealRaven/<post>. Dùng nguồn để tìm ứng viên, sau đó đối chiếu trực tiếp Apple/nhà phát triển. Không dùng bài cũ chưa đối chiếu như ưu đãi mới.
- `checkedAt`: ISO UTC của lần đối chiếu thật; không sửa mốc này nếu chưa kiểm tra. `expiresAt`: ISO UTC nếu có hạn chính thức.
- `regions`: các vùng thực sự đã kiểm tra, mỗi vùng `{code: "vn", name: "Việt Nam", url: "https://apps.apple.com/vn/app/<slug>/id<apple-id>", downloadPrice: 0, currency: "VND", checkedAt: "<ISO UTC>"}`. URL phải chứa đúng mã vùng; không suy ra ưu đãi toàn cầu từ một vùng. Ưu tiên Việt Nam; có thể thêm Mỹ/vùng khác khi đã kiểm tra và ghi rõ, không hướng dẫn giả thông tin để chuyển vùng.
- Nếu `kind: "upgrade"`: `lifetimeVerified: true` và `lifetimeEvidence: {url, checkedAt, description}` chỉ khi có bằng chứng riêng, hiện hành cho gói lifetime miễn phí (thông báo chính thức nhà phát triển hoặc giá gói thực tế được xác minh). Không coi giá tải 0 là bằng chứng lifetime 0. Ưu đãi chưa xác minh gói bị bỏ khỏi topic, không gắn nhãn miễn phí trọn đời.

`deal-rules.js` kiểm tra schema, URL, giá tải, tuổi dữ liệu và thời hạn; bài/app quá 48 giờ chưa đối chiếu lại sẽ ẩn; browser tải lại JSON mỗi 5 phút và khi mở lại tab. Không thêm trùng cùng apple-id/kind vào nhiều topic đang hiển thị. `deals.js` sinh bài tổng hợp plain text an toàn, dùng chung bộ đọc/tìm kiếm/lưu bài, không phải sửa `content.js` mỗi giờ.

Chọn app công việc, học tập, ảnh/video, tiện ích và sức khỏe thường ngày có ích. Bỏ app rác, trùng lặp, cờ bạc hoặc ưu đãi cần bot mua/IPA. Chỉ lấy dữ kiện tối thiểu từ nguồn công khai qua giao diện được cung cấp, tự viết tóm tắt và ghi nguồn; không chép toàn bộ danh sách/nội dung AppRaven, không truy cập API riêng hoặc vượt hạn chế. Nếu nguồn hiện không đọc được, không bịa app để có topic.

Kiểm tra: `node scripts/test_deals.js`, `node scripts/validate_deals.js`, `node --check deals.js`. Không commit chỉ để đổi thời gian nếu dữ liệu không đổi. Nguồn lỗi giữ bản cuối; bộ lọc tự ẩn phần không còn mới.

Đồng bộ theo lịch mỗi giờ qua tác vụ ChatGPT “Đồng bộ MRSTUDY”. Đây là polling, không nhận webhook từ nguồn; nguồn lỗi giữ bản cuối. Không ghi lại notes hoặc source vào dữ liệu giá công khai, không thêm cột thông tin nguồn cung. Chỉ commit dữ liệu khi có thay đổi, không tạo commit chỉ vì mốc thời gian.

Liên hệ Zalo công khai theo chủ website: https://zalo.me/0703480936. Giữ nguyên thông tin này khi đồng bộ dữ liệu.

AppRaven: liên kết tham khảo công khai https://appraven.net/activity/pricedrops?price=FREE&ratingCount=0. Theo yêu cầu chủ website, dùng AppRaven để tìm app và tự viết bài tiếng Việt cho MRSTUDY sau khi đối chiếu trực tiếp App Store/nhà phát triển, ghi nguồn và vùng cụ thể; không sao chép nguyên nội dung của AppRaven. Nếu không đọc được danh sách hiện hành thì không bịa ứng viên mới.

Có thể đối chiếu giá tải qua Apple Lookup công khai: https://itunes.apple.com/lookup?id=<apple-id>&country=vn hoặc us. resultCount=0 không có nghĩa mọi vùng đều hết app; ghi đúng vùng tìm thấy. price=0 chỉ chứng minh giá tải, không chứng minh lifetime. Bài nguồn cộng đồng cũ có thể dùng để tìm ứng viên, nhưng chỉ đăng khi đã đối chiếu giá hiện hành và không tự nhận app mới giảm giá hôm nay. Tiêu đề tự bỏ chữ trọn đời nếu topic không có gói trọn đời đã xác minh.

Bố cục topic app theo yêu cầu mới: chỉ hiển thị tiêu đề ngày, tên app, công dụng ngắn, loại miễn phí, vùng và nút tải. Không hiển thị phần đếm “0 ưu đãi”, lời giới thiệu quy trình biên soạn, mốc kiểm tra giờ/phút/giây, caveat kỹ thuật, thông báo chưa xác nhận lifetime hoặc liên kết nguồn trong bài. Metadata nguồn/thời gian/bằng chứng vẫn giữ trong JSON để kiểm tra và tự ẩn ưu đãi cũ. Không thêm lại những lời giải thích này vào summary.
Ảnh app: `icon` và `image` là đường dẫn local ./assets/deals/<apple-id>-icon.jpg hoặc -screen.jpg. Dùng biểu tượng/ảnh giao diện chính thức từ Apple Lookup, lưu nguồn ở assets/deals/sources.json; không tạo ảnh mô phỏng giao diện app. Giữ ảnh hiện có khi chỉ cập nhật giá.

Sau khi sửa CSS/JS, chạy `python scripts/version_assets.py` để gắn mã nội dung vào URL tài nguyên trong index.html và bao-gia.html; commit cả HTML. Cách này tránh Safari dùng lại mã giao diện cũ sau khi Pages cập nhật. Đồng bộ chỉ JSON không cần đổi URL CSS/JS.

## Tin iPhone và hướng dẫn sửa chữa
`phone-content.js` thêm các bài mới vào MRSTUDY_DATA.articles trước app.js. Tin cũ không thuộc iPhone được đánh archived, giữ link cũ nhưng không đưa vào news-grid/tìm kiếm thường.
Tin: type=news, sourceSite=MacRumors; chỉ iPhone/iOS, tóm tắt tiếng Việt tự viết khoảng 100–150 từ, không dịch/sao chép toàn văn. Giữ ngày đăng gốc, link bài, phân biệt thông tin đã xác nhận với tin đồn. Đọc homepage/archive hiện hành; /iphone/ là trang cũ không phản ánh tin mới.
Sửa chữa: type=repair, sourceSite=iFixit, chỉ iPhone. Mục hiển thị “Hướng dẫn sửa chữa iPhone”. Viết tóm tắt chuẩn bị/lưu ý ngắn và nút link quy trình đầy đủ, giữ sourceDate của hướng dẫn. Không bỏ cảnh báo vật lý thiết yếu (pin, cáp, Face ID) khi diễn giải. Không bịa thông số tháo lắp hoặc ghi bản tóm tắt là quy trình đầy đủ.
Mỗi bài có id cố định, category/title/description/date/readTime/tags/body/sources; image/imageAlt khi có. Ảnh SVG assets/editorial là minh họa MRSTUDY tự vẽ, không phải ảnh sản phẩm/tháo máy thực tế. Có thể tái dùng đúng chủ đề. Cập nhật bài theo URL nguồn, tránh trùng, không sửa ngày thành hôm nay cho bài nguồn cũ. Sau khi đổi JS/CSS phải chạy python scripts/version_assets.py và commit HTML đổi phiên bản.
