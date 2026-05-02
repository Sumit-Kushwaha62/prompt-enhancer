from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from google import genai
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI()

def get_client():
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("GEMINI_API_KEY not found in environment")
    return genai.Client(api_key=api_key)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PromptRequest(BaseModel):
    prompt: str
    use_case: str
    tone: str

@app.post("/enhance")
async def enhance_prompt(request: PromptRequest):
    if not request.prompt.strip():
        raise HTTPException(status_code=400, detail="Prompt cannot be empty")

    system_instruction = f"""You are an expert prompt engineer. Your job is to take a raw, vague, or poorly structured user prompt and transform it into a highly optimized prompt that AI models can understand perfectly.

Use Case: {request.use_case}
Tone: {request.tone}

Rules:
- Make the prompt specific, clear, and structured
- Add context, constraints, and expected output format where needed
- Keep the original intent intact
- Return ONLY the enhanced prompt, nothing else — no explanation, no preamble

Raw Prompt: {request.prompt}"""

    try:
        client = get_client()
        response = client.models.generate_content(
            model="gemini-flash-latest",
            contents=system_instruction
        )
        enhanced = response.text.strip()
        return {"enhanced_prompt": enhanced}
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
def root():
    return {"status": "Prompt Enhancer API running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
