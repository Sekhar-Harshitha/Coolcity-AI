# CoolCity AI

A monorepo containing a Next.js 14 frontend and a FastAPI (Python) backend.

## Project Structure
- `/frontend`: Next.js 14 App Router with Tailwind CSS and TypeScript
- `/backend`: Python FastAPI with uvicorn

## Backend Setup (FastAPI)

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment and activate it:
   ```bash
   python -m venv venv
   # On Windows:
   venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```

3. Install requirements:
   ```bash
   pip install -r requirements.txt
   ```

4. Run the server:
   ```bash
   uvicorn main:app --reload --port 8000
   ```
   The backend will be running at `http://localhost:8000`.

## Frontend Setup (Next.js)

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies (you can use npm, yarn, or pnpm):
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```
   The frontend will be running at `http://localhost:3000`.

Open your browser and negative to `http://localhost:3000`. Click the button to trigger a request to the FastAPI backend.
