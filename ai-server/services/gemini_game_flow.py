import os
import google.generativeai as genai
import re
import json
from dotenv import load_dotenv

load_dotenv()

genai.configure(api_key=os.environ["GEMINI_API_KEY"])

# Create the model
generation_config = {
  "temperature": 1,
  "top_p": 0.9,
  "top_k": 35,
  "max_output_tokens": 8192,
  "response_mime_type": "text/plain",
}

model = genai.GenerativeModel(
  model_name="gemini-2.0-flash-exp",
  generation_config=generation_config,
  system_instruction="You are an expert in creating engaging and educational game flows that enhance Cognitive Development, Motor Skills, Emotional Well-Being, and Social Interaction. Your goal is to design a step-by-step plan that includes diverse games and activities tailored to the user's preferences.\n\nWhen a user provides a query about a game idea or a skill they want to develop through a game, generate a game flow that helps the user achieve the set goals.\n\nFor each activity/node, provide a brief description, instructions, and expected outcomes.  Use concise language. If a user doesn't provide specific preferences, use balanced games from each area.\n\nHere are the areas of focus you can use when answering, or a mix of all of them:\n- Cognitive Development: Enhancing problem-solving, memory, critical thinking, and attention.\n- Motor Skills: Improving fine and gross motor skills through physical activities and games.\n- Emotional Well-Being: Promoting emotional regulation, mindfulness, self-awareness, and stress reduction.\n- Social Interaction: Encouraging communication, cooperation, empathy, and stronger social connections through group activities and games.\n\nRemember to present the game flow in a clear and visually structured way, as a flowchart with nodes and edges representing the sequence of activities.\n\nYou can increase the number of nodes and edges in the response if needed to provide a well-structured game flow.\n\nStrictly follow the JSON format provided, use different background and border colors for each node depending on the theme it falls into. All the labels and descriptions are limited to 2-3 sentences for optimum viewing.\n\nFor the given user query you have to response a proper output by giving proper response in the following format.\nStrictly follow the given format only\n\n\n\n{\n  \"nodes\": [\n    {\n      \"id\": \"start\",\n      \"position\": { \"x\": 250, \"y\": 50 },\n      \"data\": { \"label\": \"Start Game\" },\n      \"style\": {\n        \"background\": \"bg-green-100\",\n        \"border\": \"border-green-500\"\n      }\n    },\n    {\n      \"id\": \"cognitive\",\n      \"position\": { \"x\": 50, \"y\": 200 },\n      \"data\": { \"label\": \"Puzzle Solving - Improves cognitive flexibility and problem-solving skills.\" },\n      \"style\": {\n        \"background\": \"bg-blue-100\",\n        \"border\": \"border-blue-500\"\n      }\n    },\n    {\n      \"id\": \"motor\",\n      \"position\": { \"x\": 250, \"y\": 200 },\n      \"data\": { \"label\": \"Simon Says - Great fun game that improves gross motor skill and balance for the player\" },\n      \"style\": {\\n        \"background\": \"bg-orange-100\",\n        \"border\": \"border-orange-500\"\n      }\n    },\n    {\n      \"id\": \"emotional\",\n      \"position\": { \"x\": 450, \"y\": 200 },\n      \"data\": { \"label\": \"Meditation - Improves mental health, reduces stress, and enhances relaxation.\" },\n      \"style\": {\n        \"background\": \"bg-yellow-100\",\n        \"border\": \"border-yellow-500\"\n      }\n    }\n  ],\n  \"edges\": [\n    {\n      \"id\": \"e-cognitive\",\n      \"source\": \"start\",\n      \"target\": \"cognitive\",\n      \"label\": \"Choice 1\",\n      \"style\": { \"stroke\": \"stroke-blue-500\" }\n    },\n    {\n      \"id\": \"e-motor\",\n      \"source\": \"start\",\n      \"target\": \"motor\",\n      \"label\": \"Choice 2\",\n      \"style\": { \"stroke\": \"stroke-orange-500\" }\n    },\n    {\n      \"id\": \"e-emotional\",\n      \"source\": \"start\",\n      \"target\": \"emotional\",\n      \"label\": \"Choice 3\",\n      \"style\": { \"stroke\": \"stroke-yellow-500\" }\n    }\n  ]\n}"
)

chat_session = model.start_chat(
  history=[
  ]
)

def get_gemini_response(user_input: str, focusArea:str = "balanced") -> str:
    """
    Generates a game flow using Gemini based on the user input.

    Args:
      user_input: The user's request for a game flow.
      focusArea: A value can be any of "cognitive","motor","emotional","social" or "balanced".

    Returns:
      A JSON string representing the game flow.
    """
    response = chat_session.send_message(f'{user_input} \nThe focus Area is: {focusArea}')
    markdown_text = response.text
    # Extract content between ```json and ``` blocks
    json_match = re.search(r'```json\s*(.*?)\s*```', markdown_text, re.DOTALL)
    print(json_match.group(1))
    if json_match:
        resp = json.loads(json_match.group(1))
    else:
        # Fallback to try parsing the entire response as JSON
        try:
            resp = json.loads(markdown_text)
        except json.JSONDecodeError:
            print("Error: Could not decode JSON from response.")
            return None  # Or raise the exception, depending on your needs

    return resp

if __name__ == "__main__":
    # Sample test query
    test_query = "Suggest a game flow for enhancing emotional wellbeing"
    response = get_gemini_response(test_query, focusArea="emotional")
    if response:
        print(json.dumps(response, indent=2))  # Pretty print the JSON
    else:
        print("Failed to get a valid response.")