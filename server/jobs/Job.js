import Bull from 'bull';
import { v4 as uuidv4 } from 'uuid';

export default class Job {
    constructor (name) {
        this._job = new Bull(`${name}-${uuidv4()}`, {
            redis: {
                port: process.env.REDIS_PORT,
            },
        });
    }

    _dispatch(process, data = {}) {
        this._job.add(data);
        this._job.process(process);

        return this;
    }

    completed(callback) {
        this._job.on('completed', (job, data) => {
            callback(job, data);
        });

        return this;
    }

    failed(callback) {
        this._job.on('failed', (job, err) => {
            callback(job, err);
        });

        return this;
    }
}
