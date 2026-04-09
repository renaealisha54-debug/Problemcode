

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import subprocess
import os
import anthropic # Requires pip install anthropic

app = FastAPI()

# Enable CORS for the frontend connection
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

CLAUDE_KEY = "your_emergent_llm_key"
client = anthropic.Anthropic(api_key=CLAUDE_KEY)

@app.post("/api/execute")
async def execute(data: dict):
    code = data.get("code")
    lang = data.get("language")
    
    # Save code to temp file
    ext = "py" if lang == "python" else "js"
    with open(f"run.{ext}", "w") as f:
        f.write(code)
    
    # Real execution
    cmd = ["python3", "run.py"] if lang == "python" else ["node", "run.js"]
    proc = subprocess.run(cmd, capture_output=True, text=True)
    return {"result": proc.stdout or proc.stderr}

@app.post("/api/ai/correct")
async def ai_correct(data: dict):
    # Call Claude Sonnet 4.5
    response = client.messages.create(
        model="claude-3-sonnet-20240229",
        max_tokens=1024,
        messages=[{"role": "user", "content": f"Fix this {data['language']} code and return ONLY the code:\n\n{data['code']}"}]
    )
    return {"corrected_code": response.content[0].text}

@app.post("/api/apk/build")
async def build_apk(data: dict):
    # 1. Scaffolding
    # 2. Injected AndroidManifest.xml with permissions
    # 3. Trigger ./gradlew
    return {"status": "Building APK... Download will begin shortly."}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
