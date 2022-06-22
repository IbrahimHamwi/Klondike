
const win = window as any;

export const languages = {
    // Data
    "label_text": {
        "Reset": "リセット",
    }
};

if (!win.languages) {
    win.languages = {};
}

win.languages.ja = languages;

