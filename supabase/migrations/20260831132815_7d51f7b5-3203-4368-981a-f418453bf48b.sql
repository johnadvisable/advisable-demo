INSERT INTO public.insights (slug, published_date, featured_image, category, author, type)
VALUES (
  'greek-venture-capital-funds-first-time-founders-guide',
  CURRENT_DATE,
  'https://difvvdmelbtjxxvpjuvw.supabase.co/storage/v1/object/public/blog-images/insights/greek-venture-capital-funds-guide.jpg',
  'startups-venture-studio',
  'Advisable Team',
  'article'
)
ON CONFLICT (slug) DO UPDATE SET featured_image = EXCLUDED.featured_image;

INSERT INTO public.insights_translations (insights_id, language_id, title, excerpt, content)
SELECT i.id, 1,
'Greek Venture Capital Funds: A First-Time Founder''s Guide',
'Which Greek VC fund fits your stage, sector and cheque size. A practical map of Marathon, VentureFriends, Big Pi, Phaistos, Metavallon, Uni.Fund, Velocity.Partners, Genesis, Apeiron and Loggerhead, plus how to build a focused shortlist.',
$html$<p><strong>TL;DR:</strong> The right Greek VC fund depends on stage, sector, geography, and cheque size. Marathon Venture Capital and VentureFriends are broad early-stage options; Metavallon, Uni.Fund, Genesis Ventures, Velocity.Partners, Apeiron Ventures, and Loggerhead Ventures are more specialised pre-seed and seed possibilities; Big Pi is particularly relevant for deep-tech and scale-up financing; and Phaistos is focused on 5G-related infrastructure. Greece has a compact but growing ecosystem, and the strongest approach is to build a focused shortlist rather than send the same pitch to every fund.</p>

<h2>Greece's venture capital ecosystem</h2>

<p>The latest Found.ation and EIT Digital report linked in this guide counted 16 VC funds actively investing in Greek startups and reported more than &euro;555 million invested in over 90 Greek startups in 2024. Newer 2025&ndash;2026 directories list approximately 18 active or emerging vehicles, depending on whether they include newer managers, specialised funds, and co-investment structures. The most accurate description is therefore a compact and growing ecosystem of roughly 16&ndash;18 relevant funds and vehicles, not one definitive census.</p>

<p>That distinction matters because a fund list can combine conventional VC funds with research-commercialisation vehicles, state-backed programmes, angel co-investment funds, and growth investors. They do not have the same mandate, ownership model, decision process, or cheque size.</p>

<h2>How founders should evaluate a Greek VC fund</h2>

<p>Start with fit rather than fame. Compare your stage, first-cheque requirement, sector, geography, technical maturity, and the fund's willingness to lead or co-invest. A pre-seed university spinout should not approach a growth fund with a &euro;7&ndash;20 million ticket, while a revenue-generating scale-up should not assume that a pre-seed fund can lead its next round.</p>

<h2>The funding stages founders need to understand</h2>

<p>Pre-seed capital is usually used to validate the problem, build the first product, recruit a founding team, or turn research into a company. Investors at this stage are often comfortable with limited revenue, but they still need evidence that the founders understand the market and can reach a meaningful next milestone. Seed capital is generally used to prove repeatable demand, build the core team, and establish an initial go-to-market motion. The label is not universal: one fund's seed round can be another fund's pre-seed, so the ticket size and decision criteria matter more than the name of the round.</p>

<p>Growth capital is different again. It is intended for companies with revenue, an established product, and a credible path to scale. Growth investors may lead much larger rounds, expect more formal reporting, and assess unit economics, retention, sales efficiency, and governance in greater detail. This is why a fund can be highly relevant to the Greek ecosystem but still be the wrong investor for a company that has not yet reached product-market fit.</p>

<h2>What Greek investors typically look for</h2>

<p>Greek VC funds often invest in companies with a clear connection to the country, but that connection can take several forms: Greek founders building abroad, a Greek R&amp;D base, a university spinout, local market validation, or a team using the Greek talent and diaspora networks to expand internationally. Founders should state that connection clearly instead of assuming the investor will infer it from the company's address.</p>

<p>Sector fit is equally important. Greece has visible activity in software, fintech, digital health, agritech, maritime technology, robotics, energy, and deep tech. A fund's portfolio can reveal more than its homepage: look at the stage of its most recent investments, the geography of its current companies, and whether it repeatedly leads rounds or participates alongside another lead investor.</p>

<h2>Leading Greek VC funds with recent capital</h2>

<h3>Marathon Venture Capital</h3>

<p><strong>Best fit:</strong> Greek-connected seed companies in B2B software, infrastructure, cybersecurity, AI, robotics, agritech, and defence technology.</p>

