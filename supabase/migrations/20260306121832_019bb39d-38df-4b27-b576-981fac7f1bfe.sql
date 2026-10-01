UPDATE insights_translations
SET content = REPLACE(
  REPLACE(
    REPLACE(
      REPLACE(
        REPLACE(
          REPLACE(
            REPLACE(
              REPLACE(
                REPLACE(
                  REPLACE(
                    REPLACE(
                      REPLACE(
                        REPLACE(
                          REPLACE(
                            REPLACE(
                              REPLACE(
                                REPLACE(content,
                                  'search is literal , it finds', 'search is literal; it finds'),
                                'Post-purchase pages , the thank-you screen and order confirmation , were among', 'Post-purchase pages, the thank-you screen and order confirmation, were among'),
                              'triggered emails , abandonment recovery, welcome series, and post-purchase sequences , drive over', 'triggered emails, abandonment recovery, welcome series, and post-purchase sequences, drive over'),
                            'loyalty dynamic , adjusting tiers', 'loyalty dynamic, adjusting tiers'),
                          'that closed it , by building personalisation', 'that closed it, by building personalisation'),
                        'technical infrastructure , captured disproportionate', 'technical infrastructure, captured disproportionate'),
                      'product availability , less capital', 'product availability, less capital'),
                    'discount codes , without human', 'discount codes, without human'),
                  'versus people , it is intelligent', 'versus people, it is intelligent'),
                'e-commerce platform , Shopify, BigCommerce', 'e-commerce platform, Shopify, BigCommerce'),
              'Adobe Commerce , is the foundation', 'Adobe Commerce, is the foundation'),
            'content creation , these deliver', 'content creation, these deliver'),
          'accurate predictions , it produces', 'accurate predictions, it produces'),
        'implementation experience , not just tool access , makes', 'implementation experience, not just tool access, makes'),
      'without transparency , without making', 'without transparency, without making'),
    'rather than on them , carries', 'rather than on them, carries'),
  'is not shrinking , it is widening', 'is not shrinking, it is widening')
WHERE insights_id = (SELECT id FROM insights WHERE slug = 'ai-powered-growth-stack-ecommerce-2026')
  AND language_id = 1;