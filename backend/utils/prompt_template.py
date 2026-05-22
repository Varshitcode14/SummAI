from langchain.prompts import PromptTemplate

def get_summary_prompt() -> PromptTemplate:
    template = """You are an expert summarizer. Your task is to summarize the given text clearly and concisely.

Instructions:
- Write a well-structured summary
- Preserve the key ideas and main points
- Adjust the length based on the requested summary type
- Use plain, readable language

Summary Type: {summary_type}
(Options: "brief" = 2-3 sentences, "detailed" = full paragraph, "bullet" = bullet points)

Text to summarize:
{text}

Summary:"""
    return PromptTemplate(input_variables=["text", "summary_type"], template=template)


def get_topics_prompt() -> PromptTemplate:
    template = """You are an expert educator and curriculum designer.

Given the following text, do two things:

1. TOPICS: Extract the 5-8 core topics or concepts covered in this text.
2. ROADMAP: For each topic, create a short learning roadmap (3-4 steps) a beginner should follow to master it.

Respond ONLY in this exact JSON format, no extra text:
{{
  "topics": ["topic1", "topic2", "topic3"],
  "roadmap": {{
    "topic1": ["Step 1: ...", "Step 2: ...", "Step 3: ..."],
    "topic2": ["Step 1: ...", "Step 2: ...", "Step 3: ..."]
  }}
}}

Text:
{text}"""
    return PromptTemplate(input_variables=["text"], template=template)


def get_flowchart_prompt() -> PromptTemplate:
    template = """You are an expert at analyzing documents and breaking them into logical sections.

Analyze the following text and break it into 5-8 logical flow sections (like an academic paper or document flow).

For each section:
- Give it a short title (3-5 words)
- Write a mini summary (2-3 sentences)
- Identify what type of section it is (e.g. Introduction, Problem, Methodology, Results, Conclusion, Background, etc.)

Also write one final_summary (2-3 sentences) covering the whole document.

Respond ONLY in this exact JSON format, no extra text:
{{
  "nodes": [
    {{
      "id": "1",
      "title": "Short Title",
      "type": "Introduction",
      "mini_summary": "2-3 sentence summary of this section."
    }},
    {{
      "id": "2",
      "title": "Short Title",
      "type": "Background",
      "mini_summary": "2-3 sentence summary of this section."
    }}
  ],
  "final_summary": "Brief overall summary of the entire document in 2-3 sentences."
}}

Text:
{text}"""
    return PromptTemplate(input_variables=["text"], template=template)