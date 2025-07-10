const express = require('express')
const axios = require('axios')
const OpenAI = require('openai')
const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse')
const { PDFDocument, sum } = require('pdf-lib');
const router = express.Router()
const multer = require('multer');
const nodemailer = require('nodemailer');
const { quiz } = require('../models/Users')
const { Question } = require('../models/Users')
const { Issue } = require('../models/Users')

const requiredFolders = [
    path.join(__dirname, '../chatFile'),
    path.join(__dirname, '../QuizDownload'),
    path.join(__dirname, '../QuizQuestion'),
    path.join(__dirname, '../Quiz'),
    path.join(__dirname, '../Flashcard'),
    path.join(__dirname, '../OutputPDF'),
    path.join(__dirname, '../FlashCardSection'),
];

requiredFolders.forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(path.join(dir, '.gitkeep'), '');
        console.log(`Created folder: ${dir}`);
    } else {
        console.log(`Folder already exists: ${dir}`);
    }
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const tmpPath = path.join(__dirname, '../tmp_1');
        if (!fs.existsSync(tmpPath)) {
            fs.mkdirSync(tmpPath, { recursive: true });
        }
        cb(null, tmpPath);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '.pdf'); // Add .pdf extension
    }
})

const upload = multer({ storage: storage });

const token = process.env.token;
const endpoint = "https://models.github.ai/inference";
const modelName = "openai/gpt-4.1";

//Summarization------------------------------------
router.post('/summary', upload.single('pdf'), (req, res) => {

    const pdfFile = req.file;
    const { value1, value2 } = req.body;
    console.log(value1, value2, pdfFile)

    async function create(start, end) {
        let pdfdata = fs.readFileSync(path.join(__dirname, `../tmp_1/${pdfFile.filename}`))
        const pdfDoc = await PDFDocument.load(pdfdata)
        const pdfDocs = await PDFDocument.create()
        const [firstDonorPage] = await pdfDocs.copyPages(pdfDoc, [start])
        const [secondDonorPage] = await pdfDocs.copyPages(pdfDoc, [start + 1])
        const [thirdDonorPage] = await pdfDocs.copyPages(pdfDoc, [start + 2])
        const [fourthDonorPage] = await pdfDocs.copyPages(pdfDoc, [start + 3])
        const [fifthDonorPage] = await pdfDocs.copyPages(pdfDoc, [end])
        pdfDocs.addPage(firstDonorPage)
        pdfDocs.insertPage(1, secondDonorPage)
        pdfDocs.insertPage(2, thirdDonorPage)
        pdfDocs.insertPage(3, fourthDonorPage)
        pdfDocs.insertPage(4, fifthDonorPage)
        const pdfBytesNew = await pdfDocs.save();
        const outputPath = path.join(__dirname, '../chatFile/chatFile_output.pdf');
        fs.writeFileSync(outputPath, pdfBytesNew);
        console.log(`Page extracted successfully`);
    }

    async function main(text) {
        //  console.log(text);
        const client = new OpenAI({ baseURL: endpoint, apiKey: token });

        const response = await client.chat.completions.create({
            messages: [
                { role: "system", content: "You are a helpful assistant." },
                { role: "user", content: `Please summarize the following text: \n\n${text}` }
            ],
            temperature: 1.0,
            top_p: 1.0,
            max_tokens: 1000,
            model: modelName
        });

        // console.log(response.choices[0].message.content);
        const summary = response.choices[0].message.content
        return summary;
    }

    (async () => {
        try {
            await create(value1, value2)
            console.log("creating the file")
            const readfile = path.join(__dirname, `../chatFile/chatFile_output.pdf`);
            const dataBuffer = fs.readFileSync(readfile);
            const data = await pdf(dataBuffer);

            const textsummarization = data.text;
            const summary = await main(textsummarization);
            // console.log("Original text:", textsummarization, `\n`)
            // console.log("Summary:", summary);
            if (pdfFile && pdfFile.path) {
                fs.unlink(pdfFile.path, (err) => {
                    if (err) {
                        console.log(err)
                    }
                    else {
                        console.log('file has been deleted')
                    }
                })
            }
            return res.json({ sucess: 'true', message: summary })
        } catch (error) {
            console.log(error);
        }
    })();
})

