"""
WSGI / Development Server Entry Point for Handmade Haven
"""
import os
from app import create_app

env_name = os.environ.get("FLASK_ENV", "development")
app = create_app(env_name)

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=(env_name == "development"))
