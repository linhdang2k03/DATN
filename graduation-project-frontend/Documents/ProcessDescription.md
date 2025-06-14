Mô tả quy trình:

1. Người dùng truy cập trang web:
- Người dùng mở trang web đánh giá người dùng.

2. Đăng ký:
- Người dùng chọn đăng ký tài khoản.
- Nhập CCCD, nhập mật khẩu và nhập xác nhận mật khẩu.
- Server kiểm tra CCCD hợp lệ, nhập mật khẩu hợp lệ.
- Nếu nhập hợp lệ, server trả về thông báo đăng ký thành công
- Hệ thống hiện thị giao diện đăng nhập

3. Đăng nhập:
- Người dùng chọn đăng nhập. 
- Hệ thống hiển thị form đăng nhập.
- Người dùng nhập thông tin đăng nhập (CCCD và mật khẩu).
- Hệ thống gửi thông tin đến server để xác thực.
- Server kiểm tra thông tin đăng nhập trong cơ sở dữ liệu.
- Nếu thông tin đúng, server trả về thông báo thành công và thông tin người dùng.
- Hệ thống hiển thị giao diện người dùng đã đăng nhập.

4. Tìm kiếm người dùng khác:
- Người dùng tìm kiếm hoặc chọn một người dùng khác mà họ muốn đánh giá.
- Hệ thống gửi yêu cầu tìm kiếm đến server.
- Server trả về kết quả tìm kiếm hoặc thông tin chi tiết về người dùng được chọn.

5. Viết đánh giá:
- Người dùng nhập chọn số sao (hoặc mức đánh giá).
- Hệ thống hiển thị form nhập đánh giá.
- Người dùng gửi đánh giá.

6. Lưu đánh giá:
- Hệ thống gửi đánh giá của người dùng đến server.
- Server lưu đánh giá vào cơ sở dữ liệu, kèm theo thông tin về người đánh giá và người được đánh giá.
- Server trả về kết quả lưu thành công.

7. Hiển thị đánh giá mới:
- Hệ thống hiển thị đánh giá mới trên trang cá nhân của người dùng được đánh giá.

8.note ngày 22/8
- phan loai users thanh 3 loai: admin / editor / viewer 
- candidates khong phai la users ma co the la san pham, cua hang ... hoac bat ky doi tuong nao co the se bi danh gia
- candidates se gom 1 thong tin unique de lam key, va cac thong tin phu (anh, metadata...)
- candidates nen duoc quan ly theo category (phan level de quan ly nested category)
- admin co the phan quyen de viewer co the chi xem dc cac candidates theo category
- dashboard: thong ke theo category, theo 10 candidates rate cao nhat, 10 canidates rate thap nhat
- editor co the cap nhat danh sach candidates bang cach import data tu file excels / csv .. (hoac cach nao do)
- co the them 1 truong trong bang users de quyet dinh user co dc danh gia hay ko
- can lam them 1 trang html static de hien thi thong tin yeu cau dang nhap moi co the xem dc cac thong tin danh gia, candidates...