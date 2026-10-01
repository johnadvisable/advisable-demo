-- This is a data update, using a trick: we wrap it as a function to run via migration
-- Update Senior Frontend Developer job listing content (English, language_id=1)
UPDATE public.job_listing_translations
SET 
  short_description = 'AI-first full-stack developer building web apps, mobile applications & API integrations across NUXT/Vue, NEXT/React, Rust, PHP and any technology required.',
  full_description = '<h2>About the Role</h2>
<p>We are looking for a <strong>Senior Frontend Developer</strong> who thrives in an AI-first development environment. You will lead the development of production-grade web applications, mobile apps, and API integrations using a diverse technology stack.</p>

<h2>Core Tech Stack</h2>
<ul>
<li><strong>NUXT / Vue.js</strong> — Server-side rendered & static applications</li>
<li><strong>NEXT.js / React</strong> — Dynamic web applications & dashboards</li>
<li><strong>Rust</strong> — High-performance systems & backend services</li>
<li><strong>PHP</strong> — Legacy system maintenance & integrations</li>
<li>Any additional technology as required — <strong>rapid adaptation is essential</strong></li>
</ul>

<h2>Scope of Work</h2>
<ul>
<li><strong>Web Development</strong> — Full-stack web applications from concept to deployment</li>
<li><strong>Mobile Applications</strong> — Cross-platform mobile app development</li>
<li><strong>API Connections</strong> — RESTful & GraphQL API design, integration with third-party services</li>
<li><strong>Backend Integration</strong> — Server-side logic, microservices, and database management</li>
<li><strong>DevOps</strong> — CI/CD pipelines, containerization, cloud infrastructure</li>
<li><strong>Database Management</strong> — SQL/NoSQL database design and optimization</li>
</ul>

<h2>AI-First Development (Mandatory)</h2>
<p>At Advisable, <strong>AI-assisted development is not optional — it is mandatory</strong>. You are expected to:</p>
<ul>
<li>Use AI coding agents (Claude Code, Cursor, etc.) as part of your daily workflow</li>
<li>Set up and manage AI Agents for automated task execution</li>
<li>Leverage AI tools to accelerate development, debugging, and code review</li>
<li>Continuously explore and adopt new AI development tools</li>
</ul>
<p>You will be provided with a <strong>Claude Code Premium Seat</strong> to maximize your productivity.</p>',
  requirements = '<ul>
<li>5+ years of professional frontend/full-stack development experience</li>
<li>Strong proficiency in <strong>NUXT/Vue.js</strong> and <strong>NEXT.js/React</strong></li>
<li>Working knowledge of <strong>Rust</strong> and <strong>PHP</strong></li>
<li>Ability to <strong>rapidly learn and adapt</strong> to any new technology stack as required by the project</li>
<li><strong>Mandatory:</strong> Proven experience with AI development tools (Claude Code, Cursor, Copilot, etc.)</li>
<li><strong>Mandatory:</strong> Experience setting up and using AI Agents for task automation</li>
<li>Experience with mobile application development (React Native, Flutter, or native)</li>
<li>Strong API design skills (REST, GraphQL)</li>
<li>Experience with cloud platforms (AWS, GCP, or Azure)</li>
<li>Excellent problem-solving skills and attention to detail</li>
<li>Strong communication skills in English (Greek is a plus)</li>
</ul>',
  benefits = '<ul>
<li><strong>Claude Code Premium Seat</strong> — Full access to AI-powered development tools</li>
<li>Competitive salary package</li>
<li>Remote-first work culture</li>
<li>Latest MacBook Pro and peripherals</li>
<li>Conference attendance budget</li>
<li>Health and dental insurance</li>
<li>Stock options for senior roles</li>
</ul>',
  updated_at = now()
WHERE job_listing_id = 'a1000001-0000-0000-0000-000000000002' AND language_id = 1;