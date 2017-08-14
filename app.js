const {dialog} = require('electron').remote
const {readFileSync, readdirSync, existsSync} = require('fs');
const path = require('path');
const {spawn} = require('child_process');

document.getElementById("main-bttn").addEventListener("click", function(e) {
    dialog.showOpenDialog({properties: [ 'openDirectory']}, function(dir) {
        const dirFiles = readdirSync(dir[0]);
        const pkgJSONPath = path.join(dir[0], 'package.json');

        if(existsSync(pkgJSONPath)) {

            const buttonElem = document.querySelector('section');
            buttonElem.removeChild(buttonElem.children[0]);

            const pkgJSON = require(pkgJSONPath);
            const appendToElement = document.querySelector('section');
            const headerMenu = document.createElement('div');

            const mainArea = document.createElement('div');
            mainArea.className = "main-terminal";
            appendToElement.appendChild(mainArea);
            appendToElement.appendChild(headerMenu);

            headerMenu.className = "header-menu";

            Object.keys(pkgJSON.scripts).forEach( (script) => {
                const scriptSection = document.createElement('div');
                scriptSection.className = "header-section";
                scriptSection.textContent = script;
                let toolTipBox;
                scriptSection.addEventListener("mouseover", function(e) {
                    
                    if(!toolTipBox) {
                    toolTipBox = document.createElement('span');
                    toolTipBox.innerHTML = pkgJSON.scripts[script];
                    toolTipBox.className = "tooltip-box";
                    scriptSection.appendChild(toolTipBox)
                    } else {
                         scriptSection.appendChild(toolTipBox)
                    }
                });
                 scriptSection.addEventListener("mouseleave", function(e) {
                    e.target.removeChild(e.target.children[0]);
                })
                scriptSection.addEventListener("click", function(e) {
                    const cmd = pkgJSON.scripts[script].split(' ');
                    const firstArg = cmd.shift();
                    const child = spawn(firstArg, cmd, {
                        cwd: path.resolve(dir[0])
                    })
                    child.stdout.on('data', (data) => {
                        console.log(`stdout: ${data}`);
                    });
                    
                    child.stderr.on('data', (data) => {
                        console.log(`stderr: ${data}`);
                    });
                    child.on('close', (code) => {
                        console.log(`child process exited with code ${code}`);
                    });
                })

                headerMenu.appendChild(scriptSection);
            })

        }
        /* Display files
        dirFiles.forEach( file => {
            console.log(file)
        })
        */
    })
})