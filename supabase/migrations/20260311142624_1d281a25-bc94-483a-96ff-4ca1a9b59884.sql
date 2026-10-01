
-- Insert the new insight article
INSERT INTO public.insights (slug, author, published_date, featured_image, type)
VALUES (
  'hidden-cost-technical-debt-ai-development',
  'Advisable Team',
  '2026-03-11',
  '/images/insights/hidden-cost-technical-debt-ai-development.png',
  'insight'
);

-- Insert the English translation
INSERT INTO public.insights_translations (insights_id, language_id, title, excerpt, content)
VALUES (
  (SELECT id FROM public.insights WHERE slug = 'hidden-cost-technical-debt-ai-development'),
  1,
  'The Hidden Cost of Moving Fast: Technical Debt in AI-Assisted Development',
  'The productivity gains from AI-assisted development are real but narrower than the headlines suggest, and they come with a compounding cost that most engineering teams are not yet measuring.',
  '<p><strong>TL;DR: The productivity gains from AI-assisted development are real but narrower than the headlines suggest, and they come with a compounding cost that most engineering teams are not yet measuring.</strong></p>

<p><strong>Google''s DORA research found that increased AI adoption correlates with a 7.2% decrease in software delivery stability. GitClear''s analysis of 211 million lines of code found that AI-assisted development is producing more duplicate code, less refactoring, and higher churn rates year over year.</strong></p>

<p><strong>A METR randomised controlled trial found that experienced developers using AI tools took 19% longer to complete tasks than those working without them, while believing they were moving faster.</strong></p>

<p><strong>None of this means AI-assisted development is a mistake. It means the way most teams are using it is one. This article explains what is actually happening structurally, why it compounds.</strong></p>

<h2>The Speed Illusion</h2>

<p>The narrative around AI-assisted development has been almost uniformly optimistic. Developers ship features faster. Commit frequency increases. Pull request volume climbs. Every visible metric of productivity appears to improve. For leadership teams not embedded in the engineering workflow, the conclusion is obvious: AI is working.</p>

<p>The problem is that the metrics most organisations track for software development, lines of code, deployment frequency, feature output, measure the activity of development, not the quality of what is being built. And the gap between those two things is where technical debt lives.</p>

<p>Technical debt, as a concept, is not new. Ward Cunningham coined the term in 1992 to describe the long-term cost of taking shortcuts in code quality to meet short-term delivery timelines. His formulation was precise: every minute spent on not-quite-right code counts as interest on that debt.</p>

<p>Entire engineering organisations can be brought to a standstill under the debt load. What is new is the speed at which AI-assisted development can accumulate that debt, and the specific ways in which AI-generated code creates structural problems that are qualitatively different from the technical debt of previous development eras.</p>

<p>McKinsey Digital''s research on technical debt, synthesising survey data from 50 CIOs of financial services and technology companies, describes the phenomenon in financial terms: technical debt is the off-balance-sheet accumulation of all the technology work a company needs to do in the future.</p>

<p>It estimated that tech debt amounts to 20 to 40% of the value of entire technology estates before depreciation, and that 30% of CIOs surveyed believed more than 20% of their technology budget ostensibly dedicated to new products was being diverted to resolving existing debt.</p>

<p>McKinsey''s broader analysis of 220 companies across five geographies and seven sectors found that companies in the 80th percentile for their Tech Debt Score had revenue growth 20% higher than those in the bottom 20th percentile. Technical debt is not merely an engineering inconvenience. It is a business performance variable.</p>

<p>AI-assisted development, deployed without appropriate governance, is accelerating debt accumulation at a rate that makes the previous era of fast-but-messy development look measured by comparison.</p>

<h2>What the Research Actually Shows</h2>

<h3>The DORA Finding Nobody Is Talking About</h3>

<p>Google''s DORA (DevOps Research and Assessment) programme has been the gold standard for measuring software delivery performance for over a decade. Its annual report draws on survey data from tens of thousands of developers and engineering leaders globally, and its metrics, deployment frequency, lead time for changes, change failure rate, mean time to recovery, have become the industry benchmark.</p>

<p>The 2024 DORA report, surveying approximately 39,000 respondents, confirmed that AI adoption is widespread: 75.9% of respondents rely on AI for at least part of their development responsibilities. It also confirmed that individual developers feel more productive, more than a third reported moderate to extreme productivity increases from AI use. Then came the finding that contradicted the received wisdom.</p>

<p>A 25% increase in AI adoption was associated with a 1.5% decrease in delivery throughput and a 7.2% decrease in delivery stability. More code was being written. Faster. But the reliability of software delivery was declining. The systems getting code faster were also breaking more often.</p>

<p>The 2025 DORA report updated this picture. Throughput improved, teams appeared to be learning how to integrate AI more effectively into their workflows. But the negative relationship between AI adoption and delivery stability persisted.</p>

<p>The DORA researchers'' framing is precise and worth understanding:</p>

<p>AI accelerates software development, but that acceleration can expose weaknesses downstream. Without robust control systems, strong automated testing, mature version control practices, fast feedback loops, an increase in change volume leads to instability.</p>

<p>The implication is structural. AI does not make bad development practices worse in the way that a faster worker makes mistakes more frequently. It makes them worse in the way that a faster assembly line with inadequate quality control produces defects at scale. The speed is real. So is what the speed conceals.</p>

<h3>The Code Quality Data</h3>

<p>GitClear, a developer analytics platform that has been classifying and analysing code change data since 2020, published two consecutive years of research on how AI coding assistants are changing the composition, not just the volume, of code being written.</p>

<p>Their 2024 research analysed 153 million changed lines of code from January 2020 to December 2023. Their 2025 research extended this to 211 million lines through 2024. The combined dataset is the largest known structured code change database used to evaluate code quality differences across the industry.</p>

<p>The findings across both studies point in a consistent direction. Code churn, the percentage of lines reverted or updated less than two weeks after being written, rose from 3.1% of changed lines in 2020 to 5.7% in 2024. This is the clearest signal of low-quality commits: code that was written, merged, and then immediately needed to be fixed or removed.</p>

<p>The refactoring rate, measured by "moved lines," code relocated as part of restructuring, declined from 24.1% of changed lines in 2020 to 9.5% in 2024. Refactoring is how experienced engineers keep codebases maintainable over time, extracting reusable modules, reducing duplication, and improving architecture. Its decline signals that AI-assisted workflows are focused on adding code rather than improving existing code.</p>

<p>Most striking is the data on code duplication. The proportion of copy/pasted lines grew from 8.3% in 2020 to 12.3% in 2024, a 48% relative increase. In 2024, for the first time in GitClear''s measurement history, copy/pasted lines exceeded moved (refactored) lines. The occurrence of duplicate code blocks grew approximately tenfold between 2022 and 2024.</p>

<p>GitClear''s observation on this point is precise:</p>

<p>AI code suggestion systems are designed to suggest adding code, not to update, move, or delete existing code. The result is systems that grow by accretion rather than by architectural improvement, accumulating redundancy and complexity rather than consolidating it.</p>

<p>The connection to debt is direct. Duplicated code is maintenance overhead: when a change needs to be made, every instance of that code must be found and updated individually, increasing the risk of inconsistency and bugs.</p>

<p>Declining refactoring means that the structural problems which accumulate over a codebase''s lifetime are not being addressed. High churn means that code is being written too quickly for developers to verify it before it needs to be corrected.</p>

<h3>The Productivity Paradox</h3>

<p>In July 2025, METR, a nonprofit research organisation focused on evaluating AI capabilities, published the most rigorous independent study of AI coding productivity conducted to date. The study used a randomised controlled trial design: 16 experienced open-source developers with an average of five years of experience on their respective repositories, completing 246 real production tasks drawn from actual codebases, with each task randomly assigned to AI-allowed or AI-disallowed conditions.</p>

<p>The AI tools used were current at the time of the study: Cursor Pro with Claude 3.5 and 3.7 Sonnet. These were not yesterday''s models. The developers were not inexperienced with AI tools.</p>

<p>The result: developers using AI tools took 19% longer to complete tasks than those working without them.</p>

<p>The perception finding is at least as significant as the productivity finding. Before the study, developers forecast that AI would reduce their task completion time by 24%. After completing the study, after experiencing a measurable slowdown, they still estimated that AI had made them 20% faster. The 43-percentage-point gap between what developers believed and what the data showed was not a measurement error. It was a systematic mismatch between subjective experience and objective performance.</p>

<p>The METR researchers'' analysis of why AI slowed these developers down is instructive. Developers in the study spent significant time prompting AI and waiting for responses, reviewing generated code before accepting it, and cleaning up problems that AI suggestions introduced.</p>

<p>They accepted fewer than 44% of AI-generated code suggestions, meaning that more than half the time, the process of generating, reviewing, and rejecting a suggestion was slower than writing the code directly would have been.</p>

<p>Complex, mature codebases, the kind that have been developed and refined over years, are particularly poor environments for AI coding tools, which work best with well-defined, context-light tasks rather than the kind of deep architectural context that experienced developers carry implicitly.</p>

<p>The productivity paradox METR identified is this: AI assistance feels faster because it generates output quickly. But generating output and completing production-quality work are not the same thing. The gap between them is where the hidden cost lives.</p>

<h2>Why AI-Specific Technical Debt Compounds Differently</h2>

<p>Technical debt has always been a feature of software development. What makes AI-assisted development different is not that it creates technical debt, it is that it creates it through mechanisms that are harder to detect and correct than traditional debt patterns.</p>

<p>Traditional technical debt accumulates because developers make deliberate shortcuts: choosing a quick fix over a proper solution to meet a deadline, deferring documentation, implementing a workaround rather than redesigning an interface. These decisions are typically made consciously, by developers who understand what they are trading off. The debt is known, even if it goes unaddressed.</p>

<p>AI-assisted technical debt accumulates differently. The code AI generates is often syntactically correct and functionally adequate in isolation. It passes initial review. It works in testing.</p>

<p>The problems it creates, architectural inconsistency, duplicated logic, violated conventions, dependencies that will become unmaintainable as the codebase grows, are not visible at the point of generation. They emerge over time, as the volume of AI-generated code grows and the absence of architectural coherence becomes apparent.</p>

<p>Ox Security''s research on AI-generated code, published in October 2024, characterises this precisely. AI-generated code is described as highly functional but systematically lacking in architectural judgment. Their analysis identified three structural vectors through which AI creates compounding technical debt:</p>

<ul>
<li><strong>Model versioning chaos</strong>, as AI coding tools evolve rapidly and code written for one version of a model may not integrate cleanly with code written for another.</li>
<li><strong>Code generation bloat</strong>, as AI tools optimise for generating plausible code rather than minimal code, producing volume over economy.</li>
<li><strong>Organisational fragmentation</strong>, as independent teams adopt different AI tools and approaches without governance, creating codebases that reflect multiple, inconsistent AI-generation patterns rather than a coherent engineering philosophy.</li>
</ul>

<p>The compounding dynamic is important to understand. Each of these vectors individually creates maintainability problems. Together, they interact in ways that make the debt exponentially harder to address.</p>

<p>Model versioning chaos makes code generation bloat harder to detect because the inconsistency in the codebase has multiple explanatory sources. Organisational fragmentation makes both harder to address because there is no unified view of the codebase''s technical debt position.</p>

<p>McKinsey''s research on technical debt describes the end state of unaddressed compounding debt precisely through a real example: a large B2B business that identified dozens of modernisation initiatives representing a $2 billion margin expansion opportunity, only to discover that 70% of them depended on technology that would cost $400 million to modernise, an amount so far in excess of projections that the company was forced to walk away from 25% of the potential margin expansion entirely.</p>

<p>The debt had not been accumulated through incompetence. It had been accumulated through years of reasonable, fast decisions that individually made sense and collectively became a structural ceiling on the business.</p>

<h2>The Metrics That Hide the Problem</h2>

<p>One reason AI-assisted technical debt accumulates without early warning is that the metrics most product and engineering teams track are designed to measure throughput, not structural health.</p>

<p>Deployment frequency, feature velocity, commit volume, and sprint completion rates all measure activity. In an AI-assisted development environment, all of these metrics will typically improve in the short term even as the codebase''s structural quality declines. More code is generated faster. More features ship on schedule. The numbers look good.</p>

<p>The metrics that reveal structural debt, code churn rate, refactoring activity, test coverage, cyclomatic complexity, architectural coupling, are rarely on the same dashboard as the velocity metrics, and they are rarely presented to the stakeholders making decisions about AI tool adoption and development pace.</p>

<p>Google''s DORA 2024 research explicitly identifies this dynamic as a "Vacuum Hypothesis":</p>

<p>AI enables developers to complete valuable work faster, but instead of the reclaimed time being directed to higher-value architectural work, it gets absorbed by lower-value tasks, generating more code, shipping more features, filling the available time with output rather than quality.</p>

<figure><img src="/images/insights/technical-debt-metrics-dashboard.png" alt="Executive Metrics vs Engineering Health dashboard showing deployment frequency, feature velocity, code churn, architectural coupling, duplicate code, and refactoring rate" width="1200" height="630" loading="lazy" style="width:100%;height:auto;border-radius:0.5rem" /></figure>

<p>The result is that the productivity gain from AI does not translate into improved delivery performance at the system level, because the individual speed increase is consumed by the overhead of managing what that speed produces.</p>

<p>The CISQ''s Cost of Poor Software Quality report, the most comprehensive institutional quantification of technical debt cost in the US, estimated that poor software quality costs US companies $2.41 trillion annually, with the principal of technical debt alone reaching $1.52 trillion in 2022, growing at 14% annually since 2018.</p>

<p>AlixPartners'' analysis confirms that by 2025, approximately 40% of IT budgets will be directed toward maintaining existing technical debt rather than building new value. These are the system-level costs of the individual-level metrics looking good for long enough.</p>

<h2>What Responsible AI-Assisted Development Looks Like</h2>

<p>None of the research above argues that AI coding tools should not be used. The DORA findings are explicit that AI has positive impacts on individual developer satisfaction, documentation quality, and code review speed.</p>

<p>The METR study''s own authors note that their results represent a snapshot of early-2025 AI in one specific context, experienced developers on mature, complex codebases, and that results will vary by task type, codebase complexity, and developer experience level. GitClear''s research is a call for measurement discipline, not a call to reject AI tooling.</p>

<p>What the research argues, collectively, is that AI coding tools require governance, the same kind of intentional management that any powerful accelerant requires when introduced into a complex system.</p>

<p>The first governance principle is measuring what actually matters. Delivery velocity and feature throughput are necessary metrics but insufficient ones. Engineering leaders who adopt AI coding tools without simultaneously tracking code churn rate, refactoring activity, test coverage, architectural coupling, and duplicate code prevalence are measuring the input to technical debt creation without measuring the debt itself.</p>

<p>McKinsey''s recommendation, treating technical debt as a business issue with P&amp;L ownership rather than a technology housekeeping problem, applies with particular force in AI-assisted development environments, where the pace of debt creation has accelerated.</p>

<p>The second principle is distinguishing where AI assistance actually helps. The METR study''s finding that experienced developers on complex, mature codebases were slowed by AI assistance does not mean AI provides no value. It means AI provides different value in different contexts. AI assistance is most effective on well-defined, context-light tasks:</p>

<ul>
<li>Boilerplate generation</li>
<li>Test scaffolding</li>
<li>Documentation</li>
<li>Code explanation</li>
<li>Routine pattern implementation</li>
</ul>

<p>It is least effective, and most likely to generate debt, on tasks requiring deep architectural judgment:</p>

<ul>
<li>Designing data models</li>
<li>Establishing service boundaries</li>
<li>Refactoring existing systems</li>
<li>Building against complex implicit conventions that live in the codebase rather than in a prompt</li>
</ul>

<p>The third principle is maintaining refactoring as a first-class engineering activity. GitClear''s data shows that the decline in refactoring activity is the most structurally significant change associated with AI-assisted development. Refactoring is how codebases remain maintainable over time.</p>

<p>If AI tools generate code faster but the time saved is not being reinvested in architectural improvement, the codebase will grow in volume while declining in coherence. Engineering cultures that explicitly budget time for refactoring, and measure refactoring activity as a signal of engineering health, are building a structural counterweight to the debt-generating dynamics of AI code generation.</p>

<p>The fourth principle is code review discipline at scale. The speed advantage of AI-assisted development is partially undermined by inadequate review of AI-generated code, as the METR study''s finding that developers accepted fewer than 44% of AI suggestions suggests, the review overhead is already substantial. But the answer is not to reduce review rigour to preserve speed.</p>

<p>It is to develop review practices calibrated to the specific failure modes of AI-generated code:</p>

<ul>
<li>Architectural inconsistency</li>
<li>Missing error handling</li>
<li>Security vulnerabilities</li>
<li>Violations of existing conventions</li>
</ul>

<p>Google''s DORA research specifically identifies robust testing mechanisms and small batch sizes as the practices that allow AI-enabled development to improve rather than degrade delivery stability. Review discipline and small batches are the same principle: making the change volume manageable so that its quality can be verified.</p>

<p>The fifth principle is governance at the organisational level, not just the team level. Ox Security''s identification of organisational fragmentation as a debt vector is a product team problem, not an engineering problem. When independent teams adopt different AI tools, different prompting approaches, and different code generation conventions without coordination, the result is a codebase that reflects multiple inconsistent AI-generation patterns rather than a coherent engineering philosophy.</p>

<p>The companies that are managing this well are those that have established clear AI usage policies, defined which tools are sanctioned and how they should be used, and created visibility into AI adoption patterns across engineering teams, treating AI adoption as an organisational transformation rather than a collection of individual developer choices.</p>

<h2>The Window for Getting This Right</h2>

<p>McKinsey''s research on companies in the bottom 20th percentile for their Tech Debt Score found that they are 40% more likely to have incomplete or cancelled IT modernisation efforts than those in better positions.</p>

<p>The debt that accumulates during a period of rapid, ungoverned AI adoption does not become visible until the team tries to build something significant on top of it, at which point the options are expensive, disruptive, or both.</p>

<p>The DORA 2025 report frames the path forward precisely:</p>

<p>The value of AI is unlocked not by the tools themselves, but by the surrounding technical practices and cultural environment. Platform engineering, automated testing maturity, small batch sizes, fast feedback loops, these are the practices that allow AI to accelerate development without degrading stability. Without them, AI accelerates development and exposes the weaknesses that were always there.</p>

<p>Engineering and product leaders who are deploying AI coding tools in 2026 are making decisions that will determine the structural health of their codebases in 2028 and beyond.</p>

<p>The debt being created now is invisible in the metrics that most organisations track, which is precisely why it compounds unchecked. The organisations that will be positioned to move fast at scale in two years are not the ones generating the most code today. They are the ones building measurement and governance frameworks today that allow AI''s genuine productivity benefits to accrue without simultaneously building a debt ceiling on everything they want to do next.</p>

<h2>Resources</h2>

<ol>
<li>Google Cloud, "Accelerate State of DevOps Report 2024", DORA Research Programme: <a href="https://cloud.google.com/blog/products/devops-sre/announcing-the-2024-dora-report" target="_blank" rel="noopener noreferrer">cloud.google.com</a></li>
<li>Google Cloud, "Accelerate State of DevOps Report 2025", DORA Research Programme: <a href="https://cloud.google.com/blog/products/ai-machine-learning/announcing-the-2025-dora-report" target="_blank" rel="noopener noreferrer">cloud.google.com</a></li>
<li>Joel Becker et al. (METR), "Measuring the Impact of Early-2025 AI on Experienced Open-Source Developer Productivity", arXiv, July 2025: <a href="https://arxiv.org/abs/2507.09089" target="_blank" rel="noopener noreferrer">arxiv.org</a></li>
<li>METR, "Measuring the Impact of Early-2025 AI on Experienced Open-Source Developer Productivity" (blog post and methodology summary), July 2025: <a href="https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/" target="_blank" rel="noopener noreferrer">metr.org</a></li>
<li>William Harding &amp; Matthew Kloster (GitClear), "Coding on Copilot: 2023 Data Suggests Downward Pressure on Code Quality", GitClear Research, January 2024: <a href="https://www.gitclear.com/coding_on_copilot_data_shows_ais_downward_pressure_on_code_quality" target="_blank" rel="noopener noreferrer">gitclear.com</a></li>
<li>William Harding (GitClear), "AI Copilot Code Quality: 2025 Data Suggests 4x Growth in Code Clones", GitClear Research, February 2025: <a href="https://www.gitclear.com/ai_assistant_code_quality_2025_research" target="_blank" rel="noopener noreferrer">gitclear.com</a></li>
<li>Sven Blumberg, Rahul Das et al. (McKinsey Digital), "Demystifying Digital Dark Matter: A New Standard to Tame Technical Debt", McKinsey, June 2022: <a href="https://www.mckinsey.com/capabilities/mckinsey-digital/our-insights/demystifying-digital-dark-matter-a-new-standard-to-tame-technical-debt" target="_blank" rel="noopener noreferrer">mckinsey.com</a></li>
<li>Aamer Baig, Sven Blumberg et al. (McKinsey Digital), "Breaking Technical Debt''s Vicious Cycle to Modernize Your Business", McKinsey, April 2023: <a href="https://www.mckinsey.com/capabilities/mckinsey-digital/our-insights/breaking-technical-debts-vicious-cycle-to-modernize-your-business" target="_blank" rel="noopener noreferrer">mckinsey.com</a></li>
<li>Vishal Dalal, Krish Krishnakanthan et al. (McKinsey Digital), "Tech Debt: Reclaiming Tech Equity", McKinsey, October 2020: <a href="https://www.mckinsey.com/capabilities/mckinsey-digital/our-insights/tech-debt-reclaiming-tech-equity" target="_blank" rel="noopener noreferrer">mckinsey.com</a></li>
<li>Consortium for Information &amp; Software Quality (CISQ), "The Cost of Poor Software Quality in the US: A 2022 Report", co-sponsored by the Object Management Group and the Software Engineering Institute at Carnegie Mellon University: <a href="https://www.it-cisq.org/the-cost-of-poor-software-quality-in-the-us-a-2022-report/" target="_blank" rel="noopener noreferrer">it-cisq.org</a></li>
<li>Ox Security, "Army of Juniors: The AI Code Security Crisis", October 2024: <a href="https://www.ox.security/resources/army-of-juniors-the-ai-code-security-crisis/" target="_blank" rel="noopener noreferrer">ox.security</a></li>
<li>AlixPartners, "Can AI Solve the Rising Costs of Technical Debt?", October 2024: <a href="https://www.alixpartners.com/insights/102jlar/can-ai-solve-the-rising-costs-of-technical-debt/" target="_blank" rel="noopener noreferrer">alixpartners.com</a></li>
<li>Gartner, "Reduce and Manage Technical Debt" (topic overview and research): <a href="https://www.gartner.com/en/infrastructure-and-it-operations-leaders/topics/technical-debt" target="_blank" rel="noopener noreferrer">gartner.com</a></li>
</ol>'
);
