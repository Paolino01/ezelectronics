# Requirements Document - future EZElectronics

Date:

Version: V1 - description of EZElectronics in FUTURE form (as proposed by the team)

| Version number | Change                                                             |
| :------------: | :----------------------------------------------------------------: |
|     v2.1.0     | Added Stakeholders and Stories and personas                        |
|     v2.2.0     | Added Functional and Non Functional Requirements                   |
|     v2.3.0     | Added Use Case Diagram and Use Cases                               |
|     v2.4.0     | Added Glossary, System Design and Deployment Diagram               |
|     v2.4.1     | Added Domain Non Functional Requirements                           |
|     v2.4.2     | Fixed Glossary                                                     |
|     v2.4.3     | Removed Database from Interfaces, Stakeholders and Context Diagram |

# Contents

- [Requirements Document - future EZElectronics](#requirements-document---future-ezelectronics)
- [Contents](#contents)
- [Informal description](#informal-description)
- [Stakeholders](#stakeholders)
- [Context Diagram and interfaces](#context-diagram-and-interfaces)
  - [Context Diagram](#context-diagram)
  - [Interfaces](#interfaces)
- [Stories and personas](#stories-and-personas)
    - [Customer](#customer)
    - [Manager](#manager)
- [Functional and non functional requirements](#functional-and-non-functional-requirements)
  - [Functional Requirements](#functional-requirements)
  - [Non Functional Requirements](#non-functional-requirements)
- [Use case diagram and use cases](#use-case-diagram-and-use-cases)
  - [Use case diagram](#use-case-diagram)
    - [Use case 1, Login di un utente (UC1)](#use-case-1-login-di-un-utente-uc1)
        - [Scenario 1.1](#scenario-11)
        - [Scenario 1.2](#scenario-12)
        - [Scenario 1.2.1](#scenario-121)
        - [Scenario 1.3](#scenario-13)
        - [Scenario 1.4](#scenario-14)
    - [Use case 2, Logout di un utente (UC2)](#use-case-2-logout-di-un-utente-uc2)
        - [Scenario 2.1](#scenario-21)
        - [Scenario 2.2](#scenario-22)
    - [Use case 3, Creazione di un nuovo utente (UC3)](#use-case-3-creazione-di-un-nuovo-utente-uc3)
        - [Scenario 3.1](#scenario-31)
        - [Scenario 3.2](#scenario-32)
        - [Scenario 3.3](#scenario-33)
        - [Scenario 3.4](#scenario-34)
    - [Use case 4, Gestione degli utenti (UC4)](#use-case-4-gestione-degli-utenti-uc4)
        - [Scenario 4.1](#scenario-41)
        - [Scenario 4.2](#scenario-42)
        - [Scenario 4.3](#scenario-43)
        - [Scenario 4.4](#scenario-44)
        - [Scenario 4.5](#scenario-45)
        - [Scenario 4.6](#scenario-46)
        - [Scenario 4.7](#scenario-47)
        - [Scenario 4.8](#scenario-48)
    - [Use case 5, Gestione dei prodotti (UC5)](#use-case-5-gestione-dei-prodotti-uc5)
        - [Scenario 5.1](#scenario-51)
        - [Scenario 5.2](#scenario-52)
        - [Scenario 5.3](#scenario-53)
        - [Scenario 5.4](#scenario-54)
        - [Scenario 5.4.1](#scenario-541)
        - [Scenario 5.4.2](#scenario-542)
        - [Scenario 5.5](#scenario-55)
        - [Scenario 5.6](#scenario-56)
        - [Scenario 5.6.1](#scenario-561)
        - [Scenario 5.6.2](#scenario-562)
        - [Scenario 5.7](#scenario-57)
        - [Scenario 5.7.1](#scenario-571)
        - [Scenario 5.7.2](#scenario-572)
        - [Scenario 5.8](#scenario-58)
        - [Scenario 5.9](#scenario-59)
        - [Scenario 5.10](#scenario-510)
        - [Scenario 5.11](#scenario-511)
        - [Scenario 5.13](#scenario-513)
        - [Scenario 5.14](#scenario-514)
        - [Scenario 5.15](#scenario-515)
        - [Scenario 5.16](#scenario-516)
        - [Scenario 5.17](#scenario-517)
        - [Scenario 5.18](#scenario-518)
        - [Scenario 5.19](#scenario-519)
    - [Use case 6, Gestione dei carrelli (UC6)](#use-case-6-gestione-dei-carrelli-uc6)
        - [Scenario 6.1](#scenario-61)
        - [Scenario 6.2](#scenario-62)
        - [Scenario 6.2.1](#scenario-621)
        - [Scenario 6.3](#scenario-63)
        - [Scenario 6.4](#scenario-64)
        - [Scenario 6.5](#scenario-65)
        - [Scenario 6.6](#scenario-66)
        - [Scenario 6.7](#scenario-67)
        - [Scenario 6.8](#scenario-68)
        - [Scenario 6.9](#scenario-69)
        - [Scenario 6.10](#scenario-610)
        - [Scenario 6.11](#scenario-611)
        - [Scenario 6.12](#scenario-612)
        - [Scenario 6.13](#scenario-613)
        - [Scenario 6.14](#scenario-614)
        - [Scenario 6.15](#scenario-615)
        - [Scenario 6.16](#scenario-616)
        - [Scenario 6.17](#scenario-617)
        - [Scenario 6.18](#scenario-618)
        - [Scenario 6.19](#scenario-619)
        - [Scenario 6.20](#scenario-620)
    - [Use case 7, Gestione della spedizione (UC7)](#use-case-7-gestione-della-spedizione-uc7)
        - [Scenario 7.1](#scenario-71)
        - [Scenario 7.2](#scenario-72)
    - [Use case 8, Gestione delle recensioni (UC8)](#use-case-8-gestione-delle-recensioni-uc8)
        - [Scenario 8.1](#scenario-81)
        - [Scenario 8.2](#scenario-82)
        - [Scenario 8.3](#scenario-83)
        - [Scenario 8.4](#scenario-84)
- [Glossary](#glossary)
- [System Design](#system-design)
- [Deployment Diagram](#deployment-diagram)

# Informal description

EZElectronics (read EaSy Electronics) is a software application designed to help managers of electronics stores to manage their products and offer them to customers through a dedicated website. Managers can assess the available products, record new ones, and confirm purchases. Customers can see available products, add them to a cart and see the history of their past purchases.

# Stakeholders

| Stakeholder name |                                                                                        Description                                                                                         |
| :--------------: | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
|      Users       |                                                             Persone che utilizzeranno EZElectronics, sia Customer che Manager                                                              |
|      Owners      |                                              Persone che finanziano EZElectronics e commissionano gli sviluppi applicativi e infrastrutturali                                              |
| Software factory |                                                         Azienda o team che si occupa degli sviluppi applicativi frontend e backend                                                         |
|  Technical User  |    Utenza tecnica utilizzata per effettuare attività di backoffice sulla piattaforma EZElectronics. Tra cui, creazione di utenti di tipo Manager, anagrafica e amministrazione generale    |
| Shipping System  |                                                Un corriere che prenderà in carico la spedizione degli ordini effettuati online dagli utenti                                                |
|  Payment System  | Sistema di pagamento di terze parti integrato dentro la piattaforma EZElectronics. Gestisce le transazioni tra gli utenti che effettuano acquisti e gli store che utilizzano EZElectronics |


# Context Diagram and interfaces

## Context Diagram

```plantuml
    skinparam backgroundColor #EEEBDC
    actor Customer as c
    actor Manager as m
    actor Partners as p
    actor Owner as own
    actor "Technical User" as tu
    component "Payment System" as ps
    component "Shipping System" as ss
    c -- (EZElectronics)
    m -- (EZElectronics)
    p -- (EZElectronics)
    own -- (EZElectronics)
    tu -- (EZElectronics)
    ps -- (EZElectronics)
    ss -- (EZElectronics)

```


## Interfaces

|      Actor      |          Logical Interface           |         Physical Interface          |
| :-------------: | :----------------------------------: | :---------------------------------: |
|     Manager     | GUI(managing products and warehouse) |            Smartphone/PC            |
|    Customer     |         GUI(buying products)         |            Smartphone/PC            |
| Technical User  |           GUI(backoffice)            |            Smartphone/PC            |
| Shipping System |                 API                  | Internet Access/ Internet Protocols |
| Payment System  |                 API                  | Internet Access/Internet Protocols  |

<!-- Le interfacce di EZElectronics verso Shipping System e Payment System sono delle API. Ma ci accederanno anche gli utenti a queste interfacce, utilizzando la GUI-->


# Stories and personas

### Customer


Federica, una giovane di 25 anni, si è appena trasferita in una nuova città e si ritrova lontana dal suo negozio di elettronica di fiducia che frequentava nella sua città natale. Era abituata a recarsi personalmente nel negozio per acquistare gli ultimi prodotti elettronici e ricevere consigli tecnici dal personale di vendita. Tuttavia, da quando il suo negozio preferito ha adottato la piattaforma EZElectronics, Federica ha scoperto una nuova comodità nel fare acquisti online. Ora può esplorare il medesimo catalogo di prodotti, direttamente dal suo computer o smartphone, senza doversi preoccupare di essere lontana dalla sua città natale.
Federica utilizza esclusivamente Smartphone e ha un buon livello di confidenza con la tecnologia.

Gianpiero è un professore di 45 anni che lavora a Torino e abita in una seconda casa. 
Il weekend si reca presso la sua prima casa in un paesino nelle Valli di Lanzo e non ha modo di recarsi in un negozio di elettronica, in quanto durante tutta la settimana è impegnato e dove vive non esistono negozi di questo tipo. Da quando ha scoperto EZElectronics riesce comodamente a consultare l’ampio catalogo da casa sua, potendo scegliere tra i prodotti più recenti del mercato.
Gianpiero preferisce consultare la webapp di EZElectronics dal suo laptop. Ha un'ottima confidenza con la tecnologia.

Salvatore è un pensionato di 75 anni che si sta per la prima volta approcciando a dei prodotti elettronici "smart". Recandosi di persona per l'acquisto di un prodotto in negozio trovava difficoltà in quanto i commessi spesso lo confondevano con tanti tecnicismi.
Preferisce molto di più consultare il catalogo dei prodotti da EZElectronics online, grazie all'interfaccia grafica semplice, adatta a qualsiasi tipo di utente.
Salvatore ha una pessima confidenza con il mondo della tecnologia e preferisce consultare il catalogo di prodotti dal suo computer fisso.

### Manager


Francesco, un manager di 46 anni di un negozio di elettronica, si trova ad affrontare una brusca diminuzione delle vendite a causa della concorrenza delle multinazionali e del cambiamento delle abitudini di acquisto degli utenti. Sempre più persone preferiscono fare acquisti comodamente da casa piuttosto che recarsi fisicamente in negozio. Con l'utilizzo di EZElectronics, Francesco ha potuto superare questa sfida tecnologica e mantenere il negozio competitivo sul mercato. EZElectronics ha permesso al negozio di espandere la propria presenza online, migliorare l'esperienza complessiva di acquisto e mantenere la propria rilevanza nel settore dell'elettronica.
Francesco ha una discreta confidenza con la tecnologia, preferisce comunque utilizzare EZElectronics dal suo computer di lavoro.

Giuseppe ha 25 anni ed è neo assunto presso una catena di negozi di elettronica.
Nel negozio dove lui lavora è stata già adottata la piattaforma EZElectronics.
All'inizio era molto preoccupato per eventuali difficoltà da superare nell'apprendimento dell'utilizzo della piattaforma, ma si è dovuto subito ricredere quando ha notato con quale facilità riuscisse a modificare il catalogo dei prodotti sul mercato.
Giuseppe ha una buona confidenza con il mondo della tecnologia. Non ha un dispositivo preferito, consulta EZElectronics sia da computer, sia da smartphone.

# Functional and non functional requirements

## Functional Requirements

|   ID    |                                    Description                                     |
| :-----: | :--------------------------------------------------------------------------------: |
| __FR1__ |                        __Autenticazione e autorizzazione__                         |
| • FR1.1 |                                       login                                        |
| • FR1.2 |                                       logout                                       |
| • FR1.3 |                    lista delle informazioni dell'utente loggato                    |
| • FR1.4 |                                 creazione utente                                   |
| • FR1.5 |                           gestione password dimenticata                            |
| __FR2__ |                                __Gestione utente__                                 |
| • FR2.1 |                                cancellazione utente                                |
| • FR2.2 |              lista degli utenti (completa, per ruolo o per username)               |
| • FR2.4 |                                  modifica utente                                   |
| __FR3__ |                               __Gestione prodotto__                                |
| • FR3.1 |                 creazione ed inserimento di un prodotto a catalogo                 |
| • FR3.2 |                  registrazione dell'arrivo di un prodotto fisico                   |
| • FR3.3 |                     registrazione di un prodotto come venduto                      |
| • FR3.4 | lista dei prodotti (completa, per codice, per categoria, per modello, per manager che lo ha inserito) |
| • FR3.5 |                               cancellazione prodotto                               |
| • FR3.6 |                            modifica prodotto a catalogo                            |
| • FR3.7 |                 aggiunta di categorie prodotti (da technical user)                 |
| • FR3.8 |               eliminazione di categorie prodotti (da technical user)               |
| __FR4__ |                               __Gestione carrello__                                |
| • FR4.1 |                           aggiunta prodotto al carrello                            |
| • FR4.2 |                              visualizzazione carrello                              |
| • FR4.3 |                           visualizzazione storico ordini                           |
| • FR4.4 |                     cancellazione di un prodotto dal carrello                      |
| • FR4.5 |                         cancellazione dell'intero carrello                         |
| __FR5__ |                               __Gestione pagamento__                               |
| • FR5.1 |                         pagamento per il carrello corrente                         |
| • FR5.2 |                             gestione dati di pagamento                             |
| • FR5.3 |            invio resoconto pagamento e informazione spedizione via mail            |
| __FR6__ |                              __Gestione spedizione__                               |
| • FR6.1 |           lista delle spedizioni disponibili (con prezzo e data stimata)           |
| • FR6.2 |                            gestione dati di spedizione                             |
| • FR6.3 |                   inserimento nuovo corriere (da technical user)                   |
| • FR6.4 |                     cancellazione corriere (da technical user)                     |
| __FR7__ |                              __Gestione recensioni__                               |
| • FR7.1 |           inserimento di una recensione per un certo prodotto                      |
| • FR7.2 |              cancellazione di una recensione per un certo prodotto                 |
| • FR7.3 |                   modifica di una recensione per un certo prodotto                 |
| • FR7.4 |            recupero di tutte le recensioni di un certo concetto di prodotto        |





## Non Functional Requirements


|  ID   | Type (efficiency, reliability, ..) |                                           Description                                           |  Refers to  |
| :---: | :--------------------------------: | :---------------------------------------------------------------------------------------------: | :---------: |
| NFR1  |              security              |                  Il sistema deve essere protetto dagli accessi non autorizzati                  |   All FR    |
| NFR2  |             usability              |            Gli utenti non dovranno effettuare training per utilizzare l'applicazione            |   All FR    |
| NFR3  |            performance             |               Il sistema deve poter gestire l'accesso contemporaneo di almeno 200 utenti        |   All FR    |
| NFR4  |             efficiency             |    Il sito deve avere un tempo di caricamento massimo per il catalogo completo di 3 secondi     | FR3 and FR4 |
| NFR5  |             efficiency             | Il sito deve avere un tempo di risposta massimo di 1 secondo per i componenti frontend          |   All FR    |
| NFR6  |            portability             |     Il sito deve essere disponibile per i seguenti browser (Chrome, Safari, Opera, Firefox)     |   All FR    |
| NFR7  |            reliability             |                     Ogni utente non dovrà riportare più di un bug all'anno                      |   All FR    |
| NFR8  |            reliability             |                        Il sistema deve avere un tempo di uptime di 99,9%                        |   All FR    |
| NFR9  |               domain               |                         Il prezzo di un prodotto non può essere negativo                        |     FR3     |
| NFR10 |               domain               |                L'ID di un prodotto deve essere univoco e lungo almeno 6 caratteri               |     FR3     |
| NFR11 |               domain               |                L'indirizzo email deve essere verificato mediante codice di conferma             | FR1.4,FR2.4 |
| NFR12 |               domain               |        Un utente può scrivere una sola recensione per ciascun prodotto da lui acquistato        |     FR3     |
| NFR13 |              security              |                           I dati di pagamento devono essere protetti                            |     FR5     |
| NFR14 |              security              |           Le informazioni dell'utente devono essere protette (anagrafica e indirizzo)           |     FR6     |

# Use case diagram and use cases

## Use case diagram

![Use case diagram](./assets/use_case_diagram_v2.png)

### Use case 1, Login di un utente (UC1)

| Actors Involved  |            Utente                                       |
| :--------------: | :-----------------------------------------------: |
|   Precondition   | L'utente non è autenticato, l'utente è registrato |
|  Post condition  |              L'utente è autenticato               |
| Nominal Scenario |                   Scenario 1.1                    |
|     Variants     |              Varianti di 1.2: 1.2.1                   |
|    Exceptions    |              Scenario 1.2, 1.3, 1.4, 1.5               |

##### Scenario 1.1

|  Scenario 1.1  |                                                            Login                                                             |
| :------------: | :--------------------------------------------------------------------------------------------------------------------------: |
|  Precondition  |                                      L'utente non è autenticato, l'utente è registrato                                       |
| Post condition |                                                    L'utente è autenticato                                                    |
|     Step#      |                                                         Descrizione                                                          |
|       1        |                     L’utente avvia l’interazione con il sistema chiedendo di poter effettuare il login.                      |
|       2        | Il sistema reagisce e chiede all’utente di inserire le informazioni necessarie per effettuare il login: username e password. |
|       3        |                                        L'utente inserisce le informazioni richieste.                                         |
|       4        |              Il sistema legge lo username e la password, controlla se ci sia un cookie associato, l'utente non è autenticato.              |
|       5        | Il sistema ricava la password associata a quello username e la confronta con la password inserita dall'utente. Le 2 password coincidono e quindi il sistema autorizza il login dell'utente. |

##### Scenario 1.2

|  Scenario 1.2  |                                                      Password sbagliata                                                      |
| :------------: | :--------------------------------------------------------------------------------------------------------------------------: |
|  Precondition  |                                      L'utente non è autenticato, l'utente è registrato                                       |
| Post condition |                                                    L'utente non è autenticato                                                    |
|     Step#      |                                                         Descrizione                                                          |
|       1        |                     L’utente avvia l’interazione con il sistema chiedendo di poter effettuare il login.                      |
|       2        | Il sistema reagisce e chiede all’utente di inserire le informazioni necessarie per effettuare il login: username e password. |
|       3        |                                        L'utente inserisce le informazioni richieste.                                         |
|       4        |              Il sistema legge lo username e la password, controlla se ci sia un cookie associato, l'utente non è autenticato.              |
|       5        |              Il sistema dato lo username cerca l'utente e lo trova.            |
|       6        | Il sistema ricava la password associata a quello username e la confronta con la password inserita dall'utente. Le 2 password sono diverse e quindi il sistema non autorizza il login dell'utente e ritorna un messaggio di errore. |


##### Scenario 1.2.1

| Scenario 1.2.1 |                                                                                                          Password sbagliata e impostazione di una nuova password                                                                                                          |
| :------------: | :-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
|  Precondition  |                                                                                                             L'utente non è autenticato, l'utente è registrato                                                                                                             |
| Post condition |                                                                                                                          L'utente è autenticato                                                                                                                           |
|     Step#      |                                                                                                                                Descrizione                                                                                                                                |
|       1        |                                                                                            L’utente avvia l’interazione con il sistema chiedendo di poter effettuare il login.                                                                                            |
|       2        |                                                                       Il sistema reagisce e chiede all’utente di inserire le informazioni necessarie per effettuare il login: username e password.                                                                        |
|       3        |                                                                                                               L'utente inserisce le informazioni richieste.                                                                                                               |
|       4        |                                                                             Il sistema legge lo username e la password, controlla se ci sia un cookie associato, l'utente non è autenticato.                                                                              |
|       5        |                                                                                                          Il sistema dato lo username cerca l'utente e lo trova.                                                                                                           |
|       6        | Il sistema ricava la password associata a quello username e la confronta con la password inserita dall'utente. Le 2 password sono diverse e quindi il sistema non autorizza il login dell'utente e gli chiede se abbia dimenticato la password associata al suo username. |
|       7        |                                                                                                            L'utente conferma di aver dimenticato la password.                                                                                                             |
|       8        |                                                          Il sistema permette la reimpostazione della password inviando per email all'utente un codice di conferma e chiedendogli di inserire la nuova password.                                                           |
|       9        |                                                                            L'utente inserisce la nuova password e valida questa operazione inserendo il codice di conferma ricevuto per email.                                                                            |
|       10       |                                                                                               Il sistema aggiorna la password dell'utente e autorizza il login dell'utente.                                                                                               |


##### Scenario 1.3

|  Scenario 1.3  |                                                        L'utente non è registrato                                                         |
| :------------: | :--------------------------------------------------------------------------------------------------------------------------------------: |
|  Precondition  |                                          L'utente non è autenticato, l'utente non è registrato                                           |
| Post condition |                                                        L'utente non è autenticato                                                        |
|     Step#      |                                                               Descrizione                                                                |
|       1        |                           L’utente avvia l’interazione con il sistema chiedendo di poter effettuare il login.                            |
|       2        |       Il sistema reagisce e chiede all’utente di inserire le informazioni necessarie per effettuare il login: username e password.       |
|       3        |                                              L'utente inserisce le informazioni richieste.                                               |
|       s        |             Il sistema legge lo username e la password, controlla se ci sia un cookie associato, l'utente non è autenticato.             |
|       5        | Il sistema dato lo username cerca l'utente ma non lo trova e quindi non autorizza il login dell'utente e ritorna un messaggio di errore. |

##### Scenario 1.4

|  Scenario 1.4  |                                                  L'utente è già autenticato                                                  |
| :------------: | :--------------------------------------------------------------------------------------------------------------------------: |
|  Precondition  |                                        L'utente è autenticato, l'utente è registrato                                         |
| Post condition |                                                    L'utente è autenticato                                                    |
|     Step#      |                                                         Descrizione                                                          |
|       1        |                     L’utente avvia l’interazione con il sistema chiedendo di poter effettuare il login.                      |
|       2        | Il sistema reagisce e chiede all’utente di inserire le informazioni necessarie per effettuare il login: username e password. |
|       3        |                                        L'utente inserisce le informazioni richieste.                                         |
|       4        |       Il sistema legge lo username e la password, controlla se ci sia un cookie associato, l'utente è già autenticato.       |
|       5        |                                          Il sistema ritorna un messaggio di errore.                                          |


### Use case 2, Logout di un utente (UC2)

| Actors Involved  |           Utente           |
| :--------------: | :------------------------: |
|   Precondition   |   L'utente è autenticato   |
|  Post condition  | L'utente non è autenticato |
| Nominal Scenario |        Scenario 2.1        |
|     Variants     |                            |
|    Exceptions    |        Scenario 2.2        |
 
##### Scenario 2.1

|  Scenario 2.1  |                                        Logout                                        |
| :------------: | :----------------------------------------------------------------------------------: |
|  Precondition  |                                L'utente è autenticato                                |
| Post condition |                              L'utente non è autenticato                              |
|     Step#      |                                     Descrizione                                      |
|       1        | L’utente avvia l’interazione con il sistema chiedendo di poter effettuare il logout. |
|       2        |          Il sistema reagisce, controlla il cookie, l'utente è autenticato.           |
|       3        |                     Il sistema autorizza il logout dell'utente.                      |

##### Scenario 2.2

|  Scenario 2.2  |                             L'utente ha già fatto il logout                             |
| :------------: | :-------------------------------------------------------------------------------------: |
|  Precondition  |                               L'utente non è autenticato                                |
| Post condition |                               L'utente non è autenticato                                |
|     Step#      |                                       Descrizione                                       |
|       1        |  L’utente avvia l’interazione con il sistema chiedendo di poter effettuare il logout.   |
|       2        |          Il sistema reagisce, controlla il cookie, l'utente non è autenticato.          |
|       3        | Il sistema ritorna un messaggio di errore perchè l'utente non ha ancora fatto il login. |


### Use case 3, Creazione di un nuovo utente (UC3)

| Actors Involved  |                                                                                                         Utente                                                                                                          |
| :--------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
|   Precondition   | L'utente che si vuole creare non ha un account: non deve avere un nome utente che identifichi un utente già presente, solo un utente autenticato il cui ruolo è Technical User può accedere a questa funzione (per 3.2) |
|  Post condition  |                                                                                                  L'utente è registrato                                                                                                  |
| Nominal Scenario |                                                                                                    Scenario 3.1, 3.2                                                                                                    |
|     Variants     |                                                                                                                                                                                                                         |
|    Exceptions    |                                                                                                    Scenario 3.3, 3.4                                                                                                    |

##### Scenario 3.1

|  Scenario 3.1  |                                                                         Registrazione utente con ruolo Customer                                                                         |
| :------------: | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
|  Precondition  |                                  L'utente che si vuole creare non ha un account: non deve avere un nome utente che identifichi un utente già presente                                   |
| Post condition |                                                                                  L'utente è registrato                                                                                  |
|     Step#      |                                                                                       Descrizione                                                                                       |
|       1        |                                                 L’utente avvia l’interazione con il sistema chiedendo di poter creare un nuovo utente.                                                  |
|       2        | Il sistema reagisce e chiede all’utente di inserire le informazioni necessarie per la creazione di un nuovo utente: username, nome, cognome, password, email e indirizzo di spedizione. |
|       3        |                                                                      L’utente inserisce le informazioni richieste.                                                                      |
|       4        |                                                                 Il sistema legge le informazioni inserite dall'utente.                                                                  |
|       5        |                        Il sistema controlla che lo username inserito dall'utente non sia già associato a un altro account, lo username non è ancora stato usato.                        |
|       6        |                   Il sistema invia all'utente un codice di conferma via email e gli chiede di inserirlo per validare la registrazione.                    |
|       7        |                                                              L'utente inserisce il codice di conferma ricevuto via email.                                                               |
|       8        |                                                    Il sistema crea il nuovo utente con il ruolo di Customer e salva le informazioni.                                                    |


##### Scenario 3.2

|  Scenario 3.2  |                                                                                                                                                                              Registrazione utente con ruolo Manager                                                                                                                                                                              |
| :------------: | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
|  Precondition  |                                                                                          Solo un utente autenticato il cui ruolo è Technical User può accedere a questa funzione, l'utente che si vuole creare non ha un account: non deve avere un nome utente che identifichi un utente già presente                                                                                           |
| Post condition |                                                                                                                                                                                      L'utente è registrato                                                                                                                                                                                       |
|     Step#      |                                                                                                                                                                                           Descrizione                                                                                                                                                                                            |
|       1        |                                                                                                                                                      L’utente avvia l’interazione con il sistema chiedendo di poter creare un nuovo utente.                                                                                                                                                      |
|       2        | Il sistema reagisce e chiede all’utente di inserire le informazioni necessarie per la creazione di un nuovo utente: username, nome, cognome, partita IVA, indirizzo di residenza, email, negozio di appartenenza e password. La password sarà generata in maniera automatica dal sistema e verrà comunicata via email solo al manager. Il Technical User non conoscerà mai la password del manager che sta registrando |
|       3        |                                                                                                                                                                          L’utente inserisce le informazioni richieste.                                                                                                                                                                           |
|       4        |                                                                                                                                                                      Il sistema legge le informazioni inserite dall'utente.                                                                                                                                                                      |
|       5        |                                                                                                                            Il sistema controlla che lo username inserito dall'utente non sia già associato a un altro account, lo username non è ancora stato usato.                                                                                                                             |
|       6        |                                                                                                                                                         Il sistema crea il nuovo utente con il ruolo di Manager e salva le informazioni.                                                                                                                                                         |


##### Scenario 3.3

|  Scenario 3.3  | L'utente è già registrato                                                      |
| :------------: | :--------------------------------------------------------------------------------------------------------------------------: |
|  Precondition  | L'utente è registrato                                     |
| Post condition | L'utente è registrato                                                    |
|     Step#      | Descrizione                                                          |
|       1        | L’utente avvia l’interazione con il sistema chiedendo di poter creare un nuovo utente.                      |
|       2        | Il sistema reagisce e chiede all’utente di inserire le informazioni necessarie per la creazione di un nuovo utente: username, nome, cognome, password, email e indirizzo di spedizione. |                               
|       3        | L’utente inserisce le informazioni richieste.           |
|       4        | Il sistema legge le informazioni inserite dall'utente.           |
|       5        | Il sistema controlla che lo username inserito dall'utente non sia già associato a un altro account, lo username è già stato usato, il sistema ritorna un messaggio di errore. |

##### Scenario 3.4

|  Scenario 3.4  | L'utente è già autenticato                                                      |
| :------------: | :--------------------------------------------------------------------------------------------------------------------------: |
|  Precondition  | L'utente è autenticato, l'utente è registrato                                     |
| Post condition | L'utente è autenticato                                                    |
|     Step#      | Descrizione                                                          |
|       1        | L’utente avvia l’interazione con il sistema chiedendo di poter creare un nuovo utente.                      |
|       2        | Il sistema reagisce e chiede all’utente di inserire le informazioni necessarie per la creazione di un nuovo utente: username, nome, cognome, password, email e indirizzo di spedizione. |                               
|       3        | L’utente inserisce le informazioni richieste.           |
|       4        | Il sistema legge le informazioni inserite dall'utente, controlla se ci sia un cookie associato, l'utente è già autenticato.           |
|       5        | Il sistema ritorna un messaggio di errore. |


### Use case 4, Gestione degli utenti (UC4)

| Actors Involved  | Utente                                   |
| :--------------: | :-----------------------------------------------: |
|   Precondition   | Solo un utente autenticato il cui ruolo è Technical User può accedere a questa funzione (per tutti tranne che per 4.1, 4.6), l’utente dev’essersi già autenticato (per 4.1, 4.6) |
|  Post condition  | Sono state recuperate le informazioni sull'utente attualmente autenticato, sono stati ritornati tutti gli utenti, sono stati ritornati tutti gli utenti con un ruolo specifico, è stato ritornato l’utente identificato dal nome utente richiesto, è stato eliminato l’utente identificato dal nome utente inserito, sono state modificate le informazioni sull'utente attualmente autenticato, è stato modificato il ruolo dell'utente identificato da un certo nome utente               |
| Nominal Scenario | Scenario 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7                   |
|     Variants     |                      |
|    Exceptions    | Exceptions di 4.4: 4.8, exceptions di 4.5: 4.9             |

##### Scenario 4.1

|  Scenario 4.1  | Recupero delle informazioni dell'utente attualmente autenticato                                                            |
| :------------: | :--------------------------------------------------------------------------------------------------------------------------: |
|  Precondition  | L’utente dev’essersi già autenticato |
| Post condition | Sono state recuperate le informazioni sull'utente attualmente autenticato                                                   |
|     Step#      | Descrizione                                                          |
|       1        | L’utente avvia l’interazione con il sistema chiedendo di poter recuperare le informazioni che lo descrivono.                      |
|       2        | Il sistema reagisce e fornisce all’utente le informazioni che lo descrivono. |                          

##### Scenario 4.2

|  Scenario 4.2  | Recupero di tutti gli utenti                                                  |
| :------------: | :--------------------------------------------------------------------------------------------------------------------------: |
|  Precondition  | Solo un utente autenticato il cui ruolo è Technical User può accedere a questa funzione                                     |
| Post condition | Sono stati ritornati tutti gli utenti                                                   |
|     Step#      | Descrizione                                                          |
|       1        | L’utente avvia l’interazione con il sistema chiedendo di poter avere l’elenco di tutti gli utenti.                    |
|       2        | Il sistema ritorna tutti gli utenti e le informazioni che li descrivono. |                             

##### Scenario 4.3

|  Scenario 4.3  | Recupero di tutti gli utenti con un ruolo specifico                                                |
| :------------: | :--------------------------------------------------------------------------------------------------------------------------: |
|  Precondition  | Solo un utente autenticato il cui ruolo è Technical User può accedere a questa funzione                                     |
| Post condition | Sono stati ritornati tutti gli utenti con un ruolo specifico                                                  |
|     Step#      | Descrizione                                                          |
|       1        | L’utente avvia l’interazione con il sistema chiedendo di poter avere l’elenco di tutti gli utenti con un ruolo specifico.                   |
|       2        | Il sistema reagisce e chiede all’utente di inserire tale ruolo. | 
|       3        | L’utente inserisce le informazioni richieste. | 
|       4        | Il sistema valida le informazioni e ritorna tutti gli utenti con quel ruolo specifico e le informazioni che li descrivono. | 

##### Scenario 4.4

|  Scenario 4.4  | Recupero dell’utente identificato da un certo nome utente                                                  |
| :------------: | :--------------------------------------------------------------------------------------------------------------------------: |
|  Precondition  | Solo un utente autenticato il cui ruolo è Technical User può accedere a questa funzione                                    |
| Post condition | E’ stato ritornato l’utente identificato dal nome utente richiesto.                                                   |
|     Step#      | Descrizione                                                          |
|       1        | L’utente avvia l’interazione con il sistema chiedendo di poter avere le informazioni che descrivono un certo utente.                   |
|       2        | Il sistema reagisce e chiede all’utente di inserire il nome utente di tale utente. |
|       3        | L’utente inserisce le informazioni richieste. |
|       4        | Il sistema valida le informazioni e ritorna l’utente identificato dal nome utente richiesto. |


##### Scenario 4.5

|  Scenario 4.5  | Eliminazione di un utente identificato da un certo nome utente                                                  |
| :------------: | :--------------------------------------------------------------------------------------------------------------------------: |
|  Precondition  | L’utente dev’essere registrato, solo un utente autenticato il cui ruolo è Technical User può accedere a questa funzione                                    |
| Post condition | Solo un utente autenticato il cui ruolo è Manager può accedere a questa funzione                                                   |
|     Step#      | Descrizione                                                          |
|       1        | L’utente avvia l’interazione con il sistema chiedendo di poter eliminare un certo utente.                   |
|       2        | Il sistema reagisce e chiede all’utente di inserire il nome utente di tale utente. | 
|       3        | L’utente inserisce le informazioni richieste. |
|       4        | Il sistema valida le informazioni ed elimina tale utente. |


##### Scenario 4.6

|  Scenario 4.6  | Modifica delle informazioni dell'utente attualmente autenticato                                                            |
| :------------: | :--------------------------------------------------------------------------------------------------------------------------: |
|  Precondition  | L’utente dev’essersi già autenticato |
| Post condition | Sono state modificate le informazioni sull'utente attualmente autenticato                                                   |
|     Step#      | Descrizione                                                          |
|       1        | L’utente avvia l’interazione con il sistema chiedendo di poter modificare le informazioni che lo descrivono (le informazioni da lui modificabili sono nome, cognome, password e indirizzo di spedizione).   |
|       2        | Il sistema reagisce e chiede all'utente di inserire le informazioni che vuole modificare. |   
|       3        | L’utente inserisce le informazioni richieste. |
|       4        | Il sistema valida le informazioni e modifica le informazioni dell'utente. | 


##### Scenario 4.7

|  Scenario 4.7  | Recupero dell’utente identificato da un certo nome utente (il nome utente non identifica un utente già presente) |
| :------------: | :--------------------------------------------------------------------------------------------------------------------------: |
|  Precondition  | Solo un utente autenticato il cui ruolo è Technical User può accedere a questa funzione                                     |
| Post condition | Non è stato ritornato l’utente identificato dal nome utente richiesto.                                                   |
|     Step#      | Descrizione                                                          |
|       1        | L’utente avvia l’interazione con il sistema chiedendo di poter avere le informazioni che descrivono un certo utente.                   |
|       2        | Il sistema reagisce e chiede all’utente di inserire il nome utente di tale utente. |
|       3        | L’utente inserisce le informazioni richieste. |
|       4        | Il sistema valida le informazioni ma l’utente è identificato da un nome utente che non è presente, il sistema mostra un messaggio di errore e termina con fallimento. |


##### Scenario 4.8

|  Scenario 4.8  | Eliminazione di un utente identificato da un certo nome utente (il nome utente non identifica un utente già presente) |
| :------------: | :--------------------------------------------------------------------------------------------------------------------------: |
|  Precondition  | Solo un utente autenticato il cui ruolo è Technical User può accedere a questa funzione                                     |
| Post condition | Non è stato eliminato l’utente identificato dal nome utente inserito perchè tale utente non è presente      |
|     Step#      | Descrizione                                                          |
|       1        | L’utente avvia l’interazione con il sistema chiedendo di poter eliminare un certo utente.                   |
|       2        | Il sistema reagisce e chiede all’utente di inserire il nome utente di tale utente. | 
|       3        | L’utente inserisce le informazioni richieste. |
|       4        | Il sistema valida le informazioni ma l’utente è identificato da un nome utente che non è presente, il sistema mostra un messaggio di errore e termina con fallimento. |


### Use case 5, Gestione dei prodotti (UC5)

| Actors Involved  | Utente                                   |
| :--------------: | :-----------------------------------------------: |
|   Precondition   | Solo un utente autenticato può accedere a questa funzione (per 5.4 e varianti, 5.5, 5.6 e varianti, 5.7 e varianti), solo un utente autenticato il cui ruolo è Manager può accedere a questa funzione (per 5.1, 5.2, 5.3, 5.8) |
|  Post condition  | E’ stato creato un nuovo concetto di prodotto con le informazioni fornite, è stato registrato l’arrivo dei prodotti indicati, il prodotto venduto è stato contrassegnato come tale, sono stati ritornati tutti i prodotti, è stato ritornato il prodotto identificato dal codice prodotto richiesto, sono stati ritornati tutti i prodotti della categoria richiesta, sono stati ritornati tutti i prodotti del modello richiesto, è stato eliminato il prodotto identificato dal codice prodotto inserito, sono state modificate le informazioni del concetto di prodotto identificato dal codice prodotto inserito, è stata creata una nuova categoria                 |
| Nominal Scenario | Scenario 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 5.8, 5.9, 5.10                   |
|     Variants     | Varianti di 5.4: 5.4.1, 5.4.2, varianti di 5.6: 5.6.1, 5.6.2, varianti di 5.7: 5.7.1, 5.7.2                   |
|    Exceptions    | Exceptions di 5.1: 5.11, 5.12, exceptions di 5.2: 5.13, exceptions di 5.3: 5.14, 5.15, 5.16, 5.17, exceptions di 5.5: 5.18, exceptions di 5.8: 5.19 |


##### Scenario 5.1

|  Scenario 5.1  | Creazione di un nuovo concetto di prodotto                                                           |
| :------------: | :--------------------------------------------------------------------------------------------------------------------------: |
|  Precondition  | Solo un utente autenticato il cui ruolo è Manager può accedere a questa funzione |
| Post condition | E’ stato creato un nuovo concetto prodotto con le informazioni fornite                                          |
|     Step#      | Descrizione                                                          |
|       1        | L’utente Manager avvia l’interazione con il sistema chiedendo di poter creare un nuovo concetto di prodotto.                      |
|       2        | Il sistema reagisce e chiede all’utente Manager di inserire le informazioni necessarie per la creazione di un nuovo concetto di prodotto: modello, categoria, dettagli, prezzo di vendita e immagini illustrative. |  
|       3        | L’utente Manager inserisce le informazioni richieste.                              |
|       4        | Il sistema valida le informazioni e chiede l'approvazione dell'utente Technical User. |
|       5        | L'utente Technical User approva le informazioni proposte dall'utente Manager. |
|       6        | Il sistema crea il nuovo concetto di prodotto e salva le informazioni. |


##### Scenario 5.2

|  Scenario 5.2  | Registrazione dell'arrivo di 1 o più prodotti dello stesso modello                                                  |
| :------------: | :--------------------------------------------------------------------------------------------------------------------------: |
|  Precondition  | Solo un utente autenticato il cui ruolo è Manager può accedere a questa funzione                                   |
| Post condition | E’ stato registrato l’arrivo dei prodotti indicati                                                   |
|     Step#      | Descrizione                                                          |
|       1        | L’utente avvia l’interazione con il sistema chiedendo di poter registrare l’arrivo di 1 o più prodotti dello stesso modello.    |
|       2        | Il sistema reagisce e chiede all’utente di inserire le informazioni necessarie per la registrazione dell'arrivo di 1 o più prodotti dello stesso modello: data di arrivo. Il codice verrà generato automaticamente dal sistema. |     
|       3        | L’utente inserisce le informazioni richieste.                      |
|       4        | Il sistema valida le informazioni, genera il codice identificativo di ogni prodotto da inserire e registra l'arrivo dei prodotti indicati.   |


##### Scenario 5.3

|  Scenario 5.3  | Contrassegnazione di un prodotto come venduto                                                |
| :------------: | :--------------------------------------------------------------------------------------------------------------------------: |
|  Precondition  | Solo un utente autenticato il cui ruolo è Manager può accedere a questa funzione                                     |
| Post condition | Il prodotto venduto è stato contrassegnato come tale                                                  |
|     Step#      | Descrizione                                                          |
|       1        | L’utente avvia l’interazione con il sistema chiedendo di poter contrassegnare come venduto un prodotto.                   |
|       4        | Il sistema contrassegna il prodotto come venduto. | 


##### Scenario 5.4

|  Scenario 5.4  | Recupero di tutti i prodotti                                                  |
| :------------: | :--------------------------------------------------------------------------------------------------------------------------: |
|  Precondition  | Solo un utente autenticato può accedere a questa funzione                                 |
| Post condition | Sono stati ritornati tutti i prodotti                                                 |
|     Step#      | Descrizione                                                          |
|       1        | L’utente avvia l’interazione con il sistema chiedendo di poter avere l’elenco di tutti i prodotti.                   |
|       2        | Il sistema ritorna tutti i prodotti e le informazioni che li descrivono: codice, prezzo di vendita, modello, categoria, dettagli, data di arrivo e immagini illustrative. |


##### Scenario 5.4.1

|  Scenario 5.4.1  | Recupero di tutti i prodotti venduti                                           |
| :------------: | :--------------------------------------------------------------------------------------------------------------------------: |
|  Precondition  | Solo un utente autenticato può accedere a questa funzione                                    |
| Post condition | Sono stati ritornati tutti i prodotti venduti                                                  |
|     Step#      | Descrizione                                                          |
|       1        | L’utente avvia l’interazione con il sistema chiedendo di poter avere l’elenco di tutti i prodotti venduti.                   |
|       2        | Il sistema ritorna tutti i prodotti venduti e le informazioni che li descrivono: codice, prezzo di vendita, modello, categoria, dettagli, data di arrivo e immagini illustrative. |


##### Scenario 5.4.2

|  Scenario 5.4.2  | Recupero di tutti i prodotti non venduti                                                |
| :------------: | :--------------------------------------------------------------------------------------------------------------------------: |
|  Precondition  | Solo un utente autenticato può accedere a questa funzione                                     |
| Post condition | Sono stati ritornati tutti i prodotti non venduti                                              |
|     Step#      | Descrizione                                                          |
|       1        | L’utente avvia l’interazione con il sistema chiedendo di poter avere l’elenco di tutti i prodotti non venduti.                   |
|       2        | Il sistema ritorna tutti i prodotti non venduti e le informazioni che li descrivono: codice, prezzo di vendita, modello, categoria, dettagli, data di arrivo e immagini illustrative. |


##### Scenario 5.5

|  Scenario 5.5  | Recupero del prodotto identificato da un certo codice                                                  |
| :------------: | :--------------------------------------------------------------------------------------------------------------------------: |
|  Precondition  | Solo un utente autenticato può accedere a questa funzione                                     |
| Post condition | E’ stato ritornato il prodotto identificato dal codice prodotto richiesto                                                   |
|     Step#      | Descrizione                                                          |
|       1        | L’utente avvia l’interazione con il sistema chiedendo di poter avere le informazioni che descrivono un certo prodotto.                   |
|       2        | Il sistema ritorna il prodotto identificato dal codice prodotto richiesto e le informazioni che lo descrivono: codice, prezzo di vendita, modello, categoria, dettagli, data di arrivo e immagini illustrative. |


##### Scenario 5.6

|  Scenario 5.6  | Recupero di tutti i prodotti appartenenti a una categoria specifica                                                  |
| :------------: | :--------------------------------------------------------------------------------------------------------------------------: |
|  Precondition  | Solo un utente autenticato può accedere a questa funzione                                     |
| Post condition | Sono stati ritornati tutti i prodotti della categoria richiesta                                                   |
|     Step#      | Descrizione                                                          |
|       1        | L’utente avvia l’interazione con il sistema chiedendo di poter avere l’elenco di tutti i prodotti appartenenti a una certa categoria. |
|       2        | Il sistema reagisce e chiede all’utente di inserire tale categoria. | 
|       3        | L’utente inserisce le informazioni richieste. |
|       4        | Il sistema valida le informazioni e ritorna tutti i prodotti della categoria richiesta e le informazioni che li descrivono: codice, prezzo di vendita, modello, categoria, dettagli, data di arrivo e immagini illustrative. |


##### Scenario 5.6.1

|  Scenario 5.6.1  | Recupero di tutti i prodotti venduti appartenenti a una categoria specifica                                                  |
| :------------: | :--------------------------------------------------------------------------------------------------------------------------: |
|  Precondition  | Solo un utente autenticato può accedere a questa funzione                                     |
| Post condition | Sono stati ritornati tutti i prodotti venduti della categoria richiesta                                                   |
|     Step#      | Descrizione                                                          |
|       1        | L’utente avvia l’interazione con il sistema chiedendo di poter avere l’elenco di tutti i prodotti venduti appartenenti a una certa categoria. |
|       2        | Il sistema reagisce e chiede all’utente di inserire tale categoria. | 
|       3        | L’utente inserisce le informazioni richieste. |
|       4        | Il sistema valida le informazioni e ritorna tutti i prodotti venduti della categoria richiesta e le informazioni che li descrivono: codice, prezzo di vendita, modello, categoria, dettagli, data di arrivo e immagini illustrative. 


##### Scenario 5.6.2

|  Scenario 5.6.2  | Recupero di tutti i prodotti non venduti appartenenti a una categoria specifica                                                  |
| :------------: | :--------------------------------------------------------------------------------------------------------------------------: |
|  Precondition  | Solo un utente autenticato può accedere a questa funzione                                     |
| Post condition | Sono stati ritornati tutti i prodotti non venduti della categoria richiesta                                                   |
|     Step#      | Descrizione                                                          |
|       1        | L’utente avvia l’interazione con il sistema chiedendo di poter avere l’elenco di tutti i prodotti non venduti appartenenti a una certa categoria. |
|       2        | Il sistema reagisce e chiede all’utente di inserire tale categoria. | 
|       3        | L’utente inserisce le informazioni richieste. |
|       4        | Il sistema valida le informazioni e ritorna tutti i prodotti non venduti della categoria richiesta e le informazioni che li descrivono: codice, prezzo di vendita, modello, categoria, dettagli, data di arrivo e immagini illustrative. 


##### Scenario 5.7

|  Scenario 5.7  | Recupero di tutti i prodotti di un modello specifico                                                  |
| :------------: | :--------------------------------------------------------------------------------------------------------------------------: |
|  Precondition  | Solo un utente autenticato può accedere a questa funzione                                     |
| Post condition | Sono stati ritornati tutti i prodotti del modello richiesto                                                   |
|     Step#      | Descrizione                                                          |
|       1        | L’utente avvia l’interazione con il sistema chiedendo di poter avere l’elenco di tutti i prodotti di un certo modello.                   |
|       2        | Il sistema reagisce e chiede all’utente di inserire tale modello. | 
|       3        | L’utente inserisce le informazioni richieste. |
|       4        | Il sistema valida le informazioni e ritorna tutti i prodotti del modello richiesto e le informazioni che li descrivono: codice, prezzo di vendita, modello, categoria, dettagli, data di arrivo e immagini illustrative. |


##### Scenario 5.7.1

|  Scenario 5.7.1 | Recupero di tutti i prodotti venduti di un modello specifico                                                  |
| :------------: | :--------------------------------------------------------------------------------------------------------------------------: |
|  Precondition  | Solo un utente autenticato può accedere a questa funzione                                     |
| Post condition | Sono stati ritornati tutti i prodotti venduti del modello richiesto                                                   |
|     Step#      | Descrizione                                                          |
|       1        | L’utente avvia l’interazione con il sistema chiedendo di poter avere l’elenco di tutti i prodotti venduti di un certo modello.             |
|       2        | Il sistema reagisce e chiede all’utente di inserire tale modello. | 
|       3        | L’utente inserisce le informazioni richieste. |
|       4        | Il sistema valida le informazioni e ritorna tutti i prodotti venduti del modello richiesto e le informazioni che li descrivono: codice, prezzo di vendita, modello, categoria, dettagli, data di arrivo e immagini illustrative. |


##### Scenario 5.7.2

|  Scenario 5.7.2  | Recupero di tutti i prodotti non venduti di un modello specifico                                                  |
| :------------: | :--------------------------------------------------------------------------------------------------------------------------: |
|  Precondition  | Solo un utente autenticato può accedere a questa funzione                                     |
| Post condition | Sono stati ritornati tutti i prodotti non venduti del modello richiesto                                                   |
|     Step#      | Descrizione                                                          |
|       1        | L’utente avvia l’interazione con il sistema chiedendo di poter avere l’elenco di tutti i prodotti non venduti di un certo modello.          |
|       2        | Il sistema reagisce e chiede all’utente di inserire tale modello. | 
|       3        | L’utente inserisce le informazioni richieste. |
|       4        | Il sistema valida le informazioni e ritorna tutti i prodotti non venduti del modello richiesto e le informazioni che li descrivono: codice, prezzo di vendita, modello, categoria, dettagli, data di arrivo e immagini illustrative. |


##### Scenario 5.8

|  Scenario 5.8  | Eliminazione del prodotto identificato da un certo codice                                                  |
| :------------: | :--------------------------------------------------------------------------------------------------------------------------: |
|  Precondition  | Solo un utente autenticato il cui ruolo è Manager può accedere a questa funzione                                     |
| Post condition | E’ stato eliminato il prodotto identificato dal codice prodotto inserito                                                   |
|     Step#      | Descrizione                                                          |
|       1        | L’utente avvia l’interazione con il sistema chiedendo di poter eliminare un certo prodotto.                   |
|       2        | Il sistema verifica che tale utente autenticato con il ruolo di Manager sia proprio colui che ha registrato l'arrivo di quello specifico prodotto. |
|       6        | Il sistema elimina tale prodotto. |


##### Scenario 5.9

|  Scenario 5.9  | Modifica delle informazioni del concetto di prodotto identificato da un certo codice                                                  |
| :------------: | :--------------------------------------------------------------------------------------------------------------------------: |
|  Precondition  | Solo un utente autenticato il cui ruolo è Manager può accedere a questa funzione                                     |
| Post condition | Sono state modificate le informazioni del concetto di prodotto identificato dal codice prodotto inserito                                                   |
|     Step#      | Descrizione                                                          |
|       1        | L’utente Manager avvia l’interazione con il sistema chiedendo di poter modificare le informazioni di un certo concetto di prodotto.                   |
|       2        | Il sistema chiede all’utente Manager di inserire le informazioni del concetto di prodotto che vuole modificare. |
|       3        | L’utente inserisce le informazioni richieste. |
|       4        | Il sistema valida le informazioni e chiede l'approvazione dell'utente Technical User. |
|       5        | L'utente Technical User approva le modifiche proposte dall'utente Manager. |
|       6        | Il sistema modifica le informazioni di tale concetto di prodotto. |


##### Scenario 5.10
|  Scenario 5.10  | Creazione di una nuova categoria                                                           |
| :------------: | :--------------------------------------------------------------------------------------------------------------------------: |
|  Precondition  | Solo un utente autenticato il cui ruolo è Technical User può accedere a questa funzione |
| Post condition | E’ stata creata una nuova categoria                                          |
|     Step#      | Descrizione                                                          |
|       1        | L’utente avvia l’interazione con il sistema chiedendo di poter creare una nuova categoria.                      |
|       2        | Il sistema reagisce e chiede all’utente di inserire le informazioni necessarie per la creazione di una nuova categoria: nome della categoria. |  
|       3        | L’utente inserisce le informazioni richieste.                      |
|       4        | Il sistema valida le informazioni, crea la nuova categoria e salva le informazioni.                     |


##### Scenario 5.11

|  Scenario 5.11  | Creazione di un nuovo concetto di prodotto (il modello identifica un concetto di prodotto già presente) |
| :------------: | :--------------------------------------------------------------------------------------------------------------------------: |
|  Precondition  | Solo un utente autenticato il cui ruolo è Manager può accedere a questa funzione |
| Post condition | Non è stato creato un nuovo concetto di prodotto con le informazioni fornite                                          |
|     Step#      | Descrizione                                                          |
|       1        | L’utente avvia l’interazione con il sistema chiedendo di poter creare un nuovo concetto di prodotto.                      |
|       2        | Il sistema reagisce e chiede all’utente di inserire le informazioni necessarie per la creazione di un nuovo concetto di prodotto: modello, categoria, dettagli, prezzo di vendita e immagini illustrative. | 
|       3        | L’utente inserisce le informazioni richieste.                      |
|       4        | Il sistema valida le informazioni ma il concetto di prodotto è identificato da un modello che è già presente, il sistema mostra un messaggio di errore e termina con fallimento.         |


##### Scenario 5.13

|  Scenario 5.13  | Registrazione dell'arrivo di 1 o più prodotti dello stesso modello (la data di arrivo dei prodotti è successiva alla data corrente)  |
| :------------: | :--------------------------------------------------------------------------------------------------------------------------: |
|  Precondition  | Solo un utente autenticato il cui ruolo è Manager può accedere a questa funzione                                   |
| Post condition | Non è stato registrato l’arrivo dei prodotti indicati                                                   |
|     Step#      | Descrizione                                                          |
|       1        | L’utente avvia l’interazione con il sistema chiedendo di poter registrare l’arrivo di 1 o più prodotti dello stesso modello.    |
|       2        | Il sistema reagisce e chiede all’utente di inserire le informazioni necessarie per la registrazione dell'arrivo di 1 o più prodotti dello stesso modello: data di arrivo. Il codice verrà generato automaticamente dal sistema. |     
|       3        | L’utente inserisce le informazioni richieste.                      |
|       4        | Il sistema valida le informazioni ma la data di arrivo dei prodotti è successiva alla data corrente, il sistema mostra un messaggio di errore e termina con fallimento.   |


##### Scenario 5.14

|  Scenario 5.14  | Contrassegnazione di un prodotto come venduto (il codice prodotto non identifica un prodotto già presente) |
| :------------: | :--------------------------------------------------------------------------------------------------------------------------: |
|  Precondition  | Solo un utente autenticato il cui ruolo è Manager può accedere a questa funzione                                     |
| Post condition | Il prodotto venduto non è stato contrassegnato come tale                                                  |
|     Step#      | Descrizione                                                          |
|       1        | L’utente avvia l’interazione con il sistema chiedendo di poter contrassegnare come venduto un prodotto.                   |
|       2        | Il codice del prodotto non identifica nessun prodotto presente, il sistema mostra un messaggio di errore e termina con fallimento.  | 


##### Scenario 5.15

|  Scenario 5.15  | Contrassegnazione di un prodotto come venduto (la data di vendita è successiva alla data corrente) |
| :------------: | :--------------------------------------------------------------------------------------------------------------------------: |
|  Precondition  | Solo un utente autenticato il cui ruolo è Manager può accedere a questa funzione                                     |
| Post condition | Il prodotto venduto non è stato contrassegnato come tale                                                  |
|     Step#      | Descrizione                                                          |
|       1        | L’utente avvia l’interazione con il sistema chiedendo di poter contrassegnare come venduto un prodotto.                   |
|       2        | Il sistema recupera tale prodotto, la data di vendita è successiva alla data corrente, il sistema mostra un messaggio di errore e termina con fallimento.  | 


##### Scenario 5.16

|  Scenario 5.16  | Contrassegnazione di un prodotto come venduto (la data di vendita è precedente alla data di arrivo) |
| :------------: | :--------------------------------------------------------------------------------------------------------------------------: |
|  Precondition  | Solo un utente autenticato il cui ruolo è Manager può accedere a questa funzione                                     |
| Post condition | Il prodotto venduto non è stato contrassegnato come tale                                                  |
|     Step#      | Descrizione                                                          |
|       1        | L’utente avvia l’interazione con il sistema chiedendo di poter contrassegnare come venduto un prodotto.                   |
|       2        | Il sistema recupera tale prodotto, la data di vendita è precedente alla data di arrivo, il sistema mostra un messaggio di errore e termina con fallimento.  | 


##### Scenario 5.17

|  Scenario 5.17  | Contrassegnazione di un prodotto come venduto (il prodotto è già stato venduto) |
| :------------: | :--------------------------------------------------------------------------------------------------------------------------: |
|  Precondition  | Solo un utente autenticato il cui ruolo è Manager può accedere a questa funzione                                     |
| Post condition | Il prodotto venduto è già stato contrassegnato come tale                                                  |
|     Step#      | Descrizione                                                          |
|       1        | L’utente avvia l’interazione con il sistema chiedendo di poter contrassegnare come venduto un prodotto.                   |
|       2        | Il sistema recupera tale prodotto, il prodotto è già stato venduto, il sistema mostra un messaggio di errore e termina con fallimento.  |


##### Scenario 5.18

|  Scenario 5.18  | Recupero del prodotto identificato da un certo codice (il codice prodotto non identifica un prodotto già presente) |
| :------------: | :--------------------------------------------------------------------------------------------------------------------------: |
|  Precondition  | Solo un utente autenticato può accedere a questa funzione                                     |
| Post condition | Non è stato ritornato il prodotto identificato dal codice prodotto richiesto                                                   |
|     Step#      | Descrizione                                                          |
|       1        | L’utente avvia l’interazione con il sistema chiedendo di poter avere le informazioni che descrivono un certo prodotto.                   |
|       2        | Il codice del prodotto non identifica nessun prodotto presente, il sistema mostra un messaggio di errore e termina con fallimento. |


##### Scenario 5.19

|  Scenario 5.19  | Eliminazione del prodotto identificato da un certo codice (il codice prodotto non identifica un prodotto già presente) |
| :------------: | :--------------------------------------------------------------------------------------------------------------------------: |
|  Precondition  | Solo un utente autenticato il cui ruolo è Manager può accedere a questa funzione                                     |
| Post condition | Non è stato eliminato il prodotto identificato dal codice prodotto inserito perchè tale prodotto non è presente    |
|     Step#      | Descrizione                                                          |
|       1        | L’utente avvia l’interazione con il sistema chiedendo di poter eliminare un certo prodotto.                   |
|       2        | Il codice del prodotto non identifica nessun prodotto presente, il sistema mostra un messaggio di errore e termina con fallimento. |


### Use case 6, Gestione dei carrelli (UC6)

| Actors Involved  | Utente, sistema di pagamento (per 6.2), sistema di spedizione (per 6.2)                                   |
| :--------------: | :-----------------------------------------------: |
|   Precondition   | Solo un utente autenticato il cui ruolo è Customer può accedere a questa funzione |
|  Post condition  | E’ stato restituito il carrello attuale dell’utente autenticato, è stato effettuato il pagamento del carrello attuale dell'utente autenticato, è stato aggiunto un prodotto al carrello attuale dell’utente autenticato, è stata recuperata la cronologia dei carrelli che sono stati pagati dall'utente corrente (il carrello attuale non è incluso nell'elenco), è stato eliminato il prodotto richiesto dal carrello attuale dell’utente, è stato eliminato il carrello attuale dell’utente autenticatoautenticato          |
| Nominal Scenario | Scenario 6.1, 6.2, 6.3, 6.4, 6.5, 6.6                 |
|     Variants     | Varianti di 6.2: 6.2.1                   |
|    Exceptions    | Exceptions di 6.2: 6.17, 6.18, 6.19, 6.20, exceptions di 6.3: 6.7, 6.8, 6.9, exceptions di 6.2: 6.10, 6.11, 6.17, 6.18, 6.19, 6.20, exceptions di 6.5: 6.12, 6.13, 6.14, 6.15, exceptions di 6.6: 6.16 |

##### Scenario 6.1

|  Scenario 6.1  | Recupero del carrello attuale dell'utente autenticato                                                           |
| :------------: | :--------------------------------------------------------------------------------------------------------------------------: |
|  Precondition  | Solo un utente autenticato il cui ruolo è Customer può accedere a questa funzione |
| Post condition | E’ stato restituito il carrello attuale dell’utente autenticato                                                   |
|     Step#      | Descrizione                                                          |
|       1        | L’utente avvia l’interazione con il sistema chiedendo di poter avere il carrello attuale dell’utente autenticato.                      |
|       2        | Il sistema reagisce e ritorna il carrello dell'utente attualmente autenticato, che contiene l’elenco di tutti i prodotti inseriti finora nel carrello. |  

##### Scenario 6.2

|  Scenario 6.2  |                                                            Pagamento del carrello e spedizione dell'ordine dell'utente attualmente autenticato                                                            |
| :------------: | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
|  Precondition  |                                                             Solo un utente autenticato il cui ruolo è Customer può accedere a questa funzione                                                             |
| Post condition |                                                               E’ stato effettuato il pagamento del carrello attuale dell'utente autenticato                                                               |
|     Step#      |                                                                                                Descrizione                                                                                                |
|       1        |                                                        L’utente avvia l’interazione con il sistema chiedendo di poter pagare il carrello attuale.                                                         |
|       2        |                   Il sistema reagisce, recupera il carrello attuale (scenario 6.1) e calcola il prezzo totale del carrello come somma dei prezzi di ogni prodotto incluso nel carrello.                   |
|       3        |                        Il sistema avvia l’interazione con i sistemi di spedizione di ogni corriere inviando loro il peso dell'ordine e l'indirizzo di spedizione del destinatario.                        |
|       4        |                      Ognuno di questi sistemi di spedizione elabora questi 2 parametri ricevuti dal sistema e calcola il costo della spedizione e una stima della data di consegna.                       |
|       5        |                                                  Il sistema comunica le possibili alternative all'utente ordinate per data di consegna stimata e costo.                                                   |
|       6        |                                                                      L'utente seleziona l'alternativa di spedizione che preferisce.                                                                       |
|       7        |                                                 Il sistema chiede all’utente di scegliere un metodo di pagamento digitale (carta di credito, PayPal, …).                                                  |
|       8        |                                                                          L’utente sceglie il metodo di pagamento che preferisce.                                                                          |
|       9        |                                                           Il sistema chiede all’utente di inserire le credenziali per autorizzare il pagamento.                                                           |
|       10        |                                                           L'utente inserisce le credenziali. |
|       11       |                     Il sistema valida le informazioni, invia la richiesta di autorizzazione del pagamento e le relative credenziali al gestore della transazione (ente bancario, …).                      |
|       12       |                                                     Il gestore della transazione valida le credenziali, verifica il saldo tenendo conto dei costi di spedizione calcolati al punto 3 e autorizza la transazione                                                      |
|       13       | Il sistema contrassegna il carrello come pagato, assegna come data di pagamento la data corrente e salva l'id della transazione di pagamento. |
|       14       |                                                         Il sistema affida la spedizione al sistema di spedizione del corriere scelto dall'utente.                                                         |

##### Scenario 6.2.1

|  Scenario 6.2.1  |                                                            Pagamento del carrello e spedizione dell'ordine dell'utente attualmente autenticato con modifica dell'indirizzo di spedizione                                                           |
| :------------: | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
|  Precondition  |                                                             Solo un utente autenticato il cui ruolo è Customer può accedere a questa funzione                                                             |
| Post condition |                                                               E’ stato effettuato il pagamento del carrello attuale dell'utente autenticato                                                               |
|     Step#      |                                                                                                Descrizione                                                                                                |
|       1        |                                                        L’utente avvia l’interazione con il sistema chiedendo di poter pagare il carrello attuale.                                                         |
|       2        |                   Il sistema reagisce, recupera il carrello attuale (scenario 6.1) e calcola il prezzo totale del carrello come somma dei prezzi di ogni prodotto incluso nel carrello.                   |
|       3        |           L'utente chiede di modificare il proprio indirizzo di spedizione (scenario 4.6).   |
|       4        |                        Il sistema avvia l’interazione con i sistemi di spedizione di ogni corriere inviando loro il peso dell'ordine e l'indirizzo di spedizione del destinatario.                        |
|       5        |                      Ognuno di questi sistemi di spedizione elabora questi 2 parametri ricevuti dal sistema e calcola il costo della spedizione e una stima della data di consegna.                       |
|       6        |                                                  Il sistema comunica le possibili alternative all'utente ordinate per data di consegna stimata e costo.                                                   |
|       7        |                                                                      L'utente seleziona l'alternativa di spedizione che preferisce.                                                                       |
|       8        |                                                 Il sistema chiede all’utente di scegliere un metodo di pagamento digitale (carta di credito, PayPal, …).                                                  |
|       9        |                                                                          L’utente sceglie il metodo di pagamento che preferisce.                                                                          |
|       10        |                                                           Il sistema chiede all’utente di inserire le credenziali per autorizzare il pagamento.                                                           |
|       11        |                                                           L'utente inserisce le credenziali. |
|       12       |                     Il sistema valida le informazioni, invia la richiesta di autorizzazione del pagamento e le relative credenziali al gestore della transazione (ente bancario, …).                      |
|       13       |                                                     Il gestore della transazione valida le credenziali, verifica il saldo tenendo conto dei costi di spedizione calcolati al punto 3 e autorizza la transazione                                                      |
|       14       | Il sistema contrassegna il carrello come pagato, assegna come data di pagamento la data corrente e salva l'id della transazione di pagamento. |
|       15       |                                                         Il sistema affida la spedizione al sistema di spedizione del corriere scelto dall'utente.                                                         |

##### Scenario 6.3

|  Scenario 6.3  |                         Aggiunta di un prodotto al carrello attuale dell’utente autenticato                          |
| :------------: | :------------------------------------------------------------------------------------------------------------------: |
|  Precondition  |                  Solo un utente autenticato il cui ruolo è Customer può accedere a questa funzione                   |
| Post condition |                      E’ stato aggiunto un prodotto al carrello attuale dell’utente autenticato                       |
|     Step#      |                                                     Descrizione                                                      |
|       1        |      L’utente avvia l’interazione con il sistema chiedendo di poter aggiungere un prodotto al carrello attuale.      |                                  |
|       2        | Il sistema recupera tale prodotto e aggiunge il prodotto al carrello dell’utente autenticato. |

##### Scenario 6.4

|  Scenario 6.4  | Recupero della cronologia dei carrelli che sono stati pagati dall'utente corrente                                                  |
| :------------: | :--------------------------------------------------------------------------------------------------------------------------: |
|  Precondition  | Solo un utente autenticato il cui ruolo è Customer può accedere a questa funzione                                   |
| Post condition | E’ stata recuperata la cronologia dei carrelli che sono stati pagati dall'utente corrente (il carrello attuale non è incluso nell'elenco)                                                  |
|     Step#      | Descrizione                                                          |
|       1        | L’utente avvia l’interazione con il sistema chiedendo di poter avere la cronologia dei carrelli che sono stati da lui pagati.    |
|       2        | Il sistema reagisce e ritorna la cronologia dei carrelli che sono stati pagati dall'utente corrente. |     

##### Scenario 6.5

|  Scenario 6.5  | Eliminazione di un prodotto del carrello attuale dell’utente autenticato                                                  |
| :------------: | :--------------------------------------------------------------------------------------------------------------------------: |
|  Precondition  | Solo un utente autenticato il cui ruolo è Customer può accedere a questa funzione                                   |
| Post condition | E’ stato eliminato il prodotto richiesto dal carrello attuale dell’utente autenticato                                                   |
|     Step#      | Descrizione                                                          |
|       1        | L’utente avvia l’interazione con il sistema chiedendo di poter eliminare un certo prodotto dal proprio carrello attuale.                   |
|       2        | Il sistema elimina tale prodotto. |

##### Scenario 6.6

|  Scenario 6.6  | Eliminazione del carrello attuale dell'utente autenticato                                                  |
| :------------: | :--------------------------------------------------------------------------------------------------------------------------: |
|  Precondition  | Solo un utente autenticato il cui ruolo è Customer può accedere a questa funzione                                     |
| Post condition | E’ stato eliminato il carrello attuale dell’utente autenticato                                                   |
|     Step#      | Descrizione                                                          |
|       1        | L’utente avvia l’interazione con il sistema chiedendo di poter eliminare il proprio carrello attuale. |
|       2        | Il sistema elimina tale carrello. | 


##### Scenario 6.7

|  Scenario 6.7  | Aggiunta di un prodotto al carrello attuale dell’utente autenticato (il codice prodotto non identifica un prodotto già presente) |
| :------------: | :--------------------------------------------------------------------------------------------------------------------------: |
|  Precondition  | Solo un utente autenticato il cui ruolo è Customer può accedere a questa funzione                                 |
| Post condition | Non è stato aggiunto un prodotto al carrello attuale dell’utente autenticato                                                 |
|     Step#      | Descrizione                                                          |
|       1        | L’utente avvia l’interazione con il sistema chiedendo di poter aggiungere un prodotto al carrello attuale.                  |
|       2        | Il codice del prodotto non identifica nessun prodotto presente, il sistema mostra un messaggio di errore e termina con fallimento. |


##### Scenario 6.8

|  Scenario 6.8  | Aggiunta di un prodotto al carrello attuale dell’utente autenticato (il codice prodotto identifica un prodotto che è già in un altro carrello) |
| :------------: | :--------------------------------------------------------------------------------------------------------------------------: |
|  Precondition  | Solo un utente autenticato il cui ruolo è Customer può accedere a questa funzione                                 |
| Post condition | Non è stato aggiunto un prodotto al carrello attuale dell’utente autenticato                                                 |
|     Step#      | Descrizione                                                          |
|       1        | L’utente avvia l’interazione con il sistema chiedendo di poter aggiungere un prodotto al carrello attuale.                  |
|       2        | Il codice prodotto identifica un prodotto che è già in un altro carrello, il sistema mostra un messaggio di errore e termina con fallimento. |


##### Scenario 6.9

|  Scenario 6.9  | Aggiunta di un prodotto al carrello attuale dell’utente autenticato (il codice prodotto identifica un prodotto che è già stato venduto) |
| :------------: | :--------------------------------------------------------------------------------------------------------------------------: |
|  Precondition  | Solo un utente autenticato il cui ruolo è Customer può accedere a questa funzione                                 |
| Post condition | Non è stato aggiunto un prodotto al carrello attuale dell’utente autenticato                                                 |
|     Step#      | Descrizione                                                          |
|       1        | L’utente avvia l’interazione con il sistema chiedendo di poter aggiungere un prodotto al carrello attuale.                  |
|       2        | Il sistema recupera tale prodotto, il codice prodotto identifica un prodotto che è già stato venduto, il sistema mostra un messaggio di errore e termina con fallimento. |


##### Scenario 6.10

|  Scenario 6.10  | Pagamento del carrello attuale dell'utente autenticato (l'utente autenticato non ha un carrello) |
| :------------: | :--------------------------------------------------------------------------------------------------------------------------: |
|  Precondition  | Solo un utente autenticato il cui ruolo è Customer può accedere a questa funzione                                     |
| Post condition | Non è stato effettuato il pagamento del carrello attuale dell'utente autenticato perchè l'utente autenticato non ha un carrello |
|     Step#      | Descrizione                                                          |
|       1        | L’utente avvia l’interazione con il sistema chiedendo di poter pagare il carrello attuale.                   |
|       2        | Il sistema reagisce, cerca di recuperare il carrello attuale (scenario 6.1) ma l'utente autenticato non ha un carrello, il sistema mostra un messaggio di errore e termina con fallimento. |


##### Scenario 6.11

|  Scenario 6.11  | Pagamento del carrello attuale dell'utente autenticato (l'utente autenticato ha un carrello vuoto) |
| :------------: | :--------------------------------------------------------------------------------------------------------------------------: |
|  Precondition  | Solo un utente autenticato il cui ruolo è Customer può accedere a questa funzione                                     |
| Post condition | Non è stato effettuato il pagamento del carrello attuale dell'utente autenticato perchè l'utente autenticato ha un carrello vuoto |
|     Step#      | Descrizione                                                          |
|       1        | L’utente avvia l’interazione con il sistema chiedendo di poter pagare il carrello attuale.                   |
|       2        | Il sistema reagisce, recupera il carrello attuale (scenario 6.1) ma l'utente autenticato ha un carrello vuoto, il sistema mostra un messaggio di errore e termina con fallimento. |


##### Scenario 6.12

|  Scenario 6.12  | Eliminazione di un prodotto del carrello attuale dell’utente autenticato (il codice prodotto non identifica un prodotto che è presente nel carrello) |
| :------------: | :--------------------------------------------------------------------------------------------------------------------------: |
|  Precondition  | Solo un utente autenticato il cui ruolo è Customer può accedere a questa funzione                                   |
| Post condition | Non è stato eliminato il prodotto richiesto dal carrello attuale dell’utente autenticato perchè non è presente nel carrello |
|     Step#      | Descrizione                                                          |
|       1        | L’utente avvia l’interazione con il sistema chiedendo di poter eliminare un certo prodotto dal proprio carrello attuale.                   |
|       2        | Il codice prodotto non identifica un prodotto che è presente nel carrello, il sistema mostra un messaggio di errore e termina con fallimento. |


##### Scenario 6.13

|  Scenario 6.13  | Eliminazione di un prodotto del carrello attuale dell’utente autenticato (l'utente autenticato non ha un carrello) |
| :------------: | :--------------------------------------------------------------------------------------------------------------------------: |
|  Precondition  | Solo un utente autenticato il cui ruolo è Customer può accedere a questa funzione                                   |
| Post condition | Non è stato eliminato il prodotto richiesto dal carrello attuale dell’utente autenticato perchè l'utente autenticato non ha un carrello |
|     Step#      | Descrizione                                                          |
|       1        | L’utente avvia l’interazione con il sistema chiedendo di poter eliminare un certo prodotto dal proprio carrello attuale.                   |
|       2        | L'utente autenticato non ha un carrello, il sistema mostra un messaggio di errore e termina con fallimento. |


##### Scenario 6.14

|  Scenario 6.14  | Eliminazione di un prodotto del carrello attuale dell’utente autenticato (il codice prodotto non identifica un prodotto che è presente nel database) |
| :------------: | :--------------------------------------------------------------------------------------------------------------------------: |
|  Precondition  | Solo un utente autenticato il cui ruolo è Customer può accedere a questa funzione                                   |
| Post condition | Non è stato eliminato il prodotto richiesto dal carrello attuale dell’utente autenticato |
|     Step#      | Descrizione                                                          |
|       1        | L’utente avvia l’interazione con il sistema chiedendo di poter eliminare un certo prodotto dal proprio carrello attuale.                   |
|       2        | Il codice prodotto non identifica un prodotto che è presente nel database, il sistema mostra un messaggio di errore e termina con fallimento. |


##### Scenario 6.15

|  Scenario 6.15  | Eliminazione di un prodotto del carrello attuale dell’utente autenticato (il codice prodotto identifica un prodotto che è già stato venduto) |
| :------------: | :--------------------------------------------------------------------------------------------------------------------------: |
|  Precondition  | Solo un utente autenticato il cui ruolo è Customer può accedere a questa funzione                                   |
| Post condition | Non è stato eliminato il prodotto richiesto dal carrello attuale dell’utente autenticato |
|     Step#      | Descrizione                                                          |
|       1        | L’utente avvia l’interazione con il sistema chiedendo di poter eliminare un certo prodotto dal proprio carrello attuale.                   |
|       2        | Il sistema recupera tale prodotto, il codice prodotto identifica un prodotto che è già stato venduto, il sistema mostra un messaggio di errore e termina con fallimento. |


##### Scenario 6.16

|  Scenario 6.16  | Eliminazione del carrello attuale dell'utente autenticato (l'utente autenticato non ha un carrello)       |
| :------------: | :--------------------------------------------------------------------------------------------------------------------------: |
|  Precondition  | Solo un utente autenticato il cui ruolo è Customer può accedere a questa funzione                                     |
| Post condition | Non è stato eliminato il carrello attuale dell’utente autenticato                                                   |
|     Step#      | Descrizione                                                          |
|       1        | L’utente avvia l’interazione con il sistema chiedendo di poter eliminare il proprio carrello attuale. |
|       2        | Il sistema verifica che l'utente autenticato non ha un carrello, mostra un messaggio di errore e termina con fallimento. | 


##### Scenario 6.17

| Scenario 6.17  |                            Pagamento del carrello attuale dell'utente autenticato (le credenziali del metodo di pagamento sono sbagliate)                             |
| :------------: | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
|  Precondition  |                                                             Solo un utente autenticato il cui ruolo è Customer può accedere a questa funzione                                                             |
| Post condition |                                                               Non è stato effettuato il pagamento del carrello attuale dell'utente autenticato                                                               |
|     Step#      |                                                                                                Descrizione                                                                                                |
|       1        |                                                        L’utente avvia l’interazione con il sistema chiedendo di poter pagare il carrello attuale.                                                         |
|       2        |                   Il sistema reagisce, recupera il carrello attuale (scenario 6.1) e calcola il prezzo totale del carrello come somma dei prezzi di ogni prodotto incluso nel carrello.                   |
|       3        |                        Il sistema avvia l’interazione con i sistemi di spedizione di ogni corriere inviando loro il peso dell'ordine e l'indirizzo di spedizione del destinatario.                        |
|       4        |                      Ognuno di questi sistemi di spedizione elabora questi 2 parametri ricevuti dal sistema e calcola il costo della spedizione e una stima della data di consegna.                       |
|       5        |                                                  Il sistema comunica le possibili alternative all'utente ordinate per data di consegna stimata e costo.                                                   |
|       6        |                                                                      L'utente seleziona l'alternativa di spedizione che preferisce.                                                                       |
|       7        |                                                 Il sistema chiede all’utente di scegliere un metodo di pagamento digitale (carta di credito, PayPal, …).                                                  |
|       8        |                                                                          L’utente sceglie il metodo di pagamento che preferisce.                                                                          |
|       9        |                                                           Il sistema chiede all’utente di inserire le credenziali per autorizzare il pagamento.                                                           |
|       10        |                                                           L'utente inserisce le credenziali. |
|       11        |                Il gestore della transazione verifica che le credenziali del metodo di pagamento sono sbagliate pertanto non autorizza la transazione.                 |
|       12        |                                                  Il sistema mostra un messaggio di errore e termina con fallimento.                       |                          


##### Scenario 6.18

| Scenario 6.18  |                        Pagamento del carrello attuale dell'utente autenticato (il metodo di pagamento scelto non è disponibile perchè dev'essere rinnovato)                         |
| :------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
|  Precondition  |                                                  Solo un utente autenticato il cui ruolo è Customer può accedere a questa funzione                                                  |
| Post condition |                                                    Non è stato effettuato il pagamento del carrello attuale dell'utente autenticato                                                    |
|     Step#      |                                                                                     Descrizione                                                                                     |
|       1        |                                                        L’utente avvia l’interazione con il sistema chiedendo di poter pagare il carrello attuale.                                                         |
|       2        |                   Il sistema reagisce, recupera il carrello attuale (scenario 6.1) e calcola il prezzo totale del carrello come somma dei prezzi di ogni prodotto incluso nel carrello.                   |
|       3        |                        Il sistema avvia l’interazione con i sistemi di spedizione di ogni corriere inviando loro il peso dell'ordine e l'indirizzo di spedizione del destinatario.                        |
|       4        |                      Ognuno di questi sistemi di spedizione elabora questi 2 parametri ricevuti dal sistema e calcola il costo della spedizione e una stima della data di consegna.                       |
|       5        |                                                  Il sistema comunica le possibili alternative all'utente ordinate per data di consegna stimata e costo.                                                   |
|       6        |                                                                      L'utente seleziona l'alternativa di spedizione che preferisce.                                                                       |
|       7        |                                                 Il sistema chiede all’utente di scegliere un metodo di pagamento digitale (carta di credito, PayPal, …).                                                  |
|       8        |                                                                          L’utente sceglie il metodo di pagamento che preferisce.                                                                          |
|       9        |                                                           Il sistema chiede all’utente di inserire le credenziali per autorizzare il pagamento.                                                           |
|       11        |                                                           L'utente inserisce le credenziali. |
|       12        | Il gestore della transazione valida le credenziali, verifica che il metodo di pagamento scelto non è disponibile perchè dev'essere rinnovato pertanto non autorizza la transazione. |
|       13        |                                                         Il sistema mostra un messaggio di errore e termina con fallimento.                                                          |


##### Scenario 6.19

| Scenario 6.19  |                          Pagamento del carrello attuale dell'utente autenticato (il saldo del conto corrente dell'utente non è sufficiente)                           |
| :------------: | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
|  Precondition  |                                           Solo un utente autenticato il cui ruolo è Customer può accedere a questa funzione                                           |
| Post condition |                                             Non è stato effettuato il pagamento del carrello attuale dell'utente autenticato                                             |
|     Step#      |                                                                              Descrizione                                                                              |
|       1        |                                                        L’utente avvia l’interazione con il sistema chiedendo di poter pagare il carrello attuale.                                                         |
|       2        |                   Il sistema reagisce, recupera il carrello attuale (scenario 6.1) e calcola il prezzo totale del carrello come somma dei prezzi di ogni prodotto incluso nel carrello.                   |
|       3        |                        Il sistema avvia l’interazione con i sistemi di spedizione di ogni corriere inviando loro il peso dell'ordine e l'indirizzo di spedizione del destinatario.                        |
|       4        |                      Ognuno di questi sistemi di spedizione elabora questi 2 parametri ricevuti dal sistema e calcola il costo della spedizione e una stima della data di consegna.                       |
|       5        |                                                  Il sistema comunica le possibili alternative all'utente ordinate per data di consegna stimata e costo.                                                   |
|       6        |                                                                      L'utente seleziona l'alternativa di spedizione che preferisce.                                                                       |
|       7        |                                                 Il sistema chiede all’utente di scegliere un metodo di pagamento digitale (carta di credito, PayPal, …).                                                  |
|       8        |                                                                          L’utente sceglie il metodo di pagamento che preferisce.                                                                          |
|       9        |                                                           Il sistema chiede all’utente di inserire le credenziali per autorizzare il pagamento.                                                           |
|       10        |                                                           L'utente inserisce le credenziali. |
|       11       |                     Il sistema valida le informazioni, invia la richiesta di autorizzazione del pagamento e le relative credenziali al gestore della transazione (ente bancario, …).                      |
|       12        |            Il gestore della transazione valida le credenziali, verifica che il saldo disponibile non è sufficiente tenendo conto dei costi di spedizione calcolati al punto 3 pertanto non autorizza la transazione.             |
|       13        |                                                  Il sistema mostra un messaggio di errore e termina con fallimento.                                                   |


##### Scenario 6.20

|  Scenario 6.20  | Pagamento del carrello attuale dell'utente autenticato (impossibilità di comunicare con il gestore della transazione a causa di problemi di rete) |
| :------------: | :--------------------------------------------------------------------------------------------------------------------------: |
|  Precondition  | Solo un utente autenticato il cui ruolo è Customer può accedere a questa funzione                                     |
| Post condition | Non è stato effettuato il pagamento del carrello attuale dell'utente autenticato                                                  |
|     Step#      | Descrizione                                                          |
|       1        |                                                        L’utente avvia l’interazione con il sistema chiedendo di poter pagare il carrello attuale.                                                         |
|       2        |                   Il sistema reagisce, recupera il carrello attuale (scenario 6.1) e calcola il prezzo totale del carrello come somma dei prezzi di ogni prodotto incluso nel carrello.                   |
|       3        |                        Il sistema avvia l’interazione con i sistemi di spedizione di ogni corriere inviando loro il peso dell'ordine e l'indirizzo di spedizione del destinatario.                        |
|       4        |                      Ognuno di questi sistemi di spedizione elabora questi 2 parametri ricevuti dal sistema e calcola il costo della spedizione e una stima della data di consegna.                       |
|       5        |                                                  Il sistema comunica le possibili alternative all'utente ordinate per data di consegna stimata e costo.                                                   |
|       6        |                                                                      L'utente seleziona l'alternativa di spedizione che preferisce.                                                                       |
|       7        |                                                 Il sistema chiede all’utente di scegliere un metodo di pagamento digitale (carta di credito, PayPal, …).                                                  |
|       8        |                                                                          L’utente sceglie il metodo di pagamento che preferisce.                                                                          |
|       9        |                                                           Il sistema chiede all’utente di inserire le credenziali per autorizzare il pagamento.                                                           |
|       10        |                                                           L'utente inserisce le credenziali. |
|       11        | Il sistema non riesce a comunicare con il gestore della transazione a causa di problemi di rete pertanto mostra un messaggio di errore e termina con fallimento. | 
                                             

### Use case 7, Gestione della spedizione (UC7)

| Actors Involved  | Utente, sistema di spedizione                                   |
| :--------------: | :-----------------------------------------------: |
|   Precondition   | Solo un utente autenticato il cui ruolo è Technical User può accedere a questa funzione   |
|  Post condition  | La spedizione dell'ordine è stata presa in carico dal corriere scelto dall'utente, il nuovo corriere è stato inserito nella lista dei corrieri contattabili per la spedizione, il corriere indicato è stato eliminato dalla lista dei corrieri contattabili per la spedizione  |
| Nominal Scenario | Scenario 7.1, 7.2, 7.3      |
|     Variants     |                    |
|    Exceptions    |                    |
  

##### Scenario 7.1

|  Scenario 7.1  | Inserimento di un nuovo corriere nella lista dei corrieri contattabili per la spedizione                     |
| :------------: | :--------------------------------------------------------------------------------------------------------------------------: |
|  Precondition  | Solo un utente autenticato il cui ruolo è Technical User può accedere a questa funzione           |
| Post condition | Il nuovo corriere è stato inserito nella lista dei corrieri contattabili per la spedizione      |
|     Step#      | Descrizione                                                          |
|       1        | Il sistema avvia l’interazione con il sistema di spedizione di un corriere per proporgli di essere inserito nella lista dei corrieri contattabili per la spedizione.  |
|       2        | Il sistema di spedizione del corriere risponde al sistema confermando la proprià disponibilita e gli fornisce le proprie informazioni di contatto: nome, email, numero di telefono e API route del sistema di spedizione per calcolo dei costi di spedizione e della stima della data di consegna, creazione e gestione degli ordini di spedizione, generazione di etichette di spedizione, tracciamento delle spedizioni e notifiche di consegna. |  
|       3        | Il sistema valida le informazioni, inserisce il nuovo corriere e salva le informazioni.  |


##### Scenario 7.2

|  Scenario 7.2  |                                 Eliminazione di un corriere dalla lista dei corrieri contattabili per la spedizione                                 |
| :------------: | :-------------------------------------------------------------------------------------------------------------------------------------------------: |
|  Precondition  |                               Solo un utente autenticato il cui ruolo è Technical User può accedere a questa funzione                               |
| Post condition |                           Il corriere indicato è stato eliminato dalla lista dei corrieri contattabili per la spedizione                            |
|     Step#      |                                                                     Descrizione                                                                     |
|       1        | L’utente avvia l’interazione con il sistema chiedendo di poter eliminare un certo corriere dalla lista dei corrieri contattabili per la spedizione. |
|       2        |                               Il sistema reagisce e chiede all’utente di inserire il nome del corriere da rimuovere.                                |
|       3        |                                                    L’utente inserisce le informazioni richieste.                                                    |
|       4        |                                             Il sistema valida le informazioni ed elimina tale corriere.                                             |


### Use case 8, Gestione delle recensioni (UC8)

| Actors Involved  | Utente                                   |
| :--------------: | :-----------------------------------------------: |
|   Precondition   | L'utente Customer deve aver pagato il prodotto che vuole recensire, l'utente Customer che vuole cancellare la recensione dev'essere l'autore di tale recensione, l'utente Customer che vuole modificare la recensione dev'essere l'autore di tale recensione, solo un utente autenticato può accedere a questa funzione |
|  Post condition  | E’ stata inserita una nuova recensione per il prodotto indicato, è stata cancellata una recensione per il prodotto indicato, è stata modificata una recensione per il prodotto indicato, sono state ritornate tutte le recensioni del concetto di prodotto indicato      |
| Nominal Scenario | Scenario 8.1, 8.2, 8.3, 8.4                 |
|     Variants     |                                                  |
|    Exceptions    |                                              |


##### Scenario 8.1

|  Scenario 8.1  | Inserimento di una recensione per un certo prodotto                                                           |
| :------------: | :--------------------------------------------------------------------------------------------------------------------------: |
|  Precondition  | L'utente Customer deve aver pagato il prodotto che vuole recensire |
| Post condition | E’ stata inserita una nuova recensione per il prodotto indicato                                          |
|     Step#      | Descrizione                                                          |
|       1        | L’utente Customer avvia l’interazione con il sistema chiedendo di poter recensire un certo prodotto che ha pagato.                      |
|       2        | Il sistema reagisce e chiede all’utente Customer di inserire le informazioni necessarie per la creazione di una nuova recensione per quel prodotto: codice del prodotto, categoria, testo della recensione e voto (il voto dev'essere un numero compreso tra 0 e 5). |  
|       3        | L’utente Customer inserisce le informazioni richieste.                              |
|       4        | Il sistema valida le informazioni e chiede l'approvazione dell'utente Technical User. |
|       5        | L'utente Technical User approva le informazioni proposte dall'utente Manager. |
|       6        | Il sistema crea la nuova recensione per il prodotto indicato, aggiorna il numero totale di recensioni e la somma dei voti delle recensioni del concetto di prodotto a cui questo prodotto è associato e salva le informazioni. |


##### Scenario 8.2

|  Scenario 8.2  | Cancellazione di una recensione per un certo prodotto                                                  |
| :------------: | :--------------------------------------------------------------------------------------------------------------------------: |
|  Precondition  | L'utente Customer che vuole cancellare la recensione dev'essere l'autore di tale recensione                                   |
| Post condition | E’ stata cancellata una recensione per il prodotto indicato                                                 |
|     Step#      | Descrizione                                                          |
|       1        | L’utente Customer avvia l’interazione con il sistema chiedendo di poter eliminare una recensione di un certo prodotto.                      |
|       2        | Il sistema reagisce, elimina tale recensione e aggiorna il numero totale di recensioni e la somma dei voti delle recensioni del concetto di prodotto a cui questo prodotto è associato. |  



##### Scenario 8.3

|  Scenario 8.3  | Modifica di una recensione per un certo prodotto                                                |
| :------------: | :--------------------------------------------------------------------------------------------------------------------------: |
|  Precondition  | L'utente Customer che vuole modificare la recensione dev'essere l'autore di tale recensione                                     |
| Post condition | E’ stata modificata una recensione per il prodotto indicato                                                  |
|     Step#      | Descrizione                                                          |
|       1        | L’utente Customer avvia l’interazione con il sistema chiedendo di poter modificare una recensione per un certo prodotto.                      |
|       2        | Il sistema reagisce e chiede all’utente Customer di inserire le informazioni necessarie per la modifica di una recensione per quel prodotto: testo della recensione e voto (il voto dev'essere un numero compreso tra 0 e 5). |  
|       3        | L’utente Customer inserisce le informazioni richieste.                              |
|       4        | Il sistema valida le informazioni e chiede l'approvazione dell'utente Technical User. |
|       5        | L'utente Technical User approva le informazioni proposte dall'utente Manager. |
|       6        | Il sistema modifica la recensione per il prodotto indicato, aggiorna il numero totale di recensioni e la somma dei voti delle recensioni del concetto di prodotto a cui questo prodotto è associato e salva le informazioni. |


##### Scenario 8.4

|  Scenario 8.4  | Recupero di tutte le recensioni di un certo concetto di prodotto                                                 |
| :------------: | :--------------------------------------------------------------------------------------------------------------------------: |
|  Precondition  | Solo un utente autenticato può accedere a questa funzione                                 |
| Post condition | Sono state ritornate tutte le recensioni del concetto di prodotto indicato                                                 |
|     Step#      | Descrizione                                                          |
|       1        | L’utente avvia l’interazione con il sistema chiedendo di poter avere l’elenco di tutte le recensioni di un certo concetto di prodotto.      |
|       2        | Il sistema ritorna tutte le recensioni di un certo concetto di prodotto ordinate per voto decrescente e le informazioni che le descrivono: testo della recensione, voto e autore (username dell'utente Customer). |




# Glossary

* Profile
    * Customer: utente che acquista prodotti presso EZElectronics. 
    * Manager: proprietario di un negozio di elettronica, può vedere l'elenco dei suoi prodotti, aggiungerne di nuovi nel catalogo di EZElectronics, confermare gli acquisti e modificare o rimuovere i prodotti da lui inseriti
    * Technical User: Utenza tecnica che ha ruolo di amministratore. Può aggiungere e rimuovere categorie, controllare gli utenti registrati e assegnare il ruolo di manager ad un utente. Può inoltre modificare o eliminare i prodotti e confermare gli acquisti
* Product
    * Singolo oggetto presente nel magazzino (ad esempio, due telefoni dello stesso modello sono considerati due Prodotti diversi). Ogni Prodotto è identificato da un codice univoco di almeno sei caratteri (Code)
    * Serial Number: numero seriale del Prodotto. Può venir usato per motivi di garanzia
    * L’associazione "Manages" tra Manager e Product permette di tenere traccia di quali prodotti siano stati inseriti da un determinato Manager e, quindi, di abilitare la modifica e cancellazione di un prodotto specifico solo se esse vengono richieste dal Manager che lo ha inserito
* Product Information
    * Ogni Prodotto presente nel magazzino è correlato ad una e una sola istanza di Product Information che ne identifica il Modello, i Dettagli, il Prezzo di vendita e la Categoria. Un manager può associare un Prodotto soltanto ad una istanza di Product Information creata da lui
    * P_Id rappresenta un codice numerico che identifica univocamente un'istanza della classe Product Information
    * Il Modello è univoco all'interno di uno store, un esempio di Modello è "iPhone 13 Pro, Black, 512GB"
    * Ogni Modello può avere più immagini. Viene salvato l’URI di tali immagini
    * Ogni manager può creare una nuova istanza di Product Information o modificarne una esistente. Tuttavia, per evitare che un Manager inserisca prodotti non correlati all'elettronica, ogni operazione deve essere prima approvata dal Technical User 
    * Viene salvato il numero di prodotti attualmente disponibili per quel modello. Questa informazione è usata per far sì che più prodotti dello stesso modello possano venir aggiunte al carrello.  
    Quando più prodotti dello stesso modello vengono aggiunti al carrello, in quest'ultimo vengono salvate le singole istanze della classe Product, così che queste possano essere contrassegnate come vendute quando si procede all'acquisto
    * L’associazione "Manages" tra Manager e Product Information permette di tenere traccia di quali prodotti siano stati inseriti da un determinato Manager e, quindi, di abilitare la modifica e cancellazione di una specifica istanza di Product Information solo se esse vengono richieste dal Manager che la ha inserita
    * Si è scelto di distinguere tra Product e Product Information così da non avere duplicazione dei dati tra diversi prodotti dello stesso modello
* Cart
    * Insieme di Prodotti che l’utente ha salvato per l’acquisto
* History
    * Insieme di Carrelli che sono stati acquistati dall'utente (Cart con Paid = true)
* Courier
    * Vengono salvate le informazioni dei corrieri a cui si può appoggiare EZElectronics.
    * Una volta che viene creato un'ordine, vengono interrogati i corrieri a disposizione.  
    Si passano come parametri il peso del collo e l'indirizzo di spedizione. Ci si aspetta di ricevere come risposta la data stimata di presa in carico, quella di consegna e il costo della prestazione.  
    Si propongono successivamente all'utente tre opzioni di spedizione con i relativi costi, una più veloce ma a costo maggiore, una più lenta a costo minore e una intermedia. L’utente sceglie l’opzione che preferisce e procede al pagamento.  
    Per scegliere quali opzioni visualizzare, si scelgono quelle con il miglior prodotto tempo di spedizione*prezzo  
    La rotta da contattare per le API dei corrieri viene salvata come attributo della tabella Courier (APIRoute)
* Payment
    * La gestione dei pagamenti viene affidata ad un servizio esterno. Vengono salvati l’ID della transazione e la data in cui è stata effettuata  
* Review
    * Ogni utente di tipo Customer può scrivere una recensione relativa ad uno o più prodotti che ha acquistato. Le recensioni sono rappresentate dalla classe Review
    * Una Review può essere associata solo a Carrelli che sono stati acquistati (Paid = true)
  
  
  
![glossary](./assets/glossary-v2.png)

# System Design

![system design](./assets/system_design-v2.png)

# Deployment Diagram

![deployment diagram](./assets/deployment_diagram-v2.png)
