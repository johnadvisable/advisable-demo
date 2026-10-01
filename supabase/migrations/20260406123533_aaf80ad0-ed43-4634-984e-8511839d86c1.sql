UPDATE public.insights_translations
SET content = REPLACE(
  content,
  '<p>The analogy that has stuck, used by both BCG and widely across the developer community, is USB-C for AI. Before USB-C, every device needed its own cable. After USB-C, one standard port works everywhere. MCP does the same thing for AI integrations.</p>',
  '<p><em>The analogy that has stuck, used by both BCG and widely across the developer community, is USB-C for AI. Before USB-C, every device needed its own cable. After USB-C, one standard port works everywhere. MCP does the same thing for AI integrations.</em></p>'
)
WHERE id = '572c99f3-56bb-4365-ab72-890f4af46149';