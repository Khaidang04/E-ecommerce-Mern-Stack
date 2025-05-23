Ngon ngu: React Native + Postman + Mongodb
Vai tro: Xây dựng ứng dụng thương mại điện tử BE
Data: Xác thực CRUD:users, products, carts, orders


DFD: 
+-------------+
| Người dùng  |
+-------------+
      |
      | 1. Gửi yêu cầu đặt hàng (POST /orders)
      ▼
+-----------------------+
| Xác thực JWT Token    |
+-----------------------+
      |
      | 2. Lấy giỏ hàng từ userId
      ▼
+-----------------------+             +------------------+
| Truy vấn Cart         |◄───────────►| CSDL: Collection |
+-----------------------+             | Cart             |
      |
      | 3. Tính tổng tiền từ danh sách sản phẩm
      ▼
+-----------------------+             +------------------+
| Truy vấn Product      |◄───────────►| CSDL: Product    |
+-----------------------+             +------------------+
      |
      | 4. Tạo đơn hàng
      ▼
+-----------------------+             +------------------+
| Ghi vào Order         |───────────►| CSDL: Order      |
+-----------------------+             +------------------+
      |
      | 5. Xoá giỏ hàng
      ▼
+-----------------------+             +------------------+
| Xoá Cart              |───────────►| CSDL: Cart       |
+-----------------------+             +------------------+
      |
      ▼
+-----------------------+
| Trả kết quả JSON về   |
+-----------------------+