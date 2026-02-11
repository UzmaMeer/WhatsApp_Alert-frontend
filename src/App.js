import React, { useState, useEffect } from 'react';
import { Frame, Navigation, TopBar } from '@shopify/polaris';
import { HomeIcon, PaintBrushFlatIcon } from '@shopify/polaris-icons';
import LandingPage from './components/LandingPage';
import ProductPage from './components/ProductPage'; 
import ProductDetail from './components/ProductDetail'; 
import BrandKitModal from './components/BrandKitModal'; 
import '@shopify/polaris/build/esm/styles.css';

const App = () => {
  // --- STATE ---
  const [shopName, setShopName] = useState(() => localStorage.getItem('shopName') || '');
  const [isInstalled, setIsInstalled] = useState(() => localStorage.getItem('isInstalled') === 'true');
  
  const [activeTab, setActiveTab] = useState('products');
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [mobileNavigationActive, setMobileNavigationActive] = useState(false);
  const [showBrandKit, setShowBrandKit] = useState(false);

  // 🟢 AUTO-LOGIN LOGIC
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlShop = params.get('shop');
    
    if (urlShop) {
        const cleanShop = urlShop.replace('https://', '').replace('/', '');
        setShopName(cleanShop);
        setIsInstalled(true);
        localStorage.setItem('shopName', cleanShop);
        localStorage.setItem('isInstalled', 'true');
        window.history.replaceState({}, document.title, "/");
    }

    if (params.get('reset') === 'true') {
        localStorage.clear();
        setIsInstalled(false);
        setShopName('');
        window.history.replaceState({}, document.title, "/");
    }
  }, []);

  // --- HANDLERS ---
  const handleLoginSubmit = (enteredShopName) => {
    let cleanShop = enteredShopName.trim();
    if (!cleanShop.includes(".")) cleanShop += ".myshopify.com";
    setShopName(cleanShop);
    localStorage.setItem('shopName', cleanShop);
  };

  const handleDisconnect = () => {
      setIsInstalled(false);
      setShopName('');
      localStorage.clear();
  };

  // --- UI COMPONENTS ---
  const topBarMarkup = (
    <TopBar
      showNavigationToggle
      userMenu={<TopBar.UserMenu actions={[{ items: [{content: 'Disconnect', onAction: handleDisconnect}] }]} name={shopName || "Store"} initials="S" />}
      onNavigationToggle={() => setMobileNavigationActive(!mobileNavigationActive)}
    />
  );

  const navigationMarkup = (
    <Navigation location="/">
      <Navigation.Section
        items={[
          { label: 'Products', icon: HomeIcon, selected: activeTab === 'products', onClick: () => { setActiveTab('products'); setSelectedProductId(null); } },
          { label: 'Brand Kit', icon: PaintBrushFlatIcon, onClick: () => setShowBrandKit(true) },
        ]}
      />
    </Navigation>
  );

  // 🟢 ROUTING
  if (!isInstalled) {
    return <LandingPage shopName={shopName} setShopName={setShopName} handleInstall={() => handleLoginSubmit(shopName)} />;
  }

  return (
    <Frame topBar={topBarMarkup} navigation={navigationMarkup} showMobileNavigation={mobileNavigationActive} onNavigationDismiss={() => setMobileNavigationActive(false)}>
      {showBrandKit && <BrandKitModal onClose={() => setShowBrandKit(false)} shopName={shopName} />}
      
      {/* If product selected -> Show Detail. Else -> Show List */}
      {selectedProductId ? (
          <ProductDetail 
            productId={selectedProductId} 
            shopName={shopName} 
            onBack={() => setSelectedProductId(null)} 
          />
      ) : (
          <ProductPage 
            onSelectProduct={setSelectedProductId} 
            shopName={shopName} 
          />
      )}
    </Frame>
  );
};

export default App;