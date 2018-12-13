'use strict';

const fs = require('fs');
const path = require('path');
const {createLogger, format, transports} = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
var rfs = require('rotating-file-stream');

const env = process.env.NODE_ENV || 'development';
const logDirectory = 'logs';

// create log directory
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

// rotating write stream used by morgan in js-files
const logAccessStream = rfs('access.log', {
    interval: '1d', // rotate daily
    compress: 'gzip',
    path: logDirectory
})

const logger = createLogger({
    
    // change level environment development | production
    level: env === 'production' ? 'info' : 'debug',
    format: format.combine(
        format.label({
            label: path.basename(module.parent.filename)
        }),
        format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        })
    ),
    transports: [
        new transports.Console({
            format: format.combine(
                format.colorize(),
                format.printf(
                    info =>
                    `${info.timestamp} ${info.level} [${info.label}]: ${info.message}`
                )
            )
        }),
        new DailyRotateFile({
            filename: 'app-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            dirname: logDirectory,
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d',
            format: format.combine(
                format.printf(
                    info =>
                    `${info.timestamp} ${info.level} [${info.label}]: ${info.message}`
                )
            )
          })
    ]
});

module.exports = {
    logDirectory: logDirectory,
    logger: logger,
    logAccessStream: logAccessStream
}