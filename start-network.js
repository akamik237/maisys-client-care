// Script de démarrage réseau pour Client-Care
const { exec } = require('child_process');

const HOST = '172.17.184.236';
const PORT = 3002;

console.log(`🚀 Démarrage du Client-Care MAISYS sur ${HOST}:${PORT}`);

// Commande pour démarrer Next.js avec les paramètres réseau
const command = `npx next start --hostname ${HOST} --port ${PORT}`;

const child = exec(command, (error, stdout, stderr) => {
    if (error) {
        console.error(`❌ Erreur: ${error}`);
        return;
    }
    console.log(stdout);
    if (stderr) {
        console.error(stderr);
    }
});

child.stdout.on('data', (data) => {
    console.log(data);
});

child.stderr.on('data', (data) => {
    console.error(data);
});

child.on('close', (code) => {
    console.log(`Processus terminé avec le code ${code}`);
});
