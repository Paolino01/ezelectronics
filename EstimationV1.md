# Project Estimation - CURRENT
Date: 04/05/2024

Version: 1.0.1 - Fixed Summary


# Estimation approach
Consider the EZElectronics  project in CURRENT version (as given by the teachers), assume that you are going to develop the project INDEPENDENT of the deadlines of the course, and from scratch
# Estimate by size
### 
|                                                                                                         | Estimate |
| ------------------------------------------------------------------------------------------------------- | -------- |
| NC =  Estimated number of classes to be developed                                                       | 4        |
| A = Estimated average size per class, in LOC                                                            | 250      |
| S = Estimated size of project, in LOC (= NC * A)                                                        | 1000     |
| E = Estimated effort, in person hours (here use productivity 10 LOC per person hour)                    | 100      |
| C = Estimated cost, in euro (here use 1 person hour cost = 30 euro)                                     | 3000     |
| Estimated calendar time, in calendar weeks (Assume team of 4 people, 8 hours per day, 5 days per week ) | 1        |

# Estimate by product decomposition
### 
| component name       | Estimated effort (person hours) |
| -------------------- | ------------------------------- |
| requirement document | 82                              |
| GUI prototype        | 50                              |
| design document      | 8                               |
| code                 | 176                             |
| unit tests           | 90                              |
| api tests            | 15                              |
| management documents | 10                              |

# Estimate by activity decomposition
### 

| Activity name                                         | Estimated effort (person hours) |
| ----------------------------------------------------- | ------------------------------- |
| Definizione dei requisiti                             | 8                               |
| Analisi del sistema già esistente                     | 4                               |
| Analisi del lavoro da effettuare                      | 4                               |
| Modellazione dei processi                             | 6                               |
| Identificazione dei requisiti utente                  | 8                               |
| Identificazione dei requisiti di performance          | 4                               |
| Definizione degli use case principali                 | 12                              |
| Definizione delle classi da implementare mediante UML | 8                               |
| Definizione del design del sistema                    | 4                               |
| Definizione del deployment diagram                    | 2                               |
| Scrittura documento dei requisiti                     | 8                               |
| Review documento dei requisiti                        | 4                               |
| API design                                            | 10                              |
| Analisi della GUI da realizzare                       | 10                              |
| Definizione GUI tramite wiremock                      | 40                              |
| Scrittura design document                             | 8                               |
| Implementazione Frontend a partire da wiremock        | 88                              |
| Implementazione Backend                               | 80                              |
| Analisi database da realizzare                        | 4                               |
| Implementazione database                              | 4                               |
| Unit test Frontend                                    | 50                              |
| Unit test Backend                                     | 40                              |
|                                                       | 5                               |
| Realizzazione test API                                | 10                              |
| Definizione management document                       | 5                               |
| Scrittura management document                         | 5                               |
###
![Gantt Chart](./assets/gantt-v1.png)

# Summary

Report here the results of the three estimation approaches. The estimates may differ. Discuss here the possible reasons for the difference

|                                    | Estimated effort | Estimated duration |
| ---------------------------------- | ---------------- | ------------------ |
| estimate by size                   | 100              | ~1 week            |
| estimate by product decomposition  | 421              | ~3 weeks           |
| estimate by activity decomposition | 421              | ~3 weeks           |
  
Le stime di effort e durata sono diverse siccome ci sono 4 impiegati che lavorano 8 ore al giorno e 5 giorni a settimana. Quindi, in una settimana si hanno 160 person hours, perciò, ci vogliono diversi giorni di calendario per completare il progetto
  
La stima per size è molto minore rispetto alle altre due siccome nella prima si stima il lavoro soltanto rispetto alle linee di codice (LOC) e non viene contata l'analisi dei requisiti



