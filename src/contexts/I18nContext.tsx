"use client"

import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react"

// Supported languages
export const SUPPORTED_LANGUAGES = [
  { code: "en", name: "English", flag: "🇺🇸", dir: "ltr" },
  { code: "zh", name: "中文", flag: "🇨🇳", dir: "ltr" },
  { code: "ms", name: "Bahasa Melayu", flag: "🇲🇾", dir: "ltr" },
  { code: "ja", name: "日本語", flag: "🇯🇵", dir: "ltr" },
  { code: "ko", name: "한국어", flag: "🇰🇷", dir: "ltr" },
  { code: "es", name: "Español", flag: "🇪🇸", dir: "ltr" },
  { code: "fr", name: "Français", flag: "🇫🇷", dir: "ltr" },
  { code: "de", name: "Deutsch", flag: "🇩🇪", dir: "ltr" },
  { code: "pt", name: "Português", flag: "🇧🇷", dir: "ltr" },
  { code: "ru", name: "Русский", flag: "🇷🇺", dir: "ltr" },
  { code: "ar", name: "العربية", flag: "🇸🇦", dir: "rtl" },
  { code: "hi", name: "हिन्दी", flag: "🇮🇳", dir: "ltr" },
  { code: "th", name: "ไทย", flag: "🇹🇭", dir: "ltr" },
  { code: "vi", name: "Tiếng Việt", flag: "🇻🇳", dir: "ltr" },
  { code: "id", name: "Bahasa Indonesia", flag: "🇮🇩", dir: "ltr" },
  { code: "tr", name: "Türkçe", flag: "🇹🇷", dir: "ltr" },
  { code: "it", name: "Italiano", flag: "🇮🇹", dir: "ltr" },
  { code: "nl", name: "Nederlands", flag: "🇳🇱", dir: "ltr" },
  { code: "pl", name: "Polski", flag: "🇵🇱", dir: "ltr" },
  { code: "tl", name: "Filipino", flag: "🇵🇭", dir: "ltr" },
] as const

export type LanguageCode = typeof SUPPORTED_LANGUAGES[number]["code"]

// Translation keys grouped by section
export type TranslationKeys = {
  // Common
  "common.loading": string
  "common.error": string
  "common.success": string
  "common.cancel": string
  "common.confirm": string
  "common.save": string
  "common.delete": string
  "common.search": string
  "common.filter": string
  "common.refresh": string
  "common.back": string
  "common.next": string
  "common.submit": string
  "common.close": string
  "common.yes": string
  "common.no": string
  
  // Navigation
  "nav.dashboard": string
  "nav.buy_sell": string
  "nav.send_receive": string
  "nav.live_market": string
  "nav.dex_swap": string
  "nav.p2p_trading": string
  "nav.lending": string
  "nav.nfc_shop": string
  "nav.partners": string
  "nav.settings": string
  "nav.admin": string
  "nav.logout": string
  
  // Dashboard
  "dashboard.welcome": string
  "dashboard.total_balance": string
  "dashboard.portfolio": string
  "dashboard.recent_transactions": string
  
  // Buy/Sell
  "buy_sell.title": string
  "buy_sell.buy": string
  "buy_sell.sell": string
  "buy_sell.amount": string
  "buy_sell.price": string
  "buy_sell.total": string
  "buy_sell.select_provider": string
  "buy_sell.compare_rates": string
  "buy_sell.best_rate": string
  "buy_sell.fiat_currency": string
  
  // P2P
  "p2p.title": string
  "p2p.create_order": string
  "p2p.buy_orders": string
  "p2p.sell_orders": string
  "p2p.my_orders": string
  "p2p.individual": string
  "p2p.institutional": string
  "p2p.all_traders": string
  "p2p.price_per_unit": string
  "p2p.payment_methods": string
  
  // DEX
  "dex.title": string
  "dex.swap": string
  "dex.from": string
  "dex.to": string
  "dex.slippage": string
  "dex.rate": string
  "dex.minimum_received": string
  
  // Lending
  "lending.title": string
  "lending.available_pools": string
  "lending.my_lending": string
  "lending.apy": string
  "lending.lock_period": string
  "lending.min_amount": string
  "lending.deposit": string
  "lending.withdraw": string
  "lending.total_deposited": string
  "lending.interest_earned": string
  
  // NFC Shop
  "nfc_shop.title": string
  "nfc_shop.add_to_cart": string
  "nfc_shop.checkout": string
  "nfc_shop.in_stock": string
  "nfc_shop.order_summary": string
  
  // Settings
  "settings.title": string
  "settings.language": string
  "settings.currency": string
  "settings.theme": string
  "settings.notifications": string
  "settings.security": string
  "settings.profile": string
  
  // Partners
  "partners.title": string
  "partners.find_partner": string
  "partners.exchange": string
  "partners.atm": string
  "partners.merchant": string
  "partners.agent": string
  
  // Live Market
  "market.title": string
  "market.price": string
  "market.change_24h": string
  "market.volume": string
  "market.market_cap": string
}

