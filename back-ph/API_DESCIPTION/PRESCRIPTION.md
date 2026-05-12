<div dir="rtl">
# Project: PRESCRIPTION

## End-point: GET PRESCRIPTION
| الخاصية | التفاصيل |
| --- | --- |
| **اسم المسار** | استعراض السجلات الشاملة للوصفات |
| **الطريقة (Method)** | `GET` |
| **الرابط (URL)** | `http://localhost:3000/prscription/details` |
| **الوصف المنطقي** | جلب بيانات الوصفة مع الطبيب والمريض وقائمة الأدوية المرتبطة عبر ربط 4 جداول مع تجميع الأدوية برمجياً باستخدام `reduce`. |
| **الرد الناجح** | `200 OK` مع مصفوفة تحتوي على كائنات متداخلة (Nested Objects) لكل وصفة. |
### Method: GET
>```
>http://localhost:3000/prscription/details
>```

⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: POST PRESCRIPTION
| الخاصية | التفاصيل |
| --- | --- |
| **اسم المسار** | إنشاء وصفة طبية إلكترونية جديدة |
| **الطريقة (Method)** | `POST` |
| **الرابط (URL)** | `http://localhost:3000/prscription/add` |
| **المدخلات (Body)** | `DATE_P`, `ID_DOCTOR`, `ID_PATIENT`, ومصفوفة أدوية `MEDICINES`. |
| **الأمان التقني** | يستخدم نظام المعاملات (Database Transactions)؛ حيث يتم التأكد من إدراج الوصفة وكافة أدويتها بنجاح قبل عمل `commit`. |
| **المنطق البرمجي** | 1\. إدراج الوصفة واسترجاع الـ ID المولد تلقائياً عبر `RETURNING ID`. 2. إدراج قائمة الأدوية في جدول `INCLUDE` باستخدام حلقة تكرار (Loop). |
| **حماية البيانات** | في حال حدوث أي خطأ، يتم تنفيذ `rollback` لإلغاء كافة التغييرات وضمان عدم وجود بيانات ناقصة. |
### Method: POST
>```
>http://localhost:3000/prscription/add
>```
### Body (**raw**)

```json
{
  "DATE_P": "2026-01-16",
  "ID_DOCTOR": 1,
  "ID_PATIENT": 2,
  "MEDICINES": [
    {
      "ID_MED": "Doxycycline",
      "FREQ": 2,
      "DOSAGE": 1
    }
  ]
}

```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃
_________________________________________________
Powered By: [postman-to-markdown](https://github.com/bautistaj/postman-to-markdown/)
</div>
