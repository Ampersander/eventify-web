const { v4: uuidv4 } = require('uuid');
const requestIp = require('request-ip');
const useragent = require('useragent');

// Création de la Factory pour le SDK frontend
class WebAnalyticsSDKFactory {
    createSDK() {
        return new WebAnalyticsSDK();
    }
}

// Classe principale du SDK frontend
class WebAnalyticsSDK {
    constructor(config) {
        // Configuration par défaut
        this.defaultConfig = {
            apiEndpoint: "https://api.webanalytics.com",
            // Autres options de configuration par défaut
        };

        // Fusionner la configuration par défaut avec celle fournie
        this.config = Object.assign({}, this.defaultConfig, config);

        // Autres initialisations nécessaires
        this.init();
    }

    // Initialisation du SDK
    init() {
        // Effectuer les étapes d'initialisation nécessaires
        // Utiliser la configuration (this.config) pour configurer le SDK

        // Récupérer ou générer l'ID du visiteur dès l'accès à la première page
        this.visitorId = this.getVisitorId() || this.generateVisitorId();

        // Stocker l'ID du visiteur dans le stockage local du navigateur
        this.storeVisitorId(this.visitorId);

        const visitorId = this.visitorId; // Récupérer l'ID du visiteur
        const ipAddress = this.getUserIpAddress(); // Retrieve the user's IP address
        const userAgent = this.getUserAgent(); // Retrieve the User-Agent

        // Collecter des informations sur le navigateur de l'utilisateur
        const browserInfo = this.collectBrowserInfo();

        // Collecter des informations sur l'appareil de l'utilisateur
        const deviceInfo = this.collectDeviceInfo();

        // Collecter des informations sur les performances du navigateur
        const performanceInfo = this.collectPerformanceInfo();

        // Collecter des informations de localisation
        const locationInfo = this.collectLocationInfo();

        //send data to backend
        this.sendDataInfoVisitor({
            visitorId,
            ipAddress,
            userAgent,
            browserInfo,
            deviceInfo,
            performanceInfo,
            locationInfo
        });

        // Suivre les visites de page
        this.trackPageVisit();

    }

    // Méthode pour générer un nouvel ID du visiteur
    generateVisitorId() {
        // Generate a UUID v4
        const visitorId = uuidv4();

        // Return the generated visitor ID
        return visitorId;
    }

    // Méthode pour récupérer l'ID du visiteur depuis le stockage local du navigateur
    getVisitorId() {
        return localStorage.getItem("visitorId");
    }

    // Méthode pour stocker l'ID du visiteur dans le stockage local du navigateur
    storeVisitorId(visitorId) {
        localStorage.setItem("visitorId", visitorId);
    }

    // Retrieve the user's IP address
    getUserIpAddress() {
        return requestIp.getClientIp(req);
    }

    // Retrieve the User-Agent
    getUserAgent() {
        return useragent.parse(navigator.userAgent).toString();
    }

    // Méthode pour collecter des informations sur le navigateur de l'utilisateur
    collectBrowserInfo() {
        const browserInfo = {
            name: navigator.userAgent,
            version: navigator.appVersion,
            platform: navigator.platform,
            language: navigator.language
            // Ajoutez d'autres propriétés que vous souhaitez collecter
        };

        // Utilisation des informations du navigateur comme vous le souhaitez (par exemple, enregistrement dans les données d'événement)
        this.trackEvent('browser', 'info', visitorId, browserInfo);
    }

    // Méthode pour collecter des informations sur l'appareil de l'utilisateur
    collectDeviceInfo() {
        const deviceInfo = {
            deviceType: navigator.platform,
            screenWidth: window.screen.width,
            screenHeight: window.screen.height,
            orientation: window.screen.orientation.type
            // Ajoutez d'autres propriétés que vous souhaitez collecter
        };

        // Utilisation des informations de l'appareil comme vous le souhaitez (par exemple, enregistrement dans les données d'événement)
        this.trackEvent('device', 'info', visitorId, deviceInfo);
    }

    // Méthode pour collecter des informations sur les performances du navigateur
    collectPerformanceInfo() {
        const performanceInfo = {
            pageLoadTime: window.performance.timing.loadEventEnd - window.performance.timing.navigationStart,
            serverResponseTime: window.performance.timing.responseEnd - window.performance.timing.requestStart
            // Ajoutez d'autres métriques de performances que vous souhaitez collecter
        };

        // Utilisation des informations de performances comme vous le souhaitez (par exemple, enregistrement dans les données d'événement)
        this.trackEvent('performance', 'info', visitorId, performanceInfo);
    }

