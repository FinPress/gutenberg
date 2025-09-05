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
    
        .fp-block {
            max-width: 700px;    
            margin-left: auto;
            margin-right: auto;
        }
        .fp-block[data-align="wide"],
        .fp-block.alignwide {
            max-width: 900px;
        }
        .fp-block[data-align="full"],
        .fp-block.alignfull {
            max-width: none;
        }
        `,
	},
];
