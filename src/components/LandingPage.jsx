import React, { useState, useEffect } from "react";
import {
  Page,
  Layout,
  Card,
  Text,
  Button,
  BlockStack,
  InlineGrid,
  TextField,
  Badge,
  Box,
  Divider,
  Modal,
  List,
  Avatar,
  Banner
} from "@shopify/polaris";

// 🟢 STATIC REVIEWS DATA
const STATIC_REVIEWS = [
  { name: "Sarah K.", rating: 5, comment: "Recovered 15 sales in the first week! Customers love the WhatsApp alerts.", designation: "Fashion Store" },
  { name: "Mike D.", rating: 5, comment: "Setup was instant. The WhatsApp icon looks great on my product pages.", designation: "Gadget Shop" },
  { name: "Jessica L.", rating: 4, comment: "Much higher open rates than email back-in-stock alerts.", designation: "Decor Brand" },
];

const LandingPage = ({ shopName, setShopName, backendUrl, handleInstall }) => {
  const [reviews, setReviews] = useState(STATIC_REVIEWS);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const [newReview, setNewReview] = useState({ name: "", comment: "" });
  
  // 🟢 SMART CHECK: Is the app already installed?
  const savedShop = localStorage.getItem("shopName");
  const isReturningUser = !!savedShop && savedShop.length > 0;

  // 🟢 HANDLE INSTALL BUTTON
  const handleMainAction = () => {
    if (isReturningUser) {
      handleInstall();
    } else {
      if (shopName && !shopName.includes(".myshopify.com") && !shopName.includes(".")) {
        setShopName(`${shopName}.myshopify.com`);
      }
      setIsInstallModalOpen(true);
    }
  };

  const confirmInstall = () => {
    // Update your Ngrok URL here
    const API_BASE = "https://snakiest-edward-autochthonously.ngrok-free.dev";
    const authUrl = shopName ? `${API_BASE}/api/auth?shop=${shopName}` : `${API_BASE}/api/auth`;
    window.location.href = authUrl;
  };

  const submitReview = () => {
    const reviewToAdd = { ...newReview, rating: 5, designation: "Store Owner" };
    setReviews([...reviews, reviewToAdd]);
    setIsReviewModalOpen(false);
    setNewReview({ name: "", comment: "" });
  };

  return (
    <Page fullWidth>
      <Layout>
        {/* --- LEFT SIDEBAR (APP INFO) --- */}
        <Layout.Section variant="oneThird">
          <BlockStack gap="500">
            <Card>
              <BlockStack gap="400" alignItems="center">
                {/* WhatsApp Logo Placeholder */}
                <div style={{ background: "#25D366", borderRadius: "12px", padding: "10px" }}>
                  <img 
                    src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" 
                    width="60" 
                    alt="WhatsApp" 
                    style={{ display: "block" }}
                  />
                </div>
                <BlockStack gap="100" align="center">
                  <Text variant="headingXl" as="h1" alignment="center">
                    WhatsApp Alerts
                  </Text>
                  <Text tone="subdued" as="p">
                    Back-in-Stock Notifications
                  </Text>
                  <InlineGrid columns={2} gap="200">
                     <Badge tone="success">Built for Shopify</Badge>
                     <Badge>4.9 ★ (850+)</Badge>
                  </InlineGrid>
                </BlockStack>

                <Divider />

                {!isReturningUser && (
                  <TextField
                    label="Store URL"
                    value={shopName}
                    onChange={(val) => setShopName(val)}
                    placeholder="store.myshopify.com"
                    autoComplete="off"
                  />
                )}

                <Button 
                  variant="primary" 
                  fullWidth 
                  size="large" 
                  onClick={handleMainAction}
                  tone="success"
                >
                  {isReturningUser ? "Open Dashboard" : "Install App"}
                </Button>
                
                <Text variant="bodyXs" tone="subdued" alignment="center">
                   No coding required. Instant setup.
                </Text>
              </BlockStack>
            </Card>

            <Card>
               <BlockStack gap="200">
                  <Text variant="headingSm" as="h3">Why Merchants Love Us</Text>
                  <List type="bullet">
                    <List.Item>Instant Setup (No Coding)</List.Item>
                    <List.Item>Recover 30% more sales</List.Item>
                    <List.Item>Native WhatsApp Integration</List.Item>
                  </List>
               </BlockStack>
            </Card>
          </BlockStack>
        </Layout.Section>

        {/* --- RIGHT CONTENT (HERO & REVIEWS) --- */}
        <Layout.Section>
          <BlockStack gap="600">
            
            {/* HERO BANNER */}
            <Card padding="0">
              <div style={{
                background: "linear-gradient(135deg, #e0f7fa 0%, #e8f5e9 100%)",
                padding: "40px",
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                borderRadius: "8px"
              }}>
                <div style={{ maxWidth: "60%" }}>
                   <BlockStack gap="400">
                      <Text variant="heading2xl" as="h2">
                        Don't let "Out of Stock" <br/> mean "Out of Luck"
                      </Text>
                      <Text variant="bodyLg" as="p">
                        Capture lost revenue by letting customers subscribe to restock alerts directly via WhatsApp.
                      </Text>
                      <Button size="large" onClick={handleMainAction}>Start Capturing Sales</Button>
                   </BlockStack>
                </div>
                <img 
                  src="https://cdn-icons-png.flaticon.com/512/3670/3670051.png" 
                  width="120" 
                  alt="Hero" 
                  style={{ opacity: 0.9 }}
                />
              </div>
            </Card>

            {/* REVIEWS SECTION */}
            <Card>
               <BlockStack gap="400">
                  <InlineGrid columns="1fr auto" alignItems="center">
                     <Text variant="headingMd" as="h3">Trusted by 800+ Merchants</Text>
                     <Button variant="plain" onClick={() => setIsReviewModalOpen(true)}>Write a review</Button>
                  </InlineGrid>
                  <Divider />
                  <InlineGrid columns={{ xs: 1, sm: 3 }} gap="400">
                     {reviews.map((rev, idx) => (
                        <Box key={idx} background="bg-surface-secondary" padding="400" borderRadius="200">
                           <BlockStack gap="200">
                              <InlineGrid columns="auto 1fr" gap="200" alignItems="center">
                                 <Avatar customer name={rev.name} size="md" />
                                 <div>
                                    <Text variant="bodyMd" fontWeight="bold" as="p">{rev.name}</Text>
                                    <Text variant="bodyXs" tone="subdued" as="p">{rev.designation}</Text>
                                 </div>
                              </InlineGrid>
                              <Text variant="bodyMd" as="p">"{rev.comment}"</Text>
                              <InlineGrid gap="100" columns={5} style={{width: 'fit-content'}}>
                                 {[...Array(rev.rating)].map((_, i) => (
                                    <div key={i} style={{color: "#FFD700"}}>★</div>
                                 ))}
                              </InlineGrid>
                           </BlockStack>
                        </Box>
                     ))}
                  </InlineGrid>
               </BlockStack>
            </Card>

          </BlockStack>
        </Layout.Section>
      </Layout>

      {/* --- MODAL: INSTALL CONFIRMATION --- */}
      <Modal
        open={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
        title="Connect to Store"
        primaryAction={{
          content: 'Confirm Installation',
          onAction: confirmInstall,
          tone: 'success',
        }}
        secondaryActions={[
          {
            content: 'Cancel',
            onAction: () => setIsInstallModalOpen(false),
          },
        ]}
      >
        <Modal.Section>
          <BlockStack gap="400">
            <Banner tone="success">
               <Text variant="headingMd" as="h4">Ready to Install</Text>
               <p>This will redirect you to Shopify to approve the app permissions.</p>
            </Banner>
          </BlockStack>
        </Modal.Section>
      </Modal>

      {/* --- MODAL: WRITE REVIEW --- */}
      <Modal
        open={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        title="Write a Review"
        primaryAction={{
          content: 'Submit Review',
          onAction: submitReview,
        }}
        secondaryActions={[
          {
            content: 'Cancel',
            onAction: () => setIsReviewModalOpen(false),
          },
        ]}
      >
        <Modal.Section>
          <BlockStack gap="400">
            <TextField
              label="Your Name"
              value={newReview.name}
              onChange={(val) => setNewReview({...newReview, name: val})}
              autoComplete="off"
            />
            <TextField
              label="Review"
              value={newReview.comment}
              onChange={(val) => setNewReview({...newReview, comment: val})}
              multiline={4}
              autoComplete="off"
            />
          </BlockStack>
        </Modal.Section>
      </Modal>

    </Page>
  );
};

export default LandingPage;