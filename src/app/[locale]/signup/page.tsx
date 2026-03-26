"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";

// --- HELPER & SIMULATED SHADCN/UI COMPONENTS ---
// These are simplified versions to make this a single, runnable file.

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

const Checkbox = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    type="checkbox"
    ref={ref}
    className={cn(
      "h-4 w-4 shrink-0 rounded-sm border border-slate-600 bg-slate-800 text-blue-600",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
      className,
    )}
    {...props}
  />
));
Checkbox.displayName = "Checkbox";

// --- SVG ICONS ---

const LogoIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="36"
    height="36"
    viewBox="0 0 36 36"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M12.9231 3H3V12.9231H12.9231V3Z"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M23.0769 12.9231H12.9231V23.0769H23.0769V12.9231Z"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M33 23.0769H23.0769V33H33V23.0769Z"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

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

// --- MAIN SIGNUP PAGE COMPONENT ---

export default function SignupPage() {
  const locale = useLocale();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [phone, setPhone] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    agreeToPolicy: false,
    agreeToMarketing: false,
  });
  const router = useRouter();

  const copyByLocale = {
    en: {
      title: 'Create an account',
      alreadyAccount: 'Already have an account?',
      login: 'Log in',
      emailPlaceholder: 'Please enter your email address',
      phonePlaceholder: 'Enter phone number',
      passwordPlaceholder: 'Enter your password',
      confirmPasswordPlaceholder: 'Confirm your password',
      creating: 'Creating Account...',
      create: 'Create new account',
      policyText: "By submitting your email, you confirm you've read this",
      policyNotice: 'Policy Notice',
      marketing: 'I agree to receive marketing updates and offers',
      toastEmailRequired: 'Email is required',
      toastEmailInvalid: 'Please enter a valid email address',
      toastPhoneInvalid: 'Please enter a valid phone number',
      toastPasswordRequired: 'Password is required',
      toastPasswordLength: 'Password must be at least 8 characters long',
      toastConfirmRequired: 'Please confirm your password',
      toastPasswordMismatch: 'Passwords do not match',
      toastPolicyRequired: 'Please agree to the Policy Notice',
      toastSignupSuccess: 'Account created successfully! Please verify your email.',
      toastSignupFailed: 'Signup failed. Please try again.'
    },
    de: { title: 'Konto erstellen', alreadyAccount: 'Hast du bereits ein Konto?', login: 'Einloggen', emailPlaceholder: 'Bitte gib deine E-Mail-Adresse ein', phonePlaceholder: 'Telefonnummer eingeben', passwordPlaceholder: 'Passwort eingeben', confirmPasswordPlaceholder: 'Passwort bestätigen', creating: 'Konto wird erstellt...', create: 'Neues Konto erstellen', policyText: 'Mit dem Absenden bestätigst du, dass du gelesen hast:', policyNotice: 'Datenschutzhinweis', marketing: 'Ich stimme Marketing-Updates und Angeboten zu', toastEmailRequired: 'E-Mail ist erforderlich', toastEmailInvalid: 'Bitte gib eine gültige E-Mail ein', toastPhoneInvalid: 'Bitte gib eine gültige Telefonnummer ein', toastPasswordRequired: 'Passwort ist erforderlich', toastPasswordLength: 'Passwort muss mindestens 8 Zeichen lang sein', toastConfirmRequired: 'Bitte bestätige dein Passwort', toastPasswordMismatch: 'Passwörter stimmen nicht überein', toastPolicyRequired: 'Bitte stimme dem Datenschutzhinweis zu', toastSignupSuccess: 'Konto erfolgreich erstellt! Bitte E-Mail bestätigen.', toastSignupFailed: 'Registrierung fehlgeschlagen. Bitte erneut versuchen.' },
    zh: { title: '创建账户', alreadyAccount: '已有账户？', login: '登录', emailPlaceholder: '请输入邮箱地址', phonePlaceholder: '请输入手机号', passwordPlaceholder: '请输入密码', confirmPasswordPlaceholder: '请确认密码', creating: '正在创建账户...', create: '创建新账户', policyText: '提交邮箱即表示您已阅读', policyNotice: '隐私政策', marketing: '我同意接收营销更新和优惠', toastEmailRequired: '邮箱为必填项', toastEmailInvalid: '请输入有效邮箱地址', toastPhoneInvalid: '请输入有效手机号', toastPasswordRequired: '密码为必填项', toastPasswordLength: '密码至少需要 8 位', toastConfirmRequired: '请确认密码', toastPasswordMismatch: '两次密码不一致', toastPolicyRequired: '请同意隐私政策', toastSignupSuccess: '账户创建成功，请验证邮箱。', toastSignupFailed: '注册失败，请重试。' },
    ar: { title: 'إنشاء حساب', alreadyAccount: 'لديك حساب بالفعل؟', login: 'تسجيل الدخول', emailPlaceholder: 'يرجى إدخال بريدك الإلكتروني', phonePlaceholder: 'أدخل رقم الهاتف', passwordPlaceholder: 'أدخل كلمة المرور', confirmPasswordPlaceholder: 'تأكيد كلمة المرور', creating: 'جارٍ إنشاء الحساب...', create: 'إنشاء حساب جديد', policyText: 'بإرسال بريدك الإلكتروني فأنت تؤكد أنك قرأت', policyNotice: 'إشعار السياسة', marketing: 'أوافق على تلقي تحديثات وعروض تسويقية', toastEmailRequired: 'البريد الإلكتروني مطلوب', toastEmailInvalid: 'يرجى إدخال بريد إلكتروني صحيح', toastPhoneInvalid: 'يرجى إدخال رقم هاتف صحيح', toastPasswordRequired: 'كلمة المرور مطلوبة', toastPasswordLength: 'يجب أن تكون كلمة المرور 8 أحرف على الأقل', toastConfirmRequired: 'يرجى تأكيد كلمة المرور', toastPasswordMismatch: 'كلمتا المرور غير متطابقتين', toastPolicyRequired: 'يرجى الموافقة على إشعار السياسة', toastSignupSuccess: 'تم إنشاء الحساب بنجاح! يرجى التحقق من البريد الإلكتروني.', toastSignupFailed: 'فشل إنشاء الحساب. حاول مرة أخرى.' },
    ru: { title: 'Создать аккаунт', alreadyAccount: 'Уже есть аккаунт?', login: 'Войти', emailPlaceholder: 'Введите email', phonePlaceholder: 'Введите номер телефона', passwordPlaceholder: 'Введите пароль', confirmPasswordPlaceholder: 'Подтвердите пароль', creating: 'Создаем аккаунт...', create: 'Создать аккаунт', policyText: 'Отправляя email, вы подтверждаете, что прочитали', policyNotice: 'Политику', marketing: 'Я согласен получать маркетинговые обновления и предложения', toastEmailRequired: 'Email обязателен', toastEmailInvalid: 'Введите корректный email', toastPhoneInvalid: 'Введите корректный номер телефона', toastPasswordRequired: 'Пароль обязателен', toastPasswordLength: 'Пароль должен быть не менее 8 символов', toastConfirmRequired: 'Подтвердите пароль', toastPasswordMismatch: 'Пароли не совпадают', toastPolicyRequired: 'Пожалуйста, согласитесь с Политикой', toastSignupSuccess: 'Аккаунт создан! Подтвердите email.', toastSignupFailed: 'Регистрация не удалась. Попробуйте снова.' },
    th: { title: 'สร้างบัญชี', alreadyAccount: 'มีบัญชีอยู่แล้ว?', login: 'เข้าสู่ระบบ', emailPlaceholder: 'กรอกอีเมลของคุณ', phonePlaceholder: 'กรอกหมายเลขโทรศัพท์', passwordPlaceholder: 'กรอกรหัสผ่าน', confirmPasswordPlaceholder: 'ยืนยันรหัสผ่าน', creating: 'กำลังสร้างบัญชี...', create: 'สร้างบัญชีใหม่', policyText: 'เมื่อส่งอีเมล แสดงว่าคุณได้อ่าน', policyNotice: 'ประกาศนโยบาย', marketing: 'ฉันยินยอมรับข่าวสารและข้อเสนอทางการตลาด', toastEmailRequired: 'ต้องกรอกอีเมล', toastEmailInvalid: 'กรุณากรอกอีเมลที่ถูกต้อง', toastPhoneInvalid: 'กรุณากรอกหมายเลขโทรศัพท์ที่ถูกต้อง', toastPasswordRequired: 'ต้องกรอกรหัสผ่าน', toastPasswordLength: 'รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร', toastConfirmRequired: 'กรุณายืนยันรหัสผ่าน', toastPasswordMismatch: 'รหัสผ่านไม่ตรงกัน', toastPolicyRequired: 'กรุณายอมรับประกาศนโยบาย', toastSignupSuccess: 'สร้างบัญชีสำเร็จ! กรุณายืนยันอีเมล', toastSignupFailed: 'สมัครสมาชิกไม่สำเร็จ กรุณาลองใหม่' },
    es: { title: 'Crear una cuenta', alreadyAccount: '¿Ya tienes una cuenta?', login: 'Iniciar sesión', emailPlaceholder: 'Ingresa tu correo electrónico', phonePlaceholder: 'Ingresa número de teléfono', passwordPlaceholder: 'Ingresa tu contraseña', confirmPasswordPlaceholder: 'Confirma tu contraseña', creating: 'Creando cuenta...', create: 'Crear nueva cuenta', policyText: 'Al enviar tu correo, confirmas que has leído este', policyNotice: 'Aviso de Política', marketing: 'Acepto recibir actualizaciones y ofertas de marketing', toastEmailRequired: 'El correo es obligatorio', toastEmailInvalid: 'Ingresa un correo válido', toastPhoneInvalid: 'Ingresa un número de teléfono válido', toastPasswordRequired: 'La contraseña es obligatoria', toastPasswordLength: 'La contraseña debe tener al menos 8 caracteres', toastConfirmRequired: 'Confirma tu contraseña', toastPasswordMismatch: 'Las contraseñas no coinciden', toastPolicyRequired: 'Acepta el Aviso de Política', toastSignupSuccess: '¡Cuenta creada! Verifica tu correo.', toastSignupFailed: 'Error al registrarte. Intenta nuevamente.' },
    fr: { title: 'Créer un compte', alreadyAccount: 'Vous avez déjà un compte ?', login: 'Connexion', emailPlaceholder: 'Entrez votre e-mail', phonePlaceholder: 'Entrez le numéro de téléphone', passwordPlaceholder: 'Entrez votre mot de passe', confirmPasswordPlaceholder: 'Confirmez votre mot de passe', creating: 'Création du compte...', create: 'Créer un nouveau compte', policyText: 'En soumettant votre e-mail, vous confirmez avoir lu cet', policyNotice: 'Avis de Politique', marketing: 'J’accepte de recevoir des mises à jour et offres marketing', toastEmailRequired: 'E-mail requis', toastEmailInvalid: 'Veuillez entrer un e-mail valide', toastPhoneInvalid: 'Veuillez entrer un numéro valide', toastPasswordRequired: 'Mot de passe requis', toastPasswordLength: 'Le mot de passe doit contenir au moins 8 caractères', toastConfirmRequired: 'Veuillez confirmer votre mot de passe', toastPasswordMismatch: 'Les mots de passe ne correspondent pas', toastPolicyRequired: 'Veuillez accepter l’Avis de Politique', toastSignupSuccess: 'Compte créé avec succès ! Vérifiez votre e-mail.', toastSignupFailed: 'Échec de l’inscription. Veuillez réessayer.' }
  } as const;

  const text = copyByLocale[locale as keyof typeof copyByLocale] ?? copyByLocale.en;

  // Clear form when component mounts (handles back navigation)
  useEffect(() => {
    setFormData({
      email: "",
      password: "",
      confirmPassword: "",
      agreeToPolicy: false,
      agreeToMarketing: false,
    });
    setPhone("");
  }, []);

  // Form validation
  const validateForm = () => {
    if (!formData.email) {
      toast.error(text.toastEmailRequired);
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error(text.toastEmailInvalid);
      return false;
    }
    if (!phone || phone.length < 8) {
      toast.error(text.toastPhoneInvalid);
      return false;
    }
    if (!formData.password) {
      toast.error(text.toastPasswordRequired);
      return false;
    }
    if (formData.password.length < 8) {
      toast.error(text.toastPasswordLength);
      return false;
    }
    if (!formData.confirmPassword) {
      toast.error(text.toastConfirmRequired);
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error(text.toastPasswordMismatch);
      return false;
    }
    if (!formData.agreeToPolicy) {
      toast.error(text.toastPolicyRequired);
      return false;
    }
    return true;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      try {
        const { apiFetch } = await import('@/lib/api');
        const data: any = await apiFetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
            phoneNumber: phone,
            name: "",
          }),
        });

        toast.success(
          data.message ||
            text.toastSignupSuccess,
        );
        const path = locale === 'en' ? '/otp-verification' : `/${locale}/otp-verification`;
        router.push(`${path}?email=${encodeURIComponent(formData.email)}`);
      } catch (err: any) {
        console.error("Signup api error:", err);
        toast.error(
          err?.message || err?.text || text.toastSignupFailed,
        );
      }
    } catch (error: any) {
      console.error("Signup error:", error);
      toast.error(text.toastSignupFailed);
    } finally {
      setIsLoading(false);
    }
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

                    .react-international-phone-country-selector-button__button-content {
                        gap: 8px !important;
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

                    .react-international-phone-country-selector-dropdown__list-item--focused {
                        background-color: #334155 !important;
                    }

                    .react-international-phone-country-selector-dropdown__list-item-country-name {
                        color: #e2e8f0 !important;
                    }

                    .react-international-phone-country-selector-dropdown__list-item-dial-code {
                        color: #94a3b8 !important;
                    }

                    .react-international-phone-dial-code-preview {
                        color: #e2e8f0 !important;
                        padding-left: 4px !important;
                    }

                    .react-international-phone-country-selector-dropdown__search {
                        background-color: #0f172a !important;
                        border: 1px solid #334155 !important;
                        color: #e2e8f0 !important;
                        padding: 8px 12px !important;
                        margin: 8px !important;
                        border-radius: 6px !important;
                    }

                    .react-international-phone-country-selector-dropdown__search::placeholder {
                        color: #64748b !important;
                    }

                    /* Mobile-only styles - only apply to actual mobile devices */
                    @media screen and (max-width: 768px) {
                        body {
                            overflow-x: hidden;
                        }

                        .mobile-container {
                            max-width: 100vw !important;
                            margin: 0.5rem !important;
                            padding: 0 !important;
                        }

                        .mobile-form {
                            padding: 1rem !important;
                            margin-top: 0 !important;
                        }

                        .mobile-title {
                            font-size: 1.5rem !important;
                            text-align: center !important;
                            margin-left: 0 !important;
                            margin-right: 0 !important;
                            padding: 0 1rem !important;
                            line-height: 1.3 !important;
                        }

                        .mobile-subtitle {
                            text-align: center !important;
                            margin-left: 0 !important;
                            margin-right: 0 !important;
                            padding: 0 1rem !important;
                        }

                        .mobile-input-container {
                            margin-left: 0 !important;
                            margin-right: 0 !important;
                            padding: 0 1rem !important;
                            margin-bottom: 1rem !important;
                        }

                        .mobile-button {
                            margin-left: 0 !important;
                            margin-right: 0 !important;
                            margin: 0 1rem 1rem 1rem !important;
                            width: calc(100% - 2rem) !important;
                        }

                        .mobile-checkbox {
                            margin-left: 0 !important;
                            margin-right: 0 !important;
                            padding: 0 1rem !important;
                        }
                    }

                    @media screen and (max-width: 480px) {
                        .mobile-title {
                            font-size: 1.25rem !important;
                        }

                        .main-title {
                            font-size: 1.5rem !important;
                            margin-top: 1rem !important;
                            margin-bottom: 1rem !important;
                            padding: 0 1rem !important;
                        }

                        .mobile-form {
                            padding: 0.75rem !important;
                        }
                    }
                `,
        }}
      />
      {/* <Header /> */}
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
              {text.alreadyAccount}{" "}
              <a
                href={locale === 'en' ? '/login' : `/${locale}/login`}
                className="font-medium text-blue-400 hover:underline"
              >
                {text.login}
              </a>
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div
                className="mobile-input-container"
                style={{ marginLeft: "15px", marginTop: "30px" }}
              >
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder={text.emailPlaceholder}
                  style={{ paddingLeft: "15px", width: "100%" }}
                  disabled={isLoading}
                />
              </div>

              <div
                className="mobile-input-container"
                style={{ marginLeft: "15px", marginTop: "30px" }}
              >
                <PhoneInput
                  defaultCountry="sg"
                  value={phone}
                  onChange={(phone) => setPhone(phone)}
                  placeholder={text.phonePlaceholder}
                  disabled={isLoading}
                />
              </div>

              <div
                className="relative mobile-input-container"
                style={{ marginLeft: "15px", marginTop: "30px" }}
              >
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder={text.passwordPlaceholder}
                  className="pr-12"
                  style={{ paddingLeft: "15px", width: "100%" }}
                  disabled={isLoading}
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

              <div
                className="relative mobile-input-container"
                style={{ marginLeft: "15px", marginTop: "30px" }}
              >
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder={text.confirmPasswordPlaceholder}
                  className="pr-12"
                  style={{ paddingLeft: "15px", width: "100%" }}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-white"
                >
                  {showConfirmPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white font-semibold h-12 rounded-lg text-base hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors shadow-lg shadow-blue-600/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-blue-500 mobile-button"
                style={{ marginTop: "20px", marginLeft: "10px" }}
              >
                {isLoading ? text.creating : text.create}
              </button>

              <div className="space-y-4 pt-4">
                <div
                  className="flex items-start gap-3 mobile-checkbox"
                  style={{ marginLeft: "15px", marginTop: "30px" }}
                >
                  <Checkbox
                    id="policy"
                    name="agreeToPolicy"
                    checked={formData.agreeToPolicy}
                    onChange={handleInputChange}
                    disabled={isLoading}
                  />
                  <label htmlFor="policy" className="text-sm text-gray-400">
                    {text.policyText}{" "}
                    <a href="#" className="text-blue-400 hover:underline">
                      {text.policyNotice}
                    </a>
                  </label>
                </div>
                <div
                  className="flex items-start gap-3 mobile-checkbox"
                  style={{ marginLeft: "15px", marginBottom: "20px" }}
                >
                  <Checkbox
                    id="marketing"
                    name="agreeToMarketing"
                    checked={formData.agreeToMarketing}
                    onChange={handleInputChange}
                    disabled={isLoading}
                  />
                  <label htmlFor="marketing" className="text-sm text-gray-400">
                    {text.marketing}
                  </label>
                </div>
              </div>
            </form>
          </div>

          {/* Image Section */}
          <div className="hidden md:flex items-center justify-center bg-gradient-to-br from-blue-600 to-blue-800 rounded-r-2xl">
            <img
              src="/signup.png"
              alt="Summit Exchange Wallet"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </main>
      {/* <CTASection />
            <Footer /> */}

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