// English translations (base)
const en: TranslationKeys = {
  "common.loading": "Loading...",
  "common.error": "Error",
  "common.success": "Success",
  "common.cancel": "Cancel",
  "common.confirm": "Confirm",
  "common.save": "Save",
  "common.delete": "Delete",
  "common.search": "Search",
  "common.filter": "Filter",
  "common.refresh": "Refresh",
  "common.back": "Back",
  "common.next": "Next",
  "common.submit": "Submit",
  "common.close": "Close",
  "common.yes": "Yes",
  "common.no": "No",
  "nav.dashboard": "Dashboard",
  "nav.buy_sell": "Buy & Sell",
  "nav.send_receive": "Send & Receive",
  "nav.live_market": "Live Market",
  "nav.dex_swap": "DEX Swap",
  "nav.p2p_trading": "P2P Trading",
  "nav.lending": "Lending",
  "nav.nfc_shop": "NFC Shop",
  "nav.partners": "Partners",
  "nav.settings": "Settings",
  "nav.admin": "Admin",
  "nav.logout": "Logout",
  "dashboard.welcome": "Welcome back",
  "dashboard.total_balance": "Total Balance",
  "dashboard.portfolio": "Portfolio",
  "dashboard.recent_transactions": "Recent Transactions",
  "buy_sell.title": "Buy & Sell Crypto",
  "buy_sell.buy": "Buy",
  "buy_sell.sell": "Sell",
  "buy_sell.amount": "Amount",
  "buy_sell.price": "Price",
  "buy_sell.total": "Total",
  "buy_sell.select_provider": "Select Provider",
  "buy_sell.compare_rates": "Compare Rates",
  "buy_sell.best_rate": "Best Rate",
  "buy_sell.fiat_currency": "Fiat Currency",
  "p2p.title": "P2P Trading",
  "p2p.create_order": "Create Order",
  "p2p.buy_orders": "Buy Orders",
  "p2p.sell_orders": "Sell Orders",
  "p2p.my_orders": "My Orders",
  "p2p.individual": "Individual",
  "p2p.institutional": "Institutional",
  "p2p.all_traders": "All Traders",
  "p2p.price_per_unit": "Price per Unit",
  "p2p.payment_methods": "Payment Methods",
  "dex.title": "DEX Swap",
  "dex.swap": "Swap",
  "dex.from": "From",
  "dex.to": "To",
  "dex.slippage": "Slippage Tolerance",
  "dex.rate": "Exchange Rate",
  "dex.minimum_received": "Minimum Received",
  "lending.title": "Crypto Lending",
  "lending.available_pools": "Available Pools",
  "lending.my_lending": "My Lending",
  "lending.apy": "APY",
  "lending.lock_period": "Lock Period",
  "lending.min_amount": "Min Amount",
  "lending.deposit": "Deposit",
  "lending.withdraw": "Withdraw",
  "lending.total_deposited": "Total Deposited",
  "lending.interest_earned": "Interest Earned",
  "nfc_shop.title": "NFC Card Shop",
  "nfc_shop.add_to_cart": "Add to Cart",
  "nfc_shop.checkout": "Checkout",
  "nfc_shop.in_stock": "in stock",
  "nfc_shop.order_summary": "Order Summary",
  "settings.title": "Settings",
  "settings.language": "Language",
  "settings.currency": "Default Currency",
  "settings.theme": "Theme",
  "settings.notifications": "Notifications",
  "settings.security": "Security",
  "settings.profile": "Profile",
  "partners.title": "Partner Network",
  "partners.find_partner": "Find a Partner",
  "partners.exchange": "Exchange",
  "partners.atm": "ATM",
  "partners.merchant": "Merchant",
  "partners.agent": "Agent",
  "market.title": "Live Market",
  "market.price": "Price",
  "market.change_24h": "24h Change",
  "market.volume": "Volume",
  "market.market_cap": "Market Cap",
}