    // Méthode pour collecter des informations de localisation
    collectLocationInfo() {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(position => {
                const locationInfo = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    accuracy: position.coords.accuracy
                    // Ajoutez d'autres propriétés de localisation que vous souhaitez collecter
                };

                // Utilisation des informations de localisation comme vous le souhaitez (par exemple, enregistrement dans les données d'événement)
                this.trackEvent('location', 'info', visitorId, locationInfo);
            }, error => {
                console.error('Erreur lors de la récupération de la localisation :', error.message);
                // Ajoutez ici des actions supplémentaires à effectuer en cas d'erreur
            });
        } else {
            console.warn('La géolocalisation n\'est pas prise en charge par ce navigateur.');
            // Ajoutez ici des actions supplémentaires à effectuer si la géolocalisation n'est pas prise en charge
        }
    }

    //Méthode pourtrack page visits
    trackPageVisit() {
        // logic for tracking visits
        const visitCount = parseInt(localStorage.getItem('visitCount')) || 0;
        localStorage.setItem('visitCount', visitCount + 1);
        console.log(`Visit count: ${visitCount + 1}`);

        // track page visits
        const currentPage = window.location.hash;
        const pageVisits = JSON.parse(localStorage.getItem('pageVisits')) || {};

        if (!pageVisits[currentPage]) {
            pageVisits[currentPage] = 1;
        } else {
            pageVisits[currentPage]++;
        }

        localStorage.setItem('pageVisits', JSON.stringify(pageVisits));
        console.log(`Page visits: ${JSON.stringify(pageVisits)}`);

        // add event listener for hashchange to track page visits
        window.addEventListener('hashchange', () => {
            const currentPage = window.location.hash;
            const pageVisits = JSON.parse(localStorage.getItem('pageVisits')) || {};

            if (!pageVisits[currentPage]) {
                pageVisits[currentPage] = 1;
            } else {
                pageVisits[currentPage]++;
            }

            localStorage.setItem('pageVisits', JSON.stringify(pageVisits));
            console.log(`Page visits: ${JSON.stringify(pageVisits)}`);
        });
    }

    // Méthode pour envoyer les données d'événement au backend
    trackEvent(eventType, actionId, visitorId, eventData) {

        // Vérifier si l'événement est valide
        if (!eventType || !actionId || !visitorId) {
            console.error("L'événement est invalide. Veuillez fournir un eventType, un actionId et un visitorId.");
            return;
        }
        // Collecte des informations sur l'événement
        const eventTime = new Date().toISOString();
        // Collecte des informations supplémentaires

        // Préparation des données à envoyer
        const eventPayload = {
            eventType,
            actionId,
            visitorId,
            eventTime,
            eventData, // Autres données spécifiques à l'événement fournies par l'utilisateur
            // Include other machine information in the payload
            // ...
        };

        // Envoi des données à l'API RESTful
        this.sendDataEvent(eventPayload)
            .then(response => {
                // Traitement de la réponse du backend
                if (response.status === 200) {
                    console.log("Événement envoyé avec succès !");
                    // Ajoutez ici des actions supplémentaires à effectuer en cas de succès
                } else {
                    console.error("Erreur lors de l'envoi de l'événement :", response.statusText);
                    // Ajoutez ici des actions supplémentaires à effectuer en cas d'erreur
                }
            })
            .catch(error => {
                console.error("Erreur lors de l'envoi de l'événement :", error.message);
                // Ajoutez ici des actions supplémentaires à effectuer en cas d'erreur
            });
    }

    // Méthode pour suivre un clic
    trackClick(actionId, visitorId, eventData) {
        this.trackEvent("click", actionId, visitorId, eventData);
    }

    // Méthode pour suivre une soumission de formulaire
    trackFormSubmission(formId, visitorId, eventData) {
        const actionId = `form-${formId}-submission`;
        this.trackEvent("form_submission", actionId, visitorId, eventData);
    }

    // Méthode pour suivre un chargement de page
    trackPageLoad(pageId, visitorId, eventData) {
        const actionId = `page-${pageId}-load`;
        this.trackEvent("page_load", actionId, visitorId, eventData);
    }

    // Méthode pour envoyer les données à l'API RESTful
    async sendDataEvent(eventPayload) {
        return fetch(`${this.config.apiEndpoint}/api/events`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(eventPayload),
        })
            .then(response => response.json())
            .catch(error => {
                throw new Error('Erreur lors de l\'envoi des données : ' + error.message);
            });
    }

    // Méthode pour collecter des informations sur les erreurs JavaScript
    collectJavaScriptErrors() {
        window.onerror = (message, source, lineno, colno, error) => {
            // Collecte des informations sur l'erreur JavaScript
            const errorData = {
                message,
                source,
                lineno,
                colno,
                error: error ? error.stack : null, // Collecte de la trace d'erreur complète si disponible
                timestamp: new Date().toISOString()
            };

            // Envoi des données d'erreur à l'API RESTful ou à toute autre destination souhaitée
            this.sendErrorData(errorData)
                .then(response => {
                    console.log("Erreur JavaScript collectée avec succès !");
                    // Ajoutez ici des actions supplémentaires à effectuer en cas de succès
                })
                .catch(error => {
                    console.error("Erreur lors de l'envoi de l'erreur JavaScript :", error.message);
                    // Ajoutez ici des actions supplémentaires à effectuer en cas d'erreur
                });
        };
    }

    // Méthode pour envoyer les données d'erreur à l'API RESTful ou à toute autre destination souhaitée
    async sendErrorData(errorData) {
        return fetch(`${this.config.apiEndpoint}/api/errors`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(errorData),
        })
            .then(response => response.json())
            .catch(error => {
                throw new Error('Erreur lors de l\'envoi des données d\'erreur : ' + error.message);
            });
    }

    async sendDataInfoVisitor(data) {
        return fetch(`${this.config.apiEndpoint}/api/visitors`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then(response => response.json())
            .catch(error => {
                throw new Error('Erreur lors de l\'envoi des données : ' + error.message);
            });
    }
}

// Exemple d'utilisation du SDK avec une configuration personnalisée
const sdkConfig = {
    apiEndpoint: "https://api.mywebanalytics.com",
    // Autres options de configuration personnalisées
};

// Exemple d'utilisation du SDK frontend
const sdkFactory = new WebAnalyticsSDKFactory(sdkConfig);
const sdk = sdkFactory.createSDK();

// Utilisation du SDK pour suivre un événement
const eventType = "click";
const actionId = "button-1";
const visitorId = "123456789";

sdk.trackEvent(eventType, actionId, visitorId);
