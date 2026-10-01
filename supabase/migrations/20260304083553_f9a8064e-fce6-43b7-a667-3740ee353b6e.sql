
-- Insert the insight
INSERT INTO public.insights (slug, author, published_date, featured_image, type)
VALUES (
  'from-vibe-coding-to-agentic-engineering',
  'Advisable',
  '2026-03-04',
  '/images/insights/vibe-coding-to-agentic-engineering.jpg',
  'article'
);

-- Insert English translation
INSERT INTO public.insights_translations (insights_id, language_id, title, excerpt, content)
SELECT 
  i.id,
  1,
  'From Vibe Coding to Agentic Engineering: Why How You Build Software Still Cannot Replace Why You Build It',
  'Karpathy declared vibe coding dead in February 2026. What replaced it is more powerful, more professional, and still not a product strategy. The cost of building has collapsed — but 90% of startups still fail because they build something nobody wants.',
  '<p><strong>TL;DR</strong> In February 2025, Andrej Karpathy coined "vibe coding", casual, prompt-driven software development that he explicitly described as suited for "throwaway weekend projects." Exactly one year later, in February 2026, he declared it passé and proposed a new term: <strong>agentic engineering</strong>. The practice has matured from reckless prototyping into structured, agent-orchestrated development with human oversight. What has not changed, and what this article is about, is the thing neither approach addresses: whether you are building the right product, for the right users, solving the right problem. That question cannot be automated. And in 2026, as the cost of building approaches zero, it has never mattered more.</p>

<h2>A Term That Lasted Exactly One Year</h2>

<p>On February 2, 2025, Andrej Karpathy, co-founder of OpenAI, former Director of AI at Tesla, one of the most credible technical voices in the world, posted on X what he later described as a "shower thoughts throwaway tweet." He called it vibe coding.</p>

<p>"There''s a new kind of coding I call ''vibe coding'', where you fully give in to the vibes, embrace exponentials, and forget that the code even exists," he wrote. "I just see stuff, say stuff, run stuff, and copy paste stuff, and it mostly works. It''s not too bad for throwaway weekend projects, but still quite amusing."</p>

<p>That last qualifier, <em>throwaway weekend projects</em>, was buried in the original post. It did not make it into the thousands of think pieces, startup pitches, investor memos, and boardroom conversations that followed. What spread was the headline promise: that anyone could now build software without knowing how to code. That the barrier between idea and product had effectively collapsed.</p>

<p>Collins Dictionary named vibe coding its Word of the Year for 2025. Merriam-Webster listed it as a trending expression. A book was written about it. Venture capital flowed toward companies built on the premise. Founders told investors their codebases were 95% AI-generated as a selling point rather than a warning.</p>

<p>Then, on February 4, 2026, almost to the day, one year later, Karpathy returned to X. "Today, one year later, programming via LLM agents is increasingly becoming a default workflow for professionals, except with more oversight and scrutiny," he wrote. He proposed retiring the term he had made famous and replacing it with something more accurate: <strong>agentic engineering</strong>.</p>

<p>The inventor of vibe coding had moved on. The question for everyone else is whether they have too, and more importantly, whether they ever understood what the real constraint on building great software was in the first place.</p>

<h2>What Vibe Coding Actually Was and What It Actually Wasn''t</h2>

<p>Before examining what replaced it, it is worth being precise about what vibe coding actually meant, because the term was almost immediately stretched beyond its original definition.</p>

<p>Vibe coding, properly defined, meant accepting AI-generated code without reviewing it. Simon Willison, creator of Django, one of the most respected independent voices in software engineering, drew the clearest line: "If an LLM wrote every line of your code, but you''ve reviewed, tested, and understood it all, that''s not vibe coding in my book, that''s using an LLM as a typing assistant." The defining characteristic was not AI assistance. It was the deliberate surrender of oversight.</p>

<p>A December 2025 analysis by CodeRabbit of 470 open-source GitHub pull requests found that AI co-authored code contained approximately 1.7 times more major issues compared to human-written code. Security vulnerabilities were 2.74 times higher. In May 2025, 170 out of 1,645 web applications built on Lovable, a popular vibe coding platform, were found to have security flaws allowing personal information to be accessed by anyone.</p>