<p>Marathon closed its third fund at &euro;75 million in 2025 and describes itself as a seed investor that leads rounds and supports companies through later stages. Its official site also publishes founder resources, including term-sheet and funding materials. It is a strong first conversation for a Greek-connected team with technical depth and international ambition.</p>

<p><strong>Official profile:</strong> <a href="https://marathon.vc/" target="_blank" rel="noopener noreferrer">Marathon Venture Capital</a></p>

<h3>Big Pi Ventures</h3>

<p><strong>Best fit:</strong> Deep tech and early-stage companies, plus European scale-ups seeking growth capital.</p>

<p>Big Pi announced the first closing of Big Pi Growth I at &euro;130 million in June 2025, with a &euro;200 million target and &euro;7&ndash;20+ million lead tickets. That growth vehicle is aimed at companies with meaningful revenue and scale-up potential, not ordinary day-one startups. Its early-stage platform is more relevant to companies with defensible intellectual property in deep tech, AI, biotech, or digital health.</p>

<p><strong>Official profile:</strong> <a href="https://bigpi.vc/blog/big-pi-growth-i-the-first-tech-growth-equity-fund-out-of-southeast-europe/" target="_blank" rel="noopener noreferrer">Big Pi Ventures</a></p>

<h3>VentureFriends</h3>

<p><strong>Best fit:</strong> Pre-seed and seed founders building marketplaces, fintech, proptech, SaaS, consumer, and travel businesses across Europe and MENA.</p>

<p>VentureFriends states that it invests at pre-seed and seed, writes first tickets of &euro;500,000&ndash;&euro;3 million, and has raised four funds with more than &euro;300 million in assets under management. It is relevant for founders who need an early investor with a broad network and follow-on capacity.</p>

<p><strong>Official profile:</strong> <a href="https://www.venturefriends.vc/" target="_blank" rel="noopener noreferrer">VentureFriends</a></p>

<h3>Phaistos Investment Fund / 5G Ventures</h3>

<p><strong>Best fit:</strong> 5G, connectivity, IoT, space technology, and related infrastructure.</p>

<p>Phaistos is a specialised, state-backed vehicle managed by 5G Ventures. It is not a general-purpose seed fund for every Greek software startup. It becomes relevant when the product depends on 5G-enabled infrastructure or adjacent deep technology, and when co-investment or a sector-specific mandate is appropriate.</p>

<p><strong>Official profile:</strong> <a href="https://www.5gventures.gr/" target="_blank" rel="noopener noreferrer">Phaistos Investment Fund / 5G Ventures</a></p>

<h2>Seed and deep-tech funds for first-time founders</h2>

<p>For very early founders, the most realistic first conversations are usually with funds whose mandate explicitly covers pre-seed or seed and whose first cheque matches the company's financing need. The following funds are more specialised than the headline names, but may offer a better fit.</p>

<h3>Metavallon VC</h3>

<p><strong>Best fit:</strong> Deep tech, B2B, AI, robotics, energy, transportation, space, and fintech.</p>

<p>Metavallon invests from pre-seed to seed+ and is especially relevant for technical founders with meaningful Greek R&amp;D activity.</p>

<p>Official profile: <a href="https://metavallon.vc/" target="_blank" rel="noopener noreferrer">Metavallon VC</a></p>

<h3>Uni.Fund</h3>

<p><strong>Best fit:</strong> University and research spinouts.</p>

<p>Uni.Fund was created through the EquiFund platform and is designed for technical or academic teams that need capital and commercialisation support.</p>

<p>Official profile: <a href="https://gr.linkedin.com/company/unifundmakeithappen" target="_blank" rel="noopener noreferrer">Uni.Fund</a></p>

<h3>Velocity.Partners</h3>

<p><strong>Best fit:</strong> Pre-seed and seed technology companies with Greek market validation and global ambition.</p>

<p>Velocity.Partners is relevant when a founder can show early customer evidence and a credible international path.</p>

<p>Official profile: <a href="https://www.linkedin.com/company/velocity-partners-vc" target="_blank" rel="noopener noreferrer">Velocity.Partners</a></p>

<h3>Genesis Ventures</h3>

<p><strong>Best fit:</strong> Very early companies seeking angel co-investment, coaching, and hands-on support.</p>

<p>Its reported ticket range is roughly &euro;100,000&ndash;&euro;400,000, making it a possible fit before a conventional seed round.</p>

<p>Official profile: <a href="https://www.genesis-ventures.vc/" target="_blank" rel="noopener noreferrer">Genesis Ventures</a></p>

<h3>Apeiron Ventures</h3>

<p><strong>Best fit:</strong> Early-stage B2B software and companies connected to the Greek ecosystem or diaspora.</p>