// Chinese translations
const zh: TranslationKeys = {
  "common.loading": "加载中...",
  "common.error": "错误",
  "common.success": "成功",
  "common.cancel": "取消",
  "common.confirm": "确认",
  "common.save": "保存",
  "common.delete": "删除",
  "common.search": "搜索",
  "common.filter": "筛选",
  "common.refresh": "刷新",
  "common.back": "返回",
  "common.next": "下一步",
  "common.submit": "提交",
  "common.close": "关闭",
  "common.yes": "是",
  "common.no": "否",
  "nav.dashboard": "控制面板",
  "nav.buy_sell": "买卖",
  "nav.send_receive": "发送和接收",
  "nav.live_market": "实时行情",
  "nav.dex_swap": "去中心化交换",
  "nav.p2p_trading": "点对点交易",
  "nav.lending": "借贷",
  "nav.nfc_shop": "NFC商店",
  "nav.partners": "合作伙伴",
  "nav.settings": "设置",
  "nav.admin": "管理员",
  "nav.logout": "退出登录",
  "dashboard.welcome": "欢迎回来",
  "dashboard.total_balance": "总余额",
  "dashboard.portfolio": "投资组合",
  "dashboard.recent_transactions": "最近交易",
  "buy_sell.title": "买卖加密货币",
  "buy_sell.buy": "买入",
  "buy_sell.sell": "卖出",
  "buy_sell.amount": "数量",
  "buy_sell.price": "价格",
  "buy_sell.total": "总计",
  "buy_sell.select_provider": "选择供应商",
  "buy_sell.compare_rates": "比较汇率",
  "buy_sell.best_rate": "最优汇率",
  "buy_sell.fiat_currency": "法币",
  "p2p.title": "点对点交易",
  "p2p.create_order": "创建订单",
  "p2p.buy_orders": "买单",
  "p2p.sell_orders": "卖单",
  "p2p.my_orders": "我的订单",
  "p2p.individual": "个人",
  "p2p.institutional": "机构",
  "p2p.all_traders": "所有交易者",
  "p2p.price_per_unit": "单价",
  "p2p.payment_methods": "支付方式",
  "dex.title": "去中心化交换",
  "dex.swap": "交换",
  "dex.from": "从",
  "dex.to": "到",
  "dex.slippage": "滑点容限",
  "dex.rate": "汇率",
  "dex.minimum_received": "最低收到",
  "lending.title": "加密借贷",
  "lending.available_pools": "可用资金池",
  "lending.my_lending": "我的借贷",
  "lending.apy": "年化收益率",
  "lending.lock_period": "锁定期",
  "lending.min_amount": "最小金额",
  "lending.deposit": "存入",
  "lending.withdraw": "取出",
  "lending.total_deposited": "总存款",
  "lending.interest_earned": "已赚利息",
  "nfc_shop.title": "NFC卡商店",
  "nfc_shop.add_to_cart": "加入购物车",
  "nfc_shop.checkout": "结账",
  "nfc_shop.in_stock": "库存",
  "nfc_shop.order_summary": "订单摘要",
  "settings.title": "设置",
  "settings.language": "语言",
  "settings.currency": "默认货币",
  "settings.theme": "主题",
  "settings.notifications": "通知",
  "settings.security": "安全",
  "settings.profile": "个人资料",
  "partners.title": "合作伙伴网络",
  "partners.find_partner": "查找合作伙伴",
  "partners.exchange": "交易所",
  "partners.atm": "ATM",
  "partners.merchant": "商户",
  "partners.agent": "代理",
  "market.title": "实时行情",
  "market.price": "价格",
  "market.change_24h": "24小时变化",
  "market.volume": "成交量",
  "market.market_cap": "市值",
}

// Malay translations
const ms: TranslationKeys = {
  "common.loading": "Memuatkan...",
  "common.error": "Ralat",
  "common.success": "Berjaya",
  "common.cancel": "Batal",
  "common.confirm": "Sahkan",
  "common.save": "Simpan",
  "common.delete": "Padam",
  "common.search": "Cari",
  "common.filter": "Tapis",
  "common.refresh": "Muat Semula",
  "common.back": "Kembali",
  "common.next": "Seterusnya",
  "common.submit": "Hantar",
  "common.close": "Tutup",
  "common.yes": "Ya",
  "common.no": "Tidak",
  "nav.dashboard": "Papan Pemuka",
  "nav.buy_sell": "Beli & Jual",
  "nav.send_receive": "Hantar & Terima",
  "nav.live_market": "Pasaran Langsung",
  "nav.dex_swap": "Pertukaran DEX",
  "nav.p2p_trading": "Dagangan P2P",
  "nav.lending": "Pinjaman",
  "nav.nfc_shop": "Kedai NFC",
  "nav.partners": "Rakan Kongsi",
  "nav.settings": "Tetapan",
  "nav.admin": "Pentadbir",
  "nav.logout": "Log Keluar",
  "dashboard.welcome": "Selamat kembali",
  "dashboard.total_balance": "Jumlah Baki",
  "dashboard.portfolio": "Portfolio",
  "dashboard.recent_transactions": "Transaksi Terkini",
  "buy_sell.title": "Beli & Jual Kripto",
  "buy_sell.buy": "Beli",
  "buy_sell.sell": "Jual",
  "buy_sell.amount": "Jumlah",
  "buy_sell.price": "Harga",
  "buy_sell.total": "Jumlah",
  "buy_sell.select_provider": "Pilih Pembekal",
  "buy_sell.compare_rates": "Bandingkan Kadar",
  "buy_sell.best_rate": "Kadar Terbaik",
  "buy_sell.fiat_currency": "Mata Wang Fiat",
  "p2p.title": "Dagangan P2P",
  "p2p.create_order": "Buat Pesanan",
  "p2p.buy_orders": "Pesanan Beli",
  "p2p.sell_orders": "Pesanan Jual",
  "p2p.my_orders": "Pesanan Saya",
  "p2p.individual": "Individu",
  "p2p.institutional": "Institusi",
  "p2p.all_traders": "Semua Pedagang",
  "p2p.price_per_unit": "Harga Per Unit",
  "p2p.payment_methods": "Kaedah Pembayaran",
  "dex.title": "Pertukaran DEX",
  "dex.swap": "Tukar",
  "dex.from": "Dari",
  "dex.to": "Ke",
  "dex.slippage": "Toleransi Gelinciran",
  "dex.rate": "Kadar Pertukaran",
  "dex.minimum_received": "Minimum Diterima",
  "lending.title": "Pinjaman Kripto",
  "lending.available_pools": "Kolam Tersedia",
  "lending.my_lending": "Pinjaman Saya",
  "lending.apy": "APY",
  "lending.lock_period": "Tempoh Kunci",
  "lending.min_amount": "Jumlah Minimum",
  "lending.deposit": "Deposit",
  "lending.withdraw": "Pengeluaran",
  "lending.total_deposited": "Jumlah Didepositkan",
  "lending.interest_earned": "Faedah Diperolehi",
  "nfc_shop.title": "Kedai Kad NFC",
  "nfc_shop.add_to_cart": "Tambah ke Troli",
  "nfc_shop.checkout": "Pembayaran",
  "nfc_shop.in_stock": "dalam stok",
  "nfc_shop.order_summary": "Ringkasan Pesanan",
  "settings.title": "Tetapan",
  "settings.language": "Bahasa",
  "settings.currency": "Mata Wang Lalai",
  "settings.theme": "Tema",
  "settings.notifications": "Pemberitahuan",
  "settings.security": "Keselamatan",
  "settings.profile": "Profil",
  "partners.title": "Rangkaian Rakan Kongsi",
  "partners.find_partner": "Cari Rakan Kongsi",
  "partners.exchange": "Pertukaran",
  "partners.atm": "ATM",
  "partners.merchant": "Pedagang",
  "partners.agent": "Ejen",
  "market.title": "Pasaran Langsung",
  "market.price": "Harga",
  "market.change_24h": "Perubahan 24j",
  "market.volume": "Jumlah Dagangan",
  "market.market_cap": "Modal Pasaran",
}

