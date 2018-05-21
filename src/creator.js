const render = require('./replacer.js');

/**
@param {Object} versions data object for product versions.
@param {Object} bowerTemplate template data object to put versions to.
*/
function createBower(versions, bowerTemplate) {
    let jsDeps = {};
    for (let dep in versions) {
        if (versions[dep].jsVersion && !versions[dep].tool) {
            jsDeps[dep] = `${dep}#${versions[dep].jsVersion}`;
        }
    }

    bowerTemplate.dependencies = jsDeps;

    return JSON.stringify(bowerTemplate, null, 2);
}

/**
@param {Object} versions data object for product versions.
@param {String} bowerTemplate template string to replace versions in.
*/
function createMaven(versions, mavenTemplate) {
    const allVersions = Object.assign({}, versions.core, versions.vaadin);

    let mavenDeps = '';
    for (let dependencyName in allVersions) {
        const dependency = allVersions[dependencyName];
        if (dependency.javaVersion && !dependency.tool) {
            const propertyName = dependencyName.replace(/-/g, '.') + '.version';
            const mavenDependency = `        <${propertyName}>${dependency.javaVersion}</${propertyName}>\n`;
            mavenDeps = mavenDeps.concat(mavenDependency);
        }
    }

    const mavenBom = render(mavenTemplate, { version: versions.platform, javadeps: mavenDeps });

    return mavenBom;
}

/**
@param {Object} versions data object for product versions.
@param {String} releaseNoteTemplate template string to replace versions in.
*/
function createReleaseNotes(versions, releaseNoteTemplate) {
    return render(releaseNoteTemplate, versions);
}

exports.createBower = createBower;
exports.createMaven = createMaven;
exports.createReleaseNotes = createReleaseNotes;
