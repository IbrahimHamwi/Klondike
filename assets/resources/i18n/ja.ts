
const win = window as any;

export const languages = {
    // Data
    "label_text": {
        "Reset": "ăȘă»ăă",
    }
};

if (!win.languages) {
    win.languages = {};
}

win.languages.ja = languages;

