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
  { id:'bio', text:'Jugal Gajjar is a graduate student at The George Washington University specializing in autonomous AI systems using NLP LLMs and graph learning.', keywords:'who jugal about person bio introduction' },
  { id:'ms', text:'Jugal is pursuing M.S. in Computer Science Machine Intelligence and Cognition at GWU Washington D.C. GPA 3.95/4.0 expected 2026.', keywords:'masters graduate gwu george washington university education degree' },
  { id:'btech', text:'Jugal earned B.Tech in Computer Science and Engineering from Navrachana University Vadodara India CGPA 9.39/10 graduated 2024.', keywords:'bachelors btech undergraduate navrachana india education college' },
  { id:'thesis', text:'Jugal thesis AI That Detects Exploits and Fixes advances autonomous vulnerability reasoning using multi-agent LLM pipelines.', keywords:'thesis dissertation research' },
  { id:'ga', text:'Graduate Assistant at GWU since September 2025 supporting Big Data and Analytics course CSCI 4907/6444 guiding students on Hadoop S3 Python Java.', keywords:'graduate assistant work job experience current' },
  { id:'researcher', text:'Independent Researcher at GWU since June 2025 conducting thesis research on autonomous AI for vulnerability detection exploitation remediation.', keywords:'researcher work job experience current' },
  { id:'ta', text:'Teaching Assistant at Navrachana University January to May 2024 mentored 80+ students 750+ lab reports software testing debugging.', keywords:'teaching assistant work experience india' },
  { id:'freelance', text:'Freelance Developer for Shubhlaxmi Manufacturing Summer 2023 built Python billing system with Tkinter Pandas increased efficiency 50%.', keywords:'freelance developer work experience' },
  { id:'nvidia', text:'NVIDIA Jetson AI Project Coordinator at Navrachana March to June 2022 led CV NLP workshops Jetson Nano mentored 5+ projects selected by NVIDIA Deep Learning Institute.', keywords:'nvidia jetson coordinator work experience' },
  { id:'hypercomplex', text:'HyperComplEx hybrid KG embedding framework combining hyperbolic complex Euclidean spaces 18% MRR gain scales to 10M+ entities Python PyTorch.', keywords:'hypercomplex knowledge graph project' },
  { id:'mlcpd', text:'MLCPD 7M+ parsed code files across 10 languages universal AST schema 99.9999% conversion rate published Hugging Face Python Tree-sitter Parquet.', keywords:'mlcpd code parser dataset project' },
  { id:'vulngraph', text:'VulnGraph GNN plus LLM Java vulnerability detection 93.57% accuracy 17.81% above LLM baselines PROGEX AST CFG Complex Networks 2025.', keywords:'vulngraph vulnerability detection project' },
  { id:'finance', text:'Multi-Agent Financial Assistant Phi framework Groq LLaMA3 real-time stock queries Python Flask yfinance.', keywords:'finance agent financial assistant project' },
  { id:'securefix', text:'SecureFixAgent Bandit plus LLM Python vulnerability repair reduces false positives 10.8% improves fix accuracy 13.51% developer rating 4.5/5 ICMLA 2025.', keywords:'securefix securefixagent vulnerability repair project' },
  { id:'orderbook', text:'OrderBook++ C++ order matching engine limit market cancel orders Python bindings pybind11 C++17 CMake Google Test.', keywords:'orderbook c++ trading matching engine project' },
  { id:'malcode', text:'MalCodeAI LLM pipeline code security 14 languages Qwen2.5-Coder-3B LoRA MLX framework usefulness 8.06/10 IEEE IRI 2025.', keywords:'malcode malcodeai malicious code detection project' },
  { id:'mosei', text:'Multimodal Sentiment Analysis CMU-MOSEI Transformer early fusion text audio visual 97.87% accuracy 0.9682 F1-score.', keywords:'mosei sentiment analysis multimodal project' },
  { id:'scichat', text:'SciChat PDF-aware chatbot LangChain Pinecone Mistral7B context-aware research question answering.', keywords:'scichat pdf chatbot project' },
  { id:'ezycart', text:'EzyCart AI smart shopping cart computer vision product identification patent published India OpenCV PyTorch RoboFlow.', keywords:'ezycart ezy cart shopping vision patent project' },
  { id:'cryptchat', text:'CryptChat secure Android messaging AES-256 encryption steganography covert communication Java Firebase.', keywords:'cryptchat crypt chat encrypted messaging project' },
  { id:'awards', text:'Jugal awards GW Dean Scholarship NVIDIA Jetson AI Specialist Hackathon Runner-Up International Karate Gold Medalist India 2017 Student of the Year three years.', keywords:'award awards honors achievements medals scholarships' },
  { id:'skills', text:'Python Java C++ PyTorch TensorFlow LangChain HuggingFace Transformers PyTorch Geometric NLP LLMs GNNs Knowledge Graphs Computer Vision Deep Learning.', keywords:'skill skills tech stack tools programming' },
  { id:'contact', text:'Email 812jugalgajjar@gmail.com GitHub JugalGajjar LinkedIn jugalgajjar Medium 812jugalgajjar Google Scholar.', keywords:'contact email github linkedin reach connect' },
  { id:'karate', text:'Jugal Black Belt karate Gold Medalist representing India Wado International Karate Championship 2017 Junior Sports Leader Student of Year.', keywords:'karate martial art sport personal' },
  { id:'location', text:'Jugal from Vadodara India currently based Washington D.C. pursuing M.S. at George Washington University.', keywords:'location where from live based country city' },
  { id:'pubs', text:'Jugal has 6 publications VulnGraph Complex Networks 2025 SecureFixAgent ICMLA 2025 MalCodeAI IEEE IRI 2025 MLCPD arXiv Sentiment arXiv SAIF IJCRT 2024.', keywords:'publication paper research conference journal' },
  { id:'current', text:'Jugal currently pursuing M.S. at GWU working as Graduate Assistant for Big Data and Analytics conducting thesis research on autonomous AI systems.', keywords:'currently now doing present today' },
  { id:'projects_all', text:'Jugal has 11 projects HyperComplEx MLCPD VulnGraph FinanceAgent SecureFixAgent OrderBook++ MalCodeAI Sentiment Analysis SciChat EzyCart CryptChat.', keywords:'project projects all list' },
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
