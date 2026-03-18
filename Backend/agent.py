from langchain.agents import create_agent
from langgraph.checkpoint.memory import InMemorySaver
from langchain_core.messages import HumanMessage
from langchain_google_genai import ChatGoogleGenerativeAI
from prompt_template import SYSTEM_PROMPT
import os

# Load API key from environment
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

# Initialize Gemini model
model = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash-lite",
    temperature=0.7,
    google_api_key=GOOGLE_API_KEY
)

agent = create_agent(
    model=model,
    system_prompt=SYSTEM_PROMPT,
    checkpointer=InMemorySaver(),
)

caption_agent = create_agent(
    model=model,
    system_prompt="You are good for generating Good instagram caption in 1-2 lines with emojis based on product. also add 3-4 hashtags related to the product.",
    checkpointer=InMemorySaver()
)

def generate_prompt(product, shop_name, shop_type, address, description, shop_logo):

#     user_input = f"""
# Generate a marketing poster prompt.

# Product: {product}
# Brand Name: {shop_name}
# Business Type: {shop_type}
# Address: {address}

# Business Concept:
# {description}

# shop logo: {shop_logo}
# Requirements:

# • Product must be center hero
# • Place product on pedestal
# • Bright advertising background
# • Tropical / lifestyle theme
# • Cinematic lighting
# • Include brand typography
# """

    user_input = f"""
    Generate a high-end, commercial photography prompt for an advertising poster.

    Inputs:
    Product: {product}
    Brand Name: {shop_name}
    Business Type: {shop_type}
    Address: {address}
    Business Concept: {description}
    Shop Logo: {shop_logo}

    Design Requirements:
    • Core Subject: The {product} must be the undeniable center hero, captured in hyper-realistic detail and positioned elegantly on a premium pedestal.
    • Setting & Theme: Create a bright, highly polished advertising background. The environment must strictly reflect the {shop_type} and business concept (do not use tropical or beach settings unless explicitly requested in the concept).
    • Lighting: Utilize cinematic, studio-quality lighting to enhance the product's textures and establish a realistic, professional aesthetic.
    • Typography: Seamlessly integrate the brand name ({shop_name}) and address ({address}) using crisp, modern typography.
    • Logo Integration: Display the {shop_logo} clearly on the back wall of the scene. Preserve its exact original colors, shape, and design as provided, without adding any stylized or neon effects.

    """

#     user_input = f"""
# Generate a high-end, commercial photography prompt for an advertising poster.

# Inputs:
# Product: {product}
# Brand Name: {shop_name}
# Business Type: {shop_type}
# Address: {address}
# Business Concept: {description}
# Shop Logo: {shop_logo}

# Design Requirements:
# • Core Subject: The {product} must be the undeniable center hero, captured in hyper-realistic detail and positioned elegantly on a premium pedestal.
# • Setting & Theme: Create a bright, highly polished advertising background. The environment must strictly reflect the {shop_type} and business concept (avoid tropical/beach settings unless requested).
# • Lighting: Utilize cinematic, studio-quality lighting to enhance the product's textures and establish a realistic, professional aesthetic.
# • Typography: Seamlessly integrate the brand name ({shop_name}) and address ({address}) using crisp, modern typography.
# • Logo Integration: Display the {shop_logo} clearly on the back wall of the scene. Preserve its exact original colors, shape, and design as provided, without adding any stylized or neon effects.
# """

    response = agent.invoke(
        {"messages": [HumanMessage(content=user_input)]},
        {"configurable": {"thread_id": "poster"}}
    )

    return response["messages"][-1].content

def generate_caption(product):
    user_input = f"Generate a catchy, professional, concise caption for a product named '{product}'."

    response = caption_agent.invoke(
        {"messages": [HumanMessage(content=user_input)]},
        {"configurable": {"thread_id": "caption"}}
    )

    return response["messages"][-1].content
