const expect = require('chai').expect;
const creator = require('../src/creator.js');


describe('Bower creator', function () {
    it('should replace dependencies with a valid object of Javascript versions', function () {
        const testVersions = {
            "foo-bar": {
                "javaVersion": "2.22",
                "jsVersion": "1.11"
            }
        };

        const testTemplate = {
            foo: "bar",
            dependencies: "removed"
        };

        const expectedResult = {
            foo: "bar",
            dependencies: {
                "foo-bar": "foo-bar#1.11",
            }
        };

        const result = creator.createBower(testVersions, testTemplate);

        expect(result).to.equal(JSON.stringify(expectedResult, null, 2));
    });

    it('should skip pure java dependencies', function () {
        const testVersions = {
            "bar-foo": {
                "javaVersion": "2.22"
            }
        };

        const testTemplate = {
            foo: "bar",
            dependencies: "removed"
        };

        const expectedResult = {
            foo: "bar",
            dependencies: {}
        };

        const result = creator.createBower(testVersions, testTemplate);

        expect(result).to.equal(JSON.stringify(expectedResult, null, 2));
    });
});

describe('Maven creator', function () {
    it('should replace dependencies with a valid XML of Java versions', function () {
        const testVersions = {
            "core": {
                "foo-bar": {
                    "javaVersion": "2.22",
                    "jsVersion": "1.11"
                }
            }
        };

        const testTemplate = "<dependencies>\n{{javadeps}}</dependencies>";

        const expectedResult = "<dependencies>\n        <foo.bar.version>2.22</foo.bar.version>\n</dependencies>";

        const result = creator.createMaven(testVersions, testTemplate);

        expect(result).to.equal(expectedResult);
    });

    it('should replace version with a version from input', function () {
        const testVersions = {
            "platform": "42.0.1"
        };

        const testTemplate = "<version>{{version}}</version>";

        const expectedResult = "<version>42.0.1</version>";

        const result = creator.createMaven(testVersions, testTemplate);

        expect(result).to.equal(expectedResult);
    });

    it('should skip pure Javascript dependencies', function () {
        const testVersions = {
            "core": {
                "foo-bar": {
                    "javaVersion": "2.22",
                    "jsVersion": "1.11"
                },
                "bar-foo": {
                    "jsVersion": "2.22"
                }
            }
        };

        const testTemplate = "<dependencies>\n{{javadeps}}</dependencies>";

        const expectedResult = "<dependencies>\n        <foo.bar.version>2.22</foo.bar.version>\n</dependencies>";

        const result = creator.createMaven(testVersions, testTemplate);

        expect(result).to.equal(expectedResult);
    });
});