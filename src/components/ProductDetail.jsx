import React, { useEffect, useState, useCallback } from 'react';
import {
  Page,
  Layout,
  Card,
  Banner,
  BlockStack,
  InlineStack,
  Text,
  Badge,
  Spinner,
  Button,
  Divider,
  Modal,
  TextField,
  FormLayout,
  Toast
} from '@shopify/polaris';

import { BACKEND_URL } from '../config';

const ProductDetail = ({ productId, shopName, onBack }) => {
  // --- STATE MANAGEMENT ---
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  // --- MODAL & FORM STATE ---
  const [activeModal, setActiveModal] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // --- FETCH PRODUCT DETAILS ---
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        // Fetching from the general products list and filtering locally
        const response = await fetch(`${BACKEND_URL}/api/products?shop=${shopName}`, {
          headers: { "ngrok-skip-browser-warning": "true" }
        });
        const data = await response.json();
        
        if (data.products) {
          const foundProduct = data.products.find(p => String(p.id) === String(productId));
          if (foundProduct) {
            setProduct(foundProduct);
            const allImages = foundProduct.images ? foundProduct.images.map(img => img.src) : [];
            if (allImages.length > 0) setSelectedImage(allImages[0]);
          }
        }
      } catch (error) { 
        console.error("Error fetching product details:", error); 
      } finally { 
        setLoading(false); 
      }
    };
    if (productId) fetchDetails();
  }, [productId, shopName]);

  // --- HANDLERS ---
  const toggleModal = useCallback(() => setActiveModal(!activeModal), [activeModal]);
  const toggleToast = useCallback(() => setShowToast(!showToast), [showToast]);

  const handleSubscribe = async () => {
    if (!customerName || !customerPhone) {
        alert("Please enter both name and phone number.");
        return;
    }

    setSubmitting(true);
    try {
        const response = await fetch(`${BACKEND_URL}/api/subscribe`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                shop: shopName,
                product_id: String(product.id),
                product_title: product.title,
                customer_name: customerName,
                phone_number: customerPhone
            })
        });

        const result = await response.json();
        if (result.status === 'success') {
            setActiveModal(false);
            setCustomerName('');
            setCustomerPhone('');
            setShowToast(true); 
        } else {
            alert("Failed to save: " + result.message);
        }
    } catch (error) {
        alert("Error connecting to server.");
    } finally {
        setSubmitting(false);
    }
  };

  // --- RENDER HELPERS ---
  if (loading) return (
    <div style={{display:'flex', justifyContent:'center', marginTop:'50px'}}>
        <Spinner size="large" />
    </div>
  );

  if (!product) return (
    <Page backAction={{content: 'Products', onAction: onBack}}>
        <Banner tone="critical">Product not found</Banner>
    </Page>
  );

  const price = product.variants && product.variants[0] ? product.variants[0].price : '0.00';
  const totalInventory = product.variants ? product.variants.reduce((acc, v) => acc + (v.inventory_quantity || 0), 0) : 0;
  const isOutOfStock = totalInventory <= 0;

  return (
    <Page
        title={product.title}
        subtitle={`PKR ${price}`}
        backAction={{content: 'Products', onAction: onBack}}
    >
        <Layout>
            {/* Main Product Image Section */}
            <Layout.Section>
                <Card>
                    <BlockStack gap="400">
                        <div style={{
                            height: '400px', 
                            display: 'flex', 
                            justifyContent: 'center', 
                            alignItems: 'center', 
                            background: '#f4f4f4', 
                            borderRadius: '8px', 
                            overflow: 'hidden'
                        }}>
                            <img 
                                src={selectedImage || 'https://via.placeholder.com/600'} 
                                alt={product.title} 
                                style={{maxHeight: '100%', maxWidth: '100%', objectFit: 'contain'}} 
                            />
                        </div>
                    </BlockStack>
                </Card>
            </Layout.Section>

            {/* Side Action Column */}
            <Layout.Section variant="oneThird">
                <BlockStack gap="500">
                    <Card>
                        <BlockStack gap="400" alignItems="center">
                            {/* WhatsApp Subscription Icon */}
                            <div 
                                onClick={toggleModal}
                                style={{
                                    background: '#25D366', 
                                    borderRadius: '50%', 
                                    width: '70px', 
                                    height: '70px', 
                                    display: 'flex', 
                                    justifyContent: 'center', 
                                    alignItems: 'center',
                                    boxShadow: '0 4px 10px rgba(37, 211, 102, 0.3)',
                                    cursor: 'pointer',
                                    transition: 'transform 0.2s'
                                }}
                                onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                                onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                            >
                                <img 
                                    src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" 
                                    width="40" 
                                    alt="WhatsApp" 
                                />
                            </div>

                            <BlockStack gap="100" align="center">
                                <Text variant="headingMd" as="h2" alignment="center">
                                    Notify Me via WhatsApp
                                </Text>
                                <Text tone="subdued" alignment="center">
                                    Click the icon above to subscribe for restock alerts.
                                </Text>
                            </BlockStack>

                            <InlineStack align="center">
                                {isOutOfStock ? (
                                    <Badge tone="critical">Out of Stock</Badge>
                                ) : (
                                    <Badge tone="success">In Stock</Badge>
                                )}
                            </InlineStack>

                            <Button onClick={toggleModal} fullWidth variant="primary" tone="success">
                                Subscribe to Alerts
                            </Button>
                        </BlockStack>
                    </Card>

                    <Card>
                        <BlockStack gap="300">
                            <Text variant="headingSm" as="h3">Description</Text>
                            <Divider />
                            <div style={{ maxHeight: '300px', overflowY: 'auto', fontSize: '14px', lineHeight: '1.5', color: '#444'}}>
                                <div dangerouslySetInnerHTML={{ __html: product.body_html || "<p>No description available.</p>" }} />
                            </div>
                        </BlockStack>
                    </Card>
                </BlockStack>
            </Layout.Section>
        </Layout>

        {/* Subscription Modal */}
        <Modal
            open={activeModal}
            onClose={toggleModal}
            title="Get WhatsApp Alerts 🔔"
            primaryAction={{
                content: submitting ? 'Saving...' : 'Notify Me',
                onAction: handleSubscribe,
                disabled: submitting
            }}
            secondaryActions={[
                {
                    content: 'Cancel',
                    onAction: toggleModal,
                },
            ]}
        >
            <Modal.Section>
                <FormLayout>
                    <p>Receive an instant WhatsApp message when <b>{product.title}</b> is back in stock.</p>
                    <TextField
                        label="Your Name"
                        value={customerName}
                        onChange={setCustomerName}
                        autoComplete="name"
                        placeholder="e.g. Ali Khan"
                    />
                    <TextField
                        label="WhatsApp Number"
                        value={customerPhone}
                        onChange={setCustomerPhone}
                        type="tel"
                        autoComplete="tel"
                        placeholder="e.g. +92 300 1234567"
                        helpText="Include your country code (e.g., +92)."
                    />
                </FormLayout>
            </Modal.Section>
        </Modal>

        {/* Success Notification */}
        {showToast && (
            <Toast content="Success! You are subscribed." onDismiss={toggleToast} />
        )}
    </Page>
  );
};

export default ProductDetail;