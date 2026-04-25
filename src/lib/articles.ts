export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  categorySlug: string;
  categoryColor: 'blue' | 'amber' | 'red' | 'green';
  author: string;
  authorSlug: string;
  authorAvatar: string;
  authorBio: string;
  date: string;
  readTime: string;
  image: string;
  imageAlt: string;
  imageCaption?: string;
  tags: string[];
  featured?: boolean;
  trending?: boolean;
  content: string;
}

export const articles: Article[] = [
{
  id: '1',
  slug: 'only-20-percent-companies-winning-ai-race-pwc-study',
  title: 'Only 20% of Companies Are Winning the AI Race — PwC Study Reveals a Massive Gap',
  excerpt: 'A new PwC study shows 74% of AI\'s economic value is captured by just 20% of companies. Here\'s what separates the winners from the rest.',
  category: 'AI & Tech',
  categorySlug: 'ai-tech',
  categoryColor: 'blue',
  author: 'DailyByteNews',
  authorSlug: 'dailybytenews',
  authorAvatar: '/assets/images/app_logo.png',
  authorBio: 'Covering the latest in AI, technology, and business — built for the modern Indian tech reader.',
  date: 'April 24, 2026',
  readTime: '6 min read',
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_19f8fe7fc-1772547120162.png",
  imageAlt: 'Abstract AI neural network visualization with glowing blue nodes on dark background',
  imageCaption: 'The AI capability gap between companies is widening faster than most executives realize.',
  tags: ['AI', 'PwC', 'Enterprise', 'Strategy', 'Machine Learning'],
  featured: true,
  trending: true,
  content: `
<p>A landmark study by PwC has laid bare one of the most consequential divides in modern business: the gap between companies that are genuinely extracting value from artificial intelligence — and those that are not.</p>

<p>The report, which surveyed over 4,000 executives across 30 countries, found that a mere 20% of companies are capturing 74% of all AI-driven economic value globally. The remaining 80% are either still experimenting, stuck in proof-of-concept purgatory, or deploying AI in ways that don't meaningfully move the needle.</p>

<h2>What the Winners Are Doing Differently</h2>

<p>PwC's research identifies what it calls "AI Frontrunners" — companies that have embedded AI into their core business processes, not just bolted it on as a productivity tool. These organizations share three distinct characteristics:</p>

<blockquote>
"The companies winning with AI aren't just buying more tools. They're fundamentally rewiring how decisions get made, how products are built, and how customers are served." — PwC Global AI Lead, Sunita Mehta
</blockquote>

<p>First, Frontrunners have strong data foundations. While 67% of laggard companies report data quality as their primary AI obstacle, Frontrunners invested in data infrastructure 2-3 years before AI became mainstream. They built data pipelines, governance frameworks, and clean data lakes — the unglamorous work that now pays dividends.</p>

<h2>The Talent Equation</h2>

<p>The study also highlights a stark talent gap. Frontrunner companies employ 3.4x more AI-specialized talent per 1,000 employees than their peers. More importantly, they've created hybrid roles — "AI translators" who bridge technical capability and business strategy.</p>

<p>India-based companies are notably represented in the Frontrunner category, particularly in financial services and IT services sectors. Firms like Infosys, TCS, and several fintech startups have built proprietary AI platforms that are now being licensed to global clients.</p>

<h2>The Cost of Waiting</h2>

<p>For the 80% of companies still in the catch-up phase, the news is sobering. PwC estimates the productivity gap between AI leaders and laggards will reach 25% by 2028. In capital-intensive industries like manufacturing and logistics, that gap could be existential.</p>

<p>The report recommends companies focus on three immediate actions: appoint a dedicated AI governance lead, identify two or three high-value use cases to go deep on, and invest in data quality before buying more AI software.</p>
    `
},
{
  id: '2',
  slug: 'anthropic-mcp-97-million-installs-ai-developer',
  title: "Anthropic's MCP Crosses 97 Million Installs — Why Every AI Developer Should Care",
  excerpt: "The Model Context Protocol is becoming the USB port of AI agents. With 97M installs and growing, MCP is quietly reshaping how AI tools talk to each other.",
  category: 'AI & Tech',
  categorySlug: 'ai-tech',
  categoryColor: 'blue',
  author: 'DailyByteNews',
  authorSlug: 'dailybytenews',
  authorAvatar: '/assets/images/app_logo.png',
  authorBio: 'Covering the latest in AI, technology, and business — built for the modern Indian tech reader.',
  date: 'April 23, 2026',
  readTime: '5 min read',
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_1357af5e8-1772093361646.png",
  imageAlt: 'Developer working on laptop with code editor showing AI integration code, clean desk setup',
  imageCaption: 'MCP is becoming the de facto standard for AI tool interoperability.',
  tags: ['Anthropic', 'MCP', 'AI Agents', 'Developer Tools', 'Open Source'],
  featured: false,
  trending: true,
  content: `
<p>When Anthropic quietly released the Model Context Protocol (MCP) in late 2024, most developers shrugged. Another protocol, another standard — the graveyard of tech is littered with "universal" solutions that never caught on.</p>

<p>Eighteen months later, MCP has crossed 97 million installs. It's integrated into VS Code, Cursor, Replit, and dozens of enterprise tools. And it's starting to look less like a niche developer utility and more like critical infrastructure for the AI era.</p>

<h2>What MCP Actually Does</h2>

<p>The Model Context Protocol is, at its core, a standardized way for AI models to connect to external tools and data sources. Think of it as the USB standard for AI agents. Before MCP, every AI tool that needed to read files, query databases, or call APIs had to build its own custom integration layer.</p>

<blockquote>
"MCP is to AI agents what HTTP was to the web — the boring plumbing that makes everything else possible." — Simon Willison, software developer and AI researcher
</blockquote>

<p>With MCP, a developer builds one connector, and any MCP-compatible AI model can use it. The protocol handles authentication, context windowing, and response formatting in a standardized way.</p>

<h2>The Network Effect Is Real</h2>

<p>The 97 million install figure matters because of what it signals about network effects. At this scale, new AI tools are essentially forced to support MCP to be taken seriously by developers. The protocol has achieved the critical mass needed to become self-reinforcing.</p>

<p>Major cloud providers are paying attention. AWS announced native MCP support in Bedrock last month. Google Cloud is expected to follow. Microsoft's Copilot Studio already supports MCP connectors.</p>

<h2>What This Means for Indian Developers</h2>

<p>For the large developer community in India — estimated at 5.8 million and growing — MCP opens significant opportunities. Building MCP-compatible tools for Indian enterprise use cases (GST integrations, UPI connectors, regional language models) is a relatively untapped market with real commercial potential.</p>
    `
},
{
  id: '3',
  slug: 'openai-25-billion-revenue-ipo-ai-money-race',
  title: "OpenAI Hits $25 Billion Revenue, Eyes IPO — The AI Money Race Is Real",
  excerpt: "OpenAI surpasses $25B in annualized revenue while Anthropic approaches $19B. The AI money race is accelerating — and the IPO window may open sooner than expected.",
  category: 'Business & Markets',
  categorySlug: 'business',
  categoryColor: 'green',
  author: 'DailyByteNews',
  authorSlug: 'dailybytenews',
  authorAvatar: '/assets/images/app_logo.png',
  authorBio: 'Covering the latest in AI, technology, and business — built for the modern Indian tech reader.',
  date: 'April 22, 2026',
  readTime: '7 min read',
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_1ad6af61a-1772387259106.png",
  imageAlt: 'Stock market trading floor with digital displays showing green upward trending charts and financial data',
  imageCaption: 'OpenAI\'s revenue trajectory has outpaced even the most optimistic analyst forecasts from two years ago.',
  tags: ['OpenAI', 'IPO', 'Anthropic', 'AI Revenue', 'Venture Capital', 'Markets'],
  featured: false,
  trending: true,
  content: `
<p>OpenAI has crossed $25 billion in annualized revenue, according to sources familiar with the company's financials — a milestone that would have seemed implausible two years ago when the company was still primarily known for ChatGPT's viral consumer launch.</p>

<p>The figure puts OpenAI firmly in the upper echelon of enterprise software companies. For context, Salesforce took 20 years to reach $25B in annual revenue. OpenAI has done it in roughly four years since commercializing its models.</p>

<h2>Anthropic Is Right Behind</h2>

<p>The competitive picture is equally striking. Anthropic, which raised $4B from Amazon and $2B from Google, is approaching $19B in annualized revenue. The company's Claude models have found strong enterprise adoption, particularly in legal, healthcare, and financial services.</p>

<blockquote>
"We're seeing something genuinely unprecedented — two companies in the same sector both growing at triple-digit rates simultaneously. The total addressable market must be enormous." — Vikram Sood, Partner at Sequoia India
</blockquote>

<p>The revenue gap between the two is narrowing. Anthropic's growth rate has exceeded OpenAI's in three of the last four quarters, suggesting the market for AI is large enough to support multiple dominant players.</p>

<h2>The IPO Question</h2>

<p>OpenAI's board is reportedly discussing an IPO timeline, with a potential 2027 listing being floated internally. The company converted from a non-profit structure to a public benefit corporation in late 2025, clearing a key structural hurdle.</p>

<p>For Indian investors and tech professionals, the implications are significant. Indian IT companies that have built OpenAI and Anthropic integrations into their service offerings are watching the IPO closely — a public listing would provide price discovery on the models that have become central to their business.</p>
    `
},
{
  id: '4',
  slug: 'chatgpt-claude-catch-doctors-mistakes-save-mothers-life',
  title: "This Man Used ChatGPT and Claude to Catch Doctors' Mistakes and Save His Mother's Life",
  excerpt: "Pratik Desai built an AI workflow that caught critical misdiagnoses across three hospitals. His story is reshaping how patients and families think about AI in healthcare.",
  category: 'Trending',
  categorySlug: 'trending',
  categoryColor: 'amber',
  author: 'DailyByteNews',
  authorSlug: 'dailybytenews',
  authorAvatar: '/assets/images/app_logo.png',
  authorBio: 'Covering the latest in AI, technology, and business — built for the modern Indian tech reader.',
  date: 'April 21, 2026',
  readTime: '8 min read',
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_1d26b3c11-1772096873757.png",
  imageAlt: 'Doctor reviewing patient medical records on tablet in hospital corridor, soft clinical lighting',
  imageCaption: 'AI-assisted medical second opinions are emerging as a critical patient safety tool.',
  tags: ['AI Healthcare', 'ChatGPT', 'Claude', 'Medical AI', 'Patient Safety'],
  featured: false,
  trending: true,
  content: `
<p>When Pratik Desai's mother was admitted to a hospital in Pune with severe abdominal pain, the diagnosis came back as acute appendicitis. Surgery was scheduled for the following morning. Something didn't feel right to Pratik — a software engineer by training with no medical background — so he did what engineers do: he built a system to check.</p>

<p>Using a combination of ChatGPT-4o and Claude 3.5 Sonnet, Pratik fed in his mother's complete medical history, lab results, imaging reports, and symptom timeline. The AI flagged something the attending physician had not: the symptom pattern was more consistent with a rare presentation of ovarian torsion, a condition that requires different, urgent surgical intervention.</p>

<h2>Three Hospitals, Three Near-Misses</h2>

<p>Pratik's mother was transferred to a specialist. The diagnosis was confirmed. The appendix was fine. What followed was emergency surgery for the correct condition — one that, left untreated, can cause permanent damage within hours.</p>

<blockquote>
"I'm not saying the doctors were bad. They were working with incomplete information under time pressure. The AI had the luxury of time and perfect recall. It caught what humans missed." — Pratik Desai
</blockquote>

<p>Over the next three weeks, as his mother recovered and was moved between facilities for follow-up care, Pratik ran the same AI-assisted review process on every new diagnosis and prescription. He caught two additional potential errors — a drug interaction that had been overlooked, and an incorrect dosage on a post-operative medication.</p>

<h2>The Workflow He Built</h2>

<p>Pratik has since documented his process in a detailed GitHub repository that has received over 12,000 stars in two weeks. The workflow involves structured prompting across multiple AI models, cross-referencing outputs, and a checklist for when to escalate concerns to medical professionals.</p>

<p>The story has struck a chord particularly in India, where doctor-patient ratios remain challenging and patients often lack the resources to seek multiple specialist opinions. AI, in this framing, becomes a form of medical equity — giving ordinary families access to a level of analytical rigor previously reserved for those who could afford it.</p>
    `
},
{
  id: '5',
  slug: '5-things-trending-tech-today-april-2026',
  title: '5 Things Trending in Tech Today — April 14, 2026',
  excerpt: "Atlassian cuts 1,600 jobs for AI pivot, TSMC posts record growth, Google's Gemini Ultra gets a multimodal upgrade, and more in today's tech roundup.",
  category: 'Trending',
  categorySlug: 'trending',
  categoryColor: 'amber',
  author: 'DailyByteNews',
  authorSlug: 'dailybytenews',
  authorAvatar: '/assets/images/app_logo.png',
  authorBio: 'Covering the latest in AI, technology, and business — built for the modern Indian tech reader.',
  date: 'April 14, 2026',
  readTime: '4 min read',
  image: "https://images.unsplash.com/photo-1663355176396-31843c79e396",
  imageAlt: 'Glowing circuit board macro photography with blue and green light trails, technology concept',
  imageCaption: 'The tech landscape is shifting faster than ever — here\'s what moved the needle today.',
  tags: ['Atlassian', 'TSMC', 'Google', 'Gemini', 'Tech News', 'Roundup'],
  featured: false,
  trending: false,
  content: `
<p>Every weekday, we cut through the noise and surface the five tech developments actually worth your attention. Here's what's moving in tech today.</p>

<h2>1. Atlassian Cuts 1,600 Jobs in AI-Driven Restructuring</h2>

<p>Atlassian announced it's laying off approximately 1,600 employees — roughly 9% of its workforce — as part of what CEO Mike Cannon-Brookes called an "AI-first reorganization." The company said it will redeploy investment into AI-powered versions of Jira, Confluence, and its Rovo AI assistant.</p>

<p>The move follows similar restructurings at Salesforce, SAP, and Workday, all of which have cited AI automation as justification for workforce reductions while simultaneously growing headcount in AI-specific roles.</p>

<h2>2. TSMC Posts Record Q1 Revenue on AI Chip Demand</h2>

<p>Taiwan Semiconductor Manufacturing Company reported Q1 2026 revenue of NT$839 billion (approximately $26B USD), a 42% year-over-year increase. Advanced 3nm and 2nm chips — primarily destined for Nvidia, Apple, and AMD — drove the bulk of growth.</p>

<blockquote>
"Demand for AI-related chips continues to exceed our most optimistic internal projections. We are expanding capacity as fast as physically possible." — TSMC CFO Wendell Huang
</blockquote>

<h2>3. Google Releases Gemini Ultra 2.0 with Native Video Understanding</h2>

<p>Google's flagship Gemini Ultra model received a significant update, adding native real-time video analysis capabilities. The model can now process 90 minutes of video in a single context window — a significant jump from the previous 30-minute limit.</p>

<h2>4. EU Passes Mandatory AI Transparency Labels for Consumer Products</h2>

<p>The European Parliament voted 412-89 to require all AI-generated or AI-assisted consumer content to carry standardized disclosure labels by January 2027. The regulation applies to advertising, news articles, social media posts, and product recommendations.</p>

<h2>5. India's UPI Hits 18 Billion Monthly Transactions</h2>

<p>The National Payments Corporation of India reported that UPI processed 18.3 billion transactions in March 2026, a new record. The milestone cements UPI's position as the world's largest real-time payment system by transaction volume, surpassing China's WeChat Pay and Alipay combined.</p>
    `
}];


