export const editorStyles = [
	{
		css: `
        body {
            font-family: Arial;
            font-size: 16px;
        }
        p {
            font-size: inherit;
            line-height: inherit;
        }
        ul,
        ol {
            margin: 0;
            padding: 0;
        }
    
        ul li,
        ol li {
            margin-bottom: initial;
        }
    
        ul {
            list-style-type: disc;
        }
    
        ol {
            list-style-type: decimal;
        }
    
        ul ul,
        ol ul {
            list-style-type: circle;
        }
    
        .fin-block {
            max-width: 700px;    
            margin-left: auto;
            margin-right: auto;
        }
        .fin-block[data-align="wide"],
        .fin-block.alignwide {
            max-width: 900px;
        }
        .fin-block[data-align="full"],
        .fin-block.alignfull {
            max-width: none;
        }
        `,
	},
];
