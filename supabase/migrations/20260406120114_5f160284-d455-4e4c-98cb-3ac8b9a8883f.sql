UPDATE public.insights_translations
SET content = REPLACE(
  content,
  '<p><strong>For a B2B SaaS company with a customer data platform:</strong> Building an MCP server means an enterprise client’s internal AI assistant can query customer segments, pull cohort analyses, and trigger list exports, without a human logging into the dashboard and navigating the UI. The product becomes programmable by AI, which is rapidly becoming a buyer requirement in enterprise sales cycles.</p>',
  '<p><strong>For a content or marketing SaaS:</strong><br />An MCP server means AI writing assistants can pull brand guidelines, past campaign performance data, and audience segment information directly into the content generation workflow, without copy-paste or manual context-setting.</p>'
)
WHERE id = '572c99f3-56bb-4365-ab72-890f4af46149';