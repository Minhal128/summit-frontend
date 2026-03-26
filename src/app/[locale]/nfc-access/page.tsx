'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCart } from '@/contexts/CartContext';
import { fetchProducts, NfcProduct } from '@/lib/cartApi';
import { toast } from 'react-toastify';
import { useLocale } from 'next-intl';

export default function NfcAccessPage() {
  const router = useRouter();
  const locale = useLocale();
  const { addToCart } = useCart();
  const [products, setProducts] = useState<NfcProduct[]>([]);
  const [loading, setLoading] = useState(true);

  const withLocalePath = (path: string) => {
    if (locale === 'en') return path;
    return `/${locale}${path === '/' ? '' : path}`;
  };

  const copyByLocale = {
    en: {
      fetchFailed: 'Failed to load products',
      unknownError: 'Unknown error',
      waitProducts: 'Please wait, products are still loading...',
      noProductsAvailable: 'No products available. Please ensure backend is running on port 5000.',
      productAdded: '✅ {name} added to cart!',
      productNotFound: 'Product not found. Please ensure backend is running and products are seeded.',
      heroBadge: '🔐 SECURE ACCESS REQUIRED',
      heroTitle: 'Get Your High Security NFC Card',
      heroDescriptionLine1: "Access Summit Exchange's full hybrid trading platform with our military-grade NFC authentication cards.",
      heroDescriptionStrong: 'Purchase your card to unlock the complete dashboard.',
      miniCards: ['Decentralized Exchange', 'Peer-to-Peer Trading', 'Non-Custodial Wallet'],
      chooseTierTitle: 'Choose Your Access Tier',
      chooseTierSubtitle: 'Each tier unlocks different fee structures and benefits',
      mostPopular: '⭐ MOST POPULAR',
      oneTime: 'one-time',
      loadingProductsButton: 'Loading Products...',
      purchasePrefix: 'Purchase',
      accessTitle: "What You'll Get Access To",
      accessFeatures: [
        { icon: '📊', title: 'Market Summit (MS)', desc: 'Real-time crypto tracking with 0.01% buffer zone from Investing.com' },
        { icon: '📤', title: 'Send Function', desc: 'Transfer crypto to Summit wallets or external addresses with NFC authorization' },
        { icon: '📥', title: 'Receive Function', desc: 'Receive crypto from any source with automatic synchronization' },
        { icon: '🔄', title: 'Swap Function', desc: 'Instant crypto-to-crypto swaps within Summit Exchange' },
        { icon: '💰', title: 'Buy/Sell', desc: 'Access to multiple providers (Mercuryo, Coinbase) with competitive rates' },
        { icon: '🔐', title: 'NFC Security', desc: 'Military-grade encryption with challenge-response authentication' }
      ],
      faqTitle: 'Frequently Asked Questions',
      faqs: [
        {
          q: 'Why do I need an NFC card?',
          a: 'Our NFC cards provide military-grade security for your non-custodial wallet. Each transaction requires physical card authorization, protecting your assets from unauthorized access.'
        },
        {
          q: 'How many wallets can I create per card?',
          a: 'Each card can generate up to 3 wallet addresses per cryptocurrency, giving you flexibility in managing your portfolio.'
        },
        {
          q: 'Is this a one-time payment?',
          a: 'Yes! The card purchase is a one-time fee. You only pay transaction fees based on your tier when using the platform.'
        },
        {
          q: "What's the difference between tiers?",
          a: 'Higher tiers offer lower transaction fees, better swap rates, priority support, and advanced features like API access and dedicated account managers.'
        }
      ],
      tiers: {
        standard: {
          name: 'Standard NFC Card',
          features: ['Secure NFC chip', 'Wallet authentication', 'Basic security features', 'Compatible with major wallets', '1-2 wallets per crypto']
        },
        premium: {
          name: 'Premium NFC Card',
          features: ['Advanced security chip', 'Multi-signature support', 'Waterproof design', 'Extended warranty', 'Priority support', '3 wallets per crypto']
        },
        enterprise: {
          name: 'Enterprise NFC Card',
          features: ['Military-grade encryption', 'Multi-wallet support', 'Biometric integration', 'Custom branding available', 'Dedicated account manager', 'API access', 'Unlimited wallets']
        }
      }
    },
    zh: {
      fetchFailed: '加载产品失败',
      unknownError: '未知错误',
      waitProducts: '请稍候，产品仍在加载中...',
      noProductsAvailable: '暂无可用产品。请确认后端正在 5000 端口运行。',
      productAdded: '✅ {name} 已加入购物车！',
      productNotFound: '未找到产品。请确认后端已运行且已完成产品初始化。',
      heroBadge: '🔐 需要安全访问',
      heroTitle: '获取您的高安全 NFC 卡',
      heroDescriptionLine1: '通过军工级 NFC 身份验证卡，访问 Summit Exchange 完整的混合交易平台。',
      heroDescriptionStrong: '购买您的卡以解锁完整控制台。',
      miniCards: ['去中心化交易所', '点对点交易', '非托管钱包'],
      chooseTierTitle: '选择您的访问等级',
      chooseTierSubtitle: '每个等级都会解锁不同的费率结构和权益',
      mostPopular: '⭐ 最受欢迎',
      oneTime: '一次性',
      loadingProductsButton: '产品加载中...',
      purchasePrefix: '购买',
      accessTitle: '您将获得的访问权限',
      accessFeatures: [
        { icon: '📊', title: 'Market Summit (MS)', desc: '来自 Investing.com 的实时加密货币追踪，含 0.01% 缓冲区' },
        { icon: '📤', title: '发送功能', desc: '通过 NFC 授权将加密货币转入 Summit 钱包或外部地址' },
        { icon: '📥', title: '接收功能', desc: '从任意来源接收加密货币并自动同步' },
        { icon: '🔄', title: '兑换功能', desc: '在 Summit Exchange 内即时进行币币兑换' },
        { icon: '💰', title: '买入/卖出', desc: '接入多个提供商（Mercuryo、Coinbase）并享受有竞争力费率' },
        { icon: '🔐', title: 'NFC 安全', desc: '军工级加密与挑战-响应认证机制' }
      ],
      faqTitle: '常见问题',
      faqs: [
        {
          q: '为什么我需要 NFC 卡？',
          a: '我们的 NFC 卡为您的非托管钱包提供军工级安全保障。每笔交易都需要实体卡授权，保护资产免受未授权访问。'
        },
        {
          q: '每张卡可以创建多少个钱包？',
          a: '每张卡每种加密货币最多可生成 3 个钱包地址，方便您灵活管理资产组合。'
        },
        {
          q: '这是一次性付款吗？',
          a: '是的！购卡费用为一次性支付。之后仅按您的等级在平台使用时支付交易费用。'
        },
        {
          q: '不同等级有什么区别？',
          a: '更高等级可享受更低交易费率、更优兑换价格、优先支持，以及 API 访问和专属客户经理等高级功能。'
        }
      ],
      tiers: {
        standard: {
          name: '标准 NFC 卡',
          features: ['安全 NFC 芯片', '钱包身份验证', '基础安全功能', '兼容主流钱包', '每种币 1-2 个钱包']
        },
        premium: {
          name: '高级 NFC 卡',
          features: ['高级安全芯片', '多重签名支持', '防水设计', '延长保修', '优先支持', '每种币 3 个钱包']
        },
        enterprise: {
          name: '企业 NFC 卡',
          features: ['军工级加密', '多钱包支持', '生物识别集成', '支持定制品牌', '专属客户经理', 'API 访问', '无限钱包']
        }
      }
    },
    ar: {
      fetchFailed: 'فشل تحميل المنتجات',
      unknownError: 'خطأ غير معروف',
      waitProducts: 'يرجى الانتظار، ما زال تحميل المنتجات جاريًا...',
      noProductsAvailable: 'لا توجد منتجات متاحة. يرجى التأكد من تشغيل الخادم الخلفي على المنفذ 5000.',
      productAdded: '✅ تمت إضافة {name} إلى السلة!',
      productNotFound: 'لم يتم العثور على المنتج. يرجى التأكد من تشغيل الخادم الخلفي وتهيئة المنتجات.',
      heroBadge: '🔐 يتطلب وصولاً آمنًا',
      heroTitle: 'احصل على بطاقة NFC عالية الأمان',
      heroDescriptionLine1: 'ادخل إلى منصة Summit Exchange الهجينة الكاملة عبر بطاقات مصادقة NFC بمستوى عسكري.',
      heroDescriptionStrong: 'اشترِ بطاقتك لفتح لوحة التحكم الكاملة.',
      miniCards: ['منصة تداول لامركزية', 'تداول نظير إلى نظير', 'محفظة غير وصائية'],
      chooseTierTitle: 'اختر فئة الوصول',
      chooseTierSubtitle: 'كل فئة تفتح هيكل رسوم ومزايا مختلفة',
      mostPopular: '⭐ الأكثر شيوعًا',
      oneTime: 'مرة واحدة',
      loadingProductsButton: 'جارٍ تحميل المنتجات...',
      purchasePrefix: 'شراء',
      accessTitle: 'ما الذي ستحصل على الوصول إليه',
      accessFeatures: [
        { icon: '📊', title: 'Market Summit (MS)', desc: 'تتبع فوري للعملات المشفرة مع هامش 0.01% من Investing.com' },
        { icon: '📤', title: 'ميزة الإرسال', desc: 'تحويل العملات إلى محافظ Summit أو عناوين خارجية بتفويض NFC' },
        { icon: '📥', title: 'ميزة الاستلام', desc: 'استلام العملات من أي مصدر مع مزامنة تلقائية' },
        { icon: '🔄', title: 'ميزة المبادلة', desc: 'مبادلات فورية بين العملات داخل Summit Exchange' },
        { icon: '💰', title: 'شراء/بيع', desc: 'الوصول إلى مزودين متعددين (Mercuryo وCoinbase) بأسعار تنافسية' },
        { icon: '🔐', title: 'أمان NFC', desc: 'تشفير بمستوى عسكري مع مصادقة التحدي والاستجابة' }
      ],
      faqTitle: 'الأسئلة الشائعة',
      faqs: [
        {
          q: 'لماذا أحتاج إلى بطاقة NFC؟',
          a: 'توفر بطاقات NFC الخاصة بنا أمانًا بمستوى عسكري لمحفظتك غير الوصائية. كل معاملة تتطلب تفويضًا فعليًا بالبطاقة لحماية أصولك من الوصول غير المصرح به.'
        },
        {
          q: 'كم عدد المحافظ التي يمكنني إنشاؤها لكل بطاقة؟',
          a: 'يمكن لكل بطاقة إنشاء ما يصل إلى 3 عناوين محفظة لكل عملة مشفرة، مما يمنحك مرونة أكبر في إدارة محفظتك.'
        },
        {
          q: 'هل هذه دفعة لمرة واحدة؟',
          a: 'نعم! شراء البطاقة برسوم لمرة واحدة. تدفع فقط رسوم المعاملات حسب فئتك عند استخدام المنصة.'
        },
        {
          q: 'ما الفرق بين الفئات؟',
          a: 'الفئات الأعلى تقدم رسوم معاملات أقل، وأسعار مبادلة أفضل، ودعمًا ذا أولوية، وميزات متقدمة مثل API ومدير حساب مخصص.'
        }
      ],
      tiers: {
        standard: {
          name: 'بطاقة NFC القياسية',
          features: ['شريحة NFC آمنة', 'مصادقة المحفظة', 'ميزات أمان أساسية', 'متوافقة مع المحافظ الرئيسية', '1-2 محفظة لكل عملة']
        },
        premium: {
          name: 'بطاقة NFC المميزة',
          features: ['شريحة أمان متقدمة', 'دعم التوقيع المتعدد', 'تصميم مقاوم للماء', 'ضمان ممتد', 'دعم ذو أولوية', '3 محافظ لكل عملة']
        },
        enterprise: {
          name: 'بطاقة NFC للمؤسسات',
          features: ['تشفير بمستوى عسكري', 'دعم متعدد المحافظ', 'تكامل القياسات الحيوية', 'إمكانية تخصيص العلامة التجارية', 'مدير حساب مخصص', 'وصول API', 'محافظ غير محدودة']
        }
      }
    },
    ru: {
      fetchFailed: 'Не удалось загрузить продукты',
      unknownError: 'Неизвестная ошибка',
      waitProducts: 'Подождите, продукты всё ещё загружаются...',
      noProductsAvailable: 'Нет доступных продуктов. Убедитесь, что backend запущен на порту 5000.',
      productAdded: '✅ {name} добавлен в корзину!',
      productNotFound: 'Продукт не найден. Убедитесь, что backend запущен и продукты инициализированы.',
      heroBadge: '🔐 ТРЕБУЕТСЯ БЕЗОПАСНЫЙ ДОСТУП',
      heroTitle: 'Получите NFC-карту повышенной безопасности',
      heroDescriptionLine1: 'Получите полный доступ к гибридной торговой платформе Summit Exchange с нашими NFC-картами военного уровня.',
      heroDescriptionStrong: 'Купите карту, чтобы открыть полный функционал панели.',
      miniCards: ['Децентрализованная биржа', 'P2P-торговля', 'Некастодиальный кошелёк'],
      chooseTierTitle: 'Выберите уровень доступа',
      chooseTierSubtitle: 'Каждый уровень открывает разные комиссии и преимущества',
      mostPopular: '⭐ САМЫЙ ПОПУЛЯРНЫЙ',
      oneTime: 'разовый платеж',
      loadingProductsButton: 'Загрузка продуктов...',
      purchasePrefix: 'Купить',
      accessTitle: 'Что вы получите',
      accessFeatures: [
        { icon: '📊', title: 'Market Summit (MS)', desc: 'Отслеживание криптовалют в реальном времени с буфером 0.01% от Investing.com' },
        { icon: '📤', title: 'Отправка', desc: 'Перевод криптовалюты в кошельки Summit или внешние адреса с NFC-авторизацией' },
        { icon: '📥', title: 'Получение', desc: 'Получение криптовалюты из любого источника с автоматической синхронизацией' },
        { icon: '🔄', title: 'Обмен', desc: 'Мгновенные крипто-обмены внутри Summit Exchange' },
        { icon: '💰', title: 'Покупка/Продажа', desc: 'Доступ к нескольким провайдерам (Mercuryo, Coinbase) по конкурентным ставкам' },
        { icon: '🔐', title: 'NFC-безопасность', desc: 'Шифрование военного уровня с challenge-response аутентификацией' }
      ],
      faqTitle: 'Часто задаваемые вопросы',
      faqs: [
        {
          q: 'Зачем мне NFC-карта?',
          a: 'Наши NFC-карты обеспечивают военный уровень безопасности для вашего некастодиального кошелька. Каждая транзакция требует физического подтверждения картой, защищая активы от несанкционированного доступа.'
        },
        {
          q: 'Сколько кошельков можно создать на одну карту?',
          a: 'Каждая карта может создать до 3 адресов кошелька для каждой криптовалюты, что даёт гибкость в управлении портфелем.'
        },
        {
          q: 'Это разовая оплата?',
          a: 'Да! Покупка карты оплачивается один раз. Далее вы платите только комиссии за транзакции согласно вашему уровню.'
        },
        {
          q: 'В чем разница между уровнями?',
          a: 'Более высокие уровни дают более низкие комиссии, лучшие курсы обмена, приоритетную поддержку и расширенные функции, включая API и персонального менеджера.'
        }
      ],
      tiers: {
        standard: {
          name: 'Стандартная NFC-карта',
          features: ['Безопасный NFC-чип', 'Аутентификация кошелька', 'Базовые функции безопасности', 'Совместимость с основными кошельками', '1-2 кошелька на криптовалюту']
        },
        premium: {
          name: 'Премиум NFC-карта',
          features: ['Продвинутый защитный чип', 'Поддержка мультиподписи', 'Водонепроницаемый дизайн', 'Расширенная гарантия', 'Приоритетная поддержка', '3 кошелька на криптовалюту']
        },
        enterprise: {
          name: 'Корпоративная NFC-карта',
          features: ['Шифрование военного уровня', 'Поддержка нескольких кошельков', 'Биометрическая интеграция', 'Кастомный брендинг', 'Персональный менеджер', 'Доступ к API', 'Неограниченные кошельки']
        }
      }
    },
    th: {
      fetchFailed: 'โหลดสินค้าไม่สำเร็จ',
      unknownError: 'ข้อผิดพลาดที่ไม่ทราบสาเหตุ',
      waitProducts: 'กรุณารอสักครู่ ระบบกำลังโหลดสินค้า...',
      noProductsAvailable: 'ไม่มีสินค้าที่พร้อมใช้งาน โปรดยืนยันว่า backend ทำงานที่พอร์ต 5000',
      productAdded: '✅ เพิ่ม {name} ลงตะกร้าแล้ว!',
      productNotFound: 'ไม่พบสินค้า โปรดยืนยันว่า backend ทำงานและมีการ seed ข้อมูลสินค้าแล้ว',
      heroBadge: '🔐 ต้องใช้การเข้าถึงที่ปลอดภัย',
      heroTitle: 'รับบัตร NFC ความปลอดภัยสูงของคุณ',
      heroDescriptionLine1: 'เข้าถึงแพลตฟอร์มเทรดแบบไฮบริดเต็มรูปแบบของ Summit Exchange ด้วยบัตรยืนยันตัวตน NFC ระดับทหาร',
      heroDescriptionStrong: 'ซื้อบัตรของคุณเพื่อปลดล็อกแดชบอร์ดทั้งหมด',
      miniCards: ['กระดานเทรดแบบกระจายศูนย์', 'การเทรดแบบเพียร์ทูเพียร์', 'วอลเล็ตแบบไม่ฝากทรัพย์สิน'],
      chooseTierTitle: 'เลือกระดับการเข้าถึงของคุณ',
      chooseTierSubtitle: 'แต่ละระดับปลดล็อกโครงสร้างค่าธรรมเนียมและสิทธิประโยชน์ที่ต่างกัน',
      mostPopular: '⭐ ยอดนิยมที่สุด',
      oneTime: 'ชำระครั้งเดียว',
      loadingProductsButton: 'กำลังโหลดสินค้า...',
      purchasePrefix: 'ซื้อ',
      accessTitle: 'สิ่งที่คุณจะได้รับ',
      accessFeatures: [
        { icon: '📊', title: 'Market Summit (MS)', desc: 'ติดตามคริปโตแบบเรียลไทม์พร้อมโซนบัฟเฟอร์ 0.01% จาก Investing.com' },
        { icon: '📤', title: 'ฟังก์ชันส่ง', desc: 'โอนคริปโตไปยังวอลเล็ต Summit หรือที่อยู่นอกระบบด้วยการยืนยันผ่าน NFC' },
        { icon: '📥', title: 'ฟังก์ชันรับ', desc: 'รับคริปโตจากทุกแหล่งพร้อมซิงก์อัตโนมัติ' },
        { icon: '🔄', title: 'ฟังก์ชันสวอป', desc: 'สลับคริปโตทันทีภายใน Summit Exchange' },
        { icon: '💰', title: 'ซื้อ/ขาย', desc: 'เข้าถึงผู้ให้บริการหลายราย (Mercuryo, Coinbase) ด้วยอัตราที่แข่งขันได้' },
        { icon: '🔐', title: 'ความปลอดภัย NFC', desc: 'การเข้ารหัสระดับทหารพร้อมการยืนยันแบบ challenge-response' }
      ],
      faqTitle: 'คำถามที่พบบ่อย',
      faqs: [
        {
          q: 'ทำไมฉันต้องใช้บัตร NFC?',
          a: 'บัตร NFC ของเราให้ความปลอดภัยระดับทหารสำหรับวอลเล็ตแบบไม่ฝากทรัพย์สินของคุณ ทุกธุรกรรมต้องมีการยืนยันด้วยบัตรจริง เพื่อป้องกันการเข้าถึงที่ไม่ได้รับอนุญาต'
        },
        {
          q: 'หนึ่งบัตรสร้างได้กี่วอลเล็ต?',
          a: 'บัตรหนึ่งใบสามารถสร้างที่อยู่วอลเล็ตได้สูงสุด 3 ที่อยู่ต่อสกุลเงินคริปโต ช่วยให้คุณจัดการพอร์ตได้ยืดหยุ่นมากขึ้น'
        },
        {
          q: 'เป็นการชำระเงินครั้งเดียวหรือไม่?',
          a: 'ใช่! การซื้อบัตรเป็นค่าธรรมเนียมครั้งเดียว หลังจากนั้นคุณจ่ายเฉพาะค่าธรรมเนียมธุรกรรมตามระดับที่เลือกเมื่อใช้งานแพลตฟอร์ม'
        },
        {
          q: 'แต่ละระดับต่างกันอย่างไร?',
          a: 'ระดับที่สูงขึ้นจะได้ค่าธรรมเนียมต่ำลง อัตราสวอปที่ดีกว่า การสนับสนุนแบบพิเศษ และฟีเจอร์ขั้นสูง เช่น API และผู้จัดการบัญชีเฉพาะ'
        }
      ],
      tiers: {
        standard: {
          name: 'บัตร NFC มาตรฐาน',
          features: ['ชิป NFC ปลอดภัย', 'ยืนยันตัวตนวอลเล็ต', 'ฟีเจอร์ความปลอดภัยพื้นฐาน', 'รองรับวอลเล็ตหลัก', '1-2 วอลเล็ตต่อคริปโต']
        },
        premium: {
          name: 'บัตร NFC พรีเมียม',
          features: ['ชิปความปลอดภัยขั้นสูง', 'รองรับหลายลายเซ็น', 'ดีไซน์กันน้ำ', 'รับประกันเพิ่ม', 'ซัพพอร์ตลำดับความสำคัญ', '3 วอลเล็ตต่อคริปโต']
        },
        enterprise: {
          name: 'บัตร NFC องค์กร',
          features: ['การเข้ารหัสระดับทหาร', 'รองรับหลายวอลเล็ต', 'เชื่อมต่อไบโอเมตริก', 'รองรับแบรนด์แบบกำหนดเอง', 'ผู้จัดการบัญชีเฉพาะ', 'เข้าถึง API', 'วอลเล็ตไม่จำกัด']
        }
      }
    },
    es: {
      fetchFailed: 'No se pudieron cargar los productos',
      unknownError: 'Error desconocido',
      waitProducts: 'Por favor espera, los productos todavía se están cargando...',
      noProductsAvailable: 'No hay productos disponibles. Asegúrate de que el backend esté ejecutándose en el puerto 5000.',
      productAdded: '✅ ¡{name} añadido al carrito!',
      productNotFound: 'Producto no encontrado. Asegúrate de que el backend esté en ejecución y los productos estén cargados.',
      heroBadge: '🔐 ACCESO SEGURO REQUERIDO',
      heroTitle: 'Obtén tu tarjeta NFC de alta seguridad',
      heroDescriptionLine1: 'Accede a toda la plataforma híbrida de trading de Summit Exchange con nuestras tarjetas de autenticación NFC de grado militar.',
      heroDescriptionStrong: 'Compra tu tarjeta para desbloquear el panel completo.',
      miniCards: ['Exchange descentralizado', 'Trading P2P', 'Billetera no custodial'],
      chooseTierTitle: 'Elige tu nivel de acceso',
      chooseTierSubtitle: 'Cada nivel desbloquea diferentes estructuras de comisiones y beneficios',
      mostPopular: '⭐ MÁS POPULAR',
      oneTime: 'pago único',
      loadingProductsButton: 'Cargando productos...',
      purchasePrefix: 'Comprar',
      accessTitle: 'A lo que tendrás acceso',
      accessFeatures: [
        { icon: '📊', title: 'Market Summit (MS)', desc: 'Seguimiento cripto en tiempo real con zona de buffer del 0.01% desde Investing.com' },
        { icon: '📤', title: 'Función Enviar', desc: 'Transfiere cripto a billeteras Summit o direcciones externas con autorización NFC' },
        { icon: '📥', title: 'Función Recibir', desc: 'Recibe cripto desde cualquier fuente con sincronización automática' },
        { icon: '🔄', title: 'Función Swap', desc: 'Intercambios cripto instantáneos dentro de Summit Exchange' },
        { icon: '💰', title: 'Comprar/Vender', desc: 'Acceso a múltiples proveedores (Mercuryo, Coinbase) con tarifas competitivas' },
        { icon: '🔐', title: 'Seguridad NFC', desc: 'Encriptación de grado militar con autenticación challenge-response' }
      ],
      faqTitle: 'Preguntas frecuentes',
      faqs: [
        {
          q: '¿Por qué necesito una tarjeta NFC?',
          a: 'Nuestras tarjetas NFC brindan seguridad de grado militar para tu billetera no custodial. Cada transacción requiere autorización física con la tarjeta, protegiendo tus activos contra accesos no autorizados.'
        },
        {
          q: '¿Cuántas billeteras puedo crear por tarjeta?',
          a: 'Cada tarjeta puede generar hasta 3 direcciones de billetera por criptomoneda, dándote flexibilidad para gestionar tu portafolio.'
        },
        {
          q: '¿Es un pago único?',
          a: '¡Sí! La compra de la tarjeta es un pago único. Solo pagas comisiones de transacción según tu nivel al usar la plataforma.'
        },
        {
          q: '¿Cuál es la diferencia entre niveles?',
          a: 'Los niveles superiores ofrecen comisiones más bajas, mejores tasas de swap, soporte prioritario y funciones avanzadas como acceso API y gestor de cuenta dedicado.'
        }
      ],
      tiers: {
        standard: {
          name: 'Tarjeta NFC Estándar',
          features: ['Chip NFC seguro', 'Autenticación de billetera', 'Funciones básicas de seguridad', 'Compatible con las principales billeteras', '1-2 billeteras por cripto']
        },
        premium: {
          name: 'Tarjeta NFC Premium',
          features: ['Chip de seguridad avanzado', 'Soporte de firma múltiple', 'Diseño resistente al agua', 'Garantía extendida', 'Soporte prioritario', '3 billeteras por cripto']
        },
        enterprise: {
          name: 'Tarjeta NFC Empresarial',
          features: ['Encriptación de grado militar', 'Soporte multi-billetera', 'Integración biométrica', 'Marca personalizada disponible', 'Gestor de cuenta dedicado', 'Acceso API', 'Billeteras ilimitadas']
        }
      }
    },
    fr: {
      fetchFailed: 'Échec du chargement des produits',
      unknownError: 'Erreur inconnue',
      waitProducts: 'Veuillez patienter, les produits sont en cours de chargement...',
      noProductsAvailable: 'Aucun produit disponible. Assurez-vous que le backend fonctionne sur le port 5000.',
      productAdded: '✅ {name} ajouté au panier !',
      productNotFound: 'Produit introuvable. Assurez-vous que le backend est actif et que les produits sont initialisés.',
      heroBadge: '🔐 ACCÈS SÉCURISÉ REQUIS',
      heroTitle: 'Obtenez votre carte NFC haute sécurité',
      heroDescriptionLine1: 'Accédez à la plateforme de trading hybride complète de Summit Exchange avec nos cartes d’authentification NFC de niveau militaire.',
      heroDescriptionStrong: 'Achetez votre carte pour débloquer le tableau de bord complet.',
      miniCards: ['Exchange décentralisé', 'Trading pair-à-pair', 'Wallet non-custodial'],
      chooseTierTitle: 'Choisissez votre niveau d’accès',
      chooseTierSubtitle: 'Chaque niveau débloque des frais et avantages différents',
      mostPopular: '⭐ LE PLUS POPULAIRE',
      oneTime: 'paiement unique',
      loadingProductsButton: 'Chargement des produits...',
      purchasePrefix: 'Acheter',
      accessTitle: 'Ce à quoi vous aurez accès',
      accessFeatures: [
        { icon: '📊', title: 'Market Summit (MS)', desc: 'Suivi crypto en temps réel avec zone tampon de 0.01% depuis Investing.com' },
        { icon: '📤', title: 'Fonction Envoi', desc: 'Transférez des cryptos vers des wallets Summit ou des adresses externes avec autorisation NFC' },
        { icon: '📥', title: 'Fonction Réception', desc: 'Recevez des cryptos de toute source avec synchronisation automatique' },
        { icon: '🔄', title: 'Fonction Swap', desc: 'Swaps crypto instantanés au sein de Summit Exchange' },
        { icon: '💰', title: 'Acheter/Vendre', desc: 'Accès à plusieurs fournisseurs (Mercuryo, Coinbase) avec des tarifs compétitifs' },
        { icon: '🔐', title: 'Sécurité NFC', desc: 'Chiffrement de niveau militaire avec authentification challenge-response' }
      ],
      faqTitle: 'Questions fréquentes',
      faqs: [
        {
          q: 'Pourquoi ai-je besoin d’une carte NFC ?',
          a: 'Nos cartes NFC offrent une sécurité de niveau militaire pour votre wallet non-custodial. Chaque transaction nécessite une autorisation physique de la carte, protégeant vos actifs contre tout accès non autorisé.'
        },
        {
          q: 'Combien de wallets puis-je créer par carte ?',
          a: 'Chaque carte peut générer jusqu’à 3 adresses de wallet par cryptomonnaie, vous offrant une grande flexibilité de gestion de portefeuille.'
        },
        {
          q: 'Est-ce un paiement unique ?',
          a: 'Oui ! L’achat de la carte est un paiement unique. Vous ne payez ensuite que les frais de transaction selon votre niveau lors de l’utilisation de la plateforme.'
        },
        {
          q: 'Quelle est la différence entre les niveaux ?',
          a: 'Les niveaux supérieurs offrent des frais plus bas, de meilleurs taux de swap, un support prioritaire et des fonctionnalités avancées comme l’accès API et un gestionnaire de compte dédié.'
        }
      ],
      tiers: {
        standard: {
          name: 'Carte NFC Standard',
          features: ['Puce NFC sécurisée', 'Authentification du wallet', 'Fonctions de sécurité de base', 'Compatible avec les principaux wallets', '1-2 wallets par crypto']
        },
        premium: {
          name: 'Carte NFC Premium',
          features: ['Puce de sécurité avancée', 'Support multi-signature', 'Design étanche', 'Garantie étendue', 'Support prioritaire', '3 wallets par crypto']
        },
        enterprise: {
          name: 'Carte NFC Entreprise',
          features: ['Chiffrement de niveau militaire', 'Support multi-wallet', 'Intégration biométrique', 'Personnalisation de marque disponible', 'Gestionnaire de compte dédié', 'Accès API', 'Wallets illimités']
        }
      }
    },
    de: {
      fetchFailed: 'Produkte konnten nicht geladen werden',
      unknownError: 'Unbekannter Fehler',
      waitProducts: 'Bitte warten, Produkte werden noch geladen...',
      noProductsAvailable: 'Keine Produkte verfügbar. Bitte sicherstellen, dass das Backend auf Port 5000 läuft.',
      productAdded: '✅ {name} zum Warenkorb hinzugefügt!',
      productNotFound: 'Produkt nicht gefunden. Bitte sicherstellen, dass das Backend läuft und Produkte angelegt wurden.',
      heroBadge: '🔐 SICHERER ZUGANG ERFORDERLICH',
      heroTitle: 'Hol dir deine hochsichere NFC-Karte',
      heroDescriptionLine1: 'Greife mit unseren NFC-Authentifizierungskarten in Militärqualität auf die vollständige Hybrid-Trading-Plattform von Summit Exchange zu.',
      heroDescriptionStrong: 'Kaufe deine Karte, um das komplette Dashboard freizuschalten.',
      miniCards: ['Dezentrale Börse', 'Peer-to-Peer-Handel', 'Non-Custodial Wallet'],
      chooseTierTitle: 'Wähle deine Zugangsstufe',
      chooseTierSubtitle: 'Jede Stufe schaltet unterschiedliche Gebührenstrukturen und Vorteile frei',
      mostPopular: '⭐ BELIEBTESTE WAHL',
      oneTime: 'einmalig',
      loadingProductsButton: 'Produkte werden geladen...',
      purchasePrefix: 'Kaufen',
      accessTitle: 'Darauf bekommst du Zugriff',
      accessFeatures: [
        { icon: '📊', title: 'Market Summit (MS)', desc: 'Echtzeit-Krypto-Tracking mit 0,01% Pufferzone von Investing.com' },
        { icon: '📤', title: 'Senden-Funktion', desc: 'Übertrage Krypto mit NFC-Autorisierung an Summit-Wallets oder externe Adressen' },
        { icon: '📥', title: 'Empfangen-Funktion', desc: 'Empfange Krypto aus jeder Quelle mit automatischer Synchronisierung' },
        { icon: '🔄', title: 'Swap-Funktion', desc: 'Sofortige Krypto-zu-Krypto-Swaps innerhalb von Summit Exchange' },
        { icon: '💰', title: 'Kaufen/Verkaufen', desc: 'Zugang zu mehreren Anbietern (Mercuryo, Coinbase) mit wettbewerbsfähigen Raten' },
        { icon: '🔐', title: 'NFC-Sicherheit', desc: 'Verschlüsselung in Militärqualität mit Challenge-Response-Authentifizierung' }
      ],
      faqTitle: 'Häufig gestellte Fragen',
      faqs: [
        {
          q: 'Warum brauche ich eine NFC-Karte?',
          a: 'Unsere NFC-Karten bieten Sicherheit in Militärqualität für dein Non-Custodial Wallet. Jede Transaktion erfordert eine physische Kartenautorisierung und schützt deine Assets vor unbefugtem Zugriff.'
        },
        {
          q: 'Wie viele Wallets kann ich pro Karte erstellen?',
          a: 'Jede Karte kann bis zu 3 Wallet-Adressen pro Kryptowährung erzeugen und gibt dir dadurch Flexibilität beim Portfolio-Management.'
        },
        {
          q: 'Ist das eine einmalige Zahlung?',
          a: 'Ja! Der Kartenkauf ist eine einmalige Gebühr. Danach zahlst du nur Transaktionsgebühren entsprechend deiner Stufe bei Nutzung der Plattform.'
        },
        {
          q: 'Was ist der Unterschied zwischen den Stufen?',
          a: 'Höhere Stufen bieten niedrigere Gebühren, bessere Swap-Kurse, priorisierten Support und erweiterte Funktionen wie API-Zugang und dedizierten Account Manager.'
        }
      ],
      tiers: {
        standard: {
          name: 'Standard NFC-Karte',
          features: ['Sicherer NFC-Chip', 'Wallet-Authentifizierung', 'Grundlegende Sicherheitsfunktionen', 'Kompatibel mit gängigen Wallets', '1-2 Wallets pro Krypto']
        },
        premium: {
          name: 'Premium NFC-Karte',
          features: ['Erweiterter Sicherheitschip', 'Multi-Signatur-Unterstützung', 'Wasserdichtes Design', 'Erweiterte Garantie', 'Priorisierter Support', '3 Wallets pro Krypto']
        },
        enterprise: {
          name: 'Enterprise NFC-Karte',
          features: ['Verschlüsselung in Militärqualität', 'Multi-Wallet-Unterstützung', 'Biometrie-Integration', 'Individuelles Branding verfügbar', 'Dedizierter Account Manager', 'API-Zugang', 'Unbegrenzte Wallets']
        }
      }
    }
  } as const;

  const t = copyByLocale[locale as keyof typeof copyByLocale] ?? copyByLocale.en;

  const tierTemplates = [
    {
      id: 'standard',
      tierKey: 'standard' as const,
      price: 29.99,
      color: 'from-gray-500 to-gray-700',
      highlight: false,
      backendType: 'standard'
    },
    {
      id: 'premium',
      tierKey: 'premium' as const,
      price: 49.99,
      color: 'from-blue-500 to-blue-700',
      highlight: false,
      backendType: 'premium'
    },
    {
      id: 'enterprise',
      tierKey: 'enterprise' as const,
      price: 99.99,
      color: 'from-purple-500 via-pink-500 to-orange-500',
      highlight: true,
      backendType: 'enterprise'
    }
  ];

  const cardTiers = tierTemplates.map((tier) => ({
    ...tier,
    name: t.tiers[tier.tierKey].name,
    features: t.tiers[tier.tierKey].features
  }));

  // Fetch products from backend
  useEffect(() => {
    async function loadProducts() {
      try {
        console.log('🔄 Fetching products from backend...');
        console.log('API URL:', process.env.NEXT_PUBLIC_API_BASE_URL || 'https://king-prawn-app-nv72k.ondigitalocean.app');
        
        const fetchedProducts = await fetchProducts();
        
        console.log('✅ Products fetched successfully:', fetchedProducts);
        console.log('Products count:', fetchedProducts.length);
        
        setProducts(fetchedProducts);
      } catch (error: any) {
        console.error('❌ Failed to load products:', error);
        toast.error(`${t.fetchFailed}: ${error?.message || t.unknownError}`);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, [t.fetchFailed, t.unknownError]);

  const handlePurchase = (tierId: string, tierBackendType: string) => {
    console.log('=== Purchase Debug ===');
    console.log('Products loaded:', products.length);
    console.log('All products:', products);
    console.log('Looking for cardType:', tierBackendType);
    
    // Check if products are loaded
    if (loading) {
      toast.error(t.waitProducts);
      return;
    }

    if (products.length === 0) {
      toast.error(t.noProductsAvailable);
      console.error('Backend might not be running or products not seeded');
      return;
    }

    // Find the matching product from backend based on card type
    const matchingProduct = products.find(p => {
      const cardType = p.cardType?.toLowerCase();
      console.log(`Checking product: ${p.name}, cardType: ${cardType}, match: ${cardType === tierBackendType.toLowerCase()}`);
      return cardType === tierBackendType.toLowerCase();
    });

    if (matchingProduct) {
      console.log('✅ Found product:', matchingProduct);
      // Add to cart
      addToCart(matchingProduct);
      toast.success(t.productAdded.replace('{name}', matchingProduct.name));
      // Navigate directly to checkout
      setTimeout(() => router.push(withLocalePath('/checkout')), 1000);
    } else {
      // If product not found, show error
      toast.error(t.productNotFound);
      console.log('❌ No matching product found');
      console.log('Available products:', products);
      console.log('Looking for cardType:', tierBackendType);
    }
  };

  return (
    <div style={{ 
      fontFamily: 'Inter, sans-serif',
      backgroundColor: '#0A1A2F',
      color: '#EBE2FF',
      minHeight: '100vh',
      paddingTop: '70px'
    }} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <Header />

      {/* Hero Section */}
      <section style={{
        padding: '80px 20px',
        textAlign: 'center',
        background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(0, 59, 252, 0.1) 100%)',
        borderBottom: '1px solid rgba(235, 226, 255, 0.1)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{
            display: 'inline-block',
            padding: '8px 20px',
            background: 'linear-gradient(45deg, #4CAF50, #003BFC)',
            borderRadius: '20px',
            fontSize: '14px',
            fontWeight: '600',
            marginBottom: '24px'
          }}>
            {t.heroBadge}
          </div>

          <h1 style={{
            fontSize: '48px',
            fontWeight: '700',
            marginBottom: '24px',
            background: 'linear-gradient(135deg, #4CAF50, #00D4FF)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            {t.heroTitle}
          </h1>

          <p style={{
            fontSize: '20px',
            color: 'rgba(235, 226, 255, 0.8)',
            maxWidth: '800px',
            margin: '0 auto 40px',
            lineHeight: '1.6'
          }}>
            {t.heroDescriptionLine1}
            <br />
            <strong style={{ color: '#4CAF50' }}>{t.heroDescriptionStrong}</strong>
          </p>

          <div style={{
            display: 'flex',
            gap: '16px',
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginTop: '40px'
          }}>
            <div style={{
              padding: '20px 30px',
              background: 'rgba(76, 175, 80, 0.1)',
              border: '1px solid rgba(76, 175, 80, 0.3)',
              borderRadius: '12px'
            }}>
              <div style={{ fontSize: '32px', fontWeight: '700', color: '#4CAF50' }}>🏦</div>
              <div style={{ fontSize: '14px', marginTop: '8px' }}>{t.miniCards[0]}</div>
            </div>
            <div style={{
              padding: '20px 30px',
              background: 'rgba(0, 212, 255, 0.1)',
              border: '1px solid rgba(0, 212, 255, 0.3)',
              borderRadius: '12px'
            }}>
              <div style={{ fontSize: '32px', fontWeight: '700', color: '#00D4FF' }}>🤝</div>
              <div style={{ fontSize: '14px', marginTop: '8px' }}>{t.miniCards[1]}</div>
            </div>
            <div style={{
              padding: '20px 30px',
              background: 'rgba(255, 152, 0, 0.1)',
              border: '1px solid rgba(255, 152, 0, 0.3)',
              borderRadius: '12px'
            }}>
              <div style={{ fontSize: '32px', fontWeight: '700', color: '#FF9800' }}>🔐</div>
              <div style={{ fontSize: '14px', marginTop: '8px' }}>{t.miniCards[2]}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section style={{
        padding: '80px 20px',
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        <h2 style={{
          fontSize: '36px',
          fontWeight: '700',
          textAlign: 'center',
          marginBottom: '16px'
        }}>
          {t.chooseTierTitle}
        </h2>
        <p style={{
          fontSize: '18px',
          color: 'rgba(235, 226, 255, 0.7)',
          textAlign: 'center',
          marginBottom: '60px'
        }}>
          {t.chooseTierSubtitle}
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px',
          marginBottom: '60px'
        }}>
          {cardTiers.map((tier) => (
            <div
              key={tier.id}
              style={{
                background: tier.highlight 
                  ? 'linear-gradient(135deg, rgba(156, 39, 176, 0.2) 0%, rgba(233, 30, 99, 0.2) 50%, rgba(255, 152, 0, 0.2) 100%)'
                  : 'rgba(255, 255, 255, 0.05)',
                border: tier.highlight 
                  ? '2px solid rgba(156, 39, 176, 0.5)'
                  : '1px solid rgba(235, 226, 255, 0.1)',
                borderRadius: '16px',
                padding: '32px',
                position: 'relative',
                transform: tier.highlight ? 'scale(1.05)' : 'scale(1)',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = tier.highlight ? 'scale(1.08)' : 'scale(1.03)';
                e.currentTarget.style.borderColor = tier.highlight 
                  ? 'rgba(156, 39, 176, 0.8)'
                  : 'rgba(76, 175, 80, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = tier.highlight ? 'scale(1.05)' : 'scale(1)';
                e.currentTarget.style.borderColor = tier.highlight 
                  ? 'rgba(156, 39, 176, 0.5)'
                  : 'rgba(235, 226, 255, 0.1)';
              }}
            >
              {tier.highlight && (
                <div style={{
                  position: 'absolute',
                  top: '-12px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'linear-gradient(45deg, #9C27B0, #E91E63)',
                  padding: '6px 20px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  letterSpacing: '1px'
                }}>
                  {t.mostPopular}
                </div>
              )}

              <div style={{
                width: '80px',
                height: '80px',
                background: `linear-gradient(135deg, ${tier.color})`,
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '36px',
                marginBottom: '24px'
              }}>
                💳
              </div>

              <h3 style={{
                fontSize: '24px',
                fontWeight: '700',
                marginBottom: '8px'
              }}>
                {tier.name}
              </h3>

              <div style={{
                fontSize: '42px',
                fontWeight: '700',
                marginBottom: '24px',
                color: '#4CAF50'
              }}>
                ${tier.price}
                <span style={{
                  fontSize: '16px',
                  color: 'rgba(235, 226, 255, 0.6)',
                  fontWeight: '400'
                }}> {t.oneTime}</span>
              </div>

              <ul style={{
                listStyle: 'none',
                padding: 0,
                margin: '0 0 32px 0'
              }}>
                {tier.features.map((feature, idx) => (
                  <li key={idx} style={{
                    padding: '12px 0',
                    borderBottom: '1px solid rgba(235, 226, 255, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    fontSize: '14px'
                  }}>
                    <span style={{ color: '#4CAF50', fontSize: '18px' }}>✓</span>
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handlePurchase(tier.id, tier.backendType)}
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '16px',
                  background: loading
                    ? 'rgba(150, 150, 150, 0.5)'
                    : tier.highlight
                    ? 'linear-gradient(45deg, #9C27B0, #E91E63, #FF9800)'
                    : 'linear-gradient(45deg, #4CAF50, #003BFC)',
                  border: 'none',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 15px rgba(76, 175, 80, 0.3)',
                  opacity: loading ? 0.6 : 1
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 25px rgba(76, 175, 80, 0.5)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading) {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(76, 175, 80, 0.3)';
                  }
                }}
              >
                {loading ? t.loadingProductsButton : `${t.purchasePrefix} ${tier.name}`}
              </button>
            </div>
          ))}
        </div>

        {/* What You Get Section */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(235, 226, 255, 0.1)',
          borderRadius: '16px',
          padding: '40px',
          marginTop: '60px'
        }}>
          <h3 style={{
            fontSize: '28px',
            fontWeight: '700',
            marginBottom: '32px',
            textAlign: 'center'
          }}>
            {t.accessTitle}
          </h3>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '24px'
          }}>
            {t.accessFeatures.map((feature, idx) => (
              <div key={idx} style={{
                padding: '24px',
                background: 'rgba(255, 255, 255, 0.03)',
                borderRadius: '12px',
                border: '1px solid rgba(235, 226, 255, 0.1)'
              }}>
                <div style={{ fontSize: '36px', marginBottom: '12px' }}>{feature.icon}</div>
                <h4 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>{feature.title}</h4>
                <p style={{ fontSize: '14px', color: 'rgba(235, 226, 255, 0.7)', lineHeight: '1.5' }}>
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div style={{
          marginTop: '60px',
          padding: '40px',
          background: 'rgba(76, 175, 80, 0.05)',
          border: '1px solid rgba(76, 175, 80, 0.2)',
          borderRadius: '16px'
        }}>
          <h3 style={{
            fontSize: '28px',
            fontWeight: '700',
            marginBottom: '32px',
            textAlign: 'center'
          }}>
            {t.faqTitle}
          </h3>

          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            {t.faqs.map((faq, idx) => (
              <div key={idx} style={{
                padding: '20px 0',
                borderBottom: idx < 3 ? '1px solid rgba(235, 226, 255, 0.1)' : 'none'
              }}>
                <h4 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px', color: '#4CAF50' }}>
                  {faq.q}
                </h4>
                <p style={{ fontSize: '16px', color: 'rgba(235, 226, 255, 0.8)', lineHeight: '1.6' }}>
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
