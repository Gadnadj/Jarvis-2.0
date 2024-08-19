import requests
from dotenv import load_dotenv
import os

load_dotenv()

# Vérifiez que les variables d'environnement sont bien chargées
print(f"Organization ID: {os.getenv('ELEVEN_LABS_API_KEY')}")
print(f"API Key: {os.getenv('OPENAI_API_KEY')}")

ELEVEN_LABS_API_KEY = os.getenv("ELEVEN_LABS_API_KEY")

def convert_text_to_speech(message, selected_voice):
    body = {"text": message, "voice_settings": {"stability": 0, "similarity_boost": 0}}

    # Map the voice name to the corresponding ID
    voice_mapping = {
        "Shaun": "CYw3kZ02Hs0563khs1Fj",
        "Jack": "5Q0t7uMcjvnagumLfvZi",
        "Antoni": "ErXwobaYiN019PkySvjV",
        "Sarah": "yi1Q6GP2jWKJk3kJ1uIS",
        # Add more voices as needed
    }

    # Get the corresponding ID for the selected voice
    selected_voice_id = voice_mapping.get(selected_voice)

    if not selected_voice_id:
        # Handle the case where the selected voice is not recognized
        return

    headers = {
        "xi-api-key": ELEVEN_LABS_API_KEY,
        "Content-Type": "application/json",
        "accept": "audio/mpeg",
    }
    print("selected_voice_id", selected_voice_id)
    shaun_number = voice_mapping.get("Shaun")
    print("Le numéro de Shaun est :", shaun_number)

    endpoint = f"https://api.elevenlabs.io/v1/text-to-speech/{selected_voice_id}"

    try:
        response = requests.post(endpoint, json=body, headers=headers)
    except Exception as e:
        # Handle the exception
        return

    if response.status_code == 200:
        return response.content
    else:
        # Handle the case where the request to Eleven Labs API fails
        return
