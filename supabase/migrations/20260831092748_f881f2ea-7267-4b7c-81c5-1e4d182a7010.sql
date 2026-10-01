DO $$
DECLARE v_id uuid;
BEGIN
  INSERT INTO public.insights (slug, featured_image, author, published_date, type, category)
  VALUES ('ai-wrapper-no-moat-shutdown-wave',
    'https://difvvdmelbtjxxvpjuvw.supabase.co/storage/v1/object/public/blog-images/insights/ai-wrapper-no-moat-shutdown-wave.jpg',
    'Advisable Team', now(), 'article', 'startups-venture-studio')
  RETURNING id INTO v_id;

  INSERT INTO public.insights_translations (insights_id, language_id, title, excerpt, content)
  VALUES (v_id, 1,
    'The "AI Wrapper With No Moat" Shutdown Wave',
    'Thin AI applications are under real pressure, but API dependence is not a death sentence. What separates the products that survive a model swap from the ones that do not.',
    '<p><strong>TL;DR:</strong> The evidence supports a correction in thin AI applications, but not a universal rule that every API-dependent company is doomed. Model access is getting cheaper and model providers increasingly ship features that once required a separate product. That puts pressure on products whose main value is a prompt and an interface. The applications most likely to endure own something harder to reproduce: proprietary and compounding data, a deeply embedded workflow, trusted distribution, or customer relationships that survive a model swap. The practical response is simple: validate paid demand early, model the full cost to serve, build toward a real moat, and know whether the company is default-alive before the runway disappears.</p>

<h2>A correction in the application layer</h2>

<p>For the past several years, one of the fastest ways to launch an AI product was to place a useful interface and a strong system prompt on top of someone else''s foundation model. That made experimentation cheap, but it also made imitation cheap. The question now is not whether a product uses an external model; most valuable products will. The question is what remains valuable if the model improves, the price falls, or the provider ships a similar feature itself.</p>

<p>SimpleClosure''s 2025 shutdown report describes the market as moving from novelty to selection. It says AI represented 15.9% of reported closures and argues that application-layer tools built on commoditized models, without proprietary data or deep workflow integration, faced the sharpest correction. That is useful directional evidence, but it is not a complete census of AI startups and it comes from a company whose business is helping venture-backed startups wind down. The responsible conclusion is "pressure is increasing," not "a measured 2026 wave has already killed a fixed percentage of wrappers."</p>

<p>The underlying mechanism is straightforward: the easiest layer to build is often the easiest layer to replace. As model capabilities spread and prices fall, a product must earn its place through the customer''s process, information, and trust, not merely through access to a model.</p>

<h2>Why thin wrappers are exposed</h2>

<p>Stanford HAI reports that the cost of querying a model with GPT-3.5-equivalent performance on MMLU fell from about $20.00 per million tokens in November 2022 to $0.07 by October 2024, a reduction of more than 280-fold. The same report says that, depending on the task, inference prices fell between 9 and 900 times per year. The arithmetic is real; the business implication is more conditional.</p>

<p>Lower model prices can improve a healthy application''s margins. They do not create a moat when every competitor receives the same improvement. If the product''s only advantage is the spread between API cost and subscription price, falling costs can invite competition, encourage customers to go direct, and make the application look like a temporary distribution layer for the model provider.</p>

<p>There is a second risk: feature absorption, sometimes called "Sherlocking." A provider can incorporate a popular workflow into its own product, bundle it into an existing subscription, or expose it through a better interface. This does not automatically destroy the application. It does mean the application must offer something the provider does not automatically inherit: customer-specific context, operational integration, data rights, service, compliance, or a channel the provider does not control.</p>

<h2>Jasper: a cautionary example, not a universal template</h2>

<p>Jasper is a useful case because it achieved real scale before the competitive threat became obvious. It raised $125 million at a $1.5 billion valuation in October 2022, shortly before ChatGPT launched. Contemporary reporting later described a 20% internal valuation reduction to approximately $1.2 billion and a cut to the company''s 2023 revenue forecast. Later secondary analyses estimate a decline from roughly $120 million at its peak to around $55 million, but that figure should be treated as an estimate rather than audited public revenue, and the causal link to direct ChatGPT migration should not be stated as proven.</p>

<p>The lesson is not that Jasper had no customers or that its team was incompetent. The lesson is that momentum can hide strategic exposure. A product can keep growing after its original differentiation has been copied. That lag is dangerous: revenue history describes where the business has been, while defensibility determines whether the next dollar will be harder or easier to earn.</p>

<h2>What can defend an AI application now</h2>

<p>The following four categories are more useful than the vague instruction to "build a moat." The strongest businesses usually combine at least two.</p>

<ol>
<li><p><strong>Compounding proprietary data.</strong> The important asset is not simply a large dataset. It is a usage loop in which the product collects permissioned, relevant data and uses it to become measurably better for the next customer. Data that does not improve outcomes, or that the customer can export and recreate elsewhere, is a weak moat.</p></li>
<li><p><strong>Deep workflow integration and switching costs.</strong> A product becomes harder to replace when it sits inside a repeated, high-value process with approvals, exceptions, structured states, audit trails, and multiple users. Integration into the official record of work is usually more durable than a flashy feature.</p></li>
<li><p><strong>Owned distribution and customer trust.</strong> A focused channel, vertical reputation, regulatory credibility, or trusted relationship can matter as much as the software. Distribution is strongest when it is difficult for a general-purpose model provider to reach the same buyers with the same context.</p></li>
<li><p><strong>Network effects and accumulated brand.</strong> Networks, communities, benchmarks, and trusted brands can compound over time. They are real advantages only when participation or reputation improves the product or lowers acquisition cost; simply being recognizable is not enough.</p></li>
</ol>

<p>Two quick tests help expose weak differentiation. First, the substitution test: can a technically capable user reproduce most of the output by pasting the core prompt into ChatGPT or Claude? Second, the model-revocation test: if the current provider disappeared tomorrow, would the product still own customer value through its data, workflow, distribution, or service? These are heuristics, not scientific benchmarks, and the source proposing them is an MVP-development firm with a commercial interest in the topic.</p>

<h2>A founder playbook for the next build</h2>

<h3>Validate demand before building</h3>

<p>Committed money is stronger evidence than stated interest. For B2B, a paid pilot is stronger than a survey response; a signed letter of intent is useful, but it is not the same as revenue. Ask whether the pain is frequent, expensive, urgent, and owned by someone with authority to buy. If the answer is unclear, more prompting is unlikely to solve the problem.</p>

<h3>Prove full unit economics at small scale</h3>

<p>Estimate tokens per call &times; price per token &times; calls per active user, but do not stop there. Include embeddings, retrieval, tool calls, retries, latency-related infrastructure, human review, support, payment fees, sales, and customer acquisition. Then compare the result with realized revenue and gross margin. The point is to learn whether a usable product can be delivered profitably after a small amount of testing, not to produce a beautiful model after launch.</p>

<h3>Build toward one defensible advantage</h3>

<p>Choose the moat closest to what the company can genuinely accumulate. If the advantage is workflow, become the system of record. If it is data, design a permissioned feedback loop that improves outcomes. If it is distribution, own a narrow channel and deepen trust. Prompt quality matters, but it is an input that model progress tends to compress; customer-specific integration and learning loops are harder to copy.</p>

<h3>Stay default-alive</h3>

<p>Paul Graham''s "default alive" test asks whether the company can reach profitability before its cash runs out if revenue continues growing at its current rate and expenses follow their current path. It is a trajectory test, not a snapshot. Two companies with the same runway can have opposite answers. In a market where model economics and competitive features can change quickly, knowing the trajectory is part of product strategy, not merely finance.</p>

<h2>What this argument does not mean</h2>

<p>External-model dependence is not itself a failure condition. Many durable software companies rely on cloud platforms, payment networks, or operating systems. The danger is dependence without compensating ownership. An application can be defensible while using an API if it owns the customer relationship, embeds in a mission-critical process, controls valuable permissioned data, or can switch providers without losing its identity. Conversely, an application can be fragile even with proprietary technology if customers can leave easily and the company has no distribution or economic advantage.</p>

<h2>How to read the headline numbers</h2>

<p>Claims such as "80&ndash;90% of AI wrappers will be dead," "OpenAI cannibalized 200+ funded startups," or "60&ndash;70% of wrappers generate zero revenue" should not be quoted as measured facts without a traceable dataset and clear definitions. They may capture sentiment, but they blur the denominator: what counts as a wrapper, a startup, a failure, or revenue? The more defensible evidence in this article is the Stanford inference-cost series, the SimpleClosure report''s own closure data, and the contemporary Jasper reporting. Even those sources support a narrower conclusion than the headline: the application layer is becoming more competitive, and differentiation must increasingly come from assets beyond the model call.</p>

<h2>Resources</h2>

<ol>
<li><a href="https://www.businesswire.com/news/home/20251223595831/en/The-2025-Startup-Shutdown-More-Capital-Later-Stages-and-the-First-AI-Reckoning" target="_blank" rel="noopener noreferrer">The 2025 Startup Shutdown &mdash; SimpleClosure (via Business Wire)</a></li>
<li><a href="https://hai.stanford.edu/ai-index/2025-ai-index-report/research-and-development" target="_blank" rel="noopener noreferrer">The 2025 AI Index Report: R&amp;D &mdash; Stanford HAI</a></li>
<li><a href="https://hai.stanford.edu/ai-index/2025-ai-index-report" target="_blank" rel="noopener noreferrer">The 2025 AI Index Report &mdash; Stanford HAI</a></li>
<li><a href="https://aibeat.co/jasper-valuation-drops/" target="_blank" rel="noopener noreferrer">Jasper drops valuation to $1.2B and cuts its 2023 forecast &mdash; AIbeat</a></li>
<li><a href="https://www.shuttergen.com/research/jasper-ai-teardown" target="_blank" rel="noopener noreferrer">Jasper AI teardown &mdash; Shuttergen (secondary analysis)</a></li>
<li><a href="https://vectig.com/guides/default-alive" target="_blank" rel="noopener noreferrer">Default Alive &mdash; Paul Graham''s test, applied &mdash; Vectig</a></li>
<li><a href="https://valueaddvc.com/blog/how-to-build-a-startup-in-a-market-where-ai-will-eventually-do-what-you-do" target="_blank" rel="noopener noreferrer">Why 80% of Wrappers Die and 5 Moats That Survive &mdash; Value Add VC</a></li>
<li><a href="https://www.buildmvpfast.com/blog/ai-wrapper-startup-defensible-business-2026" target="_blank" rel="noopener noreferrer">AI Wrapper Startup? Build a Defensible Business in 2026 &mdash; BuildMVPfast</a></li>
</ol>');
END $$;