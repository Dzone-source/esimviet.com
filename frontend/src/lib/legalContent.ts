export interface LegalSection {
  id: string;
  title: string;
  paragraphs?: string[];
  list?: string[];
}

export interface LegalDocument {
  slug: string;
  title: string;
  description: string;
  effectiveDate: string;
  lastUpdated: string;
  intro?: string;
  sections: LegalSection[];
  contact?: {
    company: string;
    email: string;
    whatsapp?: string;
    address?: string;
    taxCode?: string;
  };
}

export const COMPANY = {
  name: 'Công ty TNHH Hạt Giống Tư Bản',
  nameEn: 'Hat Giong Tu Ban Company Limited',
  email: 'support@esimviet.com',
  whatsapp: '+84 796 969 444',
  website: 'esimviet.com',
};

export const LEGAL_DATES = {
  effectiveDate: 'July 12, 2026',
  lastUpdated: 'July 12, 2026',
};

export const PRIVACY_POLICY: LegalDocument = {
  slug: 'privacy',
  title: 'Privacy Policy',
  description: 'How eSIM Viet collects, uses, and protects your personal information.',
  effectiveDate: LEGAL_DATES.effectiveDate,
  lastUpdated: LEGAL_DATES.lastUpdated,
  intro: `${COMPANY.name} ("the Company," "we," "us," "our") operates ${COMPANY.website} (the "Site"). This Privacy Policy explains what information we collect, how we use it, and the choices you have.`,
  sections: [
    {
      id: 'information-we-collect',
      title: '1. Information We Collect',
      paragraphs: ['We collect information in the following ways:'],
      list: [
        'Information you provide directly: email address (required for eSIM delivery), name and billing details (as required by PayPal for payment processing), order history and support communications.',
        'Information collected automatically: IP address, browser type, device type, pages visited, referral source, and general usage analytics via cookies or similar technologies.',
        'Information from third parties: payment confirmation data from PayPal (we do not receive or store your full card or PayPal account credentials).',
      ],
    },
    {
      id: 'how-we-use',
      title: '2. How We Use Your Information',
      paragraphs: ['We use collected information to:'],
      list: [
        'Deliver purchased eSIM products and support communications.',
        'Process payments and prevent fraud.',
        'Respond to customer support requests.',
        'Improve the Site, product offerings, and marketing (e.g., via aggregated, non-identifying analytics).',
        'Comply with Vietnamese legal and tax obligations.',
      ],
    },
    {
      id: 'no-selling',
      title: 'We Do Not Sell Your Data',
      paragraphs: ['We do not sell your personal information to third parties.'],
    },
    {
      id: 'information-sharing',
      title: '3. Information Sharing',
      paragraphs: ['We may share information with:'],
      list: [
        'Payment processors (e.g., PayPal), solely to process transactions.',
        'Carriers/eSIM providers, solely to the extent necessary to provision your eSIM.',
        'Service providers (e.g., hosting, email delivery) under confidentiality obligations.',
        'Legal authorities, where required by Vietnamese law, court order, or to protect the Company\'s legal rights.',
      ],
    },
    {
      id: 'data-retention',
      title: '4. Data Retention',
      paragraphs: [
        'We retain order and communication data for as long as necessary to fulfill orders, comply with Vietnamese tax and accounting record-keeping requirements, and resolve disputes. We may retain certain data longer where necessary to protect the Company\'s legal interests (e.g., evidence of delivery in the event of a payment dispute).',
      ],
    },
    {
      id: 'your-rights',
      title: '5. Your Rights',
      paragraphs: [
        `Depending on your jurisdiction, you may have the right to request access to, correction of, or deletion of your personal data, subject to our legitimate business and legal record-keeping needs. Requests can be sent to ${COMPANY.email}.`,
      ],
    },
    {
      id: 'cookies',
      title: '6. Cookies',
      paragraphs: [
        'The Site may use cookies or similar technologies for essential site functionality and analytics. You can control cookies through your browser settings; disabling them may affect Site functionality.',
      ],
    },
    {
      id: 'data-security',
      title: '7. Data Security',
      paragraphs: [
        'We take reasonable technical and organizational measures to protect your information. However, no method of transmission or storage is 100% secure, and the Company cannot guarantee absolute security.',
      ],
    },
    {
      id: 'children',
      title: '8. Children\'s Privacy',
      paragraphs: [
        'The Site is not directed at individuals under 18. We do not knowingly collect personal data from minors.',
      ],
    },
    {
      id: 'changes',
      title: '9. Changes to This Policy',
      paragraphs: [
        'We reserve the right to update this Privacy Policy at any time, at our sole discretion. Continued use of the Site after changes are posted constitutes acceptance of the revised policy.',
      ],
    },
  ],
  contact: {
    company: COMPANY.name,
    email: COMPANY.email,
    whatsapp: COMPANY.whatsapp,
  },
};

