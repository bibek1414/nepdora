export interface PolicyData {
  template: "return-exchange" | "shipping" | "privacy" | "terms";
  title: string;
  lastUpdated: string;
  content: string;
  sections?: {
    id: string;
    title: string;
    content: string;
  }[];
}

export interface PolicyComponentData {
  id: string | number;
  component_id: string;
  component_type: "policies";
  data: PolicyData;
  order: number;
  page?: number;
}

// Default Return & Exchange Policy
export const defaultReturnExchangeData: PolicyData = {
  template: "return-exchange",
  title: "Return & Exchange Policy",
  lastUpdated: new Date().toISOString().split("T")[0],
  content: `
    <h2>Our Return & Exchange Policy</h2>
    <p>We want you to be completely satisfied with your purchase. If you're not happy with your order, we're here to help.</p>
    
    <h3>Return Window</h3>
    <p>You have <strong>30 days</strong> from the date of delivery to return your item for a full refund or exchange.</p>
    
    <h3>Eligibility</h3>
    <p>To be eligible for a return or exchange, your item must be:</p>
    <ul>
      <li>Unused and in the same condition that you received it</li>
      <li>In the original packaging</li>
      <li>Accompanied by the receipt or proof of purchase</li>
    </ul>
    
    <h3>Non-Returnable Items</h3>
    <p>Certain types of items cannot be returned:</p>
    <ul>
      <li>Perishable goods (food, flowers, plants)</li>
      <li>Custom or personalized items</li>
      <li>Personal care items (for health and hygiene reasons)</li>
      <li>Sale items or gift cards</li>
    </ul>
    
    <h3>How to Initiate a Return</h3>
    <ol>
      <li>Contact our customer service team at <a href="mailto:support@example.com">support@example.com</a></li>
      <li>Provide your order number and reason for return</li>
      <li>We'll send you return shipping instructions</li>
      <li>Pack the item securely in its original packaging</li>
      <li>Ship the item back using the provided label</li>
    </ol>
    
    <h3>Refunds</h3>
    <p>Once we receive your return, we'll inspect the item and notify you of the approval or rejection of your refund.</p>
    <p>If approved, your refund will be processed within <strong>7-10 business days</strong> to your original payment method.</p>
    
    <h3>Exchanges</h3>
    <p>If you need to exchange an item for a different size or color, please contact us at <a href="mailto:support@example.com">support@example.com</a>.</p>
    
    <h3>Shipping Costs</h3>
    <p>You will be responsible for paying your own shipping costs for returning your item. Shipping costs are non-refundable.</p>
    
    <h3>Contact Us</h3>
    <p>If you have any questions about our return policy, please contact us:</p>
    <ul>
      <li>Email: <a href="mailto:support@example.com">support@example.com</a></li>
      <li>Phone: +1 (234) 567-890</li>
    </ul>
  `,
};