// Japanese translations
const ja: TranslationKeys = {
  "common.loading": "読み込み中...",
  "common.error": "エラー",
  "common.success": "成功",
  "common.cancel": "キャンセル",
  "common.confirm": "確認",
  "common.save": "保存",
  "common.delete": "削除",
  "common.search": "検索",
  "common.filter": "フィルター",
  "common.refresh": "更新",
  "common.back": "戻る",
  "common.next": "次へ",
  "common.submit": "送信",
  "common.close": "閉じる",
  "common.yes": "はい",
  "common.no": "いいえ",
  "nav.dashboard": "ダッシュボード",
  "nav.buy_sell": "売買",
  "nav.send_receive": "送受信",
  "nav.live_market": "ライブ市場",
  "nav.dex_swap": "DEXスワップ",
  "nav.p2p_trading": "P2P取引",
  "nav.lending": "レンディング",
  "nav.nfc_shop": "NFCショップ",
  "nav.partners": "パートナー",
  "nav.settings": "設定",
  "nav.admin": "管理者",
  "nav.logout": "ログアウト",
  "dashboard.welcome": "おかえりなさい",
  "dashboard.total_balance": "合計残高",
  "dashboard.portfolio": "ポートフォリオ",
  "dashboard.recent_transactions": "最近の取引",
  "buy_sell.title": "暗号資産の売買",
  "buy_sell.buy": "購入",
  "buy_sell.sell": "売却",
  "buy_sell.amount": "数量",
  "buy_sell.price": "価格",
  "buy_sell.total": "合計",
  "buy_sell.select_provider": "プロバイダーを選択",
  "buy_sell.compare_rates": "レートを比較",
  "buy_sell.best_rate": "最良レート",
  "buy_sell.fiat_currency": "法定通貨",
  "p2p.title": "P2P取引",
  "p2p.create_order": "注文を作成",
  "p2p.buy_orders": "買い注文",
  "p2p.sell_orders": "売り注文",
  "p2p.my_orders": "マイ注文",
  "p2p.individual": "個人",
  "p2p.institutional": "機関",
  "p2p.all_traders": "全トレーダー",
  "p2p.price_per_unit": "単価",
  "p2p.payment_methods": "支払方法",
  "dex.title": "DEXスワップ",
  "dex.swap": "スワップ",
  "dex.from": "から",
  "dex.to": "へ",
  "dex.slippage": "スリッページ許容量",
  "dex.rate": "交換レート",
  "dex.minimum_received": "最低受取量",
  "lending.title": "暗号レンディング",
  "lending.available_pools": "利用可能なプール",
  "lending.my_lending": "マイレンディング",
  "lending.apy": "年利",
  "lending.lock_period": "ロック期間",
  "lending.min_amount": "最小金額",
  "lending.deposit": "預入",
  "lending.withdraw": "引出",
  "lending.total_deposited": "総預入額",
  "lending.interest_earned": "獲得利息",
  "nfc_shop.title": "NFCカードショップ",
  "nfc_shop.add_to_cart": "カートに追加",
  "nfc_shop.checkout": "チェックアウト",
  "nfc_shop.in_stock": "在庫あり",
  "nfc_shop.order_summary": "注文概要",
  "settings.title": "設定",
  "settings.language": "言語",
  "settings.currency": "デフォルト通貨",
  "settings.theme": "テーマ",
  "settings.notifications": "通知",
  "settings.security": "セキュリティ",
  "settings.profile": "プロフィール",
  "partners.title": "パートナーネットワーク",
  "partners.find_partner": "パートナーを探す",
  "partners.exchange": "取引所",
  "partners.atm": "ATM",
  "partners.merchant": "加盟店",
  "partners.agent": "代理店",
  "market.title": "ライブ市場",
  "market.price": "価格",
  "market.change_24h": "24時間変動",
  "market.volume": "出来高",
  "market.market_cap": "時価総額",
}

