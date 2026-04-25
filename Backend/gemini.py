from google import genai
from google.genai import types
from PIL import Image
from io import BytesIO
import os
import uuid

from dotenv import load_dotenv
load_dotenv()

# Client automatically reads GOOGLE_API_KEY
client = genai.Client()

def generate_image(prompt):
    try:
        response = client.models.generate_images(
            model="imagen-4.0-generate-001",
            prompt=prompt,
            config=types.GenerateImagesConfig(
                number_of_images=1,
                aspect_ratio="1:1"
            )
        )

        image_bytes = response.generated_images[0].image.image_bytes
        image       = Image.open(BytesIO(image_bytes))

        os.makedirs("static", exist_ok=True)
        image_path = f"static/{uuid.uuid4()}.png"
        image.save(image_path)

        return image_path

    except Exception as e:
        print(f"❌ Image generation error: {type(e).__name__}: {e}")  # ✅ shows exact error
        return None


#############################################################
#############################################################

# from google import genai
# from PIL import Image
# from io import BytesIO
# import os
# import uuid

# # Ensure your GOOGLE_API_KEY is set in your environment variables
# GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

# client = genai.Client(api_key=GOOGLE_API_KEY)

# def generate_image(prompt):
#     try:
#         # 1. Use generate_images instead of generate_content
#         # 2. Use imagen-3.0-generate-001 for standard API access
#         response = client.models.generate_images(
#             model="imagen-3.0-generate-001",
#             prompt=prompt,
#             config=genai.types.GenerateImagesConfig(
#                 number_of_images=1,
#                 aspect_ratio="16:9" # Adjust as needed (e.g., "16:9")
#             )
#         )

#         # Extract the raw image bytes from the first generated image
#         image_bytes = response.generated_images[0].image.image_bytes

#         # Load the bytes into a PIL Image
#         image = Image.open(BytesIO(image_bytes))

#         # Ensure the 'static' directory exists before saving
#         os.makedirs("static", exist_ok=True)

#         # Generate a unique path and save the image
#         image_path = f"static/{uuid.uuid4()}.png"
#         image.save(image_path)

#         return image_path

#     except Exception as e:
#         print(f"Error generating image: {e}")
#         return None

###########################################################################
###################################################################################
# Test the function (uncomment to run)
# print(generate_image("A well-lit, professional photo of a modern retail shop display"))


# Prompt
# prompt = """

# An ultra-high-resolution, commercial-grade vertical poster ad for "Fresh Sip". The image is a sharp, vibrant photograph of a Mango Smoothie presented as the central hero.

# Core Subject: The hero is a vibrant, thick Mango Smoothie, glistening with condensation, showcasing the rich, sunset-orange hue of blended ripe mangoes. Tiny flecks of real mango pulp are visible, hinting at its natural freshness. It is served in a clear, elegant glass, topped with a sprig of fresh mint and a thin slice of mango perched on the rim, all resting on a sleek, white marble pedestal.

# Typography: At the top of the poster, the brand name "Fresh Sip" is displayed in a bold, modern, sans-serif font. At the very bottom of the poster, the subtle call-to-action text: "Sip Your Way to Vitality" is clearly rendered in two lines. Just beneath the call-to-action, in a slightly smaller, sharp font, is the address: "Satellite Road, Ahmedabad, Gujarat". All text is crisp and blur-free.

# Setting & Composition: The background is a bright, sun-drenched tropical paradise, evoking a lively, energetic atmosphere with subtle accents of lush green palm leaves and exotic flowers. Sunlight filters warmly through the leaves, casting gentle, dappled shadows. In the soft-focus (bokeh) background, a stylish, stylized neon sign subtly integrates the "Fresh Sip" logo in a warm, inviting glow.

# Lighting & Aesthetics: The scene uses professional cinematic studio lighting to create a warm glow on the Mango Smoothie while maintaining crisp, realistic textures. A very shallow depth of field isolates the pedestal and product sharply. The composition is clean, modern, highly inviting, and has the polished feel of professional 8k commercial photography.

# """

# Generate image using Nano Banana

# Save generated image
# for part in response.candidates[0].content.parts:
#     if part.inline_data:
#         image = Image.open(BytesIO(part.inline_data.data))
#         image.save("generated_image.png")
#         print("Image saved as generated_image.png")
