# Resume & Cover Letter AI Builder 🎉

A comprehensive, professional-grade resume and cover letter builder with AI-powered features, ATS optimization, and multiple export options.

## ✨ Features

### 🎯 Resume Builder
- **3 Professional Templates**: Modern, Classic, and Minimal styles
- **Live Preview**: Real-time preview as you type
- **Dynamic Forms**: Add/remove experiences and education
- **Sample Data**: Quick start with example content
- **PDF Export**: Download professional PDF resumes

### 📝 Cover Letter Generator
- **AI-Powered**: Intelligent content generation
- **Job Description Analysis**: Keyword matching and customization
- **Resume Integration**: Uses your resume content for personalization
- **Professional Tone**: Industry-standard formatting

### 🔧 Resume Improver
- **Action Verb Enhancement**: Replace weak verbs with strong ones
- **Quantifiable Achievements**: Suggest adding metrics
- **Professional Tone**: Adjust language for different contexts
- **Smart Suggestions**: AI-powered improvement recommendations

### 📊 ATS Scorer
- **100-Point Scoring System**: Comprehensive ATS compatibility analysis
- **Grade Assessment**: A, B, C, D grading with detailed feedback
- **Keyword Matching**: Analyze resume against job descriptions
- **Section Analysis**: Check for essential resume components
- **Improvement Suggestions**: Actionable recommendations

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- Python (v3.8 or higher)
- pip (Python package manager)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd Glint-resume-ai-builder
   ```

2. **Set up the Backend**
   ```bash
   cd Backend
   python -m venv .venv
   # On Windows:
   .venv\Scripts\activate
   # On macOS/Linux:
   source .venv/bin/activate
   
   pip install fastapi uvicorn pydantic
   ```

3. **Set up the Frontend**
   ```bash
   cd ../Frontend
   npm install
   ```

### Running the Application

1. **Start the Backend Server**
   ```bash
   cd Backend/App
   python -m uvicorn main:app --host 127.0.0.1 --port 8010 --reload
   ```

2. **Start the Frontend Development Server**
   ```bash
   cd Frontend
   npm run dev
   ```

3. **Open your browser**
   - Frontend: http://localhost:5173 (or the port shown in terminal)
   - Backend API: http://127.0.0.1:8010

## 🛠️ Technology Stack

### Frontend
- **React 19** - Modern UI framework
- **Vite** - Fast build tool and dev server
- **jsPDF** - PDF generation
- **CSS-in-JS** - Styled components

### Backend
- **FastAPI** - Modern Python web framework
- **Pydantic** - Data validation
- **Uvicorn** - ASGI server

## 📁 Project Structure

```
Glint-resume-ai-builder/
├── Frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ResumeBuilder.jsx
│   │   │   ├── CoverLetterForm.jsx
│   │   │   ├── ResumeImprover.jsx
│   │   │   └── ResumeScorer.jsx
│   │   ├── utils/
│   │   │   ├── templates.js
│   │   │   └── pdf.js
│   │   ├── api.js
│   │   └── App.jsx
│   └── package.json
├── Backend/
│   └── App/
│       └── main.py
└── README.md
```

## 🎨 Features in Detail

### Resume Templates
- **Modern**: Clean layout with emojis and clear sections
- **Classic**: Traditional format with strong typography
- **Minimal**: Simple design focused on content

### ATS Optimization
The ATS Scorer analyzes resumes across multiple dimensions:
- **Section Completeness** (20 points)
- **Action Verbs** (15 points)
- **Quantifiable Achievements** (20 points)
- **Keyword Matching** (25 points)
- **Formatting & Length** (20 points)

### AI-Powered Features
- Intelligent cover letter generation
- Resume content improvement
- Keyword extraction and matching
- Professional tone adjustment

## 🔧 API Endpoints

- `GET /api/health` - Health check
- `POST /api/generate-resume` - Generate formatted resume
- `POST /api/cover-letter` - Generate cover letter
- `POST /api/improve-resume` - Improve resume content
- `POST /api/score-resume` - ATS compatibility scoring

## 🚀 Deployment

### Frontend Deployment
```bash
cd Frontend
npm run build
# Deploy the 'dist' folder to Vercel, Netlify, or similar
```

### Backend Deployment
```bash
# Deploy to Railway, Render, or similar platforms
# Update CORS origins in main.py for production
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with modern web technologies
- Inspired by professional resume building tools
- Designed for optimal ATS compatibility

---

**Ready to build your professional resume?** 🎉
