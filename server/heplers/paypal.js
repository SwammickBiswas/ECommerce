const paypal = require("paypal-rest-sdk")

paypal.configure({
    mode: 'sandbox',
    client_id: 'ARWPrxQPB6ogfuVAqIwvSz122Hksjc3p6rz00ofr0CNU7FEcI8aph1-S0L1NFaHPiU9jRG-af1XTpfS3',
    client_secret: 'EJEMvGbwLWXWw-nParOu4_GWLatQeSbPPTQSvCyiffSGsLE4I9z9GmmeuVRG_zPSFqmrVdXTAD35_dCs'
})

module.exports = paypal