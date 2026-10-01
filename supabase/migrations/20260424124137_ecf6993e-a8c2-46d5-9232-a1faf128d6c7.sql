INSERT INTO public.insights (slug, author, published_date, type, featured_image)
VALUES (
  'most-products-built-for-founders-brain-not-users-reality',
  'Advisable Team',
  '2026-04-24',
  'article',
  '/images/insights/products-built-for-founders-brain-featured.png'
);

INSERT INTO public.insights_translations (insights_id, language_id, title, excerpt, content)
SELECT id, 1, 'Most Products Are Built for the Founder''s Brain, Not for the User''s Reality', 'Most products fail not because they are badly built, but because they are built for how the founder experiences the problem, not for how users do. The data on startup failure, feature adoption, and cognitive bias points to one pattern: the gap between founder intuition and user reality is structural, and it is correctable.', '<p><strong>TL;DR</strong> According to CB Insights'' 2024 analysis of 431 failed VC-backed companies, 43% cited poor product-market fit as their cause of death, making it the single most common reason startups fail, ahead of running out of money.</p>

<p>Pendo''s product analytics research across thousands of live products shows that only 6.4% of features drive 80% of actual user activity, and that 80% of software features are rarely or never used at all. The mechanism behind both statistics is the same: founders build for how they experience the problem, not for how their users do.</p>

<p>Nielsen Norman Group''s research on the false-consensus effect and confirmation bias documents exactly why this happens, and why it is so difficult to catch from the inside. The result is not just wasted engineering time. It is products that users abandon, features that go untouched, and companies that run out of runway waiting for traction that was never coming because the product was never built for the people who were supposed to use it.</p>

<h2>The Number That Should Worry Every Founder</h2>

<p>In 2024, CB Insights updated its landmark analysis of startup failure, this time examining 431 VC-backed companies that shut down since 2023. The headline finding was almost identical to their original study a decade earlier: <strong>43% of failed startups cited poor product-market fit as a primary cause of failure.</strong></p>

<p>This figure has remained stubbornly consistent across two different decades and four times as much data. It is not a blip. It is a structural pattern in how products get built.</p>

<p>CB Insights is explicit in the 2024 update about what this means: running out of cash, which affected 70% of failures, is the most visible endpoint. Poor product-market fit is the most commonly reported underlying pattern.</p>

<p>The reasons that happens are not always identical, timing, market conditions, and execution all intersect, but the most consistent thread across the post-mortems is the same: the product was not built for the people who were supposed to use it.</p>

<p>That is not purely a funding problem. It is primarily a thinking problem, and the thinking problem comes first.</p>

<h2>What Actually Gets Used</h2>

<p>The scale of the mismatch between what founders build and what users actually do becomes clearer when you look at product usage data, not just post-mortems.</p>

<p>Pendo, a product analytics platform that tracks real user behaviour across thousands of software products, publishes benchmarks on feature adoption, how many features in a given product are actually being used. The results are stark. <strong>Across the average product, just 6.4% of features drive 80% of all user activity.</strong> Even among the top-performing products in their dataset, that figure only rises to 15.6%.</p>

<p>The rest, the overwhelming majority of what was designed, built, debated, iterated on, and shipped, is largely untouched.</p>

<p>A separate Pendo report puts it directly:</p>

<p><strong>80% of software features are rarely or never used.</strong></p>

<p>And the problem extends beyond what teams build internally: 49% of all software that businesses purchase also goes unused.</p>

<p>Not every low-usage feature is a mistake, some serve genuine but infrequent needs, and some are necessary infrastructure that users never directly interact with. But the directional conclusion is hard to argue with. At the scale Pendo is measuring, the gap between what product teams build and what users actually reach for is not marginal. It is structural.</p>

<figure><img src="/images/insights/products-built-for-founders-brain-iceberg.png" alt="Iceberg diagram showing 20% Used Features above water and 80% Unused Features below water" loading="lazy" /><figcaption>Only the tip: most software features go unused.</figcaption></figure>

