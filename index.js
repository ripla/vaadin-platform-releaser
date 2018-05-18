// const render = require('json-templater/string');
const fs = require('fs');
const ST = require('stjs');
var render = require('json-templater/string');

const versionsFileName = './versions.json';
const resultsDir = './results';

const inputVersions = require(versionsFileName);
const versions = ST.select(inputVersions).transform({ version: "10.0.0.beta9" }).root();


if (!fs.existsSync(resultsDir)) {
    fs.mkdirSync(resultsDir);
}

writeBower(versions.core, './templates/template-vaadin-core-bower.json', './results/vaadin-core-bower.json');
writeBower(versions.vaadin, './templates/template-vaadin-bower.json', './results/vaadin-bower.json');
writeMaven(versions, './templates/template-vaadin-bom.xml', './results/vaadin-bom.xml')

function writeMaven(versions, templateFileName, outputFileName) {
    const mavenTemplate = fs.readFileSync(templateFileName, 'utf8');
    const allVersions = Object.assign({}, versions.core, versions.vaadin);

    let mavenDeps = '';
    for (let dependencyName in allVersions) {
        const dependency = allVersions[dependencyName];
        if (dependency.javaVersion && !dependency.tool) {
            const propertyName = dependencyName.replace(/-/g, '.');
            const mavenDependency = `        <${propertyName}.version>${dependency.javaVersion}</${propertyName}>\n`;
            mavenDeps = mavenDeps.concat(mavenDependency);
        }
    }

    const mavenBom = render(mavenTemplate, { version: versions.platform, javadeps: mavenDeps});

    fs.writeFileSync(outputFileName, mavenBom);
}

function writeBower(versions, templateFileName, outputFileName) {
    const bowerTemplate = require(templateFileName);

    let jsDeps = {};
    for (let dep in versions) {
        if (versions[dep].jsVersion && !versions[dep].tool) {
            jsDeps[dep] = `${dep}#${versions[dep].jsVersion}`;
        }
    }

    bowerTemplate.dependencies = jsDeps;

    fs.writeFileSync(outputFileName, JSON.stringify(bowerTemplate, null, 2));
}