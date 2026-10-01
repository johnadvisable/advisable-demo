UPDATE public.insights_translations
SET content = REPLACE(
  content,
  $old$
<h3>Product System</h3>
<p><strong><em>Outcomes owned: What gets built, when, at what quality.</em></strong></p>

<p>What AI handles:</p>

<p>Code generation, testing, documentation, bug triage, technical specifications, architecture review for standard patterns, QA of non-critical paths.</p>

<p>What the human handles:</p>

<p>Architecture decisions for novel problems, product strategy, user research synthesis, prioritization, and the judgment calls on what to build next and why.</p>

<p>What the human handles:<br />Everything that matters. Which market to enter, which product bet to make, which partnership to pursue, how to respond to unexpected competitive moves, and what the company should become.</p>

<h3>Growth System</h3>
<p><strong><em>Outcomes owned: Awareness, acquisition, and conversion.</em></strong></p>

<p>What AI handles: Content production across formats, keyword research, campaign copy, ad creative iteration, email sequences, SEO execution, performance dashboards, competitor monitoring, and first-pass audience analysis.</p>

<p>What the human handles: Channel strategy, messaging architecture, offer design, partnership decisions, and the interpretation of data that doesn't fit the expected pattern.</p>

<p>The constraint: Content volume without strategic coherence is noise. The human who owns this system needs to understand the narrative the company is trying to build in its market, not just how to use the tools.</p>

<h3>Customer System</h3>
<p><strong><em>Outcomes owned: Retention, satisfaction, and expansion revenue.</em></strong></p>

<p>What AI handles: Ticket triage and first-response drafting, onboarding documentation, FAQ and knowledge base maintenance, churn signal detection from usage data, and routine customer communication.</p>

<p>What the human handles: High-stakes customer relationships, escalations, renewal conversations, qualitative feedback synthesis, and the strategic decisions that come from understanding what customers actually need versus what they say they need.</p>

<p>The constraint: AI-handled customer communication at volume can feel impersonal at exactly the moments when customers need to feel heard. The human in this system needs to be skilled at knowing when to step out from behind the AI layer and show up directly.</p>

<h3>Revenue System</h3>
<p><strong><em>Outcomes owned: New business, proposals, and commercial relationships.</em></strong></p>

<p>What AI handles: Prospect research, proposal drafting, competitive positioning materials, CRM hygiene, follow-up sequences, contract drafts for standard engagements, and financial modeling for pricing decisions.</p>

<p>What the human handles: Relationship development, negotiation, the judgment calls on which deals to pursue and which to decline, and the trust-building that turns a prospect into a long-term client.</p>

<p>The constraint: AI can draft a compelling proposal. It cannot build the kind of trust that makes someone sign a significant contract with a company they have just met. The human in this system needs to be commercially strong, not just comfortable with AI tools.</p>

<h3>Strategy System</h3>
<p><strong><em>Outcomes owned: Direction, decisions, and organizational learning.</em></strong></p>

<p>What AI handles: Competitive intelligence gathering, scenario modeling, board and investor materials, meeting preparation, research synthesis, and the documentation of decisions for organizational memory.</p>

<p>What the human handles: Everything that matters. Which market to enter, which product bet to make, which partnership to pursue, how to respond to unexpected competitive moves, and what the company should become.</p>

<p>This is the system AI assists most visibly and contributes to least meaningfully. The leverage here is in freeing the person who owns strategy from execution overhead, not in having AI make strategic decisions.</p>
  $old$,
  $new$
<h3>Product System</h3>
<p><strong><em>Outcomes owned: What gets built, when, at what quality.</em></strong></p>

<p>What AI handles:</p>
<p>Code generation, testing, documentation, bug triage, technical specifications, architecture review for standard patterns, QA of non-critical paths.</p>

<p>What the human handles:</p>
<p>Architecture decisions for novel problems, product strategy, user research synthesis, prioritization, and the judgment calls on what to build next and why.</p>

<p>The constraint:</p>
<p>This person needs to be genuinely senior, capable of making architectural decisions independently and catching AI-generated errors in technical output. The leverage multiplies experience; it does not replace it.</p>

<h3>Growth System</h3>
<p><strong><em>Outcomes owned: Awareness, acquisition, and conversion.</em></strong></p>

<p>What AI handles:</p>
<p>Content production across formats, keyword research, campaign copy, ad creative iteration, email sequences, SEO execution, performance dashboards, competitor monitoring, and first-pass audience analysis.</p>

<p>What the human handles:</p>
<p>Channel strategy, messaging architecture, offer design, partnership decisions, and the interpretation of data that doesn't fit the expected pattern.</p>

<p>The constraint:</p>
<p>Content volume without strategic coherence is noise. The human who owns this system needs to understand the narrative the company is trying to build in its market, not just how to use the tools.</p>

<h3>Customer System</h3>
<p><strong><em>Outcomes owned: Retention, satisfaction, and expansion revenue.</em></strong></p>

<p>What AI handles:</p>
<p>Ticket triage and first-response drafting, onboarding documentation, FAQ and knowledge base maintenance, churn signal detection from usage data, and routine customer communication.</p>

<p>What the human handles:</p>
<p>High-stakes customer relationships, escalations, renewal conversations, qualitative feedback synthesis, and the strategic decisions that come from understanding what customers actually need versus what they say they need.</p>

<p>The constraint:</p>
<p>AI-handled customer communication at volume can feel impersonal at exactly the moments when customers need to feel heard. The human in this system needs to be skilled at knowing when to step out from behind the AI layer and show up directly.</p>

<h3>Revenue System</h3>
<p><strong><em>Outcomes owned: New business, proposals, and commercial relationships.</em></strong></p>

<p>What AI handles:</p>
<p>Prospect research, proposal drafting, competitive positioning materials, CRM hygiene, follow-up sequences, contract drafts for standard engagements, and financial modeling for pricing decisions.</p>

<p>What the human handles:</p>
<p>Relationship development, negotiation, the judgment calls on which deals to pursue and which to decline, and the trust-building that turns a prospect into a long-term client.</p>

<p>The constraint:</p>
<p>AI can draft a compelling proposal. It cannot build the kind of trust that makes someone sign a significant contract with a company they have just met. The human in this system needs to be commercially strong, not just comfortable with AI tools.</p>

<h3>Strategy System</h3>
<p><strong><em>Outcomes owned: Direction, decisions, and organizational learning.</em></strong></p>

<p>What AI handles:</p>
<p>Competitive intelligence gathering, scenario modeling, board and investor materials, meeting preparation, research synthesis, and the documentation of decisions for organizational memory.</p>

<p>What the human handles:</p>
<p>Everything that matters. Which market to enter, which product bet to make, which partnership to pursue, how to respond to unexpected competitive moves, and what the company should become.</p>

<p>This is the system AI assists most visibly and contributes to least meaningfully. The leverage here is in freeing the person who owns strategy from execution overhead, not in having AI make strategic decisions.</p>
  $new$
)
WHERE insights_id = '6162fbfc-d15f-460a-8b2e-f844eaa86004'
  AND language_id = 1;