<h2>Why It Keeps Happening</h2>

<p>The data describes the scale of the problem. What it does not explain is why the same mistake keeps occurring across different companies, different industries, and different decades. For that, the most useful work comes from Nielsen Norman Group, whose researchers have studied the cognitive mechanisms behind how product creators misread their users.</p>

<p>The first mechanism is what NN/g calls the <strong>false-consensus effect</strong>: the tendency of people to assume that others share their beliefs, mental models, and behaviours. In product terms, this means founders and designers naturally assume that the way they experience a problem is the way their users experience it.</p>

<p>They know the domain deeply. They have been living inside the problem for months or years. That expertise, paradoxically, makes it harder to see how a new or less experienced user actually approaches the same situation.</p>

<p>Nielsen Norman Group''s article on the false-consensus effect states it plainly: assuming that you are your user is a fallacy ingrained in the human mind. It is not a personal failing. It is a documented cognitive pattern, and it applies to experienced designers, developers, and researchers, not just first-time founders.</p>

<p>This is worth being precise about. The problem is not founder intuition itself. Some of the most consequential products in recent decades were built ahead of what users could articulate they wanted.</p>

<p>The problem is <strong>unchecked</strong> intuition, conviction that is never stress-tested against actual user behaviour, that accumulates investment and momentum before the feedback loop closes. Intuition that gets tested early and often is a competitive advantage. Intuition that becomes a fortress is what fills the CB Insights dataset.</p>

<p>The second mechanism compounds the first. <strong>Confirmation bias</strong>, documented by NN/g in a dedicated piece on how cognitive biases affect UX practitioners, works as follows:</p>

<p>The more invested you are in a design or a decision, the more aggressively you filter incoming evidence to support it. A team that has spent six months building a feature will interpret ambiguous user feedback in the direction of that feature being fine. A team that has been building for two weeks will be far more open to the possibility that the feature is wrong.</p>

<p>Combined, these two effects create a predictable trap. The founder builds based on their own mental model of the problem. The team invests months in that model. By the time user data arrives showing that the model was wrong, the investment in the original direction has become strong enough that the data is explained away, deprioritised, or interpreted charitably. The product keeps moving in the wrong direction.</p>

<h2>The Cost Is Not Just Engineering Time</h2>

<p>When this pattern plays out at scale, the cost extends well beyond wasted sprint cycles.</p>

<p>Startup Genome''s research, based on data from more than 3,200 high-growth technology startups, found that premature scaling, building and expanding ahead of validated user need, is a factor in 70% of startup failures in their dataset.</p>

<p>No startup in their dataset that scaled prematurely passed the 100,000 user mark. Teams hire, they build, they market, and they raise, all before confirming that the thing they are building is something real users want to use. By the time the signal arrives, the company has spent resources it cannot recover.</p>

<p>At the product level, Pendo''s research makes the financial dimension concrete. A software company spending the industry-average proportion of revenue on R&amp;D might dedicate $8.4 million per year, based on Pendo''s own calculation using Gartner''s cloud revenue figures and reported R&amp;D expenses from 54 public software companies, to features that customers rarely or never use. That is not a rounding error. It is the majority of a product team''s annual output going toward things that users will ignore.</p>

<p>And the downstream effects on retention are direct. Pendo''s data shows that unused features lower a customer''s perceived value of a product and reduce their willingness to renew at the same price level, or renew at all. The product does not fail at launch. It fails slowly, through attrition, as users who were never fully served by it find something that serves them better.</p>

<h2>What Getting It Right Actually Requires</h2>

<p>The solution is not more user feedback sessions or longer discovery phases, though both help. It is a shift in the underlying assumption that drives product decisions.</p>

