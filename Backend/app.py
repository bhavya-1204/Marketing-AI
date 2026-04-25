from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from agent import generate_prompt, generate_caption
from gemini import generate_image
# from hugging_face import generate_image
import os

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173"])

# ✅ Folder where generated images are saved
IMAGE_DIR = os.path.dirname(os.path.abspath(__file__))  # same folder as app.py

@app.route("/", methods=["GET", "POST"])
def generate():
    if request.method == "POST":

        product     = request.form["product"]
        shop_name   = request.form["shop_name"]
        shop_type   = request.form["shop_type"]
        address     = request.form["address"]
        description = request.form["description"]
        shop_logo   = request.form["shop_logo"]

        prompt     = generate_prompt(product, shop_name, shop_type, address, description, shop_logo)
        image_path = generate_image(prompt)

        # ✅ Handle generation failure gracefully
        if image_path is None:
            return jsonify({"error": "Image generation failed. Check your API key or quota."}), 500

        caption   = generate_caption(product)
        full_path = os.path.join(IMAGE_DIR, image_path)

        return jsonify({
            "image_url": image_path,
            "caption":   caption
        })

    return jsonify({"message": "API Running"})


# ✅ NEW: This route serves the image file to React
@app.route("/images/<filename>")
def serve_image(filename):
    return send_from_directory(IMAGE_DIR, filename)


if __name__ == "__main__":
    app.run(debug=True, port=5000)
