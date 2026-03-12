# Case Management Dashboard

A case management dashboard web application with Flask backend and vanilla HTML/CSS/JS frontend.

## Project Structure

```
web-app/
├── backend/
│   ├── app.py              # Flask application
│   ├── requirements.txt    # Python dependencies
│   ├── routes/
│   │   └── cases.py       # API routes
│   ├── models/
│   │   └── case.py        # Data models
│   └── database/
│       └── db.py           # Database utilities
└── frontend/
    ├── index.html          # Main HTML file
    ├── css/
    │   └── styles.css      # Styles
    └── js/
        └── app.js          # Frontend JavaScript
```

## Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment (optional but recommended):
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

## Running the Application

### Option 1: Run Backend Only

1. Start the Flask server:
   ```bash
   python app.py
   ```

2. Serve the frontend using a static file server (from the `frontend` directory):
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Or using npx
   npx serve
   ```

3. Open your browser:
   - Frontend: http://localhost:8000
   - API: http://localhost:5000/api/cases

### Option 2: Quick Start Script

A simple way to run both servers:

```bash
# Terminal 1 - Backend
cd backend
python app.py
D:/SoftwareInstall/Python/python.exe app.py

# Terminal 2 - Frontend
cd frontend
python -m http.server 8000
D:/SoftwareInstall/Python/python.exe -m http.server 8000
```

## API Endpoints

- `GET /api/cases` - Get all cases
- `GET /api/cases?search=query` - Search cases
- `GET /api/cases/<id>` - Get a single case
- `POST /api/cases` - Create a new case

## Features

- View all cases in a responsive grid layout
- Search cases by case number, title, client name, or respondent name
- Create new cases via a modal form
- Responsive design (desktop, tablet, mobile)
