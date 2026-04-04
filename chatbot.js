/* ============================================
   Portfolio Chatbot - Mario
   Calls Cloudflare Worker proxy (keys hidden)
   Falls back to offline TF-IDF if proxy is down
   ============================================ */

// ── Worker Proxy URL ──
// CHANGE THIS after deploying your Cloudflare Worker
var WORKER_URL = 'https://jugal-portfolio-chatbot.812jugalgajjar.workers.dev';

// ── Chat history ──
var chatMessages = [];

// ── Call Worker Proxy ──
async function callWorker(userMessage) {
  chatMessages.push({ role: 'user', content: userMessage });

  try {
    var response = await fetch(WORKER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: chatMessages.slice(-10) })
    });

    if (response.ok) {
      var data = await response.json();
      if (data.answer) {
        chatMessages.push({ role: 'assistant', content: data.answer });
        return data.answer;
      }
    }

    // Worker failed - fall through to fallback
    return null;

  } catch (e) {
    return null;
  }
}

// ── Offline TF-IDF Fallback ──
var CHUNKS = [
  // ── Identity & Bio ──
  { id:'bio', text:'Jugal Gajjar is a graduate student at The George Washington University working on reasoning-centric AI systems. His research focuses on Large Language Models (LLMs), trustworthy and explainable AI, and AI for code intelligence and security.', keywords:'who jugal about person bio introduction researcher' },
  { id:'research_focus', text:'Jugal research focuses on faithfulness and interpretability of LLMs, structured reasoning with attribution, reinforcement learning for adaptive retrieval, and AI for software security. He builds systems that reason transparently and reliably in real-world settings.', keywords:'research interest focus area topic explainable trustworthy faithful' },
  // ── Education ──
  { id:'ms', text:'Jugal is pursuing M.S. in Computer Science (Machine Intelligence and Cognition) at The George Washington University Washington D.C. GPA 3.88/4.0 expected 2026.', keywords:'masters graduate gwu george washington university education degree gpa' },
  { id:'btech', text:'Jugal earned B.Tech in Computer Science and Engineering from Navrachana University Vadodara India CGPA 9.39/10 graduated 2024.', keywords:'bachelors btech undergraduate navrachana india education college cgpa' },
  // ── Thesis ──
  { id:'thesis', text:'Jugal master\'s thesis is titled "AI That Detects, Validates, and Repairs: A Cross-Language Autonomous Vulnerability Lifecycle Framework" advised by Prof. Shi Feng at GWU. It presents a unified framework combining detection, execution-based validation, and iterative remediation using Universal AST normalization and hybrid LLM plus symbolic reasoning across Java, Python, and C++. Achieves 89.84-92.02% detection accuracy, 66-71% validation, 81-87% remediation success.', keywords:'thesis dissertation research autonomous vulnerability lifecycle cross-language detection repair advisor' },
  // ── Experience ──
  { id:'ga', text:'Graduate Assistant at The George Washington University September 2025 to December 2025. Supported Big Data and Analytics course CSCI 4907/6444. Guided students on Hadoop, Spark, AWS S3, Python, Java, Linux, machine learning, and cloud-based distributed systems.', keywords:'graduate assistant work job experience gwu big data analytics hadoop spark' },
  { id:'ta', text:'Teaching Assistant at Navrachana University January 2024 to May 2024. Mentored 80+ undergraduate students through code review, grading, and structured feedback on 750+ lab reports. Focused on test-driven development, code quality, documentation, and debugging.', keywords:'teaching assistant work experience india navrachana software testing' },
  { id:'freelance', text:'Freelance Developer for Shubhlaxmi Manufacturing Summer 2023. Built Python-based billing system with Tkinter and Pandas integrating Excel automation. Increased billing and bookkeeping efficiency by 50%.', keywords:'freelance developer work experience billing python tkinter' },
  { id:'nvidia', text:'NVIDIA Jetson AI Project Coordinator at Navrachana University March to June 2022. Conducted workshops on computer vision and NLP using Jetson Nano for embedded AI and real-time inference. Mentored 5+ student projects selected by NVIDIA Deep Learning Institute.', keywords:'nvidia jetson coordinator work experience deep learning edge ai' },
  // ── Projects ──
  { id:'rsat', text:'RSAT is a structured attribution framework for training small LLMs to generate step-by-step table reasoning with cell-level citations. Uses a two-phase SFT plus GRPO pipeline with composite rewards. Improves attribution faithfulness 3.7x. Technologies: LLMs, Reinforcement Learning GRPO, NLP, Attribution.', keywords:'rsat structured attribution reasoning citation faithful table llm grpo project' },
  { id:'researchvault', text:'ResearchVault is a full-stack institutional research repository inspired by CERN InvenioRDM. Supports record management, full-text search, versioning, and DOI-style IDs with scalable backend and search infrastructure. Technologies: Flask, React, PostgreSQL, OpenSearch, Docker.', keywords:'researchvault repository research record search doi project' },
  { id:'fass', text:'FASS (Feature Attribution Stability Suite) is a benchmark for evaluating post-hoc attribution stability under prediction-invariant perturbations. Introduces a three-axis stability framework for robust comparison of XAI methods including Grad-CAM, IG, GradientSHAP, LIME. Technologies: Explainable AI, Computer Vision, Evaluation Metrics.', keywords:'fass feature attribution stability xai explainable perturbation benchmark project cvpr' },
  { id:'adaptive_rag', text:'Adaptive RAG is a reinforcement learning-based retrieval framework that learns when and how much to retrieve by modeling RAG as a Markov Decision Process. Achieves 3.2-6.5% higher accuracy while reducing retrievals by 14-37% across 7 models on 9 QA datasets. Technologies: LLMs, RAG, Deep Q-Learning, RL, NLP.', keywords:'adaptive rag retrieval reinforcement learning retrieval augmented generation efficiency project' },
  { id:'crosslang', text:'Cross-Language Vulnerability Lifecycle Framework is a unified detection, validation, and remediation system across Java Python and C++ using Universal AST normalization and hybrid GraphSAGE plus LLM fusion. Achieves 89.84-92.02% accuracy and 69.74% end-to-end resolution. Technologies: Python, PyTorch, Tree-sitter, GraphSAGE, Qwen2.5-Coder, Docker.', keywords:'crosslang cross language vulnerability detection repair universal ast graphsage project thesis' },
  { id:'hypercomplex', text:'HyperComplEx is a hybrid KG embedding framework adaptively combining hyperbolic, complex, and Euclidean spaces via learned attention mechanisms for knowledge graph completion. Achieves up to 18% relative gain in MRR and 0.612 MRR on 10M-node CS graph with near-linear scalability. Published IEEE BigData 2025. Technologies: Python, PyTorch, Geometric Deep Learning.', keywords:'hypercomplex knowledge graph embedding hyperbolic complex euclidean mrr project ieee bigdata' },
  { id:'mlcpd', text:'MLCPD is a large-scale unified dataset of parsed source code across 10 major programming languages under a universal AST schema. Over 7 million parsed code files with 99.9999% conversion rate. Published on Hugging Face. Technologies: Python, Tree-sitter, Apache Parquet, Hugging Face Datasets.', keywords:'mlcpd code parser dataset universal ast 10 languages hugging face project arxiv' },
  { id:'vulngraph', text:'VulnGraph integrates graph neural networks (GNNs) with Large Language Models for vulnerability detection in Java code. Uses PROGEX for AST and CFG extraction. Achieves 93.57% accuracy, 17.81% above LLM baselines. Published Complex Networks 2025. Technologies: Python, Java, PROGEX, GNNs, PyTorch Geometric, LLMs.', keywords:'vulngraph gnn vulnerability detection java accuracy graph neural network project complex networks' },
  { id:'finance', text:'Multi-Agent Financial Assistant is a web-based multi-agent system built with Phi framework and Groq-powered LLaMA3 for real-time financial queries. Integrates live stock data via yfinance with web search citations. Technologies: Python, Flask, Phi Data Agents, Groq, yfinance.', keywords:'finance agent financial assistant multi-agent stock llama groq project' },
  { id:'securefix', text:'SecureFixAgent is a hybrid agent augmenting Bandit static analysis with LLMs to detect and repair Python vulnerabilities. Reduces false positives by 10.8%, improves fix accuracy by 13.51%. Developer explanation quality rating 4.5/5. Published ICMLA 2025. Technologies: Python, LLMs, HuggingFace, Apple MLX, Bandit.', keywords:'securefix securefixagent vulnerability repair bandit llm false positive project icmla' },
  { id:'orderbook', text:'OrderBook++ is a modular low-latency order matching engine in C++ for financial trading simulation. Supports limit, market, and cancel orders. Exposes Python bindings via pybind11. Technologies: C++17, pybind11, CMake, Google Test, Python.', keywords:'orderbook c++ trading matching engine low-latency pybind11 project' },
  { id:'malcode', text:'MalCodeAI is a dual-stage LLM pipeline to detect, exploit, and remediate software vulnerabilities across 14 programming languages. Integrates static analysis and exploit simulation. Uses Qwen2.5-Coder-3B with LoRA and MLX framework. Usefulness 8.06/10, interpretability 7.40/10. Published IEEE IRI 2025. Technologies: Python, LLMs, HuggingFace, Apple MLX.', keywords:'malcode malcodeai malicious code detection 14 languages qwen lora mlx project ieee iri' },
  { id:'mosei', text:'Multimodal Sentiment Analysis uses Transformer-based models with early fusion of text, audio, and visual modalities on CMU-MOSEI dataset. Achieves 97.87% 7-class accuracy and 0.9682 F1-score. Published arXiv cs.CL 2025. Technologies: Python, PyTorch, HuggingFace, Multimodal Deep Learning.', keywords:'mosei sentiment analysis multimodal transformer text audio visual accuracy project arxiv' },
  { id:'scichat', text:'SciChat is a PDF-aware scientific chatbot combining LangChain, Pinecone vector search, and Mistral7B for interactive question-answering over research papers. Technologies: Python, LangChain, Pinecone, LLMs, NLP.', keywords:'scichat pdf chatbot langchain pinecone mistral question answering project' },
  { id:'ezycart', text:'EzyCart is an AI-powered smart shopping cart using computer vision for automatic product identification and billing. Patent published in India. Uses object detection and edge computing. Technologies: Computer Vision, Python, OpenCV, PyTorch, RoboFlow.', keywords:'ezycart smart shopping cart computer vision patent india opencv project' },
  { id:'cryptchat', text:'CryptChat is a secure Android messaging app integrating AES-256 encryption with steganography for covert communication. Hidden data embedded within media files. Technologies: Android, Java, AES-256, Steganography, Firebase.', keywords:'cryptchat encrypted messaging android aes steganography covert project' },
  { id:'projects_all', text:'Jugal has 16 projects: RSAT, ResearchVault, FASS, Adaptive RAG, Cross-Language Vulnerability Lifecycle, HyperComplEx, MLCPD, VulnGraph, Multi-Agent Financial Assistant, SecureFixAgent, OrderBook++, MalCodeAI, Multimodal Sentiment Analysis, SciChat, EzyCart, CryptChat.', keywords:'project projects all list how many count' },
  // ── Publications ──
  { id:'pub_rsat', text:'RSAT: Structured Attribution Makes Small Language Models Faithful Table Reasoners. Authors: Jugal Gajjar, Kamalasankari Subramaniakuppusamy. Under review at SURGeLLM Workshop ACL 2026.', keywords:'rsat publication paper acl 2026 attribution faithful table reasoning workshop' },
  { id:'pub_fass', text:'FASS: Feature Attribution Stability Suite - How Stable Are Post-Hoc Attributions? Authors: Kamalasankari Subramaniakuppusamy, Jugal Gajjar. Under review at XAI4CV Workshop CVPR 2026. Evaluates Grad-CAM, IG, GradientSHAP, LIME stability.', keywords:'fass publication paper cvpr 2026 xai attribution stability workshop' },
  { id:'pub_adaptive_rag', text:'Adaptive RAG: Learning When and How Much to Retrieve Across Model Scales. Author: Jugal Gajjar. Under review at GEM Workshop ACL 2026. Achieves 3.2-6.5% higher accuracy, 14-37% fewer retrievals across 7 models on 9 QA datasets.', keywords:'adaptive rag publication paper acl 2026 retrieval efficiency workshop' },
  { id:'pub_hypercomplex', text:'HyperComplEx: hybrid multi-space KG embedding framework. Authors: Jugal Gajjar, Kaustik Ranaware, Kamalasankari Subramaniakuppusamy, Vaibhav Gandhi. Published IEEE BigData 2025. Achieves 0.612 MRR on 10M-node CS graph with near-linear scalability.', keywords:'hypercomplex publication paper ieee bigdata 2025 knowledge graph embedding' },
  { id:'pub_vulngraph', text:'VulnGraph: hybrid GNN plus LLM framework for Java vulnerability detection. Authors: Jugal Gajjar, Kaustik Ranaware, Kamalasankari Subramaniakuppusamy. Published Complex Networks 2025. Won Sustainability Award. 93.57% accuracy, 17.81% above LLM baselines.', keywords:'vulngraph publication paper complex networks 2025 vulnerability detection sustainability award' },
  { id:'pub_securefix', text:'SecureFixAgent: hybrid repair framework integrating Bandit with lightweight LLMs under 8B parameters. Authors: Jugal Gajjar, Kamalasankari Subramaniakuppusamy, Relsy Puthal, Kaustik Ranaware. Published ICMLA 2025. 10.8% fewer false positives, 13.51% better fix accuracy, 4.5/5 developer rating.', keywords:'securefixagent publication paper icmla 2025 vulnerability repair' },
  { id:'pub_malcode', text:'MalCodeAI: language-agnostic multi-stage AI pipeline using fine-tuned Qwen2.5-Coder-3B with LoRA in MLX framework. Authors: Jugal Gajjar, Kamalasankari Subramaniakuppusamy, Noha El Kachach. Published IEEE IRI 2025. Covers 14 languages. Usefulness 8.06/10.', keywords:'malcodeai publication paper ieee iri 2025 code security 14 languages' },
  { id:'pub_mlcpd', text:'MLCPD: large-scale language-agnostic dataset unifying code across 10 programming languages with universal AST schema. Authors: Jugal Gajjar, Kamalasankari Subramaniakuppusamy. Published arXiv cs.SE 2025. Over 7 million parsed source files. Available on Hugging Face.', keywords:'mlcpd publication paper arxiv 2025 code dataset universal ast' },
  { id:'pub_mosei', text:'Multimodal Sentiment Analysis on CMU-MOSEI using transformer-based models with early fusion. Authors: Jugal Gajjar, Kaustik Ranaware. Published arXiv cs.CL 2025. 97.87% 7-class accuracy and 0.9682 F1-score.', keywords:'multimodal sentiment analysis publication paper arxiv 2025 mosei transformer' },
  { id:'pubs_all', text:'Jugal has 10 publications and papers: RSAT (ACL 2026 under review), FASS (CVPR 2026 under review), Adaptive RAG (ACL 2026 under review), HyperComplEx (IEEE BigData 2025), VulnGraph (Complex Networks 2025), SecureFixAgent (ICMLA 2025), MalCodeAI (IEEE IRI 2025), MLCPD (arXiv cs.SE 2025), Multimodal Sentiment (arXiv cs.CL 2025), Cross-Language Vulnerability thesis.', keywords:'publication paper research conference journal all list how many count' },
  // ── Awards & Service ──
  { id:'awards', text:'Jugal awards: Sustainability Award at Complex Networks 2025 for VulnGraph, GW Dean\'s Scholarship Award, NVIDIA Jetson AI Specialist, International Karate Gold Medalist representing India at Wado International Karate Championship 2017, Student of the Year three consecutive years grades 8-10, Junior Sports Leader.', keywords:'award awards honors achievements medals scholarships sustainability dean karate' },
  { id:'service', text:'Jugal professional service: Program Committee Member at IEEE ICTAI 2026, Reviewer at ICMLA 2025 ROSE-LLM track, IEEE USBEREIT 2026, and ACL 2026 (GEM Workshop, SURGeLLM Workshop, CDL Workshop).', keywords:'service reviewer program committee ieee ictai icmla gem surgellm cdl professional' },
  // ── Skills ──
  { id:'skills', text:'Programming: Python, Java, C++. Frameworks: PyTorch, TensorFlow, LangChain, HuggingFace Transformers, PyTorch Geometric, Apple MLX. Areas: NLP, LLMs, GNNs, Knowledge Graphs, Reinforcement Learning, Explainable AI, Trustworthy AI, Computer Vision, Deep Learning, Graph Learning. Tools: SQL, Git, Docker, Spark, Hadoop, AWS S3.', keywords:'skill skills tech stack tools programming python pytorch llm nlp gnn graph' },
  // ── Personal & Contact ──
  { id:'karate', text:'Jugal holds a Black Belt in karate and won Gold Medal representing India at the Wado International Karate Championship 2017. Years of martial arts training instilled precision, focus, and composure under pressure. Also served as Junior Sports Leader and received Student of the Year honors three years running.', keywords:'karate martial art sport personal black belt gold medal india wado' },
  { id:'aiesec', text:'Jugal was active with AIESEC Baroda Outgoing Social Sector team, coordinating cross-cultural exchange programs fostering youth leadership and social impact, broadening his perspective on international collaboration and responsible AI.', keywords:'aiesec baroda social exchange youth leadership international personal' },
  { id:'contact', text:'Email: jugal.gajjar@gwu.edu. GitHub: github.com/JugalGajjar. LinkedIn: linkedin.com/in/jugal-gajjar. Medium: medium.com/@812jugalgajjar. Google Scholar: available. Open to research collaborations, PhD opportunities, and job discussions on LLMs, reasoning, and trustworthy AI.', keywords:'contact email github linkedin medium scholar reach connect collaborate phd job' },
  { id:'location', text:'Jugal is from Vadodara, India, currently based in Washington D.C. pursuing M.S. at The George Washington University.', keywords:'location where from live based country city vadodara india washington dc' },
  { id:'current', text:'Jugal is currently pursuing M.S. at GWU, conducting thesis research on a cross-language autonomous vulnerability lifecycle framework, and working on new papers including RSAT, Adaptive RAG, and FASS submitted to ACL and CVPR 2026 workshops.', keywords:'currently now doing present today active working' },
];