// Korean
const ko: TranslationKeys = {
  "common.loading": "로딩 중...", "common.error": "오류", "common.success": "성공", "common.cancel": "취소",
  "common.confirm": "확인", "common.save": "저장", "common.delete": "삭제", "common.search": "검색",
  "common.filter": "필터", "common.refresh": "새로고침", "common.back": "뒤로", "common.next": "다음",
  "common.submit": "제출", "common.close": "닫기", "common.yes": "예", "common.no": "아니요",
  "nav.dashboard": "대시보드", "nav.buy_sell": "매매", "nav.send_receive": "송수신",
  "nav.live_market": "실시간 시세", "nav.dex_swap": "DEX 스왑", "nav.p2p_trading": "P2P 거래",
  "nav.lending": "대출", "nav.nfc_shop": "NFC 샵", "nav.partners": "파트너",
  "nav.settings": "설정", "nav.admin": "관리자", "nav.logout": "로그아웃",
  "dashboard.welcome": "돌아오신 것을 환영합니다", "dashboard.total_balance": "총 잔고",
  "dashboard.portfolio": "포트폴리오", "dashboard.recent_transactions": "최근 거래",
  "buy_sell.title": "암호화폐 매매", "buy_sell.buy": "매수", "buy_sell.sell": "매도",
  "buy_sell.amount": "수량", "buy_sell.price": "가격", "buy_sell.total": "합계",
  "buy_sell.select_provider": "제공자 선택", "buy_sell.compare_rates": "환율 비교",
  "buy_sell.best_rate": "최적 환율", "buy_sell.fiat_currency": "법정화폐",
  "p2p.title": "P2P 거래", "p2p.create_order": "주문 생성", "p2p.buy_orders": "매수 주문",
  "p2p.sell_orders": "매도 주문", "p2p.my_orders": "내 주문", "p2p.individual": "개인",
  "p2p.institutional": "기관", "p2p.all_traders": "모든 거래자", "p2p.price_per_unit": "단가",
  "p2p.payment_methods": "결제 방법",
  "dex.title": "DEX 스왑", "dex.swap": "스왑", "dex.from": "보내기", "dex.to": "받기",
  "dex.slippage": "슬리피지 허용", "dex.rate": "환율", "dex.minimum_received": "최소 수령량",
  "lending.title": "암호화폐 대출", "lending.available_pools": "가용 풀", "lending.my_lending": "내 대출",
  "lending.apy": "연이율", "lending.lock_period": "잠금 기간", "lending.min_amount": "최소 금액",
  "lending.deposit": "예치", "lending.withdraw": "출금", "lending.total_deposited": "총 예치금",
  "lending.interest_earned": "획득 이자",
  "nfc_shop.title": "NFC 카드 샵", "nfc_shop.add_to_cart": "장바구니 추가",
  "nfc_shop.checkout": "결제", "nfc_shop.in_stock": "재고", "nfc_shop.order_summary": "주문 요약",
  "settings.title": "설정", "settings.language": "언어", "settings.currency": "기본 통화",
  "settings.theme": "테마", "settings.notifications": "알림", "settings.security": "보안", "settings.profile": "프로필",
  "partners.title": "파트너 네트워크", "partners.find_partner": "파트너 찾기",
  "partners.exchange": "거래소", "partners.atm": "ATM", "partners.merchant": "가맹점", "partners.agent": "대리점",
  "market.title": "실시간 시세", "market.price": "가격", "market.change_24h": "24시간 변동",
  "market.volume": "거래량", "market.market_cap": "시가총액",
}

