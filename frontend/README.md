🛠️ Backend API Documentation

1. Authentication – Đăng nhập

URL: http://localhost:8080/api/v1/auth/login

Method: POST

Content-Type: application/json

Request Body
{
"username": "lehienvu5527@gmail.com",
"password": "123456"
}

Response Body
{
"statusCode": 200,
"error": null,
"message": "Login success",
"data": {
"userLogin": {
"id": 1,
"email": "lehienvu5527@gmail.com",
"name": "Lê Hiền Vũ"
},
"access_token": "<ACCESS_TOKEN>"
}
}

Lưu ý: Copy giá trị access_token để dùng cho các API khác.

2. Sử dụng token để gọi API khác

Mở Postman hoặc công cụ HTTP client.

Chọn tab Authorization → Type: Bearer Token.

Paste giá trị access_token vào input.

Nhập URL và SEND