// Default Shipping Policy
export const defaultShippingData: PolicyData = {
  template: "shipping",
  title: "Shipping Policy",
  lastUpdated: new Date().toISOString().split("T")[0],
  content: `
    <h2>Shipping Information</h2>
    <p>We process and ship orders Monday through Friday (excluding holidays). Orders placed after 2 PM EST will be processed the next business day.</p>
    
    <h3>Shipping Methods & Costs</h3>
    <table>
      <thead>
        <tr>
          <th>Method</th>
          <th>Delivery Time</th>
          <th>Cost</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Standard Shipping</td>
          <td>5-7 business days</td>
          <td>$5.99</td>
        </tr>
        <tr>
          <td>Express Shipping</td>
          <td>2-3 business days</td>
          <td>$12.99</td>
        </tr>
        <tr>
          <td>Overnight Shipping</td>
          <td>1 business day</td>
          <td>$24.99</td>
        </tr>
      </tbody>
    </table>
    
    <h3>Free Shipping</h3>
    <p>We offer <strong>FREE standard shipping</strong> on all orders over $50 within the continental United States.</p>
    
    <h3>International Shipping</h3>
    <p>We currently ship to the following countries:</p>
    <ul>
      <li>Canada</li>
      <li>United Kingdom</li>
      <li>Australia</li>
      <li>European Union countries</li>
    </ul>
    <p>International shipping rates and delivery times vary by destination. Customs duties and taxes may apply and are the responsibility of the customer.</p>
    
    <h3>Order Tracking</h3>
    <p>Once your order ships, you'll receive a confirmation email with tracking information. You can track your package at any time through our website or the carrier's website.</p>
    
    <h3>Delivery Issues</h3>
    <p>If your package is lost or damaged during shipping, please contact us immediately at <a href="mailto:support@example.com">support@example.com</a>. We'll work with the carrier to resolve the issue.</p>
    
    <h3>Address Changes</h3>
    <p>If you need to change your shipping address, please contact us as soon as possible. We cannot guarantee address changes once an order has been processed.</p>
    
    <h3>PO Boxes & Military Addresses</h3>
    <p>We ship to PO boxes and military addresses (APO/FPO/DPO) using USPS. Please allow additional time for delivery to these addresses.</p>
    
    <h3>Contact Us</h3>
    <p>For shipping questions, please contact us:</p>
    <ul>
      <li>Email: <a href="mailto:shipping@example.com">shipping@example.com</a></li>
      <li>Phone: +1 (234) 567-890</li>
    </ul>
  `,
};

// Default Privacy Policy
export const defaultPrivacyData: PolicyData = {
  template: "privacy",
  title: "Privacy Policy",
  lastUpdated: new Date().toISOString().split("T")[0],
  content: `
    <h2>Privacy Policy</h2>
    <p><em>Last updated: ${new Date().toLocaleDateString()}</em></p>
    
    <h3>Information We Collect</h3>
    <p>We collect information that you provide directly to us, including:</p>
    <ul>
      <li><strong>Personal Information:</strong> Name, email address, phone number, shipping address, billing address</li>
      <li><strong>Payment Information:</strong> Credit card details (processed securely through our payment processor)</li>
      <li><strong>Account Information:</strong> Username, password, purchase history</li>
      <li><strong>Communications:</strong> Messages, reviews, customer service inquiries</li>
    </ul>
    
    <h3>How We Use Your Information</h3>
    <p>We use the information we collect to:</p>
    <ul>
      <li>Process and fulfill your orders</li>
      <li>Communicate with you about your orders and account</li>
      <li>Send marketing communications (with your consent)</li>
      <li>Improve our products and services</li>
      <li>Prevent fraud and enhance security</li>
      <li>Comply with legal obligations</li>
    </ul>
    
    <h3>Information Sharing</h3>
    <p>We do not sell or rent your personal information to third parties. We may share your information with:</p>
    <ul>
      <li><strong>Service Providers:</strong> Payment processors, shipping companies, email service providers</li>
      <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
      <li><strong>Business Transfers:</strong> In connection with a merger, sale, or acquisition</li>
    </ul>
    
    <h3>Cookies and Tracking</h3>
    <p>We use cookies and similar tracking technologies to:</p>
    <ul>
      <li>Remember your preferences and settings</li>
      <li>Understand how you use our website</li>
      <li>Improve your experience</li>
      <li>Deliver personalized content and advertising</li>
    </ul>
    <p>You can control cookies through your browser settings.</p>
    
    <h3>Data Security</h3>
    <p>We implement appropriate technical and organizational measures to protect your personal information. However, no method of transmission over the internet is 100% secure.</p>
    
    <h3>Your Rights</h3>
    <p>You have the right to:</p>
    <ul>
      <li>Access your personal information</li>
      <li>Correct inaccurate information</li>
      <li>Request deletion of your information</li>
      <li>Opt-out of marketing communications</li>
      <li>Object to processing of your information</li>
    </ul>
    
    <h3>Children's Privacy</h3>
    <p>Our website is not intended for children under 13. We do not knowingly collect personal information from children.</p>
    
    <h3>Changes to This Policy</h3>
    <p>We may update this privacy policy from time to time. We'll notify you of significant changes by email or through our website.</p>
    
    <h3>Contact Us</h3>
    <p>If you have questions about this privacy policy, please contact us:</p>
    <ul>
      <li>Email: <a href="mailto:privacy@example.com">privacy@example.com</a></li>
      <li>Phone: +1 (234) 567-890</li>
      <li>Address: 123 Main Street, City, State 12345</li>
    </ul>
  `,
};

