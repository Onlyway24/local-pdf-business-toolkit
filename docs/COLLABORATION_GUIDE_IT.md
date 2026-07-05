# Guida Collaborazione

Questa guida spiega come collaborare sul progetto senza rompere il ramo principale.

## Repository

Repository pubblico:

    https://github.com/Onlyway24/local-pdf-business-toolkit

## Regola Principale

Prima di fare commit o push, eseguire sempre:

    npm test

Se i test falliscono, non fare push.

## Prima Volta Sul PC

Clonare il progetto:

    git clone https://github.com/Onlyway24/local-pdf-business-toolkit.git
    cd local-pdf-business-toolkit
    npm install
    npm test

## Prima Di Lavorare

Aggiornarsi sempre con l'ultima versione:

    git pull origin main

## Non Lavorare Direttamente Su Main

Il ramo main è la versione stabile.

Per ogni modifica creare un branch separato.

Esempio:

    git pull origin main
    git checkout -b feature/html-report

## Dopo Le Modifiche

Eseguire i test:

    npm test

Poi salvare le modifiche:

    git add .
    git commit -m "Descrizione della modifica"

Poi inviare il branch su GitHub:

    git push origin feature/html-report

## Pull Request

Dopo il push del branch, aprire una Pull Request su GitHub verso main.

La Pull Request serve per controllare le modifiche prima di unirle nel progetto stabile.

## Cosa Non Committare

Non caricare mai:

- documenti veri di clienti
- carte di identità
- contratti privati
- fatture reali
- file sensibili
- cartella outputs/

## Ruoli

Fabio gestisce la direzione del progetto.

I collaboratori lavorano su branch separati e propongono modifiche tramite Pull Request.

## Comandi Utili

Controllare lo stato:

    git status

Aggiornarsi:

    git pull origin main

Creare branch:

    git checkout -b feature/nome-modifica

Eseguire test:

    npm test

Salvare modifiche:

    git add .
    git commit -m "Messaggio chiaro"

Inviare branch:

    git push origin feature/nome-modifica