<p>The false-consensus effect and confirmation bias do not disappear through good intentions. They are structural cognitive patterns. The only thing that consistently overcomes them is contact with actual user behaviour, not reported behaviour, where users tell you what they think you want to hear, but observed behaviour, where you watch what they actually do.</p>

<p>Nielsen Norman Group''s research on confirmation bias is specific about what this means in practice: the goal of research is not to validate what you already believe. It is to uncover what you did not know. The moment a research process becomes a confirmation exercise, building test cases around the hypothesis that the current design works, it has stopped being useful.</p>

<p>Behavioural data tells you what users do. It does not always tell you why. The most reliable product decisions combine both: usage analytics to identify where the gaps are, and qualitative research, interviews, usability sessions, open-ended observation, to understand the reasoning behind the behaviour. Neither alone is sufficient.</p>

<p>Behavioural data without qualitative context risks optimising the wrong metric very efficiently. Qualitative research without behavioural grounding risks being swayed by what users say rather than what they do.</p>

<p>This requires a willingness to be wrong about the product, not once, at the beginning, but continuously. Most teams are willing to be wrong once. Almost none are willing to discover they have been wrong for six months.</p>

<p>The CB Insights data is consistent across a decade: the companies that failed were not short on conviction. They were short on evidence that the conviction was correct. And by the time they looked for that evidence, they had already built too much to accept it.</p>

<h2>The Honest Summary</h2>

<p>The 43% figure from CB Insights is not describing 43% of founders who were careless or unsophisticated. It is describing what happens when smart, motivated people build products from inside their own mental model of a problem, without enough friction from the reality of how different users experience the same problem.</p>

<p>Pendo''s usage data shows that even when products do reach users, the mismatch persists at the feature level: most of what gets built does not get used. Nielsen Norman Group''s research explains why this is cognitively predictable and why it is hard to catch from inside the team building the product.</p>

<p>The gap between the product you think you are building and the product your users actually have is not a gap in execution. It is a gap in perspective. And the only way to close it is to make user reality, not founder intuition, the primary input into what gets built next.</p>

<h2>Resources</h2>

<ol>
<li>CB Insights, "Why Startups Fail: Top 9 Reasons", 2024 update (431 failed VC-backed companies): <a href="https://www.cbinsights.com/research/report/startup-failure-reasons-top/" target="_blank">cbinsights.com</a></li>
<li>Pendo, "Feature Adoption Benchmarking: Why feature adoption may be your biggest weakness — or strength": <a href="https://www.pendo.io/pendo-blog/feature-adoption-benchmarking/" target="_blank">pendo.io</a></li>
<li>Pendo, "Solving the Software Experience Crisis": <a href="https://www.pendo.io/pendo-blog/solving-the-software-experience-crisis/" target="_blank">pendo.io</a></li>
<li>Pendo, "2024 Software Benchmarks: Insights for Data-Driven Development": <a href="https://www.pendo.io/pendo-blog/product-benchmarks/" target="_blank">pendo.io</a></li>
<li>Nielsen Norman Group, "You Are Not the User: The False-Consensus Effect": <a href="https://www.nngroup.com/articles/false-consensus/" target="_blank">nngroup.com</a></li>
<li>Nielsen Norman Group, "Confirmation Bias in UX": <a href="https://www.nngroup.com/articles/confirmation-bias-ux/" target="_blank">nngroup.com</a></li>
<li>Nielsen Norman Group, "Decision Frames: How Cognitive Biases Affect UX Practitioners": <a href="https://www.nngroup.com/articles/decision-framing-cognitive-bias-ux-pros/" target="_blank">nngroup.com</a></li>
<li>Startup Genome, "A Deep Dive Into the Anatomy of Premature Scaling" (3,200+ startups dataset): <a href="https://startupgenome.com/library/a-deep-dive-into-the-anatomy-of-premature-scaling" target="_blank">startupgenome.com</a></li>
</ol>'
FROM public.insights
WHERE slug = 'most-products-built-for-founders-brain-not-users-reality';