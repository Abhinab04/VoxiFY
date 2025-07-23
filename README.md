**Project Over**
---

# VoxiFY

VoxiFY is a full-stack web application that lets users upload PDFs, generate flashcards and quizzes from their content, and use text-to-speech features. Built with React (frontend) and Node.js/Express (backend), VoxiFY helps you learn and review efficiently.

---

## Features

- **PDF Upload:** Upload PDF files for processing.
- **Flashcard Generation:** Automatically generate question-answer flashcards from your documents.
- **Quiz Generation:** Create quizzes from your uploaded content.
- **Text-to-Speech:** Convert text or document content into audio.
- **User Authentication:** Register and log in to save your progress.
- **Modern UI:** Responsive and interactive interface using React and Framer Motion.

---

## Folder Structure

```
Backend/
  app.js
  package.json
  Route/
    chat.js
    audio.js
    user.js
  models/
    Users.js
  ...
Frontend/
  src/
    components/
      FlashCard/
      Pdf/
      Dashboard/
      ...
    App.jsx
    main.jsx
  package.json
  ...
```

---

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- MongoDB (local or cloud)
- (Optional) Python for some audio features

### Backend Setup

1. Go to the `Backend` folder:
    ```sh
    cd Backend
    ```
2. Install dependencies:
    ```sh
    npm install
    ```
3. Create a `.env` file with your environment variables (MongoDB URI, OpenAI API key, etc.).
4. Start the backend server:
    ```sh
    node app.js
    ```
   The backend will run on `http://localhost:3001` by default.

### Frontend Setup

1. Go to the `texttospeech` folder:
    ```sh
    cd Frontend
    ```
2. Install dependencies:
    ```sh
    npm install
    ```
3. Start the frontend development server:
    ```sh
    npm run dev
    ```
   The frontend will run on `http://localhost:5173` by default.

---

## Usage

- **Register/Login:** Create an account or log in.
- **Dashboard:** Access your dashboard to upload PDFs and generate flashcards/quizzes.
- **Flashcards:** View, flip, and study generated flashcards.
- **Quiz:** Take quizzes generated from your content.
- **Text-to-Speech:** Listen to your notes or document content.

---

## API Endpoints (Backend)

- `POST /chat/submitPDF` — Upload PDF and generate flashcards.
- `GET /chat/fetchFlashCardData` — Fetch all flashcards (question/answer pairs).
- `POST /chat/quizDownload` — Upload PDF and generate quiz.
- `GET /chat/downPdf` — Download generated quiz as a file.
- ...and more (see `Backend/Route/chat.js`).

---

## Technologies Used

- **Frontend:** React, Framer Motion, Axios, Styled Components, Vite
- **Backend:** Node.js, Express, MongoDB, Mongoose, OpenAI API, pdf-lib, multer
- **Other:** Python (gTTS for audio), PDF parsing libraries

---

## Customization

- Update OpenAI API keys and endpoints in your `.env` file.
- Adjust MongoDB connection string as needed.
- Modify UI components in `src/components` for your branding.

---

## License

This project is for educational purposes. See [LICENSE](LICENSE) for more details.

---

## Credits

- [OpenAI](https://openai.com/)
- [React](https://react.dev/)
- [pdf-lib](https://pdf-lib.js.org/)
- [gTTS](https://pypi.org/project/gTTS/)