export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}

export function getArticlesByCategory(categorySlug: string): Article[] {
  return articles.filter((a) => a.categorySlug === categorySlug);
}

export function getFeaturedArticle(): Article {
  return articles.find((a) => a.featured) || articles[0];
}

export function getTrendingArticles(): Article[] {
  return articles.filter((a) => a.trending).slice(0, 5);
}

export function getLatestArticles(count?: number): Article[] {
  const sorted = [...articles].sort((a, b) => b.id.localeCompare(a.id));
  return count ? sorted.slice(0, count) : sorted;
}

export const categories = [
{ name: 'AI & Tech', slug: 'ai-tech', description: 'Artificial intelligence, machine learning, developer tools, and the technology shaping tomorrow.', color: 'blue' as const },
{ name: 'Business & Markets', slug: 'business', description: 'Startup funding, IPOs, market moves, and the business side of the tech industry.', color: 'green' as const },
{ name: 'Trending', slug: 'trending', description: 'The stories everyone is talking about — viral, impactful, and worth your attention.', color: 'amber' as const },
{ name: 'Explainers', slug: 'explainers', description: 'Complex topics made clear. Deep dives into the ideas and technologies that matter.', color: 'blue' as const },
{ name: 'Opinion', slug: 'opinion', description: 'Perspectives from technologists, entrepreneurs, and analysts on where tech is headed.', color: 'amber' as const }];