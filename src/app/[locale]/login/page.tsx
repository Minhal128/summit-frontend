"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import { loginByUid, linkCard } from "@/lib/nfcApi";
import { useNfcReader } from "@/contexts/NfcReaderContext";

// --- HELPER & SIMULATED SHADCN/UI COMPONENTS ---
const cn = (...classes: (string | undefined | null | false)[]): string =>
  classes.filter(Boolean).join(" ");

const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    className={cn(
      "flex h-12 w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-sm text-gray-200 placeholder:text-gray-500",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
      className,
    )}
    ref={ref}
    {...props}
  />
));
Input.displayName = "Input";

// --- SVG ICONS ---
const EyeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);

const EyeSlashIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.243 4.243L6.228 6.228"
    />
  </svg>
);

// --- MAIN LOGIN PAGE COMPONENT ---
export default function LoginPage() {
  const locale = useLocale();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginMethod, setLoginMethod] = useState<"email" | "phone">("email");
  const [phone, setPhone] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const router = useRouter();
  const { status: readerStatus, isSupported: hasWebHid, isConnected: readerConnected, connectReader, onCardDetected, onLoginResult, keyboardListening, mode } = useNfcReader();

  // NFC Login State
  const [nfcStep, setNfcStep] = useState<"idle" | "connecting" | "waiting" | "verifying" | "success" | "error" | "unregistered">("idle");
  const [nfcError, setNfcError] = useState("");
  const [detectedUid, setDetectedUid] = useState<string | null>(null);
  const [linkEmail, setLinkEmail] = useState("");
  const [linkPassword, setLinkPassword] = useState("");
  const [isLinking, setIsLinking] = useState(false);

  const copyByLocale = {
    en: {
      title: 'Login to your account',
      noAccount: "Don't have an account?",
      signUp: 'Sign up',
      nfcQuickLogin: 'NFC Quick Login',
      readerReady: 'Reader ready — tap your card to login instantly',
      readerConnectedText: 'Reader connected — tap your card to login instantly',
      tapNoPassword: 'Tap your card — no password needed',
      nfcActiveTap: 'NFC reader active — tap your card anytime to login',
      tapNow: 'Tap Your NFC Card Now',
      connectReaderLogin: 'Connect NFC Reader & Login',
      webhidNotSupported: 'WebHID not supported — use Chrome or Edge browser',
      connecting: 'Connecting to NFC reader...',
      selectReaderPopup: 'Select your reader in the browser popup',
      waitingTap: 'Tap your NFC card on the reader...',
      waitingReady: 'Reader is ready — waiting for card',
      waitingKeyboard: 'Keyboard capture active — just tap your card',
      cancel: 'Cancel',
      cardDetectedVerifying: 'Card detected! Verifying...',
      loginSuccessful: 'Login Successful!',
      redirecting: 'Redirecting to dashboard...',
      cardNotLinked: 'Card Not Linked Yet',
      cardNotLinkedHelp: 'Enter your account credentials to link this card for instant login.',
      emailAddress: 'Email address',
      password: 'Password',
      linking: 'Linking...',
      linkCardLogin: 'Link Card & Login',
      cancelTryAnother: 'Cancel / Try Another Card',
      tryAgain: 'Try Again',
      orPassword: 'Or login with password',
      email: 'Email',
      phone: 'Phone',
      enterEmail: 'Enter your email address',
      enterPhone: 'Enter phone number',
      enterPassword: 'Enter your password',
      loggingIn: 'Logging in...',
      login: 'Login',
      forgotPassword: 'Forgot your password?',
      toastEmailRequired: 'Email is required',
      toastEmailInvalid: 'Please enter a valid email address',
      toastPhoneInvalid: 'Please enter a valid phone number',
      toastPasswordRequired: 'Password is required',
      toastPasswordLength: 'Password must be at least 8 characters long',
      toastLoginSuccess: 'Login successful! Redirecting...'
    },
    de: {
      title: 'In dein Konto einloggen', noAccount: 'Noch kein Konto?', signUp: 'Registrieren', nfcQuickLogin: 'NFC Schnell-Login',
      readerReady: 'Leser bereit — Karte antippen zum sofortigen Login', readerConnectedText: 'Leser verbunden — Karte antippen zum Login', tapNoPassword: 'Karte antippen — kein Passwort nötig',
      nfcActiveTap: 'NFC-Leser aktiv — Karte jederzeit antippen', tapNow: 'NFC-Karte jetzt antippen', connectReaderLogin: 'NFC-Leser verbinden & einloggen',
      webhidNotSupported: 'WebHID nicht unterstützt — Chrome oder Edge verwenden', connecting: 'Verbinde mit NFC-Leser...', selectReaderPopup: 'Wähle den Leser im Browser-Popup',
      waitingTap: 'NFC-Karte auf den Leser legen...', waitingReady: 'Leser bereit — warte auf Karte', waitingKeyboard: 'Tastatur-Erfassung aktiv — Karte antippen',
      cancel: 'Abbrechen', cardDetectedVerifying: 'Karte erkannt! Wird geprüft...', loginSuccessful: 'Login erfolgreich!', redirecting: 'Weiterleitung zum Dashboard...',
      cardNotLinked: 'Karte noch nicht verknüpft', cardNotLinkedHelp: 'Kontodaten eingeben, um diese Karte zu verknüpfen.', emailAddress: 'E-Mail-Adresse', password: 'Passwort',
      linking: 'Verknüpfen...', linkCardLogin: 'Karte verknüpfen & einloggen', cancelTryAnother: 'Abbrechen / andere Karte', tryAgain: 'Erneut versuchen',
      orPassword: 'Oder mit Passwort einloggen', email: 'E-Mail', phone: 'Telefon', enterEmail: 'E-Mail-Adresse eingeben', enterPhone: 'Telefonnummer eingeben',
      enterPassword: 'Passwort eingeben', loggingIn: 'Anmeldung läuft...', login: 'Einloggen', forgotPassword: 'Passwort vergessen?',
      toastEmailRequired: 'E-Mail ist erforderlich', toastEmailInvalid: 'Bitte gib eine gültige E-Mail ein', toastPhoneInvalid: 'Bitte gib eine gültige Telefonnummer ein',
      toastPasswordRequired: 'Passwort ist erforderlich', toastPasswordLength: 'Passwort muss mindestens 8 Zeichen lang sein', toastLoginSuccess: 'Login erfolgreich! Weiterleitung...'
    },
    zh: { title: '登录您的账户', noAccount: '还没有账户？', signUp: '注册', nfcQuickLogin: 'NFC 快速登录', readerReady: '读卡器已就绪 — 轻触卡片即可登录', readerConnectedText: '读卡器已连接 — 轻触卡片即可登录', tapNoPassword: '轻触卡片 — 无需密码', nfcActiveTap: 'NFC 读卡器已激活 — 可随时轻触登录', tapNow: '立即轻触 NFC 卡', connectReaderLogin: '连接 NFC 读卡器并登录', webhidNotSupported: '浏览器不支持 WebHID — 请使用 Chrome 或 Edge', connecting: '正在连接 NFC 读卡器...', selectReaderPopup: '请在浏览器弹窗中选择读卡器', waitingTap: '请将 NFC 卡贴近读卡器...', waitingReady: '读卡器已就绪，等待卡片', waitingKeyboard: '键盘采集已激活，直接轻触卡片', cancel: '取消', cardDetectedVerifying: '已检测到卡片，正在验证...', loginSuccessful: '登录成功！', redirecting: '正在跳转到仪表盘...', cardNotLinked: '该卡尚未绑定', cardNotLinkedHelp: '请输入账户凭据以绑定该卡并快速登录。', emailAddress: '邮箱地址', password: '密码', linking: '绑定中...', linkCardLogin: '绑定卡并登录', cancelTryAnother: '取消 / 更换卡片', tryAgain: '重试', orPassword: '或使用密码登录', email: '邮箱', phone: '手机', enterEmail: '请输入邮箱地址', enterPhone: '请输入手机号', enterPassword: '请输入密码', loggingIn: '登录中...', login: '登录', forgotPassword: '忘记密码？', toastEmailRequired: '邮箱为必填项', toastEmailInvalid: '请输入有效邮箱地址', toastPhoneInvalid: '请输入有效手机号', toastPasswordRequired: '密码为必填项', toastPasswordLength: '密码至少需要 8 位', toastLoginSuccess: '登录成功，正在跳转...' },
    ar: { title: 'تسجيل الدخول إلى حسابك', noAccount: 'ليس لديك حساب؟', signUp: 'إنشاء حساب', nfcQuickLogin: 'تسجيل دخول NFC سريع', readerReady: 'القارئ جاهز — المس البطاقة لتسجيل الدخول فورًا', readerConnectedText: 'القارئ متصل — المس البطاقة لتسجيل الدخول', tapNoPassword: 'المس البطاقة — بدون كلمة مرور', nfcActiveTap: 'قارئ NFC نشط — المس البطاقة في أي وقت', tapNow: 'المس بطاقة NFC الآن', connectReaderLogin: 'اتصل بقارئ NFC وسجّل الدخول', webhidNotSupported: 'WebHID غير مدعوم — استخدم Chrome أو Edge', connecting: 'جارٍ الاتصال بقارئ NFC...', selectReaderPopup: 'اختر القارئ من نافذة المتصفح', waitingTap: 'المس بطاقة NFC على القارئ...', waitingReady: 'القارئ جاهز — بانتظار البطاقة', waitingKeyboard: 'التقاط لوحة المفاتيح نشط — المس البطاقة', cancel: 'إلغاء', cardDetectedVerifying: 'تم اكتشاف البطاقة! جارٍ التحقق...', loginSuccessful: 'تم تسجيل الدخول بنجاح!', redirecting: 'جارٍ التحويل إلى لوحة التحكم...', cardNotLinked: 'البطاقة غير مرتبطة بعد', cardNotLinkedHelp: 'أدخل بيانات حسابك لربط هذه البطاقة وتسجيل الدخول الفوري.', emailAddress: 'البريد الإلكتروني', password: 'كلمة المرور', linking: 'جارٍ الربط...', linkCardLogin: 'ربط البطاقة وتسجيل الدخول', cancelTryAnother: 'إلغاء / جرب بطاقة أخرى', tryAgain: 'حاول مرة أخرى', orPassword: 'أو سجّل بكلمة المرور', email: 'البريد الإلكتروني', phone: 'الهاتف', enterEmail: 'أدخل بريدك الإلكتروني', enterPhone: 'أدخل رقم الهاتف', enterPassword: 'أدخل كلمة المرور', loggingIn: 'جارٍ تسجيل الدخول...', login: 'تسجيل الدخول', forgotPassword: 'هل نسيت كلمة المرور؟', toastEmailRequired: 'البريد الإلكتروني مطلوب', toastEmailInvalid: 'يرجى إدخال بريد إلكتروني صحيح', toastPhoneInvalid: 'يرجى إدخال رقم هاتف صحيح', toastPasswordRequired: 'كلمة المرور مطلوبة', toastPasswordLength: 'يجب أن تكون كلمة المرور 8 أحرف على الأقل', toastLoginSuccess: 'تم تسجيل الدخول! جارٍ التحويل...' },
    ru: { title: 'Вход в аккаунт', noAccount: 'Нет аккаунта?', signUp: 'Регистрация', nfcQuickLogin: 'Быстрый вход по NFC', readerReady: 'Считыватель готов — приложите карту для входа', readerConnectedText: 'Считыватель подключен — приложите карту', tapNoPassword: 'Приложите карту — пароль не нужен', nfcActiveTap: 'NFC активен — приложите карту в любое время', tapNow: 'Приложите NFC-карту сейчас', connectReaderLogin: 'Подключить NFC и войти', webhidNotSupported: 'WebHID не поддерживается — используйте Chrome или Edge', connecting: 'Подключение к NFC считывателю...', selectReaderPopup: 'Выберите считыватель во всплывающем окне', waitingTap: 'Приложите NFC-карту к считывателю...', waitingReady: 'Считыватель готов — ожидается карта', waitingKeyboard: 'Режим клавиатуры активен — приложите карту', cancel: 'Отмена', cardDetectedVerifying: 'Карта обнаружена! Проверяем...', loginSuccessful: 'Вход выполнен!', redirecting: 'Переход в дашборд...', cardNotLinked: 'Карта еще не привязана', cardNotLinkedHelp: 'Введите данные аккаунта, чтобы привязать карту для быстрого входа.', emailAddress: 'Email', password: 'Пароль', linking: 'Привязка...', linkCardLogin: 'Привязать карту и войти', cancelTryAnother: 'Отмена / другая карта', tryAgain: 'Повторить', orPassword: 'Или войти по паролю', email: 'Email', phone: 'Телефон', enterEmail: 'Введите email', enterPhone: 'Введите номер телефона', enterPassword: 'Введите пароль', loggingIn: 'Вход...', login: 'Войти', forgotPassword: 'Забыли пароль?', toastEmailRequired: 'Email обязателен', toastEmailInvalid: 'Введите корректный email', toastPhoneInvalid: 'Введите корректный номер телефона', toastPasswordRequired: 'Пароль обязателен', toastPasswordLength: 'Пароль должен быть не менее 8 символов', toastLoginSuccess: 'Вход выполнен! Переходим...' },
    th: { title: 'เข้าสู่ระบบบัญชีของคุณ', noAccount: 'ยังไม่มีบัญชี?', signUp: 'สมัครสมาชิก', nfcQuickLogin: 'เข้าสู่ระบบด่วนด้วย NFC', readerReady: 'เครื่องอ่านพร้อมแล้ว — แตะการ์ดเพื่อเข้าสู่ระบบทันที', readerConnectedText: 'เชื่อมต่อเครื่องอ่านแล้ว — แตะการ์ดเพื่อเข้าสู่ระบบ', tapNoPassword: 'แตะการ์ด — ไม่ต้องใช้รหัสผ่าน', nfcActiveTap: 'NFC พร้อมใช้งาน — แตะการ์ดได้ทุกเวลา', tapNow: 'แตะการ์ด NFC ตอนนี้', connectReaderLogin: 'เชื่อมต่อเครื่องอ่าน NFC และเข้าสู่ระบบ', webhidNotSupported: 'เบราว์เซอร์ไม่รองรับ WebHID — ใช้ Chrome หรือ Edge', connecting: 'กำลังเชื่อมต่อเครื่องอ่าน NFC...', selectReaderPopup: 'เลือกเครื่องอ่านจากหน้าต่างป๊อปอัป', waitingTap: 'แตะการ์ด NFC ที่เครื่องอ่าน...', waitingReady: 'เครื่องอ่านพร้อม — รอการ์ด', waitingKeyboard: 'โหมดคีย์บอร์ดทำงานอยู่ — แตะการ์ดได้เลย', cancel: 'ยกเลิก', cardDetectedVerifying: 'ตรวจพบการ์ด กำลังตรวจสอบ...', loginSuccessful: 'เข้าสู่ระบบสำเร็จ!', redirecting: 'กำลังไปหน้าแดชบอร์ด...', cardNotLinked: 'การ์ดยังไม่ถูกผูกบัญชี', cardNotLinkedHelp: 'กรอกข้อมูลบัญชีเพื่อผูกการ์ดและเข้าสู่ระบบทันที', emailAddress: 'อีเมล', password: 'รหัสผ่าน', linking: 'กำลังผูก...', linkCardLogin: 'ผูกการ์ดและเข้าสู่ระบบ', cancelTryAnother: 'ยกเลิก / ลองการ์ดใบอื่น', tryAgain: 'ลองอีกครั้ง', orPassword: 'หรือเข้าสู่ระบบด้วยรหัสผ่าน', email: 'อีเมล', phone: 'โทรศัพท์', enterEmail: 'กรอกอีเมลของคุณ', enterPhone: 'กรอกหมายเลขโทรศัพท์', enterPassword: 'กรอกรหัสผ่าน', loggingIn: 'กำลังเข้าสู่ระบบ...', login: 'เข้าสู่ระบบ', forgotPassword: 'ลืมรหัสผ่าน?', toastEmailRequired: 'ต้องกรอกอีเมล', toastEmailInvalid: 'กรุณากรอกอีเมลที่ถูกต้อง', toastPhoneInvalid: 'กรุณากรอกหมายเลขโทรศัพท์ที่ถูกต้อง', toastPasswordRequired: 'ต้องกรอกรหัสผ่าน', toastPasswordLength: 'รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร', toastLoginSuccess: 'เข้าสู่ระบบสำเร็จ กำลังเปลี่ยนหน้า...' },
    es: { title: 'Inicia sesión en tu cuenta', noAccount: '¿No tienes una cuenta?', signUp: 'Regístrate', nfcQuickLogin: 'Inicio rápido con NFC', readerReady: 'Lector listo — toca tu tarjeta para iniciar sesión', readerConnectedText: 'Lector conectado — toca tu tarjeta para iniciar sesión', tapNoPassword: 'Toca tu tarjeta — sin contraseña', nfcActiveTap: 'Lector NFC activo — toca tu tarjeta cuando quieras', tapNow: 'Toca tu tarjeta NFC ahora', connectReaderLogin: 'Conectar lector NFC e iniciar sesión', webhidNotSupported: 'WebHID no compatible — usa Chrome o Edge', connecting: 'Conectando al lector NFC...', selectReaderPopup: 'Selecciona tu lector en la ventana del navegador', waitingTap: 'Toca tu tarjeta NFC en el lector...', waitingReady: 'Lector listo — esperando tarjeta', waitingKeyboard: 'Captura por teclado activa — toca tu tarjeta', cancel: 'Cancelar', cardDetectedVerifying: '¡Tarjeta detectada! Verificando...', loginSuccessful: '¡Inicio de sesión exitoso!', redirecting: 'Redirigiendo al dashboard...', cardNotLinked: 'Tarjeta aún no vinculada', cardNotLinkedHelp: 'Ingresa tus credenciales para vincular esta tarjeta e iniciar sesión al instante.', emailAddress: 'Correo electrónico', password: 'Contraseña', linking: 'Vinculando...', linkCardLogin: 'Vincular tarjeta e iniciar sesión', cancelTryAnother: 'Cancelar / Probar otra tarjeta', tryAgain: 'Intentar de nuevo', orPassword: 'O inicia sesión con contraseña', email: 'Correo', phone: 'Teléfono', enterEmail: 'Ingresa tu correo electrónico', enterPhone: 'Ingresa tu número de teléfono', enterPassword: 'Ingresa tu contraseña', loggingIn: 'Iniciando sesión...', login: 'Iniciar sesión', forgotPassword: '¿Olvidaste tu contraseña?', toastEmailRequired: 'El correo es obligatorio', toastEmailInvalid: 'Ingresa un correo válido', toastPhoneInvalid: 'Ingresa un número de teléfono válido', toastPasswordRequired: 'La contraseña es obligatoria', toastPasswordLength: 'La contraseña debe tener al menos 8 caracteres', toastLoginSuccess: '¡Inicio de sesión exitoso! Redirigiendo...' },
    fr: { title: 'Connectez-vous à votre compte', noAccount: 'Vous n’avez pas de compte ?', signUp: 'Inscription', nfcQuickLogin: 'Connexion NFC rapide', readerReady: 'Lecteur prêt — approchez votre carte pour vous connecter', readerConnectedText: 'Lecteur connecté — approchez votre carte', tapNoPassword: 'Approchez votre carte — sans mot de passe', nfcActiveTap: 'Lecteur NFC actif — approchez la carte à tout moment', tapNow: 'Approchez votre carte NFC maintenant', connectReaderLogin: 'Connecter le lecteur NFC et se connecter', webhidNotSupported: 'WebHID non pris en charge — utilisez Chrome ou Edge', connecting: 'Connexion au lecteur NFC...', selectReaderPopup: 'Sélectionnez votre lecteur dans la fenêtre du navigateur', waitingTap: 'Approchez votre carte NFC du lecteur...', waitingReady: 'Lecteur prêt — en attente de carte', waitingKeyboard: 'Capture clavier active — approchez la carte', cancel: 'Annuler', cardDetectedVerifying: 'Carte détectée ! Vérification...', loginSuccessful: 'Connexion réussie !', redirecting: 'Redirection vers le dashboard...', cardNotLinked: 'Carte non liée', cardNotLinkedHelp: 'Entrez vos identifiants pour lier cette carte et vous connecter instantanément.', emailAddress: 'Adresse e-mail', password: 'Mot de passe', linking: 'Association...', linkCardLogin: 'Lier la carte et se connecter', cancelTryAnother: 'Annuler / Essayer une autre carte', tryAgain: 'Réessayer', orPassword: 'Ou connectez-vous avec mot de passe', email: 'E-mail', phone: 'Téléphone', enterEmail: 'Entrez votre e-mail', enterPhone: 'Entrez votre numéro de téléphone', enterPassword: 'Entrez votre mot de passe', loggingIn: 'Connexion...', login: 'Connexion', forgotPassword: 'Mot de passe oublié ?', toastEmailRequired: 'E-mail requis', toastEmailInvalid: 'Veuillez entrer un e-mail valide', toastPhoneInvalid: 'Veuillez entrer un numéro valide', toastPasswordRequired: 'Mot de passe requis', toastPasswordLength: 'Le mot de passe doit contenir au moins 8 caractères', toastLoginSuccess: 'Connexion réussie ! Redirection...' }
  } as const;

  const text = copyByLocale[locale as keyof typeof copyByLocale] ?? copyByLocale.en;
  const nfcStepRef = useRef(nfcStep);
  nfcStepRef.current = nfcStep;

  // Auto-login when bridge sends login_result (bridge called the API for us)
  useEffect(() => {
    const unsub = onLoginResult((result) => {
      setDetectedUid(result.uid);

      if (result.success && result.token) {
        setNfcStep("success");
        toast.success(text.toastLoginSuccess);
        setTimeout(() => router.push(locale === 'en' ? "/dashboard" : `/${locale}/dashboard`), 800);
      } else if (result.unregistered) {
        setNfcStep("unregistered");
        setNfcError(text.cardNotLinkedHelp);
      } else {
        setNfcStep("error");
        setNfcError(result.message || "Authentication failed");
        toast.error(result.message || "Authentication failed");
      }
    });
    return unsub;
  }, [onLoginResult, router]);

  // Fallback: Auto-login when card is tapped while in "waiting" state
  // (used when bridge auto-login is disabled or unavailable)
  useEffect(() => {
    const unsub = onCardDetected(async (card) => {
      // Process if we're actively waiting OR if keyboard mode is always listening
      if (nfcStepRef.current !== "waiting" && nfcStepRef.current !== "idle") return;

      setDetectedUid(card.uid);
      setNfcStep("verifying");
      setNfcError("");

      try {
        const response = await loginByUid(card.uid);
        if (response.success) {
          setNfcStep("success");
          toast.success("NFC login successful! Redirecting...");
          setTimeout(() => router.push("/dashboard"), 800);
        } else {
          throw new Error(response.message || "Login failed");
        }
      } catch (err: any) {
        // Check if card is unregistered
        if (err?.data?.unregistered || err?.message?.includes("not registered")) {
          setNfcStep("unregistered");
          setNfcError(text.cardNotLinkedHelp);
        } else {
          setNfcStep("error");
          setNfcError(err?.message || "Authentication failed");
          toast.error(err?.message || "Authentication failed");
        }
      }
    });
    return unsub;
  }, [onCardDetected, router]);

  useEffect(() => {
    // If already logged in, redirect to dashboard
    const token = localStorage.getItem("auth_token") || localStorage.getItem("nfc_token");
    if (token) {
      router.push(locale === 'en' ? "/dashboard" : `/${locale}/dashboard`);
    }
  }, [router, locale]);

  // --- NFC TAP LOGIN: Connect reader and wait for card ---
  const handleNfcTapLogin = useCallback(async () => {
    setNfcError("");
    // If keyboard capture is active, we're already listening — just switch to waiting state
    if (keyboardListening) {
      setNfcStep("waiting");
      return;
    }
    if (readerConnected) {
      setNfcStep("waiting");
      return;
    }
    setNfcStep("connecting");
    const ok = await connectReader();
    if (ok) {
      setNfcStep("waiting");
    } else {
      if (readerStatus === 'error') {
        setNfcStep("error");
        setNfcError("Could not connect to NFC reader. Make sure it's plugged in and close any NFC software (like CYB_NfcTool).");
      } else {
        setNfcStep("idle");
      }
    }
  }, [readerConnected, readerStatus, connectReader, keyboardListening]);

  const resetNfcLogin = () => {
    setNfcStep("idle");
    setNfcError("");
    setDetectedUid(null);
    setLinkEmail("");
    setLinkPassword("");
  };

  // Link an unregistered card to user's account
  const handleLinkCard = async () => {
    if (!detectedUid) return;
    if (!linkEmail || !linkPassword) {
      toast.error(text.cardNotLinkedHelp);
      return;
    }
    setIsLinking(true);
    try {
      const res = await linkCard({
        identifier: linkEmail,
        password: linkPassword,
        cardUid: detectedUid,
      });
      if (res.success) {
        setNfcStep("success");
        toast.success("Card linked & logged in!");
        setTimeout(() => router.push(locale === 'en' ? "/dashboard" : `/${locale}/dashboard`), 800);
      } else {
        throw new Error(res.message || "Failed to link card");
      }
    } catch (err: any) {
      toast.error(err?.message || "Failed to link card. Check your credentials.");
    } finally {
      setIsLinking(false);
    }
  };

  // Form validation
  const validateForm = () => {
    if (loginMethod === "email") {
      if (!formData.email) {
        toast.error(text.toastEmailRequired);
        return false;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        toast.error(text.toastEmailInvalid);
        return false;
      }
    } else if (loginMethod === "phone") {
      if (!phone || phone.length < 8) {
        toast.error(text.toastPhoneInvalid);
        return false;
      }
    }

    if (!formData.password) {
      toast.error(text.toastPasswordRequired);
      return false;
    }
    if (formData.password.length < 8) {
      toast.error(text.toastPasswordLength);
      return false;
    }

    return true;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const { apiFetch } = await import('@/lib/api');
      const identifier = loginMethod === "email" ? formData.email : phone;
      const data: any = await apiFetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password: formData.password }),
      });

      if (data.token) {
        try {
          localStorage.setItem("auth_token", data.token);
        } catch (e) {}
      }

      toast.success(data.message || text.toastLoginSuccess);
      // Redirect to the local dashboard route
      setTimeout(() => {
        router.push(locale === 'en' ? "/dashboard" : `/${locale}/dashboard`);
      }, 800);
    } catch (err: any) {
      console.error("Login api error:", err);
      toast.error(
        err?.message ||
          err?.text ||
          "Login failed. Please check your credentials and try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    router.push(locale === 'en' ? "/forgot-password" : `/${locale}/forgot-password`);
  };

  return (
    <div
      className="relative min-h-screen w-full text-gray-200 flex flex-col"
      style={{
        fontFamily: "Inter, sans-serif",
        background: "#0A1A2F",
      }}
    >
      {/* Corner glow effects */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
        <div
          style={{
            position: "absolute",
            top: -80,
            left: -80,
            width: 220,
            height: 220,
            background:
              "radial-gradient(closest-side, rgba(69,79,187,0.35) 0%, rgba(69,79,187,0.18) 45%, rgba(69,79,187,0.0) 70%)",
            filter: "blur(18px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: -140,
            left: -140,
            width: 540,
            height: 540,
            background:
              "radial-gradient(closest-side, rgba(69,79,187,0.14), rgba(69,79,187,0))",
            filter: "blur(12px)",
          }}
        />
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

            /* Custom styles for react-international-phone */
            .react-international-phone-input-container {
              width: 100%;
            }

            .react-international-phone-input-container .react-international-phone-input {
              height: 48px !important;
              width: 100% !important;
              background-color: #1e293b !important;
              border: 1px solid #334155 !important;
              border-radius: 0 8px 8px 0 !important;
              color: #e2e8f0 !important;
              font-size: 14px !important;
            }

            .react-international-phone-input-container .react-international-phone-input:focus {
              outline: none !important;
              box-shadow: 0 0 0 2px #3b82f6 !important;
            }

            .react-international-phone-input-container .react-international-phone-input::placeholder {
              color: #64748b !important;
            }

            .react-international-phone-country-selector-button {
              height: 48px !important;
              background-color: #1e293b !important;
              border: 1px solid #334155 !important;
              border-radius: 8px 0 0 8px !important;
              border-right: none !important;
              padding: 0 12px !important;
            }

            .react-international-phone-country-selector-button:hover {
              background-color: #334155 !important;
            }

            .react-international-phone-country-selector-dropdown {
              background-color: #1e293b !important;
              border: 1px solid #334155 !important;
              border-radius: 8px !important;
              box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3) !important;
              max-height: 300px !important;
              z-index: 9999 !important;
            }

            .react-international-phone-country-selector-dropdown__list-item {
              padding: 10px 12px !important;
              color: #e2e8f0 !important;
            }

            .react-international-phone-country-selector-dropdown__list-item:hover {
              background-color: #334155 !important;
            }

            .react-international-phone-country-selector-dropdown__list-item--selected {
              background-color: #3b82f6 !important;
              color: white !important;
            }

            .react-international-phone-dial-code-preview {
              color: #e2e8f0 !important;
            }

            /* Mobile responsive styles */
            @media (max-width: 768px) {
              .mobile-container {
                margin: 0 16px;
              }
              .mobile-form {
                padding: 24px 16px !important;
              }
              .mobile-title {
                font-size: 24px !important;
                margin-left: 0 !important;
              }
              .mobile-subtitle {
                margin-left: 0 !important;
              }
              .mobile-input-container {
                margin-left: 0 !important;
              }
              .mobile-button {
                margin-left: 0 !important;
              }
            }
          `,
        }}
      />

      {/* Logo */}
      <div
        className="flex flex-col items-center justify-center"
        style={{ marginTop: "50px", marginBottom: "50px" }}
      >
        <img
          src="/logo.png"
          alt="Summit Exchange Logo"
          className="h-16 w-auto mb-4"
        />
      </div>

      {/* Main Content */}
      <main className="relative z-10 flex-grow flex items-center justify-center p-2 sm:p-6 py-8 sm:py-24">
        <div className="w-full max-w-3xl bg-[#10233D] backdrop-blur-md border border-slate-800 rounded-2xl shadow-2xl grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-10 overflow-hidden mb-16 mobile-container">
          {/* Form Section */}
          <div
            className="p-8 rounded-l-2xl mobile-form"
            style={{ marginTop: "30px" }}
          >
            <h1
              className="text-3xl font-bold text-white mb-2 mobile-title"
              style={{ marginLeft: "20px" }}
            >
              {text.title}
            </h1>
            <p
              className="text-gray-400 text-sm mb-8 mobile-subtitle"
              style={{ marginLeft: "20px" }}
            >
              {text.noAccount}{" "}
              <a
                href={locale === 'en' ? '/signup' : `/${locale}/signup`}
                className="font-medium text-blue-400 hover:underline"
              >
                {text.signUp}
              </a>
            </p>

            {/* ===== NFC QUICK LOGIN (PRIMARY METHOD) ===== */}
            <div
              className="mb-6 mobile-input-container"
              style={{ marginLeft: "15px", marginRight: "15px" }}
            >
              <div className="rounded-xl border border-emerald-500/30 bg-gradient-to-br from-emerald-900/20 to-blue-900/20 p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="5" width="20" height="14" rx="2" />
                      <line x1="2" y1="10" x2="22" y2="10" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-base">{text.nfcQuickLogin}</h3>
                    <p className="text-gray-400 text-xs">
                      {keyboardListening
                        ? text.readerReady
                        : readerConnected
                        ? text.readerConnectedText
                        : text.tapNoPassword}
                    </p>
                  </div>
                  {/* Reader status dot */}
                  <div className="ml-auto">
                    <div className={cn(
                      "w-3 h-3 rounded-full",
                      (readerConnected || keyboardListening) ? "bg-emerald-400 animate-pulse" : "bg-slate-600"
                    )} title={keyboardListening ? "Keyboard NFC capture active" : readerConnected ? "WebHID reader connected" : "Reader not connected"} />
                  </div>
                </div>

                {nfcStep === "idle" && (
                  <div className="space-y-3">
                    {keyboardListening && (
                      <p className="text-emerald-400/80 text-xs text-center animate-pulse">
                        {text.nfcActiveTap}
                      </p>
                    )}
                    <button
                      type="button"
                      onClick={handleNfcTapLogin}
                      className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold h-12 rounded-lg text-sm transition-colors shadow-lg shadow-emerald-600/20"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                        <path d="M3 6h18" />
                        <path d="M16 10a4 4 0 01-8 0" />
                      </svg>
                      {keyboardListening ? text.tapNow : readerConnected ? text.tapNow : text.connectReaderLogin}
                    </button>
                    {!hasWebHid && !keyboardListening && (
                      <p className="text-amber-400/80 text-xs text-center">
                        {text.webhidNotSupported}
                      </p>
                    )}
                  </div>
                )}

                {nfcStep === "connecting" && (
                  <div className="text-center py-4">
                    <div className="w-10 h-10 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-emerald-400 font-medium mt-3">{text.connecting}</p>
                    <p className="text-gray-500 text-xs mt-1">{text.selectReaderPopup}</p>
                  </div>
                )}

                {nfcStep === "waiting" && (
                  <div className="text-center py-4">
                    <div className="relative inline-block">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="animate-pulse">
                        <rect x="2" y="5" width="20" height="14" rx="2" />
                        <line x1="2" y1="10" x2="22" y2="10" />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-14 h-14 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
                      </div>
                    </div>
                    <p className="text-emerald-400 font-medium mt-3">{text.waitingTap}</p>
                    <p className="text-gray-500 text-xs mt-1">
                      {keyboardListening ? text.waitingKeyboard : text.waitingReady}
                    </p>
                    <button
                      type="button"
                      onClick={resetNfcLogin}
                      className="mt-3 px-4 py-1.5 bg-slate-700/50 hover:bg-slate-600 text-gray-400 rounded-lg text-xs transition-colors"
                    >
                      {text.cancel}
                    </button>
                  </div>
                )}

                {nfcStep === "verifying" && (
                  <div className="text-center py-4">
                    <div className="w-10 h-10 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-blue-400 font-medium mt-3">{text.cardDetectedVerifying}</p>
                    {detectedUid && (
                      <p className="text-gray-500 text-xs mt-1 font-mono">UID: {detectedUid}</p>
                    )}
                  </div>
                )}

                {nfcStep === "success" && (
                  <div className="text-center py-4">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                    <p className="text-emerald-400 font-semibold mt-3">{text.loginSuccessful}</p>
                    <p className="text-gray-500 text-xs mt-1">{text.redirecting}</p>
                  </div>
                )}

                {nfcStep === "unregistered" && (
                  <div className="text-center py-4">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    <p className="text-amber-400 font-medium mt-2">{text.cardNotLinked}</p>
                    <p className="text-gray-400 text-xs mt-1 mb-4">
                      {text.cardNotLinkedHelp}
                    </p>

                    {/* Inline link-card form */}
                    <div className="space-y-3 text-left max-w-xs mx-auto">
                      <Input
                        type="email"
                        placeholder={text.emailAddress}
                        value={linkEmail}
                        onChange={(e) => setLinkEmail(e.target.value)}
                        autoComplete="email"
                      />
                      <Input
                        type="password"
                        placeholder={text.password}
                        value={linkPassword}
                        onChange={(e) => setLinkPassword(e.target.value)}
                        autoComplete="current-password"
                        onKeyDown={(e) => { if (e.key === 'Enter') handleLinkCard(); }}
                      />
                      <button
                        type="button"
                        onClick={handleLinkCard}
                        disabled={isLinking}
                        className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 disabled:bg-amber-800 text-white font-medium rounded-lg text-sm transition-colors"
                      >
                        {isLinking ? text.linking : text.linkCardLogin}
                      </button>
                    </div>

                    {detectedUid && (
                      <p className="text-gray-600 text-xs mt-3 font-mono">Card: {detectedUid}</p>
                    )}
                    <button
                      type="button"
                      onClick={resetNfcLogin}
                      className="mt-3 px-4 py-1.5 text-gray-400 hover:text-gray-200 text-xs transition-colors"
                    >
                      {text.cancelTryAnother}
                    </button>
                  </div>
                )}

                {nfcStep === "error" && (
                  <div className="text-center py-4">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="15" y1="9" x2="9" y2="15" />
                      <line x1="9" y1="9" x2="15" y2="15" />
                    </svg>
                    <p className="text-red-400 font-medium mt-3">{nfcError}</p>
                    <button
                      type="button"
                      onClick={resetNfcLogin}
                      className="mt-3 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm transition-colors"
                    >
                      {text.tryAgain}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Divider between NFC and traditional login */}
            <div
              className="flex items-center gap-3 mb-6 mobile-input-container"
              style={{ marginLeft: "15px", marginRight: "15px" }}
            >
              <div className="flex-1 h-px bg-slate-700" />
              <span className="text-gray-500 text-xs uppercase tracking-wide">{text.orPassword}</span>
              <div className="flex-1 h-px bg-slate-700" />
            </div>

            {/* Login Method Toggle */}
            <div
              className="flex gap-3 mb-6 mobile-input-container"
              style={{ marginLeft: "15px" }}
            >
              <button
                type="button"
                onClick={() => setLoginMethod("email")}
                className={cn(
                  "flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-colors",
                  loginMethod === "email"
                    ? "bg-blue-600 text-white"
                    : "bg-slate-800 text-gray-400 hover:bg-slate-700 hover:text-gray-300 border border-slate-700",
                )}
              >
                {text.email}
              </button>
              <button
                type="button"
                onClick={() => setLoginMethod("phone")}
                className={cn(
                  "flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-colors",
                  loginMethod === "phone"
                    ? "bg-blue-600 text-white"
                    : "bg-slate-800 text-gray-400 hover:bg-slate-700 hover:text-gray-300 border border-slate-700",
                )}
              >
                {text.phone}
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email or Phone Input */}
              {loginMethod === "email" ? (
                <div
                  className="mobile-input-container"
                  style={{ marginLeft: "15px", marginTop: "30px" }}
                >
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder={text.enterEmail}
                    style={{ paddingLeft: "15px", width: "100%" }}
                    disabled={isLoading}
                    autoComplete="username"
                  />
                </div>
              ) : (
                <div
                  className="mobile-input-container"
                  style={{ marginLeft: "15px", marginTop: "30px" }}
                >
                  <PhoneInput
                    defaultCountry="sg"
                    value={phone}
                    onChange={(phone) => setPhone(phone)}
                    placeholder={text.enterPhone}
                    disabled={isLoading}
                  />
                </div>
              )}

              {/* Password Input */}
              <div
                className="relative mobile-input-container"
                style={{ marginLeft: "15px", marginTop: "30px" }}
              >
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder={text.enterPassword}
                  className="pr-12"
                  style={{ paddingLeft: "15px", width: "100%" }}
                  disabled={isLoading}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-white"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white font-semibold h-12 rounded-lg text-base hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors shadow-lg shadow-blue-600/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-blue-500 mobile-button"
                style={{ marginTop: "20px", marginLeft: "10px" }}
              >
                {isLoading ? text.loggingIn : text.login}
              </button>

              {/* Forgot Password Link */}
              <div
                className="text-center pt-2"
                style={{ marginLeft: "10px", marginBottom: "30px" }}
              >
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-sm text-blue-400 hover:text-blue-300 hover:underline font-medium bg-transparent border-none cursor-pointer transition-colors"
                >
                  {text.forgotPassword}
                </button>
              </div>
            </form>
          </div>

          {/* Image Section */}
          <div className="hidden md:flex items-center justify-center bg-gradient-to-br from-blue-600 to-blue-800 rounded-r-2xl">
            <img
              src="/login.png"
              alt="Summit Exchange Login"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </main>

      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        toastStyle={{
          backgroundColor: "#1E293B",
          color: "#F1F5F9",
          border: "1px solid #475569",
        }}
      />
    </div>
  );
}