export const REFUND_POLICY: LegalDocument = {
  slug: 'refund',
  title: 'Refund Policy',
  description: 'Refund terms for digital eSIM products purchased on eSIM Viet.',
  effectiveDate: LEGAL_DATES.effectiveDate,
  lastUpdated: LEGAL_DATES.lastUpdated,
  intro: `This Refund Policy applies to all eSIM products purchased on ${COMPANY.website}, operated by ${COMPANY.name}. Because eSIM products are digital goods delivered instantly and irrevocably, our refund policy is more limited than for physical goods. Please read carefully before purchasing.`,
  sections: [
    {
      id: 'general-rule',
      title: '1. General Rule: All Sales Are Final',
      paragraphs: [
        'Once an eSIM QR code has been generated and delivered to the email address or account provided at checkout, the order is considered fulfilled, whether or not you have installed, activated, or used the eSIM. As a digital product, esimviet.com does not offer refunds, exchanges, or cancellations once a QR code has been issued, except in the limited circumstances described in Section 2.',
      ],
    },
    {
      id: 'eligible-refunds',
      title: '2. Circumstances Eligible for Refund Review',
      paragraphs: [
        'At the Company\'s sole discretion, a refund may be considered only in the following cases, and only if reported within 48 hours of purchase:',
      ],
      list: [
        'Non-delivery: You did not receive the QR code or activation details due to a verified technical failure on our end (not due to spam filters, incorrect email entry, or customer error).',
        'Duplicate charge: You were charged more than once for the same order due to a payment processing error.',
        'Proven non-functional eSIM prior to activation: The eSIM fails to install due to a verified defect in the eSIM profile itself (not device incompatibility, not carrier network issues, and not usage after installation).',
      ],
    },
    {
      id: 'never-refundable',
      title: '3. What Is Never Refundable',
      list: [
        'Any eSIM that has been installed and/or activated on a device.',
        'Any eSIM where the QR code has been scanned, downloaded, or shared, regardless of activation status.',
        'Data allowances that were not fully used within the validity period.',
        'Orders where the customer provided an incorrect email address or device information.',
        'Refund requests outside eligible categories, including change of mind, trip cancellation, device incompatibility discovered after purchase, or dissatisfaction with carrier network speed or coverage.',
      ],
    },
    {
      id: 'how-to-request',
      title: '4. How to Request a Refund Review',
      paragraphs: [
        `Refund requests must be submitted to ${COMPANY.email} or WhatsApp ${COMPANY.whatsapp} with your order number and a description of the issue within 48 hours of purchase. The Company will review each request individually. Submitting a request does not guarantee approval. The Company's decision on refund eligibility is final.`,
      ],
    },
    {
      id: 'chargebacks',
      title: '5. Payment Disputes and Chargebacks',
      paragraphs: [
        'We encourage customers to contact our support team before filing a PayPal dispute or chargeback. Filing a chargeback without first attempting to resolve the issue through support may result in the Company disputing the claim with supporting delivery and activation evidence, and may result in suspension of the customer\'s account from future purchases.',
      ],
    },
    {
      id: 'approved-refunds',
      title: '6. Approved Refunds',
      paragraphs: [
        'If a refund is approved, it will be issued to the original payment method within 5–10 business days, less any non-recoverable payment processing fees, where permitted by law.',
      ],
    },
    {
      id: 'changes',
      title: '7. Changes to This Policy',
      paragraphs: [
        'The Company reserves the right to update this Refund Policy at any time, at its sole discretion. The policy in effect at the time of your purchase applies to that order.',
      ],
    },
  ],
  contact: {
    company: COMPANY.name,
    email: COMPANY.email,
    whatsapp: COMPANY.whatsapp,
  },
};

