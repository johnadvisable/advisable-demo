UPDATE public.insights_translations
SET content = REPLACE(
  content,
  E'\n\n<p><strong>For a content or marketing SaaS:</strong> An MCP server means AI writing assistants can pull brand guidelines, past campaign performance data, and audience segment information directly into the content generation workflow, without copy-paste or manual context-setting.</p>',
  ''
)
WHERE id = '572c99f3-56bb-4365-ab72-890f4af46149';