// Spanish
const es: TranslationKeys = {
  "common.loading": "Cargando...", "common.error": "Error", "common.success": "Éxito", "common.cancel": "Cancelar",
  "common.confirm": "Confirmar", "common.save": "Guardar", "common.delete": "Eliminar", "common.search": "Buscar",
  "common.filter": "Filtrar", "common.refresh": "Actualizar", "common.back": "Atrás", "common.next": "Siguiente",
  "common.submit": "Enviar", "common.close": "Cerrar", "common.yes": "Sí", "common.no": "No",
  "nav.dashboard": "Panel", "nav.buy_sell": "Comprar y Vender", "nav.send_receive": "Enviar y Recibir",
  "nav.live_market": "Mercado en Vivo", "nav.dex_swap": "Intercambio DEX", "nav.p2p_trading": "Trading P2P",
  "nav.lending": "Préstamos", "nav.nfc_shop": "Tienda NFC", "nav.partners": "Socios",
  "nav.settings": "Configuración", "nav.admin": "Administrador", "nav.logout": "Cerrar Sesión",
  "dashboard.welcome": "Bienvenido de nuevo", "dashboard.total_balance": "Saldo Total",
  "dashboard.portfolio": "Portafolio", "dashboard.recent_transactions": "Transacciones Recientes",
  "buy_sell.title": "Comprar y Vender Cripto", "buy_sell.buy": "Comprar", "buy_sell.sell": "Vender",
  "buy_sell.amount": "Cantidad", "buy_sell.price": "Precio", "buy_sell.total": "Total",
  "buy_sell.select_provider": "Seleccionar Proveedor", "buy_sell.compare_rates": "Comparar Tasas",
  "buy_sell.best_rate": "Mejor Tasa", "buy_sell.fiat_currency": "Moneda Fiat",
  "p2p.title": "Trading P2P", "p2p.create_order": "Crear Orden", "p2p.buy_orders": "Órdenes de Compra",
  "p2p.sell_orders": "Órdenes de Venta", "p2p.my_orders": "Mis Órdenes", "p2p.individual": "Individual",
  "p2p.institutional": "Institucional", "p2p.all_traders": "Todos los Traders", "p2p.price_per_unit": "Precio por Unidad",
  "p2p.payment_methods": "Métodos de Pago",
  "dex.title": "Intercambio DEX", "dex.swap": "Intercambiar", "dex.from": "De", "dex.to": "A",
  "dex.slippage": "Tolerancia de Deslizamiento", "dex.rate": "Tasa de Cambio", "dex.minimum_received": "Mínimo Recibido",
  "lending.title": "Préstamos Cripto", "lending.available_pools": "Pools Disponibles", "lending.my_lending": "Mis Préstamos",
  "lending.apy": "TAE", "lending.lock_period": "Período de Bloqueo", "lending.min_amount": "Monto Mínimo",
  "lending.deposit": "Depositar", "lending.withdraw": "Retirar", "lending.total_deposited": "Total Depositado",
  "lending.interest_earned": "Interés Ganado",
  "nfc_shop.title": "Tienda de Tarjetas NFC", "nfc_shop.add_to_cart": "Agregar al Carrito",
  "nfc_shop.checkout": "Pagar", "nfc_shop.in_stock": "disponible", "nfc_shop.order_summary": "Resumen del Pedido",
  "settings.title": "Configuración", "settings.language": "Idioma", "settings.currency": "Moneda Predeterminada",
  "settings.theme": "Tema", "settings.notifications": "Notificaciones", "settings.security": "Seguridad", "settings.profile": "Perfil",
  "partners.title": "Red de Socios", "partners.find_partner": "Encontrar Socio",
  "partners.exchange": "Exchange", "partners.atm": "Cajero", "partners.merchant": "Comerciante", "partners.agent": "Agente",
  "market.title": "Mercado en Vivo", "market.price": "Precio", "market.change_24h": "Cambio 24h",
  "market.volume": "Volumen", "market.market_cap": "Cap. de Mercado",
}

// French
const fr: TranslationKeys = {
  "common.loading": "Chargement...", "common.error": "Erreur", "common.success": "Succès", "common.cancel": "Annuler",
  "common.confirm": "Confirmer", "common.save": "Enregistrer", "common.delete": "Supprimer", "common.search": "Rechercher",
  "common.filter": "Filtrer", "common.refresh": "Actualiser", "common.back": "Retour", "common.next": "Suivant",
  "common.submit": "Soumettre", "common.close": "Fermer", "common.yes": "Oui", "common.no": "Non",
  "nav.dashboard": "Tableau de Bord", "nav.buy_sell": "Acheter & Vendre", "nav.send_receive": "Envoyer & Recevoir",
  "nav.live_market": "Marché en Direct", "nav.dex_swap": "Échange DEX", "nav.p2p_trading": "Trading P2P",
  "nav.lending": "Prêts", "nav.nfc_shop": "Boutique NFC", "nav.partners": "Partenaires",
  "nav.settings": "Paramètres", "nav.admin": "Administrateur", "nav.logout": "Déconnexion",
  "dashboard.welcome": "Bon retour", "dashboard.total_balance": "Solde Total",
  "dashboard.portfolio": "Portefeuille", "dashboard.recent_transactions": "Transactions Récentes",
  "buy_sell.title": "Acheter & Vendre Crypto", "buy_sell.buy": "Acheter", "buy_sell.sell": "Vendre",
  "buy_sell.amount": "Montant", "buy_sell.price": "Prix", "buy_sell.total": "Total",
  "buy_sell.select_provider": "Sélectionner Fournisseur", "buy_sell.compare_rates": "Comparer les Taux",
  "buy_sell.best_rate": "Meilleur Taux", "buy_sell.fiat_currency": "Monnaie Fiat",
  "p2p.title": "Trading P2P", "p2p.create_order": "Créer un Ordre", "p2p.buy_orders": "Ordres d'Achat",
  "p2p.sell_orders": "Ordres de Vente", "p2p.my_orders": "Mes Ordres", "p2p.individual": "Individuel",
  "p2p.institutional": "Institutionnel", "p2p.all_traders": "Tous les Traders", "p2p.price_per_unit": "Prix par Unité",
  "p2p.payment_methods": "Méthodes de Paiement",
  "dex.title": "Échange DEX", "dex.swap": "Échanger", "dex.from": "De", "dex.to": "Vers",
  "dex.slippage": "Tolérance de Glissement", "dex.rate": "Taux de Change", "dex.minimum_received": "Minimum Reçu",
  "lending.title": "Prêts Crypto", "lending.available_pools": "Pools Disponibles", "lending.my_lending": "Mes Prêts",
  "lending.apy": "TAA", "lending.lock_period": "Période de Verrouillage", "lending.min_amount": "Montant Minimum",
  "lending.deposit": "Déposer", "lending.withdraw": "Retirer", "lending.total_deposited": "Total Déposé",
  "lending.interest_earned": "Intérêts Gagnés",
  "nfc_shop.title": "Boutique Cartes NFC", "nfc_shop.add_to_cart": "Ajouter au Panier",
  "nfc_shop.checkout": "Payer", "nfc_shop.in_stock": "en stock", "nfc_shop.order_summary": "Résumé de Commande",
  "settings.title": "Paramètres", "settings.language": "Langue", "settings.currency": "Devise par Défaut",
  "settings.theme": "Thème", "settings.notifications": "Notifications", "settings.security": "Sécurité", "settings.profile": "Profil",
  "partners.title": "Réseau de Partenaires", "partners.find_partner": "Trouver un Partenaire",
  "partners.exchange": "Échange", "partners.atm": "Guichet", "partners.merchant": "Commerçant", "partners.agent": "Agent",
  "market.title": "Marché en Direct", "market.price": "Prix", "market.change_24h": "Variation 24h",
  "market.volume": "Volume", "market.market_cap": "Cap. Marché",
}

