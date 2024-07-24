import FileData from '../models/FileData.js';
import Tagging from '../models/tagging.js';
import Warehouse from '../models/warehouse.js';
import { Op, where } from 'sequelize';
import xlsx from 'xlsx';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



export const getAnalysisData = async (req, res) => {
    try {
        const fileData = await FileData.findAll();

        const taggingData = await Tagging.findAll();
        const warehouseData = await Warehouse.findAll();
        console.log(fileData.length)
        console.log(warehouseData.length)
        console.log(filterTaggingData(taggingData))

        const fileDataCount = fileData.length;
        const warehouseCount = warehouseData.length;
        const taggingCount = filterTaggingData(taggingData).length;
        res.status(200).json({ success: true, message: "Analysis data", data: { fileDataCount, warehouseCount, taggingCount } });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Error in get analysis data', error });
    }
}

export const downloadDataCsv = async (req, res) => {
    try {
        const { from, to } = req.body;

        // Parse the dates from the request body
        const fromDate = new Date(from);
        const toDate = new Date(to);

        if (isNaN(fromDate) || isNaN(toDate)) {
            return res.status(400).json({ error: 'Invalid date range' });
        }

        // Ensure the dates are in the correct order
        if (fromDate > toDate) {
            return res.status(400).json({ error: '"from" date should be earlier than "to" date' });
        }

        // Fetch FileData within the date range
        const fileData = await FileData.findAll({
            where: {
                createdAt: {
                    [Op.between]: [fromDate, toDate]
                }
            }
        });

        const fileDataList = await Promise.all(fileData.map(async (file) => {
            const tagging = await Tagging.findAll({ where: { fileDataId: file.id } });
            const filteredTagging = filterTaggingData(tagging);
            const warehouse = await Warehouse.findAll({ where: { fileDataId: file.id } });

            return { fileData: file, tagging: filteredTagging, warehouse: warehouse };
        }));

        if (fileDataList.length === 0) {
            return res.status(404).json({ success: false, message: 'No Data Found' });
        }

        // Generate the Excel file
        const filePath = await generateExcelFile(fileDataList);

        // Send the file as a response
        res.download(filePath, 'data.xlsx', async (err) => {
            if (err) {
                console.error('Error downloading the file:', err);
                return res.status(500).send('Error downloading the file');
            }

            // Delete the file after download
            try {
                await fs.unlink(filePath);
            } catch (unlinkErr) {
                console.error('Error deleting the file:', unlinkErr);
            }
        });
    } catch (error) {
        console.error('Error generating the file:', error);
        res.status(500).json({ success: false, message: 'Error in generating the Excel file', error });
    }
};




export const generateExcelFile = async (data) => {
    const workbook = xlsx.utils.book_new();

    // Prepare a single sheet with multiple rows
    const sheetData = [];

    // Add headers
    sheetData.push([
        'Index',
        'Barcode',
        'CSA',
        'Type of Request',
        'Entry Date At',
        'Tagging Status',
        'Warehousing Status',
        'Warehousing Details'
    ]);

    // Add data rows
    data.forEach((entry, index) => {
        // Add fileData information
        const fileDataRow = [
            index + 1,
            entry.fileData.barcode,
            entry.fileData.CSA,
            entry.fileData.typeOfRequest,
            entry.fileData.createdAt,
            entry.tagging.length > 0 ? "Done" : "Pending",
            entry.warehouse.length > 0 ? "Done" : "Pending",
        ];

        // Join details for Tagging and Warehousing
        const warehouseDetails = entry.warehouse.map(wh => `Box: ${wh.boxNumber}, Shelf: ${wh.shelfNumber}, Rack: ${wh.rackNumber}`).join('; ');

        // Add details to the row
        sheetData.push([
            ...fileDataRow,
            warehouseDetails
        ]);
    });

    // Create the sheet and add to the workbook
    const sheet = xlsx.utils.aoa_to_sheet(sheetData);
    xlsx.utils.book_append_sheet(workbook, sheet, 'Data');

    const downloadDir = path.join(__dirname, '..', 'downloads');
    const filePath = path.join(downloadDir, `${Date.now()}_data.xlsx`);

    try {
        // Ensure the downloads directory exists
        fs.mkdirSync(downloadDir, { recursive: true });

        // Write the workbook to the file
        xlsx.writeFile(workbook, filePath);
    } catch (err) {
        console.error('Error creating directory or writing file:', err);
        throw err;
    }

    return filePath;
};

const filterTaggingData = (data) => {
    const uniqueFileData = data.reduce((acc, item) => {
        // Check if the fileDataId is already in the accumulator
        if (!acc.find(entry => entry.fileDataId === item.fileDataId)) {
            acc.push(item); // Add the item if its fileDataId is unique
        }
        return acc;
    }, []);
    return uniqueFileData;

}