//Chatting-------------------------------------------------
router.post('/chatting', (req, res) => {
    const inputText = req.body.inputText
    console.log(inputText)
    // const token = process.env.token;
    // const endpoint = process.env.endpoint;
    // const modelName = process.env.modelName;
    async function main(text) {
        //  console.log(text);
        const client = new OpenAI({ baseURL: endpoint, apiKey: token });

        const response = await client.chat.completions.create({
            messages: [
                { role: "system", content: "You are a helpful assistant." },
                { role: "user", content: `Help the user to solve query and give accurate response accordingly: \n\n${text}` }
            ],
            temperature: 1.0,
            top_p: 1.0,
            max_tokens: 1000,
            model: modelName
        });

        // console.log(response.choices[0].message.content);
        const summary = response.choices[0].message.content
        return summary;
    }

    (async () => {
        const textsummarization = inputText;
        const summary = await main(textsummarization);
        // console.log("Original text:", textsummarization, `\n\n`)
        // console.log("Ans:", summary);
        return res.json({ sucess: 'true', message: summary })
    })();

})


//Quiz game----------------------------------------------
router.post('/quizDownload', upload.single('pdf'), (req, res) => {
    const filepdf = req.file;
    const { value1, value2 } = req.body;
    const start = parseInt(value1)
    const end = parseInt(value2);
    console.log(filepdf, value1, value2)
    // const token = process.env.token;
    // const endpoint = "https://models.github.ai/inference";
    // const modelName = "openai/gpt-4.1";

    async function create(start, end) {
        try {
            const inputPath = path.join(__dirname, `../tmp_1/${filepdf.filename}`);
            const pdfData = fs.readFileSync(inputPath);
            const pdfDoc = await PDFDocument.load(pdfData);
            const pageCount = pdfDoc.getPageCount();

            if (start < 0 || end >= pageCount || start > end) {
                throw new Error(`Invalid page range. PDF has ${pageCount} pages.`);
            }

            const pdfDocs = await PDFDocument.create();
            const pageIndices = Array.from({ length: end - start + 1 }, (_, i) => start + i);

            const copiedPages = await pdfDocs.copyPages(pdfDoc, pageIndices);

            copiedPages.forEach(page => pdfDocs.addPage(page));
            const outputPath = path.join(__dirname, '../QuizDownload/QuizDownload_output.pdf');
            const pdfBytesNew = await pdfDocs.save();
            fs.writeFileSync(outputPath, pdfBytesNew);

            console.log(`Pages ${start} to ${end} extracted successfully.`);
        } catch (err) {
            console.error("Error while extracting pages:", err.message);
        }
    }

    async function main(originalText) {

        const client = new OpenAI({ baseURL: endpoint, apiKey: token });

        const Prompt = `
         You are a Test bot make the quiz question with multiple choice option accordinly.

          Original Text:
          "${originalText}"
    
            1. Generate all the possible questions with four choices and one correct option from the following **Original Text**.
            2. Provide the correct ans.
            `
        const response = await client.chat.completions.create({
            messages: [
                { role: "system", content: "Make all possible quiz question with four choice and one correct option." },
                { role: "user", content: Prompt }
            ],
            temperature: 1.0,
            top_p: 1.0,
            max_tokens: 1000,
            model: modelName
        });

        const summary = response.choices[0].message.content
        return summary;
    }
    (async () => {
        try {
            await create(start, end)
            console.log("creating the file")
            const readfile = path.join(__dirname, `../QuizDownload/QuizDownload_output.pdf`);
            const dataBuffer = fs.readFileSync(readfile);
            const data = await pdf(dataBuffer);

            const textsummarization = data.text;
            const summary = await main(textsummarization);
            // console.log("Original text:", textsummarization, `\n`)
            if (filepdf && filepdf.path) {
                fs.unlink(filepdf.path, (err) => {
                    if (err) {
                        console.log(err)
                    }
                    else {
                        console.log('file has been deleted')
                    }
                })
            }
            const outputPath = path.join(__dirname, '../QuizQuestion/QuizQuestionAnswer.txt');
            // console.log(outputPath)
            fs.writeFile(outputPath, summary, 'utf8', (err) => {
                if (err) {
                    console.log(err)
                }
            })

            return res.json({ sucess: 'true', message: "Get the file download" })
        } catch (error) {
            console.log(error);
        }
    })();



})

//Quiz game Downlaod pdf---------------------------------------

router.get('/downPdf', (req, res) => {
    console.log('file is ready to download');
    const outputPath = path.join(__dirname, '../QuizQuestion/QuizQuestionAnswer.txt');
    res.download(outputPath, 'QuizQuestionAnswer.txt', (err) => {
        console.log("inside");
        if (err) {
            console.log(err);
        }
        else {
            console.log("file downloaded");
        }
    })
})

