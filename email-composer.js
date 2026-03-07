// capacitor-email-composer plugin wrapper - safe for browser context
if (typeof capacitorExports !== 'undefined') {
    var capacitorEmailComposer = (function (exports, core) {
        'use strict';
        const EmailComposer = core.registerPlugin('EmailComposer');
        exports.EmailComposer = EmailComposer;
        return exports;
    })({}, capacitorExports);
} else {
    var capacitorEmailComposer = { EmailComposer: null };
}
