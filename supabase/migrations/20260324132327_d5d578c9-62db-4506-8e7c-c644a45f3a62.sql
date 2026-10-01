
INSERT INTO insights (
  slug, author, published_date, featured_image, type, canonical_url
) VALUES (
  'the-athens-tech-ecosystem-in-2026-which-verticals-are-attracting-capital-and-talent',
  'Advisable Team',
  '2026-03-24',
  '/images/insights/athens-tech-ecosystem-2026-verticals-capital-talent.jpg',
  'article',
  'https://www.advisable.com/insights/the-athens-tech-ecosystem-in-2026-which-verticals-are-attracting-capital-and-talent'
);

INSERT INTO insights_translations (
  insights_id,
  language_id,
  title,
  excerpt,
  content
) VALUES (
  (SELECT id FROM insights WHERE slug = 'the-athens-tech-ecosystem-in-2026-which-verticals-are-attracting-capital-and-talent'),
  1,
  'The Athens Tech Ecosystem in 2026: Which Verticals Are Attracting Capital and Talent',
  'A sector-by-sector analysis of where capital is concentrating in Greece''s startup ecosystem — from AI and fintech to maritime, defence, biotech, agritech, and cleantech — with the structural advantages, key companies, and investment data that define each vertical in 2026.',
  '<p><strong>A sector-by-sector analysis of where capital is concentrating in Greece''s startup ecosystem — from AI and fintech to maritime, defence, biotech, agritech, and cleantech — with the structural advantages, key companies, and investment data that define each vertical in 2026.</strong></p>

<p>Greece''s startup ecosystem has moved past the phase where the headline story is simply that investment is growing. The numbers are now established, €732.2 million raised in 2025, a 35% increase year-on-year, Greece confirmed as the fastest-growing VC market in Europe by PitchBook.</p>

<p>The more useful question for founders, investors, and operators looking at Athens in 2026 is not whether the ecosystem is real, but where specifically the capital is concentrating, which companies are proving the thesis, and what the structural opportunity looks like sector by sector.</p>

<h2>Artificial Intelligence: Greece''s Strongest Global Claim</h2>

<p>Of all the verticals in the Greek ecosystem, AI is the one where the country has the clearest claim to international relevance, not just by regional standards, but measured against global benchmarks.</p>

<p>According to The Recursive''s State of AI in CEE 2024 report, which analyzed more than 1,350 companies across the region, Greece is home to 188 AI-focused companies, representing 17.5% of all AI startups in Central and Eastern Europe. That places Greece second behind Poland in terms of the total number of AI companies in the region, ahead of Romania, Czechia, and Bulgaria.</p>

<p>In terms of investment, Greek AI startups attracted €123 million in 2024, capturing approximately 20% of all AI funding directed to the CEE region that year. The investors active in Greek AI include Andreessen Horowitz, 8VC, and Protocol Labs, names that do not back geographies out of charity.</p>

<p>The talent story behind these numbers is structural, not accidental. By August 2024, approximately 18,500 professionals were employed in the AI sector in Greece. Sequoia Capital''s Atlas research, a data-driven study of engineering talent density across European cities, identified Athens as one of the European cities with an outlier per-capita concentration of AI engineers, alongside Dublin, Zurich, Berlin, and Paris.</p>

<p>Greek and Greek-diaspora researchers have a documented presence at the premier AI academic conferences, NeurIPS, ICML, and within the engineering organizations of the world''s largest technology companies. Some of that diaspora has begun returning. Google Maps co-founder Lars Rasmussen, originally Danish, moved to Athens in 2021 with his Greek wife and is now based there as an angel investor and co-founder of the Panathēnea innovation festival.</p>

<p>On the infrastructure side, AWS selected Athens for the first EU Outposts Testing Lab in 2023 and activated Direct Connect service in the city in 2025. In August 2025, OpenAI formalized a partnership with the Hellenic Republic, the Onassis Foundation, and Endeavor Greece to launch a ChatGPT Edu pilot in secondary schools and a dedicated AI startup accelerator, a signal that the world''s most prominent AI company sees Greece as a meaningful talent source and market.</p>

<p>At the model level, the Institute for Language and Speech Processing of the Athena Research Center developed Meltemi, Greece''s first large-scale Greek-language model built on Mistral-7B, followed by Llama-KriKri based on Meta''s Llama 3.1-8B, both developed using AWS GPU infrastructure. Their existence matters for any founder building a product that needs to serve Greek-speaking users with genuine language competence.</p>

<p>Active companies in the AI vertical span multiple categories. Plum is applying AI to personal finance and has formalized a partnership with Eurobank. StiQ has raised €10 million to run AI-powered cloud kitchens. WeatherXM uses AI and blockchain to build a decentralized hyperlocal weather data network and has attracted investors including Protocol Labs and Juan Benet.</p>

<p>Langaware, a cognitive health diagnostics platform, has secured a collaboration with Premier Inc.''s PINC AI Applied Sciences division in the United States. Kaedim uses AI for 3D model generation and has received Y Combinator backing. Harbor Lab applies AI to maritime disbursement analysis. Delian Alliance Industries applies AI to autonomous defence surveillance.</p>

<p>The cross-sector nature of this list is itself a signal. AI in Greece is not concentrated in a single application domain, it is being applied horizontally across fintech, health, maritime, agriculture, defence, and infrastructure. For a founder evaluating Greece as a location to build an AI product, this breadth means that ambient expertise and investor familiarity with AI applications is unusually high for an ecosystem of this size.</p>

<p>One important nuance: while the startup ecosystem is strong, Eurostat data shows that only 9.81% of Greek companies with ten or more employees were using AI technologies in 2024, ranking 18th among EU member states. The gap between the quality of AI innovation being produced in Greece and the rate of AI adoption by Greek enterprises is a market in itself, and a realistic go-to-market context for B2B AI founders considering the domestic opportunity.</p>

<h2>Fintech: A Unicorn Story With Depth Behind It</h2>

<p>Greece''s fintech sector is anchored by one of the most consequential company stories in European financial technology: Viva Wallet, now operating as VivaBank, is Greece''s only verified unicorn and one of the few genuine cloud-native neobanks in Europe to have scaled to continent-wide operations from a southern European base.</p>

<p>Founded in Athens in 2000, the company spent two decades building proprietary payment infrastructure before becoming, in 2022, the subject of a 48.5% acquisition by JPMorgan Chase that valued the business in the vicinity of €1.7 billion. Total capital raised stands at approximately $990 million according to PitchBook.</p>

<p>In February 2025, Viva completed the merger of its e-money institution subsidiary into Vivabank, positioning the combined entity as what it describes as Europe''s first Tech Bank for businesses, a cloud-native banking platform for SMEs operating across 24 European countries. The JPMorgan investment was not without complications; a legal dispute over valuation was largely resolved through UK High Court proceedings in 2025. What remains is a company of genuine European scale, built in and from Athens, serving over 450 partner integrations.</p>

<p>The Viva story matters beyond its own metrics because it demonstrates the full arc of a Greek fintech from founding to European expansion to institutional investment, a reference point that did not exist for Greek founders five years ago.</p>

<p>Beneath Viva, the fintech vertical has its own momentum. Hellas Direct, a digital-first insurance company, raised €30 million in a late-stage round in 2024 backed by ETF Partners and 5G Ventures. Plum formalized a partnership with Eurobank in 2024 and expanded its ETF offering to nine EU markets. Wocap, a 2025-founded Athens startup building a digital marketplace for working capital management through dynamic invoice auctions, has raised €450,000 to build out its platform and ERP integrations.</p>

<p>The Buy Now Pay Later segment offers a concrete market-size anchor for the broader payments opportunity in Greece. According to a ResearchAndMarkets report published in February 2026, the BNPL market in Greece stood at $434.7 million in 2025 and is projected to reach $1.26 billion by 2031, expanding at a CAGR of 18.1%. The market achieved a CAGR of 39.4% between 2022 and 2025. For founders building payment, lending, or treasury management products in Greece, the regulatory and infrastructure environment is materially better in 2026 than it was three years ago.</p>

<h2>E-Commerce: A Large Market Still Underserved by Digital Infrastructure</h2>

<p>Greece''s e-commerce market is large, growing, and structurally underpenetrated. According to Mordor Intelligence, the market stands at $34.63 billion in 2025 and is projected to reach $55.72 billion by 2030, expanding at a CAGR of 9.97%. In.gr confirmed that online retail sales reached €36.1 billion in 2025. Smartphones account for 65.23% of transaction value, making mobile optimization a strategic baseline rather than an option. The B2C segment leads with 88.02% market share, but B2B is the faster-growing segment, forecast to expand at a 12.8% CAGR through 2030 as enterprises embrace digital procurement.</p>

<p>The startup layer of the market is best illustrated by Spotawheel, which in November 2025 secured €300 million in a mixed Series C and venture debt round from Pollen Street Capital, bringing its total capital raised to over $524 million according to PitchBook. Founded in Athens in 2015, Spotawheel operates a tech-driven used car platform combining AI-powered pricing, proprietary inspection data, and vehicle subscription options. It currently operates in Greece, Poland, and Romania. The round is the largest single investment in a Greek company in 2025 and validates the capital appetite for Greek consumer-facing digital platforms at scale.</p>

<p>Skroutz, Greece''s dominant product search and comparison platform, remains the structural backbone of the domestic e-commerce ecosystem. According to Tracxn, there are 621 B2C e-commerce startups in Greece, of which 59 have received funding and 26 have secured Series A or above. Fashion and apparel is the largest category, with online consumer spending of €849.4 million in 2023. Food and beverages account for approximately 27% of the Greek e-commerce market.</p>

<p>Tourism-linked digital commerce is structurally significant: 61.8% of Greek online consumers purchased tickets for entertainment or leisure digitally, and 53.6% bought transport services, a consumer profile shaped by Greece''s position as a top-ten global tourism destination and one that creates specific product opportunities around experience commerce.</p>

<h2>Biotech and HealthTech: Infrastructure Arriving Faster Than the Startups</h2>

<p>Greece''s biotechnology and health technology sector is at an inflection point driven by institutional infrastructure arriving at scale and beginning to create the conditions for the next generation of companies.</p>

<p>According to the Found.ation and EIT Digital Startups in Greece 2024–2025 report, biotechnology and health technologies were among the top-funded sectors in 2024 alongside AI. The sector has 274 HealthTech companies tracked by Tracxn in Greece, of which 33 have received funding.</p>

<p>The anchor of the physical infrastructure story is the Athens LifeTech Park, an initiative of pharmaceutical company ELPEN, the first dedicated biotechnology park in Greece. It integrates an incubator, research center, CRO facilities, and business services under one roof, with the specific mandate of connecting academia, startups, venture capital, and established industry to accelerate drug discovery. It represents the kind of cluster infrastructure that the Greek biotech sector has historically lacked.</p>

<p>On the startup side, the 2025 funding mapping by The Recursive documents two significant rounds. A biotech AI company developing a platform for biopharma manufacturing process optimization raised €7.8 million in a Series A from Molten Ventures and Marathon Venture Capital. A HIPAA-compliant healthcare automation platform with over 300 integrations with electronic health records raised $7.5 million in a Seed round from 25Madison, Upfront Ventures, and Afore Capital.</p>

<p>Kinvent, a Greek-founded physiotherapy technology company operating across 68 countries, raised €16 million in 2024 led by Eurazeo, one of the clearest examples of a Greek health technology company achieving genuine international scale. Langaware, which applies AI to cognitive health diagnostics, secured a formal collaboration with Premier Inc.''s PINC AI Applied Sciences division in the United States.</p>

<p>The intersection of AI and health is the most active frontier in this vertical. AI-enabled health startups captured 62% of digital health venture funding globally in the first half of 2025, raising an average of $34.4 million per round, an 83% premium over non-AI counterparts. For Greek founders with biomedical training and AI engineering skills, that intersection is the clearest capital-efficient entry point.</p>

<p>The challenge the sector has historically faced is less about the quality of scientific talent and more about the entrepreneurial infrastructure to convert that talent into fundable companies, which is precisely what the Athens LifeTech Park and the HDBI''s 30 active VC funds are beginning to address.</p>

<h2>Maritime Technology: A Natural Monopoly in Plain Sight</h2>

<p>No country in the world has a more obvious structural foundation for maritime technology than Greece. According to the Union of Greek Shipowners'' Annual Report 2024–2025, the Greek-owned fleet comprises 5,700 vessels and represents 20% of the global fleet and 61% of the European Union''s fleet in deadweight tonnage, making Greece the world''s largest shipowning nation.</p>

<p>The shipping industry is headquartered in Athens, specifically Piraeus, and the ecosystem of shipowners, ship managers, brokers, insurers, and lawyers that surrounds it represents a concentrated, high-value, and historically underserved technology buyer. That opportunity is now being systematically converted into software companies.</p>

<p>Harbor Lab is the most prominent example. Founded in Athens in 2020 by Antonis Malaxianakis, Harbor Lab builds cloud-native software for managing port call costs, which are the second largest operating expense for commercial vessels after fuel, reaching approximately $2.2 million per vessel per year. The platform reduces invoicing errors and overpayments from a typical 20% margin of error down to approximately 3% per port call, and reduces administration costs by up to 75%. In May 2024, it raised $16 million in a Series A led by Atomico, bringing total funding to $22.5 million, with clients including Great Eastern Shipping, Oldendorff Carriers, and Veson Nautical. In 2024, Thetius named Harbor Lab one of the 50 most innovative startups and scaleups in the global maritime industry, not in the CEE, not in Europe, globally. The Recursive identifies Greece as the market leader in CEE maritime technology.</p>

<p>DeepSea Technologies raised €5 million to develop AI tools for decarbonizing maritime shipping, a sector facing significant regulatory pressure from IMO emissions targets. Signal Ocean provides data intelligence and market analytics for the shipping industry. ProcureShip is building digital supply chain tools for vessel provisioning. According to Tracxn, there are 54 maritime technology startups in Greece, of which 8 have received funding and 4 have secured Series A or above.</p>

<p>For founders building in this vertical, the structural advantage is access. The concentration of shipping principals in Piraeus means that customer discovery, pilot deployments, and reference customer acquisition happen faster and cheaper in Athens than they would anywhere else. That geographic density of customer and builder in the same place is what drove the success of fintech in London, proptech in New York, and logistics tech in Singapore, and it is what makes maritime tech in Athens a genuine structural opportunity rather than a sector that happens to have a few interesting companies.</p>

<h2>Defence Technology: From Emerging Category to Funded Reality</h2>

<p>Defence technology is the newest vertical to be formally designated as a standalone investment category in Greece''s ecosystem. The FWD Greece: Innovation Pulse 2025–2026 report explicitly names defence as a new emerging domain, separate from cybersecurity and aerospace, a reflection of both the capital that has started to flow and the geopolitical context driving demand.</p>

<p>Greece has structural reasons to be competitive in this sector. It is a NATO member with one of the highest defence spending ratios in the alliance as a percentage of GDP. It has a legacy industrial base in defence manufacturing, electronic systems, and optics. And it has a cost-talent ratio that makes building hardware and software for defence applications more capital-efficient than in western European hubs like the UK, Germany, or France.</p>

<p>Delian Alliance Industries, which launched in 2021 under the name Lambda Automata, is the clearest proof point. Founded by Dimitrios Kottas, who spent five years at Apple''s Special Projects Group working on autonomous vehicles, the company develops AI-powered autonomous surveillance, reconnaissance, and situational awareness systems. It raised approximately $6 million from US and European investors in 2023, followed by a $14 million Series A in July 2025, as reported by Tech.eu. Its investors include Air Street Capital and Entropy Industrial Capital. The company operates from Greece in part because of lower operational costs, and explicitly benchmarks itself against established players like BAE Systems and European AI defence peers like Helsing.</p>

<p>EFA Group represents the industrial end of the defence tech spectrum. In December 2025, it announced an €80 million share capital increase, introducing Motor Oil Group and EOS Capital Partners as new shareholders. The company reported an annual defence sector turnover of approximately €700 million, the majority generated through exports, with ambitions to exceed €1 billion. In early 2026, EFA Group established STHENOS AI, a dedicated AI subsidiary focused on C6ISR applications. The Antikythera Tech Campus in Koropi, near Athens, is set to open in 2026 as a hub for electronic warfare, space systems, software development, and unmanned platforms.</p>

<p>Greek City Times reported in February 2026 that European demand for Greek defence production has grown measurably as EU states seek to diversify supply chains and keep defence manufacturing within the continent.</p>

<p>For founders looking at this vertical in 2026, the macro timing is genuinely unusual. European rearmament is creating a demand pull that did not exist three years ago, and the availability of risk-tolerant capital, from dedicated defence VCs like Air Street Capital, Entropy, and HCVC, as well as domestic investors like Marathon Venture Capital, is higher than it has ever been.</p>

<h2>Agritech: A Large Natural Asset with a Thin Technology Layer</h2>

<p>Greece''s structural position in European agriculture is significant and underappreciated. It is one of the largest agricultural producers in the EU, dominant in olive oil, fresh vegetables, peaches, and strawberries. The surprise, and the opportunity, is how thin the technology layer on top of that agricultural base remains.</p>

<p>According to Tracxn, there are 85 AgriTech startups in Greece, of which 26 have received funding and just 2 have secured Series A or above. The official Elevate Greece government registry has 54 agri-food companies formally registered, employing 379 people, 5.2% of the total ecosystem by headcount.</p>

<p>An Economix.gr report from March 2025 quoted an ecosystem representative candidly: "despite the great value of the sector for Greece, there are not many startups." That is an honest diagnosis and it defines the opportunity.</p>

<p>The benchmark exit in this vertical remains Augmenta, a precision agriculture company that used deep learning for optimizing fertilizer, water, and seed application, acquired by CNH Industrial for $110 million, the largest agritech exit in Greek history and a proof point that globally competitive precision agriculture technology can be built and scaled from a Greek base.</p>

<p>Wikifarmer has taken a different path: a global B2B marketplace and knowledge platform connecting farmers and buyers in 17 languages, visited by more than 7 million farmers from over 220 countries, with $5.4 million raised including a 2024 venture debt round backed by Point Nine and Santander.</p>

<p>Terra Robotics, based near Athens, is developing AI-powered robotics for agricultural logistics environments and raised €1.55 million in 2023. Synfield provides precision agriculture platforms that use field sensors to monitor soil moisture, temperature, and conductivity in real time.</p>

<p>The forward-looking signal for this vertical comes from the Found.ation Investor Sentiment Survey 2026, which captures the views of the 18 active VC fund managers operating in Greece: they explicitly name agritech alongside AI and healthtech as their three priority investment sectors for 2026. Capital is getting ready to move into a vertical that currently has very few high-quality deployment targets, which is a description of a white space, not a failing.</p>

<h2>ClimateTech and Energy: Policy Infrastructure Running Ahead of Startups</h2>

<p>Greece''s cleantech opportunity in 2026 is fundamentally a policy story that is creating a commercial platform. The startup layer is still early, but the infrastructure being put in place is large enough to deserve the attention of any founder working at the intersection of energy, climate, and technology.</p>

<p>In March 2026, the European Commission approved a €400 million state aid scheme for Greece specifically to support strategic investments in clean technology production capacity, under the Clean Industrial Deal framework, a direct EU-mandated capital allocation to build Greek cleantech manufacturing capability.</p>

<p>According to the EIB Investment Survey 2025, 84% of Greek companies have already implemented carbon-reduction initiatives, an unusually high adoption rate that reflects both regulatory pressure and genuine corporate commitment.</p>

<p>The startup layer is led by WeatherXM, which has built a community-powered weather network that rewards IoT device owners for contributing hyperlocal weather data, processes it through AI models on AWS infrastructure, and sells precision weather intelligence to agriculture, renewable energy, and insurance customers. It has attracted investors including Protocol Labs, Juan Benet, and Placeholder, and raised €7.1 million. Brite Solar has raised €8.6 million to develop semi-transparent agrivoltaic solar panels that allow greenhouses and open-field crops to generate clean energy while reducing water consumption, a dual-use product sitting at the intersection of agritech and cleantech. Polygreen provides circular economy and waste-to-energy solutions with an international client base.</p>

<p>The cleantech vertical in Greece in 2026 is best understood not as a mature funding category but as a structural tailwind looking for companies to ride it. The EU''s Clean Industrial Deal, Greece''s 80% renewable energy target by 2030, and the country''s geographic position as a natural solar and wind energy hub create a long runway of policy demand and co-investment opportunity that reduces commercial risk for founders building here.</p>

<h2>What These Verticals Have in Common</h2>

<p>Looking across all seven sectors, two patterns stand out that are relevant for any founder or investor calibrating their engagement with the Athens ecosystem.</p>

<p>Every vertical with genuine traction has a structural natural advantage specific to Greece — the ship-owning concentration for maritime, the agricultural base for agritech, the geopolitical position for defence, the AI talent density that Sequoia and AWS have independently documented.</p>

<p>The companies that have broken through internationally are consistently those that built something harder to build anywhere else: Harbor Lab by embedding itself in the Piraeus shipping community, Augmenta by working with Greek farmers, Delian by benefiting from lower costs and proximity to NATO defence customers. The lesson is that Greece creates specific structural advantages in specific domains, and the founders who find and exploit those advantages are the ones who reach international scale.</p>

<p>The second pattern is that the gap between the quality of Greek technology talent and the volume of fundable companies is real and narrowing faster than the structures that support it. The 18 Greek VC fund managers surveyed by Found.ation in January 2026 gave the investment climate in 2025 a score of 3.42 out of 5, but gave ecosystem maturity only 2.68, conditions are improving faster than the infrastructure around them. That gap is exactly where venture studios, accelerators, and early-stage capital vehicles have the most leverage right now.</p>

<h2>Resources</h2>

<ol>
<li>Found.ation &amp; EIT Digital, "Startups in Greece: Venture Financing Report 2024–2025": <a href="https://thefoundation.gr/2024/12/12/startups-in-greece-venture-financing-report-2024-2025/" target="_blank">thefoundation.gr</a></li>
<li>Found.ation, "FWD Greece: Innovation Pulse 2025–2026 Report": <a href="https://ris3rcm.eu/en/fwd-greece-innovation-pulse-2025-2026-report/" target="_blank">ris3rcm.eu</a></li>
<li>The Recursive, "State of AI in CEE 2024": <a href="https://therecursive.com/the-recursive-s-state-of-ai-in-cee-2024-why-investors-founders-and-governments-have-allaisoncee/" target="_blank">therecursive.com</a></li>
<li>The Recursive, "Top Funding Rounds Raised by Greek Startups in 2025": <a href="https://therecursive.com/top-funding-rounds-raised-by-greek-startups-in-2025/" target="_blank">therecursive.com</a></li>
<li>PitchBook, "Hot or Not: Where European VC Funding Grew in 2025": <a href="https://pitchbook.com/news/articles/hot-or-not-where-european-vc-funding-grew-in-2025" target="_blank">pitchbook.com</a></li>
<li>Sequoia Capital Atlas, "Europe''s AI Engineering Hubs": <a href="https://atlas.sequoiacap.com/a-talented-home-for-ai/" target="_blank">atlas.sequoiacap.com</a></li>
<li>Union of Greek Shipowners, "UGS Annual Report 2024–2025": <a href="https://ugs.gr/en/press-releases/2025/press-release-20250801/" target="_blank">ugs.gr</a></li>
<li>Mordor Intelligence, "Greece E-Commerce Market Size, Forecast Report 2025–2030": <a href="https://mordorintelligence.com/industry-reports/greece-ecommerce-market" target="_blank">mordorintelligence.com</a></li>
<li>ResearchAndMarkets, "Greece Buy Now Pay Later Business and Investment Opportunity Report 2026": <a href="https://globenewswire.com/news-release/2026/02/04/3231845/28124/en/Greece-Buy-Now-Pay-Later-Business-and-Investment-Opportunity-Report-2026" target="_blank">globenewswire.com</a></li>
<li>ResearchAndMarkets, "Greece B2C Ecommerce Databook Report 2025": <a href="https://globenewswire.com/news-release/2026/01/29/3228297/28124/en/Greece-B2C-Ecommerce-Databook-Report-2025" target="_blank">globenewswire.com</a></li>
<li>TechCrunch, "Shipping Logistics Startup Harbor Lab Raises $16M Series A Led by Atomico": <a href="https://techcrunch.com/2024/05/15/shipping-logistics-startup-harbor-lab-raises-16m-series-a-led-by-atomico/" target="_blank">techcrunch.com</a></li>
<li>Tech.eu, "Greek Defence Tech Startup Founded by Apple Roboticist Raises $14M": <a href="https://tech.eu/2025/07/29/greek-defence-tech-startup-founded-by-apple-roboticist-raised-14m/" target="_blank">tech.eu</a></li>
<li>Army Recognition, "Greek Company EFA Group Raises €80 Million in New Funding": <a href="https://armyrecognition.com/news/army-news/2025/greek-company-efa-group-raises-80-million-in-new-funding-to-support-international-growth/" target="_blank">armyrecognition.com</a></li>
<li>AWS, "Greece: Unlocking Europe''s AI Potential" (2025 report): <a href="https://unlockingeuropesaipotential.com/greece" target="_blank">unlockingeuropesaipotential.com</a></li>
<li>Tech.eu, "Greece: From Resilience to Resurgence in Tech and Innovation": <a href="https://tech.eu/2025/08/06/greece-from-resilience-to-resurgence-in-tech-and-innovation/" target="_blank">tech.eu</a></li>
<li>World Economic Forum, "How Greece Is Transforming Its Power System With Innovation" (November 2025): <a href="https://weforum.org/stories/2025/11/how-greece-is-transforming-its-power-system-with-innovation-and-new-technologies/" target="_blank">weforum.org</a></li>
<li>Lawspot.gr, "European Commission: €400 Million for Greek Cleantech Industry Support" (March 2026): <a href="https://lawspot.gr/nomika-nea/komision-400-ekat-euro-gia-te-sterixe-tes-ellenikes-biomekhanias-sten-kathare-tekhnologia/" target="_blank">lawspot.gr</a></li>
<li>Thetius, "The 50 Most Innovative Startups and Scaleups in the Maritime Industry 2024": <a href="https://thetius.com/the-50-most-innovative-startups-and-scaleups-in-the-maritime-industry-2024/" target="_blank">thetius.com</a></li>
<li>Biotech Report, "2025: Shaping the Greek Biotech Sector of Tomorrow": <a href="https://assets.ctfassets.net/4qhc1xusequb/JoNnV4b8smbRO66LsvoIe/c78f1c8392dc8efad9ba96a48a9cef2a/Biotech_Report_13.2.pdf" target="_blank">ctfassets.net</a></li>
<li>Powergame.gr, "Where Greek Fund Managers Are Investing in 2026" (Found.ation Investor Sentiment Survey): <a href="https://powergame.gr/start-ups-digital/1264975/pou-pontaroun-ta-kefalaia-tous-to-2026-oi-ellines-fund-managers/" target="_blank">powergame.gr</a></li>
</ol>'
);
