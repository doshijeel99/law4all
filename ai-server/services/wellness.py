import os
from dotenv import load_dotenv
from groq import Groq  
import speech_recognition as sr
import tempfile
import edge_tts
import asyncio

load_dotenv()

client = Groq(
    api_key=os.getenv("GROQ_API_KEY"),
)

MINDPLAY_GAMES = {
    "Number Match": "A memory game to exercise cognitive abilities by matching card numbers.",
    "Music Mania": "Create musical tunes by matching colored plates with shapes.",
    "Balloon Pop": "Pop on-screen balloons using body movements in real-time.",
    "Hole in the Wall": "Strike poses to pass through wall overlays - gets progressively challenging!",
    "Flappy Bird": "Navigate through obstacles with keyboard controls.",
    "Color And Paint": "Express yourself by coloring templates with AI mood analysis.",
    "Scenario Saga": "Create unique storylines through dynamic scenario choices.",
    "Word Chain": "Build vocabulary by connecting words through their last letters."
}

CRISIS_RESOURCES = {
    "India": {
        "AASRA": "24x7 Helpline: 91-9820466726",
        "Vandrevala Foundation": "1860-2662-345 / 1800-2333-330",
        "iCall": "022-25521111",
        "Website": "http://www.aasra.info/"
    },
    "International": {
        "US National Suicide Prevention Lifeline": "1-800-273-8255",
        "UK Samaritans": "116 123",
        "Australia Lifeline": "13 11 14",
        "Website": "https://www.opencounseling.com/suicide-hotlines"
    }
}

def get_mindplay_recommendation():
    """Recommends a Bandhu game."""
    games_list = "\n\n".join([
        f"• {game:<15} 🎮    {description}"
        for game, description in MINDPLAY_GAMES.items()
    ])
    return f"Here are some engaging games you might enjoy:\n\n{games_list}\n\nWould you like to try any of these games?"

def check_for_crisis(user_input):
    """Checks if the user input indicates a crisis."""
    crisis_indicators = [
        "suicide", "kill myself", "end it all", "want to die", "wanna end it",
        "no reason to live", "better off dead", "can't take it anymore",
        "don't want to live", "dont want to live", "end my life",
        "depressed", "depression", "hopeless", "worthless"
    ]
    return any(indicator in user_input.lower() for indicator in crisis_indicators)

def get_crisis_response():
    """Returns a pre-defined crisis response with resources."""
    return """I understand you're going through a difficult time. While I'm here to listen, please reach out to these professional crisis helplines:

► INDIA:
   • AASRA (24/7): 91-9820466726
   • Vandrevala: 1860-2662-345
   • iCall: 022-25521111
   → Visit: http://www.aasra.info/

► INTERNATIONAL:
   • US: 1-800-273-8255
   • UK: 116 123
   • Australia: 13 11 14
   → Visit: https://www.opencounseling.com/suicide-hotlines

These services are free, confidential, and available 24/7."""

def check_for_boredom(user_input):
    """Checks if the user input indicates boredom."""
    boredom_indicators = [
        "bored", "boring", "nothing to do", "uninterested",
        "not interested", "dull", "monotonous", "tedious",
        "nothing exciting", "no fun", "don't know what to do"
    ]
    return any(indicator in user_input.lower() for indicator in boredom_indicators)

def prepare_system_context(user_message):
    """Prepares the system context for the language model."""
    return """You are Amigo.AI, a mental wellness companion. The platform is called Bandhu.
    Keep responses concise (2-3 lines max). Focus on: practical advice, professional 
    referrals, and brief wellness techniques. Be direct, supportive, and clear. Avoid lengthy 
    explanations."""

async def text_to_speech(text):
    """Converts text to speech using Edge TTS."""
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix='.mp3') as temp_audio:
            temp_audio_path = temp_audio.name
            communicate = edge_tts.Communicate(text, 'en-US-ChristopherNeural')
            await communicate.save(temp_audio_path)
        with open(temp_audio_path, 'rb') as audio_file:
            audio_bytes = audio_file.read()
        os.unlink(temp_audio_path)  # Clean up the temporary file
        return audio_bytes
    except Exception as e:
        print(f"Error generating speech: {str(e)}") 
        return None

def generate_speech(text):
    """Generates speech from text using an asynchronous function."""
    return asyncio.run(text_to_speech(text))

def speech_to_text():
    """Converts speech to text using the SpeechRecognition library."""
    recognizer = sr.Recognizer()
    microphone = sr.Microphone()
    with microphone as source:
        print("Listening... Speak now.")
        try:
            audio = recognizer.listen(source, timeout=5)  # Add a timeout
        except sr.WaitTimeoutError:
            return "Sorry, I didn't hear anything."

    try:
        speech_text = recognizer.recognize_google(audio)
        return speech_text
    except sr.UnknownValueError:
        return "Sorry, I could not understand your speech."
    except sr.RequestError:
        return "Sorry, the speech service is unavailable."

def process_input(user_input, type="chatbot"):
    """Processes the user input and returns the assistant's response."""
    if check_for_crisis(user_input):
        return get_crisis_response()
    elif check_for_boredom(user_input):
        return get_mindplay_recommendation()
    else:
        try:
            chat_completion = client.chat.completions.create(
                messages=[
                    {"role": "system", "content": prepare_system_context(user_input)},
                    {"role": "user", "content": user_input}
                ],
                model="llama3-8b-8192",
                stream=False,
            )
            return chat_completion.choices[0].message.content
        except Exception as e:
            print(f"Error communicating with language model: {e}")
            return "Sorry, I encountered an error processing your request."