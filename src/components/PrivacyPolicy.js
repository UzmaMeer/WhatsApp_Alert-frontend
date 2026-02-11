import React from 'react';
import { Page, TextContainer, Heading, Text } from '@shopify/polaris';

const PrivacyPolicy = () => (
    <Page title="Privacy Policy">
        <TextContainer>
            <Heading>Data Collection</Heading>
            <Text as="p">
                This app collects customer phone numbers solely for the purpose of sending 
                automated WhatsApp alerts when out-of-stock products are restocked.
            </Text>
            <Heading>Data Usage</Heading>
            <Text as="p">
                We do not sell or share your data with third parties. Data is stored 
                securely in our encrypted database.
            </Text>
        </TextContainer>
    </Page>
);

export default PrivacyPolicy;