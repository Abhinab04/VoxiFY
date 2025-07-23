const express = require('express')
const router = express.Router();
const multer = require('multer');
const path = require('path')
const fs = require('fs')
const { PDFDocument } = require('pdf-lib');
const pdf = require('pdf-parse');
const gTTS = require('gtts');
const audioconcat = require('audioconcat')
const ffmpegPath = require('ffmpeg-static');
process.env.PATH += path.delimiter + path.dirname(ffmpegPath);

const port = 3000;

function ensureFoldersExist() {
    const folders = [
        path.join(__dirname, '../tmp'),
        path.join(__dirname, '../extract'),
        path.join(__dirname, '../Text'),
        path.join(__dirname, '../audio'),
        path.join(__dirname, '../Output')
    ];

    folders.forEach(folder => {
        if (!fs.existsSync(folder)) {
            fs.mkdirSync(folder, { recursive: true });
            console.log(`Created folder: ${folder}`);
        }
    });
}


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const tmpPath = path.join(__dirname, '../tmp');
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

router.post('/download', upload.single('pdf'), async (req, res) => {
    //getting the value,pdf from frontend    
    ensureFoldersExist();
    const { value1, value2 } = req.body;
    const pdfFile = req.file;

    console.log('Received values:', value1, value2);
    console.log('Received file:', pdfFile);

    // You can now save file, convert to audio, etc.-------------------------
    async function create(start, end) {
        let pdfdata = fs.readFileSync(path.join(__dirname, `../tmp/${pdfFile.filename}`))
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
        const outputPath = path.join(__dirname, '../extract/extracted_output.pdf');
        fs.writeFileSync(outputPath, pdfBytesNew);
        console.log(`Page extracted successfully`);
    }

    //Extracting the file -------------------------


    async function extract(filename) {
        let pdfdata = fs.readFileSync(filename)
        await pdf(pdfdata)
            .then(function (data) {
                const tmpPath = path.join(__dirname, '../Text');
                if (!fs.existsSync(tmpPath)) {
                    fs.mkdirSync(tmpPath, { recursive: true });
                }
                const TextPath = path.join(__dirname, '../Text/Text_output.pdf');
                fs.writeFileSync(TextPath, data.text)
                console.log('Text_output has been created')
            })

    }

    //changing into audio files-------------------------------

    const outputDir = path.join(__dirname, '../audio');
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir);
    }


    // Split into smaller chunks (each chunk < 3000 characters to be safe)
    function splitIntoChunks(text, maxLength = 3000) {
        const lines = text.split('\n');
        const chunks = [];
        let temp = '';
        for (const line of lines) {
            if ((temp + line).length < maxLength) {
                temp += line + ' ';
            } else {
                chunks.push(temp.trim());
                temp = line + ' ';
            }
        }
        if (temp) chunks.push(temp.trim());
        return chunks;
    }

    async function generateAudioChunks(text) {
        const outputDir = path.join(__dirname, '../audio');
        if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

        const chunks = splitIntoChunks(text);
        for (let i = 0; i < chunks.length; i++) {
            const gtts = new gTTS(chunks[i], 'en');
            const filename = path.join(outputDir, `chunk_${i}.mp3`);
            await new Promise((resolve, reject) => {
                gtts.save(filename, err => {
                    if (err) return reject(err);
                    console.log(`Saved: ${filename}`);
                    resolve();
                });
            });
        }
        console.log('All audio chunks generated successfully!');
    }


    //Concating all files into one file

    const folderpath = path.join(__dirname, `../audio`);
    const outputPath = path.join(__dirname, '../Output')


    function Output(folderpath, outputPath) {
        return new Promise((resolve, reject) => {
            function Concat(folderpath) {
                const files = fs.readdirSync(folderpath)
                const supportedExtensions = ['.mp3'];
                return files
                    .filter(file => supportedExtensions.includes(path.extname(file).toLowerCase()))
                    .map(file => path.join(folderpath, file));
            }

            const result = Concat(folderpath);
            if (!fs.existsSync(outputPath)) {
                fs.mkdirSync(outputPath);
            }

            audioconcat(result)
                .concat(path.join(outputPath, 'output.mp3'))
                .on('start', command => console.log('ffmpeg started:', command))
                .on('error', (err, stdout, stderr) => {
                    console.error('Concat error:', err);
                    console.error(stderr);
                    reject(err);
                })
                .on('end', output => {
                    console.log('Audio created:', output);
                    resolve(output);
                });
        });
    }



    try {
        await create(value1, value2);
        const extractPath = (path.join(__dirname, '../extract/extracted_output.pdf'));
        await extract(extractPath);

        const text = fs.readFileSync(path.join(__dirname, '../Text/Text_output.pdf'), 'utf8');
        await generateAudioChunks(text);

        await Output(folderpath, outputPath)


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

        fs.readdir(path.join(__dirname, "../audio"), (err, files) => {
            if (err) {
                console.error('Failed to read audio folder:', err);
                return;
            }
            files.forEach(file => {
                const filePath = path.join(path.join(__dirname, "../audio"), file);
                fs.unlink(filePath, err => {
                    if (err) console.error(`Failed to delete ${file}:`, err);
                    else console.log(`Deleted: ${file}`);
                });
            });
        });

        return res.json({ sucess: 'true', message: 'Received and processed successfully' });
    } catch (error) {
        console.log(error)
    }


})

router.get('/down', (req, res) => {
    //  console.log("coming inside here!!!!!")
    const outpath = path.join(__dirname, "../Output/output.mp3")
    res.download(outpath, (err) => {
        if (err) {
            console.log(err)
            return res.json({ sucess: 'false', message: 'Cannot able to download' })
        }
    })
})


module.exports = router;
