from google import genai

API_KEY = "AQ.Ab8RN6KWXUi2TrwlbqnvBc1jMfYcc-rLHrDauyU9GqmTbQWX-w"

print("Key starts with:", API_KEY[:15])
print("Key length:", len(API_KEY))

client = genai.Client(api_key=API_KEY)

response = client.models.generate_content(
    model="gemini-2.5-flash",
    contents="Hello"
)

print(response.text)