<p>In July 2025, METR, an independent AI evaluation organisation, ran a randomised controlled trial on developer productivity with AI coding tools. The result was counterintuitive: experienced open-source developers were <strong>19% slower</strong> when using AI coding tools, despite predicting they would be 24% faster, and still believing afterward they had been faster. The subjective experience of speed and the objective measurement of output were moving in opposite directions.</p>

<p>Even Karpathy himself quietly signalled the limits. When building his Nanochat project, a minimal LLM interface he built for his own use, he tried using Claude and Codex agents and found them "net unhelpful." He built it by hand instead. The godfather of vibe coding did not trust it for work that actually mattered to him.</p>

<p>By September 2025, Fast Company was reporting that the "vibe coding hangover" had arrived, with senior software engineers describing "development hell" when working with AI-generated codebases they had inherited or built themselves. The code that had been so fast to generate was proving expensive and slow to maintain, debug, and extend.</p>

<h2>What Agentic Engineering Actually Is</h2>

<p>The shift Karpathy identified in February 2026 is not cosmetic. It reflects a genuine change in both what AI models can do and how professional developers are actually working with them.</p>

<p><strong>Vibe coding was human-as-passenger. Agentic engineering is human-as-architect.</strong></p>

<p>In Karpathy''s formulation, agentic engineering has two components. "Agentic" because the new default is that you are not writing the code directly 99% of the time, you are orchestrating agents who do, while acting as oversight. "Engineering" to emphasise that there is an art, a science, and a genuine expertise to it. It is something you can learn and improve at. It is not something you can simply feel your way through.</p>

<p>Addy Osmani, Google Chrome''s engineering lead and one of the most widely read voices in web development, published a sharp piece on his personal site this February drawing the line precisely: "Vibe coding = YOLO. Agentic engineering = AI does the implementation, human owns the architecture, quality, and correctness."</p>

<p>The workflow he describes is disciplined in ways that vibe coding explicitly was not. You start with a design document or specification before prompting anything. You break work into well-scoped tasks with clear interfaces. You direct agents to implement specific, bounded functions. You review every piece of generated code with the same rigour you would apply to a human colleague''s pull request. You test relentlessly. "If you can''t explain what a module does, it doesn''t go in," Osmani writes.</p>

<p>Forrester Research analyst Andrew Cornwall confirms what this looks like at the enterprise level: "Vibe coding is great for prototypes but not wonderful for brownfield or production code. Most developers have adopted GenAI assistance, and agents promise next-level benefits to the developers who can become proficient with them."</p>

<p>What this means practically is that the role of the developer has not been eliminated, it has been elevated. The implementation layer is increasingly delegated to agents. The architecture, the quality standards, the security boundaries, the product decisions, these remain irreducibly human responsibilities. And they require more skill and judgement than they did before, not less, precisely because the consequences of getting them wrong are now amplified by the speed at which agents can act on bad instructions.</p>

<h2>The Part of This Conversation Nobody Is Having</h2>

<p>Here is where the vibe coding debate, and even most of the agentic engineering conversation, goes wrong for the audience that matters most to this article: founders, product teams, and the companies building digital products.</p>

<p>The entire discourse has been about <em>how</em> software gets written. Almost none of it has been about <em>what</em> software gets built and whether it solves a real problem for real people.</p>

<p>The cost of building has collapsed. A lean team of three to five people can now accomplish what previously required twenty or more engineers. Initial seed rounds for AI-application startups in 2026 are averaging between $2 million and $5 million, down substantially from the capital requirements of previous generations of software companies. Founders can go from concept to deployed product in weeks.</p>

<p>And <strong>90% of startups still fail</strong>. The leading cause, at 42%, remains building something nobody wants.</p>

<p>The speed of building has never been the primary reason products fail. It has always been the quality of the thinking that precedes the building: the clarity of the problem being solved, the depth of understanding of the user experiencing that problem, the precision of the product decisions that translate insight into experience.</p>

<p>Agentic engineering, for all its genuine advantages over vibe coding, does nothing to address any of this. It makes the implementation faster, more reliable, more maintainable, and more secure. It does not make the product strategy smarter. It does not replace user research. It does not tell you which features matter and which ones are noise. It does not resolve the tension between what users say they want and what they actually need. It does not substitute for the UX discipline that turns a technically functional product into one people actually choose to use.</p>

<p>What agentic engineering does is compress the distance between decision and consequence. If the decision is right, you get to the right outcome faster. If the decision is wrong, you get to the wrong outcome faster. <strong>The premium on making the right decision has gone up, not down.</strong></p>