var STOPWORDS = new Set(['the','a','an','is','are','was','were','be','been','have','has','had','do','does','did','will','would','could','should','may','might','can','to','of','in','for','on','with','at','by','from','as','into','through','during','before','after','out','off','over','under','again','then','once','here','there','when','where','why','how','all','both','each','few','more','most','other','some','such','no','nor','not','only','own','same','so','than','too','very','just','now','his','her','its','our','your','their','he','she','it','we','you','they','me','him','us','them','my','this','that','these','those','what','which','who','and','but','if','or','because','while','about','up','down','also','tell','know','get','got','make','made','let','want','like','think','say','said','give','go','come','take','see','look','find','put','use','call','try','ask','feel','keep','show','explain','describe','elaborate','detail','jugal','gajjar','jugals','please','really','actually','well','yeah','yes','ok']);

function tokenize(t) {
  return t.toLowerCase().replace(/[^a-z0-9]/g,' ').split(/\s+/).filter(function(w) {
    return w.length > 2 && !STOPWORDS.has(w);
  });
}

function fallbackAnswer(query) {
  var qt = tokenize(query);
  if (qt.length === 0) return "I'm Mario, Jugal's portfolio assistant! Ask me about his projects, education, experience, or skills.";

  var best = null, bestScore = 0;
  for (var i = 0; i < CHUNKS.length; i++) {
    var ct = tokenize(CHUNKS[i].text + ' ' + CHUNKS[i].keywords);
    var score = 0;
    for (var j = 0; j < qt.length; j++) {
      for (var k = 0; k < ct.length; k++) {
        if (qt[j] === ct[k]) score += 3;
        else if (qt[j].length > 4 && ct[k].indexOf(qt[j]) !== -1) score += 2;
        else if (ct[k].length > 4 && qt[j].indexOf(ct[k]) !== -1) score += 1;
      }
    }
    if (score > bestScore) { bestScore = score; best = CHUNKS[i]; }
  }
  if (best && bestScore >= 3) return best.text;
  return "I'm Mario, and I can only answer questions about Jugal Gajjar's portfolio. Try asking about his projects, education, experience, or skills!";
}

// ── Public API ──
window.portfolioChatbot = {
  ask: async function(query) {
    // Quick greetings (no API call needed)
    var s = query.toLowerCase().trim();
    if (/^(hi|hey|hello|sup|yo|hola|howdy|what'?s up|wassup)\s*[!?.]*$/.test(s))
      return "Hey! I'm Mario, Jugal's portfolio assistant. Ask me anything about his projects, publications, education, experience, or skills!";
    if (/^(thanks?|thx|thank you|cheers)\s*[!?.]*$/.test(s))
      return "You're welcome! Feel free to ask me anything else about Jugal.";
    if (/^(bye|goodbye|see you|later|cya)\s*[!?.]*$/.test(s))
      return "See you! Check out Jugal's projects and publications!";

    // Try worker proxy first
    var answer = await callWorker(query);
    if (answer) return answer;

    // Fallback to offline TF-IDF
    return fallbackAnswer(query);
  }
};
