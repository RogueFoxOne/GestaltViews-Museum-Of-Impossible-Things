import requests
import os

class NotionAdapter:
    def __init__(self):
        self.api_key = os.getenv('NOTION_API_KEY')  # Add to secrets.toml.txt
        self.base_url = "https://api.notion.com/v1/"

    def fetch_page(self, page_id: str):
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Notion-Version": "2022-06-28",
            "Content-Type": "application/json"
        }
        response = requests.get(f"{self.base_url}pages/{page_id}", headers=headers)
        if response.status_code == 200:
            return response.json()
        raise Exception(f"Error fetching Notion page: {response.text}")

    def query_ai(self, page_content: str, prompt: str):
        # Route to your LLM (e.g., via llm_router.py)
        from .llm_router import llm_router
        return llm_router(prompt + "
Context: " + page_content)
