import os
import sys

def check_file(filepath):
    try:
        with open(filepath, 'r') as f:
            content = f.read()
            # Basic check for unclosed braces/parens which might indicate copy-paste error
            if content.count('{') != content.count('}'):
                print(f"Warning: Mismatched braces in {filepath}")
            if content.count('(') != content.count(')'):
                print(f"Warning: Mismatched parentheses in {filepath}")
    except Exception as e:
        print(f"Error reading {filepath}: {e}")

files = [
    "src/components/site-owners/builder/hero/hero-style-1.tsx",
    "src/components/site-owners/builder/hero/hero-style-2.tsx",
    "src/components/site-owners/builder/hero/hero-style-3.tsx",
    "src/components/site-owners/builder/hero/hero-style-4.tsx",
    "src/components/site-owners/builder/hero/hero-style-5.tsx",
    "src/components/site-owners/builder/hero/hero-style-6.tsx",
    "src/components/site-owners/builder/hero/hero-style-7.tsx",
    "src/components/site-owners/builder/hero/hero-style-8.tsx",
    "src/components/site-owners/builder/hero/hero-style-9.tsx",
    "src/components/site-owners/builder/hero/hero-style-10.tsx",
    "src/components/site-owners/builder/hero/hero-style-11.tsx",
    "src/components/site-owners/builder/hero/hero-style-12.tsx",
    "src/components/site-owners/builder/hero/hero-style-13.tsx",
    "src/components/site-owners/builder/hero/hero-style-14.tsx",
    "src/components/site-owners/builder/hero/hero-style-15.tsx",
    "src/components/site-owners/builder/services/services-style/services-style-1.tsx",
    "src/components/site-owners/builder/services/services-style/services-style-2.tsx",
    "src/components/site-owners/builder/services/services-style/services-style-3.tsx",
    "src/components/site-owners/builder/services/services-style/services-style-4.tsx",
    "src/components/site-owners/builder/services/services-style/services-style-5.tsx",
    "src/components/site-owners/builder/services/services-style/services-style-6.tsx",
    "src/components/site-owners/builder/services/services-card/services-card1.tsx",
    "src/components/site-owners/builder/services/services-card/services-card2.tsx",
    "src/components/site-owners/builder/services/services-card/services-card3.tsx",
    "src/components/site-owners/builder/services/services-card/services-card4.tsx",
    "src/components/site-owners/builder/services/services-card/services-card5.tsx",
    "src/components/site-owners/builder/services/services-card/services-card6.tsx",
    "src/components/site-owners/builder/testimonials/testimonial-style/testimonial-style-1.tsx",
    "src/components/site-owners/builder/testimonials/testimonial-style/testimonial-style-2.tsx",
    "src/components/site-owners/builder/testimonials/testimonial-style/testimonial-style-3.tsx",
    "src/components/site-owners/builder/testimonials/testimonial-style/testimonial-style-4.tsx",
    "src/components/site-owners/builder/testimonials/testimonial-style/testimonial-style-5.tsx",
    "src/components/site-owners/builder/testimonials/testimonial-style/testimonial-style-6.tsx",
    "src/components/site-owners/builder/testimonials/testimonial-style/testimonial-style-7.tsx",
    "src/components/site-owners/builder/testimonials/testimonial-style/testimonial-style-8.tsx",
    "src/components/site-owners/builder/testimonials/testimonial-style/testimonial-style-9.tsx",
    "src/components/site-owners/builder/testimonials/testimonial-style/testimonial-style-10.tsx",
    "src/components/site-owners/builder/testimonials/testimonial-style/testimonial-style-11.tsx",
    "src/components/site-owners/builder/testimonials/testimonial-card/testimonial-card-11.tsx",
    "src/components/site-owners/builder/cta/cta-style-1.tsx",
    "src/components/site-owners/builder/cta/cta-style-2.tsx",
    "src/components/site-owners/builder/cta/cta-style-3.tsx",
    "src/components/site-owners/builder/footer/footer-style1.tsx",
    "src/components/site-owners/builder/footer/footer-style2.tsx",
    "src/components/site-owners/builder/footer/footer-style3.tsx",
    "src/components/site-owners/builder/footer/footer-style4.tsx",
    "src/components/site-owners/builder/footer/footer-style5.tsx",
    "src/components/site-owners/builder/footer/footer-style6.tsx",
    "src/components/site-owners/builder/footer/footer-style7.tsx",
    "src/components/site-owners/builder/footer/footer-style8.tsx",
    "src/components/site-owners/builder/footer/footer-style9.tsx",
    "src/components/site-owners/builder/gallery/gallery-template-1.tsx",
    "src/components/site-owners/builder/gallery/gallery-template-2.tsx",
    "src/components/site-owners/builder/gallery/gallery-template-3.tsx",
    "src/components/site-owners/builder/gallery/gallery-template-4.tsx",
    "src/components/site-owners/builder/gallery/gallery-template-5.tsx",
    "src/components/site-owners/builder/gallery/gallery-template-6.tsx",
    "src/components/site-owners/builder/gallery/gallery-template-7.tsx",
    "src/components/site-owners/builder/about/about-style-1.tsx",
    "src/components/site-owners/builder/about/about-style-2.tsx",
    "src/components/site-owners/builder/about/about-style-3.tsx",
    "src/components/site-owners/builder/about/about-style-4.tsx",
    "src/components/site-owners/builder/about/about-style-5.tsx",
    "src/components/site-owners/builder/about/about-style-6.tsx",
    "src/components/site-owners/builder/about/about-style-7.tsx"
]

for f in files:
    check_file(f)
