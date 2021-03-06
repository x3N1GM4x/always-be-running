<script async src="https://www.googletagmanager.com/gtag/js?id=UA-1954357-10"></script>
<script type="text/javascript">

    // cookie consent
    window.addEventListener("load", function(){
        window.cookieconsent.initialise({
            palette: {
                popup: {
                    background: "#000"
                },
                button: {
                    background: "#f1d600"
                }
            },
            type: "opt-out",
            revokable: true,
            content: {
                allow: 'Allow cookies',
                deny: 'Decline',
                dismiss: 'Allow cookies',
                link: 'Privacy and Cookie Policy',
                href: '/privacy'
            },

            onInitialise: function (status) {
                var didConsent = this.hasConsented();
                window.consentForCookie = didConsent;
                // console.log('onInitialize');
                if (!didConsent) {
                    // disabled cookies
                    window['ga-disable-UA-1954357-10'] = true;
                    // console.log('onInitialize: did not consent');
                }
            },

            onStatusChange: function(status, chosenBefore) {
                var didConsent = this.hasConsented();
                // console.log('onStatusChange');
                if (!didConsent) {
                    // disabled cookies
                    window['ga-disable-UA-1954357-10'] = true;
                    // console.log('onStatusChange: did not consent');
                } else {
                    // enabled cookies
                    makeGtagCall();
                    // console.log('onStatusChange: consent given');
                }

                // reload status text if on policy page
                if (typeof updateConsentDisplay === "function") {
                    updateConsentDisplay();
                }
            }

        });

        // console.log('consent status: ' + window.consentForCookie);
        if (window.consentForCookie) {
            makeGtagCall();
        }
    });

    // google analytics call
    function makeGtagCall() {
        // console.log('firing GA');
        window.dataLayer = window.dataLayer || [];
        function gtag() {
            dataLayer.push(arguments);
        }
        gtag('js', new Date());
        gtag('config', 'UA-1954357-10', { 'anonymize_ip': true }); // anonymize IP address
    }

</script>