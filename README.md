# cf-worker-telegram
[English](#english) | [Tiếng Việt](#tiếng-việt)

![Telegram Bot API Proxy](https://img.shields.io/badge/Telegram-Bot%20API%20Proxy-blue?logo=telegram)
![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers-orange?logo=cloudflare)
![License](https://img.shields.io/badge/license-MIT-green)




# English

A lightweight and efficient Cloudflare Worker that acts as a transparent proxy for the Telegram Bot API. This proxy allows you to bypass network restrictions and create middleware for Telegram bot applications.

# Tiếng Việt

Chạy trên Cloudflare Worker, đơn giản hoạt động như một proxy cho Telegram Bot API. Proxy này cho phép bạn vượt qua các hạn chế mạng và tạo middleware cho các ứng dụng bot Telegram.

##DEMO - PROXY 
https://proxy-tele.12bay.worbkers.dev



## Tính năng

- Chạy tất cả các phương thức của Telegram Bot API
- Hỗ trợ CORS đầy đủ cho các ứng dụng web
- Hiệu suất cao với mạng lưới toàn cầu của Cloudflare
- Trang tài liệu tích hợp sẵn
- Hỗ trợ tất cả các phương thức HTTP (GET, POST, PUT, DELETE)
- Auto Webhook proxy callback for N8N

  <img width="1049" alt="image" src="https://github.com/user-attachments/assets/ff196ffc-d0e1-4fde-9c4e-f84f5c185bb4" />

## Cài đặt

1. Tải file này:
   ```bash
      telegram-bot-proxy.js
   ```
2. Hướng dẫn tạo Cloudflare Worker
```https://dev.to/andyjessop/setting-up-a-new-cloudflare-worker-with-a-custom-domain-fl9```
3. Deploy
   Coppy nội dung telegram-bot-proxy.js dán vào phần edit code và deploy

## Cách sử dụng

Thay thế `api.telegram.org` bằng URL của worker trong các API calls của bạn:

URL Telegram API gốc:
```
https://api.telegram.org/bot{TOKEN_BOT_CỦA_BẠN}/sendMessage
```

Sử dụng proxy này:
```
https://{URL_WORKER_CỦA_BẠN}/bot{TOKEN_BOT_CỦA_BẠN}/sendMessage
```

Điền thông tin vào trong N8N
Thay api.telegram.org lại thành 

```
https://{URL_WORKER_CỦA_BẠN}
```


### Ví dụ Code

```javascript
// Ví dụ JavaScript
fetch('https://{URL_WORKER_CỦA_BẠN}/bot{TOKEN_BOT_CỦA_BẠN}/sendMessage', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        chat_id: "123456789",
        text: "Xin chào từ Telegram Bot API Proxy!"
    })
})
.then(response => response.json())
.then(data => console.log(data));
```

## 🔒 Bảo mật

- Proxy này không lưu trữ hoặc sửa đổi token bot của bạn
- Tất cả các yêu cầu được chuyển tiếp trực tiếp đến máy chủ API của Telegram
- HTTPS được bắt buộc theo mặc định (yêu cầu của Cloudflare Workers)
- Không lưu trữ logs
- Tận dụng mạng lưới CDN toàn cầu của Cloudflare
- Hoàn hảo cho các ứng dụng web

## 📚 Tài liệu

Truy cập tài liệu tích hợp bằng cách truy cập URL gốc của worker:
```
https://{URL_WORKER}/
```

## THANK YOU FOR  tuanpb99/cf-worker-telegram
