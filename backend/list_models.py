from google import genai

client = genai.Client(
    api_key="AQ.Ab8RN6KVfYJfiuAnY04CExCMCQEowUaHy3u9BX9b_QtuvxTrcw"
)

for model in client.models.list():
    print(model.name)