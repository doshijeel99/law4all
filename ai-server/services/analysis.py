import os
from dotenv import load_dotenv
from PIL import Image
import google.generativeai as genai

# Load environment variables
load_dotenv()

# Initialize Gemini
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel('gemini-1.5-flash')

def check_data_folder():
    """Check if data folder exists and create if not"""
    data_folder = 'data'
    if not os.path.exists(data_folder):
        os.makedirs(data_folder)
        print("Created 'data' folder. Please place demo.jpg in this folder.")
        return False
    return True

def check_image_exists():
    """Check if demo.jpg exists in data folder"""
    image_path = os.path.join('data', 'demo.jpg')
    return os.path.exists(image_path)

def load_image():
    """Load demo.jpg from data folder"""
    if not check_data_folder():
        return None
    
    if not check_image_exists():
        print("demo.jpg not found in data folder. Please add the image and retry.")
        return None
    
    try:
        image_path = os.path.join('data', 'demo.jpg')
        image = Image.open(image_path)
        print(f"Successfully loaded image from {image_path}")
        return image
    except Exception as e:
        print(f"Error loading demo.jpg: {str(e)}")
        return None

def get_image_info(image):
    """Extract image information"""
    return {
        'format': image.format,
        'size': f"{image.size[0]}x{image.size[1]}",
        'mode': image.mode,
        'info': image.info
    }

def analyze_image_with_gemini(image):
    """Analyze image using Gemini Vision API"""
    try:
        # Prepare the prompt
        prompt = """
        Please analyze this image with a positive and appreciative tone. Focus on:
        1. The main elements and subjects in the image
        2. The color palette and how colors work together
        3. The mood and feeling the image conveys
        4. Any particularly impressive or artistic elements
        5. What makes this image special or unique
        
        Please be specific about the colors you see and how they enhance the image.
        """

        # Generate response from Gemini
        response = model.generate_content([prompt, image])
        
        # Format the response
        analysis = response.text
        
        return analysis

    except Exception as e:
        print(f"Error analyzing image with Gemini: {str(e)}")
        return None

def main():
    print("Image Analysis with Gemini Vision")
    print("Analyzing demo.jpg from data folder")

    # Add file path information
    print("Expected image path: ./data/demo.jpg")

    # Load image
    image = load_image()
    
    if image:
        # Display image information
        print("\nImage Information:")
        image_info = get_image_info(image)
        for key, value in image_info.items():
            print(f"{key}: {value}")

        # Analyze image
        print("\nAnalyzing image with Gemini...")
        analysis_result = analyze_image_with_gemini(image)
        
        if analysis_result:
            print("\nGemini's Analysis:")
            print(analysis_result)

if __name__ == "__main__":
    main()