<h2>The UX Gap That Speed Is Exposing</h2>

<p>There is a specific failure mode emerging in 2026 that is worth naming directly, because it is showing up in products built by technically competent teams using the best available tools.</p>

<p><strong>The UX gap.</strong> The gap between what works technically and what works for users.</p>

<p>Vibe coding and agentic engineering both produce software that runs. Neither produces software that is intuitive, coherent, or designed around a real understanding of how users think, what they expect, where they get confused, and what would make them come back.</p>

<p>71% of retailers in a recent survey believed they excelled at personalisation, but only 34% of consumers agreed. That gap is not a technology problem. The technology for personalisation is mature, accessible, and well-documented. The gap exists because the product and UX thinking required to translate personalisation capability into genuine user experience is hard, slow, and cannot be delegated to an AI agent.</p>

<p>The same dynamic applies across product categories. The companies shipping AI-assisted features at speed in 2026 are not all shipping better products. Many are shipping more features, faster, into products that users find more overwhelming, less coherent, and harder to trust. Speed without UX discipline does not produce better products. It produces more of the same problems, faster.</p>

<p>Addy Osmani identified this directly: "The developers who will thrive are not the ones who prompt the fastest. They are the ones who think the clearest about what they are building and why, then use every tool available, including AI agents, to build it well."</p>

<p>That clarity, about what you are building and why, is a product thinking problem. It requires talking to users. It requires watching people interact with your product and noticing where they hesitate, where they misread your interface, where they give up. It requires the discipline to say no to features that are easy to build but add no value to the person using them. It requires understanding that the most important design decisions are often the ones about what to leave out.</p>

<p>None of that is automated. None of it is accelerated by faster code generation. It is, if anything, more valuable precisely because the code generation problem is increasingly solved.</p>

<h2>What This Means for How Products Should Be Built in 2026</h2>

<p>The practical implication is not complicated, but it requires resisting the cultural momentum of the current moment, which overwhelmingly rewards speed-to-ship over depth-of-thinking.</p>

<h3>Define the problem before touching any tool</h3>

<p>The specification document that Osmani describes as the starting point for agentic engineering is not just an engineering artefact. It is a product thinking document. Who is this for? What problem does it solve? What does success look like from the user''s perspective? What is the single most important thing this product needs to do well? These questions should be answered in writing, with clarity, before a single prompt is issued to a single agent.</p>

<h3>Invest in user understanding before you invest in implementation</h3>

<p>The most expensive mistake in product development is building the wrong thing with great technical rigour. Qualitative user research, even lightweight, even informal, is the highest-leverage activity in the early stages of any product, and it is the one most consistently skipped by teams excited about what they can now build.</p>

<h3>Treat UX as a quality gate, not a polish pass</h3>

<p>One of the failure modes of fast AI-assisted development is that UX review happens at the end, as a cosmetic layer applied to an already-built product. In that position it is almost powerless, the fundamental product decisions have already been made in the architecture, and changing them is expensive. UX discipline belongs at the beginning, alongside the product specification, not at the end as a design sprint on top of functioning code.</p>

<h3>Measure outcomes, not outputs</h3>

<p>The seductive metric in an agentic engineering workflow is velocity — how much shipped, how fast. The metric that actually matters is whether the product is solving the problem it was built to solve, for the users it was built to serve. Shipping faster is only an advantage if what you are shipping is moving in the right direction.</p>

<h2>Conclusions</h2>

<p>Karpathy was right to retire vibe coding. It was always a description of prototyping behaviour dressed up, by others, as a product development philosophy. Agentic engineering is a genuine and meaningful upgrade, more structured, more reliable, more professional, more honest about what AI agents can and cannot do.</p>

<p>But neither term addresses the question that has always determined whether software creates value: <strong>is this the right product, for the right people, solving the right problem in the right way?</strong></p>

<p>The cost of building in 2026 is approaching zero. The value of knowing what to build has never been higher.</p>

<p>The teams that will build the defining products of the next five years are not the ones with the fastest agents or the most automated pipelines. They are the ones who combine that technical leverage with genuine clarity about who they are building for and why — and who have the discipline to let that clarity, rather than the excitement of what is now possible to build, drive the decisions that matter.</p>

<p><strong>The tools have changed. The thinking required to use them well has not.</strong></p>'
FROM public.insights i
WHERE i.slug = 'from-vibe-coding-to-agentic-engineering';
