# 🏥 نظام إدارة الصيدلية المتكامل (Pharmacy Management System)

هذا المشروع هو نظام "Back-end" متكامل لإدارة العمليات الصيدلانية، تم بناؤه باستخدام تقنية **Node.js** و **Express** مع الربط المباشر بقاعدة بيانات **Oracle DB** لضمان إدارة دقيقة للبيانات.

---

## 🔗 التوثيق التفاعلي (Postman Documentation)
بدلاً من قراءة الكود الخام، يمكنك استعراض كافة المسارات (Endpoints) والجداول التقنية التي تشرح (الأطباء، المرضى، الأدوية، والوصفات) بشكل منظم عبر مجلد API_DESCRIPTION

*(يتميز التوثيق بجداول توضح "الخاصية"، "التفاصيل"، و "الرد الناجح" لكل مسار برمجته).*

---

## 🏗️ بنية النظام (System Architecture)
يعتمد المشروع على بنية المجلدات المنظمة وتوزيع المهام التقنية (3-Tier Architecture) لضمان الكفاءة:
1. **قاعدة البيانات (Database)**: Oracle SQL Database لإدارة الجداول والعلاقات.
2. **الخادم (Backend Server)**: Node.js & Express API لمعالجة الطلبات البرمجية.
3. **التوثيق (Documentation)**: Postman API Documentation لشرح واجهة التطبيق.

---

## 🛠️ المتطلبات الأساسية (Prerequisites)
قبل البدء في تشغيل المشروع، تأكد من توفر الأدوات التالية:
* **Node.js**: الإصدار 16 أو أحدث.
* **Oracle Database**: مثبتة وتعمل.
* **Oracle Instant Client**: ضروري لتمكين مكتبة `oracledb` من الاتصال بالقاعدة.

---

## ⚙️ إعداد وتشغيل المشروع (Setup & Run)

### 1. تثبيت المكتبات المطلوبة
قم بتشغيل هذا الأمر لمرة واحدة في محطة الأوامر (Terminal) لتثبيت كافة التبعيات اللازمة بضغطة واحدة:
```bash
npm install express oracledb dotenv cors body-parser nodemon
```
### 2. معلومات قاعدة البيانات
قم باستبدال المعلومات في ملف  `env.example.`  بالتالي:

`DB_HOST`
```bash
100.127.142.100
```
`DB_USER`
```bash
Pharmacy
````
***للحصول على كلمة السر تاكد من التواصل مع المطور*** .
### 3. قم بتشغيل السيرفر:
```bash
node server.js
```
**دليل العمل للفريق (Team Collaboration)**
إذا كنت عضواً في الفريق وتريد الاتصال بالسيرفر الرئيسي:

الاتصال بالشبكة: يجب أن تكون متصلاً بنفس الشبكة المحلية مع المضيف.

تعديل الرابط: استبدل localhost في طلباتك البرمجية بـ IP المضيف (مثلاً: http://192.168.1.5:3000/doctors).

كلمة السر: اطلب بيانات الـ .env من مسؤول النظام يدوياً لتضعها في جهازك محلياً.

## 🧪 Testing & API Collaboration

To explore and test the API endpoints interactively, please join our Postman team using the link below. 

> ⚠️ **Note:** After clicking the link, it will send a join request to the admin. Access will be granted once the request is approved.

🔗 **[Join the Postman Workspace](https://app.getpostman.com/join-team?invite_code=a815aea978965dbb2675ad96398a14158a5e02744c4156ba4e6dd929612d6b72&target_code=413501fb8d85a19242cebf6c0fb86a0d)**

---
### 🛠️ Key Features
* **Backend:** Node.js & Express.js.
* **Database:** Oracle DB (SQL).
* **Status:** ✅ Project Completed.
