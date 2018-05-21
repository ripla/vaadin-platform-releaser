const creator = require('./creator');
const fs = require('fs');

function writeBower(versions, templateFileName, outputFileName) {
    const bowerTemplate = require(templateFileName);

    const bowerResult = creator.createBower(versions, bowerTemplate);

    fs.writeFileSync(outputFileName, bowerResult);
}

function writeMaven(versions, templateFileName, outputFileName) {
    const mavenTemplate = fs.readFileSync(templateFileName, 'utf8');

    const mavenBom = creator.createMaven(versions, mavenTemplate);

    fs.writeFileSync(outputFileName, mavenBom);
}

function writeReleaseNotes(versions, templateFileName, outputFileName) {
    const releaseNoteTemplate = fs.readFileSync(templateFileName, 'utf8');

    const releaseNotes = creator.createReleaseNotes(versions, releaseNoteTemplate);

    fs.writeFileSync(outputFileName, releaseNotes);
}

exports.writeBower = writeBower;
exports.writeMaven = writeMaven;
exports.writeReleaseNotes = writeReleaseNotes;