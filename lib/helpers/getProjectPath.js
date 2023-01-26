
function getProjectPath(context) {
    const filePath = context.getFilename();
    const normalizedPath = filePath.replace(/[\\]+/g, "/")
    const projectPath = normalizedPath?.split('src')[1]
    return projectPath
    }

    module.exports = {
        getProjectPath
    }