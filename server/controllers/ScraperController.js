import { v4 as uuidv4 } from 'uuid';
import { LIST_AM, AUTO_AM } from '../constants';
import ScrappingHistory from '../models/scrappingHistory';
import BadRequestHttpException from '../exceptions/BadRequestHttpException';
import Logger from '../modules/Logger';
import ScraperService from '../services/ScraperService';

export default class ScraperController {
    static async start(req, res) {
        try {
            const { source, usdRate, settingsFormData = [] } = req.body;

            if (![AUTO_AM.NAME, LIST_AM.NAME].includes(source) || isNaN(usdRate)) {
                throw new BadRequestHttpException();
            }

            const uuid = uuidv4();

            const scraperService = new ScraperService(source);
            await scraperService.start(uuid, usdRate, settingsFormData);

            return res.json({
                success: true,
                data: {
                    uuid,
                    status: ScrappingHistory.PENDING,
                },
            });
        } catch (e) {
            Logger().error({ message: 'ScraperController:start:FAILED', ERROR: e.message });

            throw new BadRequestHttpException();
        }
    }
}
