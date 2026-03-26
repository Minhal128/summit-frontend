'use client';

import React, { useState } from 'react';
import { useLocale } from 'next-intl';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CTASection from '@/components/CTASection';
import StatsTicker from '@/components/StatsTicker';
import { HelpCircle, CloudCog } from 'lucide-react';
import './academy.css';

export default function AcademyPage() {
  const locale = useLocale();
  const [activeTab, setActiveTab] = useState<'guides' | 'support' | 'learn'>('guides');

  const copyByLocale = {
    en: {
      badge: 'Academy',
      title: 'Master the Art of Secure Finance',
      subtitle:
        'Learn everything you need to know about protecting, managing, and growing your assets with our comprehensive, easy-to-follow guides and tutorials.',
      stepGuideTitle: 'Your Step-by-Step Guide',
      stepGuideDescription:
        'Navigate and master through clear instructions, practical tips, and expert advice, perfect for both beginners and advanced users.',
      tabs: { guides: 'Guides', support: 'Support', learn: 'Learn' },
      logisticsTitle: 'Logistics',
      logisticsSubtitle: 'Order status, shipping, and returns',
      troubleshootingTitle: 'Troubleshooting',
      troubleshootingSubtitle: 'Learn everything you need to store, manage',
      learnTitle: 'Learning Resources',
      learnSubtitle: 'Comprehensive tutorials and educational content coming soon.',
      learnCardTitle: 'Educational Content',
      learnCardDescription: 'Interactive courses, video tutorials, and in-depth guides to help you master cryptocurrency security.',
      logisticsFaqs: [
        { question: 'Can I add an item to an existing order?', answer: 'Step-by-step guidance on how to safely recover your account if you lose your keys or device.' },
        { question: 'Can I change my invoice?', answer: 'Explore expert tips to keep your funds safe from phishing, scams, and unauthorized access.' },
        { question: 'Can I get a discount?', answer: 'Find quick fixes for common issues like delayed transfers, failed payments, or syncing problems.' },
        { question: 'Device Compatibility', answer: 'Learn the best way to reach our support team and get fast, reliable help when you need it most.' }
      ],
      troubleshootingFaqs: [
        { question: 'Common hardware issues', answer: 'Learn how to create, back up, and secure your cold wallet in just a few steps.' },
        { question: 'Can I reverse a transaction?', answer: 'A simple walkthrough on transferring funds safely and efficiently.' },
        { question: 'How to avoid poisoning attacks?', answer: 'Discover how to organize, track, and diversify your crypto portfolio.' },
        { question: 'Best Security Practices', answer: 'Learn the best way to reach our support team and get fast, reliable help when you need it most.' }
      ],
      guides: [
        { title: 'Supported Assets', items: ['Receiving Assets', 'Security Best Practices', 'Troubleshooting Transactions', 'Device Compatibility'] },
        { title: 'Master Cold Wallet Security', items: ['Setting Up Your Wallet', 'Sending and Receiving Crypto', 'Managing Multiple Accounts', 'Best Security Practices'] },
        { title: 'Master Cold Wallet Security', items: ['Setting Up Your Wallet', 'Sending and Receiving Crypto', 'Managing Multiple Accounts', 'Best Security Practices'] },
        { title: 'Supported Assets', items: ['Receiving Assets', 'Security Best Practices', 'Troubleshooting Transactions', 'Device Compatibility'] }
      ]
    },
    zh: {
      badge: '学院',
      title: '掌握安全金融的艺术',
      subtitle: '通过全面易懂的指南与教程，学习如何保护、管理并增长您的资产。',
      stepGuideTitle: '分步学习指南',
      stepGuideDescription: '通过清晰说明、实用技巧和专家建议，帮助新手与进阶用户快速上手。',
      tabs: { guides: '指南', support: '支持', learn: '学习' },
      logisticsTitle: '物流与订单',
      logisticsSubtitle: '订单状态、配送与退货',
      troubleshootingTitle: '问题排查',
      troubleshootingSubtitle: '学习如何安全存储与管理资产',
      learnTitle: '学习资源',
      learnSubtitle: '全面教程与教育内容即将上线。',
      learnCardTitle: '教育内容',
      learnCardDescription: '互动课程、视频教程和深度指南，帮助您掌握加密安全。',
      logisticsFaqs: [
        { question: '我可以在已有订单中添加商品吗？', answer: '如果丢失密钥或设备，可通过分步指导安全恢复账户。' },
        { question: '我可以修改发票吗？', answer: '查看专家建议，防范钓鱼、诈骗和未授权访问。' },
        { question: '我可以获得折扣吗？', answer: '快速解决延迟转账、支付失败或同步问题。' },
        { question: '设备兼容性', answer: '了解如何快速联系支持团队并获得可靠帮助。' }
      ],
      troubleshootingFaqs: [
        { question: '常见硬件问题', answer: '学习如何在几步内创建、备份并保护冷钱包。' },
        { question: '交易可以撤销吗？', answer: '安全高效转账的简明操作指南。' },
        { question: '如何避免地址投毒攻击？', answer: '了解如何整理、追踪并分散您的加密资产组合。' },
        { question: '最佳安全实践', answer: '了解如何联系支持团队并获得快速帮助。' }
      ],
      guides: [
        { title: '支持资产', items: ['接收资产', '安全最佳实践', '交易故障排查', '设备兼容性'] },
        { title: '掌握冷钱包安全', items: ['设置钱包', '收发加密资产', '管理多个账户', '最佳安全实践'] },
        { title: '掌握冷钱包安全', items: ['设置钱包', '收发加密资产', '管理多个账户', '最佳安全实践'] },
        { title: '支持资产', items: ['接收资产', '安全最佳实践', '交易故障排查', '设备兼容性'] }
      ]
    },
    ar: {
      badge: 'الأكاديمية',
      title: 'أتقن فن التمويل الآمن',
      subtitle: 'تعلّم كل ما تحتاجه لحماية أصولك وإدارتها وتنميتها عبر أدلة ودروس سهلة.',
      stepGuideTitle: 'دليلك خطوة بخطوة',
      stepGuideDescription: 'تعلّم عبر إرشادات واضحة ونصائح عملية ومحتوى مناسب للمبتدئين والمحترفين.',
      tabs: { guides: 'الأدلة', support: 'الدعم', learn: 'التعلّم' },
      logisticsTitle: 'الخدمات اللوجستية',
      logisticsSubtitle: 'حالة الطلب والشحن والإرجاع',
      troubleshootingTitle: 'استكشاف الأخطاء',
      troubleshootingSubtitle: 'تعلّم كل ما تحتاجه للتخزين والإدارة',
      learnTitle: 'موارد التعلّم',
      learnSubtitle: 'دروس تعليمية ومحتوى شامل قريبًا.',
      learnCardTitle: 'محتوى تعليمي',
      learnCardDescription: 'دورات تفاعلية وفيديوهات ودلائل متعمقة لإتقان أمان العملات الرقمية.',
      logisticsFaqs: [
        { question: 'هل يمكنني إضافة عنصر إلى طلب قائم؟', answer: 'إرشاد خطوة بخطوة لاستعادة حسابك بأمان عند فقدان المفاتيح أو الجهاز.' },
        { question: 'هل يمكنني تعديل الفاتورة؟', answer: 'نصائح خبراء لحماية أموالك من التصيد والاحتيال والوصول غير المصرح.' },
        { question: 'هل يمكنني الحصول على خصم؟', answer: 'حلول سريعة لمشكلات شائعة مثل تأخر التحويل أو فشل الدفع.' },
        { question: 'توافق الأجهزة', answer: 'أفضل طريقة للوصول إلى فريق الدعم بسرعة وموثوقية.' }
      ],
      troubleshootingFaqs: [
        { question: 'مشكلات الأجهزة الشائعة', answer: 'تعلّم إنشاء محفظتك الباردة ونسخها احتياطيًا وتأمينها بخطوات بسيطة.' },
        { question: 'هل يمكن عكس المعاملة؟', answer: 'دليل مبسط لتحويل الأموال بأمان وكفاءة.' },
        { question: 'كيف أتجنب هجمات تسميم العناوين؟', answer: 'اكتشف كيفية تنظيم وتتبع وتنويع محفظتك الرقمية.' },
        { question: 'أفضل ممارسات الأمان', answer: 'تعلّم أفضل طريقة للتواصل مع الدعم عند الحاجة.' }
      ],
      guides: [
        { title: 'الأصول المدعومة', items: ['استلام الأصول', 'أفضل ممارسات الأمان', 'استكشاف مشكلات المعاملات', 'توافق الأجهزة'] },
        { title: 'إتقان أمان المحفظة الباردة', items: ['إعداد المحفظة', 'إرسال واستلام العملات', 'إدارة حسابات متعددة', 'أفضل ممارسات الأمان'] },
        { title: 'إتقان أمان المحفظة الباردة', items: ['إعداد المحفظة', 'إرسال واستلام العملات', 'إدارة حسابات متعددة', 'أفضل ممارسات الأمان'] },
        { title: 'الأصول المدعومة', items: ['استلام الأصول', 'أفضل ممارسات الأمان', 'استكشاف مشكلات المعاملات', 'توافق الأجهزة'] }
      ]
    },
    ru: {
      badge: 'АКАДЕМИЯ',
      title: 'Освойте искусство безопасных финансов',
      subtitle: 'Узнайте всё о защите, управлении и росте активов с нашими понятными руководствами.',
      stepGuideTitle: 'Пошаговое руководство',
      stepGuideDescription: 'Чёткие инструкции, практические советы и экспертные рекомендации для всех уровней.',
      tabs: { guides: 'Гайды', support: 'Поддержка', learn: 'Обучение' },
      logisticsTitle: 'Логистика',
      logisticsSubtitle: 'Статус заказа, доставка и возвраты',
      troubleshootingTitle: 'Устранение проблем',
      troubleshootingSubtitle: 'Всё, что нужно для хранения и управления',
      learnTitle: 'Образовательные ресурсы',
      learnSubtitle: 'Подробные учебные материалы скоро появятся.',
      learnCardTitle: 'Обучающий контент',
      learnCardDescription: 'Интерактивные курсы, видеоуроки и гайды по безопасности криптовалют.',
      logisticsFaqs: [
        { question: 'Можно ли добавить товар в существующий заказ?', answer: 'Пошаговое восстановление доступа при потере ключей или устройства.' },
        { question: 'Можно ли изменить счёт?', answer: 'Советы экспертов для защиты от фишинга и мошенничества.' },
        { question: 'Можно получить скидку?', answer: 'Быстрые решения задержек переводов, ошибок оплаты и синхронизации.' },
        { question: 'Совместимость устройств', answer: 'Как быстро связаться с поддержкой и получить помощь.' }
      ],
      troubleshootingFaqs: [
        { question: 'Распространённые аппаратные проблемы', answer: 'Узнайте, как создать, сохранить и защитить холодный кошелёк за несколько шагов.' },
        { question: 'Можно ли отменить транзакцию?', answer: 'Простая инструкция по безопасным переводам.' },
        { question: 'Как избежать poisoning-атак?', answer: 'Как организовать, отслеживать и диверсифицировать портфель.' },
        { question: 'Лучшие практики безопасности', answer: 'Лучший способ быстро получить помощь от команды поддержки.' }
      ],
      guides: [
        { title: 'Поддерживаемые активы', items: ['Получение активов', 'Лучшие практики безопасности', 'Устранение проблем транзакций', 'Совместимость устройств'] },
        { title: 'Безопасность холодного кошелька', items: ['Настройка кошелька', 'Отправка и получение криптовалюты', 'Управление несколькими аккаунтами', 'Лучшие практики безопасности'] },
        { title: 'Безопасность холодного кошелька', items: ['Настройка кошелька', 'Отправка и получение криптовалюты', 'Управление несколькими аккаунтами', 'Лучшие практики безопасности'] },
        { title: 'Поддерживаемые активы', items: ['Получение активов', 'Лучшие практики безопасности', 'Устранение проблем транзакций', 'Совместимость устройств'] }
      ]
    },
    th: {
      badge: 'อะคาเดมี',
      title: 'เชี่ยวชาญศิลปะแห่งการเงินที่ปลอดภัย',
      subtitle: 'เรียนรู้การปกป้อง จัดการ และเพิ่มมูลค่าสินทรัพย์ของคุณด้วยคู่มือที่เข้าใจง่าย',
      stepGuideTitle: 'คู่มือทีละขั้นตอน',
      stepGuideDescription: 'เรียนรู้จากคำแนะนำที่ชัดเจน เคล็ดลับใช้งานจริง และคำแนะนำจากผู้เชี่ยวชาญ',
      tabs: { guides: 'คู่มือ', support: 'ซัพพอร์ต', learn: 'เรียนรู้' },
      logisticsTitle: 'โลจิสติกส์',
      logisticsSubtitle: 'สถานะคำสั่งซื้อ การจัดส่ง และการคืนสินค้า',
      troubleshootingTitle: 'การแก้ไขปัญหา',
      troubleshootingSubtitle: 'เรียนรู้ทุกอย่างที่จำเป็นสำหรับการจัดเก็บและจัดการ',
      learnTitle: 'แหล่งเรียนรู้',
      learnSubtitle: 'บทเรียนและเนื้อหาการเรียนรู้กำลังจะมาเร็ว ๆ นี้',
      learnCardTitle: 'เนื้อหาการศึกษา',
      learnCardDescription: 'คอร์สแบบโต้ตอบ วิดีโอสอน และคู่มือเชิงลึกเพื่อความปลอดภัยคริปโต',
      logisticsFaqs: [
        { question: 'เพิ่มรายการในคำสั่งซื้อเดิมได้ไหม?', answer: 'คำแนะนำทีละขั้นตอนในการกู้คืนบัญชีอย่างปลอดภัยเมื่อทำคีย์หรืออุปกรณ์หาย' },
        { question: 'แก้ไขใบแจ้งหนี้ได้ไหม?', answer: 'เคล็ดลับจากผู้เชี่ยวชาญเพื่อป้องกันฟิชชิง การหลอกลวง และการเข้าถึงที่ไม่ได้รับอนุญาต' },
        { question: 'ขอส่วนลดได้ไหม?', answer: 'วิธีแก้ปัญหาอย่างรวดเร็วสำหรับการโอนล่าช้า การชำระเงินล้มเหลว หรือการซิงก์ผิดพลาด' },
        { question: 'ความเข้ากันได้ของอุปกรณ์', answer: 'วิธีที่ดีที่สุดในการติดต่อทีมซัพพอร์ตและรับความช่วยเหลืออย่างรวดเร็ว' }
      ],
      troubleshootingFaqs: [
        { question: 'ปัญหาฮาร์ดแวร์ที่พบบ่อย', answer: 'เรียนรู้การสร้าง สำรอง และปกป้องกระเป๋าเงินเย็นได้ในไม่กี่ขั้นตอน' },
        { question: 'ย้อนธุรกรรมได้ไหม?', answer: 'คู่มือแบบง่ายสำหรับการโอนเงินอย่างปลอดภัยและมีประสิทธิภาพ' },
        { question: 'หลีกเลี่ยงการโจมตี poisoning อย่างไร?', answer: 'ค้นพบวิธีจัดระเบียบ ติดตาม และกระจายพอร์ตคริปโตของคุณ' },
        { question: 'แนวทางความปลอดภัยที่ดีที่สุด', answer: 'เรียนรู้วิธีติดต่อซัพพอร์ตเพื่อรับความช่วยเหลือที่เชื่อถือได้' }
      ],
      guides: [
        { title: 'สินทรัพย์ที่รองรับ', items: ['รับสินทรัพย์', 'แนวทางความปลอดภัยที่ดีที่สุด', 'แก้ไขปัญหาธุรกรรม', 'ความเข้ากันได้ของอุปกรณ์'] },
        { title: 'เชี่ยวชาญความปลอดภัยกระเป๋าเย็น', items: ['ตั้งค่ากระเป๋าเงิน', 'ส่งและรับคริปโต', 'จัดการหลายบัญชี', 'แนวทางความปลอดภัยที่ดีที่สุด'] },
        { title: 'เชี่ยวชาญความปลอดภัยกระเป๋าเย็น', items: ['ตั้งค่ากระเป๋าเงิน', 'ส่งและรับคริปโต', 'จัดการหลายบัญชี', 'แนวทางความปลอดภัยที่ดีที่สุด'] },
        { title: 'สินทรัพย์ที่รองรับ', items: ['รับสินทรัพย์', 'แนวทางความปลอดภัยที่ดีที่สุด', 'แก้ไขปัญหาธุรกรรม', 'ความเข้ากันได้ของอุปกรณ์'] }
      ]
    },
    es: {
      badge: 'ACADEMIA',
      title: 'Domina el arte de las finanzas seguras',
      subtitle: 'Aprende todo lo necesario para proteger, gestionar y hacer crecer tus activos con guías claras.',
      stepGuideTitle: 'Tu guía paso a paso',
      stepGuideDescription: 'Instrucciones claras, consejos prácticos y recomendaciones expertas para todos los niveles.',
      tabs: { guides: 'Guías', support: 'Soporte', learn: 'Aprender' },
      logisticsTitle: 'Logística',
      logisticsSubtitle: 'Estado del pedido, envíos y devoluciones',
      troubleshootingTitle: 'Solución de problemas',
      troubleshootingSubtitle: 'Todo lo que necesitas para almacenar y gestionar',
      learnTitle: 'Recursos de aprendizaje',
      learnSubtitle: 'Próximamente: tutoriales y contenido educativo completo.',
      learnCardTitle: 'Contenido educativo',
      learnCardDescription: 'Cursos interactivos, videos y guías detalladas para dominar la seguridad cripto.',
      logisticsFaqs: [
        { question: '¿Puedo agregar un artículo a un pedido existente?', answer: 'Guía paso a paso para recuperar tu cuenta de forma segura si pierdes tus claves o dispositivo.' },
        { question: '¿Puedo cambiar mi factura?', answer: 'Consejos expertos para proteger tus fondos de phishing, estafas y accesos no autorizados.' },
        { question: '¿Puedo obtener un descuento?', answer: 'Soluciones rápidas para transferencias tardías, pagos fallidos o problemas de sincronización.' },
        { question: 'Compatibilidad de dispositivos', answer: 'La mejor forma de contactar a soporte y recibir ayuda rápida y confiable.' }
      ],
      troubleshootingFaqs: [
        { question: 'Problemas comunes de hardware', answer: 'Aprende a crear, respaldar y asegurar tu cold wallet en pocos pasos.' },
        { question: '¿Puedo revertir una transacción?', answer: 'Guía simple para transferir fondos de forma segura y eficiente.' },
        { question: '¿Cómo evitar ataques de poisoning?', answer: 'Descubre cómo organizar, rastrear y diversificar tu portafolio cripto.' },
        { question: 'Mejores prácticas de seguridad', answer: 'La mejor manera de contactar a soporte y recibir ayuda confiable.' }
      ],
      guides: [
        { title: 'Activos compatibles', items: ['Recepción de activos', 'Mejores prácticas de seguridad', 'Solución de transacciones', 'Compatibilidad de dispositivos'] },
        { title: 'Domina la seguridad de cold wallet', items: ['Configurar tu wallet', 'Enviar y recibir cripto', 'Gestionar múltiples cuentas', 'Mejores prácticas de seguridad'] },
        { title: 'Domina la seguridad de cold wallet', items: ['Configurar tu wallet', 'Enviar y recibir cripto', 'Gestionar múltiples cuentas', 'Mejores prácticas de seguridad'] },
        { title: 'Activos compatibles', items: ['Recepción de activos', 'Mejores prácticas de seguridad', 'Solución de transacciones', 'Compatibilidad de dispositivos'] }
      ]
    },
    fr: {
      badge: 'ACADÉMIE',
      title: 'Maîtrisez l’art de la finance sécurisée',
      subtitle: 'Apprenez à protéger, gérer et développer vos actifs grâce à des guides clairs et complets.',
      stepGuideTitle: 'Votre guide étape par étape',
      stepGuideDescription: 'Instructions claires, conseils pratiques et expertise pour débutants et avancés.',
      tabs: { guides: 'Guides', support: 'Support', learn: 'Apprendre' },
      logisticsTitle: 'Logistique',
      logisticsSubtitle: 'Statut de commande, livraison et retours',
      troubleshootingTitle: 'Dépannage',
      troubleshootingSubtitle: 'Tout ce dont vous avez besoin pour stocker et gérer',
      learnTitle: 'Ressources pédagogiques',
      learnSubtitle: 'Tutoriels complets et contenu éducatif bientôt disponibles.',
      learnCardTitle: 'Contenu éducatif',
      learnCardDescription: 'Cours interactifs, vidéos et guides approfondis pour maîtriser la sécurité crypto.',
      logisticsFaqs: [
        { question: 'Puis-je ajouter un article à une commande existante ?', answer: 'Guide étape par étape pour récupérer votre compte en cas de perte de clés ou d’appareil.' },
        { question: 'Puis-je modifier ma facture ?', answer: 'Conseils d’experts pour protéger vos fonds contre le phishing et les arnaques.' },
        { question: 'Puis-je obtenir une réduction ?', answer: 'Solutions rapides pour les transferts retardés, paiements échoués ou problèmes de synchronisation.' },
        { question: 'Compatibilité des appareils', answer: 'La meilleure façon de contacter notre support et d’obtenir une aide rapide.' }
      ],
      troubleshootingFaqs: [
        { question: 'Problèmes matériels courants', answer: 'Apprenez à créer, sauvegarder et sécuriser votre cold wallet en quelques étapes.' },
        { question: 'Puis-je annuler une transaction ?', answer: 'Un guide simple pour transférer des fonds en toute sécurité.' },
        { question: 'Comment éviter les attaques de poisoning ?', answer: 'Découvrez comment organiser, suivre et diversifier votre portefeuille crypto.' },
        { question: 'Bonnes pratiques de sécurité', answer: 'La meilleure façon de joindre notre support et d’obtenir une aide fiable.' }
      ],
      guides: [
        { title: 'Actifs pris en charge', items: ['Réception d’actifs', 'Bonnes pratiques de sécurité', 'Dépannage des transactions', 'Compatibilité des appareils'] },
        { title: 'Maîtrisez la sécurité cold wallet', items: ['Configurer votre wallet', 'Envoyer et recevoir des cryptos', 'Gérer plusieurs comptes', 'Bonnes pratiques de sécurité'] },
        { title: 'Maîtrisez la sécurité cold wallet', items: ['Configurer votre wallet', 'Envoyer et recevoir des cryptos', 'Gérer plusieurs comptes', 'Bonnes pratiques de sécurité'] },
        { title: 'Actifs pris en charge', items: ['Réception d’actifs', 'Bonnes pratiques de sécurité', 'Dépannage des transactions', 'Compatibilité des appareils'] }
      ]
    },
    de: {
      badge: 'AKADEMIE',
      title: 'Meistere die Kunst sicherer Finanzen',
      subtitle: 'Lerne alles über Schutz, Verwaltung und Wachstum deiner Assets mit leicht verständlichen Leitfäden.',
      stepGuideTitle: 'Dein Schritt-für-Schritt-Guide',
      stepGuideDescription: 'Klare Anleitungen, praktische Tipps und Expertenwissen für Einsteiger und Profis.',
      tabs: { guides: 'Leitfäden', support: 'Support', learn: 'Lernen' },
      logisticsTitle: 'Logistik',
      logisticsSubtitle: 'Bestellstatus, Versand und Rückgabe',
      troubleshootingTitle: 'Fehlerbehebung',
      troubleshootingSubtitle: 'Alles, was du zum Speichern und Verwalten brauchst',
      learnTitle: 'Lernressourcen',
      learnSubtitle: 'Umfassende Tutorials und Lerninhalte folgen in Kürze.',
      learnCardTitle: 'Lerninhalte',
      learnCardDescription: 'Interaktive Kurse, Video-Tutorials und tiefgehende Guides zur Krypto-Sicherheit.',
      logisticsFaqs: [
        { question: 'Kann ich einen Artikel zu einer bestehenden Bestellung hinzufügen?', answer: 'Schritt-für-Schritt-Anleitung zur sicheren Wiederherstellung deines Kontos.' },
        { question: 'Kann ich meine Rechnung ändern?', answer: 'Expertentipps zum Schutz vor Phishing, Betrug und unbefugtem Zugriff.' },
        { question: 'Kann ich einen Rabatt erhalten?', answer: 'Schnelle Lösungen für verzögerte Überweisungen, fehlgeschlagene Zahlungen oder Sync-Probleme.' },
        { question: 'Gerätekompatibilität', answer: 'So erreichst du unser Support-Team schnell und zuverlässig.' }
      ],
      troubleshootingFaqs: [
        { question: 'Häufige Hardware-Probleme', answer: 'Erfahre, wie du deine Cold Wallet in wenigen Schritten einrichtest und sicherst.' },
        { question: 'Kann ich eine Transaktion rückgängig machen?', answer: 'Einfache Anleitung zum sicheren und effizienten Übertragen von Geldern.' },
        { question: 'Wie vermeide ich Poisoning-Angriffe?', answer: 'Lerne, wie du dein Krypto-Portfolio organisierst, verfolgst und diversifizierst.' },
        { question: 'Beste Sicherheitspraktiken', answer: 'Der beste Weg, unser Support-Team schnell zu erreichen.' }
      ],
      guides: [
        { title: 'Unterstützte Assets', items: ['Assets empfangen', 'Beste Sicherheitspraktiken', 'Transaktionsprobleme beheben', 'Gerätekompatibilität'] },
        { title: 'Cold-Wallet-Sicherheit meistern', items: ['Wallet einrichten', 'Krypto senden und empfangen', 'Mehrere Konten verwalten', 'Beste Sicherheitspraktiken'] },
        { title: 'Cold-Wallet-Sicherheit meistern', items: ['Wallet einrichten', 'Krypto senden und empfangen', 'Mehrere Konten verwalten', 'Beste Sicherheitspraktiken'] },
        { title: 'Unterstützte Assets', items: ['Assets empfangen', 'Beste Sicherheitspraktiken', 'Transaktionsprobleme beheben', 'Gerätekompatibilität'] }
      ]
    }
  } as const;

  const t = copyByLocale[locale as keyof typeof copyByLocale] ?? copyByLocale.en;

  return (
    <div className="academy-page">
      <Header />

      

      {/* Academy Header - Centered */}
      <section className="academy-header">
        <div className="academy-header-content">
          <p className="academy-badge">{t.badge}</p>
          <h1 className="academy-title">
            {t.title}
          </h1>
          <p className="academy-subtitle">
            {t.subtitle}
          </p>
        </div>
      </section>

      {/* Video Player - Centered */}
      <section className="academy-video-section">
        <div className="academy-video-container">
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-cyan-500/20 to-blue-600/20 p-1">
            <div className="relative bg-[#0A1A2F] rounded-xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=2832&auto=format&fit=crop&ixlib=rb-4.0.3"
                alt="Cryptocurrency and blockchain technology"
                className="w-full h-[300px] md:h-[400px] lg:h-[500px] object-cover opacity-60"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A1A2F]/80 via-transparent to-[#0A1A2F]/40" />
              {/* Play button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <button className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300 hover:scale-110 border border-white/20">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-10 h-10 md:w-12 md:h-12 ml-1"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.647c1.295.748 1.295 2.535 0 3.284L7.279 20.99c-1.25.722-2.779-.217-2.779-1.643V5.653z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
              {/* BitBox02 branding overlay */}
              <div className="absolute bottom-6 left-6">
                <div className="text-white/60 text-4xl md:text-6xl font-bold tracking-wider">BitBox02</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Guides Section - Centered */}
      <section className="academy-guides-section">
        <div className="academy-guides-container">
          {/* Section Header */}
          <div className="academy-section-header">
            <h2 className="academy-section-title">{t.stepGuideTitle}</h2>
            <p className="academy-section-description">
              {t.stepGuideDescription}
            </p>
          </div>

          {/* Tabs */}
          <div className="academy-tabs-container">
            <div className="academy-tabs">
              {[
                { id: 'guides', label: t.tabs.guides },
                { id: 'support', label: t.tabs.support },
                { id: 'learn', label: t.tabs.learn }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as 'guides' | 'support' | 'learn')}
                  className={`academy-tab ${activeTab === tab.id ? "active" : "inactive"}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Support Content - Two Equal Boxes */}
          {activeTab === 'support' && (
            <div className="academy-content-section">
              <div className="academy-support-container">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  {/* Logistics Box */}
                  <div className="bg-[#102037] border border-slate-700 rounded-2xl p-8 h-full flex flex-col">
                    <div className="flex items-center gap-6 mb-8">
                      <div className="bg-blue-500/10 p-4 rounded-xl border border-blue-500/30">
                        <CloudCog className="w-8 h-8 text-blue-400" />
                      </div>
                      <div>
                        <h2 className="text-3xl font-bold text-white mb-2">{t.logisticsTitle}</h2>
                        <p className="text-slate-400 text-lg">{t.logisticsSubtitle}</p>
                      </div>
                    </div>
                    <div className="space-y-4 flex-1">
                      {t.logisticsFaqs.map((faq, index) => (
                        <a
                          key={index}
                          href="#"
                          className="flex items-start gap-6 p-6 rounded-xl hover:bg-slate-700/30 transition-colors group"
                        >
                          <HelpCircle className="w-7 h-7 mt-1 text-slate-400 flex-shrink-0 group-hover:text-blue-400" />
                          <div className="space-y-3">
                            <h3 className="text-lg font-semibold text-white group-hover:text-blue-400">
                              {faq.question}
                            </h3>
                            <p className="text-slate-400 leading-relaxed">{faq.answer}</p>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>

                  {/* Troubleshooting Box */}
                  <div className="bg-[#102037] border border-slate-700 rounded-2xl p-8 h-full flex flex-col">
                    <div className="flex items-center gap-6 mb-8">
                      <div className="bg-blue-500/10 p-4 rounded-xl border border-blue-500/30">
                        <CloudCog className="w-8 h-8 text-blue-400" />
                      </div>
                      <div>
                        <h2 className="text-3xl font-bold text-white mb-2">{t.troubleshootingTitle}</h2>
                        <p className="text-slate-400 text-lg">{t.troubleshootingSubtitle}</p>
                      </div>
                    </div>
                    <div className="space-y-4 flex-1">
                      {t.troubleshootingFaqs.map((faq, index) => (
                        <a
                          key={index}
                          href="#"
                          className="flex items-start gap-6 p-6 rounded-xl hover:bg-slate-700/30 transition-colors group"
                        >
                          <HelpCircle className="w-7 h-7 mt-1 text-slate-400 flex-shrink-0 group-hover:text-blue-400" />
                          <div className="space-y-3">
                            <h3 className="text-lg font-semibold text-white group-hover:text-blue-400">
                              {faq.question}
                            </h3>
                            <p className="text-slate-400 leading-relaxed">{faq.answer}</p>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Guide Cards Grid */}
          {activeTab === 'guides' && (
            <div className="academy-guides-grid">
              {t.guides.map((guide, i) => (
                <div
                  key={i}
                  className="bg-[#1A202C]/50 border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-colors"
                >
                  {/* Card Header */}
                  <div className="flex items-center gap-3 mb-6 p-2">
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold text-white">{guide.title}</h3>
                  </div>

                  {/* Card Items */}
                  <ul className="space-y-3">
                    {guide.items.map((item, j) => (
                      <li key={j} className="flex items-start gap-3 group">
                        <div className="w-5 h-5 bg-green-500/20 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0 ml-6">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className="w-3 h-3 text-green-400"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-gray-300 text-sm leading-relaxed group-hover:text-white transition-colors">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {/* Learn Content */}
          {activeTab === 'learn' && (
            <div className="academy-content-section">
              <div className="academy-learn-container">
                <h2 className="text-3xl font-bold text-white mb-6">{t.learnTitle}</h2>
                <p className="text-gray-400 mb-8">{t.learnSubtitle}</p>
                <div className="bg-[#102037] border border-slate-700 rounded-2xl p-8">
                  <div className="text-6xl mb-4">📚</div>
                  <h3 className="text-xl font-semibold text-white mb-2">{t.learnCardTitle}</h3>
                  <p className="text-gray-400">{t.learnCardDescription}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Stats Ticker */}
      <StatsTicker />

      {/* CTA Section */}
      <CTASection />

      {/* Footer */}
      <Footer />
    </div>
  )
}
