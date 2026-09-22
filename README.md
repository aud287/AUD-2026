# CLASS OF 2026 — موقع التخرج (GitHub Pages)

## 1) الرفع على GitHub
1. أنشئ Repository جديد على GitHub (Public).
2. ارفع كل محتويات هذا المجلد كما هي (يجب أن يكون `index.html` في الجذر).
3. Settings ← Pages ← Source: **Deploy from a branch** ← Branch: **main** / (root) ← Save.
4. بعد دقيقة يظهر الرابط: `https://USERNAME.github.io/REPO/`

## 2) التعديل (كل شيء في ملف واحد: `js/config.js`)
- **اللوجو:** ضع الصورة في `assets/` واكتب مسارها في `logo`.
- **الموسيقى:** ضع ملف `assets/audio/music.mp3` (تعمل مع الافتتاحية، وإن منعها المتصفح تبدأ بأول ضغطة).
- **صورك على البورد:** ضعها في `assets/photos/` واكتب سطرًا لكل صورة في `photos`.
- **الأيقونات:** أسماء ملفات `assets/icons` (بدون .png) أو أي إيموجي.
- **الافتتاحية:** كل سطر في `intro` جملة تظهر بالترتيب.
- الأحداث، الاستطلاعات، السنين، الأرقام، السوشيال: كلها نصوص في نفس الملف.

## 3) الباك إند (الرسائل وصور الزوار تظهر فورًا + حذف من الأدمن)
1. أنشئ Google Sheet جديد ← Extensions ← Apps Script، والصق `backend/Code.gs`.
2. غيّر `ADMIN_KEY` لكلمة سر، ثم شغّل الدالة `setup` مرة واحدة واسمح بالصلاحيات.
3. Deploy ← New deployment ← Web app ← Execute as: **Me** ← Who has access: **Anyone**.
4. انسخ الرابط (ينتهي بـ /exec) والصقه في `backend` داخل `js/config.js`.
5. للحذف: افتح `موقعك/#admin` وأدخل `ADMIN_KEY`، فتظهر علامة ✕ على كل رسالة وصورة.
* بعد أي تعديل على Code.gs: Deploy ← Manage deployments ← Edit ← New version.

الأيقونات ثلاثية الأبعاد: Microsoft Fluent Emoji (MIT License).