// For remaining languages, create simplified translations that use the English base with key labels translated
function createTranslation(overrides: Partial<TranslationKeys>): TranslationKeys {
  return { ...en, ...overrides }
}

const de = createTranslation({
  "common.loading": "Laden...", "common.search": "Suchen", "common.cancel": "Abbrechen", "common.confirm": "Bestätigen",
  "common.save": "Speichern", "common.delete": "Löschen", "nav.dashboard": "Dashboard", "nav.buy_sell": "Kaufen & Verkaufen",
  "nav.settings": "Einstellungen", "nav.logout": "Abmelden", "buy_sell.buy": "Kaufen", "buy_sell.sell": "Verkaufen",
  "settings.language": "Sprache", "settings.title": "Einstellungen", "lending.title": "Krypto-Lending",
  "market.title": "Live-Markt", "p2p.title": "P2P-Handel", "dex.title": "DEX Tausch",
})

const pt = createTranslation({
  "common.loading": "Carregando...", "common.search": "Buscar", "common.cancel": "Cancelar",
  "nav.dashboard": "Painel", "nav.buy_sell": "Comprar & Vender", "nav.settings": "Configurações",
  "nav.logout": "Sair", "buy_sell.buy": "Comprar", "buy_sell.sell": "Vender",
  "settings.language": "Idioma", "lending.title": "Empréstimo Cripto", "market.title": "Mercado ao Vivo",
})

const ru = createTranslation({
  "common.loading": "Загрузка...", "common.search": "Поиск", "common.cancel": "Отмена",
  "nav.dashboard": "Панель", "nav.buy_sell": "Купить и Продать", "nav.settings": "Настройки",
  "nav.logout": "Выйти", "buy_sell.buy": "Купить", "buy_sell.sell": "Продать",
  "settings.language": "Язык", "lending.title": "Крипто Кредитование", "market.title": "Рынок в Реальном Времени",
})

const ar = createTranslation({
  "common.loading": "جار التحميل...", "common.search": "بحث", "common.cancel": "إلغاء",
  "nav.dashboard": "لوحة المعلومات", "nav.buy_sell": "شراء وبيع", "nav.settings": "الإعدادات",
  "nav.logout": "تسجيل الخروج", "buy_sell.buy": "شراء", "buy_sell.sell": "بيع",
  "settings.language": "اللغة", "lending.title": "إقراض العملات", "market.title": "السوق المباشر",
})

const hi = createTranslation({
  "common.loading": "लोड हो रहा है...", "common.search": "खोजें", "common.cancel": "रद्द करें",
  "nav.dashboard": "डैशबोर्ड", "nav.buy_sell": "खरीदें और बेचें", "nav.settings": "सेटिंग्स",
  "nav.logout": "लॉग आउट", "buy_sell.buy": "खरीदें", "buy_sell.sell": "बेचें",
  "settings.language": "भाषा", "lending.title": "क्रिप्टो ऋण", "market.title": "लाइव मार्केट",
})

const th = createTranslation({
  "common.loading": "กำลังโหลด...", "common.search": "ค้นหา", "common.cancel": "ยกเลิก",
  "nav.dashboard": "แดชบอร์ด", "nav.buy_sell": "ซื้อและขาย", "nav.settings": "ตั้งค่า",
  "nav.logout": "ออกจากระบบ", "buy_sell.buy": "ซื้อ", "buy_sell.sell": "ขาย",
  "settings.language": "ภาษา", "lending.title": "สินเชื่อคริปโต", "market.title": "ตลาดสด",
})

