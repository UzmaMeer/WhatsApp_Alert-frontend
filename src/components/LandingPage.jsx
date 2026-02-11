import React, { useState } from "react";
// 🟢 Added 'FooterHelp' and 'Link' to your Polaris imports
import { Page, Layout, Card, Text, Button, BlockStack, InlineGrid, TextField, Badge, Box, Divider, Modal, List, Avatar, FooterHelp, Link } from "@shopify/polaris";
import { BACKEND_URL } from "../config";

const STATIC_REVIEWS = [
  { name: "Sarah K.", rating: 5, comment: "Recovered 15 sales in the first week!", designation: "Fashion Store" },
  { name: "Mike D.", rating: 5, comment: "Setup was instant. Looks great.", designation: "Gadget Shop" },
  { name: "Jessica L.", rating: 4, comment: "High open rates on WhatsApp.", designation: "Decor Brand" },
];

const LandingPage = ({ shopName, setShopName, handleInstall }) => {
  const [reviews, setReviews] = useState(STATIC_REVIEWS);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [newReview, setNewReview] = useState({ name: "", comment: "" });
  
  // 🟢 INSTALL HANDLER
  const handleMainAction = () => {
      if (!shopName) { alert("Please enter a shop URL"); return; }
      
      handleInstall();
      
      let cleanShop = shopName;
      if (!cleanShop.includes(".")) cleanShop += ".myshopify.com";
      window.location.href = `${BACKEND_URL}/api/auth?shop=${cleanShop}`;
  };

  const submitReview = () => {
    setReviews([...reviews, { ...newReview, rating: 5, designation: "Store Owner" }]);
    setIsReviewModalOpen(false);
  };

  return (
    <Page fullWidth>
      <Layout>
        {/* --- LEFT SIDEBAR --- */}
        <Layout.Section variant="oneThird">
          <BlockStack gap="500">
            <Card>
              <BlockStack gap="400" alignItems="center">
                <div style={{ background: "#25D366", borderRadius: "12px", padding: "10px" }}>
                  <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" width="60" alt="WhatsApp" />
                </div>
                <BlockStack gap="100" align="center">
                  <Text variant="headingXl" as="h1" alignment="center">WhatsApp Alerts</Text>
                  <Text tone="subdued" as="p">Back-in-Stock Notifications</Text>
                  <InlineGrid columns={2} gap="200">
                      <Badge tone="success">Built for Shopify</Badge>
                      <Badge>4.9 ★ (850+)</Badge>
                  </InlineGrid>
                </BlockStack>
                <Divider />
                <TextField
                    label="Store URL"
                    value={shopName}
                    onChange={setShopName}
                    placeholder="store.myshopify.com"
                    autoComplete="off"
                />
                <Button variant="primary" fullWidth size="large" onClick={handleMainAction} tone="success">
                  Install App
                </Button>
                <Text variant="bodyXs" tone="subdued" alignment="center">No coding required.</Text>
              </BlockStack>
            </Card>
            <Card>
                <BlockStack gap="200">
                  <Text variant="headingSm" as="h3">Why Merchants Love Us</Text>
                  <List type="bullet">
                    <List.Item>Instant Setup</List.Item>
                    <List.Item>Recover 30% more sales</List.Item>
                  </List>
                </BlockStack>
            </Card>
          </BlockStack>
        </Layout.Section>

        {/* --- RIGHT CONTENT --- */}
        <Layout.Section>
          <BlockStack gap="600">
            <Card padding="0">
              <div style={{ background: "linear-gradient(135deg, #e0f7fa 0%, #e8f5e9 100%)", padding: "40px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ maxWidth: "60%" }}>
                    <BlockStack gap="400">
                      <Text variant="heading2xl" as="h2">Don't let "Out of Stock" <br/> mean "Out of Luck"</Text>
                      <Button size="large" onClick={handleMainAction}>Start Capturing Sales</Button>
                    </BlockStack>
                </div>
                <img src="https://cdn-icons-png.flaticon.com/512/3670/3670051.png" width="120" alt="Hero" style={{ opacity: 0.9 }} />
              </div>
            </Card>

            {/* REVIEWS */}
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
                               <div style={{color: "#FFD700"}}>★★★★★</div>
                            </BlockStack>
                         </Box>
                      ))}
                    </InlineGrid>
                </BlockStack>
            </Card>
          </BlockStack>
        </Layout.Section>
      </Layout>

      {/* 🟢 LEGAL FOOTER: Crucial for Google Safety Approval */}
      <FooterHelp>
        Learn more about our{" "}
        <Link url="/privacy" external>Privacy Policy</Link> and{" "}
        <Link url="/terms" external>Terms of Service</Link>.
      </FooterHelp>

      {/* REVIEW MODAL */}
      <Modal open={isReviewModalOpen} onClose={() => setIsReviewModalOpen(false)} title="Write a Review" primaryAction={{ content: 'Submit', onAction: submitReview }}>
        <Modal.Section>
          <BlockStack gap="400">
            <TextField label="Name" value={newReview.name} onChange={(v)=>setNewReview({...newReview, name: v})} autoComplete="off"/>
            <TextField label="Review" value={newReview.comment} onChange={(v)=>setNewReview({...newReview, comment: v})} multiline={4} autoComplete="off"/>
          </BlockStack>
        </Modal.Section>
      </Modal>
    </Page>
  );
};

export default LandingPage;