export const TERMS_OF_SERVICE: LegalDocument = {
  slug: 'terms',
  title: 'Terms of Service',
  description: 'Terms and conditions for using eSIM Viet and purchasing eSIM products.',
  effectiveDate: LEGAL_DATES.effectiveDate,
  lastUpdated: LEGAL_DATES.lastUpdated,
  intro: `Welcome to ${COMPANY.website} ("the Site," "we," "us," or "our"), operated by ${COMPANY.name} (${COMPANY.nameEn}), a company registered in Vietnam ("the Company"). By accessing or using this Site, purchasing an eSIM, or otherwise using our services, you ("the Customer," "you") agree to be bound by these Terms of Service ("Terms"). If you do not agree, please do not use the Site.`,
  sections: [
    {
      id: 'nature-of-service',
      title: '1. Nature of the Service',
      paragraphs: [
        'esimviet.com sells prepaid eSIM data products issued by third-party mobile network operators ("Carriers") for use by travelers and residents in Vietnam and other supported destinations. We act as an authorized reseller/distributor of these products. We do not operate the underlying mobile network and are not the Carrier.',
      ],
    },
    {
      id: 'eligibility',
      title: '2. Eligibility and Device Compatibility',
      paragraphs: [
        'You are solely responsible for verifying that your device is eSIM-compatible and carrier-unlocked before purchase. The Company provides compatibility information as a courtesy only and does not guarantee compatibility with every device, firmware version, or region. We are not liable for a failed activation caused by an incompatible or locked device.',
      ],
    },
    {
      id: 'orders-pricing',
      title: '3. Orders, Pricing, and Availability',
      list: [
        'All prices are listed in the currency shown at checkout and are subject to change at any time without prior notice, at the Company\'s sole discretion.',
        'We reserve the right to refuse, cancel, or limit any order, at any time and for any reason, including suspected fraud, pricing errors, or suspected abuse of promotions, without liability to you beyond refunding any amount actually charged for the cancelled order.',
        'Product descriptions, data allowances, validity periods, and coverage maps are provided by Carriers and may change without notice. The Company is not liable for discrepancies between marketing descriptions and actual Carrier performance, except where caused by the Company\'s own gross negligence.',
      ],
    },
    {
      id: 'delivery',
      title: '4. Delivery and Activation',
      list: [
        'eSIM QR codes and activation instructions are delivered electronically, typically to the email address provided at checkout.',
        'Once a QR code has been delivered, it is deemed delivered and accepted, regardless of whether the customer has installed or activated it, except where the Company determines in its sole discretion that a technical delivery failure occurred on our end.',
        'The customer is responsible for following installation instructions correctly. Support is offered on a best-effort basis but installation errors caused by the customer are not grounds for a refund (see Refund Policy).',
      ],
    },
    {
      id: 'network',
      title: '5. Network Performance and Service Availability',
      paragraphs: [
        'The Company does not guarantee uninterrupted network coverage, specific data speeds, or availability in every location, as these depend entirely on the Carrier\'s infrastructure and local conditions beyond our control. Any Carrier-side outage, throttling, or coverage gap is not attributable to the Company.',
      ],
    },
    {
      id: 'payments',
      title: '6. Payments',
      list: [
        'Payments are processed via PayPal or other listed payment gateways. By completing checkout, you authorize the applicable charge.',
        'Any payment dispute, chargeback, or PayPal claim filed without first contacting our support team for resolution may result in immediate and permanent suspension of your access to future purchases, at the Company\'s sole discretion. This does not limit your legal rights under applicable consumer protection law.',
        'The Company reserves the right to require additional verification for orders flagged as high-risk before delivering the product.',
      ],
    },
    {
      id: 'ip',
      title: '7. Intellectual Property',
      paragraphs: [
        'All content on the Site — including text, logos, graphics, source code, and design — is the property of the Company or its licensors and may not be copied, reproduced, or used without prior written consent.',
      ],
    },
    {
      id: 'liability',
      title: '8. Limitation of Liability',
      paragraphs: ['To the maximum extent permitted by applicable law:'],
      list: [
        'The Company\'s total liability arising out of or relating to any order shall not exceed the amount actually paid by the customer for that specific order.',
        'The Company is not liable for indirect, incidental, consequential, or special damages, including but not limited to loss of connectivity during travel, missed communications, or business losses, even if advised of the possibility of such damages.',
        'Nothing in these Terms limits liability that cannot be excluded under mandatory Vietnamese consumer protection law.',
      ],
    },
    {
      id: 'termination',
      title: '9. Account Suspension and Termination',
      paragraphs: [
        'The Company may suspend or terminate a customer\'s access to the Site or refuse future service at its sole discretion, including in cases of suspected fraud, abuse, chargeback misuse, or violation of these Terms.',
      ],
    },
    {
      id: 'changes',
      title: '10. Changes to These Terms',
      paragraphs: [
        'The Company reserves the right to modify these Terms at any time, at its sole discretion. Updated Terms take effect immediately upon posting to the Site. Continued use of the Site after changes constitutes acceptance of the revised Terms.',
      ],
    },
    {
      id: 'governing-law',
      title: '11. Governing Law and Dispute Resolution',
      paragraphs: [
        'These Terms are governed by the laws of Vietnam. Any dispute arising from these Terms or your use of the Site shall be subject to the exclusive jurisdiction of the competent courts of Vietnam, unless mandatory local consumer law in your country of residence provides otherwise.',
      ],
    },
  ],
  contact: {
    company: COMPANY.name,
    email: COMPANY.email,
    whatsapp: COMPANY.whatsapp,
  },
};

export const LEGAL_DOCUMENTS: Record<string, LegalDocument> = {
  privacy: PRIVACY_POLICY,
  terms: TERMS_OF_SERVICE,
  refund: REFUND_POLICY,
};
