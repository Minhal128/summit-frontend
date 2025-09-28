'use client';

import { 
  Languages, 
  CircleDollarSign, 
  Network, 
  Bell, 
  ShieldCheck,
  Check
} from 'lucide-react';
import React, { useState } from 'react';

// Define the structure for a settings tab
interface SettingsTab {
  id: string;
  name: string;
  icon: React.ReactNode;
}

const settingsTabs: SettingsTab[] = [
  { id: 'language', name: 'Language', icon: <Languages className="w-5 h-5" /> },
  { id: 'currency', name: 'Currency', icon: <CircleDollarSign className="w-5 h-5" /> },
  { id: 'network-fees', name: 'Network Fees', icon: <Network className="w-5 h-5" /> },
  { id: 'notifications', name: 'Notification Settings', icon: <Bell className="w-5 h-5" /> },
  { id: 'security', name: 'Security', icon: <ShieldCheck className="w-5 h-5" /> },
];

const LanguageSettings = () => {
  const [selectedLanguage, setSelectedLanguage] = useState(0);
  const languages = ['Default (Device language)', 'English', 'Chinese', 'Francais', 'Spanish', 'Benghali'];

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">Language</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {languages.map((lang, index) => (
          <div 
            key={lang} 
            onClick={() => setSelectedLanguage(index)}
            className="flex justify-between items-center p-4 rounded-lg hover:bg-slate-700/50 cursor-pointer bg-[#0F172A] border border-slate-700"
          >
            <span className="font-medium text-white">{lang}</span>
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedLanguage === index ? 'border-blue-500 bg-blue-500' : 'border-gray-500'}`}>
              {selectedLanguage === index && <Check className="w-3 h-3 text-white" />}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const CurrencySettings = () => {
  const [selectedCurrency, setSelectedCurrency] = useState(0);
  const currencies = ['USD', 'CAD', 'GBP', 'EUR', 'JPY', 'NZD'];

  return (
    <div className="space-y-2" style={{ marginLeft: '15px', paddingLeft: '15px', marginTop: '10px', width: 'calc(100% - 15px)',padding:'10px' ,marginBottom:'10px'}}>
      <h2 className="text-2xl font-bold text-white mb-6" style={{ marginLeft: '15px', paddingLeft: '15px', marginTop: '10px', width: 'calc(100% - 15px)',padding:'10px' ,marginBottom:'10px'}}>Currency</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4" style={{ marginLeft: '15px', paddingLeft: '15px', marginTop: '10px', width: 'calc(100% - 15px)',padding:'10px' ,marginBottom:'10px'}}>
        {currencies.map((currency, index) => (
          <div 
            key={currency} 
            onClick={() => setSelectedCurrency(index)}
            className="flex justify-between items-center p-4 rounded-lg hover:bg-slate-700/50 cursor-pointer" 
            style={{ marginLeft: '15px', paddingLeft: '15px', marginTop: '10px', width: 'calc(100% - 15px)',padding:'10px' ,marginBottom:'10px'}}
          >
            <span className="font-medium text-white">{currency}</span>
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedCurrency === index ? 'border-blue-500 bg-blue-500' : 'border-gray-500'}`}>
              {selectedCurrency === index && <Check className="w-3 h-3 text-white" />}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const NetworkFeesSettings = () => {
  const [selectedFee, setSelectedFee] = useState(0);
  const fees = ['Automatic', 'Low', 'Medium', 'High'];

  return (
    <div className="space-y-2" style={{ marginLeft: '15px', paddingLeft: '15px', marginTop: '10px', width: 'calc(100% - 15px)',padding:'10px' ,marginBottom:'10px'}}>
      <h2 className="text-2xl font-bold text-white mb-6" style={{ marginLeft: '15px', paddingLeft: '15px', marginTop: '10px', width: 'calc(100% - 15px)',padding:'10px' ,marginBottom:'10px'}}>Network Fees</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4" style={{ marginLeft: '15px', paddingLeft: '15px', marginTop: '10px', width: 'calc(100% - 15px)',padding:'10px' ,marginBottom:'10px'}}>
        {fees.map((fee, index) => (
        <div 
          key={fee} 
          onClick={() => setSelectedFee(index)}
          className="flex justify-between items-center p-4 rounded-lg hover:bg-slate-700/50 cursor-pointer" 
          style={{ marginLeft: '15px', paddingLeft: '15px', marginTop: '10px', width: 'calc(100% - 15px)',padding:'10px' ,marginBottom:'10px'}}
        >
            <span className="font-medium text-white">{fee}</span>
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedFee === index ? 'border-blue-500 bg-blue-500' : 'border-gray-500'}`}>
            {selectedFee === index && <Check className="w-3 h-3 text-white" />}
            </div>
        </div>
        ))}
      </div>
    </div>
  );
};

const NotificationSettings = () => {
    const [toggles, setToggles] = useState({
        transaction: true,
        price: true,
        security: true,
        promotions: false,
    });

    const handleToggle = (key: keyof typeof toggles) => {
        setToggles(prev => ({...prev, [key]: !prev[key]}));
    }

    return (
        <div style={{ marginLeft: '15px', paddingLeft: '15px', marginTop: '10px', width: 'calc(100% - 15px)',padding:'10px' ,marginBottom:'10px'}}>
            <h2 className="text-2xl font-bold text-white mb-6" style={{ marginLeft: '15px', paddingLeft: '15px', marginTop: '10px', width: 'calc(100% - 15px)',padding:'10px' ,marginBottom:'10px'}}>Notification Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6" style={{ marginLeft: '15px', paddingLeft: '15px', marginTop: '10px', width: 'calc(100% - 15px)',padding:'10px' ,marginBottom:'10px'}}>
                <div className="flex justify-between items-center" style={{ marginLeft: '15px', paddingLeft: '15px', marginTop: '10px', width: 'calc(100% - 15px)',padding:'10px' ,marginBottom:'10px'}}>
                    <div>
                        <h3 className="font-semibold text-white">Transaction Alerts</h3>
                        <p className="text-sm text-gray-400">Enable/disable notifications for sent, received, pending, or failed transactions.</p>
                    </div>
                    <button onClick={() => handleToggle('transaction')} className={`w-12 h-6 rounded-full p-1 transition-colors ${toggles.transaction ? 'bg-blue-500' : 'bg-slate-600'}`}>
                        <div className={`w-4 h-4 bg-white rounded-full transition-transform ${toggles.transaction ? 'translate-x-6' : 'translate-x-0'}`}/>
                    </button>
                </div>
                <div className="flex justify-between items-center" style={{ marginLeft: '15px', paddingLeft: '15px', marginTop: '10px', width: 'calc(100% - 15px)',padding:'10px' ,marginBottom:'10px'}}>
                    <div>
                        <h3 className="font-semibold text-white">Price Alerts</h3>
                        <p className="text-sm text-gray-400">Set custom alerts when a coin/token hits a specific price.</p>
                    </div>
                     <button onClick={() => handleToggle('price')} className={`w-12 h-6 rounded-full p-1 transition-colors ${toggles.price ? 'bg-blue-500' : 'bg-slate-600'}`}>
                        <div className={`w-4 h-4 bg-white rounded-full transition-transform ${toggles.price ? 'translate-x-6' : 'translate-x-0'}`}/>
                    </button>
                </div>
                <div className="flex justify-between items-center" style={{ marginLeft: '15px', paddingLeft: '15px', marginTop: '10px', width: 'calc(100% - 15px)',padding:'10px' ,marginBottom:'10px'}}>
                    <div>
                        <h3 className="font-semibold text-white">Security Alerts</h3>
                        <p className="text-sm text-gray-400">Notifications for login from a new device, password changes, or suspicious activity.</p>
                    </div>
                     <button onClick={() => handleToggle('security')} className={`w-12 h-6 rounded-full p-1 transition-colors ${toggles.security ? 'bg-blue-500' : 'bg-slate-600'}`}>
                        <div className={`w-4 h-4 bg-white rounded-full transition-transform ${toggles.security ? 'translate-x-6' : 'translate-x-0'}`}/>
                    </button>
                </div>
                 <div className="flex justify-between items-center" style={{ marginLeft: '15px', paddingLeft: '15px', marginTop: '10px', width: 'calc(100% - 15px)',padding:'10px' ,marginBottom:'10px'}}>
                    <div>
                        <h3 className="font-semibold text-white">Promotions & Updates</h3>
                        <p className="text-sm text-gray-400">Option to receive news, offers, or system updates.</p>
                    </div>
                     <button onClick={() => handleToggle('promotions')} className={`w-12 h-6 rounded-full p-1 transition-colors ${toggles.promotions ? 'bg-blue-500' : 'bg-slate-600'}`}>
                        <div className={`w-4 h-4 bg-white rounded-full transition-transform ${toggles.promotions ? 'translate-x-6' : 'translate-x-0'}`}/>
                    </button>
                </div>
            </div>
        </div>
    );
};

const SecuritySettings = () => (
    <div style={{ marginLeft: '15px', paddingLeft: '15px', marginTop: '10px', width: 'calc(100% - 15px)',padding:'10px' ,marginBottom:'10px'}}>
        <h2 className="text-2xl font-bold text-white mb-6" style={{ marginLeft: '15px', paddingLeft: '15px', marginTop: '10px', width: 'calc(100% - 15px)',padding:'10px' ,marginBottom:'10px'}}>Security</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6" style={{ marginLeft: '15px', paddingLeft: '15px', marginTop: '10px', width: 'calc(100% - 15px)',padding:'10px' ,marginBottom:'10px'}}>
            <div className="flex justify-between items-center" style={{ marginLeft: '15px', paddingLeft: '15px', marginTop: '10px', width: 'calc(100% - 15px)',padding:'10px' ,marginBottom:'10px'}}>
                <h3 className="font-semibold text-white">Device connection</h3>
                <button className="text-sm text-blue-400 font-semibold hover:underline">Paired</button>
            </div>
             <div className="flex justify-between items-center" style={{ marginLeft: '15px', paddingLeft: '15px', marginTop: '10px', width: 'calc(100% - 15px)',padding:'10px' ,marginBottom:'10px'}}>
                <div>
                    <h3 className="font-semibold text-white">Two-Factor Authentication</h3>
                    <p className="text-sm text-gray-400">Enable/disable 2FA for app actions</p>
                </div>
                <button className="w-12 h-6 rounded-full p-1 bg-blue-500">
                    <div className="w-4 h-4 bg-white rounded-full translate-x-6"/>
                </button>
            </div>
             <div className="flex justify-between items-center" style={{ marginLeft: '15px', paddingLeft: '15px', marginTop: '10px', width: 'calc(100% - 15px)',padding:'10px' ,marginBottom:'10px'}}>
                <div>
                    <h3 className="font-semibold text-white">Backup & recovery options</h3>
                    <p className="text-sm text-gray-400">Recover, backup and download seed phrase</p>
                </div>
            </div>
        </div>
    </div>
);

interface SettingsPageProps {
  className?: string;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ className = '' }) => {
  const [activeTab, setActiveTab] = useState('security');

  const renderContent = () => {
    switch (activeTab) {
      case 'language':
        return <LanguageSettings />;
      case 'currency':
        return <CurrencySettings />;
      case 'network-fees':
        return <NetworkFeesSettings />;
      case 'notifications':
        return <NotificationSettings />;
      case 'security':
        return <SecuritySettings />;
      default:
        return null;
    }
  };

  return (
    <div className={`bg-[#1E293B] w-full h-[80vh] rounded-2xl grid grid-cols-1 md:grid-cols-[280px,1fr] ${className}`} 
    style={{ marginLeft: '15px', paddingLeft: '15px', marginTop: '100px', width: 'calc(100% - 15px)',padding:'20px' ,marginBottom:'10px'}}>
        {/* Sidebar */}
        <aside className="p-6 border-r border-slate-700">
            <nav className="space-y-2">
                {settingsTabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-left transition-colors ${activeTab === tab.id ? 'bg-white text-slate-900' : 'hover:bg-slate-700/50 text-white'}`}
                        style={{ marginLeft: '15px', paddingLeft: '15px', marginTop: '10px', width: 'calc(100% - 15px)',padding:'10px' ,marginBottom:'10px'}}
                    >
                        {tab.icon}
                        <span className="font-semibold">{tab.name}</span>
                    </button>
                ))}
            </nav>
        </aside>

        {/* Main Content */}
        <main className="pr-8 pt-8 pb-8 overflow-y-auto">
            {renderContent()}
        </main>
    </div>
  );
};

export default SettingsPage;