<p>Because it is a newer manager, founders should verify its current mandate and contact channels before relying on older directories.</p>

<p>Official profile: <a href="https://www.failory.com/blog/venture-capital-firms-greece" target="_blank" rel="noopener noreferrer">Apeiron Ventures</a></p>

<h3>Loggerhead Ventures</h3>

<p><strong>Best fit:</strong> Seed and early-stage climate, cleantech, and deep-tech startups, especially with a northern Greece connection.</p>

<p>Loggerhead is worth investigating for founders whose technology and environmental orientation match its mandate. Verify its current investment activity before outreach.</p>

<p>Official profile: <a href="https://www.ris3rcm.eu/en/investors/" target="_blank" rel="noopener noreferrer">Loggerhead Ventures</a></p>

<h2>HDBI and the institutional capital behind Greek VC</h2>

<p>The Hellenic Development Bank of Investments, or HDBI, is a Greek state-backed fund-of-funds institution. It generally supports VC managers and investment vehicles rather than acting like a standard seed fund that founders pitch directly. HDBI participation can indicate institutional backing, but it does not guarantee a fund's performance, investment speed, or long-term availability. Founders should still evaluate the actual VC manager, its partners, decision process, portfolio conflicts, and follow-on policy.</p>

<p><strong>Official profile:</strong> <a href="https://hdbi.gr/en/" target="_blank" rel="noopener noreferrer">HDBI</a></p>

<h2>The wider Greek investment roster</h2>

<p>The broader active roster includes Corallia Ventures, iGrow, Forthtech, TECS Capital, Evercurious, L-Stone Capital, Untethered Ventures, and Sporos Platform. These names cover research commercialisation, deep tech, climate and circular economy, and newer technology-focused strategies. Their public information is less uniform, so the article should not imply that every vehicle has the same level of current activity or the same accessibility to first-time founders.</p>

<p>Older lists may also mention Starttech Ventures, the Northern Greece Investment Fund, Attica Ventures, or Elikonos Capital. Treat those as leads for further research, not as proof that a fund is currently deploying into companies at your stage.</p>

<h2>Preparing and sending a first VC approach</h2>

<p>Start with a targeted shortlist of five to eight investors whose stage, sector, geography, and cheque size match the company. The first message should answer four questions immediately: what problem the company solves, what evidence of demand exists, how much capital is being raised, and why this particular fund is a credible partner. A warm introduction from a portfolio founder can help, but a clear direct approach is still valid when the fund publishes an open contact channel or application process.</p>

<p>Founders should verify the fund's current website, portfolio, investment stage, and team before sending a pitch. Fund mandates, ticket sizes, and contact channels change. This guide reduces search time; it does not replace final verification.</p>

<h2>Bottom line</h2>

<p>Greek venture capital is deeper than its best-known names, but it is not one homogeneous market. Marathon and VentureFriends are broad early-stage options; Metavallon, Uni.Fund, Genesis Ventures, Velocity.Partners, Apeiron, and Loggerhead are more useful when the founder's stage or sector matches their specific mandate; Big Pi is relevant for deep-tech and scale-up financing; and Phaistos is a specialist option for 5G-related businesses. The best fund is the one whose current mandate matches your company&mdash;not the one with the biggest headline fund size.</p>

<h2>Sources and verification notes</h2>

<ol>
<li><a href="https://thefoundation.gr/2024/12/12/startups-in-greece-venture-financing-report-2024-2025/" target="_blank" rel="noopener noreferrer">Found.ation: Startups in Greece: Venture Financing Report 2024&ndash;2025</a></li>
<li><a href="https://marathon.vc/" target="_blank" rel="noopener noreferrer">Marathon Venture Capital</a></li>
<li><a href="https://bigpi.vc/blog/big-pi-growth-i-the-first-tech-growth-equity-fund-out-of-southeast-europe/" target="_blank" rel="noopener noreferrer">Big Pi: Launching Big Pi Growth I</a></li>
<li><a href="https://www.venturefriends.vc/" target="_blank" rel="noopener noreferrer">VentureFriends</a></li>
<li><a href="https://hdbi.gr/en/" target="_blank" rel="noopener noreferrer">HDBI</a></li>
<li><a href="https://www.ris3rcm.eu/en/investors/" target="_blank" rel="noopener noreferrer">RIS3 investor directory</a></li>
<li><a href="https://radar.gr/article/ellinikes-startups-2026-ta-nea-funds-ta-freska-kefalaia-kai-oi-ependyseis-pou-erchontai" target="_blank" rel="noopener noreferrer">Radar.gr: Greek startups and new funds</a></li>
</ol>$html$
FROM public.insights i
WHERE i.slug = 'greek-venture-capital-funds-first-time-founders-guide'
ON CONFLICT DO NOTHING;