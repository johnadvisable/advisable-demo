-- Update the long text in insights_translations to the short version
UPDATE insights_translations
SET content = REPLACE(
    content,
    '<li><strong>Synthetic media that depicts real people or real events - mandatory label.</strong> AI-generated video, audio, or images that depict real identifiable people saying or doing things they did not say or do (deepfakes), or content that presents fictional scenarios as factual news, must carry a clear, visible label. Very narrow exceptions apply only where the use is explicitly authorised by law for law enforcement purposes (detecting, preventing, or investigating crime), and where content is obviously artistic, creative, satirical, or fictional, in those cases only a minimal, non-intrusive disclosure is required. For all standard commercial and editorial contexts, the label is mandatory. This is the strictest part of Article 50 and it is fully in force now.</li>',
    '<li><strong>AI-generated social media images for brand campaigns</strong><br />Not required for standard commercial use, but good practice and increasingly expected by informed audiences.</li>'
)
WHERE id = '256daf7c-96aa-421f-85fe-7cf3fe0aa43f';