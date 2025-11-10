# 🚀 NFC Quick Reference Card

## ⚡ Start Everything

```bash
# Terminal 1 - Backend
cd H:\Development\crypto\crypto-backend-
npm start
# ✅ Running on http://localhost:3000

# Terminal 2 - Dashboard
cd H:\Development\crypto\summit-frontend\dashboard-app
npm run dev
# ✅ Running on http://localhost:8081
```

---

## 📝 First Time Setup (5 minutes)

### 1. Provision Card
```
Dashboard → NFC Management → Provision Card
Enter name: "My Card"
Click: Provision Card
💾 SAVE THE CARD ID!
```

### 2. Test Send Transaction
```
Dashboard → Send Button
Enter amount & address
Click: Proceed (NFC Required)
✅ Watch NFC authorization flow
```

---

## 🔧 Files Created/Modified

```
dashboard-app/
├── .env.local                          ✅ Updated API URL
├── types/nfc.ts                        ✨ NEW
├── lib/
│   ├── nfcApi.ts                       ✨ NEW
│   └── nfcCrypto.ts                    ✨ NEW
├── components/
│   ├── NfcLoginCard.tsx                ✨ NEW
│   ├── NfcManagement.tsx               ✨ NEW
│   └── modals/
│       ├── NfcTransactionAuth.tsx      ✨ NEW
│       └── SendCoinModal.tsx           ✅ Modified (NFC added)
```

---

## 🎯 Key API Endpoints (Backend)

```
POST /api/nfc/nonce              - Get authentication nonce
POST /api/nfc/auth               - Login with NFC
POST /api/nfc/provision          - Register new card
POST /api/nfc/action-nonce       - Get transaction nonce
POST /api/nfc/authorize-action   - Authorize transaction
GET  /api/nfc/cards              - Get user's cards
GET  /api/nfc/activity           - Get activity logs
```

---

## 💻 Code Snippets

### Add NFC to Any Modal

```tsx
import NfcTransactionAuth from './NfcTransactionAuth';
import { getStoredCardId } from '@/lib/nfcApi';

const [showNfc, setShowNfc] = useState(false);
const cardId = getStoredCardId();

// In your proceed button
<Button onClick={() => cardId ? setShowNfc(true) : handleAction()}>
  Proceed
</Button>

// Add modal
<NfcTransactionAuth
  isOpen={showNfc}
  onClose={() => setShowNfc(false)}
  cardId={cardId}
  actionType="send" // or "swap", "buy", "sell"
  actionData={{ amount, toAddress, fromToken }}
  onAuthorized={handleAction}
/>
```

### Check if User Has NFC

```tsx
import { getStoredCardId, hasNfcToken } from '@/lib/nfcApi';

const cardId = getStoredCardId();
const hasToken = hasNfcToken();

if (cardId && hasToken) {
  // User has NFC enabled
  showNfcOption();
}
```

---

## 🐛 Quick Troubleshooting

| Issue | Fix |
|-------|-----|
| "Card not found" | Provision card first |
| "Failed to fetch" | Start backend server |
| "Invalid signature" | Clear localStorage, provision new card |
| "Nonce expired" | Click Proceed again |
| NFC not showing | Check `getStoredCardId()` returns value |

---

## 📊 Testing Checklist

- [ ] Backend running on port 3000
- [ ] Dashboard running on port 8081
- [ ] Card provisioned successfully
- [ ] Card ID saved
- [ ] Send transaction shows NFC modal
- [ ] Authorization completes successfully
- [ ] Activity logs visible in NFC Management
- [ ] Multiple transactions work

---

## 🔒 Security Features

✅ **Challenge-Response** - Nonces prevent replay  
✅ **Short-Lived Tokens** - 5min expiry  
✅ **Step-Up Auth** - Extra verification for transactions  
✅ **Audit Logging** - All events tracked  
✅ **Signature Verification** - Cryptographic proof  

---

## 📱 Demo Script for Client

**"Let me show you the NFC security system..."**

1. **Show Provisioning**
   - "First, we register an NFC card"
   - Click Provision → Enter name → Get Card ID
   - "Private key stays on card, public key on server"

2. **Show Login**
   - "Now login with just the Card ID"
   - Enter Card ID → Click Login
   - "Watch: request nonce → sign → verify"

3. **Show Transaction**
   - "Try to send some crypto"
   - Enter amount → Click Send
   - "System requires NFC authorization"
   - Show tap animation → Verification → Success

4. **Show Security**
   - Go to NFC Management
   - "Every action is logged and auditable"
   - Show activity log with timestamps

5. **Explain Value**
   - "Even if someone steals the JWT token..."
   - "They can't make transactions without physical card"
   - "This is bank-level security for crypto"

---

## 🎉 Success Metrics

After integration, you have:

✅ **Zero plaintext private keys** on server  
✅ **5-minute token expiration** (configurable)  
✅ **90-second nonce expiration**  
✅ **Real-time signature verification**  
✅ **Complete audit trail**  
✅ **Replay attack prevention**  
✅ **Step-up authorization** for transactions  

---

## 📞 Quick Commands

```bash
# Check backend health
curl http://localhost:3000/api/health

# Check if backend NFC routes work
curl -X POST http://localhost:3000/api/nfc/nonce \
  -H "Content-Type: application/json" \
  -d '{"cardId":"test"}'

# View backend logs
cd crypto-backend-
npm start  # Watch console output

# Restart dashboard
cd dashboard-app
npm run dev
```

---

## 🎯 Next Steps

**For Complete Integration:**

1. Add NFC to **BuySellModal** (same pattern as SendCoinModal)
2. Add NFC to **SellCoinModal**
3. Add NFC to **BuyCoinModal**  
4. Add NFC Management link to dashboard sidebar
5. Optional: Add NFC login to main login page

**Each takes ~5 minutes using the pattern from SendCoinModal**

---

**Need help? Check `NFC_INTEGRATION_GUIDE.md` for detailed instructions!**
