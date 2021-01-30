class LineTyper extends HTMLElement {
    constructor() {
        super();
        this.root = this.attachShadow({ mode: 'open' });
        this.render = this.render.bind(this);
        this.typeNextLetter = this.typeNextLetter.bind(this);
        this.render();
    }
    static get observedAttributes() {
        return ['text', 'path'];
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue) return;
        if (name === 'text') {
            this.textArray = newValue.split('');
            setTimeout(this.typeNextLetter, 1500);
        } else {
            this.root.getElementById('pathName').innerHTML = `&nbsp;${newValue}&nbsp;`;
        }

    }
    typeNextLetter() {
        const nextLetter = this.textArray.shift();
        const randomVariability = Math.random() * 200;
        setTimeout(_ => {
            this.root.getElementById('textLine').innerHTML = this.root.getElementById('textLine').innerHTML + nextLetter;
            // If this is the final letter
            if (!this.textArray[0]) {
                const className = this.hasAttribute('showBlinkingCaret') ? 'blink' : 'hide'
                this.root.getElementById('caret').className = `${className} caret`;
                // Insert pause to mock computer processing request
                return setTimeout(_ => {
                    this.root.getElementById('resultsDiv').innerHTML = (this.properties.results || []).map(result => `<div>${result}</div>`).join('');
                    // View results before typing next line
                    this.properties.onComplete && this.properties.onComplete();
                }, 300)
            }
            this.typeNextLetter();
        }, randomVariability + 100);
    }
    render() {
        this.root.innerHTML = /*html*/`
                <style>
                .blink {
                    color: white;
                    animation: blink 1s infinite;
                    animation-delay: 0.1s;
                    font-weight: 900;
                }
                .caret {
                    margin-top: -2px;
                    margin-left: -4px;
                    font-size: 18px;
                    font-weight: 900;
                    color: rgb(44 207 66);
                }
                .hide {
                    color: rgb(43,43,43);
                }
                .wrapper {
                    line-height: 20px;
                    background-color: rgb(43,43,43);
                    display: flex;
                    color: rgb(44 207 66);
                }
                .path {
                    background: rgba(0,122, 204,1);
                    display: flex;
                    width: fit-content;
                    color: white;
                }
                #arrow-black {
                    width: 0; 
                    height: 0; 
                    border-top: 10px solid transparent;
                    border-bottom: 10px solid transparent;
                    border-left: 12px solid rgb(43,43,43);
                    background: rgba(0,122, 204,1);
                }
                #arrow-blue {
                    width: 0; 
                    height: 0; 
                    border-top: 10px solid transparent;
                    border-bottom: 10px solid transparent;
                    border-left: 12px solid rgba(0,122, 204,1);
                    background: rgb(43,43,43);
                }
                #resultsDiv {
                    display: grid;
                    grid-template-columns: repeat(7, 1fr);
                    color: rgba(0,122, 204,1);
                    color: white;
                }
                @media only screen and (max-width: 1000px) {
                    #resultsDiv {
                        grid-template-columns: repeat(4, 1fr)
                    }
                }
                @media only screen and (max-width: 500px) {
                    #resultsDiv {
                        grid-template-columns: repeat(2, 1fr)
                    }
                }
                @keyframes blink {
                    from {
                        opacity: 0
                    }
                    50% {
                        opacity: 1
                    }
                    100% {
                        opacity: 0
                    }
                }
            </style>
            <div class="wrapper">
                <div class="path">
                    <div id="arrow-black"></div>
                    <div id="pathName"></div>
                    <div id="arrow-blue"></div>
                </div>
                &nbsp;
                <div id="textLine"></div>
                <div class="blink caret" id="caret">|</div>
            </div>
            <div id="resultsDiv"></div>
        `;
    }
}
window.customElements.define('line-typer', LineTyper);


