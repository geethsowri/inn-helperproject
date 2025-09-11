const express = require('express');
const router = express.Router();
const Listing = require('../db/listings');

router.post('/', async (req, res) => {
    try{
        const excelJs = require('exceljs');
        const workbook = new excelJs.Workbook();

        const worksheet = workbook.addWorksheet('New Sheet');

        worksheet.columns = [
        { header: 'serviceType', key: 'serviceType' },
        { header: 'organization', key: 'organization' },
        { header: 'fullName', key: 'fullName' },
        { header: 'languages', key: 'languages' },
        { header: 'gender', key: 'gender' },
        { header: 'phone', key: 'phone' },
        { header: 'vehicleType', key: 'vehicleType' },
        { header: 'email', key: 'email' },
        ];

        let helpers = req.body;
        helpers.forEach(element => {
            const row = {};
            element.fields.forEach(field => {
                if(field.name === 'profile' || field.name === 'kycDocument' || field.name === 'phonePrefix'){}
                else if (field.name === 'languages') {
                row['languages'] = field.values;
                } else {
                row[field.name] = field.value;
                }
            })
            worksheet.addRow(row);
        });

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=helpers.xlsx');

        await workbook.xlsx.write(res);
        res.end();     

    } catch(e) {
        console.log(e);
    }
})

module.exports = router;