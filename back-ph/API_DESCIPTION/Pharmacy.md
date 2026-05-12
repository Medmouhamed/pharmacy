<div dir="rtl">
# Project: Pharmacy

## End-point: Phrmacy Logs
| الخاصية | التفاصيل |
| --- | --- |
| **اسم المسار** | سجلات التسليم اللوجستية (Traceability Logs) |
| **الطريقة (Method)** | `GET` |
| **الرابط (URL)** | `http://localhost:3000/pharmacy/delivery-logs` |
| **الوصف المنطقي** | استعلام معقد يربط جداول (Prescription, Salesperson, Pharmacy) لتتبع مسار الوصفة. |
| **الهدف التقني** | توفير تقرير يوضح: رقم الوصفة، اسم الموظف المسؤول، اسم الصيدلية، وموقع التسليم بدقة. |
| **أهمية المسار** | يحقق مطلب "Traceability" لضمان الرقابة الكاملة على صرف الأدوية في النظام. |
### Method: GET
>```
>http://localhost:3000/pharmacy/delivery-logs
>```

⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: GET PHARMACY
| الخاصية | التفاصيل |
| --- | --- |
| **اسم المسار** | استعراض قائمة فروع الصيدليات |
| **الطريقة (Method)** | `GET` |
| **الرابط (URL)** | `http://localhost:3000/pharmacy/details` |
| **الوصف المنطقي** | جلب كافة السجلات من جدول `PHARMACY` لعرض معلومات المواقع والعناوين. |
| **الرد الناجح** | `200 OK` مع مصفوفة JSON تحتوي على بيانات جميع الفروع المتاحة. |
### Method: GET
>```
>http://localhost:3000/pharmacy/details
>```

⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃
_________________________________________________
Powered By: [postman-to-markdown](https://github.com/bautistaj/postman-to-markdown/)
</div>
