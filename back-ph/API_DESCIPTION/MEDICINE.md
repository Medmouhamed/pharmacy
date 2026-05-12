<div dir="rtl">
# Project: MEDICINE

## End-point: GET MEDICINES
| الخاصية | التفاصيل |
| --- | --- |
| **اسم المسار** | جلب القائمة الكاملة للأدوية (Inventory Catalog) |
| **الطريقة (Method)** | `GET` |
| **الرابط (URL)** | `http://localhost:3000/medicines` |
| **الوصف المنطقي** | يقوم باستخراج كافة سجلات الأدوية من جدول `MEDICINE` في قاعدة البيانات. |
| **الرد الناجح (Success)** | `200 OK` مع مصفوفة (Array) تحتوي على كافة الأدوية بتنسيق JSON. |
| **الرد الفاشل (Error)** | `500 Server Error` في حال وجود مشكلة في الاتصال بقاعدة البيانات. |
### Method: GET
>```
>http://localhost:3000/medicines
>```

⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: GET MEDICINE BY NAME
| الخاصية | التفاصيل |
| --- | --- |
| **اسم المسار** | عرض تفاصيل دواء محدد (Medicine Profile) |
| **الطريقة (Method)** | `GET` |
| **الرابط (URL)** | `http://localhost:3000/medicines/detials/:name` |
| **المعاملات (Params)** | `name`: اسم الدواء المراد البحث عنه. |
| **الوصف المنطقي** | يبحث عن السجل المطابق للاسم؛ وفي حال عدم وجوده، يرجع تنبيهاً للمستخدم. |
| **الرد الناجح** | `200 OK` مع كامل بيانات الصنف. |
| **الرد الفاشل** | `404 Not Found` إذا لم يتم العثور على الاسم في القاعدة. |
### Method: GET
>```
>http://localhost:3000/medicines/detials/Amoxicillin
>```

⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: GET MEDICINES by CATEGORIES
| الخاصية | التفاصيل |
| --- | --- |
| **اسم المسار** | فلترة الأدوية حسب الفئة الطبية (Categorized Medicines) |
| **الطريقة (Method)** | `GET` |
| **الرابط (URL)** | `http://localhost:3000/medicines/:categoryId` |
| **المعاملات (Params)** | `categoryId`: الرقم التعريفي للصنف الطبي. |
| **الوصف المنطقي** | يقوم بعمل ربط (JOIN) بين جدولي الأدوية والأرفف (`SHELF`) لعرض الأدوية المتوفرة في قسم معين. |
| **الرد الناجح (Success)** | `200 OK` مع قائمة بالأدوية التي تنتمي لهذا الصنف فقط. |
| **الرد الفاشل (Error)** | `500 Server Error` في حال حدوث خطأ في الاستعلام أو الاتصال. |
### Method: GET
>```
>http://localhost:3000/medicines/1
>```

⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: POST MEDICINE
| الخاصية | التفاصيل |
| --- | --- |
| **اسم المسار** | إدخال صنف جديد للمخزن (Inventory Intake) |
| **الطريقة (Method)** | `POST` |
| **الرابط (URL)** | `http://localhost:3000/medicines/add` |
| **المدخلات (Body)** | `NAME`, `MANUFACTURE`, `QUANTITY`, `EXPIRYDATE`, `IDS`, `PRICE`. |
| **الوصف المنطقي** | إدراج سجل جديد مع تحويل التاريخ باستخدام `TO_DATE` وتفعيل `autoCommit` لضمان الحفظ الفوري. |
| **الرد الناجح** | `201 Created` مع تأكيد عدد الصفوف المتأثرة. |
### Method: POST
>```
>http://localhost:3000/medicines/add
>```
### Body (**raw**)

```json
{
    "NAME": "Sulfamethoxazole",
    "MANUFACTURE": "Roche",
    "QUANTITY": 15,
    "EXPIRYDATE": "2026-12-31",
    "IDS": 102,
    "PRICE": 11.0
}
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: DELETE MEDICINE
| الخاصية | التفاصيل |
| --- | --- |
| **اسم المسار** | شطب سجل دواء (Permanent Removal) |
| **الطريقة (Method)** | `DELETE` |
| **الرابط (URL)** | `http://localhost:3000/medicine/delete/:name` |
| **الوصف المنطقي** | حذف الصنف نهائياً من قاعدة البيانات باستخدام الاسم كمعرف فريد. |
| **الرد الناجح** | `200 OK` مع تأكيد عملية الحذف. |
| **الرد الفاشل** | `404 Not Found` إذا لم يجد النظام دواءً بهذا الاسم لحذفه. |
### Method: DELETE
>```
>http://localhost:3000/medicines/delete/
>```

⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: UPDATE MEDICINE
| الخاصية | التفاصيل |
| --- | --- |
| **اسم المسار** | تعديل بيانات دواء موجود (Modify Medicine) |
| **الطريقة (Method)** | `PUT` |
| **الرابط (URL)** | `http://localhost:3000/medicines/update/:name` |
| **المدخلات (Body)** | الحقول المراد تعديلها (الكمية، السعر، الشركة، التاريخ). |
| **الوصف المنطقي** | يقوم بتحديث السجل بناءً على الاسم؛ ويستخدم `rowsAffected` للتأكد من نجاح التعديل. |
| **الرد الناجح** | `200 OK` مع رسالة تأكيد النجاح. |
| **الرد الفاشل** | `404 Not Found` في حال كان اسم الدواء غير مسجل مسبقاً. |
### Method: PUT
>```
>http://localhost:3000/medicines/update/Amoxicillin
>```
### Body (**raw**)

```json
{
    "MANUFACTURE": "Global Pharma",
    "QUANTITY": 2,
    "EXPIRYDATE": "2027-11-10",
    "PRICE": 15.5
}
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃
_________________________________________________
Powered By: [postman-to-markdown](https://github.com/bautistaj/postman-to-markdown/)
</div>
