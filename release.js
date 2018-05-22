const ST = require('stjs');
const path = require('path');
const fs = require('fs');
const argv = require('minimist')(process.argv.slice(2));

const writer = require('./src/writer');

const versionsFileName = './versions.json';
const resultsDir = './results';

const inputVersions = require(versionsFileName);

const coreBowerTemplateFileName = path.resolve('./templates/template-vaadin-core-bower.json');
const coreBowerResultFileName = path.resolve('./results/vaadin-core-bower.json');

const vaadinBowerTemplateFileName = path.resolve('./templates/template-vaadin-bower.json');
const vaadinBowerResultFileName = path.resolve('./results/vaadin-bower.json');

const mavenBomTemplateFileName = path.resolve('./templates/template-vaadin-bom.xml');
const mavenBomResultFileName = path.resolve('./results/vaadin-bom.xml');

const releaseNotesTemplateFileName = path.resolve('./templates/template-release-notes.md');
const releaseNotesResultFileName = path.resolve('./results/release-notes.md');

if(!argv['platform']) {
    console.log('Specify platform version as \'-platform=11.12.13\'');
    process.exit(1);
}

const versions = ST.select(inputVersions).transform({ version: argv['platform'] }).root();

if (!fs.existsSync(resultsDir)) {
    fs.mkdirSync(resultsDir);
}

writer.writeBower(versions.core, coreBowerTemplateFileName, coreBowerResultFileName);
writer.writeBower(versions.vaadin, vaadinBowerTemplateFileName, vaadinBowerResultFileName);
writer.writeMaven(versions, mavenBomTemplateFileName, mavenBomResultFileName);
writer.writeReleaseNotes(versions, releaseNotesTemplateFileName, releaseNotesResultFileName);