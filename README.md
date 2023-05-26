# prototype2
Leggere e scrivere su Modbus/TCP.

## Installare
Tramite WinSCP crea una cartella sotto /home/pi e copiaci il contenuto dello zip.
Poi con la console vai nella cartella creata e dà il comando:

```bash
npm install
```

## Configurare la propria scheda
Il programma si collega con un IP default che sicuramente non è il vostro. Per cambiarlo edita il file:

```bash
model.json
```

E' indifferente editare i file da WinSCP oppure da Linux. Cmq i file json sono suscettibili: basta sbagliare una virgola e il software NON funzionerà.

## Lanciare il programma
Per lanciare il programma aprire una console e dare il comando:

```bash
node server
```

Il programma scrive una dato sulla scheda, poi lo rilegge e lo stampa sulla console.

## Modificare dati e registri di scrittura
Vai alla fine del file server.js, dove trovi le righe:

```bash
modbus.addCmd('RESET')
modbus.addCmd([66, 1])
```

La prima riga cancella tutti i registri da 0 a 99. La seconda scrive 1 nel registro 66. Puoi modificare finchè ti pare.

Buon lavoro!