//Quiz game database storage and giving to frontend
router.post('/quiz', upload.single('pdf'), (req, res) => {
    console.log(process.env.token)
    const filepdf = req.file;
    const { value1, value2 } = req.body;
    const start = parseInt(value1)
    const end = parseInt(value2);
    console.log(filepdf, value1, value2)
    // const token = process.env.tokens;
    // const endpoint = "https://models.github.ai/inference";
    // const modelName = "openai/gpt-4.1";

    async function create(start, end) {
        try {
            const inputPath = path.join(__dirname, `../tmp_1/${filepdf.filename}`);
            const pdfData = fs.readFileSync(inputPath);
            const pdfDoc = await PDFDocument.load(pdfData);
            const pageCount = pdfDoc.getPageCount();

            if (start < 0 || end >= pageCount || start > end) {
                throw new Error(`Invalid page range. PDF has ${pageCount} pages.`);
            }

            const pdfDocs = await PDFDocument.create();
            const pageIndices = Array.from({ length: end - start + 1 }, (_, i) => start + i);

            const copiedPages = await pdfDocs.copyPages(pdfDoc, pageIndices);

            copiedPages.forEach(page => pdfDocs.addPage(page));
            const outputPath = path.join(__dirname, '../Quiz/Quiz.pdf');
            const pdfBytesNew = await pdfDocs.save();
            fs.writeFileSync(outputPath, pdfBytesNew);

            console.log(`Pages ${start} to ${end} extracted successfully.`);
        } catch (err) {
            console.error("Error while extracting pages:", err.message);
        }
    }

    async function main(originalText) {
        const client = new OpenAI({ baseURL: endpoint, apiKey: token });

        const Prompt = `
            You are an intelligent quiz generation bot.

            Given the following educational text, you must:
            - Generate multiple quiz questions.
            - Each quiz question must include:
            "question", "option1", "option2", "option3", "option4", and "answer"
            - Do NOT leave out any of the six fields.
            - Do NOT duplicate any fields.
            - Do NOT include empty objects.
            - Return ONLY valid JSON — no markdown (\`\`\`), no comments, no explanations.

            EXACT FORMAT:
            [
            {
                "question": "What is ...?",
                "option1": "...",
                "option2": "...",
                "option3": "...",
                "option4": "...",
                "answer": "..."
            },
            ...
            ]

            Text:
            ${originalText}
            `;
        const response = await client.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "You are a helpful assistant that only returns well-formatted JSON arrays of quiz questions. Each object must contain 6 exact fields: question, option1–option4, and answer. Do not include explanations or markdown."
                },
                { role: "user", content: Prompt }
            ],
            temperature: 1.0,
            top_p: 1.0,
            max_tokens: 1000,
            model: modelName
        });

        // console.log(response.choices[0].message.content);
        const summary = response.choices[0].message.content
        //console.log(summary)
        let parsed = []
        try {
            parsed = JSON.parse(summary);
            return parsed;
        } catch (err) {
            console.error("Failed to parse JSON from OpenAI response:", err);
            return;
            // console.log("Raw summary:", summary);
        }

    }

    (async () => {
        try {
            await create(start, end)
            console.log("creating the file")
            const readfile = path.join(__dirname, `../Quiz/Quiz.pdf`);
            const dataBuffer = fs.readFileSync(readfile);
            const data = await pdf(dataBuffer);

            const textsummarization = data.text;
            const summary = await main(textsummarization);
            // console.log("Original text:", summary, `\n`)
            let n;
            try {
                if (summary !== '') {
                    await quiz.deleteMany({})
                    console.log('all data deleted')
                    n = await quiz.insertMany(summary);
                    console.log('Questions with options gets into database')
                }
            } catch (error) {

            }

            if (filepdf && filepdf.path) {
                fs.unlink(filepdf.path, (err) => {
                    if (err) {
                        console.log(err)
                    }
                    else {
                        console.log('file has been deleted')
                    }
                })
            }
            if (n !== '') {
                return res.json({ sucess: 'true', message: "Quiz File is ready to setup" })
            }

        } catch (error) {
            console.log(error);
        }
    })();

})


