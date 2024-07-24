
import Poppler from 'pdf-poppler';

import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { convert } from 'pdf-poppler';
import { v4 as uuidv4 } from 'uuid';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// const sourceManager = twain.createSourceManager();
// export const scan = async (req, res) => {
//     try {
//         // Open the first available TWAIN data source (scanner)
//         const source = await sourceManager.selectSource();

//         // Open a session with the source
//         await source.open();
//         // Number of images to acquire

//         // Acquire an image
//         const imageData = await source.acquire();

//         // Close the session
//         await source.close();

//         res.send(imageData);
//     } catch (error) {
//         console.error('Error scanning document:', error);
//         res.status(500).send('Error scanning document');
//     }
// }

