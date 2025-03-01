# main.py
from fastapi import FastAPI, Form, HTTPException, Query
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict, List, Optional
from dotenv import load_dotenv
from pydantic import BaseModel
from services.gemini_game_flow import get_gemini_response
from services.wellness import process_input
from services.scenariosaga import ScenarioSaga
import base64

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Character(BaseModel):
    name: str
    age: int

class GameResponse(BaseModel):
    scenario: str
    image: Optional[str] = None
    options: List[str]

class OptionChoice(BaseModel):
    option_index: int

game_instances: Dict[str, ScenarioSaga] = {}


@app.post("/ai-game-path")
async def ai_financial_path(
    input: str = Form(...),
    risk: Optional[str] = Form("conservative")
):
    """Generates an AI-based financial planning response."""
    try:
        response = get_gemini_response(input, risk)  
        return JSONResponse(content=response, status_code=200)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Something went wrong: {str(e)}")


@app.post("/ai-chatbot")
async def ai_chatbot(input: str = Form(...), type: str = Form("chatbot")):
    response = process_input(input, type)  # Await the response

    return response


@app.post("/start_game/", response_model=GameResponse)
async def start_new_game(character: Character):
    """Endpoint to start a new game."""
    game = ScenarioSaga()
    game_id = character.name + str(character.age)

    try:
        scenario, image_bytes, options = await game.start_game(character.name, character.age)  # Await

        image_base64 = base64.b64encode(image_bytes).decode('utf-8') if image_bytes else None

        game_instances[game_id] = game

        return GameResponse(scenario=scenario, image=image_base64, options=options)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


game_instances: Dict[str, ScenarioSaga] = {}
@app.post("/choose_option/", response_model=GameResponse)
async def choose_next_option(chosen_option: str = Form(...), game_id: str = Form(...)):
    """Endpoint to choose the next option in the game."""

    print(chosen_option, game_id)

    if game_id not in game_instances:
        raise HTTPException(status_code=404, detail="Game not found. Start a new game first.")

    game = game_instances[game_id]
    print(game)

    try:
        scenario, image_bytes, options = await game.choose_option(chosen_option)  # Await

        image_base64 = base64.b64encode(image_bytes).decode('utf-8') if image_bytes else None

        if scenario == "Story has reached its conclusion!":
            del game_instances[game_id]
            return GameResponse(scenario=scenario, image=image_base64, options=[])

        return GameResponse(scenario=scenario, image=image_base64, options=options)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/story_so_far", response_model=List[str])
async def get_full_story(game_id: str = Query(...)):
    """Endpoint to get the complete story so far."""

    if game_id not in game_instances:
        raise HTTPException(status_code=404, detail="Game not found.  Start a new game first.")

    game = game_instances[game_id]

    try:
        story = game.get_story_so_far()
        return story
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))