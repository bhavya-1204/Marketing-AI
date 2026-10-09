from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from agent import generate_prompt, generate_caption
from gemini import generate_image
import os

app = Flask(__name__)
# CORS(app)  # ✅ allow all origins
allowed = [o.strip() for o in os.getenv("FRONTEND_URL", "http://localhost:5173").split(",")]
CORS(app, origins=allowed)

IMAGE_DIR = os.path.dirname(os.path.abspath(__file__))


@app.route("/", methods=["GET", "POST"])
def generate():
    if request.method == "POST":
        try:
            product     = request.form["product"]
            shop_name   = request.form["shop_name"]
            shop_type   = request.form["shop_type"]
            address     = request.form["address"]
            description = request.form["description"]
            shop_logo   = request.form["shop_logo"]

            prompt = generate_prompt(product, shop_name, shop_type, address, description, shop_logo)
            image_path = generate_image(prompt)

            if image_path is None:
                return jsonify({"error": "Image generation failed"}), 500

            caption = generate_caption(product)

            return jsonify({
                "image_url": image_path,
                "caption":   caption
            })

        except Exception as e:
            print(f"GENERATE ERROR: {type(e).__name__}: {e}")
            return jsonify({"error": str(e)}), 500

    return jsonify({"message": "API Running"})

@app.route("/static/<filename>")
def serve_static(filename):
    return send_from_directory(os.path.join(IMAGE_DIR, "static"), filename)


if __name__ == "__main__":
    app.run(debug=True, port=5000)
