# from openai import OpenAI
# from dotenv import load_dotenv
# import os 
from pydantic import BaseModel
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware


# interface
class ChatRequest(BaseModel):
    message: str
    history: list = []

# # load env
# load_dotenv()


# # initialize fastapi app
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))


# for m in genai.list_models():
#     print("Model===")
#     print(m.name, m.supported_generation_methods)
    
model = genai.GenerativeModel("gemini-2.5-flash")

@app.post("/chat")
async def chatpot(request: ChatRequest):
    message = [ {
        "role" : "system", 
        "content":"You are a senior AI assistant, give clear, short and structured answer"}]
    
    for item in request.history[-5:]:
        message.append(
            {
            "role" : item["role"],
            "content" : item["content"] 
            }
        )
    
    message.append(
        {
            "role": "user",
            "content" : request.message
        }
    )

    print('message', message)

    prompt = "\n".join([
        f"{m['role']}: {m['content']}" for m in message
        ])
    response = model.generate_content(prompt)

    return {
        "reply" : response.text
    }
  