const terminalLines = [
    {
        path: '~/Jon/Skills',
        input: 'ls',
        results: ['React', 'JavaScript', 'GraphQL', 'Node', 'HTML', 'CSS', 'SCSS', 'Web-Components', 'Ruby', 'Swift', 'SwiftUI'],
    },
    {
        path: '~/Jon/Skills',
        input: 'cd ..',
        results: [],
    },
    {
        path: '~/Jon',
        input: 'ls',
        results: ['Skills', 'Interests', 'My-Work'],
    },
    {
        path: '~/Jon',
        input: 'cd Interests',
        results: [],
    },
    {
        path: '~/Jon/Interests',
        input: 'ls',
        results: ['Code', 'Baseball', 'Cars', 'Technology', 'Games']
    },
    {
        path: '~/Jon/Interests',
        input: 'cd ..',
        results: [],
    },
    {
        path: '~/Jon',
        input: 'cd My-Work',
        results: [],
    },
    {
        path: '~/Jon/My-Work',
        input: 'ls',
        results: ['Breeze_Web', 'Go', 'CareCloud', 'Edukit', 'Wyncode'],
    },
    {
        path: '~/Jon/My-Work',
        input: 'mkdir ??',
        results: [],
    },
];

class TerminalEmulator extends HTMLElement {
    constructor() {
        super();
        this.root = this.attachShadow({ mode: 'open' });
        this.render = this.render.bind(this);
        this.addLineTypers = this.addLineTypers.bind(this);
        this.render();
        this.addLineTypers();
    }

    addLineTypers() {
        if (!terminalLines.length) return;
        const lineTyper = document.createElement('line-typer');
        const { path, input, results } = terminalLines.shift();
        lineTyper.setAttribute('text', input);
        lineTyper.setAttribute('path', path);
        const showBlinkingCaret = !terminalLines.length;
        showBlinkingCaret && lineTyper.setAttribute('showBlinkingCaret', true)
        lineTyper.properties = { onComplete: this.addLineTypers, results };
        this.root.querySelector('div#lineTypers').appendChild(lineTyper)
    }

    render() {
        const { innerWidth } = window;
        const isSmall = innerWidth < 1000;
        this.root.innerHTML = /*html*/`
            <style>
                .wrapper {
                    animation: appear ease-out 0.8s;
                    color: white;
                    background-color: rgb(43,43,43);
                    border-radius: 6px;
                    height: 40vh;
                    width: 60vw;
                    max-width: 1000px;
                    min-height: 500px;
                    padding: 14px;
                    padding-top: 36px;
                    position: relative;
                    -webkit-box-shadow: 0px 0px 26px 3px rgba(0,0,0,0.2);
                    -moz-box-shadow: 0px 0px 26px 3px rgba(0,0,0,0.2);
                    box-shadow: 0px 0px 26px 3px rgba(0,0,0,0.2);
                }
                @media only screen and (max-width: 1000px) {
                    .wrapper {
                        width: 90vw;
                    }
                }
                .close {
                    background-color: rgb(255, 87, 80);
                    height: 10px;
                    width: 10px;
                    border-radius: 50%;
                    position: absolute;
                    top: 10px;
                    left: 10px;
                }
                .minimize {
                    background-color: rgb(255 191 46);
                    height: 10px;
                    width: 10px;
                    border-radius: 50%;
                    position: absolute;
                    top: 10px;
                    left: 25px;
                }
                .maximize {
                    background-color: rgb(44 207 66);
                    height: 10px;
                    width: 10px;
                    border-radius: 50%;
                    position: absolute;
                    top: 10px;
                    left: 40px;
                }
                @keyframes appear {
                    0% {
                        transform: scale(0);
                    }
                    80% {
                        transform: scale(1.1);
                    }
                    100% {
                        transform: scale(1);
                    }
                }
            </style>
            <div class="wrapper">
                <div class='close'></div>
                <div class='minimize'></div>
                <div class='maximize'></div>
                <div id="lineTypers"><div>
            </div>
        `;
    }
}
window.customElements.define('terminal-emulator', TerminalEmulator);