const {dialog} = require('electron').remote
const {readFileSync, readdirSync, existsSync} = require('fs');
const path = require('path');

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
            appendToElement.appendChild(headerMenu);
            headerMenu.className = "header-menu";

            Object.keys(pkgJSON.scripts).forEach( (script) => {
                const scriptSection = document.createElement('div');
                scriptSection.className = "header-section";
                scriptSection.textContent = script;
                let toolTipBox;
                scriptSection.addEventListener("mouseover", function(e) {
                    
                    if(!toolTipBox) {
                    toolTipBox = document.createElement('div');
                    toolTipBox.textContent = pkgJSON.scripts[script];
                    toolTipBox.className = "tooltip-box";
                    scriptSection.appendChild(toolTipBox)
                    } else {
                         scriptSection.appendChild(toolTipBox)
                    }
                });
                 scriptSection.addEventListener("mouseleave", function(e) {
                    e.target.removeChild(e.target.children[0]);
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