const vi = createTranslation({
  "common.loading": "Đang tải...", "common.search": "Tìm kiếm", "common.cancel": "Hủy",
  "nav.dashboard": "Bảng điều khiển", "nav.buy_sell": "Mua & Bán", "nav.settings": "Cài đặt",
  "nav.logout": "Đăng xuất", "buy_sell.buy": "Mua", "buy_sell.sell": "Bán",
  "settings.language": "Ngôn ngữ", "lending.title": "Cho vay Crypto", "market.title": "Thị trường trực tiếp",
})

const id = createTranslation({
  "common.loading": "Memuat...", "common.search": "Cari", "common.cancel": "Batal",
  "nav.dashboard": "Dasbor", "nav.buy_sell": "Beli & Jual", "nav.settings": "Pengaturan",
  "nav.logout": "Keluar", "buy_sell.buy": "Beli", "buy_sell.sell": "Jual",
  "settings.language": "Bahasa", "lending.title": "Pinjaman Kripto", "market.title": "Pasar Langsung",
})

const tr = createTranslation({
  "common.loading": "Yükleniyor...", "common.search": "Ara", "common.cancel": "İptal",
  "nav.dashboard": "Panel", "nav.buy_sell": "Al & Sat", "nav.settings": "Ayarlar",
  "nav.logout": "Çıkış", "buy_sell.buy": "Al", "buy_sell.sell": "Sat",
  "settings.language": "Dil", "lending.title": "Kripto Borç", "market.title": "Canlı Piyasa",
})

const it = createTranslation({
  "common.loading": "Caricamento...", "common.search": "Cerca", "common.cancel": "Annulla",
  "nav.dashboard": "Pannello", "nav.buy_sell": "Compra e Vendi", "nav.settings": "Impostazioni",
  "nav.logout": "Esci", "buy_sell.buy": "Compra", "buy_sell.sell": "Vendi",
  "settings.language": "Lingua", "lending.title": "Prestiti Crypto", "market.title": "Mercato Live",
})

const nl = createTranslation({
  "common.loading": "Laden...", "common.search": "Zoeken", "common.cancel": "Annuleren",
  "nav.dashboard": "Dashboard", "nav.buy_sell": "Kopen & Verkopen", "nav.settings": "Instellingen",
  "nav.logout": "Uitloggen", "buy_sell.buy": "Kopen", "buy_sell.sell": "Verkopen",
  "settings.language": "Taal", "lending.title": "Crypto Lenen", "market.title": "Live Markt",
})

const pl = createTranslation({
  "common.loading": "Ładowanie...", "common.search": "Szukaj", "common.cancel": "Anuluj",
  "nav.dashboard": "Panel", "nav.buy_sell": "Kup i Sprzedaj", "nav.settings": "Ustawienia",
  "nav.logout": "Wyloguj", "buy_sell.buy": "Kup", "buy_sell.sell": "Sprzedaj",
  "settings.language": "Język", "lending.title": "Pożyczki Krypto", "market.title": "Rynek na Żywo",
})

const tl = createTranslation({
  "common.loading": "Naglo-load...", "common.search": "Maghanap", "common.cancel": "Kanselahin",
  "nav.dashboard": "Dashboard", "nav.buy_sell": "Bumili at Magbenta", "nav.settings": "Mga Setting",
  "nav.logout": "Mag-logout", "buy_sell.buy": "Bumili", "buy_sell.sell": "Ibenta",
  "settings.language": "Wika", "lending.title": "Crypto Lending", "market.title": "Live Market",
})

// Translation map
const translations: Record<LanguageCode, TranslationKeys> = {
  en, zh, ms, ja, ko, es, fr, de, pt, ru, ar, hi, th, vi, id, tr, it, nl, pl, tl
}

// Context
interface I18nContextType {
  language: LanguageCode
  setLanguage: (lang: LanguageCode) => void
  t: (key: keyof TranslationKeys) => string
  dir: "ltr" | "rtl"
}

const I18nContext = createContext<I18nContextType>({
  language: "en",
  setLanguage: () => {},
  t: (key) => key,
  dir: "ltr",
})

export function I18nProvider({ children, initialLanguage }: { children: ReactNode; initialLanguage?: string }) {
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    if (initialLanguage && initialLanguage in translations) {
      return initialLanguage as LanguageCode
    }
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("summit_language") as LanguageCode
      if (saved && translations[saved]) return saved
    }
    return "en"
  })

  useEffect(() => {
    if (initialLanguage && initialLanguage in translations) {
      const nextLanguage = initialLanguage as LanguageCode
      setLanguageState(nextLanguage)
      if (typeof window !== "undefined") {
        localStorage.setItem("summit_language", nextLanguage)
      }
    }
  }, [initialLanguage])

  const setLanguage = useCallback((lang: LanguageCode) => {
    setLanguageState(lang)
    if (typeof window !== "undefined") {
      localStorage.setItem("summit_language", lang)
    }
  }, [])

  const t = useCallback((key: keyof TranslationKeys): string => {
    return translations[language]?.[key] || translations.en[key] || key
  }, [language])

  const dir = SUPPORTED_LANGUAGES.find(l => l.code === language)?.dir || "ltr"

  return (
    <I18nContext.Provider value={{ language, setLanguage, t, dir }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useTranslation() {
  return useContext(I18nContext)
}

export default I18nContext