// Contact us Route--------------------------------------
router.post('/issueHappend', async (req, res) => {
    const { name, phn, email, issue } = req.body;

    if (!name || !phn || !email || !issue) {
        return res.status(500).send({
            sucess: false,
            message: "please enter all the required fields",
            error: 'please enter all the required fields'
        })
    }

    const newIssue = await Issue.create({
        name: name,
        phone: phn,
        email: email,
        issue: issue
    });

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "123abcdef456789ab0@gmail.com",
            pass: "qrie dqoa jayr kice"
        }
    });

    const mailOptions = {
        from: "123abcdef456789ab0@gmail.com",
        to: "osiruss004@gmail.com",
        subject: "Issue Raised",
        text: `An issue is raised by ${name} whose Email is ${email} and the issue is ${issue}`
    }

    transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
            console.log(err);
            return res.json({
                success: false,
                message: "Email not sent",
                error: "Email not sent"
            })
        } else {
            console.log("Email sent" + info);
            return res.json({
                success: true,
                message: "Check your Gmail BOSS you got the issue mail"
            });
        }
    })

    return res.json({
        success: true,
        message: "Your Issue has been saved "
    })
});



//Flash card--------------------------------------
router.post("/submitPDF", upload.single('pdf'), async (req, res) => {
    const filepdf = req.file;
    const { value1, value2 } = req.body;
    const start = parseInt(value1)
    const end = parseInt(value2);

    // const token = process.env.token;
    // const endpoint = "https://models.github.ai/inference";
    // const modelName = "openai/gpt-4.1";

    async function create(start, end) {
        try {
            const inputPath = path.join(__dirname, `../tmp_1/${filepdf.filename}`);
            const pdfData = fs.readFileSync(inputPath);
            const pdfDoc = await PDFDocument.load(pdfData);
            const pageCount = pdfDoc.getPageCount();

            if (start < 0 || end >= pageCount || start > end) {
                throw new Error(`Invalid page range. PDF has ${pageCount} pages.`);
            }

            const pdfDocs = await PDFDocument.create();
            const pageIndices = Array.from({ length: end - start + 1 }, (_, i) => start + i);

            const copiedPages = await pdfDocs.copyPages(pdfDoc, pageIndices);

            copiedPages.forEach(page => pdfDocs.addPage(page));
            const outputPath = path.join(__dirname, '../Flashcard/Flashcard.pdf');
            const pdfBytesNew = await pdfDocs.save();
            fs.writeFileSync(outputPath, pdfBytesNew);

            console.log(`Pages ${start} to ${end} extracted successfully.`);
        } catch (err) {
            console.error("Error while extracting pages:", err.message);
        }
    }
    async function main(originalText) {
        //  console.log(text);
        const client = new OpenAI({ baseURL: endpoint, apiKey: token });

        const Prompt = `
    You are a Test bot make the question with answer accordinly.

    Original Text:
    "${originalText}"
    
    1. Generate all the possible questions with answer from the following **Original Text**.
    `
        const response = await client.chat.completions.create({
            messages: [
                { role: "system", content: "You are the examiner bot generate all possible question with answer for the following given text." },
                { role: "user", content: Prompt }
            ],
            temperature: 1.0,
            top_p: 1.0,
            max_tokens: 1000,
            model: modelName
        });

        // console.log(response.choices[0].message.content);
        const raw = response.choices[0].message.content;
        return raw;
    }

    (async () => {
        try {
            await create(start, end)
            console.log("creating the file")
            const readfile = path.join(__dirname, `../Flashcard/Flashcard.pdf`);
            const dataBuffer = fs.readFileSync(readfile);
            const data = await pdf(dataBuffer);

            const textsummarization = data.text;
            const summary = await main(textsummarization);
            // console.log("Original text:", textsummarization, `\n`)
            if (filepdf && filepdf.path) {
                fs.unlink(filepdf.path, (err) => {
                    if (err) {
                        console.log(err)
                    }
                    else {
                        console.log('file has been deleted')
                    }
                })
            }
            const outputPath = path.join(__dirname, '../OutputPDF/Questions.txt');
            // console.log(outputPath)
            fs.writeFile(outputPath, summary, 'utf8', (err) => {
                if (err) {
                    console.log(err)
                }
            })

            return res.json({ sucess: 'true', message: "Get the file download" })
        } catch (error) {
            console.log(error);
        }
    })();
});


//downlaod flash card
router.get('/downloadPDF', async (req, res) => {
    const questionsPDF = path.join(__dirname, '../OutputPDF/Questions.txt');
    res.download(questionsPDF, 'FlashCard_Question_Answer.txt', (err) => {
        if (err) {
            console.error('File download error:', err);
            res.status(500).send('Could not download file.');
        }
    });
})

