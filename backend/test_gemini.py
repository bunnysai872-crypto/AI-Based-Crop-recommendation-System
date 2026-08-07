from google import genai
from PIL import Image

client = genai.Client(api_key="AQ.Ab8RN6KVfYJfiuAnY04CExCMCQEowUaHy3u9BX9b_QtuvxTrcw")

image = Image.open("test_leaf.jpg")

response = client.models.generate_content(
    model="gemini-3.5-flash",
    contents=["What plant disease is this?", image]
)

print(response.text)