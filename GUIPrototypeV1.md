# Graphical User Interface Prototype - CURRENT

Authors: Group 02 - Anita Ascheri, Giorgio Bongiovanni, Paolo Cagliero, Roberto Candela

Date: 03/05/2024

Version: 1.0.0

## Home Page (User)
Home page di un account di tipo User. L'utente può vedere l'elenco di prodotti disponibili. Schiacciando sopra ad un prodotto, si apre una nuova pagina con i dettagli di tale prodotto  

![Home User](./assets/GUIv1/1-home1.png)  

## Selezione Categoria
All'interno della home page, l'utente può cercare un prodotto per modello oppure filtrare l'elenco di prodotti per categoria

![Category selection](./assets/GUIv1/1-home2.png)

## Opzioni utente
Aprendo il menù a tendina accanto al simbolo dell'utente, si può scegliere se visualizzare il profilo o effettuare il logout

![User Option](./assets/GUIv1/1-home3.png)

## Utente non loggato
Nel caso in cui l'utente non sia loggato, il menù a tendina mostra un'opzione per effettuare il login e una per registrarsi

![No User logged](./assets/GUIv1/1-home4.png)

## Home Page (Manager)
Home Page di un account di tipo Manager. Il manager può visualizzare l'elenco dei prodotti da lui caricati, inserirne di nuovi, cancellarli o contrassegnarli come venduti

![Home Manager](./assets/GUIv1/1-home5.png)

## Pagina di Login

![Login](./assets/GUIv1/2-login1.png)

## Pagina di registrazione
L'utente inserisce le proprie informazioni. Dal momento che nella v1 non è prevista un'utenza tecnica che assegni i ruoli, il ruolo di User o Manager è scelto dall'utente in fase di registrazione

![Registrazione](./assets/GUIv1/2-login2.png)

## Profilo User
Profilo di un account di tipo User, qui l'utente può vedere le proprie informazioni e lo storico dei suoi ordini

![User Profile](./assets/GUIv1/3-profile1.png)

## Profilo Manager
Profilo di un account di tipo Manager, qui l'utente può vedere le proprie informazioni, l'elenco degli utenti (con possibilità di eliminarli) e gli arrivi dei prodotti

![Manager Profile](./assets/GUIv1/3-profile2.png)

## Inserimento Prodotto
Pagina attraverso la quale è possibile inserire un nuovo prodotto o registrare l'arrivo di più prodotti dello stesso modello. Se la quantità è impostata a 1, viene richiamata l'API _POST `ezelectronics/products`_, altrimenti viene richiamata l'API _POST `ezelectronics/products/arrivals`_

![Inserimento Prodotto](./assets/GUIv1/4-inserimento-prodotto1.png)

## Pagina Prodotto
In questa pagina vengono visualizzate le informazioni relative ad un prodotto. Inoltre, è possibile aggiungere il prodotto al carrello

![Prodotto](./assets/GUIv1/5-prodotto1.png)

## Prodotto aggiunto al carrello
Una volta che il prodotto è stato aggiunto al carrello, viene mostrato un pop-up di conferma

![Prodotto aggiunto al carrello](./assets/GUIv1/5-prodotto2.png)

## Carrello
Viene mostrato il carrello dell'utente loggato. Da qui è possibile confermare l'acquisto

![Carrello](./assets/GUIv1/6-cart1.png)
