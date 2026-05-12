<div dir="rtl">
# Project: SALES PERSON

## End-point: GET EMPLOYEES
| الخاصية | التفاصيل |
| --- | --- |
| **اسم المسار** | استعراض كافة موظفي المبيعات |
| **الطريقة (Method)** | `GET` |
| **الرابط (URL)** | `http://localhost:3000/sales/employees` |
| **الوصف المنطقي** | جلب كافة السجلات من جدول `SALESPERSON` لعرض طاقم العمل. |
| **الرد الناجح** | `200 OK` مع مصفوفة تحتوي على بيانات جميع الموظفين. |
### Method: GET
>```
>http://localhost:3000/sales/employees
>```

⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: GET EMP BY ID
| الخاصية | التفاصيل |
| --- | --- |
| **اسم المسار** | البحث عن موظف مبيعات محدد |
| **الطريقة (Method)** | `GET` |
| **الرابط (URL)** | `http://localhost:3000/sales/emoloyee/:id_salesPerson` |
| **الوصف المنطقي** | استرجاع بيانات الموظف بناءً على معرفه الرقمي الفريد `ID_SP`. |
| **الرد الفاشل** | `404 Not Found` في حال كان الموظف غير مسجل في النظام. |
### Method: GET
>```
>http://localhost:3000/sales/emoloyee/2
>```

⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: Post Employee
| الخاصية | التفاصيل |
| --- | --- |
| **اسم المسار** | تسجيل موظف مبيعات جديد |
| **الطريقة (Method)** | `POST` |
| **الرابط (URL)** | `http://localhost:3000/sales/add-employee` |
| **المنطق البرمجي** | يقوم النظام بالتحقق أولاً من وجود الصيدلية (`ID_P`) قبل ربط الموظف الجديد بها لضمان تكامل البيانات. |
| **الرد الناجح** | `200 OK` مع رسالة تأكيد إضافة الموظف بنجاح 🟢. |
### Method: POST
>```
>http://localhost:3000/sales/add-employee
>```
### Body (**raw**)

```json
{
        "NAME": "Mouad",
        "LANAME": "Bouanai",
        "ID_P": 3
    
}
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: Update Pharmacy
| الخاصية | التفاصيل |
| --- | --- |
| **اسم المسار** | تعديل الملف الشخصي للموظف |
| **الطريقة (Method)** | `PUT` |
| **الرابط (URL)** | `http://localhost:3000/sales/employee/upadate/:id_salesPerson` |
| **المدخلات (Body)** | `NAME`, `LANAME`, `ID_P`. |
| **الوصف المنطقي** | تحديث بيانات الموظف بعد التأكد من وجوده في النظام باستخدام معرفه الخاص. |
### Method: PUT
>```
>http://localhost:3000/sales/employee/upadate/20
>```
### Body (**raw**)

```json
{
    "NAME": "Mouad",
    "LANAME": "Bouanaiii"
}
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: UPDATE PHARMACY
| الخاصية | التفاصيل |
| --- | --- |
| **اسم المسار** | تنفيذ وصرف الوصفة الطبية (Fulfillment) |
| **الطريقة (Method)** | `PUT` |
| **الرابط (URL)** | `http://localhost:3000/sales/deliver/:id_prescription/:id_salesPerson` |
| **المنطق البرمجي** | يقوم الموظف بإدخال رقم الوصفة ليتم: 1. التأكد أنها لم تُصرف مسبقاً. 2. تغيير حالتها إلى `DELIVERED`. 3. توقيع العملية باسم الموظف. 4. خصم الكمية من المخزن. |
| **الأمان (Transactions)** | يستخدم نظام الـ `Commit/Rollback`؛ فإذا فشل تحديث المخزن، يتم إلغاء توقيع الوصفة تلقائياً لضمان سلامة البيانات. |
| **التتبع (Traceability)** | يسمح للمدير بتتبع أي خطأ (جرعة خاطئة، دواء منتهي) ومعرفة الموظف المسؤول بدقة. |
### Method: PUT
>```
>http://localhost:3000/sales/deliver/21/2
>```

⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃
_________________________________________________
Powered By: [postman-to-markdown](https://github.com/bautistaj/postman-to-markdown/)
</div>
