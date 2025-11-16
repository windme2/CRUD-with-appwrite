# ✨ CRUD Application with Express.js & Appwrite

REST API สำหรับระบบจัดการสินค้า พร้อม Appwrite Cloud Database และ Frontend UI แบบ Real-time

**🌐 Live Demo:** [https://crud-afxa.onrender.com/](https://crud-afxa.onrender.com/)

## ✨ คุณสมบัติ

- REST API ด้วย Express.js
- Appwrite Cloud Database (Singapore region)
- Product CRUD Operations (Create, Read, Update, Delete)
- Real-time UI Updates
- Modern Responsive Frontend Design
- Form Validation & Error Handling
- Statistics Dashboard

## 🛠️ เทคโนโลยีที่ใช้

### Backend
- **Node.js** (>= 18.0.0)
- **Express.js** v5.1.0 - Web framework
- **Appwrite SDK** v20.3.0 - Database client

### Frontend
- **HTML5** - Structure
- **CSS3** - Styling (Modern design with gradients, shadows, animations)
- **Vanilla JavaScript** - Logic (Fetch API)

### Database
- **Appwrite Cloud** (Singapore region)

### Other
- **dotenv** - Environment variables management
- **cors** - Cross-origin resource sharing

## � Quick Start

```bash
# 1. ติดตั้ง Dependencies
npm install

# 2. ตั้งค่า .env
PORT=3000
APPWRITE_ENDPOINT=https://sgp.cloud.appwrite.io/v1
APPWRITE_PROJECT_ID=your_project_id
APPWRITE_API_KEY=your_api_key
APPWRITE_DATABASE_ID=your_database_id
APPWRITE_COLLECTION_ID=items

# 3. รันเซิร์ฟเวอร์
npm start        # Production
```

## 💾 Database (Appwrite Cloud)

### การตั้งค่า Appwrite

1. **สร้าง Project**
   - ไปที่ [Appwrite Console](https://cloud.appwrite.io)
   - สร้าง Project ใหม่และเลือก **Singapore region**
   - คัดลอก Project ID

2. **สร้าง API Key**
   - Settings > API Keys > Create API Key
   - เลือก Scopes: `databases.*`, `collections.*`, `documents.*`
   - คัดลอก API Key (แสดงครั้งเดียว)

3. **สร้าง Database & Collection**
   - สร้าง Database ชื่อ "CRUD-DB"
   - สร้าง Collection ชื่อ "items"

### Database Schema

| Field         | Type    | Required | Description          |
|---------------|---------|----------|----------------------|
| itemName      | String  | ✅       | ชื่อสินค้า           |
| description   | String  | ❌       | รายละเอียดสินค้า    |
| price         | Float   | ✅       | ราคา                 |
| stockQuantity | Integer | ❌       | จำนวนสต็อก          |
| categoryId    | String  | ❌       | รหัสหมวดหมู่        |
| isAvailable   | Boolean | ❌       | สถานะพร้อมขาย       |

### Permissions
- Role: **Any**
- Permissions: ✅ Create, Read, Update, Delete

## � API Endpoints

### Health Check (Public)
```bash
GET /health   # ตรวจสอบสถานะ server
```

### Product Management
```bash
GET    /api/items           # ดูสินค้าทั้งหมด
GET    /api/items/:id       # ดูสินค้าตาม ID
POST   /api/items           # เพิ่มสินค้า
PUT    /api/items/:id       # แก้ไขสินค้า
DELETE /api/items/:id       # ลบสินค้า
```

## 📝 ตัวอย่างการใช้งาน

```bash
# 1. ดูสินค้าทั้งหมด
GET /api/items

# Response
[
  {
    "$id": "673f8a2b1c2d3e4f5a6b7c8d",
    "itemName": "Mechanical Keyboard",
    "price": 1590,
    "stock": 45,
    "$createdAt": "2025-11-16T08:30:15.000Z"
  }
]

# 2. เพิ่มสินค้า
POST /api/items
Content-Type: application/json

{
  "itemName": "Gaming Mouse",
  "description": "RGB Gaming Mouse",
  "price": 890,
  "stockQuantity": 30,
  "categoryId": "electronics",
  "isAvailable": true
}

# 3. แก้ไขสินค้า
PUT /api/items/673f8a2b1c2d3e4f5a6b7c8d
{
  "price": 1490,
  "stockQuantity": 50
}

# 4. ลบสินค้า
DELETE /api/items/673f8a2b1c2d3e4f5a6b7c8d
```

## 🐛 Troubleshooting

### Cannot connect to Appwrite
- ตรวจสอบ `APPWRITE_ENDPOINT` ต้องตรงกับ Region ของโปรเจกต์
  - Singapore: `https://sgp.cloud.appwrite.io/v1`
- ตรวจสอบ API Key มี permissions ครบ
- ตรวจสอบ Collection ID ถูกต้อง

### Port already in use
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### CORS Error
- เพิ่ม platform ใน Appwrite Console
- Settings > Platforms > Add Platform
- Type: Web, Hostname: `localhost`

---

## 📄 License

This project is licensed under the MIT License.