// flash card to flashcard section desplaying
router.post('/FlashCardSection', upload.single('pdf'), async (req, res) => {
    const filepdf = req.file;
    const { value1, value2 } = req.body;
    const start = parseInt(value1)
    const end = parseInt(value2);
    console.log(filepdf, value1, value2)
    // const token = process.env.token;
    // const endpoint = "https://models.github.ai/inference";
    // const modelName = "openai/gpt-4.1";

    async function create(start, end) {
        try {
            const inputPath = path.join(__dirname, `../tmp_1/${filepdf.filename}`);
            const pdfData = fs.readFileSync(inputPath);
            const pdfDoc = await PDFDocument.load(pdfData);
            const pageCount = pdfDoc.getPageCount();

            if (start < 0 || end >= pageCount || start > end) {
                throw new Error(`Invalid page range. PDF has ${pageCount} pages.`);
            }

            const pdfDocs = await PDFDocument.create();
            const pageIndices = Array.from({ length: end - start + 1 }, (_, i) => start + i);

            const copiedPages = await pdfDocs.copyPages(pdfDoc, pageIndices);

            copiedPages.forEach(page => pdfDocs.addPage(page));
            const outputPath = path.join(__dirname, '../FlashCardSection/FlashCardSection.pdf');
            const pdfBytesNew = await pdfDocs.save();
            fs.writeFileSync(outputPath, pdfBytesNew);

            console.log(`Pages ${start} to ${end} extracted successfully.`);
        } catch (err) {
            console.error("Error while extracting pages:", err.message);
        }
    }

    async function main(originalText) {
        const client = new OpenAI({ baseURL: endpoint, apiKey: token });

        const Prompt = `
            Your task is to extract clear, complete question-answer pairs strictly from the following text.

            Requirements:
            - Each object must contain exactly two non-empty fields: "question" and "answer".
            - All answers must be directly based on the provided text.
            - Do NOT include any fields other than "question" and "answer".
            - Do NOT include explanations, markdown formatting, or anything outside the JSON array.
            - Do NOT return partial JSON — ensure the array is complete and closed.

            Return exactly in this format:

            [
            {
                "question": "What is the capital of India?",
                "answer": "New Delhi"
            },
            ....
            ]

            Text:
            ${originalText}
            `;

        const response = await client.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "You helpfull bot, generate only valid JSON arrays of question-answer objects. Each object must contain both a 'question' and its 'answer'. No extra text, explanation, or formatting is allowed."
                },
                {
                    role: "user",
                    content: Prompt
                }
            ],
            temperature: 0.7,
            top_p: 1.0,
            max_tokens: 2048,
            model: modelName
        });

        const summary = response.choices[0].message.content;

        let parsed = [];
        try {
            parsed = JSON.parse(summary);
            return parsed;
        } catch (err) {
            console.error("Failed to parse JSON from OpenAI response:", err);
            return;
        }
    }



    (async () => {
        try {
            await create(start, end)
            console.log("creating the file")
            const readfile = path.join(__dirname, `../FlashCardSection/FlashCardSection.pdf`);
            const dataBuffer = fs.readFileSync(readfile);
            const data = await pdf(dataBuffer);

            const textsummarization = data.text;
            const summary = await main(textsummarization);
            // console.log("Original text:", summary, `\n`)
            let n;
            try {
                if (summary !== '') {
                    await Question.deleteMany({})
                    console.log('all data deleted')
                    n = await Question.insertMany(summary);
                    console.log('Questions with options gets into database')

                }
            } catch (error) {

            }

            if (filepdf && filepdf.path) {
                fs.unlink(filepdf.path, (err) => {
                    if (err) {
                        console.log(err)
                    }
                    else {
                        console.log('file has been deleted')
                    }
                })
            }
            if (n !== '') {
                return res.json({ sucess: 'true', message: "Flashcard File is ready to setup" })
            }

        } catch (error) {
            console.log(error);
        }
    })();
})

router.get('/fetchFlashCardData', async (req, res) => {
    try {
        const response = await Question.find({});
        res.json({ success: true, msg: response });
    } catch (error) {
        console.log(error)
    }
})


router.get('/fetchQuizQuestion', async (req, res) => {
    try {
        const response = await quiz.find({});
        res.json({ sucess: true, msg: response });
    } catch (error) {
        console.log(error);
    }
})

module.exports = router;