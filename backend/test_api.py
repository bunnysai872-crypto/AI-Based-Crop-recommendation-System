import requests

API_KEY = "579b464db66ec23bdd00000164cf42d3199a404160c7582e0446cc2c"

url = "https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070"

params = {
    "api-key": API_KEY,
    "format": "json",
    "limit": 5
}

headers = {
    "User-Agent": "Mozilla/5.0",
    "Accept": "application/json"
}

try:
    response = requests.get(
        url,
        params=params,
        headers=headers,
        timeout=60
    )

    print("Status Code:", response.status_code)
    print("URL:", response.url)
    print("Response:")
    print(response.text)

except Exception as e:
    print("ERROR:", e)