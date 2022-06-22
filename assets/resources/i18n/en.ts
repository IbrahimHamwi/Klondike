
const win = window as any;

export const languages = {
    // Data
    "label_text": {
        "Reset": "Reset",
    }
};

if (!win.languages) {
    win.languages = {};
}

win.languages.en = languages;


