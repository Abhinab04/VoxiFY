const express = require('express')
const { isUnexpected } = require("@azure-rest/ai-inference");
const ModelClient = require("@azure-rest/ai-inference");
const { AzureKeyCredential } = require("@azure/core-auth")
const axios = require('axios')
const OpenAI = require('openai')
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse');
const { PDFDocument } = require('pdf-lib');
const router = express.Router()
const multer = require('multer');
const Issue = require("../models/Issues");
const nodemailer = require('nodemailer');
const Questions = require("../models/questions");
const PDFDocument = require('pdfkit');


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

router.post('/summary', upload.single('pdf'), (req, res) => {

    const pdfFile = req.file;
    const { value1, value2 } = req.body;
    console.log(value1, value2, pdfFile)
    const token = process.env.token;
    const endpoint = process.env.endpoint;
    const modelName = process.env.modelName;

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


router.post('/chatting', (req, res) => {
    const inputText = req.body.inputText
    console.log(inputText)
    const token = process.env.token;
    const endpoint = process.env.endpoint;
    const modelName = process.env.modelName;
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

router.post('/issueHappend', async (req, res) => {
    const { name, phn, email, issue } = req.body;
    if (!name || !phn || !email || !issue) {
        return res.status(500).send({
            sucess: false,
            message: "please enter all the required fields"
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
                message: " Email not sent",
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



// const OpenAI = require('openai')


const token = "api key";
const endpoint = "https://models.inference.ai.azure.com"
const modelName = "gpt-4o-mini"

async function main(originalText, userText, aisummary) {
    //  console.log(text);
    const client = new OpenAI({ baseURL: endpoint, apiKey: token });

    const Prompt = `
   You are a Test bot. Generate all possible questions and answers from the following original text. 
Return ONLY the result in **pure JSON format** like this:

[
  {
    "question": "What is ...?",
    "answer": "..."
  },
  ...
]

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

    let questions = [];
    try {
        questions = JSON.parse(raw);
    } catch (err) {
        console.error("JSON parsing failed:", err.message);
        return;
    }
    return questions;
}

router.post("/submitPDF", upload.single('pdf'), async (req, res) => {
    try {
        const pdfFile = req.file;
        const { startPage, endPage } = req.body;

        const dataBuffer = fs.readFileSync(pdfFile.path);

        const data = await pdf(dataBuffer);
        const pdfText = data.text;

        const questions = await main(pdfText);

        const doc = new PDFDocument();
        const questionsPDF = path.join(__dirname, 'OutputPDF', 'Questions.pdf');
        doc.pipe(fs.createWriteStream('questionsPDF'));

        doc.fontSize(18).text('Questions from your PDF', { underline: true });
        doc.moveDown();
        const formatted = JSON.stringify(questions, null, 2);
        doc.fontSize(12).text(formatted);
        doc.end();

        await Questions.insertMany(questions);

        res.json(questions);
    } catch (error) {
        console.log("Internal Server Error  " + error)
    }
});

router.get('/downloadPDF', async (req, res) => {
    const questionsPDF = path.join(__dirname, 'OutputPDF', 'Questions.pdf');
    res.download(questionsPDF, 'Your_Questions.pdf', (err) => {
        if (err) {
            console.error('File download error:', err);
            res.status(500).send('Could not download file.');
        }
    });
})

module.exports = router;