// Default Terms & Conditions
export const defaultTermsData: PolicyData = {
  template: "terms",
  title: "Terms & Conditions",
  lastUpdated: new Date().toISOString().split("T")[0],
  content: `
    <h2>Terms & Conditions</h2>
    <p><em>Last updated: ${new Date().toLocaleDateString()}</em></p>
    
    <h3>1. Acceptance of Terms</h3>
    <p>By accessing and using this website, you accept and agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our website.</p>
    
    <h3>2. Use of Website</h3>
    <p>You agree to use this website only for lawful purposes and in a way that does not infringe upon the rights of others or restrict their use of the website.</p>
    
    <h3>3. Intellectual Property</h3>
    <p>All content on this website, including text, graphics, logos, images, and software, is the property of our company or our content suppliers and is protected by copyright and intellectual property laws.</p>
    
    <h3>4. Product Information</h3>
    <p>We strive to provide accurate product information. However, we do not warrant that:</p>
    <ul>
      <li>Product descriptions are accurate, complete, or error-free</li>
      <li>Colors displayed on your screen accurately reflect actual product colors</li>
      <li>Products will be available at all times</li>
    </ul>
    
    <h3>5. Pricing and Availability</h3>
    <p>All prices are subject to change without notice. We reserve the right to:</p>
    <ul>
      <li>Modify or discontinue products without notice</li>
      <li>Refuse or cancel orders for any reason</li>
      <li>Limit quantities purchased per person or order</li>
    </ul>
    
    <h3>6. Orders and Payment</h3>
    <p>By placing an order, you agree to provide current, complete, and accurate purchase information. You agree to promptly update your account information, including email address and payment details.</p>
    
    <h3>7. Shipping and Delivery</h3>
    <p>Shipping and delivery terms are outlined in our Shipping Policy. Risk of loss and title for products pass to you upon delivery to the carrier.</p>
    
    <h3>8. Returns and Refunds</h3>
    <p>Our return and refund policy is outlined in our Return & Exchange Policy. Please review this policy before making a purchase.</p>
    
    <h3>9. User Accounts</h3>
    <p>If you create an account on our website, you are responsible for:</p>
    <ul>
      <li>Maintaining the confidentiality of your account credentials</li>
      <li>All activities that occur under your account</li>
      <li>Notifying us immediately of any unauthorized access</li>
    </ul>
    
    <h3>10. Limitation of Liability</h3>
    <p>To the fullest extent permitted by law, we shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the website or products.</p>
    
    <h3>11. Indemnification</h3>
    <p>You agree to indemnify and hold harmless our company from any claims, damages, losses, or expenses arising from your use of the website or violation of these terms.</p>
    
    <h3>12. Governing Law</h3>
    <p>These terms shall be governed by and construed in accordance with the laws of [Your Jurisdiction], without regard to its conflict of law provisions.</p>
    
    <h3>13. Dispute Resolution</h3>
    <p>Any disputes arising from these terms or your use of the website shall be resolved through binding arbitration in accordance with the rules of [Arbitration Association].</p>
    
    <h3>14. Changes to Terms</h3>
    <p>We reserve the right to modify these terms at any time. Continued use of the website after changes constitutes acceptance of the modified terms.</p>
    
    <h3>15. Severability</h3>
    <p>If any provision of these terms is found to be unenforceable, the remaining provisions shall continue in full force and effect.</p>
    
    <h3>16. Contact Information</h3>
    <p>For questions about these terms, please contact us:</p>
    <ul>
      <li>Email: <a href="mailto:legal@example.com">legal@example.com</a></li>
      <li>Phone: +1 (234) 567-890</li>
      <li>Address: 123 Main Street, City, State 12345</li>
    </ul>
  `,
};
