import express, { Request, Response } from 'express';
import ExcelJs from 'exceljs';

const router = express.Router();
interface HelperField {
    name: string;
    value?: string;
    values?: string[];
}

interface Helper {
    fields: HelperField[];
}

router.post('/',
    async (req: Request<{}, {}, Helper[]>, res: Response): Promise<void> => {
        try {
            const workbook = new ExcelJs.Workbook();
            const worksheet = workbook.addWorksheet('New Sheet');

            worksheet.columns = [
                { header: 'serviceType', key: 'serviceType' },
                { header: 'organization', key: 'organization' },
                { header: 'fullName', key: 'fullName' },
                { header: 'languages', key: 'languages' },
                { header: 'gender', key: 'gender' },
                { header: 'phone', key: 'phone' },
                { header: 'vehicleType', key: 'vehicleType' },
                { header: 'email', key: 'email' }
            ];

            const helpers = req.body;
            helpers.forEach((element: Helper) => {
                const row: Record<string, any> = {};
                element.fields.forEach((fields: HelperField) => {
                    if (
                        fields.name === 'profile' ||
                        fields.name === 'kycDocument' ||
                        fields.name === 'phonePrefix'
                    ) {
                        return;
                    } else if (fields.name === 'languages') {
                        row['languages'] = fields.values;
                    } else {
                        row[fields.name] = fields.value;
                    }
                });
                worksheet.addRow(row);
            });

            res.setHeader(
                'Content-Type',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            );
            res.setHeader('Content-Disposition', 'attachment; filename=helpers.xlsx');

            await workbook.xlsx.write(res);
            res.end();
        } catch (e: any) {
            console.error('Error generating Excel file:', e);
            res.status(500).json({ error: 'Failed to generate Excel file', details: e.message });
        }
    }
);

export default router;