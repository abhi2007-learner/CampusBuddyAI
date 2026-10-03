from flask import Flask, request, jsonify, send_from_directory
from google import genai
from google.genai import types
import os
import base64

app = Flask(__name__)

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)


@app.route("/")
def home():
    return send_from_directory(".", "index.html")


@app.route("/style.css")
def style():
    return send_from_directory(".", "style.css")


@app.route("/script.js")
def script():
    return send_from_directory(".", "script.js")
@app.route("/campusbuddy.png")
def logo():
    return send_from_directory(".", "campusbuddy.png")


@app.route("/ask", methods=["POST"])
def ask():
    data = request.get_json()

    question = data.get("question", "")

    if not question:
        return jsonify({"answer": "Please ask me something!"})

    response = client.models.generate_content(
        model="gemma-4-26b-a4b-it",
        contents=question
    )

    return jsonify({
        "answer": response.text
    })
@app.route("/ask-image", methods=["POST"])
def ask_image():

    data = request.get_json()

    image_data = data.get("image")
    mime_type = data.get("mime_type", "image/jpeg")
    question = data.get("question", "")

    if not image_data:
        return jsonify({
            "answer": "Please upload an image first."
        })

    image_bytes = base64.b64decode(image_data)

    prompt = f"""
You are Campus Buddy, a friendly AI study companion.

Look carefully at the uploaded image.

The student asks:
{question}

Help the student understand the content in the image.

If it contains a question:
- Explain what the question is asking.
- Solve it step by step if possible.
- Keep the explanation simple.

If it contains notes:
- Summarize the important points.
- Explain difficult concepts simply.

Answer at a college-student level.
"""

    response = client.models.generate_content(
        model="gemma-4-26b-a4b-it",
        contents=[
            types.Part.from_bytes(
                data=image_bytes,
                mime_type=mime_type
            ),
            prompt
        ]
    )

    return jsonify({
        "answer": response.text
    })

if __name__ == "__main__":
    app.run(debug=True)